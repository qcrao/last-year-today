#!/bin/bash
# 安装依赖
bun install

# 构建项目
bun run build

# 使用 roamjs-scripts 处理
bunx roamjs-scripts build --depot