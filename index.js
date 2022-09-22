if (navigator.serviceWorker) {
  console.log("%c Service worker supported", "color:green");
  navigator.serviceWorker
    .register("./serviceWorkers/custom-sw-cache-pages.js")
    .then((res) => {
      console.log("Service worker add:", res);
    })
    .catch((err) => console.log(err));
}

function loadPage(page) {
  let res = null;
  let pageEl = document.getElementById("pageWrapper");
  if (page === "home") {
    import("./home.js").then((module) => {
      let p = module.home();
      pageEl.innerHTML = p;
    });
  } else if (page === "about") {
    import("./about.js").then((module) => {
      let p = module.about();
      pageEl.innerHTML = p;
    });
  }
}
loadPage("home");
function navigate(e) {
  if (e.target.matches("div")) {
    let pg = e.target.getAttribute("name");
    loadPage(pg);
  }
}
