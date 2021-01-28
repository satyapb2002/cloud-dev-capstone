# Udacity ToDos Serverless capstone project

## Project Components
- Restful API (Lambda Functions, API Gateway and DynamoDb)
- Client (React)

## How to run the application
### Deploy Backend
To deploy an application run the following commands:

```bash
cd backend
npm install
sls deploy -v
````
### Update frontend configuration
```js
const apiId = '2z9sdic1hj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  
  domain: 'dev-tk2m75mz.auth0.com',            // Auth0 domain
  clientId: '0Z4ZocBelgfq4S85jyOJTxVv10h1wmr1',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```
### Frontend
```bash
cd client
npm install
npm run start
```

## Current Deplyment details
API Endpoint
```
https://2z9sdic1hj.execute-api.us-east-1.amazonaws.com/dev/todos
```
Postman Collection
```
Udacity Cloud developer capstone.postman_collection.json
```
