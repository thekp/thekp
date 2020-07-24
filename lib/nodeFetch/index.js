const fetch = require('node-fetch');

module.exports = endpoint =>
  new Promise((resolve, reject) => {
    fetch(endpoint)
      .then(res => resolve(res.json()))
      .catch(error => reject(error));
  });
