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
                                    <td>${person.varsity || "N/A"}</td>
                                    <td>${person.union || "N/A"}</td>
                                    <td>${person.word || "N/A"}</td>
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
                                        <div class="d-flex gap-1">
                                            <div>
                                                <a class="btn btc text-white btn-sm" href="userProfileAdmin.html?personId=${person.id}" target="_blank">Profile</a>
                                            </div>
                                            <div>
                                                <button class="btn btc text-white btn-sm" onclick="deletePerson(${person.id})">Delete</button>
                                            </div>
                                        </div>
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

// Delete Person
function deletePerson(id) {
    if (confirm("Are you sure you want to delete this person?")) {
        axios
            .delete(`${API_URL}${id}/`)
            .then(() => {
                alert("Person deleted successfully.");
                fetchPeople(); // Refresh the list
            })
            .catch((error) => {
                console.error("Error deleting person:", error);
                alert("Failed to delete person. Please try again.");
            });
    }
}

// Initialize
// fetchPeople();
const userId = localStorage.getItem("user_id");
    
        if (!userId) {
            alert('Please log in first.');
            window.location.href = '/login.html';
        } else {
            (async function verifyAdmin() {
                try {
                    const response = await fetch(`https://club-1-6len.onrender.com/users/${userId}`);
                    const user = await response.json();

                    if (user.is_superuser) {
                        fetchPeople();
                    } else {
                        alert('Please log in as Admin.');
                        window.location.href = '/login.html';
                    }
                } catch (error) {
                    console.error('Error verifying admin:', error);
                    alert('Failed to verify admin. Please try again.');
                }
            })();
        }
