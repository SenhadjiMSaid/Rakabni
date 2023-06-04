document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".logInCard");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const user = data.date.user;
        JSON;
        window.localStorage.setItem("userToken", token);
        window.localStorage.setItem("userJson", JSON.stringify(user));

        // Vérifier si l'e-mail est celui de l'administrateur
        if (email === "admin@gmail.com") {
          const currentUrl = window.location.href;
          const currentPathname = window.location.pathname;
          const detailsUrl = currentUrl.replace(
            currentPathname,
            "/html/admin.html"
          );
          window.location.href = detailsUrl;
        } else {
          // Rediriger vers la page d'accueil
          window.location.href = "/";
        }
      } else {
        // Afficher un message d'erreur
        const errorMessage = await response.text();
        console.log("Erreur de connexion :", errorMessage);
        const invalide = document.querySelector(".invalid");
        invalide.style.display = "flex";
      }
    } catch (error) {
      console.error(error);
    }
  });
});
