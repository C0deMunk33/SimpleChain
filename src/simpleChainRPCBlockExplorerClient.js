const jayson = require('jayson');

// create a client
const client = jayson.client.http({
  port: 2702,
});

client.request('GetBlock', [1], (err, response) => {
  if (err) {
    // console.log(err);
    throw err;
  }
  // console.log(`Block size: ${response.result.length}`);
  return response.result;
});

const stateId = 500000;

client.request('GetStateChange', [stateId], (err, response) => {
  if (err) {
    // console.log(err);
    throw err;
  }
  return response.result;
  // console.log(`state #${stateId}`);
  // console.log(response.result);
});

