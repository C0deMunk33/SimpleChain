/**
 * [StateCoordinator description]
 */
class StateCoordinator {
	constructor(){
		this.trackedStateItems = {};
	}

	addObjectToTrack(obj,key,localChain){

		var blockNumber = localChain.blockCount;
		if(key == null){
			key = localChain.web3.utils.sha3(JSON.stringify([obj, blockNumber]));
		}
		var newState = new state(key, obj, blockNumber);

		this.trackedStateItems[key] = newState;

		localChain.RecordState(newState);

		return newState;
	}
	updateTrackedStateObject(trackedStateObj,localChain){

		var prevBlock = this.trackedStateItems[trackedStateObj.key].blockNumber;
		var thisNonce = this.trackedStateItems[trackedStateObj.key].nonce+1;
		this.trackedStateItems[trackedStateObj.key] = trackedStateObj;
		this.trackedStateItems[trackedStateObj.key].previousBlockNumber = prevBlock;
		this.trackedStateItems[trackedStateObj.key].blockNumber = localChain.blockCount;
		this.trackedStateItems[trackedStateObj.key].nonce = thisNonce;
		//console.log("trackedStateObj");
		//console.log(trackedStateObj);
		//console.log("this.trackedStateItems[trackedStateObj.key]");
		//console.log(this.trackedStateItems[trackedStateObj.key]);

		localChain.RecordState(this.trackedStateItems[trackedStateObj.key]);
		return this.trackedStateItems[trackedStateObj.key];
	}
}

class State {
	constructor(key, obj, blockNumber){
		this.nonce = 0;
		this.key = key;
		this.obj = obj;
		this.blockNumber = blockNumber;
		this.previousBlockNumber = 0;
	}
}

export {
	State,
	StateCoordinator
};
