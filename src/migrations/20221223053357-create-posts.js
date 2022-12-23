'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
            title: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            postImg: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    },
};
