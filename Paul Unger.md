# Personal Log for Paul (Team 1)

## 📅 September 25, 2023 - October 1, 2023

### 📋 Tasks Completed

![Tasks completed for September 30, 2023](./tasks/paul/week4.png)



### 🎯 Work Summary

-   brainstorming features and breaking down tasks
-   refining tech stack
-   project plan document

### 🗒️ Additional Notes

No additional notes.


## 📅 October 2, 2023 - October 8, 2023

### 📋 Tasks Completed

![Tasks completed for October 08, 2023](./tasks/paul/week5.png)



### 🎯 Work Summary

-   started learning next.js and the react framework
-   started working on some temp files locally for the video processing backend
-   finalized some git workflow and documentation standards for our project

### 🗒️ Additional Notes

No additional notes.


## 📅 October 9, 2023 - October 15, 2023

### 📋 Tasks Completed

![Tasks completed for October 15, 2023](./tasks/paul/week6.png)



### 🎯 Work Summary

-   made improvements to the video processing backend
-   pushed changes to git on gh-12-* branch
-   looked at ER design and suggested changes during team meeting

### 🗒️ Additional Notes

No additional notes.


## 📅 October 16, 2023 - October 22, 2023

### 📋 Tasks Completed

![Tasks completed for October 22, 2023](./tasks/paul/week6.png)

-   #12 -> video upload endpoint

### 🎯 Work Summary

-   refined video processing server, broke it out into a class with a runnable main() method
-   added functionality for watching a folder and running processing jobs when new files are added
-   added functionality for http POST requests to start processing jobs
-   added full interpolated video processing integration with AWS rekognition
-   wrote some basic tests

### 🗒️ Additional Notes

No additional notes.


## 📅 October 23, 2023 - October 29, 2023

### 📋 Tasks Completed

![Tasks completed for October 29, 2023](./tasks/paul/week8.png)

-   #43 -> fixed a bug where ffmpeg wouldn't always run
-   #46 -> assisted in debugging permissions on video processing server build
-   #11 -> video upload ui

### 🎯 Work Summary

-   assisted Thuan with video processing build issues
-   worked on the backend server and fleshed out our Flask implementation
-   added tests for the Flask server and updated tests for the video processing server
-   made a draft video upload UI

### 🗒️ Additional Notes

No additional notes.


## 📅 October 30, 2023 - November 05, 2023

### 📋 Tasks Completed

![Tasks completed for November 05, 2023](./tasks/paul/week9.png)

-   #65 -> tests for video upload UI
-   #59 -> change python webserver framework

### 🎯 Work Summary

-   made presentation slides and script
-   tested live demo to make sure everything was working (though we didn't get to show it)
-   wrote tests for front end UI elements
-   started research into quart for a new python webserver framework

### 🗒️ Additional Notes

No additional notes.


## 📅 November 6, 2023 - November 12, 2023

### 📋 Tasks Completed

![Tasks completed for November 12, 2023](./tasks/paul/week10.png)

-   #59 -> migrate python http server to reactive/async framework
-   #77 -> implement python server backend to signal next.js that video processing is completed and user can review video

### 🎯 Work Summary

-   continued researching Quart as a replacement for our Python webserver framework
-   migrated web server to Quart and modified tests to work with an async framework
-   switched WSGI provider from gunicorn to uvicorn
-   implemented the python server backend to signal next.js when videos are finished processing

### 🗒️ Additional Notes

No additional notes.


## 📅 November 26, 2023

### 📋 Tasks Completed

![Tasks completed for November 26, 2023](./tasks/paul/week12.png)

-   #45 -> fix a bug where video processing failed if a face went out of frame
-   #77 -> add communication for signalling next.js when a video is completed
-   #167 -> add quart api route for cancelling in-progress video processing

### 🎯 Work Summary

-   debugging some things with thuan resulting from review feature (#77) in quart
-   created a tracker class to keep track of multiple processes at once for the /process_status api route
-   modified interpolation code to handle faces going in and out of frame, or not existing at all
-   using tracker class created in features for #77, added an api route for cancelling in-progress video processing

### 🗒️ Additional Notes

No additional notes.

