import fs from 'fs';
// import shelljs from 'shelljs';
import rimraf from 'rimraf';
import path from 'path';

const rootDir = path.resolve(__dirname, '../', 'chainData');
const treesDir = `${rootDir}/Trees`;
const blocksDir = `${rootDir}/Blocks/`;
/**
 * [SimpleChain description]
 */
class SimpleChain {
  // this should prob just be a single 'config' object, instead of tons of args
  constructor(blocksize, web3, msgPack, newChain, snapshotSize) {
    this.web3 = web3;
    this.msgPack = msgPack;

    this.blocksize = blocksize;

    this.snapshotHashes = [];
    this.snapshotLocalBlockMapping = {};

    this.currentBlock = [];
    this.lastMerkleHash = '0x42';
    this.lastSnapshotHash = '0x42';

    this.stateCount = 0;
    this.blockCount = 0;
    this.snapshotCount = 0;

    this.snapshotSize = snapshotSize;
    // should be configurable
    this.rootDir = rootDir;
    this.blockFolderRoot = blocksDir;
    this.merkleTree = `${treesDir}/merkle.tree`;
    this.snapshotTree = `${treesDir}/snapshot.tree`;
    this.ipfsDirs = `${treesDir}/IPFS.tree`;
    this.start = new Date();
    this.startBlock = new Date();
    this.lastIPFS = '';

    if (!fs.existsSync(this.rootDir)) {
      fs.mkdirSync(this.rootDir);
    }

    if (!fs.existsSync(this.blockFolderRoot)) {
      fs.mkdirSync(this.blockFolderRoot);
    }

    if (!fs.existsSync(treesDir)) {
      fs.mkdirSync(treesDir);
    }

    if (newChain) {
      fs.readdir(this.blockFolderRoot, (err, files) => {
        if (err) throw err;

        for (let fileIdx = 0; fileIdx < files.count; fileIdx += 1) {
          rimraf(this.blockFolderRoot + files[fileIdx]);
        }
      });
      fs.readdir(treesDir, (err, files) => {
        if (err) throw err;

        for (let fileIdx = 0; fileIdx < files.count; fileIdx += 1) {
          fs.unlink(path.join(treesDir, files[fileIdx]), (innerErr) => {
            if (innerErr) throw innerErr;
          });
        }
      });
    } else {
    // TODO: startup recovery
    }
  }

  RecordState(stateData) {
    this.currentBlock.push(stateData);
    this.stateCount += 1;
    if (this.currentBlock.length >= this.blocksize) {
      this.RecordBlock();
      // const seconds = (new Date() - this.startBlock.getTime()) / 1000;
      // const secondsTotal = (new Date() - this.start.getTime()) / 1000;
      // console.log("block number: " + this.blockCount);
      // console.log(seconds + " seconds");
      // console.log(secondsTotal + " seconds total");
      this.startBlock = new Date();
    }
  }
  RecordBlock() {
    const currentBlockHash =
    this.web3.utils.sha3(JSON.stringify([this.currentBlock, this.blockCount]));

    const thisMerkleHash =
    this.web3.utils.sha3(JSON.stringify([currentBlockHash, this.lastMerkleHash, this.blockCount]));

    fs.appendFileSync(this.merkleTree, `${thisMerkleHash}, ${currentBlockHash}\n`);

    const blockFolder = `${this.blockFolderRoot + Math.floor(this.blockCount / this.snapshotSize)}/`;

    if (!fs.existsSync(blockFolder)) {
      fs.mkdirSync(blockFolder);
    }


    const packedBlock = this.msgPack.encode(this.currentBlock);
    fs.writeFileSync(`${blockFolder + this.blockCount}.block`, packedBlock);

    this.blockCount += 1;
    this.lastMerkleHash = thisMerkleHash;
    this.currentBlock = [];

    if ((this.blockCount % this.snapshotSize) === 0) {
      this.RecordSnapshot();

      // NOTE: TO USE IPFS BACKUP, UNCOMMENT...
      /*
            var blocksSaves = shell.exec("ipfs add -r -w " + blockFolder).stdout.split(" ");
            this.lastIPFS = blocksSaves[blocksSaves.length-2];
            //console.log("last IPFS");
            //console.log(this.lastIPFS);
            fs.appendFileSync(this.ipfsDirs, this.blockCount + ", " + this.lastIPFS + "\n");
            */
      // TO HERE
    }
  }

  RecordSnapshot() {
    const snapshotHash = this.web3.utils
      .sha3(JSON.stringify([this.lastSnapshotHash, this.lastMerkleHash, this.snapshotCount]));
    fs.appendFileSync(this.snapshotTree, `${snapshotHash}, ${this.blockCount}\n`);
    this.snapshotCount += 1;
    // console.log(`State Record Count: ${this.stateCount}`);
    // console.log(`Blocks: ${this.blockCount}`);
    // console.log(`snapshot #${this.snapshotCount}: ${snapshotHash}`);
    // console.log('');
    // TODO: record to ETH mainnet

    this.lastSnapshotHash = snapshotHash;
  }

  GetBlock(blockNumber) {
    // console.log(`getting block ${blockNumber}`);
    const blockFileName = `${this.blockFolder + blockNumber}.block`;
    const file = fs.readFileSync(blockFileName);
    const unpacked = this.msgPack.decode(file);
    return unpacked;
  }

  GetStateChange(stateChangeNumber) {
    const blockNumber = Math.floor(stateChangeNumber / this.blocksize);
    const indexNumber = stateChangeNumber % this.blocksize;

    return this.GetBlock(blockNumber)[indexNumber];
  }
}
export default SimpleChain;
