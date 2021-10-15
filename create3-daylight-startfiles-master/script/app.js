//  apiKey
const apiKey = "84f5f7c5161fd297f76580866ec7f070";


// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = (sun, left, bottom, today) => {
	// TODO: Alles
	sun.style.setProperty ('left', `${left}%`);
	sun.style.setProperty ('bottom', `${bottom}%`);

	sun.setAttribute('data-time', `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`);
}


let itBeNight = () => {
	document.querySelector('html').classList.add('is-night');
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector('.js-sun'),
		minutesLeft = document.querySelector('.js-time-left');

	const today = new Date(),
		dateUp = new Date(today.getTime() - sunrise * 1000);
		

	// Bepaal het aantal minuten dat de zon al op is.
	let minutesSunUp = dateUp.getHours() * 60 + dateUp.getMinutes();
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	const percentage = (100 / totalMinutes) * minutesSunUp,
		sunLeft = percentage,
		sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2; // Na de middag zakt de zon weer

	updateSun(sun, sunLeft, sunBottom, today);
	
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector('body').classList.add('is-loaded');
	// Vergeet niet om het resterende aantal minuten in te vullen.
	minutesLeft.innerText = totalMinutes - minutesSunUp;
	// Nu maken we een functie die de zon elke minuut zal updaten
	const t = setInterval(() => {
		today = new Date();
		// Bekijk of de zon niet nog onder of reeds onder is
		if (minutesSunUp < 0 || minutesSunUp > totalMinutes) {
			clearInterval(t);
			// TODO: make it night itBeNight()
			itBeNight();
		} else {
			// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
			// TODO: Percentage left emn bottom berekenen
			const percentage = (100 / totalMinutes) * minutesSunUp,
				sunLeft = percentage,
				sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;

			// TODO: zon weer wat verder zetten
			updateSun(sun, sunLeft, sunBottom, today);
			
			// TODO: minutes updaten
			minutesLeft.innerText = totalMinutes - minutesSunUp;
		}
		// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
		minutesSunUp++;
	}, 6000);
	
	
	
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	const sunRise = document.querySelector('.js-sunrise'),
		  sunSet = document.querySelector('.js-sunset'),
		  location = document.querySelector('.js-location');

	sunRise.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	sunSet.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
	location.innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	const timedifference = new Date(queryResponse.city.sunset * 1000 - queryResponse.city.sunrise * 1000);

	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten
	placeSunAndStartMoving(timedifference.getHours() * 60 + timedifference.getMinutes(), queryResponse.city.sunrise)
};
const get = (url) => fetch(url).then((r) => r.json());

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
	
	// Eerst bouwen we onze url op
	const endPoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	const weatherResponse = await get(endPoint);

	console.log({weatherResponse});
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showResult(weatherResponse);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
