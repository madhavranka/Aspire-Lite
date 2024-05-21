# Aspire-Lite

This is a small server side app for loan processing. This project uses Node.js, Express, Sequelize ORM, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

To get started with Aspire Lite, follow these steps:

Install latest version of node, postgresql, npm either using brew aur package installers from respective websites

1. **Clone the repository:**

   ```bash
   git clone https://github.com/madhavranka/Aspire-Lite.git
   cd Aspire-Lite
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of your project and add your environment-specific variables. Example:

   ```
   AES_ENCRYPTION_KEY=your_encryption_key
   IV=your_initialization_vector
   DATABASE_URL=your_database_url
   ```

4. **Run database migrations:**
   Before running db migrations, do these steps:

   1. Install PostgresQl and Start the postgres server
   2. Login using psql with your username(it has superuser permissions)
   3. Create Database "aspiredb" and either use you personal user or create a separate user and grand basic DML and DDL permissions to that user on aspiredb's public schema on all tables
   4. Once the above steps are done, change the values of parameters in src/database/config/config.json

   ```bash
   npm run migrate
   ```

## Usage

To start the server, run:

```bash
npm start
```

The server will start on the port specified in your environment variables or default to port 3000.

## Scripts

    npm start: Starts the server.
    npm test: Runs the test suite using Jest.
    npm run migrate: Runs database migrations using Sequelize CLI.

## API Endpoints

Loan

    Create Loan Request
        URL: /api/loan
        Method: POST
        Body: { customerId: string, amount: double, currency: string("USD"), noOfInstallments: number }
        Response: 201 Created with Loan Object

    Update Loan Request
        URL: /api/loan/:loanId/:customerId
        Method: PUT
        Body: { status }(or other properties that needs to be changed)
        Response: 200 OK

    Get Loan By ID
        URL: /api/loan/:loanId
        Method: GET
        Response: 200 OK

Payment

    Create Payment Entry
        URL: /api/payment
        Method: POST
        Body: { amount, loanId, customerId, status, currency, scheduleDate }
        Response: 201 Created

    Mark Payment as Paid
        URL: /api/payment/:paymentId/markAsPaid
        Method: PUT
        Body: { amount(non mandatory) }
        Response: 200 OK

## Testing

To run the tests, use the following command:

```bash
npm test
```

This will execute the Jest test suite and provide you with the test results.
