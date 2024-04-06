# Privacypal

[![Image build](https://github.com/COSC-499-W2023/year-long-project-team-1/actions/workflows/build-ci.yaml/badge.svg)](https://github.com/COSC-499-W2023/year-long-project-team-1/actions/workflows/build-ci.yaml)

PrivacyPal is a privacy-focused application for professionals such as doctors, recruiters, teachers, and their clients.

## Description

Our software aims to protect client privacy by providing automatic face blurring in videos they send to professional users. Our solution leverages AWS technologies such as Rekognition and S3 buckets, as well as other industry-standard technologies like Kubernetes, Node.js, and TypeScript. Key advantages of this stack include secure bulk video storage with configurable permissions, scalability due to Kubernetes and S3, and quick and secure facial detection with Rekognition. Server-side React compilation speeds up load times for professionals and clients and React’s latest features allow for scalable UI themes and improved development speed.

## BUILD

### Build requirements

- [Node.js](https://nodejs.org/en) v18+
- npm v9.8.1+ (Installed with Node)
- [Make](https://www.gnu.org/software/make/) 4+
- [Podman](https://podman.io/docs/installation) 4.7+

### Instructions

The application consists of 4 core components that are packaged into container images. Follow the instructions in READMEs to build the container images.

- [Web Server](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/app/web/README.md)
- [Database Initializer](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/app/web/db/README.md)
- [Processor Lambda](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/app/video-processing/lambda/README.md)
- [Conversion Lambda](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/app/video-conversion/README.md)

**Note:** The easiest way to build container images all together is to use local smoketest with `docker-compose` as below, which by default rebuilds all images on launch.

## RUN

### Local smoketest

A local smoketest is available for local development, utilizing the `docker-compose`. Follow the instructions in the [README](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/app/smoketest/compose/README.md) to configure your local environment.

Once configured, launch the smoketest with:

```bash
$ cd app/smoketest/compose
$ bash smoketest
```

### Kubernetes (AWS Elastic Kubernetes)

A Kubernetes Helm Chart is also available to deploy the application on Kubernetes. **Currently, only AWS Elastic Kubernetes (AKS) is supported.**

#### EKS Requirements

The EKS instance must be provisioned, following the intructions in the [`SETUP.md`](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/helm-charts/SETUP.md). Generally, there must be [ACK Controllers](https://aws-controllers-k8s.github.io/community/docs/community/overview/) and [ALB Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) available to manage AWS resources.

#### Installation

Once the cluster is properly configured, the chart can be installed to deploy the Privacypal application. All available chart values/options are documented in [README](https://github.com/COSC-499-W2023/year-long-project-team-1/blob/develop/helm-charts/charts/privacypal/README.md). Generally, the following command can be used:

```bash
helm install $RELEASE_NAME helm-charts/charts/privacypal \
    --create-namespace \
    --namespace "$INSTALL_NAMESPACE" \
    --set web.image.repository="$WEB_IMAGE_REPO" \
    --set web.ingress.className=alb \
    --set web.ingress.annotations."alb\.ingress\.kubernetes\.io/scheme"=internet-facing \
    --set web.ingress.annotations."alb\.ingress\.kubernetes\.io/target-type"=ip \
    --set web.ingress.annotations."alb\.ingress\.kubernetes\.io/certificate-arn"="$ACM_FOR_DOMAIN_ARN" \
    --set web.ingress.hosts[0].host="$DOMAIN" \
    --set web.ingress.hosts[0].paths[0].path="/" \
    --set web.ingress.hosts[0].paths[0].pathType="Prefix" \
    --set lambda.videoProcessor.image.repository="$PROCESSOR_LAMBDA_IMAGE_REPO" \
    --set lambda.videoProcessor.iamRole="$PROCESSOR_LAMBDA_IAM_ROLE" \
    --set lambda.videoProcessor.memorySize="3072" \
    --set lambda.videoConversion.image.repository="$CONVERSION_LAMBDA_IMAGE_REPO" \
    --set lambda.videoConversion.iamRole="$CONVERSION_LAMBDA_IAM_ROLE" \
    --set database.initializer.image.repository="$DB_INIT_IMAGE_REPO" \
    --set database.networks.vpcId="$VPC_ID" \
    --set database.networks.subnetIds="{$VPC_SUBNETS}" \ # Comma-separated list
    --set database.networks.cidrBlock="{$CIDR_BLOCK}" \ # Comma-separated list
    --set auth.cognito.cognitoSecretName="$COGNITO_SECRET" \
    --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="$WEB_IAM_ROLE" \
    --set serviceAccount.name=privacypal \
    --set contact.noreplyEmail="$NOREPLY_EMAIL"
```

**Note:** A utility scripts are available for setting up EKS instance and installing the Helm Chart. They are available [here](https://github.com/COSC-499-W2023/year-long-project-team-1/tree/develop/helm-charts/scripts).



# Contributors

- [Connor Doman](https://github.com/connordoman)
- [Linh Nguyen](https://github.com/linhnnk)
- [Ngan Phan](https://github.com/nganphan123)
- [Paul Unger](https://github.com/MyStackOverflows)
- [Thuan Vo](https://github.com/tthvo)
