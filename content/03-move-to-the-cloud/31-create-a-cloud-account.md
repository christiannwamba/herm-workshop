---
title: "3.1 Create a Cloud Account"
metaTitle: "Create a Cloud Account"
---

We are going to use Azure as our cloud provider since it comes with a $200 credit and a lot of free tier for some of the cloud resources we need to deploy our app.


## Objectives

- Create an [Azure free account](https://azure.microsoft.com/en-us/free/?WT.mc_id=herm-workshop-chnwamba)
- Install Azure CLI command
- Login into Azure from your CLI

## Exercise 1: Create a Free Account

Before we head to creating an account, here are a few things you are going to need:

1. An **email address** that you can verify
2. A **phone number** that you can also verify
3. A **credit card** or **debit card**. This card **will NOT be charged** by Azure unless you use premium services that exceed the $200 credit

Once you have these three things handy, click on the following link to create a free account:


- [Azure Free Account](https://azure.microsoft.com/en-us/free/?WT.mc_id=herm-workshop-chnwamba)


![](https://paper-attachments.dropbox.com/s_5878174F69F5FC7DB3322C1C2709D0B31EDBC258354D0EFE5DFD294654950CD2_1581847003675_image.png)


Follow the wizard to create an account, or you can watch this **two minutes video** below to guide you.


> You do NOT need a Microsoft email address to create an account. You can use a Gmail account, custom, or another kind of email address you have.


<iframe width="640" height="400" src="https://www.youtube.com/embed/GWT2R1C_uUU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Exercise 2a: Setup Azure CLI on Mac

**Task 1: Install Homebrew**

[Homebrew](https://brew.sh) is a package manager for Mac. It’s to Mac what npm/yarn is to node, what composer is to PHP, or what cargo is to Rust.

To install it on your Mac, run the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**Task 2: Install Azure CLI**

You can use Homebrew to install packages using the `brew` command. We want to use it to install the Azure CLI tool:

```bash
brew update && brew install azure-cli
```

The command will first make sure that Homebrew is up to date with `brew update` before installing `azure-cli` with `brew install azure-cli`

## Exercise 2b: Setup Azure CLI on Windows

To install on Windows, open Powershell as an admin and run the following:

```powershell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

## Exercise 2c: Setup Azure CLI on Linux

To install on Linux, open the command line and run the following:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

## Exercise 3: Log in to Azure from the CLI


<iframe src="https://player.vimeo.com/video/391780038" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


To be able to interact with Azure from CLI without using Azure from the browser, you need to authenticate the CLI tool:

```bash
az login
```

> You can run `az` commands anywhere from your terminal. I will recommend running it from the `herm/api` directory we created earlier, which is where our backend stuff happens.

Running the command should open your browser, and since you just created an account and already signed in from the browser, you should be good.


## Exercise 4: Set a Default Subscription

You can have multiple subscriptions on your Azure account. Multiple subscriptions feature allows you to be part of any team or company while maintaining only one account (tied to your email). 

When you run CLI commands to create apps on Azure, you will need to tell Azure what subscription it should deploy the app on. Most times, you might have just one subscription or work with only one subscription, therefore, it would feel redundant to specify the subscription in the CLI for every command.

Set your current subscription as the default subscription to avoid this redundancy. To do so, you need to know your subscriptions and their IDs. To list the subscriptions, run:

```bash
az account list
```

This will print something like:

```json
[
  {
    "cloudName": "AzureCloud",
    "id": "<YOUR SUBSCRIPTION ID HERE>",
    "isDefault": true,
    "name": "<YOUR SUBSCRIPTION NAME HERE>",
    "state": "Enabled",
    "tenantId": "...",
    "user": {
      "name": "...",
      "type": "user"
    }
  },
  {
    "cloudName": "AzureCloud",
    "id": "...",
    "isDefault": false,
  ...
```

Copy the `id` of the subscription you want to set as default and run the following:

```bash
az account set --subscription <YOUR SUBSCRIPTION ID>
```

## Exercise 5: Create a Resource Group

Azure offers all kinds of cloud services, including the following that we need to build our app:

- Serverless
- Postgres database
- Containers
- Web services
- Storage, etc

How do you group all these services based on the project they belong to? Azure offers a feature called resource groups that lets you keep all related project-specific services. You can manage and delete all the services as an admin using the resource group.

To create one, run the following command:

```bash
az group create \
  --name herm \
  --location uksouth
```

We named the resource `herm`, and we want it to be located in `uksouth` data center. When the resource group is created you should get the following JSON output:


![](https://paper-attachments.dropbox.com/s_5878174F69F5FC7DB3322C1C2709D0B31EDBC258354D0EFE5DFD294654950CD2_1581853262868_Screen+Shot+2020-02-16+at+3.40.35+PM.png)


This confirms that the resource group was created. You can also take a visual look at the resource group by going to https://portal.azure.com and selecting **Resources**:


![](https://paper-attachments.dropbox.com/s_5878174F69F5FC7DB3322C1C2709D0B31EDBC258354D0EFE5DFD294654950CD2_1581849433710_image.png)


The resources page will list all the resources, and you can find `herm` which we just created:


![](https://paper-attachments.dropbox.com/s_5878174F69F5FC7DB3322C1C2709D0B31EDBC258354D0EFE5DFD294654950CD2_1581849643284_image.png)


Click on the resource to expand it. You should find that we have no resources yet, but we will create one -- a database, in the next section.


![](https://paper-attachments.dropbox.com/s_5878174F69F5FC7DB3322C1C2709D0B31EDBC258354D0EFE5DFD294654950CD2_1581849862924_image.png)

> Most resources you will create inside `herm` are going to be available publicly on a hostname. For example, if you name your Postgres database `hermdb` it will be available as `hermdb.postgres.database.azure.com`. Therefore, another person cannot use the same resource name you are using. There is a chance I have taken all the names you see me use in this workshop. **I would advise you add numbers at the name of your resource names to make them unique. E.g. `hermdb12325`**

