---
title: "1.1 Create a Next.js App"
metaTitle: "Create a Next.js App"
metaDescription: "When compared with using only React, Next.js already has server-rendering configured out of the box."
---

Before we dive into the main UI stuff, you are probably wondering why Next.js? When compared with using only React, Next.js already has server-rendering configured out of the box. Even if server-side rendering would have been in easy in a basic React app, as soon as you start daring with features like data fetching, routing, etc., things start getting both messy and challenging.

What Next.js has done really well, is to give us a platform to build React apps on while enjoying all the benefits of rendering these apps on the server.


## Objectives


- Create a Next.js app


## Exercise 1: Create a Next.js App

**Task 1: Create App**

You can either [manually](https://github.com/zeit/next.js/#manual-setup) create a Next.js app or use the `create-next-app` CLI tool. Create a project folder where you want everything regarding herm to live.

```bash
mkdir herm
```

In the new folder you just created, create Next.js app:

```bash
# Install the CLI tool
npm install -g create-next-app

# Create a new app
create-next-app app
```


**Task 2: Run the Next.js app**

Change your directory into the app’s directory and run the app:

```bash
# Change directory
cd app

# Run the app
npm run dev
```

You should get a good-looking Hacker News clone:


![First, run with Next.js starter screen](https://res.cloudinary.com/codebeast/image/upload/v1591516611/CleanShot_2020-06-07_at_11.56.35_2x.png)


## Exercise 2: Reset

To get a clean slate, you need to remove the starter code with the following command.

```bash
# Delete the pages folder
rm -rf pages
```

If you take another look at the app in the browser, you should be getting a nice 404:


![404 after reset](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578846877978_image.png)


At this point, you are wondering why removing those two folders resulted in a 404 page. Well, the way Next.js works is that every file in the `pages` folder must return a React component, and each of these components will serve as web pages.

If Next.js doesn’t find the appropriate file in the pages folder, in this case, `pages/index.js` for `/` route, it will throw a 404. This is nice because you get basic routing stuff for free.

It’s also good to note that, by convention, any other component that does not map to a route should be kept in the `components` folder.

Now create an empty `components` and `pages`:

```bash
# Recreate
mkdir components pages

# Add a file in the pages folder
touch pages/index.js
```

If you take another look at the app, you should see a more detailed error. The error is telling you that although it sees a page file, that file doesn’t export a valid React component.


![Error after pages/index.js is added](https://res.cloudinary.com/codebeast/image/upload/v1591516927/CleanShot_2020-06-07_at_12.01.57_2x.png)


Add the following to the `pages/index.js`:

```js
import React from 'react';

function Index() {
 return <h1>Hello, Herm!</h1>;
}

export default Index
```

Once you save, you should get a greeting:


![](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578847588292_image.png)


