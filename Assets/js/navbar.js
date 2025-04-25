document.addEventListener("DOMContentLoaded", function () {
  // Set Active Link Based on Current Page
  let currentPage = window.location.pathname.split("/").pop();
  let navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Make the toggleNavbar function globally available
  window.toggleNavbar = function () {
    const navLinks = document.getElementById("navbarDefault");
    const toggler = document.querySelector(".navbar-toggler");

    navLinks.classList.toggle("show");
    toggler.classList.toggle("active");

    // Toggle aria-expanded attribute
    const isExpanded = toggler.getAttribute("aria-expanded") === "true";
    toggler.setAttribute("aria-expanded", !isExpanded);

    // Prevent scrolling when menu is open
    document.body.style.overflow = navLinks.classList.contains("show")
      ? "hidden"
      : "";
  };

  // Close mobile menu when clicking a link
  const mobileNavLinks = document.querySelectorAll(".nav-link");

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const navMenu = document.getElementById("navbarDefault");
      const toggler = document.querySelector(".navbar-toggler");

      if (navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        toggler.classList.remove("active");
        toggler.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });
});

// Set the current year in the footer if it exists
document.addEventListener("DOMContentLoaded", function () {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
