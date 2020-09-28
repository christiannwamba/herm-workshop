---
title: "2.5 Objects Relationship"
metaTitle: "Objects Relationship"
---

I am just going to bring back this image for one second:

![](https://paper-attachments.dropbox.com/s_3AC7960F224B1F7A7267EA8FA5552E4542A52D026AA617CF3A5699D55D57A064_1576418109080_New+Wireframe+1.png)


At the database layer, we have figured out how to relate two or more tables. If you run an SQL command on the database, you can construct an SQL query that fetches all the users that belong to an account.

Unfortunately, we are not running SQL — we are running GraphQL and GraphQL does not know about this relationship. We need to tell Hasura explicitly that it should expose the **tables** relationships we have as **objects** relationships in GraphQL.

This is beneficial in two major ways:


1. You can query entities and attach related data using objects or arrays to them
2. When we get to authorizations and permissions, we need object relationships to control access between associated data. For example, if a user can only access accounts the user is invited to, a simple table relationship won’t tell Hasura what the user has access to. With object relationships setup, we can use the Hasura permissions system to define fine-grained access control. (Don’t worry if this does not make enough sense now, we will learn more about it in **Chapter 5**.)


## Objectives


- Setup object relationships for table relationships
- Learn the difference between objects and arrays in one-to-many or many-to-many relationships



## [Challenge 1] Nested Query

To prove that we cannot currently query users who belong to an account or vice versa, go to Query Explorer in the GraphiQL and expand the `account` field. We can query `access_token`, `account_name` and `id` but we cannot yet query the users attached to each account


![](https://paper-attachments.dropbox.com/s_1551D9F5160E6B2BAB45929E0AAE01FBE367AC3F736FBFD7E55D61CB4772FDA9_1581024651799_Screen+Shot+2020-02-06+at+1.30.20+PM.png)

## Exercise 1: Create Object Relationships

<iframe src="https://player.vimeo.com/video/389836948" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

**Task 1: account to account_user object relationship**

Head back to the **Data** tab and select the **account** table. Next, click on the Relationships tab, and you should see that Hasura is already suggesting an array (object) relationship between `account` and `account_user`:


![](https://paper-attachments.dropbox.com/s_1551D9F5160E6B2BAB45929E0AAE01FBE367AC3F736FBFD7E55D61CB4772FDA9_1581024745913_Screen+Shot+2020-02-06+at+1.31.58+PM.png)


Click on the Add button, then click Save. That’s all you need to do to setup an object relationship from the `account` side.

**Task 2: user to account_user object relationship**

Repeat the steps we saw in accounts for the user and add the suggested array (object) relationship:

![](https://paper-attachments.dropbox.com/s_1551D9F5160E6B2BAB45929E0AAE01FBE367AC3F736FBFD7E55D61CB4772FDA9_1581026920643_Screen+Shot+2020-02-06+at+1.50.45+PM.png)



**Task 3: user/account to account_user array relationship**

Lastly, we need to go to the `account_user` table and add another object relationship for the `user` and the `account` table. This will also be suggested to you once you go to the **Relationships** tab in the `account_user` table:


![](https://paper-attachments.dropbox.com/s_1551D9F5160E6B2BAB45929E0AAE01FBE367AC3F736FBFD7E55D61CB4772FDA9_1581027143495_Screen+Shot+2020-02-06+at+2.11.59+PM.png)

## [Solution 1] Nested Query

If you try to query once more, you should see that we can now access nested objects and arrays:


![](https://paper-attachments.dropbox.com/s_1551D9F5160E6B2BAB45929E0AAE01FBE367AC3F736FBFD7E55D61CB4772FDA9_1581027369583_Screen+Shot+2020-02-06+at+2.15.41+PM.png)
