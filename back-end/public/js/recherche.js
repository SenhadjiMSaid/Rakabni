//  code propre
function gett(x) {
  console.log(x);
  localStorage.setItem("selectedTrajetId", x);
  const currentUrl = window.location.href;
  const currentPathname = window.location.pathname;
  const detailsUrl = currentUrl.replace(currentPathname, "/html/details.html");
  window.location.href = detailsUrl;
}
var user = JSON.parse(window.localStorage.getItem("userJson"));
var userId;
if (user) userId = user.id;

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  return {
    year,
    month,
    day,
  };
}
function displaySearchInfo(mesDonnees, selectedPassengers) {
  const trajetbox = document.querySelector(".search-results");
  const nbrtrajet = mesDonnees.results;
  const departt = mesDonnees.data.data[0].Depart;
  const arriverr = mesDonnees.data.data[0].Arrivée;
  const resultats = mesDonnees.results;
  const Datee = mesDonnees.data.data[0].date.substring(0, 10);
  const formattedDate = formatDate(Datee);
  const infodebase = `
    <span class="searched-trip-info">
      <span class="searched-trip-info-depart">${departt}</span>
      <ion-icon name="arrow-forward-outline" class="icon"></ion-icon>
      <span class="searched-trip-info-arrival">${arriverr}</span>
      <span> le </span>
      <span class="searched-trip-info-day">${formattedDate.day}</span>
      <span class="searched-trip-info-month">${formattedDate.month}</span>
      <span> pour </span>
      <span class="searched-trip-info-passengers-value">${selectedPassengers}</span>
      <span class="searched-trip-info-passengers-text">Personnes</span>
    </span>
    <span class="amount-of-results">
      <span class="amount-of-results-value">${resultats}</span>
      <span class="amount-of-results-text">Résultats</span>
    </span>
  `;

  trajetbox.insertAdjacentHTML("afterbegin", infodebase);
}
function displayrecherch(nbrtrajet, mesDonnees) {
  const trajetbox = document.querySelector(".search-results");

  for (let i = 0; i < nbrtrajet; i++) {
    const trajet = mesDonnees.data.data[i];
    const trajets = {
      id: trajet.id,
      status: mesDonnees.status,
      depart: trajet.Depart,
      Arrivée: trajet.Arrivée,
      Conducteur: trajet.Conducteur.name,
      photo: trajet.Conducteur.photo,
      Couleur: trajet.Couleur,
      HeurA: trajet.HeurA,
      HeurD: trajet.HeurD,
      Matricule: trajet.Matricule,
      Passagers: trajet.Passagers,
      Prix: trajet.Prix,
      Vehicule: trajet.Vehicule,
      date: trajet.date,
      fumers: trajet.fumers,
      climatisation: trajet.climatisation,
      isActive: trajet.isActive,
      places: trajet.places,
      slug: trajet.slug,
      ranking: trajet.Conducteur.ratingsAverage,
      reviews: Object.keys(trajet.reviews).length,
    };

    const recherche_trajet = `
      <div class="results-box" id="${trajets.id}" onclick="gett('${
      trajets.id
    }')"}>
        <div class="result">
          <div class="left">
            <div class="driver-info">
              <div class="profile-pic">
                <img src="../img/user/${trajets.photo}" alt="photo conducteur">
              </div>
              <div class="next-to-pic">
                <div class="name">${trajets.Conducteur}</div>
                <span class="rating">
                  <ion-icon name="star-outline" class="icon"></ion-icon>
                  <span class="rating-value">${trajets.ranking}</span>
                  <span>/ 5 - </span>
                </span>
                <span class="reviews">
                  <span class="reviews-value">${trajets.reviews}</span>
                  <span class="reviews-text"> Avis</span>
                </span>
              </div>
            </div>
            <div class="trip-info">
              <span class="locations">
                <span>de</span>
                <span class="depart">${trajets.depart}</span>
                <span> à </span>
                <span class="arrival">${trajets.Arrivée}</span>
              </span>
              <div class="date">
                <ion-icon name="calendar-outline" class="date-icon icon"></ion-icon>
                <div>
                  <span>le</span>
                  <span class="date-day">${trajets.date.substring(0, 10)}</span>
                </div>
              </div>
              <div class="time">
                <ion-icon name="time-outline" class="time-icon icon"></ion-icon>
                <div class="time-text">
                  <span class="depart-time">${trajets.HeurD}</span>
                  <ion-icon name="arrow-forward-outline" class="icon"></ion-icon>
                  <span class="arrival-time">${trajets.HeurA}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="price">
              <span class="price-value">${trajets.Prix}</span>
              <span class="price-text">DA</span>
            </div>
            <div class="remaining-places">
              <span class="remaining-places-text">Places restantes:</span>
              <ion-icon name="person-outline" class ="icon"></ion-icon>
              <span class="remaining-places-value">${trajets.places}</span>
              </div>
              </div>
              </div>
              </div>
              `;
    trajetbox.insertAdjacentHTML("beforeend", recherche_trajet);
  }
}

const showProfilePic = function () {
  var userPic = user.photo;
  document
    .querySelector(".profile-pic")
    .setAttribute("src", `../img/user/${userPic}`);
};

const signOutEventListener = function () {
  const profilSignOut = document.getElementById("signout"); // Déconnecter
  profilSignOut.addEventListener("click", async function () {
    await fetch("http://localhost:8000/api/v1/users/logout");
    window.localStorage.removeItem("userJson");
    window.location.href = "/";
  });
};

function erreur() {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = "Aucun résultat n'est disponible";
  // Insertion du message d'erreur dans le document
  const container = document.querySelector(".search-results");
  container.appendChild(errorMessage);
}
document.addEventListener("DOMContentLoaded", function () {
  // verifier si connecté / deconnecté
  const loginRegisterTabs = document.querySelector(".nav-login");
  const profileTab = document.querySelector(".nav-profile");
  if (!userId) {
    profileTab.classList.add("hidden");
    loginRegisterTabs.classList.remove("hidden");
  } else {
    loginRegisterTabs.classList.add("hidden");
    profileTab.classList.remove("hidden");
    showProfilePic();
    signOutEventListener();
  }
  //

  const mesDonnees = JSON.parse(localStorage.getItem("mes-donnees"));
  console.log(mesDonnees);
  if (mesDonnees.results === 0) {
    erreur();
  }
  const nbrtrajet = mesDonnees.results;
  console.log(`nbTrajet : ${nbrtrajet}`);
  console.log(`mes données ${mesDonnees.data.data[0].id}`);
  const selectedPassengers = localStorage.getItem("selectedPassengers");
  displaySearchInfo(mesDonnees, selectedPassengers);
  displayrecherch(nbrtrajet, mesDonnees);
  const filterACCheckbox = document.getElementById("filter-price");
  const filterACCheckbox2 = document.getElementById("filter-time");
  const interditfumeur = document.getElementById("filter-ac");
  const filterACCheckbox3 = document.getElementById("filter-duration");
  const clim = document.getElementById("filter-smoke");
  const sexfemme = document.getElementById("filter-profile");
  filterACCheckbox.addEventListener("click", () => {
    if (
      filterACCheckbox.checked &&
      !interditfumeur.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const url = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=Prix`;

      fetch(url)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;

          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=Prix&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=Prix&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=Prix&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=Prix&Sexe=Femme&sort=fumers`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=Prix&Sexe=Femme&sort=fumers&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  // filtre acccheckbox  HeurD
  filterACCheckbox2.addEventListener("click", () => {
    if (
      filterACCheckbox2.checked &&
      !interditfumeur.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const url = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=HeurD`;

      fetch(url)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox2.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=HeurD&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=HeurD&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=HeurD&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=HeurD&Sexe=Femme&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=HeurD&Sexe=Femme&climatisation=true&sort=fumers`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  // filtre 3 -Prix
  filterACCheckbox3.addEventListener("click", () => {
    if (
      filterACCheckbox3.checked &&
      !interditfumeur.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const url = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=-Prix`;

      fetch(url)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=-Prix&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox3.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=-Prix&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=-Prix&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=-Prix&Sexe=Femme&sort=fumers`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&sort=-Prix&Sexe=Femme&sort=fumers&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  //  fumeur
  interditfumeur.addEventListener("click", () => {
    if (
      interditfumeur.checked &&
      !clim.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !clim.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      !clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  // climatisation
  clim.addEventListener("click", () => {
    if (
      !interditfumeur.checked &&
      clim.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      clim.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      clim.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      clim.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&&climatisation=true&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&sort=Prix&fumers=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      clim.checked &&
      !sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&Sexe=Femme&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&Sexe=Femme&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  // sexde femme
  sexfemme.addEventListener("click", () => {
    if (
      !interditfumeur.checked &&
      !clim.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox2.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !clim.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&Sexe=Femme&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !clim.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&Sexe=Femme&sort=Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !clim.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&Sexe=Femme&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&Sexe=Femme&sort=Prix&fumers=true`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme&sort=-Prix`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      filterACCheckbox2.checked &&
      !clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&Sexe=Femme&sort=HeurD`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&fumers=true&climatisation=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    } else if (
      !interditfumeur.checked &&
      !filterACCheckbox3.checked &&
      !filterACCheckbox.checked &&
      !filterACCheckbox2.checked &&
      clim.checked &&
      sexfemme.checked
    ) {
      const urlWithFilters = `http://localhost:8000/api/v1/trajets?Depart=${mesDonnees.data.data[0].Depart}&Arrivée=${mesDonnees.data.data[0].Arrivée}&places[gte]=${selectedPassengers}&date=${mesDonnees.data.data[0].date}&climatisation=true&Sexe=Femme`;

      fetch(urlWithFilters)
        .then((response) => response.json())
        .then((mesDonnees) => {
          console.log(mesDonnees);
          const nbrrtrajet = mesDonnees.results;
          if (mesDonnees.results === 0) {
            erreur();
          }
          const trajetbox = document.querySelector(".search-results");
          trajetbox.innerHTML = "";

          displaySearchInfo(mesDonnees, selectedPassengers);
          displayrecherch(nbrrtrajet, mesDonnees);
        })
        .catch((error) => console.error(error));
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".results-box").forEach(function (trajetElement) {
      trajetElement.addEventListener("click", function (event) {
        const trajetId = event.currentTarget.id;
        console.log(trajetId);
        localStorage.setItem("selectedTrajetId", trajetId);
        const currentUrl = window.location.href;
        const currentPathname = window.location.pathname;
        const detailsUrl = currentUrl.replace(
          currentPathname,
          "/html/details.html"
        );
        window.location.href = detailsUrl;
      });
    });
  });
});
