# Video Upload API

Reachable at: `/api/video/upload/`

## Allowed Methods

- `POST`

## Expects

- `file`: The video file to upload as a `multipart/form-data` file.
- `Cookie`: Include cookie in request header. Get cookie from browser storage after logging in using UI. Example: `privacypal=<hashed_cookie>`

## Returns

Encoding:

- `application/json`

Upload success:

```json
{
    "success": true,
    "filePath": "path/to/file.mp4"
}
```

Upload failure:

```json
{
    "success": false
}
```
