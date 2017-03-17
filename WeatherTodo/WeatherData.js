var EntityClass = require('Fabric/EntityClass');

var Weather = new EntityClass({});

function WeatherData() {
	
	var self = this;

	this.weatherNow = Weather.item(function (latitude, longitude) {
		self.fabric.debug('Refreshing weatherNow');
		return this.next.fetchWeatherNow(latitude, longitude);
	});

	this.forecast = Weather.list(function (latitude, longitude) {
		self.fabric.debug('Refreshing forecast');
		return this.next.fetchForecast(latitude, longitude);
	});

	this.locationChanged = function(latitude, longitude) {
		this.fabric.weatherNow.refresh(latitude, longitude);
		this.fabric.forecast.refresh(latitude, longitude);
		return this.next.locationChanged(latitude, longitude);
	};
}

module.exports = WeatherData;