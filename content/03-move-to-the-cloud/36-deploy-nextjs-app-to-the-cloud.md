---
title: "3.6 Deploy Next.js App to the Cloud"
metaTitle: "Deploy Next.js App to the Cloud"
---

We are coming close to the end of this chapter. I hope it was a great learning experience for you as it was for me while making the chapter. Before we close off completely, I would like to show you how to also move your Next.js SSR, frontend web app, to the cloud.


## Objectives
- Deploy Next.js app to the cloud
- Setup continuous deployment for Next.js app


## Exercise 1: Deploy Next.js to Azure

A web app is an app that can handle a request and send responses efficiently. The GraphQL API we deployed is an excellent example of a web app, which is why we deployed it to the Azure Web App service.

The Next.js app we had in Chapter 1 is also a web app and is a good fit for Azure Web App service. To get ready for the deploy process, move into the folder where your Nextjs app is.

```bash
cd herm/app
```

**Task 1: Create a Service Plan**

Create a service plan to manage pricing and runtime for the Next.js app:

```bash
az appservice plan create \
 --name hermappplan \
 --resource-group herm \
 --sku P1V2 \
 --is-linux
```

**Task 2: Create a Web App in Azure**

Use the plan we just created and the resource group we have been creating resources under, to create a new empty web app:

```bash
az webapp create \
 --name <APP NAME> \
 --plan hermappplan \
 --runtime "node|12.9" \
 --resource-group herm
```

**Task 3: Preview Web App**

The web app you just created is currently empty and just shows a default greeting message from Azure. You can confirm this by running the following command to open the site:

```bash
az webapp browse \
 --name <APP NAME> \
 --resource-group herm
```

![](https://paper-attachments.dropbox.com/s_BC403D2BFE0C3B066DBCCFD377C1B34BBCE7654080CD72F324A50E5BF331E423_1582546529369_image.png)


We need to push our own code though.

**Task 4: Setup Continuous Delivery with GitHub Actions**

We can pull code from Github into our Web App service, but what would be cool is to set up continuous delivery so that every push event on the Github repo would update the site.

To do this, we need to create another GitHub Action for the web app. Start by creating the relevant folders and files in your Next.js web app:

```bash
cd app
mkdir .github
mkdir .github/workflows
touch .github/workflows/main.yml
```

Next paste the following workflow configuration in the `main.yml` file:

```yml
name: Deploy Herm App to Azure

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: 'Checkout GitHub Action'
      uses: actions/checkout@master

    - name: 'Login to Azure'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Setup Node 12.x
      uses: actions/setup-node@v1
      with:
        node-version: '12.x'

    - name: 'npm install, build, and test'
      run: |
        npm install
        npm run build --if-present
        npm run test --if-present

    - name: 'Deploy to Azure'
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'hermapp'

    - name: Logout
      run: |
        az logout
```

This action is quite similar to the one we had in our API. Here are the steps in the workflow:

1. Checkout the GitHub repository
1. Log in to Azure. Follow the steps in [API Continuous Deployment](/03-move-to-the-cloud/33-build-and-deploy-a-docker-container-to-the-cloud#exercise-5-continuous-deployment-with-gitHub-action) to create a secret for `AZURE_CREDENTIALS`
1. Setup Node
1. Install Node and Build the web app
1. Deploy the app to an Azure Web App Service called `hermapp`

The final step will start the app automatically for you on Azure using `npm start`. Let's setup the start script to ensure that it runs correct command.

**Task 5: Update Scripts**

Update the `start` script:

```json
"scripts": {
 "dev": "next",
  "build": "next build"
- "start": "next start",
+ "start": "node node_modules/next/dist/bin/next start -p $PORT",
 "export": "next export",
 "deploy": "npm run build && npm run export"
},
```

Nex.jst originally uses `next start` to start your app which is a link to what is in `node_modules/next/dist/bin/next`. There is a known issue that when you use GitHub Actions to build your app and zip it for deploy, the link between `./node_modules/.bin/<module_name>` and `node_modules/<module_name>/dist/bin/<module_name>` gets broken. So instead of relying on the link, you can just point directly to the script `node_modules/next/dist/bin/next`.

The `-p` flag is used to override the default port that Next starts on. In this case, we want Next to use the port that Azure sets up in the environmental variable.

**Task 6: Push Code to Github**

Head to your terminal, commit and push to GitHub:

```bash
git add .
git commit -m "<Commit message>"
git push -u origin master
```