pragma solidity ^0.4.18;
import "./EtherealFoundationOwned.sol";


contract ShardProof is EtherealFoundationOwned{	
	address private offChainId;
	mapping(uint32 => bytes32) private hashes;
	uint32 currentHashIndex;
	
	function GetHash(uint32 blockNum) public view returns(bytes32){
		return hashes[blockNum];
	}
	
	function RecordHash(bytes32 hash) public onlyOwner{
		
		hashes[currentHashIndex] = hash;
		currentHashIndex += 1;
		
	}
	
}

