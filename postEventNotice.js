const url = `https://club-1-6len.onrender.com/post/list`; 
console.log("Fetching data from:", url);

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    if (data.results && data.results.length > 0) {
      fetchUsersAndDisplay(data.results);
    } else {
      document.getElementById("flowerss").innerHTML = "<p>No posts available</p>";
    }
  })
  .catch((error) => {
    console.error("Error fetching flowers:", error);
    document.getElementById("flowerss").innerHTML = "<p>Error loading posts</p>";
  });

const fetchUsersAndDisplay = (flowers) => {
  const userApiUrl = `https://club-1-6len.onrender.com/users/`;
  fetch(userApiUrl)
    .then((res) => res.json())
    .then((users) => {
      const userMap = users.reduce((acc, user) => {
        acc[user.username] = `${user.first_name} ${user.last_name}`;
        return acc;
      }, {});
      displayFlowers(flowers, userMap);
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
    });
};

const displayFlowers = (flowers, userMap) => {
  const sortedflowers = flowers.sort((a, b) => b.id - a.id);
  const flowersContainer = document.getElementById("flowerss");
  flowersContainer.innerHTML = "";

  sortedflowers.forEach((flower) => {
    const li = document.createElement("li"); 
    li.classList.add("short-card", "px-3", "slider-item");

    const fullName = userMap[flower.user] || "Unknown User";
    const categories = flower.category.length > 0 ? flower.category.join(", ") : "No category";

    li.innerHTML = `
      <a style="text-decoration: none; color:black;" href="postDetails.html?postId=${flower.id}">
        <img class="my-2 img-fluid" src="${flower.image}" alt="${flower.title}" />
        <h6 class="p-0 m-0">${flower.title}</h6>
        <p style="color: black; margin: 0px; font-size:15px;" >
          ${fullName}  
          <small style="color: grey; margin: 0px; font-size:10px;"> ${formatDateTime(flower.created_at)}</small> 
           <span style="color: gray;">${categories}</span>
        </p>
      </a>
    `;

    flowersContainer.appendChild(li);
  });

  // Reinitialize Swiffy Slider after updating the DOM
  if (window.swiffySlider) {
    window.swiffySlider.init();
  }
};

function formatDateTime(dateTimeString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  }
