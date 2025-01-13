document.addEventListener("DOMContentLoaded", () => {
  fetchServices(); // Load the services when the page loads
});
const fetchServices = () => {
  fetch("http://127.0.0.1:8000/service/")
    .then((response) => response.json())
    .then((services) => {
      const serviceList = document.getElementById("service-list");
      serviceList.innerHTML = ""; // Clear existing rows

      if (services.length === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `
          <td colspan="4" class="text-center">No services available.</td>
        `;
        serviceList.appendChild(noDataRow);
      } else {
        services.forEach((service) => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td><img src="${service.image}" alt="${service.name}" style="height: 50px; width: 50px; object-fit: cover;"></td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>
              <button class="btn btn-warning btn-sm mx-1" onclick="handleEditService('${service.id}', '${service.name}', '${service.description}', '${service.image}')">Edit</button>
              <button class="btn btn-danger btn-sm mx-1" onclick="handleDeleteService('${service.id}')">Delete</button>
            </td>
          `;

          serviceList.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error fetching services:", error));
};



// Function to reset the form


const handleAddService = async (event) => {
  event.preventDefault(); // Prevent form refresh

  const serviceName = document.getElementById("serviceName").value.trim();
  const serviceDescription = document.getElementById("serviceDescription").value.trim();
  const serviceImage = document.getElementById("serviceImage").files[0];
  const serviceId = document.getElementById("serviceId").value.trim();

  if (!serviceName || !serviceDescription) {
    alert("Name and description are required.");
    return;
  }

  try {
    let imageUrl = null;

    // Upload image only if a new image is selected
    if (serviceImage) {
      const imgbbApiKey = "6b0c007afbf8da08520a75fb493991aa"; 
      const imgbbUrl = "https://api.imgbb.com/1/upload";
      const imageFormData = new FormData();
      imageFormData.append("image", serviceImage);
      imageFormData.append("key", imgbbApiKey);

      const imageResponse = await fetch(imgbbUrl, {
        method: "POST",
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to upload image to imgbb.");
      }

      const imageResult = await imageResponse.json();
      imageUrl = imageResult.data.url; // Get the image URL
    }

    // Prepare service data
    const formData = new FormData();
    formData.append("name", serviceName);
    formData.append("description", serviceDescription);
    if (imageUrl) {
      formData.append("image", imageUrl);
    }

    // Determine HTTP method and URL
    const method = serviceId ? "PUT" : "POST"; // Update or add
    const url = serviceId
      ? `http://127.0.0.1:8000/service/${serviceId}/`
      : "http://127.0.0.1:8000/service/";

    // Send service data to backend
    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(serviceId ? "Failed to update service" : "Failed to add service");
    }

    alert(serviceId ? "Service updated successfully!" : "Service added successfully!");
    resetForm();
    fetchServices(); // Refresh the service list
  } catch (error) {
    console.error("Error adding/updating service:", error);
    alert("Error processing service. Please try again.");
  }
};


const resetForm = () => {
  document.getElementById("service_form").reset();
  document.getElementById("form-title").textContent = "Add Service";
  document.getElementById("addServiceButton").textContent = "Add Service";
  document.getElementById("serviceId").value = ""; // Clear hidden input
  // document.getElementById("imagePreview").src = "Add Service"; // Clear image preview
  document.getElementById("imagePreview").style.display = "none"; // Hide preview
};






// Handle deleting a service
const handleDeleteService = (id) => {
  if (!confirm("Are you sure you want to delete this service?")) {
    return;
  }

  fetch(`http://127.0.0.1:8000/service/${id}/`, {
    method: "DELETE", // Assuming the API uses DELETE for deletions
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete service");
      }
      alert("Service deleted successfully!");
      fetchServices(); // Refresh the service list
    })
    .catch((error) => {
      console.error("Error deleting service:", error);
      alert("Error deleting service. Please try again.");
    });
};


const handleEditService = (id, currentName, currentDescription, currentImage) => {
  // Populate form fields with current values
  document.getElementById("serviceName").value = currentName;
  document.getElementById("serviceDescription").value = currentDescription;
  document.getElementById("serviceId").value = id; // Hidden input field for service ID

  // Display current image in the preview
  const imagePreview = document.getElementById("imagePreview");
  if (currentImage) {
    imagePreview.src = currentImage;
    imagePreview.style.display = "block"; // Ensure it's visible
  } else {
    imagePreview.style.display = "none"; // Hide if no image
  }

  // Update form title and button text
  document.getElementById("form-title").textContent = "Edit Service";
  document.getElementById("addServiceButton").textContent = "Update Service";
};

// Handle editing a service
const handleEditService1 = (id, currentName, currentDescription, currentImage) => {
  // Fill in the form with the current values
  document.getElementById("serviceName").value = currentName;
  document.getElementById("serviceDescription").value = currentDescription;
  document.getElementById("serviceId").value = id; // Hidden input field to store the service id

  // Set image preview if available
  if (currentImage) {
    document.getElementById("imagePreview").src = currentImage;
  } else {
    document.getElementById("imagePreview").src = ""; // Clear if no image
  }

  // Change the form title and button text to indicate edit mode
  document.getElementById("form-title").textContent = "Edit Service";
  document.getElementById("addServiceButton").textContent = "Update Service";
};
