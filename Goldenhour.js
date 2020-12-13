// _ = helper functions
let lat = 50.8027841, lon = 3.2097454;

const convertToMinutes = function(numberstring){
	// let minutes;

	// minutes = parseInt(numberstring.slice(0,2)) * 60 + parseInt(numberstring.slice(3,5));
	return parseInt(numberstring.slice(0,2)) * 60 + parseInt(numberstring.slice(3,5));
}


let toggle = true;
listenToClickToggle = function(){
	const radio1 = document.querySelector(".js-radio1");
	const radio2 = document.querySelector(".js-radio2");

    radio1.addEventListener('click', function(e) {
		console.log("click1");
		if(toggle == true)
		{
			document.querySelector('.content').innerHTML = "12h notation";
			toggle = false;
			getAPI(lat, lon);
		}
	})
	radio2.addEventListener('click', function(e) {
		console.log("click2");
		if(toggle == false)
		{
			document.querySelector('.content').innerHTML = "24h notation";
			toggle = true;
			getAPI(lat, lon);
			
		}
	})
	
}

let showResult = queryResponse => {
	console.log("showingresult");
	let sunrise, sunset;
	if(toggle == true)
	{
		sunrise = ("0" + (queryResponse.results.sunrise).slice(0,4));
		sunset = (queryResponse.results.sunset).slice(0,4);

		sunset = sunset.replace(sunset[0], (sunset[0] -(-12)).toString());
	}
	else
	{
    	sunrise = (queryResponse.results.sunrise).slice(0,4) + " AM";
		sunset = (queryResponse.results.sunset).slice(0,4) + " PM";
	}

    console.log(sunrise);
    console.log(sunset);

	document.querySelector('.js-sunrise').innerHTML = sunrise;

	const timeDifference = (convertToMinutes(sunset), convertToMinutes(sunrise)) / 60;
	console.log(timeDifference)
	//placeSunAndStartMoving(timeDifference, sunrise);

};

let getAPI = async(lat, lon) => {

	const data = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&fbclid=IwAR3jajk1-TE6lBXYcSRUa9WrbIzPN3Qh4gbPP7ItYu2QkirXYyF2D8wlsmwWeergeven`)
	.then((r) => r.json())
	.catch((err) => console.error('An error occured:', err));
	showResult(data);

};

const init = function(){
	getAPI(lat, lon);
	listenToClickToggle();
	console.info("DOM Geladen");
};

document.addEventListener('DOMContentLoaded', init);
