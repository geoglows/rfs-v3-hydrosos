export function computeCurrentYearMonthly(monthlyMeans) {

    const currentYear =
        new Date().getUTCFullYear();

        const currentYearMonthly = [];

        const today = new Date();
        
        const currentMonth = today.getUTCMonth() + 1;
        const currentDay = today.getUTCDate();
        
        const daysInCurrentMonth = new Date(
            Date.UTC(
                today.getUTCFullYear(),
                currentMonth,
                0
            )
        ).getUTCDate();
        
        const halfwayPoint = daysInCurrentMonth / 2;
        
        for (let month = 1; month <= 12; month++) {
        
            // Future months stay blank
            if (month > currentMonth) {
        
                currentYearMonthly.push(null);
                continue;
        
            }
        
            // If we're in the current month but haven't reached halfway,
            // don't plot it yet.
            if (
                month === currentMonth &&
                currentDay < halfwayPoint
            ) {
        
                currentYearMonthly.push(null);
                continue;
        
            }
        
            currentYearMonthly.push(
                monthlyMeans[currentYear]?.[month] ?? null
            );
        
        }

    return {
        currentYear,
        currentYearMonthly
    };

}