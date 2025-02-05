const fetchPosts = () => {
    const postsList = document.getElementById("posts-list");
    postsList.innerHTML = `<tr><td colspan="7">Loading posts...</td></tr>`;
    
    fetch("https://club-1-6len.onrender.com/notice/list/")
        .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }
        return response.json();
        })
        .then((data) => {
        const posts = data.results; // Extract the posts array from the results field
        postsList.innerHTML = "";
        if (posts.length === 0) {
            postsList.innerHTML = `<tr><td colspan="7">No posts available.</td></tr>`;
        } else {
            posts.forEach((post) => {
                    const row = document.createElement("tr");
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(post.file);
                    const isPDF = /\.pdf$/i.test(post.file);

                    row.innerHTML = `
                        <td>${post.id}</td>
                        <td>${post.name}</td>
                        <td>${post.user || "Anonymous"}</td>
                        <td>${post.description}</td>
                        <td>
                            ${isImage ? `<img src="${post.file}" alt="Notice File" class="file-preview img-fluid w-25 m-auto" style="height:50px;">` : 
                                isPDF ? `<a href="${post.file}" target="_blank">View PDF</a>` : 
                                `<a href="${post.file}" target="_blank">Download File</a>`}
                        </td>
                        <td>${new Date(post.created_at).toLocaleString()}</td>
                        <td>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn  text-white" onclick='handleEditPost(${JSON.stringify(post)})'>📝</button>
                            <button class="btn  text-white" onclick='handleDeletePost(${post.id})'>🗑️</button>
                        </div>
                        </td>
                    `;
                    postsList.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching notices:", error);
            postsList.innerHTML = `<tr><td colspan="7">Error loading notices.</td></tr>`;
        });
};

const handleAddPost = async (event) => {
    event.preventDefault();
    const formMessage = document.getElementById("form-message");
    formMessage.textContent = "";

    const user = document.getElementById("postOwner").value.trim();
    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const fileInput = document.getElementById("postFile").files[0];

    if (!user || !title || !content || !fileInput) {
        alert("All fields are required.");
        return;
    }

    try {
        const imgbbAPIKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your actual API key
        const formData = new FormData();
        formData.append("image", fileInput);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: "POST",
            body: formData,
        });

        if (!imgbbResponse.ok) throw new Error("Failed to upload file.");

        const imgbbData = await imgbbResponse.json();
        const fileUrl = imgbbData.data.url;

        const postData = { user, name: title, description: content, file: fileUrl };
        const response = await fetch("https://club-1-6len.onrender.com/notice/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (!response.ok) throw new Error("Failed to add notice.");

        alert("Notice added successfully!");
        document.getElementById("post_form").reset();
        fetchPosts();
    } catch (error) {
        console.error("Error adding notice:", error);
        formMessage.textContent = `Error: ${error.message}`;
    }
};



const handleEditPost = (post) => {
    // Populate the form with the selected post's data
    document.getElementById("postTitle").value = post.name;
    document.getElementById("postContent").value = post.description;

    // Add a preview of the current file if available
    const filePreviewContainer = document.getElementById("filePreviewContainer");
    if (!filePreviewContainer) {
        const previewDiv = document.createElement("div");
        previewDiv.id = "filePreviewContainer";
        document.getElementById("post_form").insertBefore(previewDiv, document.getElementById("postFile").parentNode);
    }
    document.getElementById("filePreviewContainer").innerHTML = `
        <p>Current File:</p>
        ${post.file.match(/\.(jpg|jpeg|png|gif)$/i) ? 
            `<img src="${post.file}" alt="Current File" class="file-preview">` :
            `<a href="${post.file}" target="_blank">Download Current File</a>`
        }
        <p><em>You can upload a new file to replace this one.</em></p>
    `;

    // Update the form's submission handler
    const postForm = document.getElementById("post_form");
    postForm.onsubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            const fileInput = document.getElementById("postFile");
            let fileUrl = post.file; // Default to the existing file URL

            // Check if a new file is selected
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append("image", file);

                // Upload the file to imgbb or another file hosting service
                const imgbbAPIKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your actual API key
                const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload the new file.");
                }

                const uploadData = await uploadResponse.json();
                fileUrl = uploadData.data.url; // Update with the uploaded file's URL
            }

            // Prepare the updated post data
            const updatedPost = {
                name: document.getElementById("postTitle").value.trim(),
                description: document.getElementById("postContent").value.trim(),
                file: fileUrl,
            };

            // Send the update request to the server with the existing post ID
            const response = await fetch(`https://club-1-6len.onrender.com/notice/${post.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPost),
            });

            if (!response.ok) {
                throw new Error("Failed to update the notice.");
            }

            alert("Notice updated successfully!");
            fetchPosts(); // Refresh the notice list
            postForm.onsubmit = handleAddPost; // Reset form to default behavior for adding posts
            postForm.reset(); // Clear the form
            document.getElementById("filePreviewContainer").innerHTML = ""; // Clear the preview
        } catch (error) {
            console.error("Error updating the post:", error);
            alert(`Error: ${error.message}`);
        }
    };
};




const handleDeletePost = (id) => {
    if (confirm("Are you sure you want to delete this notice?")) {
        fetch(`https://club-1-6len.onrender.com/notice/${id}/`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete notice.");
                alert("Notice deleted successfully!");
                fetchPosts();
            })
            .catch(error => {
                console.error("Error deleting notice:", error);
                alert("Error deleting notice.");
            });
    }
};

// Fetch and set post owner on page load
document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("user_id");
    fetch(`https://club-1-6len.onrender.com/users/${userId}/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("postOwner").value = data.username || "Anonymous";
        })
        .catch(() => alert("Failed to fetch user details."));
    fetchPosts();
});