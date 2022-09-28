const themeStyle = localStorage.getItem("openeuler-theme");
const html = document.getElementsByTagName("html")[0];
if (!themeStyle) {
  localStorage.getItem("openeuler-theme", "light");
  html.classList.add("light")
} else {
  html.classList.add(themeStyle)
}


