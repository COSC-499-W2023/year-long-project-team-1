# Video Upload API

Reachable at: `/api/video/upload/`

## Allowed Methods

- `POST`

## Expects

- `file`: The video file to upload as a `multipart/form-data` file.
- `blurFaces`: a string indicating if the user wants to blur their face or not ("true" or "false")
- `regions`: a json string of the form:
  ```json
  [
    {
      "origin": [ 0, 0 ],
      "width": 40,
      "height": 50
    },
    {
      "origin": [ 10, 10 ],
      "width": 50,
      "height": 100
    }
  ]
  ```
  Where `origin[0]`, `origin[1]` is the x, y coordinates of the top left corner of the region.
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
