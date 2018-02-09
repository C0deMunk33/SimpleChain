import jayson from 'jayson';

const client = jayson.client.http('http://localhost:2702');

const key = '0x1';
client.request('GetTrackedState', [key], (e, r) => {
  if (e != null) {
    throw e;
  }
  return r;
  // console.log('tracked');
  // console.log(r);
});


function send1000(runCount) {
  client.request('GetTrackedState', [key], (e, r) => {
    // console.log("tracked");
    // console.log(r);
    const newTrackedState = r.result;
    const batch = [];
    for (let bulkTestIdx = 0; bulkTestIdx < 100; bulkTestIdx += 1) {
      newTrackedState.obj.number += 1;

      batch.push(client.request('UpdateTrackedState', [JSON.stringify(newTrackedState)]));
    }

    client.request(batch, (err, responses) => {
      if (err) throw err;

      // console.log('responses', responses.length); // all responses together
      if (runCount > 1) {
        send1000(runCount - 1);
      } else {
        client.request('GetTrackedState', [key], (innerE, innerR) => {
          if (innerE != null) {
            throw innerE;
          }
          return innerR;
          // console.log('tracked');
          // console.log(r);
        });
      }

      return responses;
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
