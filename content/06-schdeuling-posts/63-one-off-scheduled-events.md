---
title: "6.3 Scheduling Posts Using Hasura Events"
metaTitle: "Create posts and schedule them using Hasura events"
---

In the previous section, we made reference to a route for creating posts, the route will handle creating of new posts and scheduling them using Hasura events

## Objectives

- Create new API route for creating posts
- Handle post creation
- Schedule one-off events

## Exercise 1: Handle post creation

In the `/pages/api` folder, create a new file `createPost.js`. Open the file and update it with the following:

```js
import createClient from "lib/client";
import fetch from "node-fetch";

export default async function (req, res) {
  try {
    const client = createClient(req, res);
    const result = await createPost(client, req.body);

    res.send(result.data);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}

async function createPost(client, body) {
  const CREATE_POST_QUERY = `
        mutation CreatePost($input: scheduled_post_insert_input!) {
          insert_scheduled_post_one(object: $input) {
            id
            text
            schedule_for
            is_pending
            user_id
          }
        }
    `;
  const result = await client(CREATE_POST_QUERY, {
    input: JSON.parse(body),
  });
  return result;
}
```

In the route, we parse the request body and run a mutation called `insert_scheduled_post`. The result from the mutation is sent as response to the user.

The `/lib/client` file doesn't exist yet, the content of the file is the `createClient` function created in the `signup` route. Create the `client.js` file in the `/lib` folder and add the following content to it:

```js
import auth0 from "lib/auth0";

export const generateToken = async (req, res) => {
  const tokenCache = await auth0.tokenCache(req, res);
  const { accessToken } = await tokenCache.getAccessToken({
    scope: ["openid", "profile"],
  });
  return accessToken;
};

export default function createClient(req, res) {
  async function client(query, variables) {
    const accessToken = await generateToken(req, res);
    try {
      const result = await fetch(`${process.env.APP_BASE_API}/v1/graphql`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          variables,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  return client;
}
```

And then refactor the `signup.js` file to import the `createClient` function:

```yml
import auth0 from 'lib/auth0';
+ import createClient from 'lib/client';

export default auth0.requireAuthentication(async function signup(req, res) {
---
});

async function checkAndRegisterUser(client) {
---
}

- function createClient(req, res) {
-   ...
- }
```

We can now attempt creating a post, head to the browser, enter text in the form field and select the date and time. Submit the form when done.

> Add video showing post creation

Posts can now be created but that's not where it ends, we also want the post to be tweeted at the time provided. To do this, we'll create a one-off Hasura event.

## Exercise 2: Schedule Events

Hasura has what is called **events**, there are three event types in Hasura:

- Event triggers: These are used for running custom logic after insert, update, create and delete events on a table

- CRON triggers: Can be used to run custom logic periodically, like sending out emails.

- One-off scheduled events: One-off Scheduled Events are individual events that can be scheduled to reliably trigger a HTTP webhook to run some custom business logic at a particular timestamp.

We need the One-off scheduled event for this particular task, scheduled events can either be created via the Console or using the API.

To create using the console, click on _Events_ on the navigation bar:

> Annotated Screenshot highlighting the events link and showing the events page

On the _events_ page, click on _One-off scheduled events_ on the sidebar and then the `Schedule an event` tab:

> Annotated Screenshot highlighting the One-off scheduled events link, the schedule an event tab and showing the One-off scheduled events page

To create this event, you'll need a timestamp, webhook, an accompanying payload and optional headers.

Creating this via the console isn't idea because we don't want to manually create events whenever a scheduled post is created. Luckily, we can also create an event using the API.

To create an event, we can send a request containing a body that looks like this:

```js
{
    "type" : "create_scheduled_event",
    "args" : {
        "webhook": "https://httpbin.org/post",
        "schedule_at": "2019-09-09T22:00:00Z",
        "payload": {
            "key1": "value1",
            "key2": "value2"
        },
        "headers" : [{
            "name":"header-key",
            "value":"header-value"
        }],
        "comment":"sample scheduled event comment"
    }
}
```

Upon execution, the provided `webhook` will be called with the `payload` passed as the body. The payload above should be sent to `http://localhost:3100/v1/query` via a POST request. In production, it should be sent to `YOUR_API_URL/v1/query`.

A successful request should return the following response:

```js
{
    "message": "success"
}
```

Head over to the Hasura console, click **Events** > **One-off Scheduled Events** and **Pending Events**. You should see a new event:

> Pending event screenshot

**Task 1: Create scheduled event**

The plan is to create a scheduled event using the timestamp entered by the user. Open the `api/createPost` route and update the content:

```yml
export default async function (req, res) {
  try {
    const client = createClient(req, res);
    const result = await createPost(client, req.body);

+   schedulePost(client, result.data.insert_scheduled_post_one);
    res.send(result.data);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}

async function createPost(client, body) {
  ...
}

const schedulePost = async (client, post) => {
  const data = {
    type: 'create_scheduled_event',
    args: {
      webhook: `${process.env.ACTIONS_BASE_URL}/api/postTweet`,
      schedule_at: post.schedule_for,
      payload: post,
    },
  };
  return makeRequest(`${process.env.APP_BASE_API}/v1/query`, data);
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

The event data contains:

- webhook:  an endpoint to be called to process the event. In our case, the endpoint is `${process.env.ACTIONS_BASE_URL}/api/postTweet`; it is yet to be created, so requests to this endpoint wil fail.
- schedule_at: chosen timestamp for event processing
- payload: data being sent to the endpoint,

Scheduled events can be created by admins only, to create one you'll need the secret password you created earlier on. Update the `.env` file in the frontend app to include the Hasura secret and the `ACTIONS_BASE_URL`:

```yml
  ...
+ HASURA_GRAPHQL_ADMIN_SECRET=<yoursupersecretpass>
+ ACTIONS_BASE_URL=http://localhost:7071
```

Head back to the application in the browser and create a new scheduled post, doing this should create a new pending event in the Hasura console.

> Screenshot showing pending event
