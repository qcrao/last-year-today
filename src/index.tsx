import React from "react";
import ReactDOM from "react-dom";
import LastYearToday from "./components/LastYearToday";
import "./styles/index.css";

let container: HTMLDivElement | null = null;

const onload = async () => {
  console.log("Last Year Today plugin loading...");

  try {
    // 确保右侧栏是打开的
    await (window as any).roamAlphaAPI.ui.rightSidebar.open();

    // 生成一个唯一的 blockUid
    const blockUid = (window as any).roamAlphaAPI.util.generateUID();

    // 创建一个新的 block
    await (window as any).roamAlphaAPI.createBlock({
      location: { "parent-uid": blockUid, order: 0 },
      block: { string: "" },
    });

    // 添加到右侧栏
    await (window as any).roamAlphaAPI.ui.rightSidebar.addWindow({
      window: {
        type: "outline",
        "block-uid": blockUid,
        title: "Last Year Today",
      },
    });

    // 给DOM一些时间来更新
    setTimeout(() => {
      const sidebarContent = document.querySelector(".rm-sidebar-window");
      if (sidebarContent) {
        container = document.createElement("div");
        container.className = "roam-last-year-today";
        sidebarContent.appendChild(container);

        ReactDOM.render(<LastYearToday />, container);
      }
    }, 300);

    console.log("Last Year Today plugin loaded successfully!");
  } catch (error) {
    console.error("Error loading Last Year Today plugin:", error);
  }
};

const onunload = () => {
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
  console.log("Last Year Today plugin unloaded!");
};

export default {
  onload,
  onunload,
};
