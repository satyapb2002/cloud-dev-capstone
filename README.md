# Excercise Tracker Application

This project has an application that could track the excercises you do and the calories you burm.

To implement this project, TODO application is used as a base application. The project uses AWS Lambda and Serverless framework to list, add, update, delete reviews

# Functionality of the application

This application will allow creating/removing/updating/fetching Excercise items. Each Excercise item can optionally have an attachment image. Each user only has access to REVIEW items that he/she has created.


# Excercise items

The application should store Excercise items, and each Excercise item contains the following fields:

* `excerciseId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `Name` (string) - name of the excercise
* `calories` (string) - Calories burned
* `attachmentUrl` (string) (optional) - a URL pointing to an image of the item

UserId is also stored to indicate the user who created a excercise item.


# Frontend

The `client` folder contains a web application that can use the API developed in the project.

This frontend works with the serverless backend which is already deployed. `client/src/config.ts` file includes required authantication and endpoint url information

```ts
export const apiEndpoint = 'https://hq718d33ab.execute-api.us-east-1.amazonaws.com/dev'

export const authConfig = {
  domain: 'dev-zvgieoe9.us.auth0.com',
  clientId: '6X1QUppyCHd1Sfxx6jIILogmmbnrTeKJ',
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

The application is deployed with the following commands: 

apiEndpoint = 'https://hq718d33ab.execute-api.us-east-1.amazonaws.com/dev'

```
cd backend
npm install
sls deploy -v
```

## Frontend

`client/src/config.ts` file includes required authantication and endpoint url information. Run the following commands to start frontend application:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless REVIEW application.

# Postman collection

A Postman collection that contains sample requests is also added to project. You can find a Postman collection in this project. 

# Screenshots

Client Deployment Success

![Alt text](Images/client.JPG?raw=true "client deployemnt")

Backend Deployment Success
![Alt text](Images/successfuldeployment.JPG?raw=true "backend deployemnt")

Application Screenshot
![Alt text](Images/screenshot.JPG?raw=true "Application")

