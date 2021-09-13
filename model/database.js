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

async function transaction(queries, queryValues) {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection(function (err, connection) {
            if (queries.length !== queryValues.length) {
                return reject(
                    'Number of provided queries did not match the number of provided query values arrays'
                )
            }
            try {
                connection.beginTransaction((err) => {
                    if (err){
                        connection.rollback(() => { reject(err) });
                        connection.end()
                    }
                })
                const queryPromises = []

                for(let i =0; i< queries.length; i++ ) {
                    queryPromises.push(async () => { return await queryDatabase(queries[i], queryValues[i])})
                }
                queryPromises.reduce(function (prev, curr) {
                    return prev.then(curr);
                }, Promise.resolve())
                    .then((result) => {
                        connection.commit()
                        connection.end()
                        resolve(result)
                    }).catch((err) => {
                    connection.rollback(() => { reject(err) })
                    connection.end()
                });
            } catch (err) {
                connection.rollback(() => { reject(err) })
                connection.end()
            }
        })
    });
}

/// Database calls

exports.getSkills = async () => {
    return await queryDatabaseSimple('select * from skills')
}

exports.getUserSkills = async (userId) => {
    return await queryDatabase(
        `select skills.name, skills.id from user_skills 
                    inner join users on users.id = user_skills.user_id 
                    inner join skills on skills.id = user_skills.user_skill_id
                    where firebase_id = ?`,
        [userId])
}

exports.getUser = async (userId) => {
    return await queryDatabase(
        `select id from users where firebase_id = ?`, [userId]
    )
}

exports.addUser = async (userId) => {
    return await queryDatabase(
        `insert into users(firebase_id) values (?)`, [userId]
    )
}





// Database calls with transactions


exports.replaceUserSkills = async (userId, skills) => {
    let insertDynamicQuery =
        `insert into user_skills(user_id, user_skill_id) values `;

    for (let i = 0; i < skills.length; i++ ){
        insertDynamicQuery += `(
            (select id from users where firebase_id = "` + userId + `"),
            ?
        ),`
    }

    insertDynamicQuery = insertDynamicQuery.replace(/.$/,";");

    return await transaction([
        `delete w from user_skills w
            inner join users on users.id = w.user_id
            where firebase_id = ?;`,
        insertDynamicQuery
    ],[
        [userId], skills
    ])
}