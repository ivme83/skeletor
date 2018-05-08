module.exports = function(sequelize, DataTypes){
    var user = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
    }, {
    timestamps: true
    });


    return user;
}