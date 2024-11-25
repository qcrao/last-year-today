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
        
        /* Preserve Roam's default link styles */
        .rm-page-ref,
        .rm-page-ref--link {
          color: inherit !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Mark historical page windows with custom attribute
   */
  static markHistoricalWindows() {
    let observer: MutationObserver | null = null;

    const markWindows = () => {
      const windows = document.querySelectorAll(".rm-sidebar-outline");
      windows.forEach((window) => {
        const title = window.querySelector(
          ".rm-title-display span"
        )?.textContent;
        const dateRegex =
          /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,\s+\d{4}/i;
        if (title && dateRegex.test(title)) {
          window.setAttribute("data-last-year-today", "true");
        }
      });
    };

    // Create observer to watch for DOM changes
    observer = new MutationObserver((mutations) => {
      markWindows();
    });

    // Start observing with configuration
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial marking
    markWindows();

    // Return cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }
}
