export function getRollingMonths() {

    const today = new Date();

    const currentMonth =
        today.getUTCMonth() + 1;

    const months = [];

    for (let i = -8; i <= 3; i++) {

        let month = currentMonth + i;

        if (month < 1) {
            month += 12;
        }

        if (month > 12) {
            month -= 12;
        }

        months.push(month);
    }

    return months;
}