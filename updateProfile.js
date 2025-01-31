// Fetch and display user and people data in a card
document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem('user_id'); // Get the user ID from local storage
    const peopleId = localStorage.getItem('people_id'); // Get the people ID from local storage
    const userApiUrl = `https://club-1-6len.onrender.com/users/${userId}`; // User API URL
    const peopleApiUrl = `https://club-1-6len.onrender.com/people/list/${peopleId}`; // people API URL
    const cardContainer = document.getElementById("user-card-container1");

    // Fetch user and people data in parallel
    Promise.all([fetch(userApiUrl), fetch(peopleApiUrl)])
      .then(async ([userResponse, peopleResponse]) => {
        if (!userResponse.ok || !peopleResponse.ok) {
          throw new Error("Error fetching data");
        }
        const user = await userResponse.json();
        const people = await peopleResponse.json();

        // Create the card element
        const card = document.createElement("div");
        card.className = "card p-3 shadow-lg";
        card.style.width = "25rem";

        // Populate the card with user and people details
        card.innerHTML = `
          <div class="card-body">
              <h5 class="card-title text-center">${user.first_name || "N/A"} ${user.last_name || "N/A"}'s Profile</h5>
              <div class="card-text w-25 m-auto">
                ${
                  people.image
                    ? `<img src="${people.image}" alt="Profile Image" class="img-fluid rounded mt-2" style="max-height: 200px;">`
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
              
              <h6 class="mt-3">Profile Details:</h6>
              <p class="card-text"><strong>Profile ID:</strong> ${people.id}</p>
              <p class="card-text"><strong>Mobile:</strong> ${people.mobile_no || "N/A"}</p>
              <p class="card-text"><strong>Village:</strong> ${people.village || "N/A"}</p>
              <p class="card-text"><strong>Union:</strong> ${people.union || "N/A"}</p>
              <p class="card-text"><strong>Ward:</strong> ${people.word || "N/A"}</p>
              <p class="card-text"><strong>City:</strong> ${people.livesIn || "N/A"}</p>
              <p class="card-text"><strong>Date of Birth:</strong> ${people.birth_date || "N/A"}</p>
              <p class="card-text"><strong>Blood Group:</strong> ${people.blood_group || "N/A"}</p>
              <p class="card-text"><strong>Last Donation:</strong> ${people.last_blood_donate_date || "N/A"}</p>
              <p class="card-text"><strong>Next Eligible Donation:</strong> ${people.available_for_donate_date || "N/A"}</p>
              <p class="card-text"><strong>Marital Status:</strong> ${people.marital_status || "N/A"}</p>
              <p class="card-text"><strong>Job Title:</strong> ${people.designation || "N/A"}</p>
              <p class="card-text"><strong>Works_at:</strong> ${people.worksat || "N/A"}</p>
              <p class="card-text"><strong>University:</strong> ${people.varsity || "N/A"}</p>
              <p class="card-text"><strong>Subject:</strong> ${people.subject || "N/A"}</p>
              <p class="card-text"><strong>Session:</strong> ${people.session || "N/A"}</p>
              <p class="card-text"><strong>Edu Complete:</strong> ${people.complete ? "Yes" : "No"}</p>
              <p class="card-text"><strong>CV:</strong> <a href="${people.cv}" target="_blank">Download CV</a></p>
              <p class="card-text"><strong>Association Post:</strong> ${people.association_post || "N/A"}</p>
            </div>
            
        `;

        // Append the card to the container
        cardContainer.appendChild(card);
      })
      .catch((error) => {
        console.error("Error fetching user or people data:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load user or people details.";
        cardContainer.appendChild(errorMessage);
      });
});


  
// document.addEventListener("DOMContentLoaded", function () {
//   const peopleId = localStorage.getItem("people_id");
//   const userId = localStorage.getItem("user_id");

//   const peopleApiUrl = `https://club-1-6len.onrender.com/people/list/${peopleId}/`;
//   const userApiUrl = `https://club-1-6len.onrender.com/users/${userId}/`;

//   const updateForm = document.getElementById("update-profile-form");

//   // Fetch and populate data
//   Promise.all([
//     fetch(userApiUrl).then((response) => response.json()),
//     fetch(peopleApiUrl).then((response) => response.json()),
//   ])
//     .then(([userData, peopleData]) => {
//       // Populate readonly fields
//       document.getElementById("id").value = userData.id;
//       document.getElementById("username").value = userData.username;
//       document.getElementById("email").value = userData.email;

//       // Populate editable fields
//       document.getElementById("first_name").value = userData.first_name || "";
//       document.getElementById("last_name").value = userData.last_name || "";
//       document.getElementById("mobile_no").value = peopleData.mobile_no || "";
//       document.getElementById("birth_date").value = peopleData.birth_date || "";
//       document.getElementById("union").value = peopleData.union || "";
//       document.getElementById("word").value = peopleData.word || "";
//       document.getElementById("village").value = peopleData.village || "";
//       document.getElementById("blood_group").value = peopleData.blood_group || "";
//       document.getElementById("last_blood_donate_date").value = peopleData.last_blood_donate_date || "";
//       document.getElementById("available_for_donate_date").value = peopleData.available_for_donate_date || "";
//       document.getElementById("gender").value = peopleData.gender || "";
//       document.getElementById("marital_status").value = peopleData.marital_status || "";
//       document.getElementById("designation").value = peopleData.designation || "";
//       document.getElementById("worksat").value = peopleData.worksat || "";
//       document.getElementById("livesIn").value = peopleData.livesIn || "";
//       document.getElementById("varsity").value = peopleData.varsity || "";
//       document.getElementById("session").value = peopleData.session || "";
//       document.getElementById("complete").value = peopleData.complete || "";
//       document.getElementById("subject").value = peopleData.subject || "";
//       document.getElementById("association_post").value = peopleData.association_post || "";
      
//       //CV file preview
//       const filePreview = document.getElementById("cv-preview");
//       filePreview.src = peopleData.cv || "https://via.placeholder.com/150";

//       // Profile image preview
//       const imagePreview = document.getElementById("profile-image-preview");
//       imagePreview.src = peopleData.image || "https://via.placeholder.com/150";
//     })
//     .catch((error) => console.error("Error fetching profile data:", error));

//   // Handle form submission
//   updateForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const formData = new FormData(updateForm);

//     // Update user data
//     const userData = {
//       first_name: formData.get("first_name"),
//       last_name: formData.get("last_name"),
//     };

//     // Update people data
//     const peopleData = {
//       mobile_no: formData.get("mobile_no"),
//       address: formData.get("address"),
//     };

//     // Handle image upload to imgbb if a new file is selected
//     const fileInput = formData.get("image");
//     const imgbbApiKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your imgbb API key
//     let imgbbUploadPromise = Promise.resolve(null);

//     if (fileInput && fileInput.size > 0) {
//       const imageFormData = new FormData();
//       imageFormData.append("image", fileInput);

//       imgbbUploadPromise = fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
//         method: "POST",
//         body: imageFormData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             return data.data.url; // Return the image URL
//           } else {
//             throw new Error("Image upload to imgbb failed");
//           }
//         });
//     }

//     // Send PATCH requests after handling the image upload
//     imgbbUploadPromise
//       .then((uploadedImageUrl) => {
//         if (uploadedImageUrl) {
//           peopleData.image = uploadedImageUrl;
//         }

//         return Promise.all([
//           fetch(userApiUrl, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(userData),
//           }),
//           fetch(peopleApiUrl, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(peopleData),
//           }),
//         ]);
//       })
//       .then((responses) => {
//         if (responses.some((response) => !response.ok)) {
//           throw new Error("Error updating profile");
//         }
//         return Promise.all(responses.map((response) => response.json()));
//       })
//       .then(() => {
//         document.getElementById("success-message").classList.remove("d-none");
//         document.getElementById("error-message").classList.add("d-none");
//         // Reload the page to reflect updated data
//         setTimeout(() => location.reload(), 1500);
//       })
//       .catch((error) => {
//         console.error(error);
//         document.getElementById("success-message").classList.add("d-none");
//         document.getElementById("error-message").classList.remove("d-none");
//       });
//   });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   const peopleId = localStorage.getItem("people_id");
//   const userId = localStorage.getItem("user_id");

//   const peopleApiUrl = `https://club-1-6len.onrender.com/people/list/${peopleId}/`;
//   const userApiUrl = `https://club-1-6len.onrender.com/users/${userId}/`;

//   const updateForm = document.getElementById("update-profile-form");

//   // Fetch data and populate form
//   Promise.all([
//     fetch(userApiUrl).then((response) => response.json()),
//     fetch(peopleApiUrl).then((response) => response.json()),
//   ])
//     .then(([userData, peopleData]) => {
//       // Fill the form with fetched data
//       document.getElementById("id").value = userData.id;
//       document.getElementById("username").value = userData.username;
//       document.getElementById("email").value = userData.email;

//       document.getElementById("first_name").value = userData.first_name || "";
//       document.getElementById("last_name").value = userData.last_name || "";
//       document.getElementById("mobile_no").value = peopleData.mobile_no || "";
//       document.getElementById("birth_date").value = peopleData.birth_date || "";
//       document.getElementById("union").value = peopleData.union || "";
//       document.getElementById("word").value = peopleData.word || "";
//       document.getElementById("village").value = peopleData.village || "";
//       document.getElementById("blood_group").value = peopleData.blood_group || "";
//       document.getElementById("last_blood_donate_date").value = peopleData.last_blood_donate_date || "";
//       document.getElementById("gender").value = peopleData.gender || "";
//       document.getElementById("marital_status").value = peopleData.marital_status || ""; 
//       document.getElementById("designation").value = peopleData.designation || "";
//       document.getElementById("worksat").value = peopleData.worksat || "";
//       document.getElementById("livesIn").value = peopleData.livesIn || "";
//       document.getElementById("varsity").value = peopleData.varsity || "";
//       document.getElementById("session").value = peopleData.session || "";
//       document.getElementById("complete").value = peopleData.complete ? "true" : "false";
//       document.getElementById("subject").value = peopleData.subject || "";
//       document.getElementById("association_post").value = peopleData.association_post || "";

//       // If CV exists, preview it
//       if (peopleData.cv) {
//         document.getElementById("cv-preview").src = peopleData.cv;
//       }
      
//       // If image exists, preview it
//       if (peopleData.image) {
//         document.getElementById("profile-image-preview").src = peopleData.image;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });

//   // Handle form submission
//   updateForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const formData = new FormData(updateForm);

//     // Update user details
//     fetch(userApiUrl, {
//       method: "PUT",
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
//       },
//       body: JSON.stringify({
//         first_name: formData.get("first_name"),
//         last_name: formData.get("last_name"),
//       }),
//     })
//       .then((response) => response.json())
//       .then(() => {
//         // Update People details
//         fetch(peopleApiUrl, {
//           method: "PUT",
//           headers: {
//             "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
//           },
//           body: formData,
//         })
//           .then((response) => {
//             if (response.ok) {
//               alert("Profile updated successfully.");
//             } else {
//               alert("Failed to update profile.");
//             }
//           })
//           .catch((error) => console.error("Error updating People data:", error));
//       })
//       .catch((error) => console.error("Error updating User data:", error));
//   });

//   // Preview profile image
//   document.getElementById("image").addEventListener("change", function (event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         document.getElementById("profile-image-preview").src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   });

//   // Preview CV file
//   document.getElementById("cv").addEventListener("change", function (event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         document.getElementById("cv-preview").src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  const peopleId = localStorage.getItem("people_id");
  const userId = localStorage.getItem("user_id");

  const peopleApiUrl = `https://club-1-6len.onrender.com/people/list/${peopleId}/`;
  const userApiUrl = `https://club-1-6len.onrender.com/users/${userId}/`;

  const updateForm = document.getElementById("update-profile-form");

  // Fetch data and populate form
  Promise.all([
    fetch(userApiUrl).then((response) => response.json()),
    fetch(peopleApiUrl).then((response) => response.json()),
  ])
    .then(([userData, peopleData]) => {
      document.getElementById("id").value = userData.id;
      document.getElementById("username").value = userData.username;
      document.getElementById("email").value = userData.email;

      document.getElementById("first_name").value = userData.first_name || "";
      document.getElementById("last_name").value = userData.last_name || "";
      document.getElementById("mobile_no").value = peopleData.mobile_no || "";
      document.getElementById("birth_date").value = peopleData.birth_date || "";
      document.getElementById("union").value = peopleData.union || "";
      document.getElementById("word").value = peopleData.word || "";
      document.getElementById("village").value = peopleData.village || "";
      document.getElementById("blood_group").value = peopleData.blood_group || "";
      document.getElementById("last_blood_donate_date").value = peopleData.last_blood_donate_date || "";
      document.getElementById("gender").value = peopleData.gender || "";
      document.getElementById("marital_status").value = peopleData.marital_status || ""; 
      document.getElementById("designation").value = peopleData.designation || "";
      document.getElementById("worksat").value = peopleData.worksat || "";
      document.getElementById("livesIn").value = peopleData.livesIn || "";
      document.getElementById("varsity").value = peopleData.varsity || "";
      document.getElementById("session").value = peopleData.session || "";
      document.getElementById("complete").value = peopleData.complete ? "true" : "false";
      document.getElementById("subject").value = peopleData.subject || "";
      document.getElementById("association_post").value = peopleData.association_post || "";

      if (peopleData.cv) {
        document.getElementById("cv-preview").src = peopleData.cv;
      }

      if (peopleData.image) {
        document.getElementById("profile-image-preview").src = peopleData.image;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Handle form submission
  // updateForm.addEventListener("submit", function (event) {
  //   event.preventDefault();

  //   const formData = new FormData(updateForm);

  //   // Handle image and CV uploads to imgbb
  //   const imageFile = formData.get("image");
  //   const cvFile = formData.get("cv");
  //   const imgbbApiKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your imgbb API key

  //   let imageUploadPromise = Promise.resolve(null);
  //   let cvUploadPromise = Promise.resolve(null);

  //   // Upload image if selected
  //   if (imageFile && imageFile.size > 0) {
  //     const imageFormData = new FormData();
  //     imageFormData.append("image", imageFile);

  //     imageUploadPromise = fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
  //       method: "POST",
  //       body: imageFormData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.success) {
  //           return data.data.url; // Return the image URL
  //         } else {
  //           throw new Error("Image upload to imgbb failed");
  //         }
  //       });
  //   }

  //   // Upload CV if selected
  //   if (cvFile && cvFile.size > 0) {
  //     const cvFormData = new FormData();
  //     cvFormData.append("image", cvFile);

  //     cvUploadPromise = fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
  //       method: "POST",
  //       body: cvFormData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.success) {
  //           return data.data.url; // Return the CV URL
  //         } else {
  //           throw new Error("CV upload to imgbb failed");
  //         }
  //       });
  //   }

  //   // Once both uploads are complete, update the profile
  //   Promise.all([imageUploadPromise, cvUploadPromise])
  //     .then(([imageUrl, cvUrl]) => {
  //       // Update user details
  //       fetch(userApiUrl, {
  //         method: "PUT",
  //         headers: {
  //           "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //         body: JSON.stringify({
  //           first_name: formData.get("first_name"),
  //           last_name: formData.get("last_name"),
  //         }),
  //       })
  //         .then((response) => response.json())
  //         .then(() => {
  //           // Update People details with the image and CV URLs
  //           fetch(peopleApiUrl, {
  //             method: "PUT",
  //             headers: {
  //               "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
  //             },
  //             body: JSON.stringify({
  //               image: imageUrl || peopleData.image, // Use the uploaded image URL or existing one
  //               cv: cvUrl || peopleData.cv, // Use the uploaded CV URL or existing one
  //               mobile_no: formData.get("mobile_no"),
  //               birth_date: formData.get("birth_date"),
  //               union: formData.get("union"),
  //               word: formData.get("word"),
  //               village: formData.get("village"),
  //               blood_group: formData.get("blood_group"),
  //               last_blood_donate_date: formData.get("last_blood_donate_date"),
  //               gender: formData.get("gender"),
  //               marital_status: formData.get("marital_status"),
  //               designation: formData.get("designation"),
  //               worksat: formData.get("worksat"),
  //               livesIn: formData.get("livesIn"),
  //               varsity: formData.get("varsity"),
  //               session: formData.get("session"),
  //               complete: formData.get("complete") === "true",
  //               subject: formData.get("subject"),
  //               association_post: formData.get("association_post"),
  //             }),
  //           })
  //             .then((response) => {
  //               if (response.ok) {
  //                 alert("Profile updated successfully.");
  //               } else {
  //                 alert("Failed to update profile.");
  //               }
  //             })
  //             .catch((error) => console.error("Error updating People data:", error));
  //         })
  //         .catch((error) => console.error("Error updating User data:", error));
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading files:", error);
  //       alert("Failed to upload image or CV. Please try again.");
  //     });
  // });
// Handle form submission
  updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(updateForm);

    // Handle image and CV uploads to imgbb
    const imageFile = formData.get("image");
    const cvFile = formData.get("cv");
    const imgbbApiKey = "6b0c007afbf8da08520a75fb493991aa"; // Replace with your imgbb API key

    let imageUploadPromise = Promise.resolve(null);
    let cvUploadPromise = Promise.resolve(null);

    // Upload image if selected
    if (imageFile && imageFile.size > 0) {
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      imageUploadPromise = fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: imageFormData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            return data.data.url; // Return the image URL
          } else {
            throw new Error("Image upload to imgbb failed");
          }
        });
    }

    // Upload CV if selected
    if (cvFile && cvFile.size > 0) {
      const cvFormData = new FormData();
      cvFormData.append("image", cvFile);

      cvUploadPromise = fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: cvFormData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            return data.data.url; // Return the CV URL
          } else {
            throw new Error("CV upload to imgbb failed");
          }
        });
    }

    // Once both uploads are complete, update the profile
    Promise.all([imageUploadPromise, cvUploadPromise])
      .then(([imageUrl, cvUrl]) => {
        // Prepare JSON body for user data update
        const userUpdateData = {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
        };

        // Update user details
        fetch(userApiUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json", // Ensure the correct Content-Type
          },
          body: JSON.stringify(userUpdateData),
        })
          .then((response) => response.json())
          .then(() => {
            // Prepare JSON body for people data update
            const peopleUpdateData = {
              image: imageUrl || peopleData.image, // Use the uploaded image URL or existing one
              cv: cvUrl || peopleData.cv, // Use the uploaded CV URL or existing one
              mobile_no: formData.get("mobile_no"),
              birth_date: formData.get("birth_date"),
              union: formData.get("union"),
              word: formData.get("word"),
              village: formData.get("village"),
              blood_group: formData.get("blood_group"),
              last_blood_donate_date: formData.get("last_blood_donate_date"),
              gender: formData.get("gender"),
              marital_status: formData.get("marital_status"),
              designation: formData.get("designation"),
              worksat: formData.get("worksat"),
              livesIn: formData.get("livesIn"),
              varsity: formData.get("varsity"),
              session: formData.get("session"),
              complete: formData.get("complete") === "true",
              subject: formData.get("subject"),
              association_post: formData.get("association_post"),
            };

            // Update People details
            fetch(peopleApiUrl, {
              method: "PATCH",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json", // Ensure the correct Content-Type
              },
              body: JSON.stringify(peopleUpdateData),
            })
              .then((response) => {
                if (response.ok) {
                  alert("Profile updated successfully.");
                  window.location.href = "https://rabi993.github.io/umsa_frontend/dashboard.html";
                } else {
                  alert("Failed to update profile.");
                }
                
              })
              .catch((error) => console.error("Error updating People data:", error));
          })
          .catch((error) => console.error("Error updating User data:", error));
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        alert("Failed to upload image or CV. Please try again.");
      });
  });

  // Preview profile image
  document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("profile-image-preview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Preview CV file
  document.getElementById("cv").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("cv-preview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});
