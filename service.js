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
      div.classList.add("col-lg-6", "col-md-6", "col-sm-12", "mb-4");
      div.innerHTML = `
        <div class="card shadow h-100" style="width: 500px; height: 350px; margin: 0 auto;">
          <div class="ratio ratio-16x9">
            <img
              src="${service.image}"
              class="card-img-top"
              loading="lazy"
              alt="${service.name || 'Service Image'}"
            />
          </div>
          <div class="card-body">
            <h3 class="card-title h5">${service.name || "Unnamed Service"}</h3>
            <p class="card-text">
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