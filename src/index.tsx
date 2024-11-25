import "./styles/index.css"; // 这会被 webpack 提取到 extension.css 中

declare global {
  interface Window {
    roamAlphaAPI: any; // You can replace 'any' with a more specific type if needed
  }
}

import React from "react";
import ReactDOM from "react-dom";
import LastYearToday from "./components/LastYearToday";

// 保存组件容器的引用
let container: HTMLDivElement | null = null;

function createSidebarWindow() {
  // 创建一个唯一的窗口 ID
  const windowId = "last-year-today-window";

  // 使用 Roam 的 API 创建侧边栏窗口
  window.roamAlphaAPI.ui.rightSidebar.addWindow({
    window: {
      "block-uid": windowId,
      type: "outline", // 使用 outline 类型以匹配 Roam 的默认样式
    },
  });

  // 等待窗口创建完成
  setTimeout(() => {
    // 查找新创建的窗口内容区域
    const sidebarWindows = document.getElementsByClassName("sidebar-content");
    for (let i = 0; i < sidebarWindows.length; i++) {
      const windowTitle = sidebarWindows[i].querySelector(".window-header");
      if (windowTitle && windowTitle.textContent === "outline") {
        // 找到我们的窗口，修改标题
        windowTitle.textContent = "Last Year Today";

        // 创建并插入我们的组件容器
        container = document.createElement("div");
        container.id = "roam-last-year-today-container";
        container.className = "roam-last-year-today";

        // 插入到正确的位置
        const contentArea = sidebarWindows[i].querySelector(".window-content");
        if (contentArea) {
          contentArea.appendChild(container);

          // 渲染我们的 React 组件
          ReactDOM.render(<LastYearToday />, container);
        }
        break;
      }
    }
  }, 500); // 给 Roam 一些时间来创建窗口
}

function onload() {
  // 检查是否已经存在我们的窗口
  const existingWindow = document.querySelector(".roam-last-year-today");
  if (!existingWindow) {
    createSidebarWindow();
  }
}

function onunload() {
  // 清理 React 组件
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    container = null;
  }

  // 移除侧边栏窗口
  const windowId = "last-year-today-window";
  window.roamAlphaAPI.ui.rightSidebar.removeWindow({
    window: {
      "block-uid": windowId,
    },
  });
}

// 导出符合 Roam 要求的对象
export default {
  onload: onload,
  onunload: onunload,
};
