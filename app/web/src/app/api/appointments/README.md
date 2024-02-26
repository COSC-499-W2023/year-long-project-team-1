# Appointments API

- Fetch appointments from postgres based on current username or appointment id
- Add new appointments
- Update existed appointments

## Endpoint

```json
GET /api/appointments
GET /api/appointments?id=1
```

## Response

**GET /api/appointments**

```json
{
    "data": {
        "appointments": [
            {
                "time": "2024-02-21T05:13:48.223Z",
                "clientUsrName": "testuser1",
                "Video": [
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240222T074437.mp4"
                    },
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240222T075030.mp4"
                    },
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240223T200805.mp4"
                    }
                ]
            },
            {
                "time": "2024-02-24T09:42:07.011Z",
                "clientUsrName": "testuser1",
                "Video": []
            }
        ]
    }
}
```

**GET /api/appointments?id=1**

```json
{
    "data": {
        "appointments": [
            {
                "time": "2024-02-21T05:13:48.223Z",
                "clientUsrName": "testuser1",
                "Video": [
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240222T074437.mp4"
                    },
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240222T075030.mp4"
                    },
                    {
                        "apptId": 1,
                        "awsRef": "testuser1-ngan-test-20240223T200805.mp4"
                    }
                ]
            }
        ]
    }
}
```
