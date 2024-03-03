# Clients API

- Integrate with AWS Cognito to fetch client list and add new client to user pool.
- Fetch one user info given username

## Endpoint

### 1. Fetch client list

This api fetched all users with role CLIENT in cognito

```json
GET /api/clients
```

```json
{
    "data": [
        {
            "username": "bakar",
            "firstName": "Muhammad",
            "lastName": "Bakar",
            "email": "privacypaltest@gmail.com"
        },
        {
            "username": "thvo-maintainer",
            "firstName": "Maintainer",
            "lastName": "Thvo",
            "email": "thvo@privacypal.awsapps.com"
        },
        {
            "username": "testuser1",
            "firstName": "Marry",
            "lastName": "Lane",
            "email": "privacypaltest@gmail.com"
        },
        ...
    ]
}
```

### 2. Fetch user infomation given username

```json
GET /api/appointments?username=testuser1
```

```json
Response
{
    "data": [
        {
            "username": "testuser1",
            "email": "privacypaltest@gmail.com",
            "lastName": "Lane",
            "firstName": "Marry"
        }
    ]
}
```

### 3. Add new user to client group

This api adds new user to cognito and assigns CLIENT role to them

```json
PUT /api/clients
```

#### Request body required

"username": new client username
"email": new client email

```json
Request: http://localhost:3000/api/clients
{
    "username": "ngan-test-new-user",
    "email": "jill01009@gmail.com"
}
```

```json
Response: 
{
    "data": {
        "message": "User successfully added to user pool"
    }
}
```
