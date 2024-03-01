#!/bin/bash

set -e

VERBOSE=${VERBOSE:-false}
if [ "$VERBOSE" = "true" ]; then
	set -x
fi

CLUSTER_CLIENT=${CLUSTER_CLIENT:-kubectl}
DIR="$(dirname $(readlink -f $0))"


CLUSTER_NAME=

log_cluster_info() {
	# Check if the specified kube client is available
	if ! command -v $CLUSTER_CLIENT > /dev/null 2>&1; then
		echo "Kube client $CLUSTER_CLIENT is not available. Try installing kubectl/oc."
		exit 1
	fi

	echo "Using kube client: $CLUSTER_CLIENT"

	# Check if kube client is configured with a context
	if ! $CLUSTER_CLIENT config current-context >/dev/null 2>&1; then
		echo "No active context is in use. Try $CLUSTER_CLIENT config use-context <context-name> to select a context."
		echo "Available contexts: $(echo $($CLUSTER_CLIENT config get-contexts -o name) | sed -e 's/ /, /g')"
		exit 1
	fi

	local CONTEXT_NAME="$($CLUSTER_CLIENT config current-context)"
	echo "Using context: $CONTEXT_NAME"

	local USER="$($CLUSTER_CLIENT config view --minify -o=jsonpath="{.contexts[?(@.name == \"$CONTEXT_NAME\")].context.user}")"
	CLUSTER_NAME="$($CLUSTER_CLIENT config view --minify -o=jsonpath="{.contexts[?(@.name == \"$CONTEXT_NAME\")].context.cluster}")"
	local SERVER_URL="$($CLUSTER_CLIENT config view --minify -o=jsonpath="{.clusters[?(@.name == \"$CLUSTER_NAME\")].cluster.server}")"
	local NAMESPACE="$($CLUSTER_CLIENT config view --minify -o=jsonpath="{.contexts[?(@.name == \"$CONTEXT_NAME\")].context.namespace}")"
	
	printf "With cluster:\n\tname: $CLUSTER_NAME\n\turl: $SERVER_URL\n"
	printf "With user: $USER\n"
	printf "With namespace: ${NAMESPACE:-default}\n"
}

get_cluster_vpc() {
	local short_name=$(echo $CLUSTER_NAME | cut -f1 -d".")
	aws eks describe-cluster \
		--name $short_name \
		--query "cluster.resourcesVpcConfig.vpcId" \
		--output text
}

get_vpc_subnets() {
	aws ec2 describe-subnets \
		--filters "Name=vpc-id,Values=$(get_cluster_vpc)" \
		--query 'Subnets[*].SubnetId' \
		--output text | sed -E "s/\s+/, /g"
}

get_vpc_cidr_range() {
	aws ec2 describe-vpcs \
		--vpc-ids "$(get_cluster_vpc)" \
		--query "Vpcs[].CidrBlock" \
		--output text | sed -E "s/\s+/, /g"
}

get_account_id() {
	aws sts get-caller-identity --query "Account"  --output text
}

get_repo_base() {
	echo "$(get_account_id).dkr.ecr.ca-central-1.amazonaws.com"
}

get_web_role_arn() {
	local WEB_ROLE_NAME=privacypal-qa-web-role
	local WEB_IAM_ROLE_ARN="$(aws iam get-role --role-name=$WEB_ROLE_NAME --query Role.Arn --output text)"
	echo $WEB_IAM_ROLE_ARN
}

get_processor_lamda_role_arn() {
	local LAMBDA_ROLE_NAME=privacypal-qa-processor-lambda-role
	local LAMBDA_IAM_ROLE_ARN="$(aws iam get-role --role-name=$LAMBDA_ROLE_NAME --query Role.Arn --output text)"
	echo $LAMBDA_IAM_ROLE_ARN
}

get_conversion_lamda_role_arn() {
	local LAMBDA_ROLE_NAME=privacypal-qa-conversion-lambda-role
	local LAMBDA_IAM_ROLE_ARN="$(aws iam get-role --role-name=$LAMBDA_ROLE_NAME --query Role.Arn --output text)"
	echo $LAMBDA_IAM_ROLE_ARN
}

get_cognito_secret() {
	local COGNITO_SECRET=${COGNITO_SECRET:-"privacypal-qa-cognito"}
	echo $COGNITO_SECRET
}

# Required
get_tls_cert_arn() {
	echo $TLS_CERT_ARN
}

# Required
get_domain() {
	echo $PRIVACYPAL_DOMAIN
}

help() {
	echo "Usage: $0 [help|cluster-info|install|dry-run]"
}

if [ "$#" -eq 0 ]; then
	help
	exit 1
fi

CHART_DIR="$DIR/../charts/privacypal"
RELEASE_NAME=${RELEASE_NAME:-"privacypal-qa"}
INSTALL_NAMESPACE=${INSTALL_NAMESPACE:-"privacypal-app"}

function intall_chart() {
	helm install $RELEASE_NAME $CHART_DIR \
		--create-namespace \
		--namespace "$INSTALL_NAMESPACE" \
		--set web.image.repository="$(get_repo_base)/privacypal" \
		--set web.ingress.className=alb \
		--set web.ingress.annotations."alb\.ingress\.kubernetes\.io/scheme"=internet-facing \
		--set web.ingress.annotations."alb\.ingress\.kubernetes\.io/target-type"=ip \
		--set web.ingress.annotations."alb\.ingress\.kubernetes\.io/certificate-arn"="$(get_tls_cert_arn)" \
		--set web.ingress.hosts[0].host="$(get_domain)" \
		--set web.ingress.hosts[0].paths[0].path="/" \
		--set web.ingress.hosts[0].paths[0].pathType="Prefix" \
		--set lambda.videoProcessor.image.repository="$(get_repo_base)/privacypal-vidproc-lambda" \
		--set lambda.videoProcessor.iamRole="$(get_processor_lamda_role_arn)" \
		--set lambda.videoProcessor.memorySize="3008" \
		--set lambda.videoConversion.image.repository="$(get_repo_base)/privacypal-vidconvert-lambda" \
		--set lambda.videoConversion.iamRole="$(get_conversion_lamda_role_arn)" \
		--set database.initializer.image.repository="$(get_repo_base)/privacypal-init-db" \
		--set database.networks.vpcId="$(get_cluster_vpc)" \
		--set database.networks.subnetIds="{$(get_vpc_subnets)}" \
		--set database.networks.cidrBlock="{$(get_vpc_cidr_range)}" \
		--set auth.cognito.cognitoSecretName="$(get_cognito_secret)" \
		--set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="$(get_web_role_arn)" \
		--set serviceAccount.name=privacypal \
		"$@"
}

while [ "$#" -ne 0 ]; do
	case "$1" in
		help)
			help
		;;
		dry-run)
			set -x
			log_cluster_info
			intall_chart --dry-run
		;;
		install)
			if [ "$VERBOSE" = "true" ]; then
				set -x
			fi
			log_cluster_info
			intall_chart
		;;
		cluster-info)
			log_cluster_info
		;;
		*)
			help
			exit 1
		;;
	esac
	shift
done
