// _ = helper functions
let lat = 50.8027841, lon = 3.2097454;

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	console.log("place sun");
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	const sun = document.querySelector('.js-sun');
	//minutes = document.querySelector('.js-time-left');
	
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	
	/*const now = new Date(), sunriseData = new Date(sunrise * 1000);
	console.log(sunriseData)

	const minuteSunUp = (now.getHours() * 60 + now.getMinutes() - (sunriseData.getHours() * 60 + sunriseData.getMinutes()));

	const percentage = (100/totalMinutes) * minuteSunUp,
	sunLeft = percentage
	sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;*/

	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	//.innertext = totalMinutes - minuteSunUp;
	// Nu maken we een functie die de zon elke minuut zal updaten
	/*const t = setInterval(() => {
		if (minuteSunUp < 0 || minuteSunUp > totalMinutes) {
			clearInterval(t);
			itBeNight();
		} 
		else if (minuteSunUp < 0) {
			itBeNight();
		}
		else {
			itBeDay();*/
			/*const now = new Date(),
			left = (100/totalMinutes) * minuteSunUp,
			bottom = left < 50 ? left * 2 : (100 - left) * 2;*/

			//updateSun(sun, left, bottom, now);
			updateSun(sun, 8, 0, 0);

			//minutesLeft.innertext = totalMinutes - minuteSunUp;
			/*minutesSunUp++;*/
		//}
	//},60000);
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 5 TODO: maak updateSun functie
const updateSun = (sunElement, left, bottom, now) => {
	console.log("updating sun");
	sunElement.style.left = `${left}%`;
	sunElement.style.bottom = `${left}%`;

	/*const currentTimeStamp = `${now.getHours().toString.padStart(2,'0')}:${now.getMinutes.toString.padStart(2,'0')}`
	sunElement.setAttribute('data-time', currentTimeStamp);*/
}


const checkIfGoldenhour = function(sunrise, sunset){


	var today = new Date();
	var currentSeconds = today.getHours() *3600 -(-(today.getMinutes() * 60)) - (- ( today.getSeconds()));

	var secondsAtSunrise = sunrise.slice(0,1) * 3600 - ( - sunrise.slice(2,4) * 60)   - (-(sunrise.slice(5,7)));

	var secondsAtSunset = sunset.slice(0,1) * 3600 - ( - sunset.slice(2,4) * 60)   - (-(sunset.slice(5,7)));

	if(currentSeconds > secondsAtSunrise && currentSeconds - secondsAtSunrise < 3600)
	{
		console.log("smorgens");
		document.querySelector('.js-countdown').innerHTML = "It's not golden hour currently";
	}
	else if(currentSeconds < secondsAtSunset && secondsAtSunset - currentSeconds  < 3600)
	{
		console.log("savonds");
		document.querySelector('.js-countdown').innerHTML = "It's currently golden hour! Take some amazing pictures while you're out!";
	}
	else 
	{
		console.log("not golden hour");
		document.querySelector('.js-countdown').innerHTML = "It's not golden hour currently";
	}

	console.log("y: " + secondsAtSunset);

	//console.log(sunrise);
	//console.log(sunset);
	console.log("x: " + currentSeconds);

}

const getLocation = function(){
	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;

	  });
}


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
	let sunrise = queryResponse.results.sunrise, sunset = queryResponse.results.sunset;

	checkIfGoldenhour(sunrise.slice(0,7), sunset.slice(0,7));

	if(toggle == true)
	{
		sunrise = "0" + sunrise.slice(0,4);
		sunset = (sunset.replace(sunset[0], (sunset[0] -(-12)).toString())).slice(0,5);
	}
	else
	{
    	sunrise = sunrise.slice(0,4) + " AM";
		sunset = sunset.slice(0,4) + " PM";
	}

    console.log(sunrise);
    console.log(sunset);

	document.querySelector('.js-sunrise').innerHTML = sunrise;
	document.querySelector('.js-sunset').innerHTML = sunset;

	//const timeDifference = (convertToMinutes(sunset), convertToMinutes(sunrise)) / 60;
	//console.log(timeDifference)
	
	//placeSunAndStartMoving(timeDifference, convertToMinutes(sunrise));

};

let getAPI = async(lat, lon) => {

	const data = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&fbclid=IwAR3jajk1-TE6lBXYcSRUa9WrbIzPN3Qh4gbPP7ItYu2QkirXYyF2D8wlsmwWeergeven`)
	.then((r) => r.json())
	.catch((err) => console.error('An error occured:', err));

	getLocation();

	showResult(data);

};

const init = function(){
	getAPI(lat, lon);
	listenToClickToggle();
	console.info("DOM Geladen");
};

document.addEventListener('DOMContentLoaded', init);
