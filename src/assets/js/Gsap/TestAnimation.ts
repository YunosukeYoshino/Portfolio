import gsap from "gsap";
const TestAnimation = () => {
  gsap.from(".hp_mobileOnly", {
    autoAlpha: 0 /* visibilityとopacityを合わせたもの*/,
    duration: 2, //animation-duration
    ease: "back.out(1.7)", //ease
    y: 100, //y方向に移動
  });
};

export default TestAnimation;
