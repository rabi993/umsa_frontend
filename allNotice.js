const loadFlowers = (search = "") => {
  const flowersContainer = document.getElementById("flowers");
  const spinner = document.getElementById("spinner");
  const noData = document.getElementById("nodata");

  flowersContainer.innerHTML = "";
  spinner.style.display = "block";
  noData.style.display = "none";

  const url = `http://127.0.0.1:8000/notice/list/?search=${search}`;
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
      
      const div = document.createElement("div");
      div.classList.add("flower-card", "col-12", "col-md-6", "col-lg-4");
      div.innerHTML = `
        <img class="flow-img" src="${flower.image}" alt="${flower.name}" />
        
        <h4>${flower.name}</h4>
        <small style="color: grey; margin: 0px;font-size:10px;">Author : ${flower.user}</small>
        <p style="color: grey; margin: 0px;">${flower.description.slice(0, 50)}...</p>
        <a style="text-decoration: none; " class="btn btn-success rounded  mt-1" href="noticeDetails.html?noticeId=${flower.id}">Details</a>
          
        
      `;
      flowersContainer.appendChild(div);
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

