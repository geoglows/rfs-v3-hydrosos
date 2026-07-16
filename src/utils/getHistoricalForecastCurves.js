export function getHistoricalForecastCurves(
    historicalCurves,
    currentCurve
) {

    const today = new Date();

    // Find today's position in the rolling window
    const startIndex = currentCurve.dates.findIndex(
        d => d >= today
    );

    if (startIndex === -1) {
        return [];
    }

    return historicalCurves
        .map(curve => {

            const dates = curve.dates.slice(startIndex);

            const cumulativeVolume =
                curve.cumulativeVolume.slice(startIndex);

            const startVolume = cumulativeVolume[0];

            const incrementalVolume =
                cumulativeVolume.map(
                    v => v - startVolume
                );

            return {

                year: curve.year,

                dates,

                startVolume,

                endVolume: cumulativeVolume.at(-1),

                incrementalVolume

            };

        });

}