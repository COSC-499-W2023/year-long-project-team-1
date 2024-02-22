# Video API

Fetch videos from S3 (output bucket). If provided with videoId, the api returns presigned url and tag for one video only. Otherwise, the api returns result for a list of videos linked to the apptId.

## Endpoint

```json
POST /api/video?apptId=<appointment id>&videoId=<video id>
```

Query params:

- `apptId`: Appointment ID.
- `videoId` (optional): Video S3 key

For example:

```json
http://localhost:3000/api/video?apptId=1
http://localhost:3000/api/video?apptId=1&videoId=testuser1-ngan-test-20240221T051427.mp4
```

## Response

```json
Request: http://localhost:3000/api/video?apptId=1&videoId=testuser1-ngan-test-20240221T051427.mp4
{
    "data": [
        {
            "url": "https://privacypal-output.s3.ca-central-1.amazonaws.com/testuser1-ngan-test-20240221T051427.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQ5PUXWWXUCHJS2E3%2F20240222%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240222T075046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aDGNhLWNlbnRyYWwtMSJIMEYCIQDTqk9iCdPghb%2BUE3XcTqradYxrtGr3sFKLjdM7Re57MAIhAIEAw%2FQiaNGZs9FPXovHfwBiea9URpWDM5b6qSFSGl47KooDCFgQABoMMDYzMzI3MTU1NjMxIgyugBPC37wBmyK5Qs0q5wL%2BW%2BGUiGd0Wr4m1mJBbAIdS3XYzkSAhfpKOolvgvFvyI0zqrdAx%2Bo1iPpVCpUkLoNNpBw5%2BBEWOo42%2BqgI5du71uXtrSnNLYervVNSUSHlKVpw1oTGmtVj4cU4rG59s8AzJ0Xj8vBpqEpP1Q20m2aVMV%2BRoDYFwkD7%2FhWI7vxU35IXifp3o7H6%2Br4TarwWLSVAI0lAtFSltix%2FTw7D2nMYp4v9kxndiusTfbhiInfUMms0nJwzV9XILoeQioAvkeipu89P2U063XJJHpg1JH79CFgL8SCLSLh%2BXjaukqtYod17YyEX61ujggHM469o1UTzYt%2FhyKIJXy5rEMty8KKJXHxWW2SWt5M1fswrPQZkGmnQCEnCyCLj0CwYFb8koXs3Ak9tWSf6RjQJGJTEh9URJEpYFd4HX9PPT3YhxkM0YdNB%2FlvYI2eWd%2FcHiCgqcqLjEak%2Fr3Lwyo04014DqvK%2BBwoeNNpkfTCK4NuuBjqlAXeCCA%2BI49S8VDgU4PzcYWq6i7Zk6cTJDGBLTnPU1kIeJLwtcz%2BKFSyYXfej18p5KlCM6vB3cgOmMFoOZID%2FvWxfJ5qOdbpQ%2Fo7y%2ByoGfCGWFTUF4PyqLtiz1wOwZsMPzHAjsYdDv4VAKUU4TSLVKVmdPKYDWuzpNpikXa0sGwLyDzKmYlQ8jywXjwsx5WodVT5GrNQu6L5jFHOtsqg7uCPGeZxSiA%3D%3D&X-Amz-Signature=d76aa44f27801974e4ea56345043e9da5f48011758e2cc0012c493af7478918e&X-Amz-SignedHeaders=host&x-id=GetObject",
            "tags": [
                {
                    "Key": "privacypal-status",
                    "Value": "UnderReview"
                }
            ]
        }
    ]
}
```

```json
Request: http://localhost:3000/api/video?apptId=1
{
    "data": [
        {
            "url": "https://privacypal-output.s3.ca-central-1.amazonaws.com/testuser1-ngan-test-20240222T074437.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQ5PUXWWXUCHJS2E3%2F20240222%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240222T075046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aDGNhLWNlbnRyYWwtMSJIMEYCIQDTqk9iCdPghb%2BUE3XcTqradYxrtGr3sFKLjdM7Re57MAIhAIEAw%2FQiaNGZs9FPXovHfwBiea9URpWDM5b6qSFSGl47KooDCFgQABoMMDYzMzI3MTU1NjMxIgyugBPC37wBmyK5Qs0q5wL%2BW%2BGUiGd0Wr4m1mJBbAIdS3XYzkSAhfpKOolvgvFvyI0zqrdAx%2Bo1iPpVCpUkLoNNpBw5%2BBEWOo42%2BqgI5du71uXtrSnNLYervVNSUSHlKVpw1oTGmtVj4cU4rG59s8AzJ0Xj8vBpqEpP1Q20m2aVMV%2BRoDYFwkD7%2FhWI7vxU35IXifp3o7H6%2Br4TarwWLSVAI0lAtFSltix%2FTw7D2nMYp4v9kxndiusTfbhiInfUMms0nJwzV9XILoeQioAvkeipu89P2U063XJJHpg1JH79CFgL8SCLSLh%2BXjaukqtYod17YyEX61ujggHM469o1UTzYt%2FhyKIJXy5rEMty8KKJXHxWW2SWt5M1fswrPQZkGmnQCEnCyCLj0CwYFb8koXs3Ak9tWSf6RjQJGJTEh9URJEpYFd4HX9PPT3YhxkM0YdNB%2FlvYI2eWd%2FcHiCgqcqLjEak%2Fr3Lwyo04014DqvK%2BBwoeNNpkfTCK4NuuBjqlAXeCCA%2BI49S8VDgU4PzcYWq6i7Zk6cTJDGBLTnPU1kIeJLwtcz%2BKFSyYXfej18p5KlCM6vB3cgOmMFoOZID%2FvWxfJ5qOdbpQ%2Fo7y%2ByoGfCGWFTUF4PyqLtiz1wOwZsMPzHAjsYdDv4VAKUU4TSLVKVmdPKYDWuzpNpikXa0sGwLyDzKmYlQ8jywXjwsx5WodVT5GrNQu6L5jFHOtsqg7uCPGeZxSiA%3D%3D&X-Amz-Signature=d76aa44f27801974e4ea56345043e9da5f48011758e2cc0012c493af7478918e&X-Amz-SignedHeaders=host&x-id=GetObject",
            "tags": [
                {
                    "Key": "privacypal-status",
                    "Value": "UnderReview"
                }
            ]
        },
        {
            "url": "https://privacypal-output.s3.ca-central-1.amazonaws.com/testuser1-ngan-test-20240222T075030.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQ5PUXWWXUCHJS2E3%2F20240222%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240222T075046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aDGNhLWNlbnRyYWwtMSJIMEYCIQDTqk9iCdPghb%2BUE3XcTqradYxrtGr3sFKLjdM7Re57MAIhAIEAw%2FQiaNGZs9FPXovHfwBiea9URpWDM5b6qSFSGl47KooDCFgQABoMMDYzMzI3MTU1NjMxIgyugBPC37wBmyK5Qs0q5wL%2BW%2BGUiGd0Wr4m1mJBbAIdS3XYzkSAhfpKOolvgvFvyI0zqrdAx%2Bo1iPpVCpUkLoNNpBw5%2BBEWOo42%2BqgI5du71uXtrSnNLYervVNSUSHlKVpw1oTGmtVj4cU4rG59s8AzJ0Xj8vBpqEpP1Q20m2aVMV%2BRoDYFwkD7%2FhWI7vxU35IXifp3o7H6%2Br4TarwWLSVAI0lAtFSltix%2FTw7D2nMYp4v9kxndiusTfbhiInfUMms0nJwzV9XILoeQioAvkeipu89P2U063XJJHpg1JH79CFgL8SCLSLh%2BXjaukqtYod17YyEX61ujggHM469o1UTzYt%2FhyKIJXy5rEMty8KKJXHxWW2SWt5M1fswrPQZkGmnQCEnCyCLj0CwYFb8koXs3Ak9tWSf6RjQJGJTEh9URJEpYFd4HX9PPT3YhxkM0YdNB%2FlvYI2eWd%2FcHiCgqcqLjEak%2Fr3Lwyo04014DqvK%2BBwoeNNpkfTCK4NuuBjqlAXeCCA%2BI49S8VDgU4PzcYWq6i7Zk6cTJDGBLTnPU1kIeJLwtcz%2BKFSyYXfej18p5KlCM6vB3cgOmMFoOZID%2FvWxfJ5qOdbpQ%2Fo7y%2ByoGfCGWFTUF4PyqLtiz1wOwZsMPzHAjsYdDv4VAKUU4TSLVKVmdPKYDWuzpNpikXa0sGwLyDzKmYlQ8jywXjwsx5WodVT5GrNQu6L5jFHOtsqg7uCPGeZxSiA%3D%3D&X-Amz-Signature=31bb1e74e51a1263083298d806555f0f02a0720ea2cf091a2a23adf26d5d77bd&X-Amz-SignedHeaders=host&x-id=GetObject",
            "tags": [
                {
                    "Key": "privacypal-status",
                    "Value": "UnderReview"
                }
            ]
        }
    ]
}
```
