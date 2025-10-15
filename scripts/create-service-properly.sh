#!/bin/bash

# Robust ECS Service Creation Script
set -e

echo "🚀 Creating ECS Frontend Service with Proper ALB Configuration"
echo "==========================================================="

# Variables
AWS_REGION="ap-south-1"
ECS_CLUSTER="sabpaisa-tokenization-cluster"
ECS_SERVICE="sabpaisa-tokenization-frontend"
TASK_FAMILY="sabpaisa-tokenization-frontend"
TIMESTAMP=$(date +%s)

# Step 1: Get Infrastructure Info
echo "1️⃣ Getting infrastructure information..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)

# Get ALB info
ALB_INFO=$(aws elbv2 describe-load-balancers --names sabpaisa-tokenization-alb --query 'LoadBalancers[0]' 2>/dev/null || echo "{}")
ALB_ARN=$(echo $ALB_INFO | jq -r '.LoadBalancerArn // empty')
ALB_DNS=$(echo $ALB_INFO | jq -r '.DNSName // empty')
ALB_VPC=$(echo $ALB_INFO | jq -r '.VpcId // empty')

if [ -z "$ALB_ARN" ]; then
  echo "❌ ALB 'sabpaisa-tokenization-alb' not found!"
  echo "Looking for any available ALB..."
  ALB_INFO=$(aws elbv2 describe-load-balancers --query 'LoadBalancers[0]' 2>/dev/null || echo "{}")
  ALB_ARN=$(echo $ALB_INFO | jq -r '.LoadBalancerArn // empty')
  ALB_DNS=$(echo $ALB_INFO | jq -r '.DNSName // empty')
  ALB_VPC=$(echo $ALB_INFO | jq -r '.VpcId // empty')
fi

# Use ALB VPC if available, otherwise default VPC
if [ ! -z "$ALB_VPC" ]; then
  VPC_ID=$ALB_VPC
fi

echo "Account ID: $ACCOUNT_ID"
echo "VPC ID: $VPC_ID"
echo "ALB ARN: ${ALB_ARN:-Not found}"
echo "ALB DNS: ${ALB_DNS:-Not found}"

# Get subnets from the VPC
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output json | jq -r '.[]' | head -2)
SUBNET_1=$(echo "$SUBNETS" | head -1)
SUBNET_2=$(echo "$SUBNETS" | tail -1)

echo "Subnets: $SUBNET_1, $SUBNET_2"

# Step 2: Clean up old service
echo ""
echo "2️⃣ Cleaning up old service..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --desired-count 0 2>/dev/null || true
aws ecs delete-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force 2>/dev/null || true
sleep 5

# Step 3: Create Security Group
echo ""
echo "3️⃣ Creating security group..."
SG_NAME="frontend-sg-$TIMESTAMP"
SG_ID=$(aws ec2 create-security-group \
  --group-name $SG_NAME \
  --description "Frontend security group $TIMESTAMP" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0

echo "Security Group: $SG_ID"

# Step 4: Create Target Group
echo ""
echo "4️⃣ Creating target group..."
TG_NAME="fe-tg-${TIMESTAMP: -8}"
TG_ARN=$(aws elbv2 create-target-group \
  --name $TG_NAME \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

echo "Target Group: $TG_ARN"

# Step 5: Configure ALB Listener
if [ ! -z "$ALB_ARN" ]; then
  echo ""
  echo "5️⃣ Configuring ALB listener..."
  
  # Get HTTP listener
  LISTENER_ARN=$(aws elbv2 describe-listeners \
    --load-balancer-arn $ALB_ARN \
    --query 'Listeners[?Port==`80`].ListenerArn' \
    --output text | head -1)
  
  if [ -z "$LISTENER_ARN" ]; then
    echo "No HTTP listener found. Creating one..."
    LISTENER_ARN=$(aws elbv2 create-listener \
      --load-balancer-arn $ALB_ARN \
      --protocol HTTP \
      --port 80 \
      --default-actions Type=forward,TargetGroupArn=$TG_ARN \
      --query 'Listeners[0].ListenerArn' \
      --output text)
  else
    echo "Updating existing listener..."
    # First, try to add a rule
    PRIORITY=$((RANDOM % 50000 + 1))
    aws elbv2 create-rule \
      --listener-arn $LISTENER_ARN \
      --priority $PRIORITY \
      --conditions Field=path-pattern,Values="/*" \
      --actions Type=forward,TargetGroupArn=$TG_ARN 2>/dev/null || \
    # If rule creation fails, update default action
    aws elbv2 modify-listener \
      --listener-arn $LISTENER_ARN \
      --default-actions Type=forward,TargetGroupArn=$TG_ARN
  fi
  
  echo "Listener configured!"
fi

# Step 6: Create ECS Service
echo ""
echo "6️⃣ Creating ECS service..."

# Get latest task definition revision
TASK_REV=$(aws ecs describe-task-definition \
  --task-definition $TASK_FAMILY \
  --query 'taskDefinition.revision' \
  --output text)

echo "Using task definition: $TASK_FAMILY:$TASK_REV"

# Create service with load balancer if ALB exists
if [ ! -z "$ALB_ARN" ]; then
  echo "Creating service with load balancer..."
  aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $TASK_FAMILY:$TASK_REV \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "{
      \"awsvpcConfiguration\": {
        \"subnets\": [\"$SUBNET_1\", \"$SUBNET_2\"],
        \"securityGroups\": [\"$SG_ID\"],
        \"assignPublicIp\": \"ENABLED\"
      }
    }" \
    --load-balancers "[{
      \"targetGroupArn\": \"$TG_ARN\",
      \"containerName\": \"frontend\",
      \"containerPort\": 80
    }]" \
    --health-check-grace-period-seconds 120
else
  echo "Creating service without load balancer..."
  aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $TASK_FAMILY:$TASK_REV \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "{
      \"awsvpcConfiguration\": {
        \"subnets\": [\"$SUBNET_1\", \"$SUBNET_2\"],
        \"securityGroups\": [\"$SG_ID\"],
        \"assignPublicIp\": \"ENABLED\"
      }
    }"
fi

# Step 7: Summary
echo ""
echo "✅ Service created successfully!"
echo ""
echo "📊 Deployment Summary"
echo "===================="
echo "Cluster: $ECS_CLUSTER"
echo "Service: $ECS_SERVICE"
echo "Task Definition: $TASK_FAMILY:$TASK_REV"
echo "Security Group: $SG_NAME ($SG_ID)"
echo "Target Group: $TG_NAME"
echo ""

if [ ! -z "$ALB_DNS" ]; then
  echo "🌐 Frontend URL: http://$ALB_DNS"
else
  echo "⚠️  No ALB configured. Service is running but not accessible via load balancer."
  
  # Get task public IP if available
  echo "Waiting for task to start..."
  sleep 30
  
  TASK_ARN=$(aws ecs list-tasks --cluster $ECS_CLUSTER --service-name $ECS_SERVICE --query 'taskArns[0]' --output text 2>/dev/null)
  if [ ! -z "$TASK_ARN" ] && [ "$TASK_ARN" != "None" ]; then
    ENI_ID=$(aws ecs describe-tasks --cluster $ECS_CLUSTER --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text 2>/dev/null)
    if [ ! -z "$ENI_ID" ] && [ "$ENI_ID" != "None" ]; then
      PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text 2>/dev/null)
      if [ ! -z "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "None" ]; then
        echo "Task Public IP: http://$PUBLIC_IP"
      fi
    fi
  fi
fi

echo ""
echo "Monitor in AWS Console:"
echo "https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER/services/$ECS_SERVICE/tasks"
echo ""
echo "⏳ Service is starting. It may take 2-3 minutes to become healthy."