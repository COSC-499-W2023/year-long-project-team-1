# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL := /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

# Development database details
POSTGRES_IMAGE ?= docker.io/library/postgres:16-bullseye
DATABASE ?= privacypal
DATABASE_USER ?= privacypal
DATABASE_PASSWORD ?= password
DATABASE_HOSTNAME ?= localhost
DATABASE_PORT ?= 5432

# Prisma schema
PRISMA_VERSION ?= 5.8.1
SCHEMA_VERSION ?= $(IMAGE_VERSION)
export DATABASE_URL=postgresql://$(DATABASE_USER):$(DATABASE_PASSWORD)@$(DATABASE_HOSTNAME):$(DATABASE_PORT)/$(DATABASE)

# Tools
IMAGE_BUILDER ?= podman

# Image identifier
IMAGE_VERSION ?= 0.1.0-dev
IMAGE_NAME ?= privacypal-init-db
DEFAULT_NAMESPACE = ghcr.io/cosc-499-w2023
IMAGE_NAMESPACE ?= $(DEFAULT_NAMESPACE)

DB_INIT_IMAGE ?= $(IMAGE_NAMESPACE)/$(IMAGE_NAME):$(IMAGE_VERSION)


##@ General

.PHONY: help
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: add-license
add-license: ## Add license header to source files
	$(IMAGE_BUILDER) run \
		--name addlicense \
		--security-opt label=disable \
		-v "$${PWD}":"/src" \
		-it --replace \
		ghcr.io/google/addlicense -v -f ./license.header.txt include

.PHONY: check-license
check-license: ## Check if license header is available in source files
	$(IMAGE_BUILDER) run \
		--name addlicense \
		--security-opt label=disable \
		-v "$${PWD}":"/src" \
		-it --replace \
		ghcr.io/google/addlicense -v -f ./license.header.txt -check include

##@ Build

.PHONY: oci-build
oci-build: # Build OCI image for database initialization image
	$(IMAGE_BUILDER) build -t $(DB_INIT_IMAGE) -f ./Dockerfile .

SCHEMA_PATH ?= $(shell pwd)/schema.prisma
MIGRATION_DIR ?= $(shell pwd)/migrations
MIGRATION_SUFFIX ?= $(shell echo v$(SCHEMA_VERSION) | sed -e 's/[\.-]/_/g')


.PHONY: generate-migration
generate-migration: ## Generate latest migration DDL
	- rm -r $(wildcard $(MIGRATION_DIR)/*$(MIGRATION_SUFFIX))
	npx prisma@$(PRISMA_VERSION) migrate dev \
		--create-only \
		--skip-generate \
		--name $(MIGRATION_SUFFIX) \
		--schema $(SCHEMA_PATH)

##@ Smoketest

DOT_ENV ?= $(shell pwd)/.env

.PHONY: setup-env
setup-env: $(DOT_ENV) ## Set up prisma environment
$(DOT_ENV):
	echo DATABASE_URL=$(DATABASE_URL) >> $(DOT_ENV)

.PHONY: start-db
start-db: ## Start a postgres instance in a container for development
	$(IMAGE_BUILDER) run -d \
		--name postgres \
		-p $(DATABASE_PORT):5432 \
		-e POSTGRES_PASSWORD=$(DATABASE_PASSWORD) \
		-e POSTGRES_USER=$(DATABASE_USER) \
		-e POSTGRES_DB=$(DATABASE) \
		$(POSTGRES_IMAGE)

.PHONY: remove-db
remove-db: ## Remove the postgres instance in a container for development
	- $(IMAGE_BUILDER) stop postgres && $(IMAGE_BUILDER) rm postgres

LOG_FILE ?= db-init-run.log
PRIVACYPAL_AUTH_MANAGER ?= basic
LOCAL_USER_PROPERTY_PATH ?= ./sample/user.properties.csv
PRIVACYPAL_USER_PROPERTY_PATH ?= /opt/privacypal/user.properties.csv

.PHONY: run
run: ## Run the database initialization container
	$(IMAGE_BUILDER) run \
	--name privacypal-init-db \
	--network host \
	-e NO_COLOR="true" \
	-e DATABASE_URL=$(DATABASE_URL) \
	-e PRIVACYPAL_AUTH_MANAGER=$(PRIVACYPAL_AUTH_MANAGER) \
	-e PRIVACYPAL_USER_PROPERTY_PATH=$(PRIVACYPAL_USER_PROPERTY_PATH) \
	-v "$(LOCAL_USER_PROPERTY_PATH)":"$(PRIVACYPAL_USER_PROPERTY_PATH)" \
	-it --rm $(DB_INIT_IMAGE) | tee $(LOG_FILE)
