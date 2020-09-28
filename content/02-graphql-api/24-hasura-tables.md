---
title: "2.4 Database Tables"
metaTitle: "Database Tables"
---

The first thing you want to do after you have created a database is to add tables to the database. But to do that, we need to have a clear understanding of what the model should look like.

What will be awesome is if users can be part of multiple accounts and send tweets through those accounts if possible. What good is a product like Herm if the users can’t connect multiple accounts?

We want a many-to-many relationship between an accounts' table and a users' table.


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580408137588_hasura-auth-perm-6.png)


Let’s make this model come to live on Hasura.


## Objectives


- Create tables in Hasura
- Learn how to add primary keys to tables
- Add unique constraints to primary keys and fields like email and username

## Exercise 1: Create Account Table

<iframe src="https://player.vimeo.com/video/388485997" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

**Task 1: Create an Account table**

Click on the **Data** tab then click on the **Add Table** button:


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580408766675_Screen+Shot+2020-01-30+at+10.18.11+AM.png)


**Task 2: Add columns to Account table**

Fill out the table columns with the bare minimum values, as shown in the model:


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580473656988_Screen+Shot+2020-01-31+at+4.26.07+AM.png)


**Task 3: Add a primary key to Account table**

Right below the column names, you will find a field for setting the table’s primary key. The primary key is a unique identifier for each row in your table.


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580473793577_Screen+Shot+2020-01-31+at+4.29.34+AM.png)


**Task 4: Save the Account table**

Lastly, scroll down to the end of the page and click `Add Table` to persist your changes.


## Exercise 2: Create a User Table

Create a `user` table using the same steps you learned when creating the `account` table. The columns should also be the same as what you see in the database table model.

Here is what it should look like:


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580476781271_Screen+Shot+2020-01-31+at+5.18.51+AM.png)