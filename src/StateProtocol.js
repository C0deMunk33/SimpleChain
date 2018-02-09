class State {
  constructor(key, obj, blockNumber) {
    this.nonce = 0;
    this.key = key;
    this.obj = obj;
    this.blockNumber = blockNumber;
    this.previousBlockNumber = 0;
  }
}

/**
 * [StateCoordinator description]
 */
class StateCoordinator {
  constructor() {
    this.trackedStateItems = {};
  }

  addObjectToTrack(obj, _key, localChain) {
    let key = _key;
    const blockNumber = localChain.blockCount;
    if (key == null) {
      key = localChain.web3.utils.sha3(JSON.stringify([obj, blockNumber]));
    }
    const newState = new State(key, obj, blockNumber);

    this.trackedStateItems[key] = newState;

    localChain.RecordState(newState);

    return newState;
  }
  updateTrackedStateObject(trackedStateObj, localChain) {
    const prevBlock = this.trackedStateItems[trackedStateObj.key].blockNumber;
    const thisNonce = this.trackedStateItems[trackedStateObj.key].nonce + 1;
    this.trackedStateItems[trackedStateObj.key] = trackedStateObj;
    this.trackedStateItems[trackedStateObj.key].previousBlockNumber = prevBlock;
    this.trackedStateItems[trackedStateObj.key].blockNumber = localChain.blockCount;
    this.trackedStateItems[trackedStateObj.key].nonce = thisNonce;
    // console.log("trackedStateObj");
    // console.log(trackedStateObj);
    // console.log("this.trackedStateItems[trackedStateObj.key]");
    // console.log(this.trackedStateItems[trackedStateObj.key]);

    localChain.RecordState(this.trackedStateItems[trackedStateObj.key]);
    return this.trackedStateItems[trackedStateObj.key];
  }
}

export {
  State,
  StateCoordinator,
};
