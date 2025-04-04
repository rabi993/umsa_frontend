const loadFlowers = (search = "") => {
  const flowersContainer = document.getElementById("flowers");
  const spinner = document.getElementById("spinner");
  const noData = document.getElementById("nodata");

  flowersContainer.innerHTML = "";
  spinner.style.display = "block";
  noData.style.display = "none";

  const url = `https://club-wine.vercel.app/notice/list/?search=${search}`;
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
  
    sortedflowers.forEach((flower, index) => {
      
      const userApiUrl = `https://club-wine.vercel.app/users/`;
    
      // Create a div for each flower card first
      const div = document.createElement("div");
      div.classList.add("col-12", "col-md-6", "col-lg-6","my-4");
    
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

            div.innerHTML = `
            
            
            <div>
              <img class="event-img img-fluid" src="${flower.file}" alt="${flower.name}" />
            </div>
            <h5>${flower.name}</h5>
            <small style="color: grey; margin: 0px;font-size:10px;">Author : ${flower.user}</small></br>
            <small style="color: grey; margin: 0px; font-size:10px;"> ${fullName}</small>
            <small style="color: grey; margin: 0px; font-size:10px;">Created at ${flower.created_at}</small>
            <p style="color: grey; margin: 0px;">${flower.description.slice(0, 100)}...</p>
            <a style="text-decoration: none; " class="btn btc rounded text-white mt-1" href="noticeDetails.html?noticeId=${flower.id}">Details</a>
            
                
              
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
  

  
  
  const handleSearch = () => {
    const value = document.getElementById("search").value.trim();
    loadFlowers(value);
  };
  
  // Load initial data on page load
  document.addEventListener("DOMContentLoaded", () => {
    loadFlowers();
  });

