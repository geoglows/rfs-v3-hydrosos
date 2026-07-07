import Plotly from "plotly.js-dist-min";

export function drawHydrograph(hydrographData) {
  Plotly.newPlot(
    "hydrograph",
    [
      {
        x: hydrographData.map(d => d.date),
        y: hydrographData.map(d => d.flow),
        mode: "lines",
        name: "Discharge"
      }
    ],
    {
      title: {text: "Historical Daily Discharge"},
      xaxis: {
        title: "Date"
      },
      yaxis: {
        title: "Flow (m³/s)"
      },
      margin: {
        t: 50
      }
    },
    {
      responsive: true
    }
  );
}