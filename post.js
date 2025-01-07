const apiUrl = "http://127.0.0.1:8000/post/list/";

// Fetch and display posts
function fetchPosts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#post-table tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.results.forEach(post => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.content}</td>
                    <td><img src="${post.image}" alt="Post Image" width="100"></td>
                    <td>${post.category.join(", ")}</td>
                    <td>
                        <button onclick="editPost(${post.id})">Edit</button>
                        <button onclick="deletePost(${post.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Add a new post
document.getElementById("post-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value.split(",").map(c => c.trim());

    const postData = {
        title,
        content,
        image,
        category
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (response.ok) {
                fetchPosts();
                document.getElementById("post-form").reset();
            } else {
                return response.json().then(err => {
                    console.error("Error adding post:", err);
                    alert("Failed to add post. Check console for details.");
                });
            }
        })
        .catch(error => console.error("Error adding post:", error));
});

// Edit a post
function editPost(id) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    const newImage = prompt("Enter new image URL:");
    const newCategory = prompt("Enter new categories (comma-separated):").split(",").map(c => c.trim());

    const postData = {
        title: newTitle,
        content: newContent,
        image: newImage,
        category: newCategory
    };

    fetch(`${apiUrl}${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (response.ok) {
                fetchPosts();
            } else {
                return response.json().then(err => {
                    console.error("Error editing post:", err);
                    alert("Failed to edit post. Check console for details.");
                });
            }
        })
        .catch(error => console.error("Error editing post:", error));
}

// Delete a post
function deletePost(id) {
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(`${apiUrl}${id}/`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    fetchPosts();
                } else {
                    alert("Failed to delete post.");
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    }
}

// Load posts on page load
fetchPosts();
