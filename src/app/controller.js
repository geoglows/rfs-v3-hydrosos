import {addRasterLayer} from "../map/rasterLayer.js";
import {createMap} from "../map/initMap.js";
import {findLatestTif} from "../utils/findLatestTif.js";
import {fetchRetrospective} from "../data/fetchRetrospective.js";
import {plotCumulativeVolume} from "../plots/cumVol.js";
import {plotHydroSOSBands} from "../plots/hydroSOSbands.js";
import {plotForecastEnvelope} from "../plots/forecastEnvelope.js";
import {buildRecords} from "../utils/buildRecords.js";
import {getHydroSOSData} from "../utils/getHydroSOSdata.js";
import {addBasinLayer, selectBasin} from "../map/basinLayer.js";
import { setupAccordion } from "../utils/setupAccordion.js";
import Plotly from "plotly.js-dist-min";

export async function initApp() {
  const map = createMap();
  const tifUrl = await findLatestTif();


  await addRasterLayer(map, tifUrl);

  const modal = document.getElementById("basin-modal");

  function closePanel() {

    modal.classList.add("hidden");

    document.getElementById("loading").style.display = "none";

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
    if (event.target === modal) closePanel();
  });

  // Corrects the url builder so this could work in multiple environments
  const base = import.meta.env.BASE_URL;
  const hydrobasins = await fetch(`${base}hydrobasins_web.geojson`).then(r => r.json());
  const outletLookup = await fetch(`${base}outlet_lookup.json`).then(r => r.json());

// -------------------------------
// Open a basin (used by BOTH clicks and search)
// -------------------------------

  async function openBasin(feature) {

    document
      .getElementById("basin-modal")
      .classList.remove("hidden");

      const modalContent = document.querySelector(".modal-content");
      modalContent.scrollTop = 0;

      // Reset accordion to all sections open
      document
      .querySelectorAll(".accordion-item")
      .forEach(item => item.classList.add("active"));

    const props = feature.properties;

    const riverID =
      outletLookup[props.HYBAS_ID].riverID;

    document.getElementById("basin-info").innerHTML = `
      <h2>Basin Information</h2>
      <p><strong>Hydrobasin ID:</strong> ${props.HYBAS_ID}</p>
      <p><strong>Outlet River ID:</strong> ${riverID}</p>
  `;

    document.getElementById("loading").style.display = "flex";

    try {

      const data =
        await fetchRetrospective(riverID);


      plotCumulativeVolume(data);

      const records =
        buildRecords(data);

      const hydroSOSData =
        getHydroSOSData(records);

      plotHydroSOSBands(
        hydroSOSData.bands,
        hydroSOSData.currentYearMonthly
      );

      plotForecastEnvelope(data);

      setupAccordion(); 

    } catch (error) {

      console.error(error);

      alert("Unable to load basin data.");

    } finally {

      document.getElementById("loading").style.display = "none";

    }

  }


// -------------------------------
// Add basin layer
// -------------------------------

  addBasinLayer(
    map,
    hydrobasins,
    openBasin
  );


// -------------------------------
// Search
// -------------------------------

  const searchBox = document.getElementById("basin-search");

  const searchButton = document.getElementById("search-button");


  function runSearch() {

    const hybasID =
      searchBox.value.trim();

    const feature =
      selectBasin(hybasID, map);

    if (!feature) {

      alert("HYBAS_ID not found.");

      return;

    }

    openBasin(feature);

  }


  searchButton.addEventListener(
    "click",
    runSearch
  );


  searchBox.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        runSearch();

      }

    }
  )
};
