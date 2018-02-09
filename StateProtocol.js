

var stateCoordinator = class{
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

var state = class{	
	constructor(key, obj, blockNumber){
		this.nonce = 0;
		this.key = key;
		this.obj = obj;	
		this.blockNumber = blockNumber;
		this.previousBlockNumber = 0;
	}
}
module.exports = {
	State: state,
	StateCoordinator:stateCoordinator	
};


//https://stackoverflow.com/questions/8572826/generic-deep-diff-between-two-objects
var deepDiffMapper = function() {
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map: function(obj1, obj2) {
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                return {
                    type: this.compareValues(obj1, obj2),
                    data: (obj1 === undefined) ? obj2 : obj1
                };
            }

            var diff = {};
            for (var key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }

                var value2 = undefined;
                if ('undefined' != typeof(obj2[key])) {
                    value2 = obj2[key];
                }

                diff[key] = this.map(obj1[key], value2);
            }
            for (var key in obj2) {
                if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
                    continue;
                }

                diff[key] = this.map(undefined, obj2[key]);
            }

            return diff;

        },
        compareValues: function(value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if ('undefined' == typeof(value1)) {
                return this.VALUE_CREATED;
            }
            if ('undefined' == typeof(value2)) {
                return this.VALUE_DELETED;
            }

            return this.VALUE_UPDATED;
        },
        isFunction: function(obj) {
            return {}.toString.apply(obj) === '[object Function]';
        },
        isArray: function(obj) {
            return {}.toString.apply(obj) === '[object Array]';
        },
        isDate: function(obj) {
            return {}.toString.apply(obj) === '[object Date]';
        },
        isObject: function(obj) {
            return {}.toString.apply(obj) === '[object Object]';
        },
        isValue: function(obj) {
            return !this.isObject(obj) && !this.isArray(obj);
        }
    }
}();
