#!/usr/bin/env node

const cli = require("commander");
const { listPlayers, register, status, poo } = require("./src/command");

cli
  .command("list")
  .description("List all players and their ids")
  .action(listPlayers);

cli
  .command("at <id> [otherIds...]")
  .description("Dump a load at another players host")
  .action(poo);

cli
  .command("status")
  .description("Check your current status.")
  .action(status);

cli
  .command("register <name>")
  .description("Register at the backend.")
  .action(register);

cli.parse(process.argv);
