var user = JSON.parse(window.localStorage.getItem("userJson"));
var userId;
if (user) userId = user.id;


const showProfilePic = function () {
  var userPic = user.photo;
  document.querySelector(".profile-pic").setAttribute("src", `../img/user/${userPic}`);
};

const signOutEventListener = function () {
  const profilSignOut = document.getElementById("signout"); // Déconnecter
  profilSignOut.addEventListener("click", async function () {
    await fetch("http://localhost:8000/api/v1/users/logout");
    window.localStorage.removeItem("userJson");
    window.location.href = "/";
  });
};

document.addEventListener("DOMContentLoaded",function(){
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
})