import { DateUtils } from "./utils/dateUtils";

export const loadRoamExtensionCommands = async (
  extensionAPI: any,
  openHistoricalPages: (date: string) => Promise<void>
) => {
  extensionAPI.ui.commandPalette.addCommand({
    label: "Show Last Year Today",
    callback: async () => {
      const today = DateUtils.formatRoamDate(new Date());
      await openHistoricalPages(today);
    },
  });
};