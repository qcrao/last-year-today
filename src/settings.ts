export let yearsBack = 1;
export let dailyUpdateHour = 9;

export function loadInitialSettings(extensionAPI: any) {
  const savedYearsBack = extensionAPI.settings.get("years-back");
  yearsBack = savedYearsBack ? parseInt(savedYearsBack) : 1;

  const savedUpdateHour = extensionAPI.settings.get("daily-update-hour");
  dailyUpdateHour = savedUpdateHour ? parseInt(savedUpdateHour) : 9;
}

export function initPanelConfig(extensionAPI: any) {
  return {
    tabTitle: "Last Year Today",
    settings: [
      {
        id: "years-back",
        name: "Years Back",
        description: "Number of years to look back (default: 1, max: 10)",
        action: {
          type: "input",
          onChange: (evt: any) => {
            const value = parseInt(evt.target.value);
            yearsBack = isNaN(value) ? 1 : Math.min(Math.max(value, 1), 10);
          },
        },
      },
      {
        id: "daily-update-hour",
        name: "Daily Update Hour",
        description: "Hour of the day to update (0-23, default: 9)",
        action: {
          type: "input",
          onChange: (evt: any) => {
            const value = parseInt(evt.target.value);
            dailyUpdateHour = isNaN(value) ? 9 : Math.min(Math.max(value, 0), 23);
          },
        },
      },
    ],
  };
}
