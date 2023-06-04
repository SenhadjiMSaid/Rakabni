// Page d'inscription
const emptyOutInputs = function () {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("password-confirmation").value = "";
  document.getElementById("last-name").value = "";
  document.getElementById("first-name").value = "";
  document.getElementById("pseudo").value = "";
  document.getElementById("num-tel").value ="" ;
};
document.addEventListener("DOMContentLoaded", (e) => {
  let form = document.querySelector(".sign-up-card");
  e.preventDefault();
  // Create acc btn
  const createBtn = document.querySelector(".btn-signup");
  createBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      // Necessary input data
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById(
        "password-confirmation"
      ).value;
      const phoneNumber = document.getElementById("num-tel").value;
      const lastName = document.getElementById("last-name").value;
      const firstName = document.getElementById("first-name").value;
      const pseudo = document.getElementById("pseudo").value;
      const sexe = document.getElementById("sexe").value ;

      // Checking inputs
      
      if (
        !email ||
        !password ||
        !passwordConfirm ||
        !phoneNumber ||
        !firstName ||
        !lastName ||
        !pseudo ||
        !sexe
      ) {
        throw new Error(`Veuillez verifiez vos informations !`);
      }

      if (
        phoneNumber.charAt(0) !== "0" ||
        !["5", "6", "7"].includes(phoneNumber.charAt(1)) ||
        phoneNumber.length !== 10
      ) {
        throw new Error("Le numéro de téléphone n'existe pas !");
      }
      
      if (passwordConfirm != password)
        throw new Error(`Les champs de mot de passe ne correspondent pas !`);

      const res = await fetch("http://localhost:8000/api/v1/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          pseudo: pseudo,
          password: password,
          passwordConfirm: passwordConfirm,
          name: `${lastName} ${firstName}`,
          phone: phoneNumber,
          Sexe:sexe
          // lastName: lastName,
          // firstName: firstName,
          // birthDate:  birthDate,
        }),
      });
      if (!res.ok)
        throw new Error("Quelque chose ne va pas ❌, veuillez réessayer ultérieurement !");
      const data = (await res.json()) ;
      console.log(data);

      let compteActive = data.date.user.active ;
      let newUserId = data.date.user.id ;
      let newUserToken = data.token ;
      const confirmerEmailMsg = document.querySelector(".confirm-mail") ;
      if(!compteActive)  confirmerEmailMsg.classList.remove("hidden") ;
        while(!compteActive){
        const url = `http://localhost:8000/api/v1/users/${newUserId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${newUserToken}`,
             },
             }); 

   compteActive = (await res.json()).data.doc.active ;
            }

      window.location.href="/login" ;
      
    } catch (err) {
      document.querySelectorAll(".erreur").forEach((txt) => txt.remove());
      const html = ` <div class="invalid erreur" style="display: flex;" >
      <p class="invalid-text">
      ${err.message}
      </p>
      <ion-icon
        class="invalid-icon"
        name="alert-circle-outline"
      ></ion-icon>
    </div>`;
      form.firstElementChild.insertAdjacentHTML("beforeend", html);
    }
  });
});
