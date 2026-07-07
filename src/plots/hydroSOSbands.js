import Plotly from "plotly.js-dist-min";


export function plotHydroSOSBands(
    bands,
    currentYearMonthly
) {

    const months = [
        "Jan","Feb","Mar",
        "Apr","May","Jun",
        "Jul","Aug","Sep",
        "Oct","Nov","Dec"
    ];

    const p10 = bands.map(b => b.p10);
    const p25 = bands.map(b => b.p25);
    const p75 = bands.map(b => b.p75);
    const p90 = bands.map(b => b.p90);
    const p95 = bands.map(b => b.p95);

    
    const traces = [];


    // Very Dry boundary
    traces.push({

        x: months,
        y: p10,
    
        mode: "lines",
    
        fill: "tozeroy",
    
        fillcolor:
            "rgba(180,0,0,0.25)",
    
        line:{
            width:0
        },
    
        name:"Very Dry"
    
    });
    


    // Dry
    traces.push({

        x: months,
        y: p25,
    
        mode:"lines",
    
        fill:"tonexty",
    
        fillcolor:
            "rgba(255,165,0,0.35)",
    
        line:{
            width:0
        },
    
        name:"Dry"
    
    });


    // Normal

    traces.push({

        x: months,
        y:p75,
    
        mode:"lines",
    
        fill:"tonexty",
    
        fillcolor:
            "rgba(150,150,150,0.25)",
    
        line:{
            width:0
        },
    
        name:"Normal"
    
    });



    // Wet

    traces.push({

        x: months,
        y:p90,
    
        mode:"lines",
    
        fill:"tonexty",
    
        fillcolor:
            "rgba(0,150,255,0.35)",
    
        line:{
            width:0
        },
    
        name:"Wet"
    
    });

    // Very Wet
    traces.push({

        x: months,
        y:p95,
    
        mode:"lines",
    
        fill:"tonexty",
    
        fillcolor:
            "rgba(0,80,200,0.35)",
    
        line:{
            width:0
        },
    
        name:"Very Wet"
    
    });



    // Current year

    traces.push({

        x: months,

        y: currentYearMonthly,

        mode:
            "lines+markers",

        name:
            "Current Year",

        line:{
            color:"black",
            width:4
        },

        marker:{
            size:8
        }

    });


    const layout = {

        title: {
            text: "HydroSOS Monthly Flow Status"
        },
    
        xaxis: {
            title: {
                text: "Month"
            }
        },
    
        yaxis: {
            title: {
                text: "Mean Monthly Flow (m³/s)"
            }
        },
    
        showlegend: true
    
    };

    Plotly.newPlot(

        "hydrosos-bands",

        traces,

        layout

    );

}