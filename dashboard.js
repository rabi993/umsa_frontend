
// Fetch and display user and people data in a card
document.addEventListener("DOMContentLoaded", function () {
const userId = localStorage.getItem('user_id'); // Get the user ID from local storage

// Fetch the list of people and find the relevant person for the user
fetch("http://127.0.0.1:8000/people/list/")
    .then((response) => {
    if (!response.ok) {
        throw new Error("Error fetching people list");
    }
    return response.json();
    })
    .then((peoples) => {
    const person = peoples.find((p) => p.user == userId);
    localStorage.setItem("people_id", person.id);
    if (!person) {
        throw new Error("No associated person found for the user");
    }
    return person;
    })
    .then((person) => {
    const userApiUrl = `http://127.0.0.1:8000/users/${userId}`;
    const peopleApiUrl = `http://127.0.0.1:8000/people/list/${person.id}`;
    const cardContainer = document.getElementById("user-card-container");

    // Fetch user and people data in parallel
    Promise.all([fetch(userApiUrl), fetch(peopleApiUrl)])
        .then(async ([userResponse, peopleResponse]) => {
        if (!userResponse.ok || !peopleResponse.ok) {
            throw new Error("Error fetching user or people data");
        }
        const user = await userResponse.json();
        const people = await peopleResponse.json();

        // Create the card element
        const card = document.createElement("div");
        card.className = "card p-3 shadow-lg";
        // card.style.width = "25rem";

        // Populate the card with user and people details
        card.innerHTML = `
            <div class="card-body">
            <h5 class="card-title fs-1 pb-3 text-center">${user.first_name || "N/A"} ${user.last_name || "N/A"}'s Profile</h5>
            <hr/>
            <div class="d-flex flex-wrap justify-content-around">
                <div class="col-12 col-md-4 col-lg-4">
                <div class="card-text w-100 m-auto">
                    ${
                    people.image
                        ? `<img src="${people.image}" alt="Profile Image" class="img-fluid rounded mt-2" style="max-height: 100px;">`
                        : "<p class='text-muted'>No image available</p>"
                    }
                </div>
                <h6 class="mt-3">User Details:</h6>
                <p class="card-text"><strong>ID:</strong> ${user.id}</p>
                <p class="card-text"><strong>Username:</strong> ${user.username}</p>
                <p class="card-text"><strong>First Name:</strong> ${user.first_name || "N/A"}</p>
                <p class="card-text"><strong>Last Name:</strong> ${user.last_name || "N/A"}</p>
                <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                <p class="card-text"><strong>Role:</strong> ${user.is_superuser ? "Admin/Superuser" : "User"}</p>
                </div>

                <div class="col-12 col-md-4 col-lg-4">
                <h6 class="mt-3">Profile Details:</h6>
                <p class="card-text"><strong>Profile ID:</strong> ${people.id}</p>
                <p class="card-text"><strong>Mobile:</strong> ${people.mobile_no || "N/A"}</p>
                <p class="card-text"><strong>Village:</strong> ${people.village || "N/A"}</p>
                <p class="card-text"><strong>Union:</strong> ${people.union || "N/A"}</p>
                <p class="card-text"><strong>Ward:</strong> ${people.word || "N/A"}</p>
                <p class="card-text"><strong>City:</strong> ${people.livesIn || "N/A"}</p>
                <p class="card-text"><strong>Marital Status:</strong> ${people.marital_status || "N/A"}</p>
                <p class="card-text"><strong>Job Title:</strong> ${people.designation || "N/A"}</p>
                <p class="card-text"><strong>Works At:</strong> ${people.worksat || "N/A"}</p>

                
                </div>

                <div class="col-12 col-md-4 col-lg-4">
                <p class="card-text"><strong>Date of Birth:</strong> ${people.birth_date || "N/A"}</p>
                <p class="card-text"><strong>Blood Group:</strong> ${people.blood_group || "N/A"}</p>
                <p class="card-text"><strong>Last Donation:</strong> ${people.last_blood_donate_date || "N/A"}</p>
                <p class="card-text"><strong>Next Eligible Donation:</strong> ${people.available_for_donate_date || "N/A"}</p>
                <p class="card-text"><strong>University:</strong> ${people.varsity || "N/A"}</p>
                <p class="card-text"><strong>Subject:</strong> ${people.subject || "N/A"}</p>
                <p class="card-text"><strong>Session:</strong> ${people.session || "N/A"}</p>
                <p class="card-text"><strong>Edu Complete:</strong> ${people.complete ? "Yes" : "No"}</p>
                <p class="card-text"><strong>CV:</strong> <a href="${people.cv}" target="_blank">Download CV</a></p>
                <p class="card-text"><strong>Association Post:</strong> ${people.association_post || "N/A"}</p>
                </div>
            </div>
            <hr/>

            
            </div>

        `;

        // Append the card to the container
        cardContainer.appendChild(card);
        })
        .catch((error) => {
        console.error("Error fetching user or people details:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load user or people details.";
        cardContainer.appendChild(errorMessage);
        });
    })
    .catch((error) => {
    console.error("Error finding person for user:", error);
    });
});


const apiUrl = "http://127.0.0.1:8000/transaction/";
const apiUrlUser = "http://127.0.0.1:8000/users/";


function fetchTransactions1() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#myTransactionTable tbody");
            tableBody.innerHTML = ""; // Clear table

            // Get the logged-in user ID from localStorage
            const loggedInUserId = localStorage.getItem("user_id");
            console.log("Logged-in user ID:", loggedInUserId);

            // Check if loggedInUserId exists
            if (!loggedInUserId) {
                console.error("No logged-in user found!");
                return;
            }

            let userFound = false;

            // Iterate over the transactions
            data.forEach(transaction => {
                // Adjust this based on the structure of the 'user' field
                const transactionUserId = transaction.user.id || transaction.user;
                

                if (transactionUserId === parseInt(loggedInUserId)) {
                    userFound = true;

                    fetch(`${apiUrlUser}${transaction.user}/`)
                        .then(response => response.json())
                        .then(user => {
                            // Extract username and fullname
                            const username = user.username || "N/A";
                            const first_name = user.first_name || "N/A";
                            const last_name = user.last_name || "N/A";

                            // Create a row for the transaction
                            const row = `
                                <tr>
                                    <td>${transaction.id}</td>
                                    <td>${transaction.trx_id}</td>
                                    <td>${first_name} ${last_name}</td>
                                    <td>${transaction.reference || ''}</td>
                                    <td>${transaction.amount}</td>
                                    <td>${transaction.typys}</td>
                                    <td>${transaction.source_people || ''}</td>
                                    <td>${transaction.media || ''}</td>
                                    <td>${transaction.purpose || ''}</td>
                                    <td>${transaction.comment || ''}</td>
                                    <td>${formatDate(transaction.created_at) || ''}</td>
                                    <td>${formatDate(transaction.updated_at) || ''}</td>
                                    <td>${transaction.approved ? "Yes" : "No"}</td>
                                </tr>
                            `;

                            // Append the row to the table
                            tableBody.insertAdjacentHTML("beforeend", row);
                        })
                        .catch(error => {
                            console.error(`Error fetching user details for user ID ${transaction.user}:`, error);
                        });                                                       
                }
            });

            if (!userFound) {
                tableBody.innerHTML = `<tr><td colspan="13">No transactions found for your account.</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Error fetching transactions:", error);
        });
}


// Initial fetch

fetchTransactions1();


function formatDate(timestamp) {
    if (!timestamp) return ''; // Handle empty or null values

    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];

    // Combine the date and time
    return `${formattedDate} ${hours}:${formattedMinutes} ${ampm}`;
  }