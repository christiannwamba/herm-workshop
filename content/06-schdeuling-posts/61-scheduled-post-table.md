---
title: "6.1 Creating a table for scheduled posts"
metaTitle: "Setup a new table for scheduled posts with migrations"
---

The idea for the table is to allow users create multiple posts. Each post should be linked to a user and each post should have a timestamp when the post should be sent out. The table should h What will be awesome is if users can be part of multiple accounts and send tweets through those accounts if possible. What good is a product like Herm if the users can’t connect multiple accounts?

We want a many-to-many relationship between an accounts' table and a users' table.

## Objectives

- Set up a table for scheduled posts
- Define relationships for the table.
- Set up permissions on the user role for the table

## Exercise 1: Setup scheduled posts table

**Task 1 Create scheduled posts table**

Click on the Data tab then click on the Add Table button:

> Add tables screenshot

Set `scheduled_post` as the table name and then define the table columns as shown below:

> Add screenshot show columns

The `schedule_for` column takes a timestamp, the exact time when the post should be sent out. The other column, `is_pending` will act as a flag that will be switched when the post has been tweeted.

**Task 2: Add a primary key**

Right below the column names, you will find a field for setting the table’s primary key. The primary key is a unique identifier for each row in your table.

> Screenshot showing primary key

**Task 3: Add a foreign key**

Add a foreign key to define a many-to-one relationship with the user table. The `user_id` column of the table will be linked to the `id` column of the user table.

> Screenshot showing foreign key

**Task 4: Save table**

Scroll down to the bottom of the page and click on the **Add Table** button.

> Screenshot showing how to add table

## Exercise 2: Set user permissions

To allow a user access to the new table created, we need to grant the user role permission to the table. To add this permission, go to the **Data** page, choose _scheduled_post_ table and click the **Permissions** tab.

**Task 1: Allow row insert**
On the permissions tab, select the **insert** cell for the user role. Under **Row insert permissions** select **With custom check**. We'll add a custom check similar to that we set up on the other tables, the custom check will allow users access **scheduled_posts** created by them.

> Insert the screenshot for custom checks.

When done, click the **Save permissions**

**Task 2: Allow row select**

Next, click on the **select** cell and enter the same permissions. You should see an option labeled **With same custom check as insert**, select that option. Click **Toggle All** in the **Column Select Permissions** section.

> Insert screenshot showing select permissions

Click **Save permissions** to save.


**Task 3: Allow row update**

Click the **update** cell and select the **With same custom check as insert, select** option below the **Pre-update check** and the **Post-update check**. Then, click **Toggle All** under the **Column update permissions** section.

> Insert screenshot showing update permissions

Click **Save permissions** to save the update
