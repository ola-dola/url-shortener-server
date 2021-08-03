// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/database.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
    pool: {
      afterCreate: (conn, done) => {
        // turn on FK enforcement. Runs after connection is made with the sqlite engin
        conn.run("PRAGMA foreign_keys = ON", done); 
      },
    },
  },
  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./data/test-db.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
    pool: {
      afterCreate: (conn, done) => {
        // turn on FK enforcement. Runs after connection is made with the sqlite engin
        conn.run("PRAGMA foreign_keys = ON", done); 
      },
    },
  },
};
