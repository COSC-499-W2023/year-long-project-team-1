## REQUIREMENTS

- [`kubectl`](https://kubectl.docs.kubernetes.io/installation/kubectl/binaries/) (v1.27+) or [`oc`](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html)
- [`aws`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) with permissions to create IAM resources (IAM user not required)
- [`eksctl`](https://eksctl.io/installation/)
- [`helm`](https://helm.sh/docs/intro/install/)
- [`jq`](https://jqlang.github.io/jq/)
- [`podman`](https://podman.io/docs/installation) or [`docker`](https://docs.docker.com/engine/install/)
- [AWS EKS Instance](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (Kubernetes v1.27+) with Kubeadmin access

## Amazon Elastic Kubernetes Service (AWS EKS)

**Note:** The application currently supports only AWS EKS with Kubernetes v1.27+. Please ensure an EKS instance is available before proceeding.

To list available clusters, run:

```bash
aws eks list-clusters --region <region>
```

To create a cluster, if required, run:

```bash
eksctl create cluster --name <cluster-name> --region <region-code>
```

If you already have a cluster or at any time need to update kubeconfig, run:  

```bash
aws eks update-kubeconfig --region <region-code> --name <cluster-name>
```

**Notes:**

- If you are using another aws profile other than `default`, specify the `--profile <profile-name>` in your `aws`/`eksctl` command.
- If you would like to use another config file rather than `$HOME/.kube/config`, set `KUBECONFIG=<path-to-kube-config>`.

## OIDC Identity Provider

Create an OpenID Connect (OIDC) identity provider for your EKS cluster using the `eksctl utils` command:

```bash
eksctl utils associate-iam-oidc-provider --cluster <eks cluster name> --region <region-code> --approve
```

This allows service accounts within the EKS cluster to authenticate with AWS services.

## ACK Controllers

The EKS instance must be properly configured with AWS Controllers for Kubernetes (ACK). These controllers are responsible for managing AWS resources via Kubernetes custom resource.

The ACK controllers are available for installation via Helm Charts. Follow the [ACK documentations](https://aws-controllers-k8s.github.io/community/docs/community/overview/) to set up IAM resources and installation step.

This repository also includes a utility script `ack_installer.sh` to automate the entire process.

```bash
EKS_CLUSTER_NAME=<cluster-name> AWS_SERVICE=s3 bash ack_installer.sh
```

To verify whether the controller is installed sucessfully, check if all controller pods are running:

```bash
$ kubectl get pods -n ack-system
NAME                                                  READY   STATUS    RESTARTS   AGE
ack-ec2-controller-ec2-chart-588f67f4d-44l57          1/1     Running   0          5d19h
ack-lambda-controller-lambda-chart-7d44454dbb-lb67c   1/1     Running   0          5d22h
ack-rds-controller-rds-chart-8bffcb97c-llttr          1/1     Running   0          5d22h
ack-s3-controller-s3-chart-65bd8564b4-9h8dl           1/1     Running   0          9d
```

The required ACK Controllers: `s3`, `lambda`, `rds`, `ec2`.

## Load Balancing Controller

If deploying the application with `Ingress`, you must install AWS Load Balancing Controller. The controller is responsible for provisioning AWS Load Balancer for the application.

This repository also includes a utility script `aws_lb_controller_install.sh` to automate the entire process.

```bash
EKS_CLUSTER_NAME=<cluster-name> bash aws_lb_controller_install.sh
```

**Note:** IAM Role for AWS Load Balancer might already exist. In that case, proceed to install Controller with Helm Chart.


## Elastic Container Registrys (AWS ECR)

AWS Lambda service requires source images to be available in private ECR repositories. You can create one with:

```bash
aws ecr create-repository --region <region> --repository-name <repo-name>
```

Due to this requirement, the chart does not specify default image configurations for the lambdas. Consequently, you must configure them at the installation time, for example:

```bash
helm install my-app ./charts/privacypal \
    --set lambda.videoProcessor.image.repository="<my-lambda-0-ecr-repository>" \
    --set lambda.videoConversion.image.repository="<my-lambda-1-ecr-repository>"
```

## AWS IAM Roles

The application components must be attached with corresponding IAM roles with sufficient permissions to function properly .

|Components|Required Permissions|
|:--|:--|
|Web Application|Read/Write S3 Buckets, Get Lambdas, FullAccess Cognito|
|Video Processor Lambda|Basic Execution, Read/Write S3 Buckets, FullAccess Rekcognito|
|Video Conversion Lambda|Basic Execution, Read/Write S3 Buckets|

Then, configure IAM roles for app components as followed:

```bash
helm install my-app ./charts/privacypal \
    --set lambda.videoProcessor.iamRole="<processor-role>" \
    --set lambda.videoConversion.iamRole="<conversion-role>" \
    --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="<web-role>"
```

## AWS Cognito Configurations

The application utilizes AWS Cognito to authenticate app users. Currently, the chart only support manual Cognito setup. Follow the [documentation](https://aws.amazon.com/cognito/getting-started/) to create a User Pool.


Then, create a Kubernetes Secret to store AWS Cognito configurations:

- Create a text file (e.g. `cognito_secret.k8s.conf`)with the following contents. Fill the values with your Cognito information.
    ```bash
    COGNITO_CLIENT=<client>
    COGNITO_CLIENT_SECRET=<secret>
    COGNITO_POOL_ID=<id>
    ```
- Create a Secret:
    ```bash
    kubectl create secret generic <secret-name> \
        --from-env-file=./cognito_secret.k8s.conf
    ```

At the installation time, specify the secret to chart as followed:

```bash
helm install my-app ./charts/privacypal \
    --set auth.cognito.cognitoSecretName="<secret-name>"
```


## Post-Installation Requirements

Due to limitations that AWS Lambda ARNs are not available at installation time, you must patch the S3 bucket objects with Lambda ARNs after installation.

Follow the chart's release note to complete the above installation-step. For example:

```bash
export PROCESSOR_LAMBDA_ARN=$(kubectl get --namespace myns function privacypal-vidproc -o=jsonpath="{.status.ackResourceMetadata.arn}")
export CONVERSION_LAMBDA_ARN=$(kubectl get --namespace myns function privacypal-vidconvert -o=jsonpath="{.status.ackResourceMetadata.arn}")

kubectl patch --namespace myns bucket privacypal-tmp -type='json' \
-p='[{"op": "replace", "path": "/spec/notification/lambdaFunctionConfigurations/0/lambdaFunctionARN", "value":"$PROCESSOR_LAMBDA_ARN"}, {"op": "replace", "path": "/spec/notification/lambdaFunctionConfigurations/1/lambdaFunctionARN", "value":"$CONVERSION_LAMBDA_ARN"}]'
```
