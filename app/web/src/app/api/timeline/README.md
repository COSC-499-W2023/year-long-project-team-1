# Appointments API

- Fetch list of messages and video urls in chronological order

## Endpoint

```json
GET /api/timeline
```

## Query param

- apptId: appointment id to fetch the timeline

Example:

```http
http://localhost:3000/api/timeline?apptId=1
```

## Response

```json
{
    "data": [
        {
            "time": "2024-03-01T18:41:12.546Z",
            "message": "another new video 2"
        },
        {
            "time": "2024-03-01T08:32:37.020Z",
            "message": "another new video 2"
        },
        {
            "awsRef": "testuser1-ngan-test-20240301T083227.mp4",
            "url": "https://privacypal-output.s3.ca-central-1.amazonaws.com/testuser1-ngan-test-20240301T083227.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQ5PUXWWXZACOWJNO%2F20240301%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240301T184327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaDGNhLWNlbnRyYWwtMSJGMEQCIG%2F145Q94B%2BIFJ4l9LSTEzVuizLhrLPPZB5%2B3dZGGnRSAiB6XwCao3g2T4mNij56noFFK91q%2Bu8BglEhJM0SDXuSQCqKAwg0EAAaDDA2MzMyNzE1NTYzMSIMC0czN4JUz0LOm1OGKucCEPWve4uQ%2F20QkppGVrSQSeEI56w4ZQlrOsy9iMAttUkhGDt19CpHYaJ9PTwz7AI4rc%2FEQq0P%2B609cncleSYxNM9yVi3gaXk8y%2Fk%2F8UULC%2FT6rd8Nw5LTOOB2r1jOcvHie3Hvfh18Pr71mZk1nFP7A0rs2BPqn2RzZMoj0IOfssLmC2D5AL6BmMIBTlQEdaO4gOSDSOqaJuL0JRWxpMwiDnfwC4YF11GQvMuUcfH8HnTY2Uos8US9GB%2F%2BQZ5Q0yAPUXSTJkxP6%2F8RLfiqsmmGo%2FXV3Da1oiYfZa9BAT60i08p0RWzXEZjR4ETXQftmqgNAWH71Ook4cyCl8ZNstF9kbpFe1e9JzRCAdoKyC42%2FUl4gavGv%2FEDXJ7j6wOglAFv2EPefuOAc91BVRIFAPRqjhirz6zayjYomdWeO0zdg59Ysss%2BTvClLC%2BofMaQsdwv%2Fz6B59mxsZ%2BsfzRK27LkAfcHO6OcS3ww68CIrwY6pwEzxrLVlx9%2FjSQ%2BNLpNcjdObOWsElXgqJJlIk%2Fs3rS%2FRDRGiqysr2NeeomDuAQaUV5Gc1Xr0tZeTPv4Ie1XmTU1D24UZJRJtd29OvkDLhdIP1BoMby9fdGm7tXR%2FYVI717nXBaMbc6j9Jr3raE0onTqf8htBvlY9ViYQM4BJz5C1d7iAJS2CFuJXcdHEUSQsvue2HklZILuJ%2Bma0ehjcp521fLWxGxFXw%3D%3D&X-Amz-Signature=05f5feaa7e19658b6da67b0f82b29e17dd36f188432332d3e7aaf2fba52faf7d&X-Amz-SignedHeaders=host&x-id=GetObject",
            "tags": [
                {
                    "Key": "privacypal-status",
                    "Value": "UnderReview"
                }
            ],
            "time": "2024-03-01T08:32:28.654Z"
        },
        {
            "time": "2024-03-01T08:32:14.683Z",
            "message": "another new video 1"
        },
        {
            "awsRef": "testuser1-ngan-test-20240301T082918.mp4",
            "url": "https://privacypal-output.s3.ca-central-1.amazonaws.com/testuser1-ngan-test-20240301T082918.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQ5PUXWWXZACOWJNO%2F20240301%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240301T184328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaDGNhLWNlbnRyYWwtMSJGMEQCIG%2F145Q94B%2BIFJ4l9LSTEzVuizLhrLPPZB5%2B3dZGGnRSAiB6XwCao3g2T4mNij56noFFK91q%2Bu8BglEhJM0SDXuSQCqKAwg0EAAaDDA2MzMyNzE1NTYzMSIMC0czN4JUz0LOm1OGKucCEPWve4uQ%2F20QkppGVrSQSeEI56w4ZQlrOsy9iMAttUkhGDt19CpHYaJ9PTwz7AI4rc%2FEQq0P%2B609cncleSYxNM9yVi3gaXk8y%2Fk%2F8UULC%2FT6rd8Nw5LTOOB2r1jOcvHie3Hvfh18Pr71mZk1nFP7A0rs2BPqn2RzZMoj0IOfssLmC2D5AL6BmMIBTlQEdaO4gOSDSOqaJuL0JRWxpMwiDnfwC4YF11GQvMuUcfH8HnTY2Uos8US9GB%2F%2BQZ5Q0yAPUXSTJkxP6%2F8RLfiqsmmGo%2FXV3Da1oiYfZa9BAT60i08p0RWzXEZjR4ETXQftmqgNAWH71Ook4cyCl8ZNstF9kbpFe1e9JzRCAdoKyC42%2FUl4gavGv%2FEDXJ7j6wOglAFv2EPefuOAc91BVRIFAPRqjhirz6zayjYomdWeO0zdg59Ysss%2BTvClLC%2BofMaQsdwv%2Fz6B59mxsZ%2BsfzRK27LkAfcHO6OcS3ww68CIrwY6pwEzxrLVlx9%2FjSQ%2BNLpNcjdObOWsElXgqJJlIk%2Fs3rS%2FRDRGiqysr2NeeomDuAQaUV5Gc1Xr0tZeTPv4Ie1XmTU1D24UZJRJtd29OvkDLhdIP1BoMby9fdGm7tXR%2FYVI717nXBaMbc6j9Jr3raE0onTqf8htBvlY9ViYQM4BJz5C1d7iAJS2CFuJXcdHEUSQsvue2HklZILuJ%2Bma0ehjcp521fLWxGxFXw%3D%3D&X-Amz-Signature=709a00d2e78a7265c674f4ca987e39f8859b12e4719b2f3e82f76831531fc39c&X-Amz-SignedHeaders=host&x-id=GetObject",
            "tags": [
                {
                    "Key": "privacypal-status",
                    "Value": "UnderReview"
                }
            ],
            "time": "2024-03-01T08:29:19.073Z"
        }
    ]
}
```
