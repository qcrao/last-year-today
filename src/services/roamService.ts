// src/services/roamService.ts
export class RoamService {
  /**
   * Get the UID of a page by its title
   */
  static async getPageUidByTitle(pageTitle: string): Promise<string | null> {
    const result = await (window as any).roamAlphaAPI.q(`
        [:find ?uid
         :where 
         [?e :node/title "${pageTitle}"]
         [?e :block/uid ?uid]]
      `);
    return result.length > 0 ? result[0][0] : null;
  }

  /**
   * Add custom styles for historical page windows
   */
  static injectCustomStyles() {
    const styleId = "last-year-today-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
          .rm-sidebar-outline[data-last-year-today="true"] .rm-title-display span {
            background-color: #FFE4B5;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
          }
        `;
      document.head.appendChild(style);
    }
  }

  /**
   * Mark historical page windows with custom attribute
   */
  static markHistoricalWindows() {
    setTimeout(() => {
      console.log("marking historical windows");
      const windows = document.querySelectorAll(".rm-sidebar-outline");
      console.log(windows);
      windows.forEach((window) => {
        const title = window.querySelector(
          ".rm-title-display span"
        )?.textContent;
        console.log(title);
        if (title && title.includes(",") && /\d{4}/.test(title)) {
          window.setAttribute("data-last-year-today", "true");
        }
      });
    }, 500);
  }
}
