const baseURL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com'; 
let planets

const landingPage = document.querySelector('.landing-page');
const planetContainer = document.querySelector('.planet-container');
const pages = document.querySelectorAll('.page');
const button = document.querySelector('button');
const overlayPage = document.querySelector('.overlay');
const templatePlanet = document.querySelector('.template-planet')

// All below for showing in info page
const planetName = document.querySelector('.planet-name')
const latinName = document.querySelector('.latin-name')
const description = document.querySelector('.description')
const circumference = document.querySelector('#circumference')
const distanceFromSun = document.querySelector('#distance')
const dayTemp = document.querySelector('#temp_day')
const nightTemp = document.querySelector('#temp_night')
const moons = document.querySelector('#moons')

/*  TODO
-CHECK! Ringar runt planet vid infosida (samt saturnus) easy


-Kommentera upp kod, ge vettiga variabelnamn - pågående
-Att din kod är uppdelad i moduler där du har skrivit en kommentar i varje modul om varför du har delat upp som du gjort. (VG)
- att det ser ut enligt skiss (styling)


-CHECK!! fixa solen 

-CHECK styra en scroll om texten är för lång på infosidan (vid laptop, optional)
- CHECK!! stjärnor
- CHECK månar saknas för denna planet (om det är så) CHECK!! 
- CHECK!!! begripa varför jag inte kan klicka mig fram-och-tillbaks oändligt med ggr
    TODO  */

const getKey = async () => {
try {
 const response = await fetch(`${baseURL}/keys`, {
    method: 'POST'
})
if (!response) {
    throw new Error(response.status)
} 
const data = await response.json()
// returns the value of key - console.log(data.key) 
return data.key
} catch (error) {
     console.log(error.message) }
}

const getPlanets = async (key) => {
    try {
        const response = await fetch(`${baseURL}/bodies`, {
            method: 'GET',
            headers: {'x-zocom': key } // anropa key som variabel
        })
        if (!response) {
            throw new Error(response.status)
        }
        const data = await response.json()
        //console.log(data) // logs array of planet objects
        printOutPlanets(data.bodies)
        //data.bodies is reassigned to "planets" in bottom of document
        return data
    } catch (error) {
        console.log(error.message)
    }
}
// Declared function to print out planets to screen (bodies), connected to async in bottom
// Function that does the following: 
// 1. assign a 'figure', adds class that corresponds with css-file thanks to .toLowerCase(), styling already exists - appends to planetContainer.
const printOutPlanets = (planets) => {

    planets.forEach(planet => {
       const planetElement = document.createElement('figure');
       planetElement.classList.add(planet.name.toLowerCase());
    planetContainer.append(planetElement);

    // 2. I get and store the style and corresponding value from planetElement
    // 3. assigns those values to computedPlanet, via the QS-templatePlanet
        planetElement.addEventListener('click', () => {
            const correctColor = getComputedStyle(planetElement).getPropertyValue('background-color');
            const computedPlanet = templatePlanet;
            computedPlanet.style.backgroundColor = correctColor;

            //körs vid klick och styr display hidden/block
            showPlanetPage(planet)
            //styr innehållet på planetsidor
            showInfo(planet)
        })
    })
} 

const showPlanetPage = (planet) => {
    landingPage.classList.add('hidden');
    overlayPage.classList.remove('hidden');
    button.addEventListener('click', () => { //only button, thereby 'button'
        hideInfo() //skall en ha planet som param?
    })
}
 
// function for what the button on the planet page does once there 
const hideInfo = () => {
    landingPage.classList.remove('hidden');
    overlayPage.classList.add('hidden');
}

const showInfo = (planet) => {
    starrySky()
    planetName.textContent = `${planet.name}`;
    latinName.textContent = `${planet.latinName}`;
    description.textContent = `${planet.desc}`; 
    circumference.textContent = `${planet.circumference.toLocaleString()} km`;
    distanceFromSun.textContent = `${planet.distance.toLocaleString()} km`;
    dayTemp.textContent = `${planet.temp.day}°C`;
    nightTemp.textContent = `${planet.temp.night}°C`;
    // For moons: found regular expression to add space after every comma(combination of split, and trim could also work?)
    moons.textContent = `${planet.moons}`.replace(/,/g, ', '); 
    if (moons.textContent === "") {
        moons.previousElementSibling.style.display = "none"
       }
    }

    const starrySky = () => {
        const randomRange = (min, max) => {
            return min + Math.random() * (max + 1 - min)
        }
        const canvas = overlayPage.offsetWidth + overlayPage.offsetHeight;
        const starContent = canvas / 100;
        
        for (let i = 0; i < starContent; i++) {
            let xAxle = randomRange(0, 100); //percentages
            let yAxle = randomRange(0, 100); //percentages
            let alpha = randomRange(0.3, 0.9); //opac
            let size = randomRange(2, 4); // between 2/4 pix

        //just for fun, trying some css-templateString just for the sake of it
        const star = document.createElement('div');
            star.classList.add('stars');
            star.style.cssText = `
            position: absolute;
            left: ${xAxle}%;
            top: ${yAxle}%;
            opacity: ${alpha};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: #FFFFFF;
            `;
            overlayPage.appendChild(star);
        }
        }

//IIFE - (Immediately Invoked Function Expression)
(async () => {
    const key = await getKey()
    planets = await getPlanets(key) 
    console.log(planets) // Easy access to API structure (bodies)
})();