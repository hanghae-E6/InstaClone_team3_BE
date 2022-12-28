'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Follows', {
            followId: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            userIdFollowing: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            userIdFollower: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Follows');
    },
};
