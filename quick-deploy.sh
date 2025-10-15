#!/bin/bash

echo "🚀 Quick Frontend Deployment"
echo "=========================="

# Check if task definition exists
TASK_REV=$(aws ecs describe-task-definition \
  --task-definition sabpaisa-tokenization-frontend \
  --query 'taskDefinition.revision' \
  --output text 2>/dev/null || echo "0")

if [ "$TASK_REV" == "0" ]; then
  echo "❌ No task definition found. Please run the GitHub Actions workflow first."
  exit 1
fi

echo "✅ Found task definition revision: $TASK_REV"

# Get VPC
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
echo "VPC: $VPC_ID"

# Get subnets
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text)
SUBNET_1=$(echo $SUBNETS | cut -d' ' -f1)
SUBNET_2=$(echo $SUBNETS | cut -d' ' -f2)
echo "Subnets: $SUBNET_1, $SUBNET_2"

# Create unique resources
TIMESTAMP=$(date +%s)

# Create Security Group
echo ""
echo "Creating security group..."
SG_ID=$(aws ec2 create-security-group \
  --group-name "frontend-quick-$TIMESTAMP" \
  --description "Frontend Quick Deploy" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0

# Create Target Group (simple, no matcher)
echo "Creating target group..."
TG_NAME="fe-quick-${TIMESTAMP: -8}"
TG_ARN=$(aws elbv2 create-target-group \
  --name $TG_NAME \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Get ALB and update listener
ALB_ARN=$(aws elbv2 describe-load-balancers --names sabpaisa-tokenization-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null)
if [ ! -z "$ALB_ARN" ] && [ "$ALB_ARN" != "None" ]; then
  LISTENER_ARN=$(aws elbv2 describe-listeners --load-balancer-arn $ALB_ARN --query 'Listeners[0].ListenerArn' --output text)
  aws elbv2 modify-listener --listener-arn $LISTENER_ARN --default-actions Type=forward,TargetGroupArn=$TG_ARN
fi

# Delete old service
echo "Cleaning up old service..."
aws ecs delete-service --cluster sabpaisa-tokenization-cluster --service sabpaisa-tokenization-frontend --force 2>/dev/null || true
sleep 5

# Create service
echo "Creating ECS service..."
aws ecs create-service \
  --cluster sabpaisa-tokenization-cluster \
  --service-name sabpaisa-tokenization-frontend \
  --task-definition sabpaisa-tokenization-frontend:$TASK_REV \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=frontend,containerPort=80"

echo ""
echo "✅ Service created!"
echo ""
echo "Frontend URL: http://sabpaisa-tokenization-alb-685117879.ap-south-1.elb.amazonaws.com"
echo ""
echo "Wait 2-3 minutes for the service to start."