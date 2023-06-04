"use strict";

var user = JSON.parse(window.localStorage.getItem("userJson"));
var userId;
var userSlug;
var userSexe;
if (user) {
  userId = user.id;
  userSlug = user.pseudo;
  userSexe = user.Sexe;
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

const averageRating = function (arr) {
  let sum = 0;
  const numberOfRatings = arr.length;
  arr.forEach((user) => {
    sum += user.rating;
  });
  return sum / numberOfRatings;
};

/* const nbPersonnesFunction = function(){
    nbPersonnesElements.forEach(btn=> {if(btn.checked) nbPersonnes = btn.value}) ;
} */ // old nbPersonnes check box element

/*
const rechercheId = function(data,email){
  let id = 0 ;
  data.forEach(data=>{
    if(data.email === email.toLowerCase()) id=data.id;
  } )
  return id ;
} */

if (!userId) window.location.href = "/login"; // Verifier si il est connecté
else {
  document.addEventListener("DOMContentLoaded", function () {
    showProfilePic();
    signOutEventListener();
    var msg = document.getElementById("pas-de-trajets");

    const locations = document.querySelectorAll(".destination-input");
    const heures = document.querySelectorAll(".time-input");
    const container = document.querySelector(".container");
    const trajetsSimilar = document.querySelector(".trajet-similairs");

    const cleanTrajetsSimilairesContainer = function () {
      const tripContainer = document.querySelectorAll(".trip");
      tripContainer.forEach((trip) => {
        trip.remove();
      });
      msg.classList.add("hidden");
    };

    document
      .querySelector(".affiche-btn")
      .addEventListener("click", async function () {
        // Trajets similaires
        cleanTrajetsSimilairesContainer();
        const depart = locations[0].value;
        const destination = locations[1].value;
        const carType = document.getElementById("vehicule-input").value;
        const matricule = document.getElementById("matricule-input").value;
        const nbPersonnes = document.getElementById("nbrpersonne-input").value;
        const fumeur = document.getElementById("fumeur-input").checked; // boolean
        const climatisation = document.getElementById(
          "climatisation-input"
        ).checked;
        const date = document.getElementById("date-input").value;
        const heureDepart = heures[0].value;
        const heureArrivé = heures[1].value;
        const prix = document.getElementById("price-input").value;

      const url = `http://localhost:8000/api/v1/trajets?Depart=${depart}&Arrivée=${destination}&sort={"Prix"}` ;
      const response = await fetch(url) ;
      const data = (await response.json()).data.data ;
      if(data.length<1){msg.classList.remove("hidden") ;} 
      else{
      data.forEach(trajet=>{
        if(trajet.Conducteur){
        const date =  new Date(trajet.date) ;
        const day = String(date.getDate()).padStart(2,"0") ;
        const month = date.toLocaleDateString("default",{month:"short"}) ;
        const year = date.getFullYear() 
        let html = `
        <div class="trip" style="display: flex" >
          <div class="driver-profile">
            <img class="photo" src="../img/user/${trajet.Conducteur.photo}"></img>
            <div class="ID">
              <p class="name">${trajet.Conducteur.name}</p>
              <p class="avis">${trajet.Conducteur.ratingsAverage}/5 avis</p>
            </div>
          </div>
          <div class="trip-info">
            <p class="trip-trajet">${trajet.Depart} à ${trajet.Arrivée}</p>
            <div class="trip-time">
              <span class="material-symbols-outlined"> timer </span>
              <p>${trajet.HeurD}</p>
              <span class="material-symbols-outlined"> arrow_forward </span>
              <p>${trajet.HeurA}</p>
            </div>
          </div>
          <div class="trip-date">
            <p>le ${day} ${month} ${year}</p>
          </div>
          <div class="trip-price">
            <p>${trajet.Prix} DA</p>
          </div>
        </div>
      </div>`
      document.querySelector(".suggested-prices").insertAdjacentHTML("beforeend",html) ;
        }
      })} 
     
      
      });     

    document
      .querySelector(".ajouter-btn")
      .addEventListener("click", async function (e) {
        // Ajouter trajet
        e.preventDefault();
        try {
          const depart = locations[0].value;
          const destination = locations[1].value;
          const carType = document.getElementById("vehicule-input").value;
          const matricule = document.getElementById("matricule-input").value;
          const nbPersonnes =
            document.getElementById("nbrpersonne-input").value;
          const fumeur = document.getElementById("fumeur-input").checked; // boolean
          const climatisation = document.getElementById(
            "climatisation-input"
          ).checked;
          const date = document.getElementById("date-input").value;
          const heureDepart = heures[0].value;
          const heureArrivé = heures[1].value;
          const prix = document.getElementById("price-input").value;
          // check inputs function
          const inputsEmpty = function () {
            let inputsEmptyVar = false;
            if (
              depart &&
              destination &&
              carType &&
              matricule &&
              date &&
              heureDepart &&
              heureArrivé &&
              prix
            )
              inputsEmptyVar = false;
            else inputsEmptyVar = true;
            return inputsEmptyVar;
          };
          //

          if (inputsEmpty()) throw new Error("Please check your inputs ❌"); // if there's an error it automatically goes to the catch block

          const res = await fetch("http://localhost:8000/api/v1/trajets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Depart: depart,
              Arrivée: destination,
              Vehicule: carType,
              Matricule: matricule,
              places: nbPersonnes,
              fumers: fumeur,
              date: date,
              HeurD: heureDepart,
              HeurA: heureArrivé,
              Prix: prix,
              Conducteur: userId,
              climatisation: climatisation,
              slug: userSlug,
              Sexe: userSexe,
            }),
          });
          console.log(res);

          if (!res.ok)
            throw new Error(`Something went wrong ❌ , please try again later`);

          await res.json();

          window.location.href = "/";
        } catch (err) {
          document.querySelectorAll(".erreur").forEach((txt) => txt.remove());
          const html = ` <div class="invalid erreur" style="display: flex;" >
      <p class="invalid-text">
      (${err.message})
      </p>
      <ion-icon
        class="invalid-icon"
        name="alert-circle-outline"
      ></ion-icon>
    </div>`;
          container.insertAdjacentHTML("afterend", html);
        }
      });
  });
}
