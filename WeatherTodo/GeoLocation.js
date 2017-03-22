var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");

function GeoLocation() {
    return function(fabric) {
    	
    	this.create = function() {    
        	var timeoutMs = 5000;

        	GeoLocation.getLocation(timeoutMs).then(function(location) {                		
            	fabric.locationChanged(location.latitude, location.longitude);
        	}).catch(function(fail) {
        		fabric.error(fail);    
    	    });
    	}
    }

}

module.exports = GeoLocation;