  // Header Scroll-Top
  const navbar = document.querySelector(".navbar");
  if (window.location.pathname == "/") {
    navbar.style.backgroundColor = "transparent";
  } else {
    navbar.style.backgroundColor = "var(--bg-secondary)";
  }

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > navbar.offsetTop) {
      if (window.location.pathname == "/") {
        navbar.style.backgroundColor = "var(--bg-secondary)";
      }
      navbar.classList.add("sticky");
      navbar.querySelector("a").color = "rgb(148, 148, 148)";
    } else {
      if (window.location.pathname == "/") {
        navbar.style.backgroundColor = "var(--bg-secondary)";
      }
      navbar.classList.remove("sticky");
    }
  });

  // Navbar Menu Buttons
  const navbarMenuButtonOpen = document.querySelector("#menu-button-open");
  const navbarMenuButtonClose = document.querySelector("#menu-button-close");
  if (navbarMenuButtonOpen) {
    navbarMenuButtonOpen.addEventListener("click", (event) => {
      event.target.classList.add("hide");
      navbarMenuButtonClose.classList.remove("hide");
      navbarMenuButtonClose.classList.add("close");
      document.querySelector(".navbar-dropdown").style.blockSize = "100vh";
      document.querySelector(".navbar-dropdown").classList.remove("hide");
      document.querySelector("main").classList.add("hide");
      document.querySelector("footer").classList.add("hide");
    });
  }

  if (navbarMenuButtonClose) {
    navbarMenuButtonClose.addEventListener("click", (event) => {
      event.target.classList.add("hide");
      navbarMenuButtonOpen.classList.remove("hide");
      document.querySelector(".navbar-dropdown").classList.add("hide");
      document.querySelector("main").classList.remove("hide");
      document.querySelector("footer").classList.remove("hide");
    });
  }

  // Navbar Dropdown Items
  const dropdownItems = document.querySelectorAll(".has-dropdown-item-inner");
  dropdownItems.forEach((dropdownItem) => {
    let isOpened = false;
    if (dropdownItem) {
      dropdownItem.addEventListener("click", (event) => {
        dropdownItems.forEach((item) => {
          item.querySelector(".dropdown-item-inner").classList.add("hide");
          item.querySelector("i").style.transform = "rotate(360deg)";
          item.querySelector("i").style.transition = "all 0.5s ease";
          item.querySelector(".title").style.borderBlockEnd = "1px solid #f3f3f3";
        });

        if (!isOpened) {
          isOpened = true;
          dropdownItem.querySelector("i").style.transform = "rotate(180deg)";
          dropdownItem.querySelector("i").style.transition = "all 0.5s ease";
          dropdownItem.querySelector(".title").style.borderBlockEnd = "none";
          document.querySelector(".navbar-dropdown").style.blockSize = "100vh";
          dropdownItem.querySelector(".dropdown-item-inner").classList.remove("hide");
        } else {
          isOpened = false;
          dropdownItem.querySelector("i").style.transform = "rotate(360deg)";
          dropdownItem.querySelector("i").style.transition = "all 0.5s ease";
          dropdownItem.querySelector(".title").style.borderBlockEnd = "1px solid #f3f3f3";
          document.querySelector(".navbar-dropdown").style.blockSize = "100vh";
          dropdownItem.querySelector(".dropdown-item-inner").classList.add("hide");
        }
      });
    }
  });

  // Navbar links
  const navLinks = { 0: "", 1: "urls", 2: "docs"};
  const dropdownLinks = document.querySelectorAll(".dropdown-item:not(.has-dropdown-item-inner)");
  dropdownLinks.forEach((dropdownLink, index) => {
    if (dropdownLink) {
      dropdownLink.addEventListener("click", (event) => {
        window.location.href = `/${navLinks[index]}`;
      });
    }
  });

  const navbarLogo = document.querySelector(".navbar-logo");
  if (navbarLogo) {
    navbarLogo.addEventListener("click", (event) => {
      window.location.href = "/";
    });
  }

  // Navbar Avatar
  let toggleMenu = document.querySelector("#toggle-dropdown");
  let hasToggle = false;
  let dropdownMenu = document.querySelector("#dropdown-menu");

  if (toggleMenu) {
    toggleMenu.addEventListener("click", (event) => {
      if (!hasToggle) {
        dropdownMenu.style.display = "block";
        hasToggle = true;
      } else {
        dropdownMenu.style.display = "none";
        hasToggle = false;
      }
    });
  }

  //   Scroll function
  if (document.querySelector("body").scrollHeight > document.querySelector("body").clientHeight) {
    document.querySelector("footer").classList.remove("fixed");
  } else {
    document.querySelector("footer").classList.add("fixed");
  }

