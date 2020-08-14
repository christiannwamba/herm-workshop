---
title: "4.0 Authentication"
metaTitle: "Authentication"
metaDescription: "Add authentication to your frontend app."
---

If this is not your first implementing an auth feature, then my wild guess is that you have written that feature yourself (probably from scratch). If you have never written auth in the past, you are lucky to be in a modern era. 

In this chapter, we are not going to re-invent the wheel like we always did. Remember the “buy not build” principle? Most of what we are going to be doing in this chapter with authentication is going to be supported by a third-party service — don’t worry we will not pay to use it.

Before we dive in, here is what the flow for auth will look like when we are done:


![](https://paper-attachments.dropbox.com/s_F2744849DA11E0771F587059724423855744A1B9DC81A0B703400713A913B7D6_1586011599034_Group+7673-2.png)

1. Our Herm app initiates an auth request to Auth0 server
2. Auth0 authenticates the user on Twitter.
3. Twitter sends a response to Auth0
4. Auth0 sends authentication credentials to our app
5. Every time a user visits a Herm page that needs protected GraphQL data, we send an authorization header alongside the request to Hasura
6. Hasura validates the token on the auth header
7. Auth0 agrees that this user is legit
8. Hasura resolves the protected GraphQL query or mutation
 
Let’s build all these out!

Here are the key highlights of what you will learn:


- Setup authentication server
- Add email and password authentication to an app
- Add social authentication to an app
- Log in with your frontend app and get user profile



