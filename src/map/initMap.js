import L from "leaflet";
import "leaflet/dist/leaflet.css";

console.log("HELLO FROM INITMAP");

export function createMap() {
    const map = L.map("map").setView([20, 0], 2);
  
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18
      }
    ).addTo(map);
  
    return map;
  }