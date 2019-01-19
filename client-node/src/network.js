"use strict";

const nodeFetch = require("node-fetch");
const { config } = require("./config");

const get = (path, options = {}) => {
  return fetch(path, { method: "GET", ...options });
};

const post = (path, options = {}) => {
  return fetch(path, { method: "POST", ...options });
};

const put = (path, options = {}) => {
  return fetch(path, { method: "PUT", ...options });
};

const del = (path, options = {}) => {
  return fetch(path, { method: "DELETE", ...options });
};

const fetch = (path, options = {}) => {
  options.headers = { ...options.headers, "Content-Type": "application/json" };
  return nodeFetch(config.url + path, {
    ...options,
    body: JSON.stringify(options.body)
  });
};

const authorized = func => (path, options = {}) => {
  const token = process.env[config.token] || "";
  const { headers } = options;
  options.headers = { ...headers, Authorization: `Bearer ${token}` };
  return func(path, options);
};

module.exports = {
  authorized,
  del,
  fetch,
  get,
  post,
  put
};
