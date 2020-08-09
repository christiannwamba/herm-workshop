---
title: "3.2 Create a Cloud-Hosted Postgres Database"
metaTitle: "Create a Cloud-Hosted Postgres Database"
---

> Feel free to skip this page if you are using Hasura cloud

As we have seen in the previous chapters, we need a Postgres database in production, just like we had locally. This database is the source of truth for our app. It will store information about our accounts and users in the cloud.


## Objectives

- Create a Postgres database on Azure

## Exercise 1: Create a Postgres Database

There are two main ways to create resources in Azure. You can either use the Azure Portal (aka. Azure Website) or use the command line. 

We are developers, and we love to save time and automate things using the CLI.  In this regard, I am going to be showing you how to create resources using the terminal, but when we are done, we will take a look at the portal to confirm that these resources were successfully created.

To create a Postgres database, run the following command in the terminal:

```bash
az postgres server create \
  --name hermdb \
  --resource-group herm \
  --location uksouth \
  --admin-user <server_admin_username> \
  --admin-password <server_admin_password> \
  --sku-name B_Gen5_1 \
  --version 10
```

Few rules to keep an eye on:


- Server names must contain alphanumeric characters. No dashes or underscores
- Passwords should comply with standard password policy — at least one number and one character. 
- The characters that make up the passwords must not be less than 12. I use LastPass [password generator](https://www.lastpass.com/password-generator).

Replace `<server_admin_username>` with your admin username and `<server_admin_password>` with your admin password. `--sku-name` is a code name for the pricing tier. We are using one of the cheapest, but you can read more about pricing [here](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-azure-cli?WT.mc_id=herm-workshop-chnwamba#create-an-azure-database-for-postgresql-server).

Here is the output when the database is created:

![](https://paper-attachments.dropbox.com/s_743BA1C239D41580A7EBC2288FE3CBB72C6866034772AFBFF0AA485E654CC1C0_1581854293890_Screen+Shot+2020-02-16+at+3.48.53+PM.png)


Notice how we are grouping this database into the `herm` resource group using the `--resource-group` option.

You can open the `herm` resource group once more to confirm that the database can be found there:


![](https://paper-attachments.dropbox.com/s_743BA1C239D41580A7EBC2288FE3CBB72C6866034772AFBFF0AA485E654CC1C0_1581854256720_image.png)

Click on the database to expand and see an overview of its properties:

![](https://paper-attachments.dropbox.com/s_D1E455E16E08DAA74D4D60DB2DF4FC15958E4AEC653FCADD3E6BCA57015B69CB_1585215494749_image.png)

## Exercise 2: Configure a Firewall for Security

I could have closed of this section with just setting up a database, but the entire point of this workshop is to show you how things should be in real-life scenarios. That said, passwords are not enough for securing a database.

There are numerous ways hackers can hijack your database, and no matter how secure your system is, if your database gets hacked, you are toast!

A powerful way to secure your database is to ensure that only services on Azure have access to it. A firewall allows you to set IP address(es) or a range of addresses that can have access to your database. Since we want only apps deployed to Azure services to have access to the database, we can set the start and end IP addresses to both `0.0.0.0`.

To do that, run the following in your command line:

```bash
az postgres server firewall-rule create \
  --resource-group herm \
  --server hermdb \
  --name AllowIps \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

![](https://paper-attachments.dropbox.com/s_743BA1C239D41580A7EBC2288FE3CBB72C6866034772AFBFF0AA485E654CC1C0_1581908947474_Screen+Shot+2020-02-17+at+7.08.48+AM.png)
