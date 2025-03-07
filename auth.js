const handleRegistration = (event) => {
  event.preventDefault();
  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email"); 
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
    confirm_password,
  };

  if (password === confirm_password) {
    document.getElementById("error").innerText = "";
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      console.log(info);

      fetch("https://club-wine.vercel.app/people/register/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Registration failed. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        alert("Registration successful! Check Your Email and Activate your Account. After activated Then You can log in.");
        window.location.href = "https://rabi993.github.io/umsa_frontend/login.html";
      })
    } else {
      document.getElementById("error").innerText =
        "pass must contain eight characters, at least one letter, one number and one special character:";
    }
  } else {
    document.getElementById("error").innerText =
      "password and confirm password do not match";
    alert("password and confirm password do not match");
  }
};

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};




const handleLogin = (event) => {
  event.preventDefault();

  const username = getValue("login-username");
  const password = getValue("login-password");

  // Validate inputs
  if (!username || !password) {
    alert("Please provide both username and password.");
    return;
  }

  // API call for login
  fetch("https://club-wine.vercel.app/people/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password.");
        } else {
          throw new Error("Login failed. Please try again later.");
        }
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);

      if (data.token && data.user_id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        setPeople();
        alert("Welcome! UMSA Family. You are Successfully Logged in")
        

        // Use `user_id` to fetch user details
        const userId = data.user_id;
        fetch(`https://club-wine.vercel.app/users/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`, // Use token for authentication
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch user details.");
            }
            return res.json();
          })
          .then((userData) => {
            console.log(userData);

            localStorage.setItem("username", userData.username);
            if (userData.is_superuser) {
              window.location.href = "https://rabi993.github.io/umsa_frontend/AdminPanel.html";
            } else {
              window.location.href = "https://rabi993.github.io/umsa_frontend/index.html";
              
            }
          })
          .catch((error) => {
            console.error("Error fetching user details:", error);
            alert("Failed to retrieve user details. Please try again.");
          });
      } else {
        alert("Password or username incorrect ! Unexpected response from the server. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert(error.message);
    });

    
};

function setPeople() {
  const userId = localStorage.getItem("user_id"); // Get the user ID from local storage

  // Validate if userId exists
  if (!userId) {
    console.error("No user ID found in local storage");
    return; // Exit the function early if userId is not found
  }

  // Fetch the list of people and find the relevant person for the user
  fetch("https://club-wine.vercel.app/people/list/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching people list: ${response.statusText}`);
      }
      return response.json();
    })
    .then((peoples) => {
      const person = peoples.find((p) => p.user == userId);

      if (!person) {
        throw new Error("No associated person found for the user");
      }

      // Store the person ID in localStorage if found
      localStorage.setItem("people_id", person.id);
      console.log("People ID saved successfully:", person.id);

      return person;
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}