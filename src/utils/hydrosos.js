import { percentile } from "./percentile";

export function computeHydroSOSBands(
    monthlyMeans,
    referenceYear
){

    const bands = [];

    for(let month=1; month <=12; month++){
        const values = [];
        for(
            let y=referenceYear-30;
            y<referenceYear;
            y++
        ){

            const v = monthlyMeans[y]?.[month];

            if(v!==undefined) {
                values.push(v);
            }

        }

        bands.push({
            
            month,

            p10: percentile(values,10),

            p25: percentile(values, 25),

            median: percentile(values, 50),

            p75: percentile(values,75),

            p90: percentile(values, 90),

            p95: percentile(values,95)

        });
    }

    return bands;
}
