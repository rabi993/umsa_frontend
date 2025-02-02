
const fetchPosts = () => {
    const postsList = document.getElementById("posts-list");
    postsList.innerHTML = `<tr><td colspan="8" class="text-center">Loading posts...</td></tr>`;
  
    fetch("https://club-1-6len.onrender.com/post/list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        return response.json();
      })
      .then((data) => {
        const posts = data.results;
        postsList.innerHTML = ""; 
  
        if (posts.length === 0) {
          postsList.innerHTML = `
            <tr>
              <td colspan="6" class="text-center">No posts available.</td>
            </tr>`;
        } else {
          posts.forEach((post) => {
            const username= localStorage.getItem("username");

            const row = document.createElement("tr");
            if(username === post.user){
                row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.user}</td>
                <td>${post.title}</td>
                <td>${post.content}</td>
                <td><img style="height:70px; width:70px;" src="${post.image}" alt="${post.title}" style="width: 100px; height: 100px; object-fit: cover;"></td>
                <td>${post.category.join(", ")}</td>
                
                <td>
                    <div class ="d-flex ">
                    <button class="btn btc text-white" onclick='handleEditpost(${JSON.stringify(post)})'>Edit</button>
                    <button class="btn btc mx-3 text-white" onclick='handleDeletepost(${post.id})'>Delete</button>
                    </div>
                </td>
                `;
                postsList.appendChild(row);
            }
            // else {
            //     row.innerHTML = `
            //     <tr>
            //         <td colspan="8" class="text-center">No posts available thats you created.</td>
            //     </tr>`
            //     ;
            //     postsList.appendChild(row);
            // }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        postsList.innerHTML = `
          <tr>
            <td colspan="8" class="text-center text-danger">Error loading posts.</td>
          </tr>`;
      });
  };
  

  const fetchCategories = () => {
    fetch("https://club-1-6len.onrender.com/category/")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      })
      .then((data) => {
        const categorySelect = document.getElementById("postCategory");
        categorySelect.innerHTML = ""; // Clear previous options
        data.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.slug; // Use slug as the value
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };


  fetchCategories();

  document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("user_id"); 
    
    fetch(`https://club-1-6len.onrender.com/users/${userId}/`) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        return response.json();
      })
      .then((userData) => {
        const postOwnerInput = document.getElementById("postOwner");
        postOwnerInput.value = userData.username ;
      })
      .catch((error) => {
        console.error(error);
        // alert("Failed to retrieve user details.");
      });
  
    
  });
  const handleAddPost = async (event) => {
    event.preventDefault();
    const formMessage = document.getElementById("form-message");
    formMessage.innerHTML = "";

    const user = document.getElementById("postOwner").value.trim();
    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const image = document.getElementById("postImage").files[0];
    const category = Array.from(document.getElementById("postCategory").selectedOptions).map(option => option.value);
    
  
    if (!user || !title || !content || !image || !category.length) {
      alert("All fields are required.");
      return;
    }
  
    try {
      // Upload image to imgbb
      const imgbbAPIKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your actual API key
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", image);
  
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: imgbbFormData,
      });
  
      if (!imgbbResponse.ok) {
        throw new Error("Failed to upload image to imgbb.");
      }
  
      const imgbbData = await imgbbResponse.json();
      const imageUrl = imgbbData.data.url;
  
      // Prepare form data
      const postData = {
        user,
        title,
        content,
        image: imageUrl,
        category,
        
      };
  
      // Send post data to your backend
      const response = await fetch("https://club-1-6len.onrender.com/post/list/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add post.");
      }
  
      alert("post added successfully!");
      document.getElementById("post_form").reset();
      fetchPosts(); // Refresh the table
    } catch (error) {
      console.error("Error adding post:", error.message);
      formMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  };
  
  
  // Initial fetch to populate the table
  fetchPosts();


const handleEditpost = (post) => {
  document.getElementById("postTitle").value = post.title;
  document.getElementById("postContent").value = post.content;
 

  const categorySelect = document.getElementById("postCategory");
  Array.from(categorySelect.options).forEach(option => {
    option.selected = post.category.includes(option.value);
  });

  

  const postForm = document.getElementById("post_form");
  postForm.onsubmit = async (event) => {
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

      const updatedpost = {
        title: postForm.elements["postTitle"].value,
        content: postForm.elements["postContent"].value, 
        image: imageUrl,
        category: Array.from(categorySelect.selectedOptions).map(option => option.value),
      };

      const response = await fetch(`https://club-1-6len.onrender.com/post/list/${post.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedpost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update post.");
      }

      alert("post updated successfully!");
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error("Error updating post:", error.message);
      alert(`Error updating post: ${error.message}`);
    }
  };
};



  const handleDeletepost = (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`https://club-1-6len.onrender.com/post/list/${id}/`, {
        method: "DELETE",
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to delete post.");
          alert("post deleted successfully!");
          fetchPosts(); // Refresh the table
        })
        .catch(error => {
          console.error("Error deleting post:", error.message);
        });
    }
  };

  

  




