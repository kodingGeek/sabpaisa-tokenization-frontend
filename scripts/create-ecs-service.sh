#!/bin/bash

# Create ECS Service for Frontend
set -e

echo "🚀 Creating ECS Service for Frontend"
echo "===================================="

# Variables
AWS_REGION="ap-south-1"
ECS_CLUSTER="sabpaisa-tokenization-cluster"
ECS_SERVICE="sabpaisa-tokenization-frontend"
TASK_DEFINITION="sabpaisa-tokenization-frontend"
ALB_NAME="sabpaisa-tokenization-alb"

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account: $ACCOUNT_ID"

# 1. Get VPC and Subnets
echo ""
echo "1. Getting VPC and Subnet information..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=sabpaisa-tokenization-vpc" --query 'Vpcs[0].VpcId' --output text 2>/dev/null)

if [ -z "$VPC_ID" ] || [ "$VPC_ID" == "None" ]; then
    echo "Using default VPC..."
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
fi

echo "VPC ID: $VPC_ID"

# Get private subnets (or public if private don't exist)
SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$VPC_ID" \
    --query 'Subnets[?MapPublicIpOnLaunch==`false`].SubnetId' \
    --output text)

if [ -z "$SUBNETS" ]; then
    echo "No private subnets found, using public subnets..."
    SUBNETS=$(aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --query 'Subnets[?MapPublicIpOnLaunch==`true`].SubnetId' \
        --output text | head -2)
fi

SUBNET_1=$(echo $SUBNETS | cut -d' ' -f1)
SUBNET_2=$(echo $SUBNETS | cut -d' ' -f2)

echo "Subnet 1: $SUBNET_1"
echo "Subnet 2: $SUBNET_2"

# 2. Create Security Group for Frontend
echo ""
echo "2. Creating Security Group..."
SG_NAME="sabpaisa-frontend-sg"

# Check if security group exists
SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null)

if [ -z "$SG_ID" ] || [ "$SG_ID" == "None" ]; then
    echo "Creating new security group..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name $SG_NAME \
        --description "Security group for SabPaisa frontend ECS tasks" \
        --vpc-id $VPC_ID \
        --output text)
    
    # Allow HTTP from ALB
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 80 \
        --source-group $SG_ID
    
    # Allow all outbound
    aws ec2 authorize-security-group-egress \
        --group-id $SG_ID \
        --protocol -1 \
        --cidr 0.0.0.0/0 2>/dev/null || true
else
    echo "Security group already exists"
fi

echo "Security Group ID: $SG_ID"

# 3. Create Target Group
echo ""
echo "3. Creating Target Group..."
TG_NAME="sabpaisa-frontend-tg"

# Check if target group exists
TG_ARN=$(aws elbv2 describe-target-groups \
    --names $TG_NAME \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text 2>/dev/null)

if [ -z "$TG_ARN" ] || [ "$TG_ARN" == "None" ]; then
    echo "Creating new target group..."
    TG_ARN=$(aws elbv2 create-target-group \
        --name $TG_NAME \
        --protocol HTTP \
        --port 80 \
        --vpc-id $VPC_ID \
        --target-type ip \
        --health-check-protocol HTTP \
        --health-check-path / \
        --health-check-interval-seconds 30 \
        --health-check-timeout-seconds 5 \
        --healthy-threshold-count 2 \
        --unhealthy-threshold-count 3 \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)
else
    echo "Target group already exists"
fi

echo "Target Group ARN: $TG_ARN"

# 4. Add listener rule to ALB
echo ""
echo "4. Configuring ALB listener..."

# Get ALB ARN
ALB_ARN=$(aws elbv2 describe-load-balancers \
    --names $ALB_NAME \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text 2>/dev/null)

if [ ! -z "$ALB_ARN" ] && [ "$ALB_ARN" != "None" ]; then
    # Get listener ARN
    LISTENER_ARN=$(aws elbv2 describe-listeners \
        --load-balancer-arn $ALB_ARN \
        --query 'Listeners[?Port==`80`].ListenerArn' \
        --output text | head -1)
    
    if [ ! -z "$LISTENER_ARN" ] && [ "$LISTENER_ARN" != "None" ]; then
        # Check if rule already exists
        RULE_EXISTS=$(aws elbv2 describe-rules \
            --listener-arn $LISTENER_ARN \
            --query 'Rules[?Priority!=`default`].Priority' \
            --output text | grep -w "1" || echo "")
        
        if [ -z "$RULE_EXISTS" ]; then
            echo "Creating listener rule for frontend..."
            aws elbv2 create-rule \
                --listener-arn $LISTENER_ARN \
                --priority 1 \
                --conditions Field=path-pattern,Values='/*' \
                --actions Type=forward,TargetGroupArn=$TG_ARN
        else
            echo "Updating existing listener rule..."
            # Get rule ARN
            RULE_ARN=$(aws elbv2 describe-rules \
                --listener-arn $LISTENER_ARN \
                --query 'Rules[?Priority==`1`].RuleArn' \
                --output text)
            
            # Update the rule to point to frontend target group
            aws elbv2 modify-rule \
                --rule-arn $RULE_ARN \
                --actions Type=forward,TargetGroupArn=$TG_ARN
        fi
    else
        echo "No HTTP listener found on ALB"
    fi
else
    echo "ALB not found"
fi

# 5. Create ECS Service
echo ""
echo "5. Creating ECS Service..."

# Create service
aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $TASK_DEFINITION \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=$TG_ARN,containerName=frontend,containerPort=80" \
    --region $AWS_REGION

echo ""
echo "✅ ECS Service created successfully!"
echo ""
echo "Service Details:"
echo "- Cluster: $ECS_CLUSTER"
echo "- Service: $ECS_SERVICE"
echo "- Task Definition: $TASK_DEFINITION"
echo "- Target Group: $TG_NAME"
echo ""
echo "🌐 Frontend will be available at:"
echo "http://$ALB_NAME-*.ap-south-1.elb.amazonaws.com"
echo ""
echo "⏳ Please wait 2-3 minutes for the service to start and pass health checks."
echo ""
echo "You can monitor the deployment progress in the AWS ECS console:"
echo "https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER/services/$ECS_SERVICE/tasks"