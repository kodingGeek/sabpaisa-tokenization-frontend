#!/bin/bash

# Manual Frontend Deployment Script
set -e

echo "🚀 Manual Frontend Deployment"
echo "============================"

# Variables
AWS_REGION="ap-south-1"
ECS_CLUSTER="sabpaisa-tokenization-cluster"
ECS_SERVICE="sabpaisa-tokenization-frontend"
TASK_FAMILY="sabpaisa-tokenization-frontend"

# Get latest task definition revision
TASK_DEF_REV=$(aws ecs describe-task-definition \
  --task-definition $TASK_FAMILY \
  --region $AWS_REGION \
  --query 'taskDefinition.revision' \
  --output text 2>/dev/null || echo "0")

if [ "$TASK_DEF_REV" == "0" ]; then
  echo "❌ No task definition found!"
  echo "Please run the GitHub Actions workflow first to create the task definition."
  exit 1
fi

echo "Found task definition: $TASK_FAMILY:$TASK_DEF_REV"

# Get infrastructure info
echo ""
echo "🔍 Checking infrastructure..."

# Get ALB
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names sabpaisa-tokenization-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text 2>/dev/null || echo "None")

echo "ALB DNS: $ALB_DNS"

# Get VPC
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query 'Vpcs[0].VpcId' \
  --output text)

echo "VPC ID: $VPC_ID"

# Get subnets
SUBNETS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[?AvailabilityZone!=`null`].[SubnetId,AvailabilityZone]' \
  --output text | head -4)

echo "Available Subnets:"
echo "$SUBNETS"

# Select subnets
SUBNET_1=$(echo "$SUBNETS" | head -1 | cut -f1)
SUBNET_2=$(echo "$SUBNETS" | tail -1 | cut -f1)

echo ""
echo "Selected Subnets: $SUBNET_1, $SUBNET_2"

# Create security group
echo ""
echo "🔒 Creating security group..."
SG_NAME="frontend-manual-$(date +%s)"
SG_ID=$(aws ec2 create-security-group \
  --group-name $SG_NAME \
  --description "Frontend manual deployment" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

echo "Security Group: $SG_ID"

# Create target group
echo ""
echo "🎯 Creating target group..."
TG_NAME="frontend-manual-$(date +%s | tail -c 8)"
TG_ARN=$(aws elbv2 create-target-group \
  --name $TG_NAME \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path / \
  --matcher "HttpCode=200,304,404" \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

echo "Target Group: $TG_ARN"

# Get ALB listener
if [ "$ALB_DNS" != "None" ]; then
  ALB_ARN=$(aws elbv2 describe-load-balancers \
    --names sabpaisa-tokenization-alb \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)
  
  LISTENER_ARN=$(aws elbv2 describe-listeners \
    --load-balancer-arn $ALB_ARN \
    --query 'Listeners[?Port==`80`].ListenerArn' \
    --output text | head -1)
  
  if [ ! -z "$LISTENER_ARN" ]; then
    echo "Updating ALB listener..."
    aws elbv2 modify-listener \
      --listener-arn $LISTENER_ARN \
      --default-actions Type=forward,TargetGroupArn=$TG_ARN
  fi
fi

# Create ECS service
echo ""
echo "🚀 Creating ECS service..."

# First delete if exists
aws ecs delete-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force 2>/dev/null || true

sleep 5

# Create service
aws ecs create-service \
  --cluster $ECS_CLUSTER \
  --service-name $ECS_SERVICE \
  --task-definition $TASK_FAMILY:$TASK_DEF_REV \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[$SUBNET_1,$SUBNET_2],
    securityGroups=[$SG_ID],
    assignPublicIp=ENABLED
  }" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=frontend,containerPort=80"

echo ""
echo "✅ Service created successfully!"
echo ""
echo "📊 Deployment Info:"
echo "=================="
echo "Service: $ECS_SERVICE"
echo "Cluster: $ECS_CLUSTER"
echo "Task Definition: $TASK_FAMILY:$TASK_DEF_REV"
echo "Target Group: $TG_NAME"
echo "Security Group: $SG_NAME"
echo ""

if [ "$ALB_DNS" != "None" ]; then
  echo "🌐 Frontend URL: http://$ALB_DNS"
else
  echo "⚠️  No ALB found. Frontend won't be accessible via load balancer."
fi

echo ""
echo "Monitor deployment:"
echo "https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER/services/$ECS_SERVICE/tasks"

echo ""
echo "⏳ Service is starting. It may take 2-3 minutes to become healthy."