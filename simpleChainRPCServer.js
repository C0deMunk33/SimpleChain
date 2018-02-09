var Web3 = require("web3");
var jayson = require('jayson');
var SimpleChain = require("./SimpleChain");
var StateProtocol = require("./StateProtocol");
//var EthAuth = require("./EthAuth");
var msgpack = require("msgpack-lite");

var ethNode = 'https://mainnet.infura.io/';
			
web3 = new Web3(new Web3.providers.HttpProvider(ethNode));	
			
var localBlockchain = new SimpleChain.SimpleChain(100, web3, msgpack, true, 10);
var stateCoordinator = new StateProtocol.StateCoordinator(localBlockchain);

//var wallet = EthAuth.createWallet("testPW");
// create a server
var server = jayson.server({
	//CreateNewTrackedState
	//args[0]: object to start tracking
	CreateNewTrackedState: (args, callback)=>{
		var newTrackedState = stateCoordinator.addObjectToTrack(JSON.parse(args[0]),args[1], localBlockchain);
		
		callback(null, newTrackedState);
	},
	//UpdateTrackedState
	//args[0] state object to record
	UpdateTrackedState:(args, callback)=>{
		
		var trackedObject = JSON.parse(args[0]);
		var updatedState = stateCoordinator.updateTrackedStateObject(trackedObject, localBlockchain);
		//console.log(updatedState);
		callback(null,updatedState);
	},
	GetTrackedState:(args,callback)=>{
		var trackedState = stateCoordinator.trackedStateItems[args[0]];
		//console.log(trackedState);
		callback(null, trackedState);
	},
	GetBlock:(args, callback)=>{
		var block = localBlockchain.GetBlock(args[0]);
		callback(null,block);
	},
	GetStateChange:(args, callback)=>{
		var state = localBlockchain.GetStateChange(args[0]);
		callback(null,state);
	}
});
 
server.http().listen(2702);
