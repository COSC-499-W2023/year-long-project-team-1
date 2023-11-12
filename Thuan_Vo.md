# Personal Log for Thuan_vo (Team 1)

## 📅 September 25, 2023 - October 1, 2023

### 📋 Tasks Completed

![Tasks completed for October 01, 2023](./tasks/thuan_vo/week4.png)


### 🎯 Work Summary

- Brainstorm project architectures.
- Refine tech stack for deployment (i.e. k8s).
- Attend meetings.
- Look into container image builds for Next.js.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 2, 2023 - October 8, 2023

### 📋 Tasks Completed

![Tasks completed for October 08, 2023](./tasks/thuan_vo/week5.png)


### 🎯 Work Summary

- Discussion github workflows and git conventions.
- Attend meetings.
- Look into container image builds for Next.js.
- Research into operatorSDK and local development setup.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 9, 2023 - October 15, 2023

### 📋 Tasks Completed

![Tasks completed for October 15, 2023](./tasks/thuan_vo/week6.png)


### 🎯 Work Summary

- Researched and composed a container file to build the image with Next.js.
- Looked into Amazon Elastic Container Registry to host container images.
- Continued researching OpenShift provisioning on AWS.
- Attended meetings.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 16, 2023 - October 22, 2023

### 📋 Tasks Completed

![Tasks completed for October 22, 2023](./tasks/thuan_vo/week7.png)


### 🎯 Work Summary

- Continue looking into Amazon Elastic Container Registry to host container images.
- Continued researching OpenShift provisioning on AWS.
- Reviewed video processing server scaffold.
    - Will need to research on how to pass AWS SSO secrets to containers.
    - Will look into container image build for video processing server.
- Reviewed test framework for web application with Jest.
- Worked with Ngan to research on database init setup and ORM plugins.
- Attended meetings.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 23, 2023 - October 30, 2023

### 📋 Tasks Completed

![Tasks completed for October 30, 2023](./tasks/thuan_vo/week8.png)


### 🎯 Work Summary

- Updated development scripts with Makefile
  - Include targets to build and run container images.
  - Finish for NextJS + Video Processing Server.
- Added a simple CI to run tests on push and PRs.
- Helped build database initialization image.
  - Need to find a way to install prisma CLI instead npx.
- Reviewed test frameworks.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 30, 2023 - November 05, 2023

### 📋 Tasks Completed

![Tasks completed for November 05, 2023](./tasks/thuan_vo/week9.png)

### 🎯 Work Summary

- Helped Ngan with building databae init image.
  - Need to research into how to push initial rows into User table (basic auth).
- Added compose file to run all services as a smoketest.
  - Compose tool must be `v2`+. Otherwise, `depends_on` new syntax won't be not supported.
  - Will extend smoketests with k8s yamls.
- Added some CIs to test service tests (i.e. nextjs & video processor).
  - No tests currently for database.
  - Will need to look into integration tests next.
- Added some CIs to validate PR semantics.
  - PR title, labels, referenced issues/PR.
- Team meetings.
- Mini presentation on Tuesday.

### 🗒️ Additional Notes

No additional notes.

## 📅 November 06, 2023 - November 12, 2023

### 📋 Tasks Completed

![Tasks completed for November 12, 2023](./tasks/thuan_vo/week10.png)

### 🎯 Work Summary

- Restructured the project directories.
  - `front-end` nows becomes `web`. Database stays the same within `web`.
  - `video-processing` is moved out of `back-end`, which is removed.
- Added CI to run container image builds on push to `develop`, and `main`/`master`.
- Set up dependabot configurations.
  - Got a little hiccup with target branch as depdendabot targets default branch. Updated to target `develop` branch.
- Made release `0.1.0-alpha.1` including works since start.
  - Release `0.1.0-alpha.2` is also out to fix dependabot issues above.
- Added some docs on instructions to pull container images from `ghcr.io` now that all images are published.
- Helped Linh set up `podman`.
- Team meetings.


### 🗒️ Additional Notes

Reading break next week. Work hours will be limited.
