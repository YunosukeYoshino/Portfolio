const Hamburger = () => {
  const menu = document.querySelector(".js-humburger") as HTMLElement;
  menu.addEventListener("click", function () {
    menu.classList.toggle("is-active");
  });
};

export default Hamburger;
