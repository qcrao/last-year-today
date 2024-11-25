export let yearsBack = 1;

export function loadInitialSettings(extensionAPI: any) {
  const savedYearsBack = extensionAPI.settings.get("years-back");
  yearsBack = savedYearsBack ? parseInt(savedYearsBack) : 1;
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
            yearsBack = isNaN(value) ? 1 : value;
          },
        },
      },
    ],
  };
}
