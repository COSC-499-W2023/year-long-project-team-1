#!/bin/bash

# See README.md for requirements

if [ -z "$AWS_SERVICE" ]; then
  echo "Missing AWS_SERVICE. Please specify AWS_SERVICE to identify which ack controller to install."
  echo "For example, AWS_SERVICE=s3"
  exit 1
fi

# ================================================================================
# Utilities
# ================================================================================

log() {
  printf "$1\n"
}

# ================================================================================
# AWS Account Configs
# ================================================================================

export AWS_REGION=ca-central-1
export AWS_PROFILE=${AWS_PROFILE:-privacypal}

log "Profile: $AWS_PROFILE"
log "Region: $AWS_REGION"
log "Service: $AWS_SERVICE"

# ================================================================================
# Cluster information
# ================================================================================

EKS_CLUSTER_NAME=${EKS_CLUSTER_NAME:-privacypal-qa}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

ACK_K8S_NAMESPACE=ack-system
ACK_K8S_SERVICE_ACCOUNT_NAME=ack-$AWS_SERVICE-controller

log "Account ID: $AWS_ACCOUNT_ID"
log "OIDC Provider: $OIDC_PROVIDER"
log "Cluster: $EKS_CLUSTER_NAME"
log "ACK namespace: $ACK_K8S_NAMESPACE"

# ================================================================================
# Create an IAM OIDC provider for the EKS cluster
# ================================================================================

eksctl utils associate-iam-oidc-provider --cluster $EKS_CLUSTER_NAME --region $AWS_REGION --approve
OIDC_PROVIDER=$(aws eks describe-cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION --query "cluster.identity.oidc.issuer" --output text | sed -e "s/^https:\/\///")

# ================================================================================
# Create the IRSA role for the ACK Controller SA with a trust policy for 
# the cluster OIDC and SA
# ================================================================================

cat <<EOF > trust.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:sub": "system:serviceaccount:${ACK_K8S_NAMESPACE}:${ACK_K8S_SERVICE_ACCOUNT_NAME}"
        }
      }
    }
  ]
}
EOF

ACK_CONTROLLER_IAM_ROLE="ack-${AWS_SERVICE}-controller"
ACK_CONTROLLER_IAM_ROLE_DESCRIPTION="IRSA role for ACK ${AWS_SERVICE} controller deployment on EKS cluster using Helm charts"

aws iam create-role --role-name "${ACK_CONTROLLER_IAM_ROLE}" \
  --assume-role-policy-document file://trust.json --description "${ACK_CONTROLLER_IAM_ROLE_DESCRIPTION}" > /dev/null

ACK_CONTROLLER_IAM_ROLE_ARN=$(aws iam get-role --role-name=$ACK_CONTROLLER_IAM_ROLE --query Role.Arn --output text)

log "Created Role ARN: $ACK_CONTROLLER_IAM_ROLE_ARN"

# ================================================================================
# Download the recommended managed and inline policies and apply them to the
# newly created IRSA role
# ================================================================================

BASE_URL=https://raw.githubusercontent.com/aws-controllers-k8s/${AWS_SERVICE}-controller/main
POLICY_ARN_URL=${BASE_URL}/config/iam/recommended-policy-arn
POLICY_ARN_STRINGS="$(wget -qO- ${POLICY_ARN_URL})"

INLINE_POLICY_URL=${BASE_URL}/config/iam/recommended-inline-policy
INLINE_POLICY="$(wget -qO- ${INLINE_POLICY_URL})"

while IFS= read -r POLICY_ARN; do
    echo -n "Attaching $POLICY_ARN ... "
    aws iam attach-role-policy \
        --role-name "${ACK_CONTROLLER_IAM_ROLE}" \
        --policy-arn "${POLICY_ARN}"
    echo "ok."
done <<< "$POLICY_ARN_STRINGS"

if [ ! -z "$INLINE_POLICY" ]; then
    echo -n "Putting inline policy ... "
    aws iam put-role-policy \
        --role-name "${ACK_CONTROLLER_IAM_ROLE}" \
        --policy-name "ack-recommended-policy" \
        --policy-document "$INLINE_POLICY"
    echo "ok."
fi

IRSA_ROLE_ARN=eks.amazonaws.com/role-arn=$ACK_CONTROLLER_IAM_ROLE_ARN

log "$AWS_SERVICE SA IAM annotation: $IRSA_ROLE_ARN"

# ================================================================================
# Install the ACK Controller
# ================================================================================

RELEASE_VERSION=$(curl -sL https://api.github.com/repos/aws-controllers-k8s/${AWS_SERVICE}-controller/releases/latest | jq -r '.tag_name | ltrimstr("v")')

# Public ECR must be authenticated via us-east-1 region
aws ecr-public get-login-password --region us-east-1 | helm registry login --username AWS --password-stdin public.ecr.aws

helm install --create-namespace -n $ACK_K8S_NAMESPACE ack-$AWS_SERVICE-controller \
  oci://public.ecr.aws/aws-controllers-k8s/$AWS_SERVICE-chart --version=$RELEASE_VERSION --set=aws.region=$AWS_REGION

# ================================================================================
# Annotate the controller Service Account
# Restart controller pod to retrieve the projected JWT
# ================================================================================

KUBE_CLIENT=${KUBE_CLIENT:-kubectl}

$KUBE_CLIENT -n $ACK_K8S_NAMESPACE annotate serviceaccount $ACK_K8S_SERVICE_ACCOUNT_NAME $IRSA_ROLE_ARN

$KUBE_CLIENT -n $ACK_K8S_NAMESPACE rollout restart deployment/ack-$AWS_SERVICE-controller-$AWS_SERVICE-chart 
$KUBE_CLIENT -n $ACK_K8S_NAMESPACE rollout status -w deployment/ack-$AWS_SERVICE-controller-$AWS_SERVICE-chart --timeout 5m
