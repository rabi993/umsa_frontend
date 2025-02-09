const fetchPosts = () => {
  const postsList = document.getElementById("posts-list");
  postsList.innerHTML = `<tr><td colspan="7">Loading posts...</td></tr>`;

  fetch("https://club-wine.vercel.app/event/list/")
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
          row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.name}</td>
            <td>${post.user || "Anonymous"}</td>
            <td>${post.description}</td>
            <td><img src="${post.image}" alt="Post Image" style="width: 70px; height: 70px;"></td>
            <td>${new Date(post.held_on).toLocaleString()}</td>
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
    .catch((error) => {
      console.error("Error fetching posts:", error);
      postsList.innerHTML = `<tr><td colspan="7">Error loading posts.</td></tr>`;
    });
};

const handleAddPost = async (event) => {
event.preventDefault();
const formMessage = document.getElementById("form-message");
formMessage.textContent = "";

const user = document.getElementById("postOwner").value.trim();
const title = document.getElementById("postTitle").value.trim();
const content = document.getElementById("postContent").value.trim();
const heldOn = document.getElementById("held_on").value.trim();
const imageFile = document.getElementById("postImage").files[0];

if (!user || !title || !content || !heldOn || !imageFile) {
    alert("All fields are required.");
    return;
}

try {
    const imgbbAPIKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your actual API key
    const formData = new FormData();
    formData.append("image", imageFile);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: formData,
    });

    if (!imgbbResponse.ok) {
        throw new Error("Failed to upload image.");
    }

    const imgbbData = await imgbbResponse.json();
    const imageUrl = imgbbData.data.url;

    const postData = { user, name: title, description: content, held_on: heldOn, image: imageUrl };
    const response = await fetch("https://club-wine.vercel.app/event/list/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        throw new Error("Failed to add post.");
    }

    alert("Post added successfully!");
    document.getElementById("post_form").reset();
    fetchPosts();
} catch (error) {
    console.error("Error adding post:", error);
    formMessage.textContent = `Error: ${error.message}`;
}
};

const handleEditPost = (post) => {
document.getElementById("postTitle").value = post.name;
document.getElementById("postContent").value = post.description;
document.getElementById("held_on").value = new Date(post.held_on).toISOString().slice(0, 16);

document.getElementById("post_form").onsubmit = async (event) => {
    event.preventDefault();
    try {
        const imgbbAPIKey = "6b0c007afbf8da08520a75fb493991aa"; 
        const fileInput = document.getElementById("postImage");
        let imageUrl = post.image;
  
        if (fileInput.files.length > 0) {
          const imgbbFormData = new FormData();
          imgbbFormData.append("image", fileInput.files[0]);
  
          const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: "POST",
            body: imgbbFormData,
          });
  
          if (!imgbbResponse.ok) {
            throw new Error("Failed to upload image to imgbb.");
          }
  
          const imgbbData = await imgbbResponse.json();
          imageUrl = imgbbData.data.url;
        }
        const updatedPost = {
            name: document.getElementById("postTitle").value.trim(),
            description: document.getElementById("postContent").value.trim(),
            held_on: document.getElementById("held_on").value.trim(),
            // image: post.image , // Reuse existing image URL
            image: imageUrl , 
        };

        const response = await fetch(`https://club-wine.vercel.app/event/list/${post.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
            throw new Error("Failed to update post.");
        }

        alert("Post updated successfully!");
        fetchPosts();
    } catch (error) {
        console.error("Error updating post:", error);
        alert(`Error: ${error.message}`);
    }
};
};

const handleDeletePost = (id) => {
if (confirm("Are you sure you want to delete this post?")) {
    fetch(`https://club-wine.vercel.app/event/list/${id}/`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete post.");
            alert("Post deleted successfully!");
            fetchPosts();
        })
        .catch(error => {
            console.error("Error deleting post:", error);
            alert("Error deleting post.");
        });
}
};

// Fetch and set post owner on page load
document.addEventListener("DOMContentLoaded", () => {
const userId = localStorage.getItem("user_id");
fetch(`https://club-wine.vercel.app/users/${userId}/`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("postOwner").value = data.username || "Anonymous";
    })
    .catch(() => alert("Failed to fetch user details."));
fetchPosts();
});