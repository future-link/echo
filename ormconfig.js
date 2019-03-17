const { DefaultNamingStrategy } = require('typeorm')
const { snakeCase } = require('typeorm/util/StringUtils')
const pluralize = require('pluralize')

class CustomNamingStrategy extends DefaultNamingStrategy {
  tableName(className, customName) {
    return customName || pluralize(snakeCase(className))
  }

  columnName(propertyName, customName, embeddedPrefixes = []) {
    return snakeCase(embeddedPrefixes.join('_')) + (customName || snakeCase(propertyName))
  }
}

module.exports = {
  // postgres
  type: 'postgres',
  host: process.env.ECHO_DB_HOSTNAME,
  port: process.env.ECHO_DB_PORT,
  username: process.env.ECHO_DB_USERNAME,
  password: process.env.ECHO_DB_PASSWORD,
  database: process.env.ECHO_DB_DATABASE,
  // entities
  entities: ['src/model/*.ts'],
  // migrations
  migrationsTableName: 'migrations',
  migrations: ['migration/*.ts'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'migration'
  },
  // naming
  namingStrategy: new CustomNamingStrategy()
}
