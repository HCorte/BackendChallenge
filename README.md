# Node.js Project

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v20.18.3 or later recommended)
* NPM (v10.8.2 or later recommended)

* Its needed a .env file with the following environment variables:

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

### Development Environment (Optional)

eslint:
prettiefy

Extensions (VSC):

* Prettier ESLint
* ESLint
* Prettier - Code formatter

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
