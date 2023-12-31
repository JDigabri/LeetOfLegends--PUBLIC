# Project Name

Provide a brief description of your project here. This README outlines the steps necessary to get this project up and running.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Git](https://git-scm.com/).
- You have Docker installed on your machine.
- You have access to an ArangoDB instance for database setup.

## Installation

### 1. Clone the Repository

To get started with the project, first clone the repository to your local machine:

```bash
git clone [Your Repository URL]
cd [Your Repository Folder]
Replace [Your Repository URL] with the URL of your Git repository and [Your Repository Folder] with the name of the folder where your project is located.
```
### 2. Upload neo4j.dump to ArangoDB
To set up the database:

Obtain the neo4j.dump file (replace with your actual database dump file name).
Log into your ArangoDB instance.
Use the ArangoDB interface or command line tools to import the neo4j.dump file.
### 3. Environment Configuration
Create a .env file in the root directory of the project. Add the following environment variables, replacing the placeholders with your actual data:

env
```bash
NEO_4J_CONNECTION_URL=bolt://[hostname]:[port]
NEO_4J_USER=[your_username]
NEO_4J_PASSWORD=[your_password]
KEY=[whatever you want you jwt key to be]
```
### 4. Docker Compose Up
Ensure Docker is installed on your machine. Then, run the following command in the root directory of the project:

```bash
docker-compose up
```
This will build and start all the services defined in your docker-compose.yml file.
