// src/index.tsx
import { HistoricalPagesService } from "./services/historicalPagesService";
import { RoamService } from "./services/roamService";
import { DateUtils } from "./utils/dateUtils";
import { loadInitialSettings, initPanelConfig, yearsBack } from "./settings";

let cleanupObserver: (() => void) | null = null;
let midnightTimer: NodeJS.Timer | null = null;

const openHistoricalPages = async (today: string) => {
  const historicalPages = await HistoricalPagesService.getHistoricalPages(
    today,
    yearsBack
  );

  if (historicalPages.length > 0) {
    // Open right sidebar
    await (window as any).roamAlphaAPI.ui.rightSidebar.open();

    // Open windows for each historical page
    for (const page of historicalPages) {
      const formattedDate = DateUtils.formatRoamDate(page.date);
      await (window as any).roamAlphaAPI.ui.rightSidebar.addWindow({
        window: {
          type: "outline",
          "block-uid": page.uid,
          title: formattedDate,
        },
      });
    }

    // Mark historical windows with custom styles and store cleanup function
    cleanupObserver = RoamService.markHistoricalWindows();
    console.log("Historical pages opened successfully!");
  } else {
    console.log("No historical pages found");
  }
};

const scheduleNextMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeUntilMidnight = tomorrow.getTime() - now.getTime();
  console.log(
    `Next update scheduled in ${timeUntilMidnight / 1000 / 60} minutes`
  );

  return setTimeout(async () => {
    const today = DateUtils.formatRoamDate(new Date());
    await openHistoricalPages(today);
    // Schedule next midnight
    midnightTimer = scheduleNextMidnight();
  }, timeUntilMidnight);
};

const onload = async ({ extensionAPI }: { extensionAPI: any }) => {
  console.log("Last Year Today plugin loading...");

  try {
    // Load settings
    await loadInitialSettings(extensionAPI);

    // Initialize panel config
    await extensionAPI.settings.panel.create(initPanelConfig(extensionAPI));

    // Initialize custom styles
    RoamService.injectCustomStyles();

    // Get current date in Roam format
    const now = new Date();
    const today = DateUtils.formatRoamDate(now);

    await openHistoricalPages(today);

    // Schedule next midnight update
    midnightTimer = scheduleNextMidnight();
  } catch (error) {
    console.error("Error loading Last Year Today plugin:", error);
  }
};

const onunload = () => {
  // Clean up custom styles
  const styleElement = document.getElementById("last-year-today-styles");
  if (styleElement) {
    styleElement.remove();
  }

  // Clean up observer
  if (cleanupObserver) {
    cleanupObserver();
    cleanupObserver = null;
  }

  // Clear midnight timer
  if (midnightTimer) {
    clearTimeout(midnightTimer);
    midnightTimer = null;
  }

  console.log("Last Year Today plugin unloaded!");
};

export default {
  onload,
  onunload,
};
