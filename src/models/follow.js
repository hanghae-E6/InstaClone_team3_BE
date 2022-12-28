'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Follows extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Follows.init(
        {
            followId: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userIdFollowing: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userIdFollower: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Follows',
        }
    );
    return Follows;
};
