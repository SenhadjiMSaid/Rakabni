var user = JSON.parse(window.localStorage.getItem("userJson"));
var userId;
if (user) userId = user.id;
var token = window.localStorage.getItem("userToken");
var conducteurId = window.localStorage.getItem("conducteurId");

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".btn");
  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    // getting inputs
    try {
      const review = document.getElementById("comment").value;
      const ratingsElement = document.querySelector(".rating");
      const ratings = ratingsElement.querySelectorAll("input");
      var rating = 0;
      ratings.forEach((rtng) => {
        if (rtng.checked) rating = rtng.value;
      });

      const url = "http://localhost:8000/api/v1/reviews";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: review,
          rating: rating,
          conducteur: conducteurId,
          user: userId,
        }),
      });

      console.log(res);
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
});
