'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, {
                foreignKey: 'userId',
            });
            this.hasMany(models.Comments, {
                as: 'Comments',
                foreignKey: 'postId',
            });
            this.hasMany(models.Likes, {
                as: 'Likes',
                foreignKey: 'postId',
            });
        }
    }
    Posts.init(
        {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postImg: {
                type: DataTypes.STRING,
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
            modelName: 'Posts',
        }
    );
    return Posts;
};
