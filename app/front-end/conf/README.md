# PrivacyPal Configuration

## Users

User data for basic authentication is stored in `./user.properties.json` in the form of:

```typescript
interface PrivacyPalUser {
    id: string;
    email: string;
    password: string;
}

interface PrivacyPalUserProperties {
    users: PrivacyPalUser[];
}
```

Where `password` is a base64 encoded `bcrypt` hash of the user's password:

```typescript
const password = btoa(await bcrypt.hash(userPassword, 10));
```

The sample file features a user with the email `johnny@example.com` and password `password`.
