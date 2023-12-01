# Video Review API

Review a processed video. If accepted, the video is uploaded to S3 shared bucket. After request, all source and processed videos are deleted.

## Endpoint

```json
GET /api/video/review
```

Request body (JSON):
- `apptId`: Appointment ID.
- `filename`: Name of file to review.
- `action`: Action to perform. Can be one of `accept`, `reject` or `noop`.

For example:
```json
{
    "apptId": "1",
    "filename": "test1.mp4",
    "action": "accept"
}
```

## Response

Status `200`: Action is completed. Empty body.
