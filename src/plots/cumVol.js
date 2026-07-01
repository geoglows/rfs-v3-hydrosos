import Plotly from "plotly.js-dist-min";

function percentile(arr, p) {

    const idx = (p / 100) * (arr.length - 1);
  
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
  
    if (lower === upper) {
      return arr[lower];
    }
  
    return (
      arr[lower] +
      (arr[upper] - arr[lower]) *
      (idx - lower)
    );
  }

export function plotCumulativeVolume(data) {

  const dates = data.datetime;
  const flows = data[data.metadata.river_id];

  // Build daily records
  const records = dates.map((d, i) => ({
    date: new Date(d),
    flow: flows[i]
  }));

  // Daily volume
  records.forEach(r => {
    r.volume = r.flow * 86400;
  });

  // Water year + day
  records.forEach(r => {

    const year = r.date.getUTCFullYear();
    const month = r.date.getUTCMonth() + 1;

    r.waterYear = month >= 10 ? year + 1 : year;

    const wyStart =
      month >= 10
        ? new Date(Date.UTC(year, 9, 1))
        : new Date(Date.UTC(year - 1, 9, 1));

    r.wyDay =
      Math.floor(
        (r.date - wyStart) / (1000 * 60 * 60 * 24)
      ) + 1;
  });

  const byWY = {};

  records.forEach(r => {

    if (!byWY[r.waterYear]) {
      byWY[r.waterYear] = [];
    }

    byWY[r.waterYear].push(r);
  });

  const curves = {};

Object.entries(byWY).forEach(([wy, rows]) => {

  let cumulative = 0;

  curves[wy] = [];

  rows.forEach(r => {

    cumulative += r.volume;

    curves[wy].push({
      day: r.wyDay,
      cumulative
    });

  });

});

const today = new Date();

const currentWY =
  today.getUTCMonth() >= 9
    ? today.getUTCFullYear() + 1
    : today.getUTCFullYear();

    const traces = [];

    Object.entries(curves).forEach(([wy, curve]) => {
    
      traces.push({
        x: curve.map(p => p.day),
        y: curve.map(p => p.cumulative / 1e9),
    
        mode: "lines",
        showlegend: false,
    
        line: {
          width: 1,
          color: "rgba(150,150,150,0.15)"
        }
      });
    
    });

    const medianCurve = [];
const p25Curve = [];
const p75Curve = [];

for (let day = 1; day <= 366; day++) {

  const values = [];

  Object.values(curves).forEach(curve => {

    const point = curve.find(p => p.day === day);

    if (point) {
      values.push(point.cumulative);
    }

  });

  if (values.length === 0) continue;

  values.sort((a, b) => a - b);

  medianCurve.push({
    day,
    value: percentile(values, 50)
  });

  p25Curve.push({
    day,
    value: percentile(values, 25)
  });

  p75Curve.push({
    day,
    value: percentile(values, 75)
  });

}

traces.push({
    x: p25Curve.map(p => p.day),
    y: p25Curve.map(p => p.value / 1e9),
  
    mode: "lines",
    name: "25th Percentile",
  
    line: {
      dash: "dash",
      width: 2
    }
  });
  
  traces.push({
    x: p75Curve.map(p => p.day),
    y: p75Curve.map(p => p.value / 1e9),
  
    mode: "lines",
    name: "75th Percentile",
  
    line: {
      dash: "dash",
      width: 2
    }
  });
  
  traces.push({
    x: medianCurve.map(p => p.day),
    y: medianCurve.map(p => p.value / 1e9),
  
    mode: "lines",
    name: "Median",
  
    line: {
      width: 4,
      color: "black"
    }
  });

  const currentCurve = curves[currentWY];

if (currentCurve) {

  traces.push({
    x: currentCurve.map(p => p.day),
    y: currentCurve.map(p => p.cumulative / 1e9),

    mode: "lines",

    name: `${currentWY}`,

    line: {
      width: 4,
      color: "blue"
    }
  });

}Plotly.newPlot(
    "cumulative-volume",
    traces,
    {
      title: "Historical Cumulative Volume",
  
      xaxis: {
        title: "Water Year Day"
      },
  
      yaxis: {
        title: "Cumulative Volume (Billion m³)"
      },
  
      legend: {
        orientation: "h"
      }
    }
  );
}