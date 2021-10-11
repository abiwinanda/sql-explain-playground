'use strict';

const { Client } = require('pg');
const random = require('random-name')
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config.json');

const pgClient = new Client({
  user: config.development.username,
  host: config.development.host,
  database: config.development.database,
  password: config.development.password,
  port: config.development.port,
})

pgClient.connect()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    for (let i = 0; i < 10000; i++) {
      await pgClient.query(`
        INSERT INTO students(id, first_name, middle_name, last_name)
        VALUES($1, $2, $3, $4)`
      , [uuidv4(), random.first(), random.middle(), random.last()])
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
