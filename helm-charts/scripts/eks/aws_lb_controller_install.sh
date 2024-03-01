#!/bin/bash

set -e

DIR="$(dirname $(readlink -f $0))"

EKS_CLUSTER_NAME=${EKS_CLUSTER_NAME:-privacypal-qa}
AWS_REGION=${AWS_REGION:-"ca-central-1"}

# Create the IAM policy for the Load balancing controller
# If you view the policy in the AWS Management Console, the console shows warnings for the ELB service, but not for the ELB v2 service.
# This happens because some of the actions in the policy exist for ELB v2, but not for ELB. You can ignore the warnings for ELB.
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://$DIR/aws_lb_controller_iam_policy.json

ALB_CONTROLLER_IAM_POLICY_ARN="$(aws iam list-policies --query 'Policies[?PolicyName==`AWSLoadBalancerControllerIAMPolicy`].Arn' --output text)"

# Create an IAM role with the above policy attached and a service account in namespace kube-system
# for the AWS Load Balancing Controller
eksctl create iamserviceaccount \
  --cluster=$EKS_CLUSTER_NAME \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=$ALB_CONTROLLER_IAM_POLICY_ARN \
  --approve

# Install the AWS Load Balancing Controller via Helm chart
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$EKS_CLUSTER_NAME \
  --set region=$AWS_REGION \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
