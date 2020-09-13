---
title: "6.4 Handle Events with Serverless Functions"
metaTitle: "Tweet posts scheduled using Twitter's API"
---

In the previous section, we added the functionality to allow creating of posts and then scheduling them using Hasura events. We also added a webhook URL to the events that hasn't been created yet.

In the section, we want to achieve the following:

## Objectives

- Create a Serverless Function
- Send out scheduled posts using the Twitter API

## Exercise 1: Create a Serverless Handler

In the previous section, you added a handler pointing to ()[http://localhost:7071/api/postTweet]. Right now, as expected, if you visit the URL, nothing happens. Let’s create a serverless function to handle the request coming in from that URL.

Head into the `api` folder and create a new serverless function:

```
# Create a function
func new
```

Choose `HTTP trigger` for template. When asked for the function name, use `event_postTweet`.

`event_postTweet/index.js` is where you will write your handler logic.

Similar to the `checkAndRegister` action, prefix the `postTweet` function with `event_` to tell that the serverless function is tied to a Hasura event.

Update the `route` of the new function to point to `postTweet` rather than `event_postTweet`.

```yml
{
  "bindings":
    [
      {
        "authLevel": "function",
        "type": "httpTrigger",
        "direction": "in",
+       "route": "postTweet",
        ...,
      },
      ...,
    ],
}
```

Start the functions using the following command:

```bash
func start
```

You should see the the new route registered

> Insert command screenshot

## Exercise 2: Write a Serverless Handler

Update the `event_postTweet/index.js` file with the content below:

```js
const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
  } catch (error) {
    context.res = {
      headers: { "Content-Type": "application/json" },
      status: 400,
      body: error,
    };
    return;
  }
};
```

To interact with the Twitter API, you'll need to install a lightweight library to assist with that. Run the following command within the `api` directory to install the library:

```bash
npm install twitter-lite
```

Next, we'll setup the Twitter Client using your application keys. To tweet on behalf of a user using the API, you'll need your:

- Consumer API key - from the Twitter developer dashboard
- Consumer API Secret - from the Twitter developer dashboard
- Access token key - obtained during sign up
- Access token secret - obtained during sign up

Copy your `Consumer API Key` and `Consumer API Secret` as shown below:

![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734667083_image.png)

Add the API key and secret to the `local.settings.json` file:

```yml
{
  "IsEncrypted": false,
  "Values":
    {
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "AzureWebJobsStorage": "",
      "GRAPHQL_BASE_API": "http://localhost:3100",
+     "CONSUMER_API_KEY": "YOUR_API_KEY",
+     "CONSUMER_API_SECRET": "YOUR_API_SECRET",
    },
}
```

Import the Twitter Client:

```yml
  const fetch = require('node-fetch');
+ const Twitter = require('twitter-lite');
```

And then initialize the Twitter client within the `try` block:

```js
const { headers, payload } = req.body;
const keys = await getAccessKeys(payload.user_id);

const client = new Twitter({
  consumer_key: process.env.CONSUMER_API_KEY,
  consumer_secret: process.env.CONSUMER_API_SECRET,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret,
});
```

We also need the user's `access_token` and `access_token_secret` to initialize the client. The `getAccessKeys` function fetches an account user with a `user_id` matching the `user_id` of the post.

Update the file with the `getAccessKeys` function:

```js
module.exports = async function (context, req) {
  try {
    ...
  } catch (error) {
   ...
    return;
  }
};

const getAccessKeys = async (userId) => {
  const query = `
  {
    account_user(where: {user_id: {_eq: ${userId}}}) {
      account {
        access_token
        access_token_secret
      }
    }
  }
  `;
  const res = await makeRequest(`${process.env.GRAPHQL_BASE_API}/v1/graphql`, {
    query,
  });
  const { account_user } = res.data;
  const {
    account: { access_token, access_token_secret },
  } = account_user[0];

  return { access_token_key: access_token, access_token_secret };
};

const makeRequest = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

```

As the `user` role doesn't have `select` access for sensitive data like the `access_token` and `access_token_key`, we'll need admin access to fetch the information. The Hasura admin secret provides admin level access.

Update the `local.settings.json` file with the admin secret:

```yml
{
  "IsEncrypted": false,
  "Values":
    {
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "AzureWebJobsStorage": "",
      "GRAPHQL_BASE_API": "http://localhost:3100",
      "CONSUMER_API_KEY": "YOUR_API_KEY",
      "CONSUMER_API_SECRET": "YOUR_API_SECRET",
+     "HASURA_GRAPHQL_ADMIN_SECRET": "mysupersecretkey"
    },
}
```

After initializing the client, we need to `post` to `statuses/update` using the client:

```yml
  try {
    ...
    const client = new Twitter({
      consumer_key: process.env.CONSUMER_API_KEY,
      consumer_secret: process.env.CONSUMER_API_SECRET,
      access_token_key: keys.access_token_key,
      access_token_secret: keys.access_token_secret,
    });

+   const tweet = await client.post('/statuses/update', {
+    status: req.body.payload.text,
+   });

    context.res = {
      headers: { 'Content-Type': 'application/json' },
      body: tweet,
    };
  }
```

Posting to `/statuses/update` with the `text` sends a tweet from the user's Twitter account. After posting the tweet, we need to flag that post as completed by updating the `is_pending` flag from `true` to `false`.

Add the following function to the bottom of the file:

```js
const updatePostStatus = async (postId) => {
  const query = `
  mutation {
    update_scheduled_post_by_pk(pk_columns: {id: ${postId}}, _set: {is_pending: false}) {
      is_pending
    }
  }
  `;
  return await makeRequest(`${process.env.GRAPHQL_BASE_API}/v1/graphql`, {
    query,
  });
};
```

Then, call the `updatePostStatus` with the `postId` to update the `is_pending` field of the post:

```yml
  try {
    ...

    const client = new Twitter({
      ...
    });

    const tweet = await client.post('/statuses/update', {
      status: req.body.payload.text,
    });

+   await updatePostStatus(payload.id);
    context.res = {
      headers: { 'Content-Type': 'application/json' },
      body: tweet,
    };
  }
```

When the event calls our endpoint upon execution, the post should be processed successfully.

Open your console:

```bash
hasura open --envfile .env/hasura.dev.env
```

Head to the **Events** > **One-off scheduled posts** > **Processed Events** page and you should see all processed events here:

> Screenshot showing processed events

