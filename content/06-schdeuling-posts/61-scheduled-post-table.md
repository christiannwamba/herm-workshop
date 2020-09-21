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

![Add new table](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600038093846_herm-ad-tabe.png)

Set `scheduled_post` as the table name and then define the table columns as shown below:

![Scheduled Post columns](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600037770053_herm-show-columns.pnghttps://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600037770053_herm-show-columns.png)

The `schedule_for` column takes a timestamp, the exact time when the post should be sent out. The other column, `is_pending` will act as a flag that will be switched when the post has been tweeted.

Click on the **Frequently used columns** and select **created_at**

![Add created_at column](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600037391531_Screenshot+2020-09-13+at+11.46.39+PM.png)

**Task 2: Add a primary key**

Right below the column names, you will find a field for setting the table’s primary key. The primary key is a unique identifier for each row in your table.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600038573700_herm-primary-key.png)

Select the `id` as your primary key:

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600038411103_Screenshot+2020-09-14+at+12.05.46+AM.png)

**Task 3: Add a foreign key**

Add a foreign key to define a many-to-one relationship with the user table. The `user_id` column of the table will be linked to the `id` column of the user table.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600038805478_Screenshot+2020-09-14+at+12.11.27+AM.png)

**Task 4: Save table**

Scroll down to the bottom of the page and click on the **Add Table** button.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600038986050_herm-save-table.png)


## Exercise 2: Add relationships

To allow nested queries of `scheduled_posts` on the user object, we'll a relationship on both the `user` and `scheduled_post` tables.

On the Hasura console, navigate to **Data** > **user** and then click on the **Relationships** tab. You should see **Suggested relationships**

![Click on the **Add** button to create a relationship](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600640444706_herm-add-rela.png)

Do the same for the `scheduled_post` table:

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600640444697_herm-add-rela-2.png)


## Exercise 3: Set user permissions

To allow user access to the new table created, we need to grant the user role permission to the table. To add this permission, go to the **Data** page, choose the **scheduled_post** table and click the **Permissions** tab.

**Task 1: Allow row insert**

On the permissions tab, select the **insert** cell for the user role. Under **Row insert permissions** select **With custom check**. We'll add a custom check similar to that we set up on the other tables, the custom check will allow users access **scheduled_posts** created by them.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600637438791_Screenshot+2020-09-20+at+10.28.48+PM.png)

When done, click the **Save permissions**

**Task 2: Allow row select**

Next, click on the **select** cell and enter the same permissions. You should see an option labeled **With same custom check as insert**, select that option. Click **Toggle All** in the **Column Select Permissions** section.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600039116704_Screenshot+2020-09-08+at+7.58.14+PM.png)

Click **Save permissions** to save.

**Task 3: Allow row update**

Click the **update** cell and select the **With same custom check as insert, select** option below the **Pre-update check** and the **Post-update check**. Then, click **Toggle All** under the **Column update permissions** section.

![](https://paper-attachments.dropbox.com/s_A1A0E77332EB516A55B20A9874A0C7735C43BC1EFCB6880379E198D45BF72020_1600039079004_Screenshot+2020-09-08+at+8.02.48+PM.png)

Click **Save permissions** to save the update
