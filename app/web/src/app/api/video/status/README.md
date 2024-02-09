# Video Status API

## Expects

- `filename`: used value returned by `/api/video/upload`

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
