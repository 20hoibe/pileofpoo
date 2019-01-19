const profiles = {
  development: "dev",
  production: "prod"
};

const commonConfig = {
  token: "POO_TOKEN"
};

const devConfig = {
  url: "http://localhost:3000",
  ...commonConfig
};

const prodConfig = {
  url: "http://192.168.172.43:3000",
  ...commonConfig
};

const currentProfile = process.env.PROFILE;

switch (currentProfile) {
  case profiles.production:
    module.exports = { config: prodConfig };
    break;
  case profiles.development:
  default:
    module.exports = { config: devConfig };
    break;
}
