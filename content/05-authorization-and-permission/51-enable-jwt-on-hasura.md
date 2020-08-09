---
title: "5.1 Enable JSON Web Token on Hasura"
metaTitle: "Enable JSON Web Token on Hasura"
---

We don't want just admins to have access to our app. We want users to have access, too, but in a limited way. Let's see what we can do about that.


## Objectives
- Setup JWT Secret
- Make Request with JWTs


## Exercise 1: Requests without Admin Secret Request Header

Open the Hasura console if you don't have it currently open:

```bash
# Move into the folder with hasura config
cd herm/api

# Start the console
hasura console --envfile .env/hasura.dev.env
```

Launching the console with the `--envfile` flag tells Hasura to use env config to open a console. The config contains an admin secret which tells Hasura what secret has been used to protect the API. Hasura then attaches this secret to every request you make.

To prove this, uncheck the `x-hasura-admin-secret`, and you should see that you can run queries anymore:


![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584448818209_image.png)


You can either supply an admin secret or use a JWT. With JWT, you can limit access to resources based on role(s) of users.


## Exercise 2a: Enable JWT Mode on Dev

To use JWT for authentication, you have to enable it using either the `--jwt-secret` flag or the `HASURA_GRAPHQL_JWT_SECRET` environmental variable in your `docker-compose.yml` file. This config property takes a value, which is the JWT config.

You can get your Auth0 JWT config from the [Hasura JWT Config Generator](https://hasura.io/jwt-config). Choose Auth0 and enter your Auth0 domain (format: `<username>.auth0.com`). Click **GENERATE CONFIG** afterward to get the config.

![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1585294327226_image.png)


Update our docker-compose file:

```yml
environment:
    HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
    HASURA_GRAPHQL_ENABLE_CONSOLE: false
    HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
    HASURA_GRAPHQL_ADMIN_SECRET: mypowerfulsecretthatyoucantotallyhack
+     HASURA_GRAPHQL_JWT_SECRET: '{"type": "RS512", "key": "-----BEGIN CERTIFICATE---<...KEY HERE...>-----END CERTIFICATE-----\n"}'
```

Restart the app to get the config up and running:

```bash
docker-compose up -d
```

## Exercise 2a: Enable JWT Mode on Prod

If you are using Hasura Cloud, add a new environmental variable by going clicking the _Settings Gear_ on your project. Click on _Env vars_, the _New Env Var_. 

![](../media/authorization/enable-jwt/add_cloud_jwt_secret_env.png)

Select `JWT_SECRET` and paste the secret you have that looks like:

```bash
{"type": "RS512", "key": "-----BEGIN CERTIFICATE---<...KEY HERE...>-----END CERTIFICATE-----\n"}
```

If you deployed to Azure, all you need to do is to update this section of your GitHub Actions workflow file:

```yml
- name: Update Hasura config
      env:
        HASURA_GRAPHQL_ADMIN_SECRET: ${{ secrets.HASURA_GRAPHQL_ADMIN_SECRET }}
+       HASURA_GRAPHQL_JWT_SECRET: ${{ secrets.HASURA_GRAPHQL_JWT_SECRET }}
      run: |
        az webapp config appsettings set \
          --resource-group herm \
          --name hermapi \
          --settings \
            HASURA_GRAPHQL_ADMIN_SECRET=$HASURA_GRAPHQL_ADMIN_SECRET \
+           HASURA_GRAPHQL_JWT_SECRET=$HASURA_GRAPHQL_JWT_SECRET \
            HASURA_GRAPHQL_ENABLE_CONSOLE="false" \
            HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
```

Remember to add a GitHub secret to your repository with the following settings:

1. Name: `HASURA_GRAPHQL_JWT_SECRET`
1. Value: `{"type": "RS512", "key": "-----BEGIN CERTIFICATE---<...KEY HERE...>-----END CERTIFICATE-----\n"}`

## Exercise 3: Get JWT from Next.js App

Before we call Hasura GraphQL API from the Next.js app, let's analyze the JWT we are getting from Auth0 after authorization.

Add one more API page called `/pages/api/jwt.js` with the following:

```js
import auth0 from 'lib/auth0';

export default async function me(req, res) {
  try {
    const sessionData = await auth0.getSession(req);
    res.send(sessionData.accessToken)
    res.end()
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

The `getSession` method parses the auth data stored in the cookie, and one of those is the JWT, which auth0 calls `accessToken`. Make sure you are logged in, then head to http://localhost:3000/api/jwt. You should see your token:


![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584452532257_image.png)


Copy this JWT, head to your Hasura console, add an `Authorization` header with the value: `Bearer <JWT>`:

![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584452725089_image.png)


We still can't run queries even when we have provided a JWT. Why? Let's take a look at the token we provided.

To inspect the token, click the Decode Icon on the right of the JWT before the X close icon:


![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584629455228_image.png)


This will pop open the token details:


![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584629479437_image.png)


You can see an error that says that Hasura claims are not found in the decoded token. Let's add these claims.

