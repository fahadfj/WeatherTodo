function ErrorHandling(fabric) {
	this.catch = function(e){
		fabric.error(e);
	};
}

module.exports = ErrorHandling;