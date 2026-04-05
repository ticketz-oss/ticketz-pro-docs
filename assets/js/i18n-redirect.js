(function () {
  var languages =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];
  var primary = (languages[0] || "en").toLowerCase();
  var path = window.location.pathname;
  var basePath = path.replace(/\/?$/, "/").replace(/index\.html$/, "");
  var target = "en";

  if (primary.indexOf("pt") === 0) {
    target = "pt-br";
  } else if (primary.indexOf("es") === 0) {
    target = "es";
  }

  window.location.replace(basePath + target + "/");
})();
