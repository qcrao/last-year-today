import { HistoricalPage } from "../types";
import { DateUtils } from "../utils/dateUtils";
import { RoamService } from "./roamService";

// src/services/historicalPagesService.ts
export class HistoricalPagesService {
  /**
   * Get historical pages for a given date
   */
  static async getHistoricalPages(
    currentDateStr: string,
    yearsBack: number
  ): Promise<HistoricalPage[]> {
    const currentDate = DateUtils.parseEnglishDate(currentDateStr);
    const pages: HistoricalPage[] = [];

    for (let i = 1; i <= yearsBack; i++) {
      const historicalDate = new Date(currentDate);
      historicalDate.setFullYear(currentDate.getFullYear() - i);

      const formattedDate = DateUtils.formatRoamDate(historicalDate);
      const uid = await RoamService.getPageUidByTitle(formattedDate);

      if (uid) {
        pages.push({ date: historicalDate, uid });
      }
    }

    return pages;
  }
}
