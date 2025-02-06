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
    li.classList.add("short-card-landing", "px-3", "slider-item");

    const fullName = userMap[flower.user] || "Unknown User";
    const categories = flower.category.length > 0 ? flower.category.join(", ") : "No category";

    li.innerHTML = `
      <a style="text-decoration: none; color:black;" href="postDetails.html?postId=${flower.id}">
        <img class="my-2 img-fluid" src="${flower.image}" alt="${flower.title}" />
        <h6 class="p-0 m-0">${flower.title}</h6>
        <p style="color: black; margin: 0px; font-size:15px;" >
          ${fullName}  
          
        </p>
        <small style="color: grey; margin: 0px; font-size:10px;"> ${formatDateTime(flower.created_at)}  </small> 
          
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


  const loadFlowers = () => {
    const noticeUrl = `https://club-1-6len.onrender.com/notice/list/`;
    const userUrl = `https://club-1-6len.onrender.com/users/`;
  
    console.log("Fetching data from:", noticeUrl);
  
    // Fetch both notices and users
    Promise.all([fetch(noticeUrl).then(res => res.json()), fetch(userUrl).then(res => res.json())])
      .then(([noticeData, users]) => {
        if (noticeData.results && noticeData.results.length > 0) {
          displayFlowerss(noticeData.results, users);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };
  
  const displayFlowerss = (flowers, users) => {
    // Sort flowers by ID in descending order
    const sortedFlowers = flowers.sort((a, b) => b.id - a.id);
  
    const flowersContainer = document.getElementById("notices");
    flowersContainer.innerHTML = ""; // Clear previous content
  
    // Create a user lookup dictionary for fast access
    const userDict = {};
    users.forEach(user => {
      userDict[user.username] = `${user.first_name} ${user.last_name}`;
    });
  
    sortedFlowers.forEach(flower => {
      const fullName = userDict[flower.user] || "Unknown User";
  
      const div = document.createElement("div");
      div.classList.add("short-card-landing", "px-3");
  
      div.innerHTML = `
        <a style="text-decoration: none; color:black;" href="noticeDetails.html?noticeId=${flower.id}">
          <img class="mt-2 img-fluid" src="${flower.file}" alt="${flower.name}" />
          <h6>${flower.name}</h6>
          <p style="color: black; margin: 0px; font-size:15px;">
            ${fullName}  
            
          </p>
          <small style="color: grey; margin: 0px; font-size:10px;">${formatDateTime(flower.created_at)}</small>
        </a>
      `;
  
      flowersContainer.appendChild(div);
    });
  };
  
  const handleSearch = () => {
    loadFlowers();
  };
  
  // Load initial data on page load
  document.addEventListener("DOMContentLoaded", loadFlowers);
  
  
  