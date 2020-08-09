---
title: "4.1 Set up an Authentication Server"
metaTitle: "Set up an Authentication Server"
---

Auth0 is an Authentication as a Service platform. It gives you an Auth server + SDKs that handles everything Authentication while you focus on just implementation. You can start using Auth0 for free -- so, we won’t pay for anything to use it for Herm.


## Objectives
- Create an Auth0 account
- Create an Auth0 Client


## Exercise 1: Create an Auth0 Account

Head to [Auth0 and sign up](https://manage.auth0.com/) with your preferred option:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583416525992_image.png)


When you complete the sign-up process, you should find a dashboard that looks like:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583416660616_image.png)

## Exercise 2: Create an Auth0 Client



<iframe src="https://player.vimeo.com/video/395724803" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

An Auth0 Client is an app instance. Ideally, each user-facing app you build should be tied to a unique client. A client gives you credentials that you can use to authenticate a user using the Auth server.

To create a client, click the **+ Create Application** button on your dashboard:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583416870231_image.png)


Choose **Regular Web Applications**


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583417281877_image.png)


Give the app a name and click the **CREATE** button.

Once the client is created, you should get a page with the client ID. Click on **Settings** tab to start configuring the client.


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583417821834_image.png)


This page shows both your client ID and Secret. The Secret should NEVER be publicly available.

Scroll down the settings pages and update the following field with:


- **Allowed Callback URLs**: [http://localhost:3000/api/callback](http://localhost:3000/api/callback)
- **Allowed Logout URLs**: [http://localhost:3000/](http://localhost:3000/)


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1583418141395_image.png)


You should also add your production urls by comma-separating them:


- **Allowed Callback URLs**: [http://localhost:3000/api/callback](http://localhost:3000/api/callback), https://hermapp.azurewebsites.net/api/callback
- **Allowed Logout URLs**: [http://localhost:3000/](http://localhost:3000/), https://hermapp.azurewebsites.net/

Replace my production base url `hermapp.azurewebsites.net` with yours.

Scroll to the bottom of the page and click **SAVE CHANGES**.


## Exercise 3: Create an Auth0 API

Since we are going to be protecting our APIs, we need Auth0 to be aware of that. You can do this by creating an API from the dashboard.

On the Sidebar, click the **API** menu, then click **+ CREATE API** button:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1585289711291_image.png)


Name the API and pick any identifier you like. The best practice for identifiers is to use the URL of your API, as shown below:


![](https://paper-attachments.dropbox.com/s_7247E8EEE91ABF0A7C95DC19EDD6D99F253EF7CA1E6D49DA5837B7250FD633AA_1585289864799_image.png)


Click the **CREATE** button.