---
title: "3.4 Protecting App & Data from The Public"
metaTitle: "Protecting App & Data from The Public"
---

> Feel free to skip this page if you are using Hasura cloud

It is exciting that at this point, when we visit our public production link, everything works, and we can see the Hasura console live.


![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581924138907_image.png)


On second thought, this scares me to death. What this means is that anybody can create tables, add data, delete data — everyone in the world is an admin to your app, including your cat.

What you want is to ensure that only selected administrators like you or your manager can have access to this dashboard/console.


## Objectives

- Allow only **admins** to access the Hasura console

## Exercise 1: Set Local Admin Secret

I am going to bring back this local `.env/hasura.dev.env` you have in your `api` folder once more:

```bash
HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup, http-log, webhook-log, websocket-log, query-log
```

This time, I want you to create a `HASURA_GRAPHQL_ADMIN_SECRET` env variable and set a secret:

```bash
  HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres
  HASURA_GRAPHQL_ENABLE_CONSOLE=true
  HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup, http-log, webhook-log, websocket-log, query-log
+ HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
```

If you reload `localhost:3100`, you should see that the page is still public. The reason is that we need to restart Docker before the new env variable can kick in:

```bash
docker-compose up -d
```

Now try to reload again, and you would get a push back from the app asking you to enter a secret:

![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582008451962_image.png)


## Exercise 2: Set Production Admin Secret

You can already guess from the previous section how we could set the production admin secret. We need to use the `az` config command we have been using to set secrets:

```bash
az webapp config appsettings set \
  --resource-group herm \
  --name hermapi \
  --settings \
    HASURA_GRAPHQL_ADMIN_SECRET="<your prod admin secret>"
```

Azure will automatically restart the server for you:

![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582009327527_image.png)

If you take one more look at your settings, you should see that the `HASURA_GRAPHQL_ADMIN_SECRET` has been set:

![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582009601711_image.png)

Feel free to add this admin secret to your workflow file following the previous section. You can update the config step but remember to add the `HASURA_GRAPHQL_ADMIN_SECRET` to your GitHub secrets:

```yml
- name: Update Hasura config
+   env:
+     HASURA_GRAPHQL_ADMIN_SECRET: ${{ secrets.HASURA_GRAPHQL_ADMIN_SECRET }}
    run: |
      az webapp config appsettings set \
        --resource-group herm \
        --name hermapi \
        --settings \
+         HASURA_GRAPHQL_ADMIN_SECRET=$HASURA_GRAPHQL_ADMIN_SECRET \
          HASURA_GRAPHQL_ENABLE_CONSOLE="true" \
          HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
```