function View() {
  var dom = {
    kalea: $("#kalea"),
    bilatuBotoia: $(".js-bilatu"),
    mapa: $("#map"),
    formularioa: document.forms[1]
  };
  function onBilatuClick() {
    dom.bilatuBotoia.on("click", function(e) {
      e.preventDefault();
      var direccion = dom.kalea.val();
      if (direccion !== "") {
        localizar(dom.mapa[0], direccion + ", 48340 Amorebieta-Etxano");
      }
    });
  }
  function onSubmit() {
    $(dom.formularioa).on("submit", function(e) {
      e.preventDefault();
      console.log("Submitted");
      onBilatuClick();
    });
  }
  function onKeyPressed() {
    console.log("Init KeyPress");
    /*     dom.kalea.onKeypressed(function(e) {
      e.preventDefault();
      console.log("KeyPressed");
      if (e.which == 13) {
        console.log("Enter Presed");
        onBilatuClick();
      }
    });
 */
  }
  return {
    onBilatuClick: onBilatuClick,
    onSubmit: onSubmit,
    onKeyPressed: onKeyPressed
  };
}
