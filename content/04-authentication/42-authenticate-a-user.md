---
title: "4.2 Authenticate a User"
metaTitle: "Authenticate a User"
---

Let’s use the Auth client and API we created to authenticate a user from our Next.js app.


## Objectives
- Configure Next.js for Authentication
- Log a user in
- Log a user out
- Setup server-side environmental variables

## Exercise 1: Configure Auth0 in Next.js

You can use the client and API details of the Auth0 client and API you created to configure Next.js for authentication.

Back to our Nextjs `app` folder. Create a `lib` folder in the project and add a `auth0.js` file with the following content:

```js
import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  domain: '<AUTH0_DOMAIN>',
  clientId: '<AUTH0_CLIENT_ID>',
  clientSecret: '<AUTH0_CLIENT_SECRET>',
  scope: 'openid profile',
  audience: '<API_IDENTIFIER>',
  redirectUri: 'http://localhost:3000/api/callback',
  postLogoutRedirectUri: 'http://localhost:3000/',
  session: {
    // Use any strong secret to protect your cookie
    cookieSecret: '<RANDOMLY_GENERATED_SECRET>',
    // Set cookie valid life time to one day
    cookieLifetime: 60 * 60 * 24,
    // Make sure requesting domain and cookie domain are the same
    cookieSameSite: 'lax',
    // Store user credentials in session cookie
    storeIdToken: true,
    storeAccessToken: true,
    storeRefreshToken: true
  }
});
```

The values that start and end with `<` and `>` respectively should be replaced with your credentials. The `cookieSecret` should be treated like a very strong and long password.

It is ok if it bothers you that `clientSecret` and `cookieSecret` should be in this file. This is a client project, right? You should never allow these kinds of credentials in a project that exposes them to the browser.

Since Next.js does server-side rendering too, what we can do is make sure only the server layer of Next.js has access to it. Next.js only exposes pages to a client but does not allow access to other files in your project. Pages are anything in the `pages`  folder excluding the `pages/api` folder. Since `pages` folder is the only way to expose content to the client, the credentials we have in `lib/auth0.js` will not leak to the client.

The value of the `audience` should be the value of your API identifier. Mine is `https://api.herm.dev`.

Install the Auth0 SDK for Next.js which we are importing in the file:

```bash
npm install --save @auth0/nextjs-auth0
```

## Exercise 2: Authenticate a User

Let’s take our auth setup for a test drive.

**Task 1: Login**

First things first, let’s login. Create a `pages/api` folder and add a `login.js` file:

```js
import auth0 from '../../lib/auth0';

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

Next.js API is like a serverless function that lives in `pages/api`. You can use them for two things:

1. Treat them like a server for your Next.js client pages
2. Use them as proxies that intercept requests meant for another API

In the `login` function, we are using it as a proxy because we can’t expose our Auth0 credentials in regular pages. What this function does is to use the configuration we setup in `lib/auth0` to send another request to the Auth0 server and authenticate a user.

The `auth0.handleLogin` makes the request to the Auth0 server. This method is exposed after we initialized the Auth0 SDK by calling the `initAuth0` function in the `lib/auth0` page.

Importing `lib/auth0` like this `../../lib/auth0` feels tedious. We can make the root of our project a base for importing so we can simply import like `lib/auth0`:

Create a `jsconfig.json` at the root of your project and paste the following settings:

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

Then replace the import in `login.js with:

```javascript
import auth0 from 'lib/auth0';
```

Save and restart the app with `npm run dev`, then go to http://localhost:3000/api/login

![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583654971938_image.png)

You will be redirected to your Auth0 domain to Sign Up or Log in. Try signing up by clicking the **Sign Up** tab, entering your **email**, and **password** and click **SIGN UP** button.

![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583655040183_image.png)


You will be asked to confirm that you want to authorize the client to have access to your profile. Confirm, and you will be redirected to your app with a 404


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583655172242_image.png)


We are getting a 404 because we are yet to add a `pages/api/callback.js` to handle our authentication. Wondering how Auth0 knows to redirect you to this page? This is because you specified the URL in the Auth0 config and also told Auth0 about the URL when we created the client.

**Task 2: Auth Callback**

Add a `pages/api/callback.js` with the following:

```js
import auth0 from 'lib/auth0';

export default async function callback(req, res) {
  try {
    await auth0.handleCallback(req, res, { redirectTo: '/' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

The `handleCallback` method processes the credentials received from Auth0 after the authentication and stores them as a session cookie. It also takes a third option argument where you can specify what page it should redirect to after storing the credentials.

Try the login process again (http://localhost:3000/api/login), and you should be redirected to the home page afterward.

You can confirm that login was successful by going to the developer tools. When you have it open, click on the Applications tab and expand the Cookies section from the side menu. Choose the domain, and you should see a `a0` (stands for Auth0) cookie:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583655881901_Screen+Shot+2020-03-08+at+12.22.33+PM.png)


**Task 3: Logging Out**

To log out, add another api file named `logout.js` in the `api` folder:

```js
import auth0 from 'lib/auth0';

export default async function logout(req, res) {
  try {
    await auth0.handleLogout(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

Visit the logout page (http://localhost:3000/api/logout), and you will be redirected to the home page. Go to the dev tool again, and you should see that your cookie has been deleted.


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583656790058_image.png)



## Exercise 3: Setup Environmental Variables

We talked earlier about how safe it is to have credentials in a Next.js app as long as it is not exposed in the `pages` folder. There is another way these credentials can leak, and that is source control.

You might be tempted to push your credentials to Github because you need it in production as well. Even when your Github repository is private, there are still changes these credentials can end up in the wrong hands.

A better way to protect the credentials is to store them in environmental variables. These variables are stored in a `.env` file at the root of your project but excluded in source control with `.gitignore` (you can take a look at your `.gitignore` file to ensure that `.env` is NOT in there).

**Task 1: Create Environmental Variables**

Create a `.env`  file with the following:

```bash
APP_BASE_URL="http://localhost:3000"
AUTH0_DOMAIN="<AUTH0_DOMAIN>"
AUTH0_CLIENT_ID="<AUTH0_CLIENT_ID>"
AUTH0_CLIENT_SECRET="<AUTH0_CLIENT_SECRET>"
AUTH0_COOKIE_SECRET="<AUTH0_COOKIE_SECRET>"
AUTH0_REDIRECT_URL="http://localhost:3000/api/callback"
```

Install a `.env` parser

```bash
npm install --save dotenv
```

The `dotenv` module is a node module that helps you parse credentials in `.env` file and makes them available on the `process.env` object.

**Task 2: Create a Config File**

It is a good practice to have a single general place where all your config lives and can change. Create a `config.js` file in the `lib` folder:

```js
require('dotenv').config()
export default {
  baseUrl: process.env.APP_BASE_URL,
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    cookieSecret: process.env.AUTH0_COOKIE_SECRET,
    redirectUrl: process.env.AUTH0_REDIRECT_URL
  }
};
```

To attach the env variables on `process.env`, you need to require the `dotenv` module and set it up with the `config` method.

**Task 3: Use Config**

You can use these configs in `lib/auth0.js`:

```js
  import { initAuth0 } from '@auth0/nextjs-auth0';
+ import config from './config';

export default initAuth0({
+ domain: config.auth0.domain,
+ clientId: config.auth0.clientId,
+ clientSecret: config.auth0.clientSecret,
  scope: 'openid profile',
  audience: '<AUTH0_AUDIENCE>',
+ redirectUri: config.auth0.redirectUrl,
+ postLogoutRedirectUri: config.baseUrl,
  session: {
    // Use a strong secret to protect your cookie
+   cookieSecret: config.auth0.cookieSecret,
    // Set cookie valid life time to one day
    cookieLifetime: 60 * 60 * 24,
    // Make sure requesting domain and cookie domain are the same
    cookieSameSite: 'lax',
    // Store user credentials in session cookie
    storeIdToken: true,
    storeAccessToken: true,
    storeRefreshToken: true
  }
});
```

