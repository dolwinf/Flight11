//Aviation Edge api
//234b97-f4a134

//new AE api
//c3466e-7c96d1

//Google maps platform api
// AIzaSyDFnMLHhIPMyVaVj-tWEU4H15JCryMYtos

var from;
var to;
var dateFrom;
var dateTo;
var dateFromConverted;
var dateToConverted;
var airlineCode;

$("#search").on("click", function(e) {
	e.preventDefault();

	from = $("#from").val();
	to = $("#to").val();

	// weather(to);
	// currentNews(to);

	// placeOfInterest(to);

	dateFrom = $("#start").val();
	dateTo = $("#end").val();
	dateFromConverted = moment(dateFrom).format("DD/MM/YYYY");
	dateToConverted = moment(dateTo).format("DD/MM/YYYY");

	travelFrom(from);
});

function travelFrom(code) {
	var settings = {
		url:
			"https://aviation-edge.com/v2/public/autocomplete?key=c3466e-7c96d1&city=" +
			code,
		method: "GET"
	};

	$.ajax(settings).then(function(response) {
		var fromValue = JSON.parse(response);
		console.log(fromValue);
		from = fromValue.cities[0].codeIataCity;
		console.log(from);
		travelTo(to);
	});
}

function travelTo(code) {
	var settings = {
		url:
			"https://aviation-edge.com/v2/public/autocomplete?key=c3466e-7c96d1&city=" +
			code,
		method: "GET"
	};

	$.ajax(settings).then(function(response) {
		toValue = JSON.parse(response);
		to = toValue.cities[0].codeIataCity;
		console.log(to);

		kiwi(from, to);

		//clear form values after submission
		$("#from").val("");
		$("#to").val("");
		$("#start").val("");
		$("#end").val("");
	});
}

function kiwi(from, to) {
	$.ajax({
		url:
			"https://api.skypicker.com/flights?flyFrom=" +
			from +
			"&to=" +
			to +
			"&dateFrom=" +
			dateFromConverted +
			"&dateTo=" +
			dateToConverted +
			"&limit=3&curr=AUD&max_stopovers=1&sort=price&partner=picky",

		method: "GET"
	})
		.then(function(response) {
			console.log(response);

			if (response.data.length == 0) {
				flight.append("<p>No flights to show</p>");
			} else {
				response.data.forEach(function(item) {
					if (item.route.length > 0) {
						item.route.forEach(function(path) {
							airlineCode = path.airline;
							arrivalTime = moment.unix(path.aTimeUTC).format("HH:mm");
							depatureTime = moment.unix(path.dTimeUTC).format("HH:mm");

							totalTime = item.fly_duration;
							fare = item.conversion.AUD;

							console.log(
								"Departure time",
								depatureTime,
								"City from",
								path.cityFrom,
								"Arrival time",
								arrivalTime,
								"Destination city",
								path.cityTo
							);
						});

						console.log(
							"Total flight time",
							totalTime,
							"Total price",
							fare,
							"Deep link",
							item.deep_link
						);
					}
				});
			}
		})
		.catch(function(err) {
			console.log(err);
		});
}

function codeIataAirline(code) {
	$.ajax({
		url:
			"https://aviation-edge.com/v2/public/airlineDatabase?key=c3466e-7c96d1&connections=2&codeIataAirline=" +
			code,
		method: "GET"
	}).then(function(response) {
		var data = JSON.parse(response);
		console.log(data[0].nameAirline);
	});
}

function placeOfInterest(place) {
	var settings = {
		async: true,
		crossDomain: true,
		url:
			"https://api.foursquare.com/v2/venues/explore?client_id=2ZDZYBITSRLBTQDUWQZZRTI1M2WSRX12HAMIV41RZ202EJUB&client_secret=5FMLVF5KGOKXIXLLBLY3BWWI5ORKDJ1XQ3TFJOG2I1YHGOJ3&v=20180323&limit=10&near=" +
			place,
		method: "GET"
	};

	$.ajax(settings).done(function(response) {
		response.response.groups[0].items.forEach(function(item) {
			console.log("Places of iterest", item.venue.name);
		});
	});
}

function weather(location) {
	console.log(location);
	var settings = {
		async: true,
		crossDomain: true,
		url:
			"https://community-open-weather-map.p.rapidapi.com/weather?units=metric&q=" +
			location,
		method: "GET",
		headers: {
			"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
			"x-rapidapi-key": "e45b480c59msh9749a20cfe00060p123db4jsna04589ddba47"
		}
	};

	$.ajax(settings).done(function(response) {
		temperature = Math.floor(response.main.temp);

		console.log(
			"Destinaton city name",
			response.name,
			"Temperature",
			temperature
		);
	});
}

function currentNews(place) {
	var settings = {
		async: true,
		crossDomain: true,
		url:
			"https://microsoft-azure-bing-news-search-v1.p.rapidapi.com/search?&count=5&q=" +
			place,
		method: "GET",
		headers: {
			"x-rapidapi-host": "microsoft-azure-bing-news-search-v1.p.rapidapi.com",
			"x-rapidapi-key": "e45b480c59msh9749a20cfe00060p123db4jsna04589ddba47"
		}
	};

	$.ajax(settings).done(function(response) {
		response.value.forEach(function(item) {
			console.log("News link", item.url, "New headline", item.name);
		});
	});
}

var citiesReturned = [];

$("#from").on("keyup", function(e) {
	var value = e.target.value;
	if (value.length > 2) {
		$.ajax({
			url:
				"http://aviation-edge.com/api/public/autocomplete?key=c3466e-7c96d1&query=" +
				value,
			// `https://api.skypicker.com/locations?term=${value}&locale=en-US&location_types=airport&location_types=city&limit=10&active_only=true`,
			method: "GET"
		}).then(function(response) {
			var data = JSON.parse(response);
			console.log(data);
			// response.locations.forEach(function(item) {
			// 	if (!citiesReturned.includes(item.name)) citiesReturned.push(item.name);
			// 	console.log(citiesReturned);
			// });
		});
	}
});

$("#to").on("keyup", function(e) {
	var value = e.target.value;
	if (value.length > 2) {
		$.ajax({
			url:
				"http://aviation-edge.com/api/public/autocomplete?key=c3466e-7c96d1&query=" +
				value,
			// `https://api.skypicker.com/locations?term=${value}&locale=en-US&location_types=airport&location_types=city&limit=10&active_only=true`,
			method: "GET"
		}).then(function(response) {
			console.log(response);
			// var data = JSON.parse(response);
			// console.log(data);
			// response.locations.forEach(function(item) {
			// 	if (!citiesReturned.includes(item.name)) citiesReturned.push(item.name);
			// console.log(citiesReturned);
			// });
		});
	}
});

$(function() {
	$("#from").autocomplete({
		source: citiesReturned
	});
});

$(function() {
	$("#to").autocomplete({
		source: citiesReturned
	});
});
