var user = JSON.parse(window.localStorage.getItem("userJson"));
var userId;
var userPic;
var userName;
var userRating;
var userPseudo;
var userPhone;
var userEmail;
var token = window.localStorage.getItem("userToken");
if (user) {
  userId = user.id;
  userPic = user.photo;
  userName = user.name;
  userRating = user.ratingsAverage;
  userPseudo = user.pseudo;
  userPhone = user.phone;
  userPhoneFormatted = userPhone; // j'envoie le numero avec 213
  userEmail = user.email;
}



const sortTrajetsOuReservations = function(trajets){
  trajets.sort((a,b)=>{
    const date1 = new Date(a.date) ;
    const date2 = new Date(b.date);
    return date2 - date1 ;
  })
} 

const signOutEventListener = function () {
  const profilSignOut = document.querySelector(".disconnect"); // Déconnecter
  profilSignOut.addEventListener("click", async function () {
    await fetch("http://localhost:8000/api/v1/users/logout");
    window.localStorage.removeItem("userJson");
    window.location.href = "/";
  });
};

function afficherEtoiles(ranking) {
  const fullStars = Math.floor(ranking);
  const partialStar = Math.round((ranking - fullStars) * 10) / 10;
  let html = "";
  for (let i = 1; i <= fullStars; i++) {
    html += '<img src="../img/star.png" class="head-rating-star" >';
  }
  if (partialStar >= 0.5) {
    html += '<img src="../img/half-star.png" class="head-rating-star" >';
  }
  for (let i = Math.ceil(ranking) + 1; i <= 5; i++) {
    html += '<img src="../img/empty-star.png" class="head-rating-star" >';
  }
  return html;
}

const openCloseTrajetElementEventsListener = function () {
  var trajetElements = document.querySelectorAll(".trajet");
  var trajetBottomElements = document.querySelectorAll(".trajet-bottom");
  var buttonElements = document.querySelectorAll("button");

  for (let i = 0; i < trajetElements.length; i++) {
    if (!trajetElements[i].classList.contains("past")) {
      trajetElements[i].addEventListener("click", function (event) {
        trajetBottomElements[i].classList.toggle("open");
        trajetElements[i].classList.toggle("opened");
      });
    }
  }

  document.addEventListener("click", function (event) {
    for (let i = 0; i < trajetElements.length; i++) {
      if (
        trajetBottomElements[i].classList.contains("open") &&
        event.target !== buttonElements[i] &&
        !trajetElements[i].contains(event.target)
      ) {
        trajetBottomElements[i].classList.remove("open");
        trajetElements[i].classList.remove("opened");
      }
    }
  });

  buttonElements.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  var alertContainer = document.querySelector(".save-alert") ;
  var editBtns = document.querySelectorAll(".edit--content") ;

  signOutEventListener();


  const profilTabInfos = function () {
    const imgElement = document.querySelector(".head-pfp");
    const ratingsStarsElement = document.querySelector(".head-rating-stars");
    const ratingElement = document.querySelector(".head-rating-score");
    const nameElement = document.querySelector(".head-name-fullname");
    const pseudoElement = document.getElementById("pseudo");
    const phoneElement = document.getElementById("telephone");
    const emailElement = document.getElementById("email");
    const html = afficherEtoiles(userRating);

    imgElement.src = `../img/user/${userPic}`;
    ratingsStarsElement.innerHTML = html;
    ratingElement.textContent = userRating;
    nameElement.textContent = userName;
    pseudoElement.textContent = userPseudo;
    phoneElement.textContent = userPhoneFormatted;
    emailElement.textContent = userEmail;
  };

  profilTabInfos();
  console.log(user);

  const trajetsContainer = document.querySelector(".trajets");
  const url = `http://localhost:8000/api/v1/trajets/conducteur/${userPseudo}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  let trajets = (await res.json()).data.trajet; // array of current user trajets;
  await sortTrajetsOuReservations(trajets) ;
  const mesTrajets = function () {
    trajets.forEach((trajet) => {
      const date = new Date(trajet.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth()).padStart(2, "0");
      const year = date.getFullYear();
      const passagers = trajet.Passagers;
      var htmlP = "";
      passagers.forEach((passager) => {
        htmlP += `<div class="passager-info">
        <img class="passager-pfp" src="../img/user/${passager.photo}" />
        <span class="passager-name">${passager.name}</span>
      </div>`;
      });
      const html = `<div class="trajet ${trajet.isActive ? "" : "past"} ">
    <div class="trajet-top">
      <div class="left">
        <div class="trip-info">
          <span class="locations--trajet">
            <span class="depart white">${trajet.Depart}</span>
            <span class="white"> vers </span>
            <span class="arrival white">${trajet.Arrivée}</span>
          </span>
        </div>
      </div>
      <div class="timing">
        <div class="date">
          <ion-icon
            name="calendar-outline"
            class="date-icon icon md hydrated white"
            role="img"
            aria-label="calendar outline"
          ></ion-icon>
          <div>
            <span class="white">le</span>
            <span class="date-day white">${year}-${month}-${day}</span>
          </div>
        </div>
        <div class="time">
          <ion-icon
            name="time-outline"
            class="time-icon icon md hydrated white"
            role="img"
            aria-label="time outline"
          ></ion-icon>
          <div class="time-text">
            <span class="depart-time white">${trajet.HeurD}</span>
            <ion-icon
              name="arrow-forward-outline"
              class="icon md hydrated white"
              role="img"
              aria-label="arrow forward outline"
            ></ion-icon>
            <span class="arrival-time white">${trajet.HeurA}</span>
          </div>
        </div>
      </div>
      <div class="right--trajet">
        <div class="price">
          <span class="price-value white">${trajet.Prix}</span>
          <span class="price-text white">DA</span>
        </div>
      </div>
    </div>
    <div class="trajet-bottom">
      <div>
        <span class="passager-title">les passagers -</span>
        <span class="passager-remaining">${trajet.places}</span>
        <span class="passager-remaining">places restantes</span>
      </div>
      ${htmlP}
    </div>
    <button class="cancel-trip" id="${trajet.id}">annuler le trajet</button>  
  </div>`;

      trajetsContainer.insertAdjacentHTML("beforeend", html);
    });
    openCloseTrajetElementEventsListener();
  };

  mesTrajets();

  const mesReservations = async function () {
    const res = await fetch(
      `http://localhost:8000/api/v1/trajets/passager/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    let reservations = (await res.json()).data.trajet;
    await sortTrajetsOuReservations(reservations) ;
    const reservationsContainer = document.querySelector(".reservations");
    reservations.forEach(async function(reservation){
      console.log(reservation) ;
      if (reservation.Conducteur) {
        const numberOfReviews = reservation.reviews.length ;
        const date = new Date(reservation.date);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth()).padStart(2, "0");
        const year = date.getFullYear();
        const html = ` <div class="result ${
          reservation.isActive ? "" : "past"
        } "}>
           <div class="left">
             <div class="driver-info">
               <div>
                 <img
                   class="profile-pic"
                   src="../img/user/${reservation.Conducteur.photo}"
                   alt="photo conducteur"
                 />
               </div>

               <div class="next-to-pic">
                 <div class="name white">${reservation.Conducteur.name}</div>
                 <span class="rating">
                   <ion-icon
                     name="star-outline"
                     class="icon md hydrated white"
                     role="img"
                     aria-label="star outline"
                   ></ion-icon>
                   <span class="rating-value white">${reservation.Conducteur.ratingsAverage}</span>
                   <span class="white">/ 5 - </span>
                 </span>
                 <span class="reviews">
                   <span class="reviews-value white">${numberOfReviews}</span>
                   <span class="reviews-text white"> Avis</span>
                 </span>
                 <div class="reserved-tel">${reservation.Conducteur.phone}</div>
               </div>
             </div>
             <div class="trip-info">
               <span class="locations">
                 <span class="white">de</span>
                 <span class="depart white">${reservation.Depart}</span>
                 <span class="white"> à </span>
                 <span class="arrival white">${reservation.Arrivée}</span>
               </span>
             </div>
           </div>
           <div>
             <div class="date">
               <ion-icon
                 name="calendar-outline"
                 class="date-icon icon md hydrated white"
                 role="img"
                 aria-label="calendar outline"
               ></ion-icon>
               <div>
                 <span class="white">le</span>
                 <span class="date-day white">${year}-${month}-${day}</span>
               </div>
             </div>
             <div class="time">
               <ion-icon
                 name="time-outline"
                 class="time-icon icon md hydrated white"
                 role="img"
                 aria-label="time outline"
               ></ion-icon>
               <div class="time-text">
                 <span class="depart-time white">${reservation.HeurD}</span>
                 <ion-icon
                   name="arrow-forward-outline"
                   class="icon md hydrated white"
                   role="img"
                   aria-label="arrow forward outline"
                 ></ion-icon>
                 <span class="arrival-time white">${reservation.HeurA}</span>
               </div>
             </div>
           </div>
           <div class="right">
             <div class="price">
               <span class="price-value white">${reservation.Prix}</span>
               <span class="price-text white">DA</span>
             </div>
             ${
               reservation.isActive
                 ? ` <div class="remaining-places white">
                                       <span class="remaining-places-text white">Places restantes:</span>
                                       <ion-icon
                                              name="person-outline"
                                              class="icon md hydrated white"
                                              role="img"
                                              aria-label="person outline"
                                        ></ion-icon>
                                            <span class="remaining-places-value white">${reservation.places}</span>
                                            </div>`
                 : `                        <a href="/html/addReview.html">
                                           <div class="leave-a-review" id=${reservation.Conducteur.id}>
                                            <span>laisser un avis</span>
                                           </div>
                                         </a>`
             }
        
           </div>
         </div>`;
        reservationsContainer.insertAdjacentHTML("afterbegin", html);
      }
    });

    const reviewEventListener = function () {
      const reviewBtns = document.querySelectorAll(".leave-a-review");
      reviewBtns.forEach((reviewBtn) => {
        reviewBtn.addEventListener("click", function () {
          const conducteurId = this.id;
          window.localStorage.setItem("conducteurId", conducteurId);
        });
      });
    };

    reviewEventListener();
  };

  mesReservations();

  const deleteTrajetEventListener = function () {
    const deleteTrajetElement = document.querySelectorAll(".cancel-trip");
    deleteTrajetElement.forEach((elmnt) => {
      elmnt.addEventListener("click", async function () {
        const trajetId = this.id;
        const res1 = await fetch(`http://localhost:8000/api/v1/trajets/${trajetId}`,{
          method:"GET",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
    }) ;

   const passagers = (await res1.json()).data.trajet.Passagers ;

  await passagers.forEach(async(psg)=> {
    console.log(psg) ;
    const res2 = await fetch("http://localhost:8000/api/v1/users/annuler", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: psg.email,
    }),
  });
   console.log(res2);
}) ;
 
        const res = await fetch(
          `http://localhost:8000/api/v1/trajets/${trajetId}`,
          {
            method: "DELETE",
          }
        );  
    
        if(res.ok) window.location.href = "/html/dashboard.html";
        
      });
    });
  };

  deleteTrajetEventListener();

  const deleteAccountEventListener = function () {
    const deleteAccountElement = document.querySelector(".delete-account");
    deleteAccountElement.addEventListener("click", async function () {
      const url = `http://localhost:8000/api/v1/users/${userId}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      if (res.ok) {
        window.localStorage.removeItem("userJson");
        window.location.href = "/";
      }
    });
  };

  deleteAccountEventListener();


  const mesAvis = async function(){

    const res = await fetch(`http://localhost:8000/api/v1/reviews/${userId}`,{
      method:"GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }) ;
    const avis = (await res.json()).data.review ;
    const avisContainer = document.querySelector(".avis") ;
    avis.forEach(review=>{
    if (review.user){
    const date = new Date(review.createdAt) ;
    const day = String(date.getDate()).padStart(2,"0") ;
    const month = String(date.getMonth()).padStart(2,"0") ;
    const year = date.getFullYear() ;
    const html2 = afficherEtoiles(review.rating) ;
    const html = `
    <div class="review">
    <div class="rating-stars">
      ${html2}
    </div>
    <span id="review-texte" class="review-text"
      >${review.review}</span
    >
    <div class="user-info">
      <img
        id="review-photo"
        class="review-photo"
        src="../img/user/${review.user.photo}"
      />
      <div class="user">
        <span id="review-date" class="review-date">${year}-${month}-${day}</span>
        <span id="review-full-name" class="review-full-name">${review.user.name}</span>
      </div>
    </div>
  </div>` ;
  avisContainer.insertAdjacentHTML("beforeend",html) ;
    }
  }
 ) };

  mesAvis() ;

  var updateUser = async function(){
    user.email = userEmail ;
    user.name = userName ;
    user.phone = userPhone ;
    user.pseudo = userPseudo ;
    user.photo = userPic ;
    window.localStorage.removeItem("userJson") ;
   await window.localStorage.setItem("userJson",JSON.stringify(user)) ;
    } ;

   const photoModifierListener =  async function(){

    
      // userPic = "default.jpg" ;

const fileInput = document.getElementById('edit--photo');
const profilePhoto = document.querySelector('.head-pfp');

fileInput.addEventListener('change', async (event) => {
  window.onbeforeunload = () => 'Êtes-vous sûr de vouloir quitter cette page ?';
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const url = `http://localhost:8000/api/v1/users/updateMe` ;
       const response = await fetch(url,{
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body:formData ,
    }) ;

      if (response.ok) {
        const url = `http://localhost:8000/api/v1/users/${userId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
             },
             });

  let photo = (await res.json()).data.doc.photo ; // array of current user trajets;
        profilePhoto.src = await URL.createObjectURL(file) ;
        userPic = photo ;
        updateUser() ;
        window.onbeforeunload =  undefined ; 
      } else {
        throw new Error('Error uploading photo');
      }
    } catch (error) {
      console.error(error.message);
      window.onbeforeunload =  undefined ;
    }
  }
});









      // document.querySelector(".head-pfp").src = `../img/user/${userPic}` ;
      // const url = `http://localhost:8000/api/v1/users/updateMe` ;
    /*  const res = await fetch(url,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
           photo:userPic ,
        }),
      }) ;
      console.log(res) ;
      if (res.ok) updateUser() ; */

  } ;

  
  photoModifierListener() ;

  const profilModifier = function(){
    

    const calcModifyContainersOn = function(){
      let onCompteur = 0 ;
      editBtns.forEach(btn=>{
        if (btn.classList.contains("container-shown"))
        onCompteur++ ;
      })
      return onCompteur ;
    }
  
    const alertContainerHideListener = function(){
    editBtns.forEach(btn=>{
      btn.addEventListener("click",function(){

      const compteur = calcModifyContainersOn() ;
      if (compteur == 1 && btn.classList.contains("container-shown"))  alertContainer.classList.add("put-away") ;      // only hide the alert container when all modify-containers are hidden

       if (!btn.classList.contains("container-shown")){
       btn.classList.add("container-shown") ;
       alertContainer.classList.remove("put-away") ;
       }
       else {
        btn.classList.remove("container-shown");
       }
      }) 
    })
  } ;

  alertContainerHideListener() ;

    
    const hideModifyContainers = function(){
      alertContainer.classList.add("put-away") ;
      editBtns.forEach(btn=>{
        btn.classList.remove("container-shown");
        btn.classList.remove("redifyed") ;
        document.querySelectorAll(".input-parent").forEach(cnt=>cnt.classList.add("unshown")) ;
        document.querySelectorAll(".button-text").forEach(txt=>txt.classList.remove("redify")) ;
      }) } 


    const cancelBtn = alertContainer.querySelector(".cancel") ;
    cancelBtn.addEventListener("click",hideModifyContainers)

    var passwordSave = async function(){
      const newPassword = document.getElementById("new-mdp").value ;
      const confirmNewPassword = document.getElementById("confirm-new-mdp").value ;
      const ancienPassword = document.getElementById("pass").value ;
      const confirmAncienPassword = document.getElementById("confirm-pass").value ;

      var mdpError = document.querySelector(".mdp-error") ;
      try{

      if (newPassword !== confirmNewPassword || ancienPassword !== confirmAncienPassword || !newPassword || !confirmNewPassword || !ancienPassword || !confirmAncienPassword)   throw new Error("Veuillez vérifier les informations saisies !")

      const url = `http://localhost:8000/api/v1/users/updateMyPassword` ;
      const res = await fetch(url,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordCurrent:ancienPassword,
          password:newPassword ,
          passwordConfirm:confirmNewPassword,  
        }),
      }) ;  

      if(res.ok) {
        hideModifyContainers() ;
        newPassword = "" ;
        confirmNewPassword="";
        ancienPassword="";
        confirmAncienPassword="" ;
      }
      else throw new Error("Mot de passe actuelle incorrect !") ;

    } catch(err){
      mdpError.textContent = err.message ;
      mdpError.classList.remove("hidden") ;
    }
  }


    const passwordSaveBtn = document.querySelector(".confirm-pass-btn") ;
    passwordSaveBtn.addEventListener("click",passwordSave)

    const saveBtn = document.getElementById("save") ;
    saveBtn.addEventListener("click",async function(){

      if (editBtns[0].classList.contains("container-shown")) { passwordSave() } ;  // password

      let prenomInput = document.getElementById("prenom").value ;  // other fields
      let nomInput = document.getElementById("nom").value ;
      let pseudoInput = document.getElementById("name").value ;      
      let telephoneInput = document.getElementById("tel").value ;
      let emailInput = document.getElementById("email").value ;
      let nomComplet ="" ;

      if (prenomInput && nomInput){ nomComplet =`${prenomInput} ${nomInput}`} ;

      if(nomComplet) userName = nomComplet ;
      if (pseudoInput) userPseudo = pseudoInput ;
      if (telephoneInput && telephoneInput.length==10) userPhone = telephoneInput ;
      if (emailInput) userEmail = emailInput ;
      try{
      const url = `http://localhost:8000/api/v1/users/updateMe` ;
      const res = await fetch(url,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
           name:userName,
           email: userEmail,
           pseudo: userPseudo,
           phone: userPhone,
        }),
      }) ;

      console.log(res) ;

      if(res.ok){
        hideModifyContainers() ;
        updateUser() ;
       setTimeout(()=>{
        window.location.href ="/html/dashboard.html"  ; 
      }, 120) ;  
      }

    }catch(err){
      console.log(err.message) ;
    }
      


    })

  }

  profilModifier() ;

 
  

    var cancelButtonElements = document.querySelectorAll(".edit--content");
    var textElements = document.querySelectorAll(".button-text");
    var inputParents = document.querySelectorAll(".input-parent");
  
    for (let i = 0; i < cancelButtonElements.length; i++) {
      if (!cancelButtonElements[i].classList.contains("special")) {
        cancelButtonElements[i].addEventListener("click", function () {
          textElements[i].classList.toggle("redify");
          cancelButtonElements[i].classList.toggle("redifyed");
          inputParents[i].classList.toggle("unshown");
        });
      }
    };


}) ;

////////////////////////////////////////////////////////////////////////////////////


