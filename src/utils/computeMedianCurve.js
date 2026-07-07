import { percentile } from "./percentile.js";

export function computeMedianCurve(curves) {

    const maxLength = Math.max(
        ...curves.map(
            c => c.cumulativeVolume.length
        )
    );

    const days = [];
    const cumulativeVolume = [];

    for (let i = 0; i < maxLength; i++) {

        const values = curves
            .map(c => c.cumulativeVolume[i])
            .filter(v => v !== undefined);

        if (values.length === 0) continue;

        const date = new Date(
            Date.UTC(2000, 9, 1 + i)
        );

        days.push(date);

        cumulativeVolume.push(
            percentile(values, 50)
        );
    }

    return {
        days,
        cumulativeVolume
    };
}