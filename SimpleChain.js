const fs = require('fs');
var shell = require('shelljs');
 rmDir = function(dirPath) {
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      fs.rmdirSync(dirPath);
    };

var SimpleChain = class{	
	constructor(blocksize, web3, msgPack, newChain, snapshotSize){
			this.web3 = web3;
			this.msgPack = msgPack;

			this.blocksize = blocksize;
			
			this.snapshotHashes = [];
			this.snapshotLocalBlockMapping = {};
			
			this.currentBlock = [];
			this.lastMerkleHash = "0x42";
			this.lastSnapshotHash = "0x42";
			
			this.stateCount = 0;
			this.blockCount = 0;
			this.snapshotCount = 0;
			
			this.snapshotSize = snapshotSize;
			
			this.blockFolderRoot = "./Blocks/";
			this.merkleTree = "./Trees/merkle.tree";
			this.snapshotTree = "./Trees/snapshot.tree";
			this.ipfsDirs = "./Trees/IPFS.tree";
			this.start = new Date();
			this.startBlock = new Date();
			this.lastIPFS = "";
			
			if (!fs.existsSync(this.blockFolderRoot)){
				fs.mkdirSync(this.blockFolderRoot);
				
			}
			
			if (!fs.existsSync("./Trees")){
				fs.mkdirSync("./Trees");
			}
			
			if(newChain){
				const path = require('path');
				
				
				fs.readdir(this.blockFolderRoot, (err, files) => {
				  if (err) throw err;

				  for (const file of files) {
					rmDir(this.blockFolderRoot + file);
				  }
				});
				
				fs.readdir("./Trees", (err, files) => {
				  if (err) throw err;

				  for (const file of files) {
					fs.unlink(path.join("./Trees", file), err => {
					  if (err) throw err;
					});
				  }
				});
			}
			else{
				//TODO: startup recovery
			}
			
	}
	
	RecordState(stateData){		
		this.currentBlock.push(stateData);
		this.stateCount++;
		if(this.currentBlock.length >= this.blocksize)
		{
			this.RecordBlock();
			var seconds = (new Date() - this.startBlock.getTime()) / 1000;
			var secondsTotal = (new Date() - this.start.getTime()) / 1000;
			//console.log("block number: " + this.blockCount);
			//console.log(seconds + " seconds");
			//console.log(secondsTotal + " seconds total");
			this.startBlock = new Date();
		}		
	}
	RecordBlock(){	
		
		var currentBlockHash = this.web3.utils.sha3(JSON.stringify([this.currentBlock, this.blockCount]));
		
		var thisMerkleHash = this.web3.utils.sha3(JSON.stringify([currentBlockHash, this.lastMerkleHash, this.blockCount]));
		
		fs.appendFileSync(this.merkleTree, thisMerkleHash + ", " + currentBlockHash + "\n");		

		var blockFolder = this.blockFolderRoot + Math.floor(this.blockCount/this.snapshotSize) + "/";

		if (!fs.existsSync(blockFolder)){
				fs.mkdirSync(blockFolder);
				
			}
			
		
		var packedBlock = this.msgPack.encode(this.currentBlock);
		fs.writeFileSync(blockFolder + this.blockCount+ ".block", packedBlock);
		
		this.blockCount++;
		this.lastMerkleHash = thisMerkleHash;
		this.currentBlock = [];
		
		if((this.blockCount % this.snapshotSize) == 0){
			this.RecordSnapshot();

			//NOTE: TO USE IPFS BACKUP, UNCOMMENT...
			/*
			var blocksSaves = shell.exec("ipfs add -r -w " + blockFolder).stdout.split(" ");		
			this.lastIPFS = blocksSaves[blocksSaves.length-2];
			//console.log("last IPFS");
			//console.log(this.lastIPFS);
			fs.appendFileSync(this.ipfsDirs, this.blockCount + ", " + this.lastIPFS + "\n");			
			*/
			//TO HERE
		}
	}	
	
	RecordSnapshot(){	
		var snapshotHash = this.web3.utils.sha3(JSON.stringify([this.lastSnapshotHash, this.lastMerkleHash, this.snapshotCount]));				
		fs.appendFileSync(this.snapshotTree, snapshotHash + ", " + this.blockCount+ "\n");	
		this.snapshotCount++;	
		console.log("State Record Count: " + this.stateCount);
		console.log("Blocks: " + this.blockCount);
		console.log("snapshot #"+this.snapshotCount+": " + snapshotHash);
		console.log("");
		//TODO: record to ETH mainnet
		
		this.lastSnapshotHash = snapshotHash;		
	}

	GetBlock(blockNumber){
		console.log("getting block " + blockNumber);
		var blockFileName = this.blockFolder + blockNumber+ ".block";
		var file = fs.readFileSync(blockFileName);
		var unpacked = this.msgPack.decode(file);
		return unpacked;		
	}
	
	GetStateChange(stateChangeNumber){
		var blockNumber = Math.floor(stateChangeNumber / this.blocksize);
		var indexNumber = stateChangeNumber % this.blocksize;
		
		return this.GetBlock(blockNumber)[indexNumber];
	}
	
}
module.exports = {
    SimpleChain:SimpleChain
};