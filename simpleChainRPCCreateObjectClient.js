var jayson = require('jayson');
var client = jayson.client.http('http://localhost:2702');


var newObjectToTrack = {
	name:"CHANGE THIS",
	number:54564,
	Message:"CHANGE THIS!"
};

//TODO: put a different key in here
var key = "0x1";
client.request('CreateNewTrackedState', [JSON.stringify(newObjectToTrack), key],(err,response)=>{
		if(err){
			console.log(err);
			throw err;
		}
		//console.log(response.result); 
		
		var NewTrackedState = response.result;
		console.log("new state");
		console.log(NewTrackedState);
});