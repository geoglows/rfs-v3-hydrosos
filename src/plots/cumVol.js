import Plotly from "plotly.js-dist-min";
import { computeRollingWindowCurves } from "../utils/computeRollingWindowCurves";
import { buildRecords } from "../utils/buildRecords";
import { computeMedianCurve } from "../utils/computeMedianCurve";

export function plotCumulativeVolume(data) {

    const records = buildRecords(data);

    const curves =
        computeRollingWindowCurves(records);

        const cumulativeCurves = curves.map(curve => {

            let runningTotal = 0;
        
            return {
        
                year: curve.year,
        
                dates: curve.referenceDates,
        
                cumulativeVolume: curve.records.map(record => {
        
                    runningTotal += record.volume;
        
                    return runningTotal;
        
                })
        
            };
        
        });

        

    const traces = cumulativeCurves.map(curve => ({

        x: curve.dates,

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
const today = new Date();

const currentWaterYear =
    today.getUTCMonth() >= 9
        ? today.getUTCFullYear() + 1
        : today.getUTCFullYear();

const recentCurves = cumulativeCurves
    .filter(curve => curve.year < today.getUTCFullYear()) // exclude current incomplete WY
    .sort((a, b) => a.year - b.year)
    .slice(-30);

const median = computeMedianCurve(recentCurves);

traces.push({

    x: median.dates,
    y: median.cumulativeVolume.map(
        volume => volume / 1e9
    ),

    mode: "lines",

    name: "30-year Median",

    line: {
        color: "#1f77b4",
        width: 4
    }

});

        const currentCurve = cumulativeCurves.find(
            c => c.year === currentWaterYear
        );

        if (currentCurve) {

            traces.push({
        
                x: currentCurve.dates,
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
                text: "Historical Cumulative Volume",
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




