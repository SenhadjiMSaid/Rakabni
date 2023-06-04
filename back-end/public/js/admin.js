function displayallusers(data, resultatt) {
  const usern = document.querySelector(".user-row");
  for (let i = 0; i < resultatt; i++) {
    const userr = data.data.data[i];
    const user = {
      id: userr.id,
      name: userr.name,
      email: userr.email,
      active: userr.active,
    };

    const affiche = `
      <td class="user-id">${user.id}</td>
      <td class="user-name">${user.name}</td>
      <td class="user-lastname">${user.active}</td>
      <td class="user-username">${user.email}</td>
      <td>
        <button class="ban-button" data-user-id="${user.id}">Ban</button>
        <button class="delete-button" data-user-id="${user.id}">Supprimer</button>
      </td>
    `;
    usern.insertAdjacentHTML("beforebegin", affiche);
  }

  // Ajouter un écouteur d'événement pour les boutons "Ban"
  const banButtons = document.querySelectorAll(".ban-button");
  banButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.userId;
      banUser(userId);
    });
  });
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.userId;
      deleteUser(userId);
    });
  });
}

async function banUser(userId) {
  const url = `http://localhost:8000/api/v1/users/ban/${userId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Utilisateur avec ID ${userId} banni avec succès`);
      // Mettre à jour l'état de l'utilisateur dans l'interface
      const userStatus = document.querySelector(
        `.user-lastname[data-user-id="${userId}"]`
      );
      if (userStatus) {
        userStatus.textContent = "Banni";
      }
      location.reload();
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error banning user:", error);
  }
}

async function deleteUser(userId) {
  const url = `http://localhost:8000/api/v1/users/${userId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Utilisateur avec ID ${userId} supprimé avec succès`);
      const userRow = document.querySelector(
        `.user-row[data-user-id="${userId}"]`
      );
      if (userRow) {
        userRow.remove();
      }
      location.reload();
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const url = "http://localhost:8000/api/v1/users";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const resultatt = data.results;
      console.log(resultatt);
      displayallusers(data, resultatt);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
