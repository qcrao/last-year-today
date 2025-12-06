import { DateUtils } from "./utils/dateUtils";
import { setLastOpenedDate } from "./settings";

export const loadRoamExtensionCommands = async (
  extensionAPI: any,
  openHistoricalPages: (date: string) => Promise<void>,
  closeHistoricalPages: (date: string) => Promise<void>
) => {
  extensionAPI.ui.commandPalette.addCommand({
    label: "Open Last Year Today",
    callback: async () => {
      const today = DateUtils.formatRoamDate(new Date());
      await openHistoricalPages(today);
    },
  });

  extensionAPI.ui.commandPalette.addCommand({
    label: "Close Last Year Today",
    callback: async () => {
      const today = DateUtils.formatRoamDate(new Date());
      await closeHistoricalPages(today);
    },
  });

  extensionAPI.ui.commandPalette.addCommand({
    label: "Reset Last Year Today",
    callback: async () => {
      setLastOpenedDate(null);
      extensionAPI.settings.set("last-opened-date", null);
      console.log("Last Year Today: Reset last-opened-date to null");
    },
  });
};
