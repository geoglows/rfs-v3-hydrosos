import { addRasterLayer } from "../map/rasterLayer.js";
import { createMap } from "../map/initMap.js";
import { addBasinLayer } from "../map/basinLayer.js";
import { findLatestTif } from "../utils/findLatestTif.js";
import { fetchRetrospective } from "../data/fetchRetrospective.js";
import { drawHydrograph } from "../plots/hydrograph.js";
import { plotCumulativeVolume } from "../plots/cumVol.js";
import { plotHydroSOSBands } from "../plots/hydroSOSbands.js";
import { buildRecords } from "../utils/buildRecords.js";
import { getHydroSOSData } from "../utils/getHydroSOSdata.js";
import Plotly from "plotly.js-dist-min";

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

    Plotly.purge("hydrograph");

    Plotly.purge("cumulative-volume");

    Plotly.purge("hydrosos-bands");


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

    document.getElementById("loading").style.display = "flex";

try {

    const data = await fetchRetrospective(props.LINKNO);

    const riverID = data.metadata.river_id;

    const flowSeries = data[riverID];
    const dates = data.datetime;

    const hydrographData = dates.map((date, i) => ({
        date,
        flow: flowSeries[i]
    }));

    drawHydrograph(hydrographData);
    plotCumulativeVolume(data);
    const records = buildRecords(data);

const hydroSOSData =
    getHydroSOSData(records);

plotHydroSOSBands(
    hydroSOSData.bands,
    hydroSOSData.currentYearMonthly
);

}


catch (error) {

    console.error(error);

    alert("Unable to load basin data.");

}

finally {

    document.getElementById("loading").style.display = "none";

}

});   // closes addBasinLayer()

} 