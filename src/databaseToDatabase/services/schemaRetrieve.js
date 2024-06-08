// const sqlite3 = require("sqlite3").verbose();

/**
 * @param {takes the database type and data type and macthes them with the respective data type}
 * @returns {returns the data type matched}
 */
function mapDataType(databaseType, dataType) {
  const lowercaseDataType = dataType.toLowerCase().trim();

  switch (databaseType) {
    case "mysql":
      if (lowercaseDataType.includes("char")) {
        return "String";
      } else if (
        lowercaseDataType.includes("varchar") ||
        lowercaseDataType.includes("text")
      ) {
        return "String";
      } else if (lowercaseDataType.startsWith("int")) {
        return "Integer";
      } else if (
        lowercaseDataType.includes("float") ||
        lowercaseDataType.includes("double") ||
        lowercaseDataType.includes("decimal")
      ) {
        return "Float";
      } else if (
        lowercaseDataType.includes("date") ||
        lowercaseDataType.includes("datetime") ||
        lowercaseDataType.includes("timestamp")
      ) {
        return "DateTime";
      }
      break;
    case "postgresql":
      if (
        lowercaseDataType.includes("character varying") ||
        lowercaseDataType.includes("text")
      ) {
        return "String";
      } else if (
        lowercaseDataType.includes("int") ||
        lowercaseDataType.includes("real") ||
        lowercaseDataType.includes("double precision") ||
        lowercaseDataType.includes("numeric")
      ) {
        return "Integer";
      } else if (
        lowercaseDataType.includes("date") ||
        lowercaseDataType.includes("timestamp")
      ) {
        return "DateTime";
      }
      break;
    case "oracle":
      if (
        lowercaseDataType.includes("varchar") ||
        lowercaseDataType.includes("nvarchar") ||
        lowercaseDataType.includes("clob")
      ) {
        return "String";
      } else if (lowercaseDataType.includes("number")) {
        return "Integer";
      } else if (
        lowercaseDataType.includes("float") ||
        lowercaseDataType.includes("binary_float") ||
        lowercaseDataType.includes("binary_double")
      ) {
        return "Float";
      } else if (
        lowercaseDataType.includes("date") ||
        lowercaseDataType.includes("timestamp")
      ) {
        return "DateTime";
      }
      break;
    case "mongodb":
      if (
        lowercaseDataType.includes("int") ||
        lowercaseDataType.includes("long")
      ) {
        return "Integer";
      } else if (lowercaseDataType.includes("double")) {
        return "Float";
      } else if (
        lowercaseDataType.includes("string") ||
        lowercaseDataType.includes("objectid") ||
        lowercaseDataType.includes("javascript")
      ) {
        return "String";
      } else if (lowercaseDataType.includes("date")) {
        return "DateTime";
      }
      break;
    case "sqlite":
      if (lowercaseDataType.includes("integer")) {
        return "Integer";
      } else if (lowercaseDataType.includes("real")) {
        return "Float";
      } else if (lowercaseDataType.includes("text")) {
        return "String";
      } else if (lowercaseDataType.includes("datetime")) {
        return "DateTime";
      }
      break;
    default:
      return "Unknown";
  }
  return "Unknown";
}

/**
 * @param {takes the sequelize and database name as input and fetches the schema }
 * @returns {returns the schema  (column names) with data type of the column}
 */
export const fetchMySQLSchema = async (sequelize, dbName) => {
  try {
    // const [tables] = await sequelize.query(`SHOW TABLES FROM ${dbName}`);
    // const tableNames = tables.map((table) => table[`Tables_in_${dbName}`]);
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    const schema = {};
    for (const tableName of tableNames) {
      const [columns] = await sequelize.query(
        `SHOW COLUMNS FROM ${dbName}.${tableName}`
      );
      schema[tableName] = {};
      for (const column of columns) {
        schema[tableName][column.Field] =
          // mapDataType("mysql", column.Type);
          {
            // type: mapDataType("mysql", column.Type),
            type: column.Type,
            primaryKey: column.Key === "PRI"
          };
      }
    }

    return schema;
  } catch (error) {
    return "error fetching schema";
  }
};

/**
 * @param {takes the sequelize and database name as input and fetches the schema }
 * @returns {returns the schema  (column names) with data type of the column}
 */

export const fetchPostgreSQLSchema = async (sequelize, dbName) => {
  try {
    const [tables] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'`);
    const tableNames = tables.map((table) => table.table_name);

    const schema = {};
    for (const tableName of tableNames) {
      const columnsQuery = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name='${tableName}'`);

      const primaryKeyQuery = await sequelize.query(`
            SELECT kcu.column_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.constraint_column_usage AS ccu 
            ON tc.constraint_name = ccu.constraint_name
            JOIN information_schema.key_column_usage AS kcu 
            ON kcu.constraint_name = tc.constraint_name
            WHERE tc.table_name='${tableName}' 
            AND tc.constraint_type='PRIMARY KEY'
        `);

      const primaryKeyColumns = primaryKeyQuery[0].map(
        (row) => row.column_name
      );

      schema[tableName] = {};
      for (const column of columnsQuery[0]) {
        schema[tableName][column.column_name] = {
          type: column.data_type,
          primaryKey: primaryKeyColumns.includes(column.column_name)
        };
      }
    }

    return schema;
  } catch (error) {
    return "error fetching schema";
  }
};

/**
 * @param {takes the sequelize and database name as input and fetches the schema }
 * @returns {returns the schema  (column names) with data type of the column}
 */
export const fetchOracleSchema = async (sequelize, dbname) => {
  try {
    const query = `
            SELECT table_name, column_name, data_type
            FROM all_tab_columns
            WHERE owner = '${dbname}'
        `;
    const result = await sequelize.query(query);

    const schema = {};
    result[0].forEach((row) => {
      const tableName = row.table_name;
      const columnName = row.column_name;
      const dataType = row.data_type;
      if (!schema[tableName]) {
        schema[tableName] = {};
      }
      schema[tableName][columnName] =
        // mapDataType("oracle", dataType);
        {
          // type: mapDataType("oracle", dataType),
          type: dataType,
          primaryKey: row.column_key === "PRI"
        };
    });

    return schema;
  } catch (error) {
    return "error fetching schema";
  }
};

/**
 * @param {takes the sequelize and database name as input and fetches the schema }
 * @returns {returns the schema  (column names) with data type of the column}
 */

export const fetchMongoDBSchema = async (client, dbName) => {
  try {
    const database = client.db(dbName);
    const collections = await database.listCollections().toArray();

    const schema = {};
    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionSchema = await database
        .collection(collectionName)
        .findOne();
      schema[collectionName] = Object.keys(collectionSchema).reduce(
        (acc, key) => {
          acc[key] =
            // mapDataType("mongodb", typeof collectionSchema[key]);
            {
              // type: mapDataType("mongodb", typeof collectionSchema[key]),
              type: typeof collectionSchema[key],
              primaryKey: key === "_id"
            };
          return acc;
        },
        {}
      );
    }
    return schema;
  } catch (error) {
    return "error fetching schema";
  }
};

/**
 * @param {takes the sequelize and database name as input and fetches the schema }
 * @returns {returns the schema  (column names) with data type of the column}
 */

export const fetchSQLiteSchema = async (sequelize) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const db = new sqlite3.Database(
      "your_database.db",
      // eslint-disable-next-line no-undef
      sqlite3.OPEN_READONLY,
      (err) => {
        if (err) {
          reject(err);
        } else {
          const schema = {};
          db.all(
            "SELECT name FROM sqlite_master WHERE type='table'",
            [],
            (err, tables) => {
              if (err) {
                reject(err);
                return;
              }

              const tableNames = tables.map((table) => table.name);
              tableNames.forEach((tableName) => {
                db.all(
                  `PRAGMA table_info(${tableName})`,
                  [],
                  (err, columns) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    schema[tableName] = columns.reduce((acc, column) => {
                      acc[column.name] = mapDataType("sqlite", column.type);
                      return acc;
                    }, {});
                    if (Object.keys(schema).length === tableNames.length) {
                      resolve(schema);
                    }
                  }
                );
              });
            }
          );
        }
      }
    );
  });
};
