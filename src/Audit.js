var jayson = require('jayson');
 
// create a client
var client = jayson.client.http({
	port: 2702
});



function DoAudit(){
	//TODO: get current block number
	var blockHeight = 9001;
	
	var blockToAudit = Math.floor(Math.random() * blockHeight);  
	
	client.GetBlock(blockToAudit)
	.then((block) => {
		/*
		block{
			contents://array of tracked states
		}
		*/
		//hash block.contents
		var blockHash;
		
		
	});
	
	
}