import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { Log, DailyLog } from "@type/log";

const useCompletedHabitPeriods = () => {
    const { logs } = useData();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    const bgColor = theme.colors.primary;

    const completedHabitPeriods = useMemo(() => {
        if (!logs || logs.length === 0) {
            return { periods: {}, logsByDate: {} };
        }

        const completedDates = new Set<string>();
        const logsByDate: Record<string, DailyLog[]> = {};

        logs.forEach((logEntry: Log) => {
            logEntry.logs?.forEach((dailyLog: DailyLog) => {
                if (!dailyLog.date) return;

                const logDate = dayjs(dailyLog.date).format("YYYY-MM-DD");

                completedDates.add(logDate);

                if (!logsByDate[logDate]) {
                    logsByDate[logDate] = [];
                }
                logsByDate[logDate].push(dailyLog);
            });
        });

        const sortedDates = Array.from(completedDates).sort();

        const periods: Record<string, any> = {};
        if (sortedDates.length === 0) {
            return { periods, logsByDate };
        }

        let start = sortedDates[0];
        let end = start;

        sortedDates.forEach((currentDate, index) => {
            if (index === 0) return;

            const previousDate = dayjs(sortedDates[index - 1]);
            if (dayjs(currentDate).diff(previousDate, "day") === 1) {
                end = currentDate;
            } else {
                addPeriod(start, end, periods, bgColor);
                start = currentDate;
                end = start;
            }
        });

        addPeriod(start, end, periods, bgColor);

        const today = dayjs().format("YYYY-MM-DD");
        const highlightColor = theme.dark ? "#ffcc00" : "#C95355";
        if (periods[today]) {
            periods[today].color = highlightColor;
            periods[today].textColor = "white";
        } else {
            periods[today] = {
                startingDay: true,
                endingDay: true,
                color: highlightColor,
                textColor: "white",
            };
        }

        return { periods, logsByDate };
    }, [logs, theme.dark, bgColor]);

    useEffect(() => {
        if (logs) setLoading(false);
    }, [logs]);

    return {
        completedHabitPeriods: completedHabitPeriods.periods,
        logsByDate: completedHabitPeriods.logsByDate,
        loading,
    };
};

/**
 * Ajoute une période au tableau des périodes
 */
const addPeriod = (
    start: string,
    end: string,
    periods: Record<string, any>,
    bgColor: string
) => {
    if (start === end) {
        periods[start] = {
            startingDay: true,
            endingDay: true,
            color: bgColor,
            textColor: "white",
        };
    } else {
        periods[start] = {
            startingDay: true,
            color: bgColor,
            textColor: "white",
        };
        periods[end] = {
            endingDay: true,
            color: bgColor,
            textColor: "white",
        };

        let day = dayjs(start).add(1, "day");
        while (day.isBefore(dayjs(end))) {
            periods[day.format("YYYY-MM-DD")] = {
                color: bgColor,
                textColor: "white",
            };
            day = day.add(1, "day");
        }
    }
};

export default useCompletedHabitPeriods;