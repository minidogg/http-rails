const nav = `
<button class="navButton" href="./">Starter Guide</button>
`;
document.getElementById("nav").innerHTML = nav;

Array.from(document.querySelectorAll(".navButton")).forEach((e) => {
  let el = e;
  el.onclick = () => {
    setTimeout(() => {
      window.location.assign(el.getAttribute("href"));
    }, 300);
  };
});
