export function computeCurrentYearMonthly(monthlyMeans) {

    const currentYear =
        new Date().getUTCFullYear();

    const currentYearMonthly = [];

    for (let month = 1; month <= 12; month++) {

        currentYearMonthly.push(
            monthlyMeans[currentYear]?.[month] ?? null
        );

    }

    return {
        currentYear,
        currentYearMonthly
    };

}