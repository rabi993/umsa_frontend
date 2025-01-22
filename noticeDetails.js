
const getparams = () => {
  const postId = new URLSearchParams(window.location.search).get("noticeId");

  if (!postId) {
    alert("Missing post ID in URL.");
    return;
  }

  // Fetch post details and comments
  fetch(`http://127.0.0.1:8000/notice/list/${postId}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data))
    .catch((err) => console.error("Error fetching post details:", err));

  fetch(`http://127.0.0.1:8000/notice/comments/?notice_id=${postId}`)
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
      const userRes = await fetch(`http://127.0.0.1:8000/users/${review.commentor}`);
      const userData = await userRes.json();
      const fullName = `${userData.first_name || "Admin"} ${userData.last_name || "User"}`;

      // Create review card
      const div = document.createElement("div");
      div.classList.add("review-card");
      div.innerHTML = `
        <h4>${fullName}</h4>
        <p>${review.body.slice(0, 100)}</p>
        <h6>${new Date(review.created).toLocaleString()}</h6>
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
    "py-3",
    "gap-5",
    "d-flex",
    "justify-content-center"
  );
  div.innerHTML = `
    <div class="flower-img img-fluid col-md-4 col-lg-4">
      <img class="hov" src="${flower.file}" alt="Flower Image" />
    </div>
    <div class="doc-info col-md-4 col-lg-4 py-4 px-4">
      <h4>${flower.name}</h4>
      
      <h6>Created at: ${flower.created_at}</h6>
      <h6>Author: ${flower.user}</h6>
      <p>${flower.description}</p>
    </div>
  `;
  parent.appendChild(div);
};

const handleReviewSubmission = (event) => {
  event.preventDefault();

  const userId = localStorage.getItem("user_id");
  const postId = new URLSearchParams(window.location.search).get("noticeId");

  if (!userId || !postId) {
    alert("Missing user or post information.");
    return;
  }

  const reviewBody = document.getElementById("reviewBody").value;

  fetch("http://127.0.0.1:8000/notice/comments/", {
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
      fetch(`http://127.0.0.1:8000/notice/comments/?notice_id=${postId}`)
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
//       const buyerResponse = await fetch(`http://127.0.0.1:8000/users/${review.commentor}`);
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

//   fetch(`http://127.0.0.1:8000/post/reviews/${reviewId}/`, {
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



