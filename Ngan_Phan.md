# Personal Log for Ngan_Phan (Team 1)

## 📅 September 25, 2023 - October 1, 2023

### 📋 Tasks Completed

![Tasks completed for October 01, 2023](./tasks/ngan_phan/week4.png)

### 🎯 Work Summary

- Attend meetings.
- Look into data storage structure.
- Refine project plan.

### 🗒️ Additional Notes

No additional notes.

## 📅 October 2, 2023 - October 8, 2023

### 📋 Tasks Completed

![Tasks completed for October 8, 2023](./tasks/ngan_phan/week5.png)

### 🎯 Work Summary

- Attend meetings, finalize code practice plan
- Started designing ER for database
- Read postgresql document

### 🗒️ Additional Notes

No additional notes.

## 📅 October 9, 2023 - October 15, 2023

### 📋 Tasks Completed

![Tasks completed for October 08, 2023](./tasks/ngan_phan/week6.png)
### 🎯 Work Summary

- Attended meetings.
- Worked on ER design.
- Looked into AWS Cognito.
- Drafted system architecture design.
### 🗒️ Additional Notes
#### ER Design

![ER Design](./tasks/ngan_phan/er_design.png)

#### System architecture diagram

![System Architecture Diagram](./tasks/ngan_phan/system_diagram.png)

## 📅 October 15, 2023 - October 22, 2023

### 📋 Tasks in progress

![Tasks completed for October 08, 2023](./tasks/ngan_phan/week7/week7.png)
### 🎯 Work Summary

- Attended meetings.
- Finished ER design.
- Set up aws cognito.
- Set up postgres database for local dev and works in build process.
### 🗒️ Additional Notes
#### ER Design

![ER Design](./tasks/ngan_phan/week7/final_er_design.png)
![AWS User Pool](./tasks/ngan_phan/week7/aws_user_pool.png)

## 📅 October 22, 2023 - October 29, 2023

### 📋 Tasks in progress

### 🎯 Work Summary

- Attended meetings
- Review PR
- Prepare mini presentation

## 📅 October 29, 2023 - November 05, 2023

### 📋 Tasks in progress

![Tasks completed for November 05, 2023](./tasks/ngan_phan/week9.png)

### 🎯 Work Summary

- Attended meetings
- Review PR
- Mini presentation
- Task delegation
- Prepare database init script

## 📅 November 05, 2023 - November 12, 2023

### 📋 Tasks in progress

![Tasks completed for November 05, 2023](./tasks/ngan_phan/week10.png)

### 🎯 Work Summary

- Attended meetings
- Working on database init script

## 📅 November 20, 2023 - November 26, 2023

### 📋 Tasks in progress

![Tasks completed for November 26, 2023](./tasks/ngan_phan/week12/week12.png)

### 🎯 Work Summary

- Attended meetings
- Implemented user data apis 

### Additional Notes

![Api format](./tasks/ngan_phan/week12/api1.png)
![Api format](./tasks/ngan_phan/week12/api2.png)

## 📅 November 26, 2023 - December 03, 2023

### 📋 Tasks in progress

![Tasks completed for November 26, 2023](./tasks/ngan_phan/week13/eval.png)
![Tasks completed for November 26, 2023](./tasks/ngan_phan/week13/doneTasks.png)

### 🎯 Work Summary

- Attended meetings
- Finished user data apis
- Finished video upload and status apis
- Prepare video demo
- Prepare design document

## 📅 December 04, 2023 - December 10, 2023

### 📋 Tasks in progress

![Tasks completed for December 10, 2023](./tasks/ngan_phan/week14.png)

### 🎯 Work Summary

- Attended meetings
- Add API tests
- Write design document
- Record for video demo
- Fix video upload

## 📅 January 8, 2024 - January 14, 2024

![Task completed for January 14](./tasks/ngan_phan/week1_T2.png)

### 🎯 Work Summary

- Attended meetings
- Researched on Amazon Relational Database service
- Looked into how to host Postgresql with AWS

## January 14, 2024 - January 21, 2024

![Task completed for January 21](./tasks/ngan_phan/week2T2/form.png)
![Task completed for January 21](./tasks/ngan_phan/week2T2/gitTask.png)

### 🎯 Work Summary

- Attended team meetings
- Researched on integrating authentication flow with AWS Cognito. Tried out diffrent ways on integrating the service and decided on the best way:
    - Implemented endpoints to connect with APIs provided by Cognito
    - Utilized NextAuth as a proxy


## January 21, 2024 - January 28, 2024

![Task completed for January 21](./tasks/ngan_phan//week3_t2.png)

### Work Summary

- Team meetings
- Finalizing and documenting codes on aws cognito integration
- Refactoring project code to work with new authentication tools
- Reviewing and testing others' PRs
- Helping another team member: the person had problem with running the app in containerization
- Solving problems with nextauth in containerization

## January 28, 2024 - February 4, 2024

![Task completed for February 4](./tasks/ngan_phan/week4_T2.png)

### Work Summary

- Team meetings
- Prepared demo version for peer testing
  - Reviewed and tested PRs
  - Integrated not-yet-merged features from different PRs. Check out branch app-demo-temp
  - Helped team members to run the demo version
- Modified Cognito functioning
  - Removed extra "log in with cognito" step in nextauth
  - Customized cognito log in UI
- Attended peer testing session
- Updated APIs to accomodate new video processing logic (using AWS Lambda)

## February 4, 2024 - February 11, 2024

![Task completed for February 11](./tasks/ngan_phan/week5_T2.png)
![Task completed for February 11](./tasks/ngan_phan/week5_T2(2).png)

### Work Summary

- Team meetings
- Refactored fetching user info process
  - Instead of fetching from postgres, move to cognito
  - Reafactored code to make it work with new storage (cognito)
  - Tested all components and web pages

## February 11, 2024 - February 18, 2024

![Task completed for February 18](./tasks/ngan_phan/week6_T2.png)

### Work Summary

- Team meeting
- Update video upload flow
  - We don't have a route to fetch the processed video from the s3 bucket yet. The current route we have `api/video?apptId=?` only fetches approved videos with reference to apptId in postgres (meaning the video must have been approved and added apptId reference in pg).
  - Solution: To avoid adding a separate API route for fetching review video, we can reuse /api/video route.

## February 25, 2024 - March 3, 2024

![Task completed for February 18](./tasks/ngan_phan/week8_T2.png)

### Work Summary

- Team meeting
- Discuss with team and decide on the task priority and important features need to be present at the peer testing
- Implement `/api/timeline` for professional feedback and message
- Implement `/api/clients` to create new client in cognito
- Implement new client registation ui

## March 3, 2024, - March 10, 2024

![Task completed for March 10](./tasks/ngan_phan/week9_T2.png)

### Work Summary

- Team meeting
- Implement UI for region selection region
  - For the new feature, we need the UI so user can select which region on the video they want to blur
  - Research on available packages that allow canvas selection on React
  - Worked with Paul to fix bug (regions coordinates returned by the components don't match backend api requirement, selection canvas has offset)
- Implement cognito auth flow
  - Originally, we used built-in cognito provider of nextauth. However, this feature many restrictions (e.g ui is not user-friendly, bad-looking)
  - I researched on another to implement auth flow without using hosted UI of cognito and built-in provider of nextauth
    - Used custom provider from nextauth and reimplemented the authorization flow
    - Still got stuck at the user verification step. When user first signs in, they are redirected to change-password page. However, nextauth doesn't provide solution to redirect after signing in so I'm still looking for the other way around.

## March 10, 2024 - March 17, 2024

![Task completed for March 17](./tasks/ngan_phan/week10_T2.png)

### Work Summary

- Team meeting
- Update fetch client api for search functionality
  - Cognito provides limited functionalities to search for users:
    - The filter function for users in user pool only works with one attribute (so can't search for email and username at the same time)
    - The api call to get user in a group (either client or professional) doesn't allow filtering bases on attribute
  - Given the limits of Cognito user list apis as above, I need to implement the filter function from scratch
- Implement UI for user filter feature

## March 18, 2024 - March 24, 2024

![Task completed for March 24](./tasks/ngan_phan/week11T2/gitHubTask.png)
![Task completed for March 24](./tasks/ngan_phan/week11T2/task.png)

### Work Summary

- Team meeting
- Finished UI implementation for user filter feature:
  - Add SWR library to optimize data fetching
  - Clean up code
  - Refactor to reusable components
- Help Linh with AWS SES service:
  - Use AWS SDK to integrate SES service so clients can send feedback to the application admins

![Filter UI](./tasks/ngan_phan/week11T2/filterUI.png)
