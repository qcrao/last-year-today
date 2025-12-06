// src/index.tsx
import { HistoricalPagesService } from "./services/historicalPagesService";
import { RoamService } from "./services/roamService";
import { DateUtils } from "./utils/dateUtils";
import {
  loadInitialSettings,
  initPanelConfig,
  getYearsBack,
  getDailyUpdateHour,
  getDailyUpdateMinute,
  getLastOpenedDate,
  setLastOpenedDate,
} from "./settings";
import { loadRoamExtensionCommands } from "./commands";

let cleanupObserver: (() => void) | null = null;
let checkInterval: ReturnType<typeof setInterval> | null = null;

const openHistoricalPages = async (today: string) => {
  const historicalPages = await HistoricalPagesService.getHistoricalPages(
    today,
    getYearsBack()
  );

  if (historicalPages.length > 0) {
    // Open right sidebar
    await (window as any).roamAlphaAPI.ui.rightSidebar.open();

    // Reverse historical pages so they are in order from oldest to newest
    historicalPages.reverse();

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

const closeHistoricalPages = async (today: string) => {
  const historicalPages = await HistoricalPagesService.getHistoricalPages(
    today,
    getYearsBack()
  );

  // Check if rightSidebar API exists before using it
  const roamAPI = window as any;
  if (!roamAPI?.roamAlphaAPI?.ui?.rightSidebar) {
    console.error("Right sidebar API not available");
    return;
  }

  // Close windows for each historical page
  for (const page of historicalPages) {
    try {
      await roamAPI.roamAlphaAPI.ui.rightSidebar.removeWindow({
        window: {
          type: "outline",
          "block-uid": page.uid,
        },
      });
    } catch (error) {
      console.error(`Failed to close window for page ${page.uid}:`, error);
    }
  }
};

const isUpdateTimePassed = (now: Date): boolean => {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const dailyUpdateHour = getDailyUpdateHour();
  const dailyUpdateMinute = getDailyUpdateMinute();

  // Check if current time is past the update time
  if (currentHour > dailyUpdateHour) {
    return true;
  }
  if (currentHour === dailyUpdateHour && currentMinute >= dailyUpdateMinute) {
    return true;
  }
  return false;
};

const checkAndOpenHistoricalPages = async () => {
  const now = new Date();
  const today = DateUtils.formatRoamDate(now);
  const lastOpenedDate = getLastOpenedDate();

  // Check if it's a new day and past the update time
  if (today !== lastOpenedDate && isUpdateTimePassed(now)) {
    console.log(`Opening historical pages for ${today} (time: ${now.getHours()}:${now.getMinutes()}, updateTime: ${getDailyUpdateHour()}:${getDailyUpdateMinute()})`);
    setLastOpenedDate(today);
    await openHistoricalPages(today);
  }
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    console.log("Page became visible, checking for updates...");
    checkAndOpenHistoricalPages();
  }
};

const handleWindowFocus = () => {
  console.log("Window focused, checking for updates...");
  checkAndOpenHistoricalPages();
};

const onload = async ({ extensionAPI }: { extensionAPI: any }) => {
  console.log("Last Year Today plugin loading...");

  try {
    // Load settings
    console.log("loadInitialSettings...");
    loadInitialSettings(extensionAPI);
    console.log("yearsBack", getYearsBack());
    console.log("dailyUpdateHour", getDailyUpdateHour());
    console.log("dailyUpdateMinute", getDailyUpdateMinute());

    // Initialize panel config
    await extensionAPI.settings.panel.create(initPanelConfig(extensionAPI));

    await loadRoamExtensionCommands(
      extensionAPI,
      openHistoricalPages,
      closeHistoricalPages
    );

    // Initialize custom styles
    RoamService.injectCustomStyles();

    // Get current date in Roam format and open historical pages
    const now = new Date();
    const today = DateUtils.formatRoamDate(now);
    const lastOpenedDate = getLastOpenedDate();
    const updateTimePassed = isUpdateTimePassed(now);

    console.log(`Checking if should open: today=${today}, lastOpenedDate=${lastOpenedDate}, currentTime=${now.getHours()}:${now.getMinutes()}, updateTime=${getDailyUpdateHour()}:${getDailyUpdateMinute()}`);

    // Only open on load if past the update time and not already opened today
    if (today !== lastOpenedDate && updateTimePassed) {
      console.log("Conditions met, opening historical pages...");
      setLastOpenedDate(today);
      await openHistoricalPages(today);
    } else {
      console.log(`Skipping: today !== lastOpenedDate: ${today !== lastOpenedDate}, updateTimePassed: ${updateTimePassed}`);
    }

    // Listen for visibility changes to handle tab switching and browser wake
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for window focus (works better in desktop apps)
    window.addEventListener("focus", handleWindowFocus);

    // Additional events for desktop apps
    document.addEventListener("focus", () => {
      console.log("Document focus event triggered");
      checkAndOpenHistoricalPages();
    }, true);

    document.addEventListener("click", () => {
      console.log("Document click - checking for updates...");
      checkAndOpenHistoricalPages();
    }, { once: false, capture: true });

    // Backup polling every 1 minute for testing (change back to 30 later)
    checkInterval = setInterval(() => {
      console.log("Interval check triggered");
      checkAndOpenHistoricalPages();
    }, 60 * 1000);

    console.log("Last Year Today plugin loaded successfully!");
  } catch (error) {
    console.error("Error loading Last Year Today plugin:", error);
  }
};

const onunload = () => {
  // Remove event listeners
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("focus", handleWindowFocus);

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

  // Clear check interval
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  console.log("Last Year Today plugin unloaded!");
};

export default {
  onload,
  onunload,
};
