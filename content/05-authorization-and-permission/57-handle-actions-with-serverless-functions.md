---
title: "5.7 Handle Actions with Serverless Functions"
metaTitle: "Handle Actions with Serverless Functions"
---

We have a custom mutation that we can call from our client app, but the mutation has no handler yet. In Hasura Actions, handlers are like GraphQL resolvers — they are API endpoints that are called to handle a mutation when that mutation runs.

## Objectives
- Create a Serverless Function
- Save encrypted user data to the database


## Exercise 1: Create a Serverless Handler

In the previous section, you added a handler pointing to `http://localhost:7071/api/checkAndRegisterUser`. Right now, as expected, if you visit the URL, nothing happens. Let’s create a serverless function to handle the request coming in from that URL.

Install the serverless function CLI:

```bash
npm i -g azure-functions-core-tools@2 --unsafe-perm true
```

Next head into the `api` folder where your `docker-compose` files live and run the init command to create a function project:

```bash
func init .
```

Chose `node` as the runtime and `javascript` as the language:

![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585236212970_image.png)


This will create the serverless project files for your serverless API which includes a `host.json`, a `local.settings.json`, and a `package.json`. 

Create a new serverless function:

```bash
# Create a function
func new
```

Choose `HTTP trigger` for template. When asked for the function name, use `action_checkAndRegisterUser`.

![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585236402335_image.png)


`action_checkAndRegisterUser/index.js` is where you will write your handler logic. 

We only appended `action_` to the function name to make it easier to tell that the serverless function is tied to a Hasura action. If you run the function, you endpoint path will be `/api/action_checkAndRegisterUser` instead of `/api/checkAndRegisterUser`.

Open `action_checkAndRegisterUser/function.json` and add a `route` property that points to `checkAndRegisterUser`:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
+     "route": "checkAndRegisterUser",
      ...
    },
   ...
  ]
}
```

Now your endpoint path will be `/api/checkAndRegisterUser`.

You can test the function by running:

```bash
func start
```

You should see that the URL we filled in for the Hasura action is now live:


![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585236779241_image.png)

## Exercise 2: Write a Serverless Handler

Delete everything in the `index.js` file and paste the following:

```js
const fetch = require('node-fetch');

module.exports = async function(context, req) {
  try {


  } catch (error) {
    context.res = {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
      body: error
    };
    return;
  }
};
```

The reason we are importing `node-fetch` is because we need to use it to interact with our GraphQL endpoint. Let’s install it:

```bash
npm install --save node-fetch
```

A serverless function is a function export that takes `context` and `req` for request as arguments. You can then do whatever you like and send a response back using `context.res`

**Task 1: Get the Session Variables**

Put the rest of our logic inside the `try` block.

```js
try {
    const { session_variables } = req.body;
    const username = session_variables['x-hasura-user-id'];
    const accessToken = session_variables['x-hasura-access-token'];
    const accessTokenSecret = session_variables['x-hasura-access-token-secret'];
    let affected_rows = 0;
}
```

The good news is, Hasura attaches whatever you set on the Auth0 Hasura namespace to your request’s body as `session_variables`, so you don’t have to hack this yourself. 

`affected_rows` is a variable that we can use to hold the result, as shown in the mutation output we created earlier:

```gql
type CheckAndRegisterUserOutput {
  affected_rows : Int!
}
```

The strategy to use here is that every time a user logs in, we want to ping our API to check if that user exists in our database. If the user does not exist, we can then write them to the database using a mutation.

Let’s create a function that creates a client for interacting with the GraphQL endpoint:

```js
const fetch = require('node-fetch');

module.exports = async function(context, req) {/*...*/};

function createClient(req) {
  async function client(query, variables) {
    try {
      const result = await fetch(`${process.env.GRAPHQL_BASE_API}/v1/graphql`, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          variables
        }),
        headers: { Authorization: req.headers['authorization'] }
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

You can use this `createClient` in your exported function to create a client and set it up with the request:

```js
try {
  const { session_variables } = req.body;
  const username = session_variables['x-hasura-user-id'];
  const accessToken = session_variables['x-hasura-access-token'];
  const accessTokenSecret = session_variables['x-hasura-access-token-secret'];
  let affected_rows = 0;

+ const client = createClient(req);

}
```

Now we need to write two more functions to:


1. Check if the user in the session variable exists
2. Create the user if not

```js
// Check if the user exists
async function userExists(client, username) {
  const GET_USER = `
    query GetUser($username: String) {
      user(where: { username: { _eq: $username } }) {
        username
      }
    }
  `;
  try {
    const result = await client(GET_USER, { username });

    return result.data.user.length > 0;
  } catch (error) {
    throw error;
  }
}

// Create a user
async function createUser(client, payload) {
  const CREATE_ACCOUNT_USER = `
    mutation CreateAccountUser(
      $username: String
      $accessToken: String
      $accessTokenSecret: String
    ) {
      insert_account_user(
        objects: {
          account: {
            data: {
              access_token: $accessToken
              access_token_secret: $accessTokenSecret
              account_name: $username
            }
          }
          user: { data: { username: $username } }
        }
      ) {
        affected_rows
      }
    }
  `;
  try {
    const result = await client(CREATE_ACCOUNT_USER, payload);
    return result;
  } catch (error) {
    throw error;
  }
}
```

The `userExists` function runs a query on the user table to check if a user is there. It returns true or false, depending on whether the user was found or not.

The second function, `createUser`, runs the `insert_account_user` mutation to insert in both the accounts and users table.

Both functions take the client that is returned by the `createClient`. `client` takes the GraphQL operation you need to run (query or mutation) as well as variables.  It can either return data or throw errors.

Now we can use these functions in our exported serverless function:

```js
try {
  const { session_variables } = req.body;
  const username = session_variables['x-hasura-user-id'];
  const accessToken = session_variables['x-hasura-access-token'];
  const accessTokenSecret = session_variables['x-hasura-access-token-secret'];
  let affected_rows = 0;

  const client = createClient(req);
  const isUserExists = await userExists(client, username);

  if (!isUserExists) {
    const result = await createUser(client, { username, accessToken, accessTokenSecret });
    affected_rows = result.data.insert_account_user.affected_rows
  }

  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: {
      affected_rows
    }
  };
}
```

The endpoint for our GraphQL API should be stored in an env variable, and that’s why we used it this way: `process.env.GRAPHQL_BASE_API`. To set this variable, open the `local.settings.json` that was created when you initialized the serverless function and add the URL as shown below:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "{AzureWebJobsStorage}",
+   "GRAPHQL_BASE_API": "http://localhost:3100"
  }
}
```

## Exercise 3: Run Action from Next.js App

Between Auth0 callback and heading back to our home page, we need to call the action we created. It is the perfect time to check if the user that just logged in already exists in our database. If not, we will create the user.

After Auth calls our callback page, instead of redirecting to the home page, we should redirect to a signup page that will call the action. Create a `pages/api/signup.js` file:

```js
import auth0 from 'lib/auth0';
export default auth0.requireAuthentication(async function signup(req, res) {
  try {

    res.writeHead(302, { Location: '/' });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
})
```    

All it does for now is to redirect us to the home page. We want it to do more so let’s create a client that we can use to send GraphQL request to the server:

```js
export default auth0.requireAuthentication(async function signup(req, res) {...});

function createClient(req, res) {
  async function client(query, variables) {
    const tokenCache = await auth0.tokenCache(req, res);
    const { accessToken } = await tokenCache.getAccessToken({
      scope: ['openid', 'profile'],
    });
    try {
      const result = await fetch(`${process.env.APP_BASE_API}/v1/graphql`, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          variables,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
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

The `createClient` function creates gets the access token from Auth and tries to make a request to a GraphQL endpoint based on argument we pass to it.

Create another function that calls the GraphQL API using the client :

```js
async function createClient(req) {...}

async function checkAndRegisterUser(client) {
  const CHECK_USER_QUERY = `
      mutation CheckAndRegisterUser {
        checkAndRegisterUser {
          affected_rows
        }
      }
    `;

  const result = await client(CHECK_USER_QUERY, {});
  return result;
}
```    

Now we can call the `checkAndRegisterUser` function inside the try…catch block of the exported Next.js API signup function while passing it the client:

```js
export default auth0.requireAuthentication(async function signup(req, res) {
  try {
    const client = createClient(req, res);

    await checkAndRegisterUser(client);

    res.writeHead(302, { Location: '/' });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
});
```

Lastly, update the callback endpoint to redirect to the signup API instead of redirecting to the home page:

```javascript
import auth0 from 'lib/auth0';

export default async function callback(req, res) {
  try {
+   await auth0.handleCallback(req, res, { redirectTo: '/api/signup' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

Logout and login again, the following will happen:


1. Auth will redirect to `/api/callback` after auth
2. `/api/callback` will redirect to `/api/signup` after processing auth data
3. `/api/signup` will create a user in our database if the user does not exist and redirect to the home page.

Look into your database, and you should have a new user and account.


![](https://paper-attachments.dropbox.com/s_BCE1B49EA5E42CDF9E89A7A11CF429C987ED038960FF18877CB575886E478249_1585822282451_image.png)


