---
title: "5.6 Persist Auth Data with Actions"
metaTitle: "Persist Auth Data with Actions"
---

In the previous section, we encrypted the user's Twitter access token — we need to save it to our database if the user does not already exist. We can trust that even if someone gets hold of our database, we still know that our users' Twitter accounts are protected from the encryption.

Since the encrypted data is stored on the JWT, we need to extract it before writing to the database. There is currently no generated mutation to help us achieve this, so we have to write a custom one. You can write a custom mutation using Hasura Actions.


## Objectives
- Create an Action and Action Handler
- Add an Action Permission


## Exercise 1: Create an Action

Actions in Hasura allow you to extend your GraphQL API beyond CRUD operations while still enjoying data exchange based on GraphQL schemas. There are two ways Actions can be useful to you:


1. Write custom logic
2. Intercept mutation and run validation/enhancement logic


![](https://paper-attachments.dropbox.com/s_F2744849DA11E0771F587059724423855744A1B9DC81A0B703400713A913B7D6_1586011690159_Group+7674.png)


[https://graphql-engine-cdn.hasura.io/console/assets/common/img/actions.svg](https://graphql-engine-cdn.hasura.io/console/assets/common/img/actions.svg)

We will see some Actions in action (pun intended) in this workshop, but for now, we are going to use it to save users to our database the first time they log in.

**Task 1: Update Hasura Engine**

Make sure you have up to Hasura `v1.2.0`; Hasura Actions are only supported in `v1.2.0` upwards. If you don’t, all you need to do is update your `docker-compose.yml` file:

```yml
version: '3.6'
services:
 postgres:
 image: postgres:10
 restart: always
 environment:
 POSTGRES_PASSWORD: postgres
 volumes:
 - db_data:/var/lib/postgresql/data
 graphql-engine:
+ image: hasura/graphql-engine:v1.3.0
 ports:
 - "3100:8080"
 depends_on:
 - "postgres"
 restart: always
 environment:
 HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
volumes:
 db_data:
```

**Task 2: Create an Action**

To create an Action, click on the **Actions** menu:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585228958187_image.png)


Click the **Create** button to create an action:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585229107451_image.png)


Create an action by adding a mutation. The name of the mutation is the name of the action, and it should be like your regular GraphQL mutation.

Since our action is supposed to check if a user exists and register them, here is what it should look like:

```gql
type Mutation {
 checkAndRegisterUser : CheckAndRegisterUserOutput
}
```

You should also define the `CheckAndRegisterUserOutput` type in the type definition text box:

```gql
type CheckAndRegisterUserOutput {
 affected_rows : Int!
}
```

![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585229712140_image.png)


The Handler is the serverless function that will be triggered by this mutation. We need to:


1. Specify the url to the serverless API
2. Ask Hasura to forward the headers it receives from the client to the serverless function. This is important because the headers contain our JWT.

In the Handler text box, paste `http://host.docker.internal:7071/api/checkAndRegisterUser`. 

`host.docker.internal` is how Docker communicates to the localhost of your computer so the url on your computer would be `http://localhost:7071/api/checkAndRegisterUser`. We will still create the serverless API to back this endpoint.

Next, click the **Forward client headers to webhook** to forward the headers.


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585230183464_image.png)


Click the **Create** button to save the action

**Task 3: Add User Permission to Action**

After you create an action, it appears on the left of the window:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585230913948_image.png)


Currently, only admins can trigger the action you have just created. We need to let the `user` role trigger the function, too — the function was created for users.

Click on the Permissions tab from the action you just created:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585231247918_image.png)


Enable permission for the user:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585231304858_image.png)


Click **Save** to save the action.

