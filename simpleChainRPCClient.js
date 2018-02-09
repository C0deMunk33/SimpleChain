var jayson = require('jayson');
 

var client = jayson.client.http('http://localhost:2702');



async function updateTrackedState(newTrackedState) {
	var thisStateString = JSON.stringify(newTrackedState);
    const res = await client.request("UpdateTrackedState", [thisStateString], (err,data)=>{
		
		console.log("data");
		console.log(data);
		return data;
	});
	return res;
}

var key = "0x1";
client.request('GetTrackedState',[key], (e,r)=>{
		console.log("tracked");
		console.log(r);
});


function send1000(runCount){
	client.request('GetTrackedState',[key], (e,r)=>{
		
		//console.log("tracked");
		//console.log(r);
		var newTrackedState = r.result;
		var batch = [];
		for(var bulkTestIdx = 0; bulkTestIdx<100; bulkTestIdx++){
			newTrackedState.obj.number++;				
			//updateTrackedState(newTrackedState);
			batch.push(client.request("UpdateTrackedState", [JSON.stringify(newTrackedState)]));
			
		}
		
		client.request(batch, function(err, responses) {
			if(err) throw err;
			
			//console.log('responses', responses.length); // all responses together
			if(runCount >1){
				
				send1000(runCount-1);
				/*
				setTimeout(()=>{
				send1000(runCount-1);
				
				}, 250);
*/
			}
			else{
				client.request('GetTrackedState',[key], (e,r)=>{
					console.log("tracked");
					console.log(r);
				});
				/*
				setTimeout(()=>{
				}, 250);
				*/
			}
				
		});
	});
	
	
}

send1000(11);






/*
client.request('GetBlock', [1], function(err, response) {
  if(err){
	  console.log(err);
	  throw err;
  }
  console.log("Block size: " + response.result.length); 
});

client.request('GetStateChange', [15000], function(err, response) {
  if(err){
	  console.log(err);
	  throw err;
  }
  console.log("state #15000"); 
  console.log(response.result); 
});

*/