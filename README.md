## Electricity App

### Problem statement:
There is village with two electricity providers( Electro, Magneto).
Each user will have meter setup at home and user be will be subscribed to a provider for electricity supply.
Each day meters store number of units consumed in a day by hourly basis.
Now your task is to complete tasks defined below in Task # section



### Setup
1. Install dependencies
    ```bash
    npm install
    ```
2. Run app in dev mode
    ```bash
    npm run dev
    ``` 


## Example Usage

Server will running on `http://localhost:3000`

Users

1. get all users
```bash
    curl -X GET 'http://localhost:3000/users'
```

2. get user by id
```bash
    curl -X GET 'http://localhost:3000/users/1'
```
3. create user
```bash
    curl -X POST -d '{"username":"vinay"}' 'http://localhost:3000/users/1'
```



## Task 1:

1. Fill in the functionality for users APIs defined `src/app.ts`



## Task 2:

```js
const providers = [
    {
        id: 1,
        name: "Electro",
        charge: 5
    },
    {
        id: 2,
        name: "Magneto",
        charge: 10
    },
]
```
1. Create APIs for Providers create, get all, update and delete
provider will
```js
    const provider = { "id" : "provider-name", "charge": 10}
```


## Task 3:

1. Create APIs for user subscribing to providers
`user can choose any one provider`


## Task 4:

1. Create APIs for Meters
Meter will have MeterId, Name, readings

1. API to create meter

```shell
    curl -X GET 'http://localhost:3000/meters'
```

2. API to store meter readings

```shell
    curl -X POST -d '{"units": 5, "time":"2024-05-31T10:00:00.000Z"}' 'http://localhost:3000/meters/1/readings'
```


3. API to get all meter readings

```shell
    curl -X GET 'http://localhost:3000/meters/1/readings'
```



## Task 5
1. A meter will be associated with user i.e., a meter belongs to a user

2. Create an API to return all readings of given user id

3. Create an API to return bill for given user id

bill = total_units * provider_charge

Ex:
user A -> meter A
user A -> Electro
```
readings = [
    { "units":  5, "time": "2024-05-31T10:00:00.000Z" },
    { "units":  7, "time": "2024-05-31T11:00:00.000Z" },
    { "units":  1, "time": "2024-05-31T12:00:00.000Z" }
]

example response: {user_id: 1, amount: 65}
```



## Part 2: Use appropriate REST conventions and status codes

### Task 1

1. So, for everything seems great. However one of the security tester found that all our APIs are exposed publicly i.e., you can get all users information is available to all users.
Your task is secure those data now.

 `GET /users` should be only accessed by admin user
 `GET /users/1` should be only accessed by intended/authenticated user

 Hint: Think of headers?


### Task 2

1. As a user I want to know my past 1 week, 1 month, 2 months of units consumed so that I would like to reduce my usage consumption.

Note: user can request for any number of days.


### Task 3

1. Bill API we developed last time seems to have a bug it is generating amount based on total readings available however bill will generated only for billing cycle

Assume: Billing cycle is always first date of month to last date of month
    ex:  all readings from 1 Jan, 2024 to 31 Jan, 2024 will fall under 1 billing cycle.



### Task 4

1. As a user I would like to know what is best provider I can choose from.
Given system has already has my past usage data I would like to call an API that compares cost against all providers and returns me the top 3 providers( least cost should come first in response list)


### Task 5

1. We've made our `GET /users` more secure now, however one of the developer found that if there large no.of users in the system calling this API to return response is very slow and that developer suggested may be we will implement a solution to return 5 records at a time.

Hint : Think about how do you limit responses to 5 users and how do you fetch next 5 records ?


### Task 6
1. Security researcher found another major issue that we are returning password field when returning data back to client in `GET /users` and `GET /users/:id` and client wants an immediate fix for that.

Hint: How do you ignore sending certain fields from response ? Think of DTOs may be?

### Task 7
1. Our app gain a huge popularity so many users started using it. Since many people are using it our app has slowed other users when one user it and making continuous requests.

ex: when a user makes continuous requests ( lets say 100 requests/sec ) then app becoming unavailable to other users
so one of the developer suggested an approach to implement FUP(Fair Usage Policy) to limit no.of requests a user can make in given time period.

Your task is to build a solution that a user can only make 10 requests in 1 minute. so within 1 minute a user can't make requests more that 10 otherwise will return Too many requests message

ex:
0th second to 60th second
1. `GET /users/1` => is ok
2. `GET /users/1` => is ok
...               => is ok
...               => is ok
10. `GET /users/1` => is ok
11. `GET /users/1` => Too many requests.

61th second ( limit will reset after every minute)
1. `GET /users/1` => is ok

curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"userName":"usha","password":"usha1234","email":"usha@gmail.com","fullname":"ushasri"}'
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"userName":"Achyu","password":"achy1234","email":"achyu@gmail.com","fullname":"achyuthsai"}'

curl -X GET -H "admin-id: 100" "http://localhost:3000/users"

curl -X GET -H "user-id: 1" "http://localhost:3000/users/1"

curl -X POST http://localhost:3000/providers -H "Content-Type: application/json" -d '{"name":"Other2","charge":15}'
curl -X POST http://localhost:3000/providers -H "Content-Type: application/json" -d '{"name":"Other3","charge":20}'

curl -X POST http://localhost:3000/users/1/subscription -H "Content-Type: application/json" -d '{"providerId":1}'

curl -X POST http://localhost:3000/meters -H "Content-Type: application/json" -d '{"name":"Meter1"}'

curl -X POST http://localhost:3000/users/1/meterSubscription  -H "Content-Type: application/json" -d '{"meterId":1}'

 curl -X GET http://localhost:3000/users/1/bill

 curl -X GET http://localhost:3000/meters

curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 10, "time": "2024-05-16T11:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 4, "time": "2024-05-16T15:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 4, "time": "2024-05-18T06:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 4, "time": "2024-05-17T12:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 8, "time": "2024-05-18T11:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-05-19T03:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 6, "time": "2024-05-20T06:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 4, "time": "2024-05-20T04:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 7, "time": "2024-05-20T20:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 0, "time": "2024-05-21T04:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 8, "time": "2024-05-22T05:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 7, "time": "2024-05-21T14:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 5, "time": "2024-05-23T08:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 2, "time": "2024-05-23T06:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 5, "time": "2024-05-23T21:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 8, "time": "2024-05-23T14:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-05-24T18:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 3, "time": "2024-05-24T15:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-05-26T04:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 2, "time": "2024-05-25T11:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 3, "time": "2024-05-26T12:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-05-26T22:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 10, "time": "2024-05-27T17:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 2, "time": "2024-05-27T15:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 6, "time": "2024-05-29T05:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 9, "time": "2024-05-28T10:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-05-30T00:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 0, "time": "2024-05-30T01:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 2, "time": "2024-05-30T20:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 8, "time": "2024-05-30T11:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 0, "time": "2024-05-31T16:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 6, "time": "2024-05-31T19:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 3, "time": "2024-06-01T23:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 2, "time": "2024-06-01T16:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 0, "time": "2024-06-02T10:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 1, "time": "2024-06-03T02:00:00.000Z"}'
curl -X POST http://localhost:3000/meters/1/reading -H "Content-Type: application/json" -d '{"units": 10, "time": "2024-06-04T03:00:00.000Z"}'

curl -X GET http://localhost:3000/users/1/top-providers -H "user-id: 1"

curl -X GET http://localhost:3000/users/1/bill -H "user-id: 1"