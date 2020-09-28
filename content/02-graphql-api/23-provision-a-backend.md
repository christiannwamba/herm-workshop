---
title: "2.3 Provision a Backend"
metaTitle: "Provision a Backend"
---

>  Feel free to skip this page if you are using Hasura cloud

The very crude way to create a GraphQL backend is to use something like Apollo server to set up one. Hence, you have to:

1. Define and manage schemas
2. Write resolvers and make sure they adhere to the schemas you created
3. Carefully manage errors, security best practices, and performance concerns
4. Setup and maintain a database if you are storing your data like we need to for this project
5. Handle authorization/permission for every resolver you write if data integrity needs to be protected

I have been down this road (a lot), and it was never my favorite. It is just too many chores (except for writing resolvers, I love those).

Remember our *buy not build* mentality, this is the first time we will see it in action. In this case, though, we are not necessarily buying, but we are using an existing open-source project. Imagine a world where all those chores I listed for you are handled by a tool while you get to focus on defining and implementing your business (or fun) logic.

![](https://paper-attachments.dropbox.com/s_3AC7960F224B1F7A7267EA8FA5552E4542A52D026AA617CF3A5699D55D57A064_1576418109080_New+Wireframe+1.png)

[Hasura](https://hasura.io/) is an open-source GraphQL backend that connects your database and microservices to expose a GraphQL API. It sits on your database and transforms all of its data and structure into a GraphQL API. This means no more writing schemas, resolvers, authorization, etc. for most of your repetitive logic. Hasura is flexible enough and allows you to merge an existing GraphQL API if you have one or use event triggers to write custom logic for queries and mutations.

## Objectives

In this exercise, you will:

- Setup a Hasura project that sits on a Postgres database
- Create, build and run a Docker image for a Hasura backend
- See a basic Hasura backend in action


## Exercise 1: Install GraphQL Engine and Database

**Task 1: Setup a project directory**

We created a parent directory named `herm` in the previous chapter. Head to this directory and add a new folder called `api`

```bash
cd herm

# Backend folder
mkdir api

cd api
```

**Task 2: Create docker-compose.yml file**

To create an environment for the backend using Docker, you need to tell Docker what you want in that environment. We need a database and a GraphQL engine. The way you tell Docker about what you need is using the `docker-compose.yml` file:

Create a docker-compose.yml file:

```bash
touch docker-compose.yml
```

Open the `docker-compose.yml` file and paste the following configuration:

```yml
version: '3.6'
services:
  postgres:
    image: postgres:10
    restart: always
    volumes:
    - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
  graphql-engine:
    image: hasura/graphql-engine:v1.3.0
    ports:
    - "8080:8080"
    depends_on:
    - "postgres"
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true" # set to "false" to disable console
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
volumes:
  db_data:
```

This compose files exposes our credentials. Anyone that has access to this file will have access to your database connection details and I am sure you wouldn't want want that.

Create environmental variables to store the credentials:

```bash
# Create a folder to store all environmental variables files
mkdir .env

# Create two environmental variable files
touch .env/db.dev.env
touch .env/hasura.dev.env
```

Add the following in the `db.dev.env` file:

```bash
POSTGRES_PASSWORD=postgrespassword
```

Add the following to the `hasura.dev.env` file:

```bash
HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup, http-log, webhook-log, websocket-log, query-log
```

Add a `.gitignore` file at the root of your project to remove the `.env` folder from source control:

```bash
# ./.gitignore
.env
```

Update the YML file to use the env file:

```yml
version: '3.6'
services:
  postgres:
    image: postgres:10
    restart: always
    volumes:
    - db_data:/var/lib/postgresql/data
    env_file: 
      - .env/db.dev.env
  graphql-engine:
    image: hasura/graphql-engine:v1.3.0
    ports:
    - "3100:8080"
    depends_on:
    - "postgres"
    restart: always
    env_file:
      - .env/hasura.dev.env
volumes:
  db_data:
```

**Task 3: Create and Start the environment**

The following command is meant to start the container. But since we haven’t even created the container yet, it will first create it. When the command is done creating the container, Docker will start the container. Run:

```bash
docker-compose up -d
```

The first time you run the command, the install process will take some time to pull docker images and create the backend environment for you. You should see an output that looks like the one below.

```bash
Creating network "api_default" with the default driver
Creating volume "api_db_data" with default driver
Pulling postgres (postgres:)...
latest: Pulling from library/postgres
000eee12ec04: Pull complete
7b8ef50e8d64: Pull complete
304f7c67e7db: Pull complete
9fe4298c8c65: Pull complete
f1ca857656d1: Pull complete
95d6c34812f7: Pull complete
9436c546bd1d: Pull complete
922326a079d9: Pull complete
d6e9dcf0d140: Pull complete
83ac3914c283: Pull complete
5ffbf9359c6e: Pull complete
d280abe82126: Pull complete
f5a37695fe7e: Pull complete
233830cd10db: Pull complete
Digest: sha256:c4da9c62c26179440d5dc7409cb7db60f4a498f0f2c080b97fdb9f7ec0b3502b
Status: Downloaded newer image for postgres:latest
Pulling graphql-engine (hasura/graphql-engine:v1.3.0)...
v1.3.0: Pulling from hasura/graphql-engine
44657d934963: Pull complete
Digest: sha256:8d1a90fb733a3680ff773ae9c5bad37b6a87cf0005be3589e7dc4e771f01cfbc
Status: Downloaded newer image for hasura/graphql-engine:v1.3.0
Creating api_postgres_1 ... done
Creating api_graphql-engine_1 ... done
```

**Task 4: Verify that backend is running**

Now that we have a running environment, let’s confirm it’s actually up:

```bash
docker ps
```

You can see the GraphQL engine is running on port 3100 of localhost (0.0.0.0):


![](https://paper-attachments.dropbox.com/s_3AC7960F224B1F7A7267EA8FA5552E4542A52D026AA617CF3A5699D55D57A064_1576235609584_image.png)


Go to [http://localhost:3100](http://localhost:3100) to see your GraphQL console:


![](https://paper-attachments.dropbox.com/s_3AC7960F224B1F7A7267EA8FA5552E4542A52D026AA617CF3A5699D55D57A064_1576235794478_image.png)