"use strict";

//Global variables
let lat = 50.8027841, lon = 3.2097454;
let TimeModifier;
let sunrise, sunset;
let currentSeconds; //time at load webapp
let secondsAtSunrise;
let secondsAtSunset;
let totalMinutes; //difference between sunrise and -set in minutes
let today;
let timestamp;

let itBeNight = () => {
	document.querySelector('html').classList.add('is-night');
}

let itBeDay = () => {
	document.querySelector('html').classList.remove('is-night');
}

const updateSun = (sunElement, left, bottom) => {
	sunElement.style.left = `${left}%`;
	sunElement.style.bottom = `${bottom}%`; 

	if(today.getHours() >= 12)
			timestamp = `${(today.getHours()).toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2,'0')} PM`;
	else timestamp = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2,'0')} AM`;

	sunElement.setAttribute('data-time', timestamp);
};

const moveSun = function(){ //totalMinutes in min / sunrise in sec
	console.log("sunrise: " + secondsAtSunrise);
	console.log("sunset: " + secondsAtSunset);
	console.log("current: " + currentSeconds);


	const sun = document.querySelector('.js-sun');

	if(secondsAtSunrise <= currentSeconds <= secondsAtSunset){ //als zon op is
		itBeDay();
		sun.style.visibility = "visible";
		const minutesSunUp = (currentSeconds - secondsAtSunrise) / 60;
		const percentage = (100 /totalMinutes) * minutesSunUp, //verstreken percentage van de dag
		sunleft = percentage,
		sunbottom = percentage < 50? percentage * 2 : (100 - percentage) * 2; //zon movement up down (down after 50% of day has been reached)
	
		updateSun(sun, sunleft, sunbottom)
	}
	else{
		itBeNight();
		sun.style.visibility = "hidden";
	};
	// itBeNight();
	// Sun.style.visibility = "hidden";



};

const checkIfGoldenhour = function(sunrise, sunset){
	console.log(sunset);
	console.log(sunrise);

	today = new Date();
	currentSeconds = today.getHours() *3600 -(-(today.getMinutes() * 60)) - (- ( today.getSeconds()));
	secondsAtSunrise = sunrise.slice(0,1) * 3600 - ( - sunrise.slice(2,4) * 60)   - (-(sunrise.slice(5,7)));
	secondsAtSunset = (parseInt(sunset.slice(0,1)) - (-12)) * 3600 - ( - sunset.slice(2,4) * 60)   - (-(sunset.slice(5,7))); //PM means add 12


	if(currentSeconds > secondsAtSunrise && currentSeconds - secondsAtSunrise <= 3600) //als het later is dan sunrise en het verschil is kleiner dan een uur
	{
		console.log("smorgens");
		document.querySelector('.js-countdown').innerHTML = `It's currently golden hour and it last for ${Math.round((currentSeconds - secondsAtSunset)/60)} more minutes! Take some amazing pictures while you're out!`;
	}
	else if(currentSeconds < secondsAtSunset && secondsAtSunset - currentSeconds  <= 3600) //als het vroeger is dan sunset en het verschil is kleiner dan een uur
	{
		console.log("savonds");
		document.querySelector('.js-countdown').innerHTML = `It's currently golden hour and it last for ${Math.round((secondsAtSunset - currentSeconds)/60)} more minutes! Take some amazing pictures while you're out!`;
	}
	else 
	{
		console.log("not golden hour");
		document.querySelector('.js-countdown').innerHTML = "It isn't golden hour currently.";
	}


	totalMinutes = (secondsAtSunset - secondsAtSunrise) / 60;

}

const toggleTimes = function(){
	if(toggle == false)//24h notatie
	{
		sunrise = "0" + sunrise.slice(0,4); //remove AM and add 0 in front
		sunset = (sunset.replace(sunset[0], (sunset[0] -(-12)).toString())).slice(0,5); //remove pm and hours +12
		timestamp = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2,'0')}`;
	}
	else //12h notatie
	{
    	sunrise = sunrise.slice(1,5) + " AM";
		sunset = (sunset.replace(sunset.slice(0,2), (parseInt(sunset.slice(0,2)) - 12).toString())) + " PM"; //hours - 12 + " PM";
		if(today.getHours() >= 12)
			timestamp = `${(today.getHours()-12).toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2,'0')} PM`;
		else timestamp = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2,'0')} AM`;
		
	}

	document.querySelector('.js-sunrise').innerHTML = sunrise;
	document.querySelector('.js-sunset').innerHTML = sunset;
	document.querySelector('.js-sun').setAttribute('data-time', timestamp);
}

let toggle = true;
const listenToClickToggle = function(){
	const radio1 = document.querySelector(".js-radio1");
	const radio2 = document.querySelector(".js-radio2");

    radio1.addEventListener('click', function(e) {
		console.log("click1");
		if(toggle == true)
		{
			document.querySelector('.content').innerHTML = "24h notation";
			toggle = false;
			//getAPI(lat, lon);
			toggleTimes();
		}
	})
	radio2.addEventListener('click', function(e) {
		console.log("click2");
		if(toggle == false)
		{
			document.querySelector('.content').innerHTML = "12h notation";
			toggle = true;
			toggleTimes();
			//getAPI(lat, lon);
			
		}
	})
	
}

const correctTimes = function(time){// times are returned in GMT, this corrects them to your time zone
	console.log(time);
	var Timezone = new Date(Date().toString());
	TimeModifier = Timezone.getTimezoneOffset() / -60;
	console.log(typeof(TimeModifier));
	let number = parseInt(time.slice(0,time.indexOf(":")))  + TimeModifier; //time is retured in gmt, add 2
	return String(number) + time.slice(time.indexOf(":"));
};

		// if(number >= 12){ //change AM to PM and vice versa
	// 	number=-12; //lower number by 12 (12.01 PM --> 00.01 PM)
	// 	if(time.slice(time.indexOf(" ") + 1) == "AM"){
	// 		time = time.slice(0,time.indexOf(" ")) + " PM";
	// 	}
	// 	else time = time.slice(0,time.indexOf(" ")) + " AM"; //(00.01 PM --> 00.01 AM)
	// };
	//return
const sliceTimes = function(time){ //slice off seconds
	return time.slice(0,time.indexOf(" ") - 3) + time.slice(time.indexOf(" "));
};

const showResult = (queryResponse) => {
	//console.log({queryResponse})
	sunrise = correctTimes(queryResponse.results.sunrise), sunset = correctTimes(queryResponse.results.sunset);
	//sunrise = queryResponse.results.sunrise, sunset = queryResponse.results.sunset

	// console.log(sunset);
	// console.log(sunrise);
	//console.log(typeof(sunrise));

	checkIfGoldenhour(sunrise, sunset);
	
	sunrise = sliceTimes(sunrise);
	sunset = sliceTimes(sunset);

	document.querySelector('.js-sunrise').innerHTML = sunrise;
	document.querySelector('.js-sunset').innerHTML = sunset;

	console.log(totalMinutes);
	
	moveSun();
}

const getLocation = function(){
	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;

		//possibly doesn't work correctly when user in different location uses website
		// var Timezone = new Date(Date().toString());
		// TimeModifier = Timezone.getTimezoneOffset() / -60
		
	  });
}

const getAPI = async(lat, lon) => {

	const data = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&fbclid=IwAR3jajk1-TE6lBXYcSRUa9WrbIzPN3Qh4gbPP7ItYu2QkirXYyF2D8wlsmwWeergeven`)
	.then((r) => r.json())
	.catch((err) => console.error('An error occured: ', err));

	//console.log(data);

	showResult(data);

};

const init = function(){
	getLocation();
	// lat = 47.5615000;
	// lon = 52.7126000;
	getAPI(lat, lon);
	listenToClickToggle();
	console.info("DOM Geladen");
};

document.addEventListener('DOMContentLoaded', init);