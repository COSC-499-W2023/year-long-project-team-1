# Video Upload API

Allowed Methods:

-   `POST`

Expects:

-   `file`: The video file to upload as a `multipart/form-data` file.

Returns JSON:

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
