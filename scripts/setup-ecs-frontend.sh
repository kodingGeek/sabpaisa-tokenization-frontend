#!/bin/bash

# Setup ECS Frontend Resources
# This script creates the initial ECS task definition and service

set -e

# Variables
AWS_REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY="sabpaisa-tokenization-frontend"
ECS_CLUSTER="sabpaisa-tokenization-cluster"
ECS_SERVICE="sabpaisa-tokenization-frontend"
TASK_FAMILY="sabpaisa-tokenization-frontend"
LOG_GROUP="/ecs/sabpaisa-tokenization-frontend"

echo "🚀 Setting up ECS Frontend Resources"
echo "===================================="
echo "AWS Account: $ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

# 1. Create ECR repository if it doesn't exist
echo "1. Checking ECR repository..."
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null; then
    echo "Creating ECR repository..."
    aws ecr create-repository \
        --repository-name $ECR_REPOSITORY \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true
else
    echo "ECR repository already exists"
fi

# Get repository URI
REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY --query 'repositories[0].repositoryUri' --output text)
echo "Repository URI: $REPOSITORY_URI"

# 2. Create CloudWatch Log Group
echo ""
echo "2. Checking CloudWatch Log Group..."
if ! aws logs describe-log-groups --log-group-name-prefix $LOG_GROUP --region $AWS_REGION | grep -q $LOG_GROUP; then
    echo "Creating CloudWatch Log Group..."
    aws logs create-log-group --log-group-name $LOG_GROUP --region $AWS_REGION
else
    echo "Log group already exists"
fi

# 3. Create/Update IAM roles
echo ""
echo "3. Checking IAM roles..."

# Check if ecsTaskExecutionRole exists
if ! aws iam get-role --role-name ecsTaskExecutionRole 2>/dev/null; then
    echo "Creating ecsTaskExecutionRole..."
    aws iam create-role --role-name ecsTaskExecutionRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }'
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
else
    echo "ecsTaskExecutionRole already exists"
fi

# Check if ecsTaskRole exists
if ! aws iam get-role --role-name ecsTaskRole 2>/dev/null; then
    echo "Creating ecsTaskRole..."
    aws iam create-role --role-name ecsTaskRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }'
else
    echo "ecsTaskRole already exists"
fi

# 4. Register initial task definition
echo ""
echo "4. Registering ECS task definition..."

# Create task definition with account-specific values
cat > /tmp/task-definition.json <<EOF
{
  "family": "$TASK_FAMILY",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::$ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "$REPOSITORY_URI:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "REACT_APP_API_URL",
          "value": "http://localhost:8080/tokenization-backend"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "$LOG_GROUP",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/task-definition.json

# 5. Build and push initial Docker image
echo ""
echo "5. Building and pushing initial Docker image..."
echo "Please make sure Docker is running"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI

# Build and push
echo "Building Docker image..."
docker build -t $ECR_REPOSITORY:latest ..

echo "Tagging image..."
docker tag $ECR_REPOSITORY:latest $REPOSITORY_URI:latest

echo "Pushing image to ECR..."
docker push $REPOSITORY_URI:latest

# 6. Create ECS Service (if needed)
echo ""
echo "6. Checking ECS Service..."
if ! aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION 2>/dev/null | grep -q "serviceArn"; then
    echo ""
    echo "⚠️  ECS Service does not exist."
    echo "To create the service, you need to:"
    echo "1. Ensure the ECS cluster '$ECS_CLUSTER' exists"
    echo "2. Create a target group in your ALB"
    echo "3. Run the following command with appropriate subnet and security group IDs:"
    echo ""
    echo "aws ecs create-service \\"
    echo "  --cluster $ECS_CLUSTER \\"
    echo "  --service-name $ECS_SERVICE \\"
    echo "  --task-definition $TASK_FAMILY:1 \\"
    echo "  --desired-count 1 \\"
    echo "  --launch-type FARGATE \\"
    echo "  --network-configuration \"awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}\" \\"
    echo "  --load-balancers \"targetGroupArn=arn:aws:elasticloadbalancing:$AWS_REGION:$ACCOUNT_ID:targetgroup/xxx,containerName=frontend,containerPort=80\""
else
    echo "ECS Service already exists"
fi

# Cleanup
rm -f /tmp/task-definition.json

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. If the ECS service doesn't exist, create it using the command shown above"
echo "2. Update the GitHub Actions workflow to use the correct task definition name"
echo "3. Run the GitHub Actions workflow to deploy"
echo ""
echo "Task Definition ARN: arn:aws:ecs:$AWS_REGION:$ACCOUNT_ID:task-definition/$TASK_FAMILY:1"