import L from "leaflet";
import { createMap } from "../map/initMap.js";
import { addBasinLayer } from "../map/basinLayer.js";

export async function initApp() {
  const map = createMap();

  const hydrobasins = await fetch(
    "/hydrobasins.geojson"
  ).then(r => r.json());

  addBasinLayer(map, hydrobasins, (feature) => {
    const props = feature.properties;
  
    document.getElementById("basin-info").innerHTML = `
      <h3>Basin Information</h3>
      <p><strong>HYBAS_ID:</strong> ${props.HYBAS_ID}</p>
      <p><strong>Area:</strong> ${props.AREA_SQKM}</p>
    `;
  });
}

// export async function initApp() {
//     const map = createMap();
  
//     const tifUrl =
//       "http://geoglows-v2.s3-us-west-2.amazonaws.com/hydrosos/cogs/1990-06.tif";
  
//     try {
//       const response = await fetch(tifUrl);
  
//       console.log("Status:", response.status);
//       console.log("Content-Type:", response.headers.get("content-type"));
//     } catch (err) {
//       console.error(err);
//     }
//   }