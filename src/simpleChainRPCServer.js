import Web3 from 'web3';
import jayson from 'jayson';
import msgpack from 'msgpack-lite';
import SimpleChain from './SimpleChain';
import { StateCoordinator } from './StateProtocol';
// var EthAuth = require("./EthAuth");

const ethNode = 'https://mainnet.infura.io/';
const localBlockchain =
new SimpleChain(100, new Web3(new Web3.providers.HttpProvider(ethNode)), msgpack, true, 10);
const stateCoordinator = new StateCoordinator(localBlockchain);

// var wallet = EthAuth.createWallet("testPW");
/**
 * [SimpleChainRPCServer description]
 * @type {[type]}
 */
const SimpleChainRPCServer = jayson.server({
  // CreateNewTrackedState
  // args[0]: object to start tracking
  CreateNewTrackedState: (args, callback) => {
    const [arg1, arg2] = args;
    callback(null, stateCoordinator.addObjectToTrack(
      JSON.parse(arg1),
      arg2,
      localBlockchain,
    ));
  },
  // UpdateTrackedState
  // args[0] state object to record
  UpdateTrackedState: (args, callback) => {
    const trackedObject = JSON.parse(args[0]);
    const updatedState = stateCoordinator.updateTrackedStateObject(trackedObject, localBlockchain);
    // console.log(updatedState);
    callback(null, updatedState);
  },

  GetTrackedState: (args, callback) => {
    const trackedState = stateCoordinator.trackedStateItems[args[0]];
    // console.log(trackedState);
    callback(null, trackedState);
  },

  GetBlock: (args, callback) => {
    let result = {};
    result.block = localBlockchain.GetBlock(args[0]);
    result.proof = [];
    callback(null, block);
  },

  GetStateChange: (args, callback) => {
    const state = localBlockchain.GetStateChange(args[0]);
    callback(null, state);
  },
});
export default SimpleChainRPCServer;
