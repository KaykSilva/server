const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    insecureAuth: true
})

connection.connect((error)=> {
    if(error) throw error
    console.log(`connected to database:${process.env.DB_NAME}`)
})

module.exports = connection