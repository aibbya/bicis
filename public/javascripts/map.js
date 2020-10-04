var mymap = L.map("main_map").setView([-34.6157437, -58.5733858], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "https://www.openstreetmap.org",
}).addTo(mymap);

// L.marker([-34.559098, -58.4957157]).addTo(mymap);
// L.marker([-34.5577394, -58.4962143]).addTo(mymap);
// L.marker([-34.5563071, -58.4965326]).addTo(mymap);

$.ajax({
  dataType: "json",
  url: "api/bicicletas",
  success: function (result) {
    console.log(result);
    result.bicicletas.forEach(function (bici) {
      console.log(bici);
      L.marker(bici.ubicacion, { title: bici.id }).addTo(mymap);
    });
  },
});
