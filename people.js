const API_URL = "https://club-1-6len.onrender.com/people/";
const userAPI_URL = "https://club-1-6len.onrender.com/users/";

// Fetch users and filter people based on user ID
function fetchPeople() {
    axios
        .get(userAPI_URL) // Fetch users
        .then((userResponse) => {
            const users = userResponse.data; // List of users

            axios
                .get(`${API_URL}list/`) // Fetch people
                .then((peopleResponse) => {
                    const people = peopleResponse.data;
                    const tableBody = document.getElementById("peopleTable");
                    tableBody.innerHTML = ""; // Clear the table

                    people.forEach((person) => {
                        // Find the matching user by ID
                        const matchedUser = users.find((user) => user.id === person.user);

                        if (matchedUser) {
                            tableBody.innerHTML += `
                                <tr>
                                    <td>${matchedUser.id}</td>
                                    <td>${matchedUser.username || "N/A"}</td>
                                    <td>${matchedUser.first_name || "N/A"} ${matchedUser.last_name || ""}</td>
                                    <td>${matchedUser.email || "N/A"}</td>
                                    <td>${person.mobile_no || "N/A"}</td>
                                    <td>${person.village || "N/A"}</td>
                                    <td>${person.livesIn || "N/A"}</td>
                                    <td>${person.blood_group || "N/A"}</td>
                                    <td>${person.last_blood_donate_date || "N/A"}</td>
                                    <td>
                                        ${
                                          person.image
                                            ? `<img src="${person.image}" alt="Profile Image" class="img-fluid rounded" style="max-height: 50px;">`
                                            : "No Image"
                                        }
                                    </td>
                                    <td>
                                        <a class="btn btc btn-sm text-white" href="userProfile.html?personId=${person.id}" target="_blank">View Profile</a>

                                        
                                    </td>
                                </tr>
                            `;
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error fetching people:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });
}



// Initialize
fetchPeople();
