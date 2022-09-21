const path = require('path');

const configSqlite = {
    db: {
        client: 'better-sqlite3',
        connection: {
            filename: path.join(__dirname, '../../DB/mensajes.db3')
        },
        useNullAsDefault: true
    }
}

module.exports = configSqlite;