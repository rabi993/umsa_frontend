
const getparams = () => {
  const postId = new URLSearchParams(window.location.search).get("postId");

  if (!postId) {
    alert("Missing post ID in URL.");
    return;
  }

  // Fetch post details and comments
  fetch(`https://club-1-6len.onrender.com/post/list/${postId}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data))
    .catch((err) => console.error("Error fetching post details:", err));

  fetch(`https://club-1-6len.onrender.com/post/comments/?post_id=${postId}`)
    .then((res) => res.json())
    .then((data) => flowerReview(data))
    .catch((err) => console.error("Error fetching comments:", err));
};

const flowerReview = async (reviews) => {
  const parent = document.getElementById("flower-details-review");
  parent.innerHTML = ""; // Clear existing reviews

  for (const review of reviews) {
    try {
      // Fetch user details
      const userRes = await fetch(`https://club-1-6len.onrender.com/users/${review.commentor}`);
      const userData = await userRes.json();
      const fullName = `${userData.first_name || "Admin"} ${userData.last_name || "User"}`;

      // Create review card
      const div = document.createElement("div");
      div.classList.add("review-card","px-3");
      div.innerHTML = `
        <h6 style="padding-top:15px;">${fullName} <small style="font-size:10px;">${new Date(review.created).toLocaleString()}</small></h6> 
        <hr/>
        
        <p style="font-size:14px; padding-top:5px;">${review.body.slice(0, 100)}</p>
      `;
      parent.appendChild(div);
    } catch (error) {
      console.error("Error processing review:", error);
    }
  }
};

const displayDetails = (flower) => {
  const parent = document.getElementById("flower-details");
  parent.innerHTML = ""; // Clear existing content

  const div = document.createElement("div");
  div.classList.add(
    "flower-details-container",
    "row",
    "gap-5",
    "d-flex",
    "justify-content-center"
  );
  div.innerHTML = `
    <div class="flower-img img-fluid col-md-6 col-lg-6">
      <img class="" src="${flower.image}" alt="Flower Image" />
    </div>
    <div class="doc-info col-md-4 col-lg-4  px-4">
      <h5>${flower.title}</h5>
      ${flower.category
        .map((item) => `<b class=" text-black btn-sm">${item}</b>`)
        .join("")}
      <h6>Created at: ${flower.created_at}</h6>
      <h6>Author: ${flower.user}</h6>
      <p>${flower.content}</p>
      <button  class="btn btc text-white"data-bs-toggle="modal" data-bs-target="#exampleModal1">Write Comment</button>
    </div>
  `;
  parent.appendChild(div);
};

const handleReviewSubmission = (event) => {
  event.preventDefault();

  const userId = localStorage.getItem("user_id");
  const postId = new URLSearchParams(window.location.search).get("postId");

  if (!userId || !postId) {
    alert("Missing user or post information.");
    return;
  }

  const reviewBody = document.getElementById("reviewBody").value;

  fetch("https://club-1-6len.onrender.com/post/comments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentor: userId,
      post: postId,
      body: reviewBody,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      return response.json();
    })
    .then(() => {
      alert("Review submitted successfully!");
      document.getElementById("review-form").reset();
      fetch(`https://club-1-6len.onrender.com/post/comments/?post_id=${postId}`)
        .then((res) => res.json())
        .then((data) => flowerReview(data));
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      alert("Failed to submit your review. Please try again.");
    });
};

// Initialize page
document.addEventListener("DOMContentLoaded", getparams);



// const flowerReview = async (reviews) => {
//   const parent = document.getElementById("flower-details-review");

//   for (const review of reviews) {
//     try {
//       // Fetch user data
//       const buyerResponse = await fetch(`https://club-1-6len.onrender.com/users/${review.commentor}`);
//       const userData = await buyerResponse.json();
//       const fullName = `${userData.first_name || "admin"} ${userData.last_name || "islam"}`;

//       // Create and append the review card
//       const div = document.createElement("div");
//       div.classList.add("review-card");
//       div.innerHTML = `
//         <div>
//           <h4>${fullName}</h4>
//           <p id="review-body-${review.id}">${review.body.slice(0, 100)}</p>
//           <small>${review.created}</small>
//           <button class="btn btn-sm btn-warning edit-btn" data-review-id="${review.id}">Edit</button>
//         </div>
//       `;
//       parent.appendChild(div);
//     } catch (error) {
//       console.error("Error processing review:", error);
//     }
//   }

//   // Add event listeners to edit buttons
//   const editButtons = document.querySelectorAll(".edit-btn");
//   editButtons.forEach((button) =>
//     button.addEventListener("click", (event) => handleEditReview(event))
//   );
// };

// const handleEditReview = (event) => {
//   const reviewId = event.target.dataset.reviewId;
//   const reviewBodyElement = document.getElementById(`review-body-${reviewId}`);
//   const originalContent = reviewBodyElement.textContent;

//   // Replace text with an editable input field
//   reviewBodyElement.innerHTML = `
//     <textarea id="edit-review-${reviewId}" class="form-control">${originalContent}</textarea>
//     <button class="btn btn-sm btn-success save-btn" data-review-id="${reviewId}">Save</button>
//     <button class="btn btn-sm btn-secondary cancel-btn" data-review-id="${reviewId}">Cancel</button>
//   `;

//   // Add event listeners for Save and Cancel
//   document
//     .querySelector(`.save-btn[data-review-id="${reviewId}"]`)
//     .addEventListener("click", () => saveEditedReview(reviewId));
//   document
//     .querySelector(`.cancel-btn[data-review-id="${reviewId}"]`)
//     .addEventListener("click", () => cancelEdit(reviewId, originalContent));
// };

// const saveEditedReview = (reviewId) => {
//   const editedReview = document.getElementById(`edit-review-${reviewId}`).value;

//   fetch(`https://club-1-6len.onrender.com/post/reviews/${reviewId}/`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ body: editedReview }),
//   })
//     .then((response) => {
//       if (!response.ok) throw new Error("Failed to save review");
//       return response.json();
//     })
//     .then(() => {
//       // Update the review body in the DOM
//       const reviewBodyElement = document.getElementById(`review-body-${reviewId}`);
//       reviewBodyElement.innerHTML = editedReview;
//       alert("Review updated successfully!");
//     })
//     .catch((error) => {
//       console.error(error);
//       alert("Error saving review. Please try again later.");
//     });
// };

// const cancelEdit = (reviewId, originalContent) => {
//   const reviewBodyElement = document.getElementById(`review-body-${reviewId}`);
//   reviewBodyElement.innerHTML = originalContent; // Revert to the original content
// };


const loadFlowers = (search = "") => {
  const flowersContainer = document.getElementById("flowers");
  const spinner = document.getElementById("spinner");
  const noData = document.getElementById("nodata");

  flowersContainer.innerHTML = "";
  spinner.style.display = "block";
  noData.style.display = "none";

  const url = `https://club-1-6len.onrender.com/post/list/?search=${search}`;
  console.log("Fetching data from:", url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      spinner.style.display = "none";
      if (data.results && data.results.length > 0) {
        displayFlowers(data.results);
      } else {
        noData.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error fetching flowers:", error);
      spinner.style.display = "none";
      noData.style.display = "block";
    });
};


  
  const displayFlowers = (flowers) => {
    // Sort flowers array by id in descending order
    const sortedflowers = flowers.sort((a, b) => b.id - a.id);

    const flowersContainer = document.getElementById("flowers");
    flowersContainer.innerHTML = ""; // Clear previous content if any
  
    // sortedflowers.forEach((flower, index) => {
      
      
      
    //   const div = document.createElement("div");
    //   div.classList.add("flower-card", "col-12", "col-md-6", "col-lg-4");
    //   div.innerHTML = `
    //     <img class="flow-img" src="${flower.image}" alt="${flower.title}" />
        
        
        
    //     <h4>${flower.title}</h4>
    //     <small style="color: grey; margin: 0px;font-size:10px;">Author : ${flower.user}</small>
    //     <p style="color: grey; margin: 0px;">Created at ${flower.created_at}</p>
    //     <div>${flower.category.map((item) => `<button class="btn btn-info rounded btn-sm ">${item}</button>`).join("")}</div>
        
    //     <p style="color: grey; margin: 0px;">${flower.content.slice(0, 50)}...</p>
        
        
    //     <a style="text-decoration: none; " class="btn btn-success rounded  mt-1" href="postDetails.html?postId=${flower.id}">Details</a>
          
        
    //   `;
    //   flowersContainer.appendChild(div);
    // });
    sortedflowers.forEach((flower, index) => {
      const userApiUrl = `https://club-1-6len.onrender.com/users/`;
    
      // Create a div for each flower card first
      const div = document.createElement("div");
      div.classList.add("short-card","px-3");
    
      // Fetch user data for the flower's author
      fetch(userApiUrl)
        .then((userResponse) => {
          if (!userResponse.ok) {
            throw new Error("Error fetching user data");
          }
          return userResponse.json();
        })
        .then((users) => {
          // Find the associated user
          const user = users.find((u) => u.username === flower.user);
    
          if (user) {
            const fullName = `${user.first_name} ${user.last_name}`;
    
            // Now we can safely add the full name and other details to the card
            div.innerHTML = `
              <a style="text-decoration: none; color:black;" href="postDetails.html?postId=${flower.id}">
              <img class="mt-2  img-fluid" src="${flower.image}" alt="${flower.title}" />
              <h6>${flower.title}</h6>
              <p style="color: black; margin: 0px; font-size:15px;">${fullName}  <small style="color: grey; margin: 0px; font-size:10px;"> ${formatDateTime(flower.created_at)}</small> ${flower.category.map((item) => `${item}`).join("")}</p>
              <div>
                
              </div>
              </a>
            `;
          } else {
            console.error("No matching user found for the person.");
          }
    
          // Append the flower card to the container after the fullName is set
          flowersContainer.appendChild(div);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    });
    
  };
  

  
  const loadCategory = () => {
    fetch("https://club-1-6len.onrender.com/category/")
      .then((res) => res.json())
      .then((data) => {
        const parent = document.getElementById("drop-cat");
        parent.innerHTML = ""; // Clear previous items
        data.forEach((item) => {
          const li = document.createElement("li");
          li.classList.add("dropdown-item");
          li.innerHTML = `<button style="width:75%; " class="btn ms-auto text-start text-black " onclick="loadFlowers('${item.name}')">🟩 ${item.name}</button>`;
          parent.appendChild(li);
        });
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };
  
  
  const handleSearch = () => {
    const value = document.getElementById("search").value.trim();
    loadFlowers(value);
  };
  
  // Load initial data on page load
  document.addEventListener("DOMContentLoaded", () => {
    loadFlowers();
    loadCategory();
  });

  function formatDateTime(dateTimeString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  }

