const Hamburger = () => {
  const menu = document.querySelector(".js-humburger") as HTMLElement;
  const item = document.querySelectorAll(".l-header__item") as NodeListOf<Element>;

  item.forEach((element: Element) => {
    element.addEventListener("click", () => {
      menu.classList.remove("is-active");
      bodySetProperties();
    });
  });

  menu.addEventListener("click", function () {
    menu.classList.toggle("is-active");
    bodySetProperties();
  });

  const bodySetProperties = () => {
    if (menu.classList.contains("is-active")) {
      document.body.style.setProperty("position", "fixed");
      document.body.style.setProperty("width", "100%");
      document.body.style.setProperty("--z-canvas", "2");
    } else {
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("--z-canvas");
    }
  };
};

export default Hamburger;
