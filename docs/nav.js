const nav = `
<button class="navButton" href="https://github.com/minidogg/http-rails">GitHub Repo</button>
<button class="navButton" href="./">Starter Guide</button>
<button class="navButton" href="./">Documentation</button>
<button class="navButton" href="./">Placeholder</button>

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
