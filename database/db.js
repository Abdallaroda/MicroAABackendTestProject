const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

database();

async function database() {
    //create database if non-existing
    const { host, port, user, password, database } = config.databse;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    //connect to database
    const sequelize = new Sequelize(database, user, password, { dialect: "mysql" });

    //initialize model and attach to exported db-object
    db.User = require('./db.model')(sequelize);

    //sync model with database
    await sequelize.sync();
}