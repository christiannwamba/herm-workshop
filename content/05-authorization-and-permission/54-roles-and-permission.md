---
title: "5.4 Roles and Permissions"
metaTitle: "Roles and Permissions"
---


## Objectives
- Understand our user roles requirements
- Implement Hasura Permissions for user roles


## Roles Specification

Before we jump into any exercises, let’s have more clarity on the spec of the role for each human entity that can interact with our app.

**Admin**


1. An admin can do everything

**Anonymous Users**

Users who are not registered but has the `x-hasura-allowed-roles` set to `user`:


1. An anonymous user can create account
2. An anonymous user can create user

**User**


1. A user can add an account to themselves
2. A user can delete an account attached to them

## Exercise 1: Update the Database Schema

Before we get into permissions, let’s update our database based on what our current requirement development looks like.

When we created the account table, it only had an account name and access token fields. Now that we know that we also need to store the access token secret, we should add a column for that.

Go to the **Data** page and choose **account** table. Next click on the **Modify** tab and add a column `access_token_secret`:

![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585116348357_image.png)


We should also remove the email field on the user table since we are not going to be using it.


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585123909939_image.png)


(This will also generate a migration for us to run on the production environment when we are deploying)


## Exercise 2: Anonymous Users Permissions



<iframe src="https://player.vimeo.com/video/400591715" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

To fully register a user, we need to:


1. Insert their username into the user table
2. Store their twitter credentials in the account table

It is possible to insert into both the account and the user tables with just one mutation. This one:

```gql
insert_account_user(
  objects: {
    account: {
      data: {
        access_token: "token"
        access_token_secret: "token secret"
        account_name: "account name"
      }
    }
    user: { data: { username: "username" } }
  }
) {
  affected_rows
}
```

Make sure that `x-hasura-admin-secret` is NOT selected and try running this mutation. The mutation will fail because we have not set any permissions that allow inserting.

It is ok for random people to join our app — that’s what we want at the end of the day. So go to the **Data** page, chose **account** table, and click on the **Permissions** tab.

Add a new `user` role and click on the insert row to edit. Edit the insert permission and select **Without any checks** for rows. Enable the fields shown under the columns as seen below to make them writable by a user:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585142300260_image.png)


Save the permission and add the same permission rules to the **account_user** and **user** tables.


## Exercise 3: User Permissions

**Task 1: A User Can Add an Account to Themselves**

<iframe src="https://player.vimeo.com/video/400871124" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

One of the features I promised is that users can tweet through multiple Twitter accounts.

Let’s add a permission that will allow users to update the `account_user` connector table to add accounts to themselves.

To achieve this permission, we need to ensure that the username on `X-Hasura-User-Id` matches the username of the user that we are trying to attach an account to. This makes sense because we don’t want random logged in user to link an account to a user. It’s like ensuring that an author can only edit a post they created and not other authors’ posts.

To add this permission, go to the **Data** page, choose **account_user** table and click the **Permissions** tab. 

On the permissions tab, select the insert cell for the user role. Under **Row insert permissions** select **With custom check**.


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204476663_image.png)


Custom check permissions are written in JSON. You don’t have to know the properties that you can set in this JSON for a given table because Hasura shows you what is acceptable in a dropdown:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204581823_image.png)


Open the drop-down, and you should see a list of columns and tables related to this **account_user** table that we can use to create its permission rules:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204652170_image.png)


The reason we can see **account** and **user** table is because we setup an object relationship between this table and them. If we don’t have that relationship, we will only be able to se the columns that belong to this table, account_id, id, etc

Choose the user table from the dropdown and you should see a sub-dropdown appear:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204799231_image.png)


Expand that drop-down, and you should see a list of columns in the **user** table:

![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204824480_image.png)


Choose username since we want to ensure that the username in this table matches the username in `X-Hasura-User-Id`. Another sub-dropdown will appear:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204892649_image.png)


From the new drop-down, you can see different operations you can perform on the username:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204927585_image.png)


Since we want to check if it equals `X-Hasura-User-Id` select `_eq`. Set the value of the text box that appears to `X-Hasura-User-Id`:


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585204999004_image.png)


Finally, save the permission.

**Task 2: A User Can Delete an Account Attached to Them**

The same rule we have in inserting will apply to deleting. It has to be an account that belongs to you before you can unlink it.

Click delete permission cell for a user and select **With same custom check as insert**.


![](https://paper-attachments.dropbox.com/s_AF7E313CD6CEF2268008A72A380E4FE0813E9AE8FD4F9099354C129E6AAFA8DD_1585205418404_image.png)

**Task 3: Users Can View their Profile**

You also want to have the flexibility of fetching a user's profile when needed. To eanble this, open the `user` table and click on the Permissions tab.

Select the `select` field and set it up the rows anc columns like this:

![](../media/authorization/roles-permission/user-profile-permission.png)

Do the same for the account table but set it up as shown in the image below:

(Note that to check for the username, we have to first find the user that is related to the account. I also selected only the `account_name` column so users cannot query their token and secret)

![](../media/authorization/roles-permission/account-permission.png)