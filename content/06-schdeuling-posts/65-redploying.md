---
title: "6.5 Publishing changes"
metaTitle: "Re-deploy application and publish local changes to production"
---

We have made a number of changes locally, we need update the production environment to be in sync with the local environment. This includes the API, frontend app and the new serverless function we created to handle the event

## Objectives

- Update environmental variables
- Run migrations
- Deploy Serverless Function

## Exercise 1: Run migrations

Now we longer need to generate migrations because Hasura does this automatically for us. The migrations are all local and we need to get them to the production app.

**Task 1: Generate metadata**

To create metadata based on the current database schema, run the following:

```bash
hasura metadata export \
    --envfile .env/hasura.dev.env
```

You should see an updated content in metadata/tables.yml file

**Task 2: Apply migrations in production**

To apply the local changes to the production environment, run the following commands:

```bash
# Apply migration
hasura migrate apply \
    --envfile .env/hasura.prod.env
```

```bash
# Apply metadata
hasura metadata apply \
    --envfile .env/hasura.prod.env
```

Open the console from the terminal to confirm the migration:

```bash
hasura console \
    --envfile .env/hasura.prod.env
```


You can see that we now have a database structure which in turn generates this GraphQL schema:

## Exercise 2: Deploy new function

Next let's update our functions deployment with the new function.

**Task 1: Update the settings with new environment variables**

We introduced some new environment variables while working with the `event_postTweet` function, run the following command to get those variables in production:

```bash
az functionapp config appsettings set \
    --name <FUNCTION NAME eg. hermserverless> \
    --resource-group <RESOURCE GROUP eg hermserverless> \
    --settings \
    CONSUMER_API_KEY="YOUR_CONSUMER_KEY",
    "CONSUMER_API_SECRET"="YOUR_CONSUMER_SECRET",
    "HASURA_GRAPHQL_ADMIN_SECRET"="yoursupersecretpass"
```

**Task 2: Redeploy the functions**

Run the publish command for the functions:

```bash
func azure functionapp publish <UNIQUE NAME Eg. hermserverless>
```

Upon successful deployment, you should see the following in your terminal

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600681814461_Screenshot+2020-09-13+at+11.15.44+PM.png)

The new function should be visible with your URL.

## Exercise 3: Redeploy Next.js App

The last step of deploying to push our frontend Next.js app to Github, which will trigger a build. But before that, let’s add all those environmental variables we created locally to production:

```bash
az webapp config appsettings set \
    --resource-group herm \
    --name <FRONTEND APP NAME Eg. hermapp> \
    --settings \
    HASURA_GRAPHQL_ADMIN_SECRET=<yoursupersecretpass>
    ACTIONS_BASE_URL=<YOUR_FUNCTIONS_URL>
```

Now go ahead and push to Github then give the build a minute or 2 to complete.
