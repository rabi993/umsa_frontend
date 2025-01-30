const loadServices = () => {
    // Fetch services from the API
    fetch('http://127.0.0.1:8000/service/')
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
      div.classList.add("col-lg-6", "col-md-6", "col-sm-12", "my-5");
      div.innerHTML = `
        <div class="  h-100" >
          <div class="ratio ratio-16x9">
            <img
              src="${service.image}"
              class="card-img-top"
              loading="lazy"
              alt="${service.name || 'Service Image'}"
            />
          </div>
          <div class="card-body">
            <h6 class="card-title h5">${service.name || "Unnamed Service"}</h6>
            <p class="card-text" style="font-size:14px;">
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