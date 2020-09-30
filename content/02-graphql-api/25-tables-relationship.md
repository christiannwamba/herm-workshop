---
title: "2.5 Tables Relationship"
metaTitle: "Tables Relationship"
---

As a reminder, here is what our database model looks like from the previous section:


![](https://paper-attachments.dropbox.com/s_3E94B2190A3BA2162BF331F8D8186E27E1E0F950AC3E66A083E4530ED6CD7B12_1580408137588_hasura-auth-perm-6.png)



## Objectives


- Create a many-to-many relationship using a **bridge table**
- Create one-to-many relationships

A bridge table is like every other table you have created with just one difference — it has the foreign keys of 2 or more tables. Tables connected by a bridge table are said to have a many-to-many relationship with each other.

Using our model as an example, `account_id` of value `1` can appear multiple times in Account User bridge table. For each time it appears in the table, the `user_id` value could be different. This means that each of those users belongs to one account. What makes this many-to-many, though, is that it goes both ways. One user can belong to as many accounts as the user wants

## Exercise 1: Add a Bridge Table

<iframe src="https://player.vimeo.com/video/389833187" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

**Task 1: Create an account table**

Just like we did in the previous exercises, add a new table called `account_user` using the **Add Table** button through the **Data** menu:


![](https://paper-attachments.dropbox.com/s_818084DF86985F214D07736EAC56BFA386DB84F5EDD56671434B6943EBCA1FA8_1581016113754_image.png)


**Task 2: Add Foreign Key and Primary Key columns**

Add an `account_id` and `user_id` columns with an **integer** type. An integer type makes sense because we want it to match the type of the primary keys in the `account` and the `user` table.


![](https://paper-attachments.dropbox.com/s_818084DF86985F214D07736EAC56BFA386DB84F5EDD56671434B6943EBCA1FA8_1581016360032_image.png)


 
You should also add a primary key that is also an integer but with support for auto-increment. This will serve as the identifier and must always be unique.


## Exercise 2: Set Relationships

Finally, we need to define the relationships.

First, let’s set the relationship between `account_user` and `account` through the `account_id` foreign key column. Click the **Add a foreign key** button to reveal the foreign key form:


![](https://paper-attachments.dropbox.com/s_818084DF86985F214D07736EAC56BFA386DB84F5EDD56671434B6943EBCA1FA8_1581016521431_Screen+Shot+2020-02-06+at+11.14.57+AM.png)


The form fields expect you to choose which table and columns you want to link together:


![](https://paper-attachments.dropbox.com/s_818084DF86985F214D07736EAC56BFA386DB84F5EDD56671434B6943EBCA1FA8_1581016666437_Screen+Shot+2020-02-06+at+11.16.37+AM.png)

1. The **Reference Table** is the table we want to connect is the `account` table
2. The **From** field value should be the field on `account_user` that you want to relate to the `account` table
3. The **To** field value should be the field on account (which is the primary key)

Click the **Save** button and repeat this process for the `user` table:


![](https://paper-attachments.dropbox.com/s_818084DF86985F214D07736EAC56BFA386DB84F5EDD56671434B6943EBCA1FA8_1581016911203_Screen+Shot+2020-02-06+at+11.21.24+AM.png)

- The relationship between `account` and `account_user` is a **one-to-many** relationship
- The relationship between `user` and `account_user` is a **one-to-many** relationship
- The relationship between `account` and `user` is a **many-to-many** relationship

Finally, click **Add Table** to create the table.