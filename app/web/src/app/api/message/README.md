# Appointments API

- Post message linked to an appointment to pg with time

## Endpoint

```json
POST /api/message
```

## Request body

```json
{
    "apptId": 1,
    "message": "another new video 2"
}
```

## Response

```json
{
    "message": {
        "data": {
            "status": 200,
            "title": "OK"
        }
    }
}
```
