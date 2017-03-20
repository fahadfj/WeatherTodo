var Observable = require('FuseJS/Observable');

function InspectApi() {

	var self = this;
	var args = Array.prototype.slice.call(arguments);

	function createListener(symbol) {		
		var m = self.fabric[symbol];				
		if (m instanceof Observable) {
			m.onValueChanged(module, function (item) {
				self.fabric.debug(symbol + ' onValueChanged: ' + JSON.stringify(item));
			});				
		}
	}

	this.create = function() {
		for (var i = 0; i < args.length; i++) {	
			createListener(args[i]);
		}
	}

}

module.exports = InspectApi;