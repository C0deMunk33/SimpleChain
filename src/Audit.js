const jayson = require('jayson');

// create a client
const client = jayson.client.http({
  port: 2702,
});


function DoAudit() {
  // TODO: get current block number
  const blockHeight = 9001;

  const blockToAudit = Math.floor(Math.random() * blockHeight);

  client.GetBlock(blockToAudit)
    .then((blockResult) => {
      /*
    block{
      contents:,//array of tracked states,
      blockHash:,//what the user should get
      proofChain,//
    }
    */
      // hash block.contents
      const blockHash = blockResult.block;
    });
}
