"use strict";
//variables
const body = document.querySelector("body");
const checkbox = document.querySelector(".checkbox");
const load = document.querySelector(".loader-div");
let api = [];
const timer = 1000;
//to change background color
const backColorChange = () => {
  const filterCountry = document.querySelector(".input-group");
  const card = document.querySelectorAll(".card");
  if (body.classList.contains("light")) {
    body.classList = "ground-dark";
    if (filterCountry) {
      filterCountry.classList = "input-group input-group-dark";
    }
    if (card) {
      for (let card of card) {
        card.classList = "card card-dark";
      }
    }
  } else {
    body.classList = "light";
    if (filterCountry) {
      filterCountry.classList = "input-group input-group-light";
    }
    if (card) {
      for (let card of card) {
        card.classList = "card card-light";
      }
    }
  }
};
checkbox.addEventListener("change", backColorChange);
//to hide loader
const loaderHide = () => {
  setTimeout(() => {
    load.classList.add("d-none");
  },timer);
};
// fetch Data
const fetchData = async (key, apiKey) => {
  let endpoint;
  switch (key) {
    case "All":
      endpoint = `https://restcountries.com/v3.1/${apiKey}`;
      break;
    case "Name":
      endpoint = `https://restcountries.com/v3.1/name/${apiKey}?fullText=true`;
      break;
    default:
      break;
  }
  try {
    const reply = await fetch(endpoint);
    if (!reply.ok) {
      const message = `Error: Page Not Found ${reply.status}`;
      throw new Error(message);
    }
    const data = await reply.json();
    return data;
  } catch (err) {
    console.error(err.message);
  
  }
};
// home , country , about - pages 
if (document.querySelector("#home")) {
// variables
  const divOfCountries = document.querySelector(".countries-div");
  const divOfPagination = document.querySelector(".pagination");
  const dropDown = document.querySelector(".dropdown-menu");
  const inputSearch = document.querySelector("input.search");
  let row = 32;
// filter
  const regionFilter = (regionStored, data) => {
    let regionFilterDone = data.filter((item) =>
      regionStored === "All" ? item : item.region === regionStored
    );
    cardRender(regionFilterDone, row, localStorage.getItem("paginIndex"));
    paginationCreate(regionFilterDone, row);
  };
// Search
  inputSearch.addEventListener("input", () => {
    let valueOfSearch = inputSearch.value;
    localStorage.setItem("paginIndex", "1");
    searchfilter(api, valueOfSearch);
  });
//to render cards
  const cardRender = (data, rowsOnPage, page) => {
    if (data.length !== 0) {
      divOfCountries.innerHTML = "";
      page--;
      let start = page * rowsOnPage;
      let end = start + rowsOnPage;
      const datacompact = data.slice(start, end);
       datacompact.map((items) => {
        const { name, flags, population, region, capital } = items;
        const div = document.createElement("div");
        div.classList = `card card-light`;
        div.innerHTML = `
        <img src=${flags.png} class="${
          flags.png === undefined ? "d-none" : "card-img-top"
        }" alt="${name.official}-flag" />

        <div class="card-body d-flex flex-column justify-content-center">

          <h5>${name.common === undefined ? "No Data" : name.common}</h5>

          <div class="description">
            <p><strong class="boldtext">Region:</strong> ${
              region === undefined ? "No Data" : region
            }</p>

            <p><strong class="boldtext">Capital:</strong> ${
              capital !== undefined ? capital[0] : "No Data"
            }</p>

            <p><strong class="boldtext">Population:</strong> ${
              population === undefined
                ? "No Data"
                : population.toLocaleString("en-US")
            }</p>
          </div>
        </div>`;
        divOfCountries.appendChild(div);
        div.addEventListener("click", () => {
          localStorage.setItem("nameCountry", `${name.common}`);
          location.href = "country.html";
        });
      });
    } else {
      divOfCountries.innerHTML = "";
      divOfPagination.innerHTML = "";
    }
  };
// filter search
  const searchfilter = (data, valueOfSearch) => {
    if (valueOfSearch !== "") {
      let nameFilter = data.filter((item) => {
        let nameCountry = item.name.common.toLowerCase();
        let nameSearch = valueOfSearch.toLowerCase();
        return nameCountry.includes(nameSearch);
      });

      cardRender(nameFilter, row, localStorage.getItem("paginIndex"));
      paginationCreate(nameFilter, row);
    } else {
      cardRender(data, row, localStorage.getItem("paginIndex"));
      paginationCreate(data, row);
    }
  };
//data from api
  window.onload = () => {
    fetchData("All", "all").then((data) => {
      if (data) {
        api = data;
        api.sort((a, b) =>
          a.name.common > b.name.common
            ? 1
            : b.name.common > a.name.common
            ? -1
            : 0);
//hide loader set time
        loaderHide();
        setTimeout(() => {
          if (localStorage.getItem("paginIndex") == null) {
            localStorage.setItem("paginIndex", "1");
          }
          if (localStorage.getItem("currentRegion") == null) {
            localStorage.setItem("currentRegion", "All");
            regionFilter(localStorage.getItem("currentRegion"), api);
          } else {
            regionFilter(localStorage.getItem("currentRegion"), api);
          }
        }, timer);
      } else {
        api = [];
      }
    });
  };
//list of dropdown
  const dropDownList = [
    "All",
    "Asia",
    "Europe",
    "Americas",
    "Africa",
    "Antarctic",
    "Oceania",
  ];
  dropDownList.map((region) => {
    let itemList = document.createElement("li");
    itemList.classList = `dropdown-item ${region}`;
    itemList.innerHTML = region;
    dropDown.appendChild(itemList);
    if (itemList.classList.contains(localStorage.getItem("currentRegion"))) {
      itemList.classList.add("active");
    }
    itemList.addEventListener("click", () => {
      const allDropDownItems = document.querySelectorAll(".dropdown-item");
      for (let item of allDropDownItems) {
        item.classList.remove("active");
      }
      itemList.classList.add("active");
      localStorage.setItem("currentRegion", `${region}`);
      localStorage.setItem("paginIndex", "1");
      regionFilter(localStorage.getItem("currentRegion"), api);
    });
  });
// to crate pagination
  function btnpagination(page) {
    let btn = document.createElement("li");
    let span = document.createElement("span");
    span.classList = "page-link";
    btn.classList = "page-item";
    span.innerHTML = page;
    btn.appendChild(span);
  return btn;
}
  const paginationCreate = (data, rowsOnPage) => {
    divOfPagination.innerHTML = "";
    let countPage = Math.ceil(data.length / rowsOnPage);

    for (let i = 1; i <= countPage; i++) {
      let btnn = btnpagination(i);
      btnn.classList.add(i);
      divOfPagination.appendChild(btnn);
      if (btnn.classList.contains(localStorage.getItem("paginIndex"))) {
        btnn.classList.add("active");
      }

      btnn.addEventListener("click", () => {
        let btn = document.querySelectorAll(".pagination li.page-item");
        for (let item of btn) {
          item.classList.remove("active");
        }
        localStorage.setItem("paginIndex", `${i}`);
        let indexOfPagination = localStorage.getItem("paginIndex");
        btnn.classList.add("active");
        cardRender(data, rowsOnPage, indexOfPagination);
        location.href = "#home";
      });
    }
  };
} else if (document.querySelector("#country-page")) {
  const divcounty = document.querySelector(".country-div");
  const countryNameCurrent = localStorage.getItem("nameCountry");
// data from api 
  window.onload = () => {
    fetchData("Name", countryNameCurrent).then((data) => {
      if (data) {
        api = data[0];
        loaderHide();
        setTimeout(() => renderCountry(), timer);
        document.title = `Regions Map And Facts || ${api.name.common}`;
      } else {
        api = [];
      }
    });
  };
//render countries
  const renderCountry = () => {
    const {
      name,
      flags,
      coatOfArms,
      population,
      region,
      subregion,
      capital,
      area,
      altSpellings,
      currencies,
      languages,
      capitalInfo,
      latlng,
    } = api;
//countries page 
    if (api.length !== []) {
      divcounty.innerHTML = 
      ` <div class="col-lg-7 flag d-flex justify-content-start align-items-start">
          <img style="width: 500px; height: 500px;" class="${flags.svg === undefined ? "d-none" : ""}"
            src=${flags.svg}
            alt="${name.official}-flag" 
            title="${name.common} Flag" />
        </div>

        <div class="col-lg-5 country-info flex-column justify-content-center d-flex countryinfo">
            <h1 class="country-name">${name.common === undefined ? "No Data" : name.common}</h1>
            <p><strong class="boldtext">Native Name:</strong> ${
                name.nativeName === undefined
                ? "No Data"
                : Object.values(name.nativeName)[0].common}
            </p>
            <p><strong class="boldtext">Area:</strong> ${
              area === undefined ? "No Data" : area.toLocaleString("en-US")}(Km²)
            </p>
            <p><strong class="boldtext">Region:</strong> ${
              region === undefined ? "No Data" : region}
            </p>
            <p><strong class="boldtext">Sub Region:</strong> ${
              subregion === undefined ? "No Data" : subregion}
            </p>
            <p><strong class="boldtext">Capital:</strong> ${
              capital !== undefined ? capital[0] : "No Data"}
            </p>
            <p><strong class="boldtext">Population:</strong> ${
              population === undefined
                ? "No Data"
                : population.toLocaleString("en-US")}
            </p>
            <p><strong class="boldtext">Country Sign:</strong> ${
              altSpellings === undefined ? "No Data" : altSpellings[0]}
            </p>
            <p><strong class="boldtext">Currencies:</strong> ${
              currencies === undefined
                ? "No Data"
                : Object.values(currencies)[0].name + " - "
                } ${
              currencies === undefined ? "" : Object.values(currencies)[0].symbol}
            </p>
            <p><strong class="boldtext">Languages:</strong> ${
              languages === undefined
                ? "No Data"
                : Object.values(languages).map((lang) => lang)}
            </p>
        </div>
        <div class="country-map col-lg-12  justify-content-center align-items-center d-flex">
          <div id='map'></div>
        </div>
      `;
    } else {
      divcounty.innerHTML = "";
    }
//coordinates of map
    const jsong = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates:
              capitalInfo.latlng === undefined
                ? [latlng[1], latlng[0]]
                : [capitalInfo.latlng[1], capitalInfo.latlng[0]],
          },
          properties: {
            title: "Capital City",
            description: capital === undefined ? "No Data" : capital[0],
          },
        },
      ],
    };
//show map
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZ29nZWxhIiwiYSI6ImNsOTh4MWR2bTBiMXYzd3A4bjM1bzVqd2kifQ.XD51XAa3grQuMtKDIt92JQ";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v10",
      center: jsong.features[0].geometry.coordinates,
      zoom: area > 800000 ? 3 : 5,
      projection: "globe",
    });
//mapbox popup
    new mapboxgl.Marker()
      .setLngLat(jsong.features[0].geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
         `<h1 class="text-center">${name.common}</h1>
          <h5 class="text-center">
          <strong>${jsong.features[0].properties.title}</strong>: ${jsong.features[0].properties.description}
          </h5>
         `
        )
      )
      .addTo(map);
      const marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat(jsong.features[0].geometry.coordinates)
        .addTo(map);
      
    map.on("style.load", () => {
      map.setFog({});
    });
    map.addControl(new mapboxgl.NavigationControl());
  };
}
