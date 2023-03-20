const Hamburger = () => {
  const menu = document.querySelector(".js-humburger") as HTMLElement;
  menu.addEventListener("click", function () {
    menu.classList.toggle("is-active");

    if (menu.classList.contains("is-active")) {
      document.body.style.setProperty("--mix-blend-mode", "none");
      document.body.style.setProperty("position", "fixed");
      document.body.style.setProperty("width", "100%");
    } else {
      document.body.style.removeProperty("--mix-blend-mode");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
    }
  });
};

export default Hamburger;
