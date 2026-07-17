import Plotly from "plotly.js-dist-min";

import { buildRecords } from "../utils/buildRecords.js";
import { getHistoricalForecastCurves } from "../utils/getHistoricalForecastCurves.js";
import { computeForecastEnvelope } from "../utils/computeForecastEnvelope.js";
import { computeDailyPercentileBands } from "../utils/computeDailyPercentileBands.js";
import { computeRollingWindowCurves } from "../utils/computeRollingWindowCurves.js";


export function plotForecastEnvelope(data) {

    const records = buildRecords(data);
   
    const rollingCurves =
    computeRollingWindowCurves(records);

    const cumulativeCurves = rollingCurves.map(curve => {

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

    const today = new Date();

        const historicalCurves =
        cumulativeCurves
            .filter(c => c.year < today.getUTCFullYear())
            .sort((a,b) => a.year - b.year)
            .slice(-30);

    const currentCurve =
    cumulativeCurves.find(
        c => c.year === today.getUTCFullYear()
    );

    const lastObservedDate =
    currentCurve.dates[currentCurve.cumulativeVolume.length - 1];


    const historicalForecasts =
    getHistoricalForecastCurves(
        historicalCurves,
        currentCurve,
        lastObservedDate
    );

    const forecast =
        computeForecastEnvelope(
            historicalForecasts
        );

        const dailyBands =
        computeDailyPercentileBands(historicalCurves);

        const currentVolume =
        currentCurve.cumulativeVolume.at(-1);

    const currentX =
        currentCurve.dates.at(-1);

        const forecastMedian =
        forecast.median.map(
            v => currentVolume + v
        );

    const forecastP25 =
        forecast.p25.map(
            v => currentVolume + v
        );

    const forecastP75 =
        forecast.p75.map(
            v => currentVolume + v
        );

    const forecastMin =
        forecast.minimum.map(
            v => currentVolume + v
        );

    const forecastMax =
        forecast.maximum.map(
            v => currentVolume + v
        );


        // plot

        const traces = [];

        // HydroSOS Bands

        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.minimum,
        
            mode: "lines",
        
            line: { width: 0 },
        
            showlegend: false,

            hoverinfo: "skip"
        
        });

        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.p10,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(220,80,80,.12)",
        
            line: { width: 0.5 },
        
            name: "Very Dry"
        
        });
    
    
        // Dry
        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.p25,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(255,170,60,.12)",
        
            line: { color: "red",
                width: 0.5 },
        
            name: "Dry"
        
        });
    
        // Normal
    
        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.p75,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(160,160,160,.12)",
        
            line: { width: 0.5 },
        
            name: "Normal"
        
        });
    
    
    
        // Wet
    
        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.p90,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(70,150,220,.12)",
        
            line: { color: "blue",
                width: 0.5 },
        
            name: "Wet"
        
        });

        // Very Wet
        traces.push({

            x: dailyBands.dates,
        
            y: dailyBands.maximum,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(40,90,180,.12)",
        
            line: { width: 0.5 },
        
            name: "Very Wet"
        
        });

        // forecast envelope

        traces.push({

            x: forecast.dates,
        
            y: forecastMax,
        
            mode: "lines",
        
            line: {
                color: "green",
                width: 2,
                dash: "dash"
            },
        
            showlegend: false,

            hovertemplate:
        "%{x|%b %d}<br>" +
        "%{y:.2f} billion m³" +
        "<extra></extra>"
        
        });

        traces.push({

            x: forecast.dates,
        
            y: forecastMin,
        
            fill: "tonexty",
        
            fillcolor: "rgba(180,180,180,.25)",
        
            line: {
                color: "red",
                width: 2,
                dash: "dash"
            },
        
            name: "Historical Minimum",

            hovertemplate:
        "%{x|%b %d}<br>" +
        "%{y:.2f} billion m³" +
        "<extra></extra>"
        
        });

        traces.push({

            x: forecast.dates,
        
            y: forecastP25,
        
            mode: "lines",
        
            line: {
                width: 0
            },
        
            showlegend: false
        
        });

        traces.push({

            x: forecast.dates,
        
            y: forecastP75,
        
            mode: "lines",
        
            line: {
                width: 0
            },
        
            showlegend: false
        
        });

        traces.push({

            x: forecast.dates,
        
            y: forecastMedian,
        
            mode: "lines",
        
            name: "30-year Median Forecast",
        
            line: {
        
                color: "#1f77b4",
        
                width: 4,

                dash: "dash"
        
            },

            hovertemplate:
        "%{x|%b %d}<br>" +
        "%{y:.2f} billion m³" +
        "<extra></extra>"
        
        });

        // Current year

        traces.push({

            x: currentCurve.dates,
        
            y: currentCurve.cumulativeVolume,
        
            mode: "lines",
        
            name: "Observed",
        
            line: {
        
                color: "black",
        
                width: 4
        
            },

            hovertemplate:
        "%{x|%b %d}<br>" +
        "%{y:.2f} billion m³" +
        "<extra></extra>"

        
        });

        Plotly.newPlot(

            "forecast-envelope",
        
            traces,
        
            {
        
                title:
                    {text: "Three-Month Seasonal Outlook"},
        
                xaxis: {
        
                    title:
                        "Water Year",

                        tickformat: "%b",

                        dtick: "M1",

                        ticklabelmode: "period"
        
                },
        
                yaxis: {
        
                    title:
                        "Cumulative Volume (m³)"
        
                }
        
            }
        
        );

        console.log("Today:", today);
console.log("Observed ends:", currentCurve.dates.at(-1));
console.log("Forecast starts:", forecast.dates[0]);
console.log("Current curve length:", currentCurve.dates.length);
console.log(currentCurve.dates.slice(-10));
console.log(forecast.dates.slice(0,10));
console.log(
    "Last observed date:",
    currentCurve.dates[
        currentCurve.cumulativeVolume.length - 1
    ]
);

      

    }