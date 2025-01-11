const { Client } = require("pg");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json"));

let pgClient = null;

function initializeClient(config) {
  pgClient = new Client(config);
  return pgClient.connect();
}

function getClient() {
  return pgClient;
}

module.exports = {
  initializeClient,
  getClient,
};
