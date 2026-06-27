import L from "leaflet";

export function addBasinLayer(map, geojson, onClick) {
    const layer = L.geoJSON(geojson, {
      style: {
        fillOpacity: 0,
        color: "#808080",
        weight: 1
      },
      onEachFeature: (feature, l) => {
        l.on("click", () => onClick(feature));
      }
    });
  
    layer.addTo(map);
    layer.bringToFront();
  
    return layer;
  }