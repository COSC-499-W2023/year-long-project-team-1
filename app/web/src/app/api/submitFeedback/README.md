In order to send user's feedback for sending and recieving emails, AWS SES (Simple Email Service) is used. An email is required to be verified on AWS SES Console in order to start receiving feedbacks.

### 1. Follow this guide to create AWS account if you haven't had one

https://docs.aws.amazon.com/accounts/latest/reference/welcome-first-time-user.html#getting-started-prerequisites


### 2. Verify destination email in AWS SES

- Log into [AWS SES Console](https://ca-central-1.console.aws.amazon.com/ses/home?region=ca-central-1#/account).

- Chose **Identities** and **Create identity**.

- Create new domain/email that will be used to receive feedback.

- A link for verification will be sent to the newly added email. After confirm email ownership, the email can be authorized to receive feedback.

### 3. Configure environment variables:
   - Set the `[NOREPLY_EMAIL]` environment variable in `.env.local` to the newly created verified email address.