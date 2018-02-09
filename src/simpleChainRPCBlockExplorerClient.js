var jayson = require('jayson');
 
// create a client
var client = jayson.client.http({
  port: 2702
});



var newObjectToTrack = {
	name:"test object",
	number:42
};




client.request('GetBlock', [1], function(err, response) {
  if(err){
	  console.log(err);
	  throw err;
  }
  console.log("Block size: " + response.result.length); 
});

stateId = 500000;

client.request('GetStateChange', [stateId], function(err, response) {
  if(err){
	  console.log(err);
	  throw err;
  }
  console.log("state #"+stateId); 
  console.log(response.result); 
});

