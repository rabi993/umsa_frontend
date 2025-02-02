const loadServices = () => {
    // Fetch services from the API
    fetch('https://club-1-6len.onrender.com/service/')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => displayService(data))
      .catch((err) => {
        console.error("Failed to fetch services:", err);
        displayErrorMessage("Failed to load services. Please try again later.");
      });
  };

  const displayService = (services) => {
    const parent = document.getElementById("service-container");

    // Clear the parent container first (optional, in case of multiple calls)
    parent.innerHTML = "";

    services.forEach((service) => {
      const div = document.createElement("div");
      div.classList.add("col-lg-3", "col-md-3", "col-sm-12", "my-3",);
      div.innerHTML = `
        <div class="  " style=" width:350px;">
          <div class="ratio ratio-16x9">
            <img
            
              src="${service.image}"
              class="card-img-top"
              loading="lazy"
              alt="${service.name || 'Service Image'}"
            />
          </div>
          <div class="card-body py-3">
            <h6 class="">${service.name || "Unnamed Service"}</h6>
            <p class="card-text " style="font-size:12px;">
              ${service.description ? service.description : "No description available."}
            </p>
            
          </div>
        </div>
      `;
      parent.appendChild(div);
    });
  };

  const displayErrorMessage = (message) => {
    const parent = document.getElementById("service-container");
    parent.innerHTML = `<p class="text-danger">${message}</p>`;
  };

  // Call loadServices when the DOM is ready
  document.addEventListener("DOMContentLoaded", loadServices);


