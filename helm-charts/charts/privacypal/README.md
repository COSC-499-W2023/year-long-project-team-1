# Privacypal Helm Chart

Helm Chart to deploy [Privacypal](https://github.com/COSC-499-W2023/year-long-project-team-1/wiki) application on Kubernetes. Currently, only AWS EKS is supported.

## Parameters

### PrivacyPal Application

| Name                      | Description                                                                                                                                                                                                                                                                                                      | Value       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `web`                     | Configurations for the Privacypal pod                                                                                                                                                                                                                                                                            |             |
| `web.replicas`            | Number of replicas of the Privacypal pod                                                                                                                                                                                                                                                                         | `1`         |
| `web.image.repository`    | Repository for the Privacypal container image                                                                                                                                                                                                                                                                    | `""`        |
| `web.image.tag`           | Tag for the Privacypal container image                                                                                                                                                                                                                                                                           | `0.1.0-dev` |
| `web.image.pullPolicy`    | Image pull policy for the Privacypal container image                                                                                                                                                                                                                                                             | `Always`    |
| `web.podAnnotations`      | Annotations to be applied to the Privacypal pod                                                                                                                                                                                                                                                                  | `{}`        |
| `web.podSecurityContext`  | Security Context for the Privacypal Pod. Defaults to meet "restricted" [Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted). See: [PodSecurityContext](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)      | `{}`        |
| `web.securityContext`     | Security Context for the Privacypal container. Defaults to meet "restricted" [Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted). See: [SecurityContext](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1) | `{}`        |
| `web.service.type`        | Type of Service to create for Privacypal pod                                                                                                                                                                                                                                                                     | `ClusterIP` |
| `web.service.port`        | Port number to expose on the Service for Privacypal's HTTP server                                                                                                                                                                                                                                                | `80`        |
| `web.service.annotations` | Annotations to add to the service of the Privacypal application                                                                                                                                                                                                                                                  | `{}`        |
| `web.ingress.className`   | Ingress class name for the Privacypal Ingress                                                                                                                                                                                                                                                                    | `""`        |
| `web.ingress.annotations` | Annotations to apply to the Privacypal Ingress                                                                                                                                                                                                                                                                   | `{}`        |
| `web.ingress.hosts`       | Hosts to create rules for in the Privacypal Ingress. See: [IngressSpec](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)                                                                                                                                           | `[]`        |
| `web.resources`           | Resource requests and limtis for Privacypal container.                                                                                                                                                                                                                                                           | `{}`        |

### Lambda

| Name                                          | Description                                                                                                 | Value       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------- |
| `lambda.videoProcessor`                       | Configurations for the Video processor component as AWS Lambda                                              |             |
| `lambda.videoProcessor.image.repository`      | Repository for the lambda container image                                                                   | `""`        |
| `lambda.videoProcessor.image.tag`             | Tag for the lambda container image                                                                          | `0.1.0-dev` |
| `lambda.videoProcessor.image.pullPolicy`      | Image pull policy for the lambda container image                                                            | `Always`    |
| `lambda.videoProcessor.ephemeralStorageSize`  | The size of the function’s /tmp directory in MB                                                             | `512`       |
| `lambda.videoProcessor.memorySize`            | The size of allocated memory for the function in MB                                                         | `2048`      |
| `lambda.videoProcessor.timeout`               | The amount of time (in seconds) that Lambda allows a function to run before stopping it                     | `900`       |
| `lambda.videoProcessor.iamRole`               | The ARN of IAM role to attach to the lambda. The role must allow the lambda to read and write to S3 buckets | `""`        |
| `lambda.videoConversion`                      | Configurations for the Video conversion component as AWS Lambda                                             |             |
| `lambda.videoConversion.image.repository`     | Repository for the lambda container image                                                                   | `""`        |
| `lambda.videoConversion.image.tag`            | Tag for the lambda container image                                                                          | `0.1.0-dev` |
| `lambda.videoConversion.image.pullPolicy`     | Image pull policy for the lambda container image                                                            | `Always`    |
| `lambda.videoConversion.ephemeralStorageSize` | The size of the function’s /tmp directory in MB                                                             | `512`       |
| `lambda.videoConversion.memorySize`           | The size of allocated memory for the function in MB                                                         | `2048`      |
| `lambda.videoConversion.timeout`              | The amount of time (in seconds) that Lambda allows a function to run before stopping it                     | `120`       |
| `lambda.videoConversion.iamRole`              | The ARN of IAM role to attach to the lambda. The role must allow the lambda to read and write to S3 buckets | `""`        |

### Database

| Name                                    | Description                                                                                                                                                                   | Value          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `database`                              | Configurations for the database (Postgres) component                                                                                                                          |                |
| `database.version`                      | Version of the Postgres engine. See: [Available versions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.DBVersions) | `16`           |
| `database.allocatedStorage`             | The amount of storage to allocate for this instance in GB                                                                                                                     | `20`           |
| `database.instanceClass`                | The compute and memory capacity of the DB instance. See: [Supported classes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html)            | `db.t4g.micro` |
| `database.dbName`                       | Name of the database to create                                                                                                                                                | `privacypal`   |
| `database.multiAZ`                      | Specifies whether to deploy the database as MultiAZ                                                                                                                           | `true`         |
| `database.encrypted`                    | Specifies whether to encrypt the the database                                                                                                                                 | `true`         |
| `database.credentialSecretName`         | Name of the secret to extract the password for database master credentials. Expect required key `DB_USERNAME` and `DB_PASSWORD`                                               | `""`           |
| `database.networks.vpcId`               | The Virtual Private Cloud (VPC) ID of the EKS cluster                                                                                                                         | `""`           |
| `database.networks.subnetIds`           | The EC2 Subnet IDs of the specified VPC for creating the database subnet group                                                                                                | `[]`           |
| `database.networks.cidrBlock`           | The CIDR Block of the specified VPC                                                                                                                                           | `[]`           |
| `database.initializer.image.repository` | Repository for the database initializer container image                                                                                                                       | `""`           |
| `database.initializer.image.tag`        | Tag for the database initializer container image                                                                                                                              | `0.1.0-dev`    |
| `database.initializer.image.pullPolicy` | Image pull policy for the database initializer container image                                                                                                                | `Always`       |

### Authentcation

| Name                             | Description                                                                                                                                      | Value  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `auth`                           | Authentication configurations.                                                                                                                   |        |
| `auth.cognito`                   | Configurations for AWS Cognito Authentication                                                                                                    |        |
| `auth.cognito.enabled`           | Specifies whether to enable auth with AWS Cognito                                                                                                | `true` |
| `auth.cognito.cognitoSecretName` | Name of the secret to extract the Cognito client secrets. Expect required keys: `COGNITO_CLIENT`, `COGNITO_CLIENT_SECRET`, and `COGNITO_POOL_ID` | `""`   |

### Other Parameters

| Name                         | Description                                                                                                                                                                                                  | Value  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `nameOverride`               | Overrides the name of this Chart                                                                                                                                                                             | `""`   |
| `fullnameOverride`           | Overrides the fully qualified application name of `[release name]-[chart name]`                                                                                                                              | `""`   |
| `imagePullSecrets`           | Image pull secrets to be used for the PrivacyPal deployment                                                                                                                                                  | `[]`   |
| `serviceAccount.create`      | Specifies whether a service account should be created                                                                                                                                                        | `true` |
| `serviceAccount.annotations` | Annotations to add to the service account. Annotation eks.amazonaws.com/role-arn must be specified with an IAM role that allows the service account to read/write S3 buckets, and get lambda (health check). | `{}`   |
| `serviceAccount.name`        | The name of the service account to use. If not set and create is true, a name is generated using the fullname template                                                                                       | `""`   |
| `contact.noreplyEmail`       | The email for sending and receiving feedbacks from users or visitors to the application site                                                                                                                 | `""`   |
