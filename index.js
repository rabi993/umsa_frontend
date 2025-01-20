if (localStorage.getItem("user_id")) {
    // Show Logout and Profile links
    document.querySelector(".logout-menu").classList.remove("d-none");
    document.querySelector(".logout-menu1").classList.remove("d-none");
    document.querySelector(".profile-menu").classList.remove("d-none");
    document.querySelector(".dash-menu").classList.remove("d-none");
    document.querySelector(".aut_menu").classList.remove("d-none");
    document.querySelector(".aut_menu1").classList.remove("d-none");
    document.querySelector(".aut_menu2").classList.remove("d-none");
  
    // Hide Login and Registration links
    document.querySelector(".login-menu").classList.add("d-none");
    document.querySelector(".sign-menu").classList.add("d-none");
    document.querySelector(".login-menu1").classList.add("d-none");
    document.querySelector(".registration-menu1").classList.add("d-none");
  } else {
    // Show Login and Registration links
    document.querySelector(".login-menu").classList.remove("d-none");
    document.querySelector(".sign-menu").classList.remove("d-none");
    document.querySelector(".login-menu1").classList.remove("d-none");
    document.querySelector(".registration-menu1").classList.remove("d-none");
  
    // Hide Logout and Profile links
    document.querySelector(".logout-menu").classList.add("d-none");
    document.querySelector(".logout-menu1").classList.add("d-none");
    document.querySelector(".profile-menu").classList.add("d-none");
    document.querySelector(".dash-menu").classList.add("d-none");
    document.querySelector(".aut_menu").classList.add("d-none");
    document.querySelector(".aut_menu1").classList.add("d-none");
    document.querySelector(".aut_menu2").classList.add("d-none");
    document.querySelector(".aut_menu3").classList.add("d-none");
    document.querySelector(".aut_menu4").classList.add("d-none");
  }
    
  document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profile_icon'); // Default profile icon
    const profileIcon2 = document.getElementById('profile_icon2'); // User profile icon
  
    if (!profileIcon || !profileIcon2) {
      console.error('Profile icon elements are missing in the DOM.');
      return;
    }
  
    const peopleId = localStorage.getItem('people_id'); // Retrieve `people_id` from localStorage
  
    if (peopleId) {
      fetch(`http://127.0.0.1:8000/people/list/${peopleId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data.');
          }
          return response.json();
        })
        .then(data => {
          console.log(data)
          if (data.image) {
            // Update to the user's profile image
            profileIcon2.src = data.image;
            profileIcon2.style.display = 'inline'; // Show fetched image
            profileIcon.style.display = 'none';   // Hide default image
          } else {
            console.warn('User data fetched but no image found.');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.log('No people_id found in localStorage.');
    }
  });
  