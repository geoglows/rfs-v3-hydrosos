import L from "leaflet";
import { addRasterLayer } from "../map/rasterLayer.js";
import { createMap } from "../map/initMap.js";
import { addBasinLayer } from "../map/basinLayer.js";
import { findLatestTif } from "../utils/findLatestTif.js";
import { fetchRetrospective } from "../data/fetchRetrospective.js";
import { drawHydrograph } from "../plots/hydrograph.js";
import { plotCumulativeVolume } from "../plots/cumVol.js";
import { drawFDC } from "../plots/fdc.js";

export async function initApp() {
  const map = createMap();
  const tifUrl = await findLatestTif();


await addRasterLayer(map, tifUrl);

document
  .getElementById("close-modal")
  .addEventListener("click", () => {

    document
      .getElementById("basin-modal")
      .classList.add("hidden");

  });

  const hydrobasins = await fetch(
    "/hydrobasins_web.geojson"
  ).then(r => r.json());

  addBasinLayer(map, hydrobasins, async (feature) => {
    document
    .getElementById("basin-modal")
    .classList.remove("hidden");

    const props = feature.properties;
  
    document.getElementById("basin-info").innerHTML = `
      <h3>Basin Information</h3>
      <p><strong>Hydrobasin ID:</strong> ${props.HYBAS_ID}</p>
      <p><strong>Link Number:</strong> ${props.LINKNO}</p>
    `;

    document.getElementById("loading").style.display = "block";
  
    const data = await fetchRetrospective(props.LINKNO);

    document.getElementById("loading").style.display = "none";
  
    const flowSeries = data[props.LINKNO];
    const dates = data.datetime;
    
    const hydrographData = dates.map((date, i) => ({
      date,
      flow: flowSeries[i]
    }));
    drawHydrograph(hydrographData);
    drawFDC(hydrographData);
    plotCumulativeVolume(data);

    console.log(hydrographData.slice(0, 5));
    console.log(props.LINKNO);
    console.log(data.metadata.river_id);  
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