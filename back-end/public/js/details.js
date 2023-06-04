"use strict";
const reserverTrajet = document.querySelector(".oui");
var user = JSON.parse(window.localStorage.getItem("userJson"));
var token = window.localStorage.getItem("userToken");
var userId;
if (user) userId = user.id;
var selectedTrajetId;
var place;

const showProfilePic = function () {
  const userPic = user.photo;
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

// document.addEventListener("DOMContentLoaded", function () {
//   showProfilePic();
//   signOutEventListener();

//   setTimeout(function () {
//     // Remove the spinner and display the content
//     document.getElementById("loading-spinner-container").style.display = "none";
//     document.body.style.overflow = "auto"; // Show scrollbars
//   }, 300);
// });

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
function afficherEtoiles(ranking) {
  const fullStars = Math.floor(ranking);
  const partialStar = Math.round((ranking - fullStars) * 10) / 10;
  let html = "";
  for (let i = 1; i <= fullStars; i++) {
    html += '<img src="../img/StarFilled.png" class="rating-star">';
  }
  if (partialStar >= 0.5) {
    html += '<img src="../img/StarHalfFilled.png" class="rating-star">';
  }
  for (let i = Math.ceil(ranking); i <= 5; i++) {
    html += '<img src="../img/Star.png" class="rating-star">';
  }
  return html;
}

function printStars(ranking) {
  let stars = "";
  for (let i = 0; i < ranking; i++) {
    stars += "★";
  }
  return stars;
}
function getDayOfWeek(dateString) {
  const daysOfWeek = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const date = new Date(dateString);
  const dayOfWeekIndex = date.getUTCDay();
  return daysOfWeek[dayOfWeekIndex];
}
function formatDuree(heureDepart, heureArrivee) {
  const depart = heureDepart.split(".");
  const arrivee = heureArrivee.split(".");

  const dureeHeures = arrivee[0] - depart[0];
  const dureeMinutes = arrivee[1] - depart[1];

  return `${dureeHeures}h.${Math.abs(dureeMinutes)}`;
}
function getStarRatingHTML(rating) {
  const starComplet = "../img/Star.png";
  const demiStar = "../img/half-star.png";
  const starVide = "../img/empty-star.png";

  const maxRating = 5;
  const roundedRating = Math.round(rating * 2) / 2; // Arrondir à 0.5 près

  let starHTML = "";

  // Générer les étoiles complètes
  for (let i = 1; i <= Math.floor(roundedRating); i++) {
    starHTML += `<img src="${starComplet}" alt="Star" />`;
  }

  // Générer la demi-étoile si nécessaire
  if (roundedRating % 1 !== 0) {
    starHTML += `<img src="${demiStar}" alt="Half Star" />`;
  }

  // Générer les étoiles vides pour compléter jusqu'à la note maximale
  for (let i = Math.ceil(roundedRating); i < maxRating; i++) {
    starHTML += `<img src="${starVide}" alt="Empty Star" />`;
  }

  return starHTML;
}

function afficherinfo(data) {
  const box = document.querySelector(".infooo");
  const departt = data.data.trajet.Depart;
  const arriverr = data.data.trajet.Arrivée;
  const photo = data.data.trajet.Conducteur.photo;
  const Datee = data.data.trajet.date.substring(0, 10);
  const jour = getDayOfWeek(Datee);
  const heurd = data.data.trajet.HeurD;
  const heura = data.data.trajet.HeurA;
  const prix = data.data.trajet.Prix;
  const nom = data.data.trajet.slug;
  const etoile = data.data.trajet.Conducteur.ratingsAverage;
  const formattedDate = formatDate(Datee);
  const info = `
    <div class="trajet-date container">
          le
          <span id="trajet-jour-de-semaine">${jour}</span>
          <span id="trajet-jour">${formattedDate.day}</span>
          <span id="trajet-mois">${formattedDate.month}</span>
        </div>
      </section>
      <section class="section-trip-map">
        <div class="trip">
          <div class="circle c-right"></div>
          <div class="circle c-left"></div>
          <div class="line contigue"></div>
          <div class="line dashed"></div>

          <div class="departure">
            <span id="city" class="city">${departt}</span>
            <div class="details">
              <span class="details-text">départ à</span>
              <span id="heure-depart" class="details-text">${heurd}</span>
            </div>
          </div>
          
          <div class="arrival">
            <span id="city" class="city">${arriverr}</span>
            <div class="details">
              <span class="details-text">arrivée à</span>
              <span id="heure-arrivee" class="details-text">${heura}</span>
            </div>
          </div>
        </div>
      </section>
      <section class="section-price">
        <div class="container">
          <span class="section-title">prix du trajet</span>
          <div>
            <span id="prix" class="prix">${prix}</span>
            <span class="price">&nbsp;DA / passager</span>
          </div>
        </div>
      </section>
      <section class="section-driver">
        <div class="container driver">
          <span class="section-title">conducteur</span>
          <div class="driver-profile">
          <div class="driver-profile">
          <img
            id="conducteur-photo"
            class="driver-pfp"
            <img src="../img/user/${photo}" alt="photo conducteur">
            <span id="conducteur-nom" class="driver-text">${nom}</span>
            <span id="conducteur-prenom" class="driver-text"></span>
            <span class="driver-text"></span>
            <span id="rating" class="driver-text">${getStarRatingHTML(
              etoile
            )}</span>
            <span class="rating"></span>
          </div>
        </div>`;
  box.insertAdjacentHTML("afterbegin", info);
}
function affichervehicule(data) {
  const container = document.querySelector(".car");
  const Vehicule = data.data.trajet.Vehicule;
  // const fumers = data.data.trajet.fumers;
  let fumers = data.data.trajet.fumers;
  fumers = fumers ? "oui" : "non";
  let clim = data.data.trajet.climatisation;
  clim = clim ? "oui" : "non";

  const Matricule = data.data.trajet.Matricule;
  const Couleur = data.data.trajet.Couleur;
  place = data.data.trajet.places;

  const infocar = `
  <div class="side">
    <span class="variable">Vehicule</span>
    <span class="variable">Matricule</span>
    <span class="variable">Couleur</span>
    <span class="variable">Climatisation</span>
    <span class="variable">Cigarette autorisée</span>
    <span class="variable">Nombre de Passagers</span>
  </div>
  <div class="side r-side">
  <span id="voiture-nom" class="value">
    ${Vehicule}
  </span>
  <span id="voiture-matricule" class="value">
    ${Matricule}
  </span>
  <span id="voiture-couleur" class="value">
    ${Couleur}
  </span>
  <span id="voiture-climat" class="value">
    ${clim}
  </span>
  <span id="voiture-fumer" class="value">
    ${fumers}
  </span>
  <span id="voiture-nbr" class="value">
    ${place}
  </span>
  </div>

   `;
  container.insertAdjacentHTML("afterbegin", infocar);
}
function footer(data) {
  const foote = document.querySelector(".section-phone");
  const phone = data.data.trajet.Conducteur.phone;
  const footer = `
  <div class="container">
  <span class="section-phone-title"
            >contactez le conducteur pour se mettre d'accord sur le lieu du
            RDV</span
          >
          <div>
            <span class="prix"></span>
            <span id="telephone" class="price">${phone}</span>`;
  foote.insertAdjacentHTML("afterbegin", footer);
}

const img = document.getElementById("review-photo");
const ladate = document.getElementById("review-date");
const fullname = document.getElementById("review-full-name");
const info = document.getElementById("review-texte");

const prevBtn = document.querySelector(".btn.btn--left");
const nextBtn = document.querySelector(".btn.btn--right");
const star = document.querySelector(".rating-stars");
let currentItem = 0;
let reviewsObj = {};

if (!userId) window.location.href = "/login";
else {
  document.addEventListener("DOMContentLoaded", function () {
    signOutEventListener();
    showProfilePic();
    selectedTrajetId = localStorage.getItem("selectedTrajetId");
    console.log(selectedTrajetId);
    const url = `http://localhost:8000/api/v1/trajets/${selectedTrajetId}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        afficherinfo(data);
        affichervehicule(data);
        footer(data);
        if (data.data.trajet) {
          reviewsObj = {};
          data.data.trajet.reviews.forEach((review, index) => {
            reviewsObj[index] = {
              date: review.createdAt,
              id: review.id,
              review: review.review,
              rating: review.rating,
              conducteur: review.conducteur,
              user: review.user,
            };
          });

          console.log(reviewsObj);
        }
        showPerson(currentItem);
      })
      .catch((error) => console.error(error));
  });

  function showPerson(person) {
    const item = reviewsObj[person];
    img.src = `../img/user/${item.user.photo}`;
    fullname.textContent = item.user.name;
    ladate.textContent = item.date.substring(0, 10);
    info.textContent = item.review;
    star.innerHTML = getStarRatingHTML(item.rating);
  }

  // show next person
  nextBtn.addEventListener("click", function () {
    currentItem++;
    if (currentItem > Object.keys(reviewsObj).length - 1) {
      currentItem = 0;
    }
    showPerson(currentItem);
  });

  // show prev person
  prevBtn.addEventListener("click", function () {
    currentItem--;
    if (currentItem < 0) {
      currentItem = Object.keys(reviewsObj).length - 1;
    }
    showPerson(currentItem);
  });

  reserverTrajet.addEventListener("click", async function () {
    const url = `http://localhost:8000/api/v1/trajets/reserver/${selectedTrajetId}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passagerId: userId,
          places: place,
        }),
      });

      if (!res.ok)
        throw new Error(
          "Something has gone wrong ❌ , please try again later !"
        );

      await res.json();

      window.location.href = "/html/dashboard.html";
    } catch (err) {
      console.error(err.message);
    }
  });
}
