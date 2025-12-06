const DEFAULT_YEARS_BACK = 3;
const DEFAULT_DAILY_UPDATE_HOUR = 9;
const DEFAULT_DAILY_UPDATE_MINUTE = 0;

let yearsBack = DEFAULT_YEARS_BACK;
let dailyUpdateHour = DEFAULT_DAILY_UPDATE_HOUR;
let dailyUpdateMinute = DEFAULT_DAILY_UPDATE_MINUTE;
let lastOpenedDate: string | null = null;
let extensionAPIRef: any = null;

export function getYearsBack(): number {
  return yearsBack;
}

export function getDailyUpdateHour(): number {
  return dailyUpdateHour;
}

export function getDailyUpdateMinute(): number {
  return dailyUpdateMinute;
}

export function getLastOpenedDate(): string | null {
  return lastOpenedDate;
}

export function setLastOpenedDate(date: string | null): void {
  lastOpenedDate = date;
  if (extensionAPIRef && date) {
    extensionAPIRef.settings.set("last-opened-date", date);
  }
}

export function loadInitialSettings(extensionAPI: any) {
  extensionAPIRef = extensionAPI;

  const savedYearsBack = extensionAPI.settings.get("years-back");
  yearsBack = savedYearsBack ? parseInt(savedYearsBack) : DEFAULT_YEARS_BACK;

  const savedUpdateHour = extensionAPI.settings.get(
    "hour-to-open-last-year-today-page"
  );
  dailyUpdateHour = savedUpdateHour
    ? parseInt(savedUpdateHour)
    : DEFAULT_DAILY_UPDATE_HOUR;

  const savedUpdateMinute = extensionAPI.settings.get(
    "minute-to-open-last-year-today-page"
  );
  dailyUpdateMinute = savedUpdateMinute
    ? parseInt(savedUpdateMinute)
    : DEFAULT_DAILY_UPDATE_MINUTE;

  // Load last opened date from persistent storage
  const savedLastOpenedDate = extensionAPI.settings.get("last-opened-date");
  lastOpenedDate = savedLastOpenedDate || null;
  console.log("Loaded lastOpenedDate from storage:", lastOpenedDate);
}

export function initPanelConfig(extensionAPI: any) {
  return {
    tabTitle: "Last Year Today",
    settings: [
      {
        id: "years-back",
        name: "Years Back",
        description: `Number of years to look back (default: ${DEFAULT_YEARS_BACK}, max: 10)`,
        action: {
          type: "input",
          onChange: (evt: any) => {
            console.log("yearsBack onChange", evt);
            if (!evt?.target?.value) return;

            const value = parseInt(evt.target.value);
            yearsBack = isNaN(value)
              ? DEFAULT_YEARS_BACK
              : Math.min(Math.max(value, 1), 10);

            Promise.resolve(
              extensionAPI.settings.set("years-back", yearsBack.toString())
            ).then(() => {
              console.log("yearsBack settingsChanged to", yearsBack);
            });
          },
        },
      },
      {
        id: "hour-to-open-last-year-today-page",
        name: "Hour to Open Last Year Today Page",
        description: `Hour of the day to open Last Year Today page (0-23, default: ${DEFAULT_DAILY_UPDATE_HOUR})`,
        action: {
          type: "input",
          onChange: (evt: any) => {
            console.log("dailyUpdateHour onChange", evt);
            if (!evt?.target?.value) return;

            const value = parseInt(evt.target.value);
            dailyUpdateHour = isNaN(value)
              ? DEFAULT_DAILY_UPDATE_HOUR
              : Math.min(Math.max(value, 0), 23);

            Promise.resolve(
              extensionAPI.settings.set(
                "hour-to-open-last-year-today-page",
                dailyUpdateHour.toString()
              )
            ).then(() => {
              console.log("dailyUpdateHour settingsChanged to", dailyUpdateHour);
            });
          },
        },
      },
      {
        id: "minute-to-open-last-year-today-page",
        name: "Minute to Open Last Year Today Page",
        description: `Minute of the hour to open Last Year Today page (0-59, default: ${DEFAULT_DAILY_UPDATE_MINUTE})`,
        action: {
          type: "input",
          onChange: (evt: any) => {
            console.log("dailyUpdateMinute onChange", evt);
            if (!evt?.target?.value) return;

            const value = parseInt(evt.target.value);
            dailyUpdateMinute = isNaN(value)
              ? DEFAULT_DAILY_UPDATE_MINUTE
              : Math.min(Math.max(value, 0), 59);

            Promise.resolve(
              extensionAPI.settings.set(
                "minute-to-open-last-year-today-page",
                dailyUpdateMinute.toString()
              )
            ).then(() => {
              console.log("dailyUpdateMinute settingsChanged to", dailyUpdateMinute);
            });
          },
        },
      },
    ],
  };
}
