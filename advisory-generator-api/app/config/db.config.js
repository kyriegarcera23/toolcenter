module.exports = {
  "development": {
    "username": "root",
    "password": 'P@ssw0rd_2021',
    "database": "micts_toolcenter_advisory",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": '3306',
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
    "timezone": "+08:00", // for writing to database
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": '3306',
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
    "timezone": "+08:00", // for writing to database
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "port": process.env.DB_PORT,
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
    "timezone": "+08:00", // for writing to database
    "logging": false
  }
}