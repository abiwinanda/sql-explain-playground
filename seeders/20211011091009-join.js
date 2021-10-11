'use strict';

const { Client } = require('pg');
const random = require('random-name')
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config.json');
const getRandomInt = require('../utils/get_random_int')

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
    const customerIds = [];

    for (let i = 0; i < 1000; i++) {
      const res = await pgClient.query(`
        INSERT INTO customers(id, customer_name)
        VALUES($1, $2)
        RETURNING id`
      , [uuidv4(), random.first()]);

      customerIds.push(res.rows[0].id);
    }

    const productIds = [uuidv4(), uuidv4(), uuidv4()];
    const productExternalIds = [uuidv4(), uuidv4(), uuidv4()];

    await queryInterface.bulkInsert('products',
    [
      {
        id: productIds[0],
        external_id: productExternalIds[0],
        product_name: "Macbook Pro"
      },
      {
        id: productIds[1],
        external_id: productExternalIds[1],
        product_name: "iPhone"
      },
      {
        id: productIds[2],
        external_id: productExternalIds[2],
        product_name: "iPad"
      }
    ]);

    for (let i = 0; i < 1000; i++) {
      const res = await pgClient.query(`
        INSERT INTO orders(id, customer_id, product_external_id, quantity)
        VALUES($1, $2, $3, $4)`
      , [uuidv4(), customerIds[getRandomInt(0,999)], productExternalIds[getRandomInt(0,2)], getRandomInt(0,100)]);
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
