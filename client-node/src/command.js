"use strict";

const { authorized, get, post } = require("./network");
const { config } = require("./config");
const colors = require("colors");

const listPlayers = () => {
  authorized(get)("/user")
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        return resp.json();
      }
    })
    .then(players =>
      players.map(player => {
        const { id, name } = player;
        console.log(`Name: ${name}, Id: ${id}`.green);
      })
    )
    .catch(err => console.log(`Encountered error: ${err}`.red));
};

const register = name => {
  post("/user/", { body: { name } })
    .then(registration => {
      if (registration.ok) {
        registration.json().then(registrationResult => {
          const { name, pooCount, token } = registrationResult;
          console.log(
            `Successfully registered user '${name}'. Initial poo count: ${pooCount}.
Now, export your personal access token.

Unix: "export ${config.token}=${token}"
Windows: "set ${config.token}=${token}`.green
          );
        });
      } else {
        console.log(`Failed to register user ${name}`.red);
      }
    })
    .catch(err => console.log(`Encountered error: ${err}`.red));
};

const poo = (player, otherPlayers) => {
  const players = [player, ...otherPlayers];
  const poops = [];
  players.forEach(player => {
    poops.push(authorized(post)(`/user/${player}/poo/`));
  });
  Promise.all(poops)
    .then(results =>
      results.map(result => console.log(`${result.statusText}`.green))
    )
    .catch(err => console.log(`Encountered error: ${err}`.red));
};

const status = () => {
  authorized(get)("/poo")
    .then(result => result.json())
    .then(jsonResponse => {
      const { pooCount } = jsonResponse;
      console.log(`Current poo count: ${pooCount}`);
    })
    .catch(err => console.log(`Encountered error: ${err}`.red));
};

module.exports = {
  listPlayers,
  register,
  status,
  poo
};
