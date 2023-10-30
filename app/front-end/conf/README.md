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
const password: string = utf8ToBase64(await bcrypt.hash(userPassword, 10));
```

In this case, `10` is the number of salt rounds used by `bcrypt`. When comparing passwords for authentication, `bcrypt` will use the salt stored in the hash to generate a new hash and compare the two hashes. If the hashes match, the passwords match.

This means it is necessary to use `bcrypt.compare()` as such:

```typescript
const passwordMatches: boolean = await bcrypt.compare(userPassword, base64ToUtf8(storedPassword));
```

The sample file features a user with the email `johnny@example.com` and password `password` and another user whose email is `badatpasswords@example.com` and has no password.
