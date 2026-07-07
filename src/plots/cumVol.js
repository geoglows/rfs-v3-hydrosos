import Plotly from "plotly.js-dist-min";

import { buildRecords } from "../utils/buildRecords";
import { computeWaterYearCurves } from "../utils/waterYear";
import { computeMedianCurve } from "../utils/computeMedianCurve";

export function plotCumulativeVolume(data) {

    const records = buildRecords(data);

    const waterYearCurves =
        computeWaterYearCurves(records);

    const traces = waterYearCurves.map(curve => ({

        x: curve.days,

        y: curve.cumulativeVolume.map(
            volume => volume / 1e9
        ),

        mode: "lines",

        name: curve.waterYear,

        line: {
            color: "#cccccc",
            width: 1
        },
        opacity: 0.5,
        showlegend: false,
        hoverinfo: "skip"

}));
    const median = computeMedianCurve(waterYearCurves);

traces.push({

    x: median.days,
    y: median.cumulativeVolume.map(
        volume => volume / 1e9
    ),

    mode: "lines",

    name: "Median",

    line: {
        color: "#1f77b4",
        width: 4
    }

});

const today = new Date();

const currentWaterYear =
    today.getUTCMonth() >= 9
        ? today.getUTCFullYear() + 1
        : today.getUTCFullYear();

        const currentCurve = waterYearCurves.find(
            c => c.waterYear === currentWaterYear
        );

        if (currentCurve) {

            traces.push({
        
                x: currentCurve.days,
                y: currentCurve.cumulativeVolume.map(
                    volume => volume / 1e9
                ),
        
                mode: "lines",
        
                name: "Current Water Year",
        
                line: {
                    color: "black",
                    width: 4
                }
        
            });
        
        }
    
        const layout = {

            title: {
                text: "Historical Cumulative Volume (Water Year)",
                x: 0.5
            },
        
            xaxis: {

                title: "Date",
            
                type: "date",
            
                tickformat: "%b",
            
                dtick: "M1"
            
            },
        
            yaxis: {
                title: {
                    text: "Cumulative Volume (billion m³)"
                }
            },
        
            showlegend: true,
            legend: {
                orientation: "h",
                y: 1.1
            }
        
        };

    Plotly.newPlot(
        "cumulative-volume",
        traces,
        layout
    );

}