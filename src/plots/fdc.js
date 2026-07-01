import Plotly from "plotly.js-dist-min";

export function drawFDC(hydrographData) {
  const flows = hydrographData
    .map(d => d.flow)
    .filter(v => v != null);

  const sortedFlows = [...flows].sort((a, b) => b - a);

  const exceedance = sortedFlows.map(
    (_, i) => ((i + 1) / (sortedFlows.length + 1)) * 100
  );

  Plotly.newPlot(
    "fdc",
    [{
      x: exceedance,
      y: sortedFlows,
      mode: "lines",
      name: "FDC"
    }],
    {
      title: "Flow Duration Curve",
      xaxis: {
        title: "Exceedance Probability (%)"
      },
      yaxis: {
        title: "Flow (m³/s)",
        type: "log"   // optional but very common for FDCs
      }
    },
    {
      responsive: true
    }
  );
}