function Todos() {
	return function(fabric, next) {

		this.todos = [];

		this.setTodos = function(todos) {			
			console.log(JSON.stringify(todos));
			fabric.set('todos', todos.map(function(todo) {
				todo.icon = fabric.weatherTypes[todo.preferredWeather].day;
				return todo;
			}));

			console.log("TODOS: " + JSON.stringify(fabric.todos));
		}

		this.refreshTodos = function() {
			fabric.fetchTodos()
				  .then(fabric.setTodos);
		};

		this.sortedTodos = [];

		var days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];

		this.create = function() {
			fabric.subscribe('todos', sortTodos);
			fabric.subscribe('forecast', sortTodos);
			fabric.refreshTodos();
			sortTodos();
		}

		function sortTodos() {
			var todos = fabric.todos;
			var forecast = fabric.forecast;
			if (!todos || !forecast) return;

			var todoList = [];

			var todosToBeDone = todos.filter(function(t) { return t.isDone === false; });		
			var doneTodos = todos.filter(function(t) { return t.isDone === true; });

			var weatherTypes = {};
			todosToBeDone.forEach(function(t)  {
				if (t.preferredWeather in weatherTypes === false) {
					weatherTypes[t.preferredWeather] = [];
				}
				weatherTypes[t.preferredWeather].push(t);
			});

			// Map todos on forecast
			forecast.forEach(function(f) {	
				// Because the store will implicitly serialize the data when stored,
				// the information about f.time actually being a Date-instance is lost,
				// so we need to reconstruct that			
				f.time = new Date(f.time);								
				if (f.weather in weatherTypes) {
					weatherTypes[f.weather].forEach(function (t) {						
						t.fromTime = f.time;
						t.toTime = new Date(f.time.getTime() + (3 * 60 * 60 * 1000));
						t.timespan = days[t.fromTime.getDay()] + ' ' + t.fromTime.getHours() + ':00 - ' + t.toTime.getHours() + ':00';
						t.day = days[t.fromTime.getDay()];
						t.fromHour = t.fromTime.getHours() + ':00';
						t.toHour = t.toTime.getHours() + ':00';
						t.forecasted = true;
						todoList.push(t);
					});
					delete weatherTypes[f.weather];
				}
			});

			// Add remaining todos
			for (key in weatherTypes) {
				weatherTypes[key].forEach(function (t) {
					t.forecasted = false;
					todoList.push(t);
				});
			}

			doneTodos.forEach(function(t) { 
				t.forecasted = false;
				todoList.push(t); 
			});

			fabric.set('sortedTodos', todoList);
		};
	}
}

module.exports = Todos;