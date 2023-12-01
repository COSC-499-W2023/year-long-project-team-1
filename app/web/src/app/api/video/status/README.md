# Video Status API

## Expects

- `filename`: used value returned by `/api/video/upload`
- `Cookie`: Include cookie in request header. Get cookie from browser storage after logging in using UI. Example: `privacypal=<hashed_cookie>`

## Request

```json
GET api/video/status?filename=<filename>
```

## Returns

Encoding:

- `application/json`

Complete status:

```json
{
    "message": "True"
}
```

Still in process status:

```json
{
    "message": "False"
}
```
