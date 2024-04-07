Cognito's user pool and user groups are requirements for authentication flow. This instruction is referenced from [AWS Cognito's setup guide](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html) with customized steps to work with this system.

## Follow this guide to create AWS account if you haven't had one

https://docs.aws.amazon.com/accounts/latest/reference/welcome-first-time-user.html#getting-started-prerequisites

## Create a new user pool

1. Log in [Amazon Cognito console](https://console.aws.amazon.com/cognito/home)
2. Choose **Create user pool** button
3. In the top-right corner of the page, choose Create a user pool to start the user pool creation wizard.
4. In **Configure sign-in experience**:
   - Under **Authentication providers**, for **Provider types**, ensure that only **Cognito user pool** is selected.
   - For **Cognito user pool sign-in options**, choose **User name**. Don't select any additional **User name requirements**.
   - Keep all other options as the default and choose **Next**.
5. In **Configure security requirements**
   - For **Password policy**, confirm that **Password policy mode** is set to **Cognito defaults**.
   - Under **Multi-factor authentication**, choose **No MFA**
   - For **User account recovery**, confirm that **Enable self-service account recovery** is selected, and that the user account recovery message delivery method is **Email only**.
   - Keep all other options as the default and choose **Next**.
6. In **Configure sign-up experience**
   - Unselect **Enable self-registration**
   - Under **Cognito-assisted verification and confirmation**, verify that the **Allow Cognito to automatically send messages to verify and confirm** check box is selected.
   - Confirm that **Attributes to verify** is set to **Send email message, verify email address**.
   - Under **Verifying attribute changes**, confirm that the default options are selected: **Keep original attribute value when an update is pending** is selected, and **Active attribute values when an update is pending** is set to **Email address**.
   - Under **Required attributes**, confirm that **Required attributes based on previous selections** displays email and **Additional required attributes** is set to **family_name** and **given_name**.
7. In **Configure message delivery**
   - For Email provider, choose **Send email with Cognito**, you can use any emails in the linked to the system or use the default email sender provided by Amazon Cognito.
   - Keep all other options as the default and choose **Next**.
8. In **Integrate your app**
   - Under **User pool name**, enter a **User pool name**.
   - Don’t select **Use the Cognito hosted UI**.
   - Under **Initial app client**, confirm that **App type** is set to **Confidential client**.
   - Enter an **App client name**.
   - Under **Client secret**, confirm that **Generate a client secret is selected**.
   - Expand **Advanced app client settings**. Add **ALLOW_ADMIN_USER_PASSWORD_AUTH** to the list of **Authentication flows**. Ensure **Refresh token expiration**, **Access token expiration**, and **ID token expiration** are st to **60 minutes**.
   - Keep all other options as the default and choose **Next**.
9. Review your choices in the **Review and create** screen, then choose **Create user pool** to proceed.
10. From the **User pools** page, choose the user pool just created.
11. Under **User pool overview**, note your **User pool ID**. This will be `[COGNITO_POOL_ID]` variable in `env.local`
12. Choose the **App integration tab** and locate the **App clients and analytics section**. Select the new app client created. Note your **Client ID**. This will be `[COGNITO_CLIENT]` in `env.local`. Note your **Client secret**. This will be `[COGNITO_CLIENT_SECRET]` in `env.local`

## Create user groups

1. In **Amazon Cognito console**, choose the new user pool we created above. Select **Groups** option, then click **Create group** button.
2. Under **Group information**, enter **Group name** as **professional**.
3. Keep all other options as the default and choose **Create group**.
4. Repeat step from 1 for gorup **client**.
