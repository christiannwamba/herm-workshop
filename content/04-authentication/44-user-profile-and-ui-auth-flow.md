---
title: "4.4 User Profile & UI Auth Flow"
metaTitle: "User Profile & UI Auth Flow"
---

We have been using placeholder data for our web app — it’s time it got some real data. For the navbar, I currently have my name and placeholder image hardcoded:

![](https://paper-attachments.dropbox.com/s_5A9592850EB5756AB35860A9D7B974FC2DC8E996B9F48E0B4CACBC97B681B069_1583736618188_image.png)

Now that users can log in, let’s get their profile information and use it for the navbar.

We also need to protect the home page, which is also the dashboard from unauthorized users. While we are at all these, we can add a logout link to our UI.

Here is what the general auth flow for the UI would look like at the end:

![](https://res.cloudinary.com/codebeast/image/upload/v1592303405/herm-workshop/CleanShot_2020-06-16_at_14.29.39_2x.png)

## Objectives

- Fetch and display user profile
- Add a logout link
- Protect the dashboard/home page from unauthorized access

## Exercise 1: Add a Logout Link

Let’s start with the simpler task — allow users to click on a link to log out. Update the `Header` component in `components/Header.js` to add one more nav menu:

```js
// Import Link
import { Link } from "@chakra-ui/core";

function Header() {
  return (
    <Box backgroundColor="#fafafb" paddingLeft="50px" paddingRight="50px">
      <Flex alignItems="center" justifyContent="space-between" height="50px">
        <Box bg="gray.200" rounded="full">
          <Icon
            name="logo"
            color="brand.500"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
          ></Icon>
        </Box>
        <Flex alignItems="center" justifyContent="space-between">
          <User username="Christian Nwamba"></User>
          <Link href="/api/logout" ml="15px">
            Logout
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
```

You should get a logout link that points to the logout API URL. Click on it to logout.

![](https://paper-attachments.dropbox.com/s_5A9592850EB5756AB35860A9D7B974FC2DC8E996B9F48E0B4CACBC97B681B069_1583738568063_image.png)

## Exercise 2: Display User Profile

**Task 1: Create a Profile API**

Add one more API function in the `api` folder, `me.js`:

```js
import auth0 from "lib/auth0";

export default async function me(req, res) {
  try {
    await auth0.handleProfile(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ error: "Something went wrong" });
  }
}
```

The `auth0.handleProfile` method fetches the user profile.

Go to http://localhost:3000/api/me and you should find data like the following as long as you are logged in:

```js
{
  nickname: 'Christian Nwamba',
  name: 'Christian Nwamba',
  picture: 'https://pbs.twimg.com/profile_images/1105185322084847623/EPx48HPQ_normal.jpg',
  updated_at: '2020-03-09T07:05:56.866Z',
  sub: 'twitter|811098595'
}
```

**A Note on Fetching Data in Next.js**

(Skip to **Task 2** if you know what `getInitialProps` method is in Next.js)

This profile API we just created has no tie with the frontend. Next.js pages and APIs are parallel to each other — there is no connection anywhere between them. To get data from the API via a Next page, we have to do the needful — make an HTTP call.

In React, you would use `componentDidMount` or `useEffect`. This works in Nextjs as well, but the data fetched won’t be known to the server-rendering process so it won’t be rendered on the server. This is why Next.js has a different method called `getInitialProps`. What Next does with this static method is that it calls it early enough, extracts data from it before rendering React to both client and server. Being able to render data on the server-side makes `getInitialProps` a great place to fetch data that we need to render on the server.

Here is `getInitialProps` in its simplest form:

```js
function Index({ name }) {
  return (
    <Layout>
      <Text fontSize="40px" color="brand.500" as="h1">
        Hello, {name}!
      </Text>
    </Layout>
  );
}

Index.getInitialProps = async function () {
  return { name: "Herm" };
};
```

The function returns an object, and the properties in this returned object become the props that we can extract from the `Index` component. That is why we can get `name` from the component and render it.

**Task 2: Update Nav Bar with Profile**

We need to fetch the user profile from `getInitialProps`. Ensure that you are using Next.js 9.4 which has a built in fetch module for both client and server.

Then use it to fetch the users API in the `pages/index.js` file:

```js
function Index({ me }) {
  return (
    <Layout>
      <Text fontSize="40px" color="brand.500" as="h1">
        Hello, {me.name}!
      </Text>
    </Layout>
  );
}

Index.getInitialProps = async function () {
  const me = await fetch("http://localhost:3000/api/me");
  return { me: await me.json() };
};
```

Run the app again. We get an empty name on the page:

![](https://paper-attachments.dropbox.com/s_5A9592850EB5756AB35860A9D7B974FC2DC8E996B9F48E0B4CACBC97B681B069_1583818881770_image.png)

Why did we not get something like `Hello, Ada`? If we look at both the browser dev tool and Nextjs terminal, we get no error. Let’s see if we can get anything by logging the value of `me` to the console:

```js
Index.getInitialProps = async function () {
  const me = await fetch("http://localhost:3000/api/me");
  console.log(me);
  return { me: await me.json() };
};
```

You can see a portion of the logged data shows that the `status` is 401 and that `statusText` is unauthorized:

```js
{
  url: 'http://localhost:3000/api/me',
  status: 401,
  statusText: 'Unauthorized',
  headers: Headers { [Symbol(map)]: [Object: null prototype] },
  counter: 0
}
```

Remember when I told you that Next.js pages and APIs are parallel to each other. They do not share data out of the box, and you must treat them that away. That said, we need to find a way to pass data manually to a page.

Luckily, for every `getInitialProps`, you get a `context` argument passed to it. This argument has information about the request, which means Nextjs attaches request and response information like headers on this argument. If you remember, Auth0 stored auth credentials in the `cookie` so we can retrieve it from the `context` argument:

```js
Index.getInitialProps = async function (context) {
  const me = await fetch("http://localhost:3000/api/me", {
    headers: {
      cookie: context.req.headers.cookie,
    },
  });

  return { me: await me.json() };
};
```

Reload the page again, and you should have a proper greeting:

![](https://paper-attachments.dropbox.com/s_5A9592850EB5756AB35860A9D7B974FC2DC8E996B9F48E0B4CACBC97B681B069_1583819804239_image.png)

To update the navbar profile information, we need to pass the `me` object down to the `Header` component. First, pass it down to the `Layout` component in the `Index` page:

```js
function Index({ me }) {
  return +(
    <Layout me={me}>
      <Text fontSize="32px">Hello, {me.name}</Text>
    </Layout>
  );
}
```

Pass `me` from `Layout` component to `Header` component:

```js
function Layout(
  {
    children,
+   me
  }) {
  return (
    <Box>
+     <Header me={me}></Header>
      <Flex>
        <Sidebar></Sidebar>
        <Main>{children}</Main>
      </Flex>
    </Box>
  );
}
```

Display the name and avatar in the `Header` component:

```js
function Header({
+  me
}) {
  return (
    <Box backgroundColor="#fafafb" paddingLeft="50px" paddingRight="50px">
      <Flex alignItems="center" justifyContent="space-between" height="50px">
        <Box bg="gray.200" rounded="full">
          <Icon
            name="logo"
            color="brand.500"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
          ></Icon>
        </Box>
        <Flex alignItems="center" justifyContent="space-between">
          <User
+            username={me.name}
            // sub="Scheduled for 16th December at 09:30 AM"
          ></User>
          <Link href="/api/logout" ml="15px">
            Logout
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
```

## Exercise 3: Protect Index (Dashboard) Page from Unauthorized Access

There is no point showing the `Index` page if it can’t show data because the data is protected which is the case when you are not logged in:

![](https://paper-attachments.dropbox.com/s_5A9592850EB5756AB35860A9D7B974FC2DC8E996B9F48E0B4CACBC97B681B069_1583821777686_image.png)

What makes a better user experience is to redirect the user to `/api/login` which will take them to Auth0 to login. Update `Index.getInitialProps` to check for error:

```js
Index.getInitialProps = async function (context) {
  const res = await fetch("http://localhost:3000/api/me", {
    headers: {
      cookie: context.req.headers.cookie,
    },
  });

  const me = await res.json();

  if (me.error) {
    console.log(me);
    context.res.writeHead(302, {
      Location: "/api/login",
    });
    context.res.end();
    return;
  }

  return { me };
};
```

Logout, then you should be automatically taken to the login page.

<iframe src="https://player.vimeo.com/video/396626881" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

## Exercise 4: Build Environmental Variable

We saw how to use server environmental variables to protect our secret. The original use-case for an environmental variable is to have different config values for different environments. For example, on a full-blown product with customers, you don’t want to use the same security key in both production and dev.

These days, env variables have inspired different ways to store values that will change. Next.js has a root file called `next.config.js` where you can specify variables that you want to be injected during build. Since Next.js knows when a build is for production vs development, we can put something like our host URLs for prod and dev in this file.

Since the protocol and host of `http://localhost:3000/api/me` will change in production, we should get it from `Next.js`'s env. Create a `next.config.js` file:

```js
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        BASE_URL: "http://localhost:3000",
      },
    };
  }

  return {
    env: {
      BASE_URL: "https://hermapp.azurewebsites.net",
    },
  };
};
```

You can update the following in `index.js` and be assured it will work in both dev and production:

```js
const res = await fetch(`${process.env.BASE_URL}/api/me`, {
  /*...*/
});
```
