这是修改BySlin的web_rviz_demo,增加手动输入远程ip地址，原程序地址https://github.com/BySlin/web_rviz_demo

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
## 打包成apk
下载HBuilderX，创建5+app，将dist文件下的文件粘贴替换到5+app目录中，然后进行打包，具体参考网上教程