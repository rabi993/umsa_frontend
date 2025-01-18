const loadFlowers = (search = "") => {
  const flowersContainer = document.getElementById("flowers");
  const spinner = document.getElementById("spinner");
  const noData = document.getElementById("nodata");

  flowersContainer.innerHTML = "";
  spinner.style.display = "block";
  noData.style.display = "none";

  const url = `http://127.0.0.1:8000/post/list/?search=${search}`;
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
      const userApiUrl = `http://127.0.0.1:8000/users/`;
    
      // Create a div for each flower card first
      const div = document.createElement("div");
      div.classList.add("flower-card", "col-12", "col-md-6", "col-lg-4");
    
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
              <img class="flow-img" src="${flower.image}" alt="${flower.title}" />
              <h4>${flower.title}</h4>
              <p style="color: black; margin: 0px; font-size:15px;">Author : ${fullName}  <small style="color: grey; margin: 0px; font-size:10px;"> ${formatDateTime(flower.created_at)}</small> ${flower.category.map((item) => `${item}`).join("")}</p>
            
              <p style="color: grey; margin: 0px;" class="px-2">${flower.content.slice(0, 100)}...</p>
              <a style="text-decoration: none;" class="btn btn-success rounded mt-1" href="postDetails.html?postId=${flower.id}">Details</a>
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
    fetch("http://127.0.0.1:8000/category/")
      .then((res) => res.json())
      .then((data) => {
        const parent = document.getElementById("drop-cat");
        parent.innerHTML = ""; // Clear previous items
        data.forEach((item) => {
          const li = document.createElement("li");
          li.classList.add("dropdown-item");
          li.innerHTML = `<button class="btn btn-info" onclick="loadFlowers('${item.name}')">${item.name}</button>`;
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
