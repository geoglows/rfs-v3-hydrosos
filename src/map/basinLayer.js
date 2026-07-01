import L from "leaflet";
let selectedLayer = null;

export function addBasinLayer(map, geojson, onClick) {
    const layer = L.geoJSON(geojson, {
      style: {
        fillOpacity: 0,
        color: "#808080",
        weight: 1
      },
      onEachFeature: (feature, l) => {
        l.on("click", () => {

          if (selectedLayer) {
            selectedLayer.setStyle({
              fillOpacity: 0,
              color: "#808080",
              weight: 1
            });
          }
        
          l.setStyle({
            fillOpacity: 0.2,
            fillColor: "#3388ff",
            color: "#3388ff",
            weight: 3
          });
        
          selectedLayer = l;
        
          onClick(feature);
        });
      }
    });
  
    layer.addTo(map);
    layer.bringToFront();
  
    return layer;
  }