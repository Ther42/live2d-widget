/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// 【注意】这里必须是你的 Cloudflare 域名，末尾要有斜杠
const live2d_path = 'https://live2d1.neuronsama.qzz.io/';

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    // 注意：这里不再处理 js，js 我们用下面的 import 加载
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

(async () => {
  // 手机端判断
  if (screen.width < 768) return;

  // 1. 加载 CSS
  await loadExternalResource(live2d_path + 'waifu.css', 'css');

  // 2. 关键修改：使用 import 动态加载模块
  try {
    // 动态引入 waifu-tips.js
    const { initWidget, showMessage } = await import(live2d_path + 'waifu-tips.js');

    // 【核心修复】把这两个函数手动挂载到 window 上
    // 这样 game_dino.jsp 就可以直接调用 window.showMessage 了！
    window.initWidget = initWidget;
    window.showMessage = showMessage;

    // 3. 初始化看板娘
    initWidget({
      waifuPath: live2d_path + 'waifu-tips.json',
      // 这里必须指向官方 CDN，因为你的仓库没有模型文件
      cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',
      
      cubism2Path: live2d_path + 'live2d.min.js',
      cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
      
      tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
      logLevel: 'warn',
      drag: false,
    });

    console.log("Live2D 加载完成，showMessage 已全局可用");

  } catch (error) {
    console.error("Live2D 加载失败:", error);
  }
})();

console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');
