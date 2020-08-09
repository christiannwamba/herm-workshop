---
title: "2.2 Install Docker"
metaTitle: "Install Docker"
---

> Feel free to skip this page if you are using Hasura cloud

## Objectives


- Install Docker (Linux, Mac, or Windows)


## Exercise 1a: Setup Docker on Mac

**Task 1: Download Mac Installer**

Go to https://download.docker.com/mac/stable/Docker.dmg and download the latest stable version of Docker.

Open the `.dmg` file you downloaded, you should see the following:

![](https://paper-attachments.dropbox.com/s_CE0BB700AC51A17F45F9CC8C9A3B5239288036A70EBE8F19A2B1C62C8D17A3FE_1576216544344_image.png)


Click and drag the `Docker` app into the `Applications` folder. It will take a second or a few to complete the copying process.

**Task 2: Boot Docker**

Open Docker from your Applications. The first time you try to do this, your computer would like to confirm with you that you want to give Docker networking privileges.


![](https://paper-attachments.dropbox.com/s_CE0BB700AC51A17F45F9CC8C9A3B5239288036A70EBE8F19A2B1C62C8D17A3FE_1576218906913_image.png)


The Docker icon will appear on your taskbar. Click on it to confirm Docker is running.


![](https://paper-attachments.dropbox.com/s_CE0BB700AC51A17F45F9CC8C9A3B5239288036A70EBE8F19A2B1C62C8D17A3FE_1576219085869_image.png)


**Task 3: Confirm Docker Installation and Setup**

The best way to know for sure if we are set up and ready to start using Docker for our project is to check for versions of the installation via the terminal:

```bash
docker version
docker-compose version
```

## Exercise 1b: Setup Docker on Windows

Installing Docker on Windows is similar to the Mac process. Go to the [install website](https://docs.docker.com/docker-for-windows/install/) and download the Windows build.

## Exercise 1c: Setup Docker on Ubuntu

From Ubuntu 16.04, you get Docker already installed, but there might be a chance that it will not be up to date. In this exercise, you will learn how to set up the latest stable version of Docker on Ubuntu.

**Task 1: Get Docker**

To install Docker, you need to download and validate it.


```bash 
# 1. Validate download
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 2. Add Docker repo to APT sources
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 3. Update package database
sudo apt-get update

# 4. Confirm you are installing from the Docker Repo and not the one that comes with Ubuntu 16.05
apt-cache policy docker-ce
```

**Task 2: Install Docker**

To finally install Docker, run:

```bash
sudo apt-get install -y docker-ce
```

After installation, the Docker daemon will get started by the system. The installation will also make sure that Docker starts on boot.

To confirm the status of your installation, run:

```bash 
sudo systemctl status docker
```

> If you are using Ubuntu, every time you want to run a docker command, it has to start with `sudo`. For example `sudo docker version`. You can [setup superuser permissions](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04#step-2-%E2%80%94-executing-the-docker-command-without-sudo-(optional)) to bypass using sudo.


**Task 3: Download docker-compose**

Run the following command to download docker-compose:

```bash 
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

**Task 4: Update permission**

You cannot run `docker-compose` now because of permission restrictions. You can change these restrictions by running the following:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

**Verify Installation**

Now you can check for versions to verify if both `docker` and `docker` compose successfully installed:

```bash
docker version
docker-compose version
```
