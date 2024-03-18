# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL := /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

# Image identifier
IMAGE_VERSION ?= 0.1.0-dev
DEFAULT_NAMESPACE = ghcr.io/cosc-499-w2023
IMAGE_NAMESPACE ?= $(DEFAULT_NAMESPACE)

PLATFORM ?= linux/amd64

# Tools
IMAGE_BUILDER ?= podman

##@ General

.PHONY: help
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

FLAKE ?= flake8
.PHONY: lint
lint: ## Lint source files
	cd lambda && $(FLAKE) *.py

.PHONY: add-license
add-license: ## Add license header to source files
	$(IMAGE_BUILDER) run \
		--name addlicense \
		--security-opt label=disable \
		-v "$${PWD}":"/src" \
		-it --replace \
		ghcr.io/google/addlicense -v -f ./license.header.txt -ignore **/__pycache__/ -ignore **/.pytest_cache/ ./lambda/*.py ./lambda/*.sh

.PHONY: check-license
check-license: ## Check if license header is available in source files
	$(IMAGE_BUILDER) run \
		--name addlicense \
		--security-opt label=disable \
		-v "$${PWD}":"/src" \
		-it --replace \
		ghcr.io/google/addlicense -v -f ./license.header.txt -check -ignore **/__pycache__/ -ignore **/.pytest_cache/ ./lambda/*.py ./lambda/*.sh

.PHONY: test
test: ## Run unit tests with mocked AWS services
	cd lambda && coverage run -m pytest .	

##@ Lambda

AWS_PROFILE ?= privacypal
AWS_REGION ?= ca-central-1

LAMBDA_IMAGE_NAME ?= privacypal-vidproc-lambda
LAMBDA_IMAGE ?= $(IMAGE_NAMESPACE)/$(LAMBDA_IMAGE_NAME):$(IMAGE_VERSION)

.PHONY: lambda-oci-build
lambda-oci-build: ## Build the OCI image for video processing lambda.
	$(IMAGE_BUILDER) build -t $(LAMBDA_IMAGE) --platform $(PLATFORM) -f ./lambda/Dockerfile ./lambda

.PHONY: lambda-oci-push
lambda-oci-push: login-ecr ## Push the video processing lambda OCI image.
	AWS_ACCOUNT_ID=$$(aws sts get-caller-identity --query "Account" --profile $(AWS_PROFILE) --output text); \
	ECR_LAMBDA_IMAGE=$${AWS_ACCOUNT_ID}.dkr.ecr.$(AWS_REGION).amazonaws.com/$(LAMBDA_IMAGE_NAME):$(IMAGE_VERSION); \
	$(IMAGE_BUILDER) tag $(LAMBDA_IMAGE) $${ECR_LAMBDA_IMAGE}; \
	$(IMAGE_BUILDER) push $${ECR_LAMBDA_IMAGE}

.PHONY: login-ecr
login-ecr: ## Authenticate container tool with AWS ECR
	AWS_ACCOUNT_ID=$$(aws sts get-caller-identity --query "Account" --profile $(AWS_PROFILE) --output text); \
	aws ecr get-login-password --region $(AWS_REGION) --profile $(AWS_PROFILE) | $(IMAGE_BUILDER) login --username AWS --password-stdin $${AWS_ACCOUNT_ID}.dkr.ecr.$(AWS_REGION).amazonaws.com
