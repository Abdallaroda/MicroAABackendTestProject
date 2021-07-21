const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    //table attributes
    const attributes = {
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false }
    };

    //table options
    const options = {
        defaultScope: {
            //include hash
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            //exclude hash
            includeHash: { attributes: {} }
        }
    };

    //define table
    return sequelize.define('User', attributes, options);
}