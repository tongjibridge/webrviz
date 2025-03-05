# Vue 3 Web Rviz

本项目基于Foxglove Bridge, 使用前请先安装并启动Foxglove bridge
https://github.com/foxglove/ros-foxglove-bridge

## 安装依赖

```bash
npm install
```

## 修改App.vue中的wsServer设置Foxglove Bridge连接地址

```typescript
const wsServer = ref(`ws://${location.hostname}:8765`);
```

## 启动开发环境 访问地址http://localhost:5173

```bash
npm run dev
```

## 打包

```bash
npm run build
```
