# Node.js Project

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20.18.3 or later recommended)
- NPM (v10.8.2 or later recommended)
- Its needed a .env file with the following environment variables:

Port where that Node instance will use
PORT=8080
Environment use keep 'development'
NODE_ENV=development
MySQL database paramameter (the names give are self explained)
MYSQL_DB_USER=root
MYSQL_DB_PASSWORD=
MYSQL_DB_HOST=localhost
MYSQL_DB_NAME=backend_challenge_hc
MYSQL_DB_PORT=3306

### For Testing Purposes Load Dummy DataSet

1. Invoke the script to generate a .json file with dummyDataSet

   ```
   npm run generate
   ```
2. Insert the dummyDataSet into the Development (invoke the following endpoint of the Rest Api) remember that for this its needed to have an account and logged in since its need the token for the Header (Authorization : Bearer {{Logintoken}}

```
	{{base_url}}/dummy/saveDummyMovies
```

the base_url would be localhost:8080 in case the port is 8080 being used.

3. The first step can be ignore since there is already a dummyDataSet in dummyData folder ready to be use.

### For Testing Backend Rest API

There is a Folder called Postman that haves a collection of postman to make requests to the endpoits - Import that Collection (BackendChallenge.postman_collection.json)

Import now the Environment (REST API.postman_environment.json) where its defined the variable base_url.

### Development Environment (Optional)

eslint:
prettiefy

Extensions (VSC):

- Prettier ESLint
- ESLint
- Prettier - Code formatter

### Installation

1. Clone the repository:

   ```
   cd ~/Documents
   git clone git@github.com:HCorte/BackendChallenge.git
   cd ~/Documents/BackendChallenge
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Install MySQL:

   [MySQL Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)

### Running the Application (DEV)

```
   npm run start
```

or just

```
   npm start
```

## Conclusion

This project serves as a backend to be used with decoupled frontend in this case a React.js project

---
