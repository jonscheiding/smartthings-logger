const dotenv = require('dotenv');

module.exports = function jestConfig() {
  dotenv.config({ path: '.env.test' });
};
