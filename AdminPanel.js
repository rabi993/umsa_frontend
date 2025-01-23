// Check if the user is logged in
if (localStorage.getItem("user_id")) {
    // Show Logout and Profile links
    document.querySelector(".logout-menu").classList.remove("d-none");
    document.querySelector(".profile-menu").classList.remove("d-none");
    document.querySelector(".logout-menu1").classList.remove("d-none");
    document.querySelector(".profile-menu1").classList.remove("d-none");
  
    // Hide Login and Registration links
    document.querySelector(".login-menu").classList.add("d-none");
    document.querySelector(".sign-menu").classList.add("d-none");
    document.querySelector(".login-menu1").classList.add("d-none");
    document.querySelector(".sign-menu1").classList.add("d-none");
    
    
  } else {
    // Show Login and Registration links
    document.querySelector(".login-menu").classList.remove("d-none");
    document.querySelector(".sign-menu").classList.remove("d-none");
    document.querySelector(".login-menu1").classList.remove("d-none");
    document.querySelector(".sign-menu1").classList.remove("d-none");
  
    // Hide Logout and Profile links
    document.querySelector(".logout-menu").classList.add("d-none");
    document.querySelector(".profile-menu").classList.add("d-none");
    document.querySelector(".logout-menu1").classList.add("d-none");
    document.querySelector(".profile-menu1").classList.add("d-none");
  }
    