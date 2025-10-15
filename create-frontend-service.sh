#!/bin/bash

echo "🚀 Quick ECS Service Creation Script"
echo "==================================="
echo ""
echo "This script will help you create the ECS service for the frontend."
echo "Please run the following commands based on your AWS infrastructure:"
echo ""

# Get current infrastructure details
echo "1. First, let's check your current infrastructure..."
echo "   Run these commands to get the required information:"
echo ""
echo "   # Get your subnets (you need 2)"
echo "   aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone,Tags[?Key==`Name`].Value]' --output table"
echo ""
echo "   # Get your security groups"
echo "   aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,VpcId]' --output table"
echo ""
echo "   # Check if you have an ALB target group"
echo "   aws elbv2 describe-target-groups --query 'TargetGroups[*].[TargetGroupName,TargetGroupArn,VpcId]' --output table"
echo ""

echo "2. Once you have the information, create the service:"
echo ""
echo "   # If you DON'T have a target group, create one first:"
echo "   aws elbv2 create-target-group \\"
echo "     --name sabpaisa-frontend-tg \\"
echo "     --protocol HTTP \\"
echo "     --port 80 \\"
echo "     --vpc-id <YOUR_VPC_ID> \\"
echo "     --target-type ip \\"
echo "     --health-check-path /"
echo ""
echo "   # Then create the ECS service:"
echo "   aws ecs create-service \\"
echo "     --cluster sabpaisa-tokenization-cluster \\"
echo "     --service-name sabpaisa-tokenization-frontend \\"
echo "     --task-definition sabpaisa-tokenization-frontend \\"
echo "     --desired-count 1 \\"
echo "     --launch-type FARGATE \\"
echo "     --network-configuration \"awsvpcConfiguration={subnets=[<SUBNET_1>,<SUBNET_2>],securityGroups=[<SECURITY_GROUP>],assignPublicIp=ENABLED}\" \\"
echo "     --load-balancers \"targetGroupArn=<TARGET_GROUP_ARN>,containerName=frontend,containerPort=80\""
echo ""

echo "3. Example with placeholder values (REPLACE THESE):"
echo ""
cat << 'EOF'
# Example command (DO NOT RUN AS-IS - Replace the values):
aws ecs create-service \
  --cluster sabpaisa-tokenization-cluster \
  --service-name sabpaisa-tokenization-frontend \
  --task-definition sabpaisa-tokenization-frontend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789abcdef0,subnet-0123456789abcdef1],securityGroups=[sg-0123456789abcdef0],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:893445410174:targetgroup/sabpaisa-frontend-tg/1234567890abcdef,containerName=frontend,containerPort=80"
EOF

echo ""
echo "4. After creating the service:"
echo "   - Wait 2-3 minutes for tasks to start"
echo "   - Check ECS console for task status"
echo "   - Access frontend at: http://sabpaisa-tokenization-alb-685117879.ap-south-1.elb.amazonaws.com"
echo ""
echo "Need help? Check the AWS ECS console:"
echo "https://console.aws.amazon.com/ecs/home?region=ap-south-1#/clusters/sabpaisa-tokenization-cluster/services"