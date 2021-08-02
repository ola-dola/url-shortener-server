exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username", 128).unique().notNullable();
      table.string("email", 128).unique().notNullable();
      table.string("password", 128).notNullable();
    })
    .createTable("links", (table) => {
      table.increments("id");
      table.text("full_url").notNullable();
      table.string("short_alias", 128).unique().notNullable();
      table
        .integer("user_id", 128)
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("links").dropTableIfExists("users");
};
