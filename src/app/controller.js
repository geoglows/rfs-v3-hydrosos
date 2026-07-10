import { addRasterLayer } from "../map/rasterLayer.js";
import { createMap } from "../map/initMap.js";
import { addBasinLayer } from "../map/basinLayer.js";
import { findLatestTif } from "../utils/findLatestTif.js";
import { fetchRetrospective } from "../data/fetchRetrospective.js";
import { drawHydrograph } from "../plots/hydrograph.js";
import { plotCumulativeVolume } from "../plots/cumVol.js";
import { plotHydroSOSBands } from "../plots/hydroSOSbands.js";
import { plotForecastEnvelope } from "../plots/forecastEnvelope.js";
import { buildRecords } from "../utils/buildRecords.js";
import { getHydroSOSData } from "../utils/getHydroSOSdata.js";
import Plotly from "plotly.js-dist-min";

export async function initApp() {
  const map = createMap();
  const tifUrl = await findLatestTif();


await addRasterLayer(map, tifUrl);

const modal =
    document.getElementById("basin-modal");

function closePanel() {

    modal.classList.add("hidden");

    document.getElementById("loading").style.display = "none";

    Plotly.purge("hydrograph");
    Plotly.purge("cumulative-volume");
    Plotly.purge("hydrosos-bands");
    Plotly.purge("forecast-envelope");

}

document
    .getElementById("close-modal")
    .addEventListener("click", closePanel);

modal.addEventListener("click", (event) => {

    // Only close if they clicked the dark overlay,
    // not the panel itself.
    if (event.target === modal) {

        closePanel();

    }

});

  const hydrobasins = await fetch(
    "/hydrobasins_web.geojson"
  ).then(r => r.json());

  const outletLookup = await fetch(
    "/outlet_lookup.json"
).then(r => r.json());

  addBasinLayer(map, hydrobasins, async (feature) => {
    document
    .getElementById("basin-modal")
    .classList.remove("hidden");

    const props = feature.properties;

    const riverID =
      outletLookup[props.HYBAS_ID].riverID;
  
    document.getElementById("basin-info").innerHTML = `
      <h3>Basin Information</h3>
      <p><strong>Hydrobasin ID:</strong> ${props.HYBAS_ID}</p>
      <p><strong>Outlet River ID:</strong> ${riverID}</p>
    `;

    document.getElementById("loading").style.display = "flex";

try {

  
  const data =
      await fetchRetrospective(riverID);

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

plotForecastEnvelope(data);

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