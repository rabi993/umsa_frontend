const API_URL = "http://127.0.0.1:8000/people/"; // Base URL for your API

// Fetch and display the people list
function fetchPeople() {
    axios.get(`${API_URL}list/`)
        .then(response => {
            const people = response.data;
            const tableBody = document.getElementById('peopleTable');
            tableBody.innerHTML = ''; // Clear the table
            people.forEach((person, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${person.user}</td>
                        <td>${person.mobile_no}</td>
                        <td>${person.blood_group || 'N/A'}</td>
                        <td>${person.designation || 'N/A'}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="showEditModal(${person.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deletePerson(${person.id})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(error => console.error("Error fetching people:", error));
}

// Show Add Modal
function showAddModal() {
    document.getElementById('modalTitle').textContent = "Add New Person";
    document.getElementById('peopleForm').reset();
    document.getElementById('saveButton').onclick = () => savePerson();
    const modal = new bootstrap.Modal(document.getElementById('peopleModal'));
    modal.show();
}

// Show Edit Modal
function showEditModal(id) {
    axios.get(`${API_URL}${id}/`)
        .then(response => {
            const person = response.data;
            document.getElementById('mobile_no').value = person.mobile_no;
            document.getElementById('blood_group').value = person.blood_group;
            document.getElementById('designation').value = person.designation;
            document.getElementById('modalTitle').textContent = "Edit Person";
            document.getElementById('saveButton').onclick = () => savePerson(id);
            const modal = new bootstrap.Modal(document.getElementById('peopleModal'));
            modal.show();
        })
        .catch(error => console.error("Error fetching person:", error));
}

// Save (Add or Update) Person
function savePerson(id = null) {
    const mobile_no = document.getElementById('mobile_no').value;
    const blood_group = document.getElementById('blood_group').value;
    const designation = document.getElementById('designation').value;

    const data = { mobile_no, blood_group, designation };

    if (id) {
        // Update existing person
        axios.put(`${API_URL}${id}/`, data)
            .then(() => {
                fetchPeople();
                const modal = bootstrap.Modal.getInstance(document.getElementById('peopleModal'));
                modal.hide();
            })
            .catch(error => console.error("Error updating person:", error));
    } else {
        // Add new person
        axios.post(`${API_URL}list/`, data)
            .then(() => {
                fetchPeople();
                const modal = bootstrap.Modal.getInstance(document.getElementById('peopleModal'));
                modal.hide();
            })
            .catch(error => console.error("Error adding person:", error));
    }
}

// Delete Person
function deletePerson(id) {
    if (confirm("Are you sure you want to delete this person?")) {
        axios.delete(`${API_URL}${id}/`)
            .then(() => fetchPeople())
            .catch(error => console.error("Error deleting person:", error));
    }
}

// Initialize
fetchPeople();
