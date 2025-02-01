
document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem('user_id'); // Get the user ID from local storage
    const apiUrl = `https://club-1-6len.onrender.com/users/${userId}`; // Correctly interpolate the userId into the URL
    const cardContainer = document.getElementById("user-card-container");

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((user) => {
        // Create the card element
        const card = document.createElement("div");
        card.className = "card p-3 shadow-lg";
        card.style.width = "30rem";

        // Populate the card with user details
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title text-center">${user.first_name || "N/A"} ${user.last_name || "N/A"}'s Profile</h5>
            <div class="card-text w-50 m-auto">           
              <img src="./images/man.jpg" alt="Admin Image" class="img-fluid rounded mt-2" style="max-height: 200px;">                          
            </div>
            <h5 class="card-title text-center">Admin Details</h5>
            <p class="card-text"><strong>ID:</strong> ${user.id}</p>
            <p class="card-text"><strong>Username:</strong> ${user.username}</p>
            <p class="card-text"><strong>First Name:</strong> ${user.first_name || "N/A"}</p>
            <p class="card-text"><strong>Last Name:</strong> ${user.last_name || "N/A"}</p>
            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
            <p class="card-text"><strong>Is Superuser:</strong> ${user.is_superuser ? "Yes" : "No"}</p>
            <div class="d-flex justify-content-center gap-3 my-3">
                  
                  <a target="" class="text-white text-decoration-none btn btc border rounded p-2" href="changepassAdmin.html">Change Password</a>
                  <a target="" class="text-white text-decoration-none btn btc border rounded p-2" href="updateProfileAdmin.html">Update Your Profile</a>
                  
            </div>
          </div>
        `;

        // Append the card to the container
        cardContainer.appendChild(card);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load user details.";
        cardContainer.appendChild(errorMessage);
      });
});

