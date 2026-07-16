import { getRollingMonths } from "./getRollingMonths.js";

export function computeCurrentYearMonthly(monthlyMeans) {

    const today = new Date();

    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth() + 1;
    const currentDay = today.getUTCDate();

    const daysInCurrentMonth = new Date(
        Date.UTC(currentYear, currentMonth, 0)
    ).getUTCDate();

    const halfwayPoint = daysInCurrentMonth / 2;

    const rollingMonths = getRollingMonths();

    const currentYearMonthly = [];

    // The first 9 months are observed, the last 3 are future.
    const observedMonths = rollingMonths.length - 3;

    rollingMonths.forEach((month, index) => {

        // Determine which calendar year this month belongs to.
        const dataYear =
            month > currentMonth
                ? currentYear - 1
                : currentYear;

        // Leave the future 3 months blank.
        if (index >= observedMonths) {
            currentYearMonthly.push(null);
            return;
        }

        // Don't plot the current month until halfway through.
        if (
            month === currentMonth &&
            currentDay < halfwayPoint
        ) {
            currentYearMonthly.push(null);
            return;
        }

        currentYearMonthly.push(
            monthlyMeans[dataYear]?.[month] ?? null
        );

    });

    return {
        currentYear,
        currentYearMonthly
    };

}