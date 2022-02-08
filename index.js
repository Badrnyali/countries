const wrapper = document.querySelector(".wrapper");
//********First Part: Show Cards when loaded and when clicked on Load Button */
const loadButton = document.querySelector(".load_button");
let countriesArray = [];
let countryCode = [];
//Fetch data of all the countries
fetch("https://restcountries.com/v2/all")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((d) =>
      countryCode.push({
        name: d.name,
        code: d.cioc,
      })
    );
    countriesArray.push(...data);
    showCards(countriesArray);
  })
  .catch((err) => console.log(err));

// Function for creating a card Html
//Class Name is for checking if the theme is dark mode
function cardHtml(className, countriesArray, i, currentIndex) {
  const cardHtml = `
  <div class="card" data-demonym = "${
    countriesArray[i + currentIndex].demonym
  }">
          <img
            src="${countriesArray[i + currentIndex].flags.png}"
            alt="${countriesArray[i + currentIndex].name}"
          />
          <div  class = ${className} >
            <h4>${countriesArray[i + currentIndex].name}</h4>
            <p><span class="bold">Population: </span> ${countriesArray[
              i + currentIndex
            ].population.toLocaleString()}</p>
            <p><span class="bold">Region: </span> ${
              countriesArray[i + currentIndex].region
            }</p>
            <p><span class="bold">Capital: </span> ${
              countriesArray[i + currentIndex].capital
            }</p>
          </div>
        </div>
  `;
  return cardHtml;
}

//Show card at the beginning
function showCards(countriesArray) {
  let currentIndex = 0;
  for (i = 0; i < 20; i++) {
    wrapper.innerHTML += checkDarkMode(countriesArray, i, currentIndex);
  }
}
//Add an event listener to the load button
var currentIndex = 20;
loadButton.addEventListener("click", () => {
  let maxResult = 20;
  for (i = 0; i < maxResult; i++) {
    wrapper.innerHTML += checkDarkMode(countriesArray, i, currentIndex);
  }
  currentIndex += maxResult;
});

// ************** Second Part Filter after country ***********
const filtCounInput = document.querySelector("#filter_countries input");

filtCounInput.addEventListener("keyup", function (event) {
  let searchedCountry = filtCounInput.value.toLowerCase();
  if (event.keyCode === 13) {
    if (searchedCountry) {
      const foundedCountry = countriesArray.filter((c) => {
        if (searchedCountry === c.name.toLowerCase()) {
          return Array.from(c);
        }
        filtCounInput.value = "";
      });
      wrapper.innerHTML = checkDarkMode(foundedCountry, 0, 0);
      loadButton.classList.add("inactive");
      return;
    }
    alert("Please add a country name!");
    filtCounInput.value = "";
    event.preventDefault();
  }
});

//*************Third Part Filter by region */
const filtRegButton = document.querySelector("#filter_regions button");
const filtRegDiv = document.querySelector("#filter_regions div");
const filtRegOptions = document.querySelectorAll("#filter_regions div p");

filtRegButton.addEventListener("click", (e) => {
  filtRegDiv.classList.toggle("active");
  filtRegOptions.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      const header = document.querySelector("header");
      const searchedReg = e.target.textContent.toLowerCase();
      let array = [];
      countriesArray.filter((c) => {
        if (searchedReg === c.region.toLowerCase()) {
          array.push(c);
          wrapper.innerHTML = "";
          loadButton.classList.add("inactive");
          return;
        }
      });
      for (i = 0; i <= array.length; i++) {
        wrapper.innerHTML += checkDarkMode(array, i, 0);
      }
    });
  });
});
// ************* Fourth Part trigger the dark mode
let changeModeButton = document.querySelector("header div");
changeModeButton.addEventListener("click", () => {
  document.body.classList.toggle("body_darkmode");
  document
    .querySelectorAll(".card div")
    .forEach((i) => i.classList.toggle("light_darkmode"));
  const selectors = [
    "#filter_countries",
    "#filter_regions > button",
    "#filter_regions > div",
    "header",
  ];
  selectors.forEach((sel) => {
    document.querySelector(sel).classList.toggle("light_darkmode");
  });
});

//Check if a dark mode so that you chenge colors
function checkDarkMode(countriesArray, i, currentIndex) {
  const headingClass = document.querySelector("header").classList.value;
  if (headingClass) {
    return cardHtml("light_darkmode", countriesArray, i, currentIndex);
  }
  return cardHtml("", countriesArray, i, currentIndex);
}

//************* Fifth Part : Displaying each Country when clicked */
document.addEventListener("click", (e) => {
  e.path.find((item) => {
    if (item.className === "card") {
      let demonym = item.dataset.demonym;
      showCountry(demonym);
    }
  });
});

function showCountry(denonym) {
  //Fetch data of the specific country
  fetch(`https://restcountries.com/v3.1/demonym/${denonym}`)
    .then((response) => response.json())
    .then((data) => {
      let allCardsContainer = document.querySelector(".container");
      allCardsContainer.classList.add("inactive");
      let nativeName = Object.values(data[0].name.nativeName);
      nativeName = nativeName[nativeName.length - 1].common;

      let currency = Object.values(data[0].currencies);
      currency = currency[currency.length - 1].name;

      let languages = Object.values(data[0].languages);
      let borders = [];
      Object.values(countryCode).forEach((val) => {
        if (data[0].borders) {
          data[0].borders.map((code) => {
            if (val.code == code) {
              borders.push(val.name);
            }
          });
          return borders;
        }
      });
      if (borders) {
        borders = borders.map((i) => `<li>${i}</li>`).join("");
      }
      const countryHtml = ` <div class="country">
  <!-- Back Button -->
  <div class="back">
    <button class="back_button">
      <i class="fas fa-arrow-left"></i> back
    </button>
  </div>
  <!-- Country Details -->
  <div>
    <img
      src=${data[0].flags.png}
      alt="${data[0].name.common}"
    />
    <div class="country_details">
      <h2>${data[0].name.common}</h2>
  
      <div>
        <div>
          <p><span class="bold">Native Name: </span> ${nativeName}</p>
          <p><span class="bold">Population: </span> ${data[0].population.toLocaleString()}</p>
          <p><span class="bold">Region: </span> ${data[0].region}</p>
          <p><span class="bold">Sub Region: </span> ${data[0].subregion}</p>
          <p><span class="bold">Capital: </span> ${data[0].capital[0]}</p>
        </div>
        <div>
          <p><span class="bold">Top Level Domain: </span> ${data[0].tld[0]}</p>
          <p><span class="bold">Currencies: </span> ${currency}</p>
          <p><span class="bold">Languages: </span>${languages
            .map((lang) => lang)
            .join(" , ")}</p>
        </div>
      </div>
  
      <ul class="borders_ul">
      <span class="bold">Border Countries:</span>
     ${borders}
      </ul>
    </div>
  </div>
  </div>`;
      document.querySelector("body").innerHTML += countryHtml;

      checkMode();
    })
    .catch((err) => console.log(err));
}

function checkMode() {
  //Checking and Setting dark mode
  let changeModeButton = document.querySelector("header div");
  changeModeButton.addEventListener("click", (e) => {
    document.body.classList.toggle("body_darkmode");
    document.querySelector("header").classList.toggle("light_darkmode");
  });

  //Back button listener
  let allCardsContainer = document.querySelector(".container");
  let backButton = document.querySelector(".back");
  backButton.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.remove();
    allCardsContainer.classList.remove("inactive");
  });
}

// TODO : Deposit on github