import gsap from "gsap";
import { setUpAccordion, Hamburger } from "./Common";
const TL = gsap.timeline();
document.addEventListener("DOMContentLoaded", () => {
  setUpAccordion(); //Accordion
  Hamburger(); //Hamburger Menu

  setTimeout(() => {
    TL.to(".p-loader", {
      autoAlpha: 0,
      duration: 1,
      ease: "back.out(1.7)", //ease
    });
  }, 2000);

  gsap.to(".js-main", {
    autoAlpha: 1,
    duration: 1.8,
    ease: "back.out(1.7)", //ease
  });
  // const anchors = document.querySelectorAll<HTMLAnchorElement>("a[href]");

  // anchors.forEach((anchor: HTMLAnchorElement) => {
  //   anchor.addEventListener("click", (e: Event) => {
  //     const href = anchor.getAttribute("href") ?? "";
  //     e.preventDefault();
  //     clickedAnchor();
  //     setTimeout(() => {
  //       window.location.href = href;
  //     }, 100);
  //   });
  // });

  // const clickedInternalLinks = () => {
  //   const internalLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="/#"]');
  //   internalLinks.forEach((anchor: HTMLAnchorElement) => {
  //     anchor.addEventListener("click", (e: Event) => {
  //       gsap.to(".js-main", {
  //         autoAlpha: 1,
  //         duration: 0.4,
  //         ease: "back.out(1.7)", //ease
  //       });
  //     });
  //   });
  // };

  // if (location.pathname == "/") {
  //   clickedInternalLinks();
  // }
});

// const clickedAnchor = () => {
//   TL.to(".js-main", {
//     autoAlpha: 0,
//     duration: 0.4,
//     ease: "back.out(1.7)", //ease
//   });
// };
