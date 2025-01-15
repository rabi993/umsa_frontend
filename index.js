if (localStorage.getItem("user_id")) {
    // Show Logout and Profile links
    document.querySelector(".logout-menu").classList.remove("d-none");
    document.querySelector(".profile-menu").classList.remove("d-none");
    document.querySelector(".aut_menu").classList.remove("d-none");
    document.querySelector(".aut_menu1").classList.remove("d-none");
    document.querySelector(".aut_menu2").classList.remove("d-none");
  
    // Hide Login and Registration links
    document.querySelector(".login-menu").classList.add("d-none");
    document.querySelector(".sign-menu").classList.add("d-none");
  } else {
    // Show Login and Registration links
    document.querySelector(".login-menu").classList.remove("d-none");
    document.querySelector(".sign-menu").classList.remove("d-none");
  
    // Hide Logout and Profile links
    document.querySelector(".logout-menu").classList.add("d-none");
    document.querySelector(".profile-menu").classList.add("d-none");
    document.querySelector(".aut_menu").classList.add("d-none");
    document.querySelector(".aut_menu1").classList.add("d-none");
    document.querySelector(".aut_menu2").classList.add("d-none");
    document.querySelector(".aut_menu3").classList.add("d-none");
    document.querySelector(".aut_menu4").classList.add("d-none");
  }
    
  