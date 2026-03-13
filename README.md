Stride Story (original name but changed to TrainTrack)

A Running Training Log Web App

Overview

Stride Story is a front-end running training log that allows users to record and manage their workouts in a clean and simple dashboard. The app demonstrates full CRUD functionality (Create, Read, Update, Delete) using JavaScript and stores workout data locally in the browser using localStorage.

This project was created as a midterm assignment to demonstrate working with structured data, user interaction, and responsive interface design.

The application allows runners to track workouts such as runs, walks, cycling sessions, and strength training while maintaining a persistent training history.

Features
Workout Logging

Users can record workout sessions including:

Date

Workout type

Distance (miles)

Duration (minutes)

Effort level

Location

Notes about the workout

CRUD Functionality

The application supports full CRUD operations:

Create
Users can add new workout entries using the form.

Read
Saved workouts are displayed as organized cards in the workout history section.

Update
Existing workouts can be edited to modify/update training information.

Delete
Users can remove workouts they no longer want stored.

Dashboard Summary

The app automatically calculates training statistics and displays them in summary cards:

Total Workouts

Total Miles

Longest Workout

Most Recent Workout

These values update dynamically whenever workouts are added, edited, or deleted.

Search, Filter, and Sort

To make workout history easier to review, users can:

Search notes or locations

Filter workouts by type

Sort workouts by:

Newest

Oldest

Distance (high to low)

Distance (low to high)

Local Data Storage

Workout data is saved in the browser using localStorage. This allows the app to persist data even after the page is refreshed.

All workouts are stored as structured JavaScript objects in a localStorage key called:

strideStoryWorkouts

Responsive Design

The layout uses CSS Grid and responsive styling to adjust across screen sizes. Summary cards and workout cards reorganize for smaller screens to maintain readability and usability.

Technologies Used: HTML5, CSS3, JavaScript (ES6), LocalStorage API, CSS Grid & Flexbox

This version of the project uses a front-end architecture without frameworks. Future versions could be implemented using React components.

Project Structure
stride-story/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md

How to Run the Project

Download or clone the project files.

Open the project folder.

Launch index.html in a web browser.

No server or build tools are required.

Future Improvements

Potential enhancements for future versions include:

React component architecture

Data visualization for weekly mileage

Export workout history

Cloud database integration

User authentication

Training calendar view

Author: Michelle Hokeness
