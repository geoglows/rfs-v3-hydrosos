import Plotly from "plotly.js-dist-min";

import { buildRecords } from "../utils/buildRecords.js";
import { computeWaterYearCurves } from "../utils/waterYear.js";
import { getCurrentWaterYearCurve } from "../utils/getCurrentWaterYearCurve.js";
import { getHistoricalForecastCurves } from "../utils/getHistoricalForecastCurves.js";
import { computeForecastEnvelope } from "../utils/computeForecastEnvelope.js";
import { computeDailyPercentileBands } from "../utils/computeDailyPercentileBands.js";


export function plotForecastEnvelope(data) {

    const records = buildRecords(data);

    const curves =
        computeWaterYearCurves(records);

    const currentCurve =
        getCurrentWaterYearCurve(curves);

        const historicalForecasts =
        getHistoricalForecastCurves(
            curves,
            currentCurve
        );

    const forecast =
        computeForecastEnvelope(
            historicalForecasts
        );

    const dailyBands =
        computeDailyPercentileBands(curves);

        const currentVolume =
        currentCurve.cumulativeVolume.at(-1);

    const currentX =
        currentCurve.days.at(-1);

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

        // test

        console.log(
            "Current endpoint:",
            currentCurve.days.at(-1),
            currentCurve.cumulativeVolume.at(-1)
        );
        
        console.log(
            "Forecast start:",
            forecast.days[0],
            forecast.median[0]
        );


        // plot

        const traces = [];

        // HydroSOS Bands

        traces.push({

            x: dailyBands.days,
        
            y: dailyBands.minimum,
        
            mode: "lines",
        
            line: { width: 0 },
        
            showlegend: false,
            
            hoverinfo: "skip"
        
        });

        traces.push({

            x: dailyBands.days,
        
            y: dailyBands.p10,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(220,80,80,.12)",
        
            line: { width: 0.5 },
        
            name: "Very Dry"
        
        });
    
    
        // Dry
        traces.push({

            x: dailyBands.days,
        
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

            x: dailyBands.days,
        
            y: dailyBands.p75,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(160,160,160,.12)",
        
            line: { width: 0.5 },
        
            name: "Normal"
        
        });
    
    
    
        // Wet
    
        traces.push({

            x: dailyBands.days,
        
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

            x: dailyBands.days,
        
            y: dailyBands.maximum,
        
            mode: "lines",
        
            fill: "tonexty",
        
            fillcolor: "rgba(40,90,180,.12)",
        
            line: { width: 0.5 },
        
            name: "Very Wet"
        
        });

        // forecast envelope

        traces.push({

            x: forecast.days,
        
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

            x: forecast.days,
        
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

            x: forecast.days,
        
            y: forecastP25,
        
            mode: "lines",
        
            line: {
                width: 0
            },
        
            showlegend: false
        
        });

        traces.push({

            x: forecast.days,
        
            y: forecastP75,
        
            mode: "lines",
        
            line: {
                width: 0
            },
        
            showlegend: false
        
        });

        traces.push({

            x: forecast.days,
        
            y: forecastMedian,
        
            mode: "lines",
        
            name: "Median Forecast",
        
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

            x: currentCurve.days,
        
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
                    {text: "Three-Month Seasonal Outlook (Prototype)"},
        
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

        // test

        console.log(currentCurve.days.slice(0,5));

console.log(dailyBands.days.slice(0,5));

console.log(forecast.days.slice(0,5));

    }