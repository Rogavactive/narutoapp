const mysql = require('mysql')
const localVars = require('./localVars')
const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: localVars.db_host,
    user: localVars.db_username,
    password: localVars.db_password,
    database: localVars.db_database
})

/// Helper functions

async function modifyDatabase(queryString, paramsArr) {
    return await queryDatabase(queryString, paramsArr)
}

async function modifyDatabaseSimple(queryString) {
    return await queryDatabase(queryString, [])
}

async function queryDatabaseSimple(queryString) {
    return await queryDatabase(queryString, [])
}

async function queryDatabase(queryString, paramsArr) {
    return new Promise(((resolve, reject) => {
        connectionPool.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            // Use the connection
            connection.query(queryString, paramsArr, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) reject(error);

                // Don't use the connection here, it has been returned to the pool.
                resolve(results)
            });
        })
    }));
}

/// Database calls

exports.getSkills = async function () {
    return await queryDatabaseSimple('select * from skills')
}