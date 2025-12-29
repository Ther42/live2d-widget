/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// 你的专属域名
const live2d_path = 'https://live2d1.neuronsama.qzz.io/';

function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

(async () => {
  if (screen.width < 768) return;

  // 1. 加载 CSS
  await loadExternalResource(live2d_path + 'waifu.css', 'css');

  // 2. 加载模块并自动寻找 initWidget
  try {
    const module = await import(live2d_path + 'waifu-tips.js');
    
    // 【关键修复】兼容多种导出格式（Default vs Named）
    // 优先找 module.initWidget，如果没有就找 module.default.initWidget，再没有就找 module.default
    let initWidget = module.initWidget || module.default?.initWidget || module.default || window.initWidget;
    let showMessage = module.showMessage || module.default?.showMessage || window.showMessage;

    // 再次把函数挂载到全局，给游戏调用
    window.initWidget = initWidget;
    window.showMessage = showMessage;

    if (typeof initWidget !== 'function') {
      console.error("无法找到 initWidget 函数，模块内容为:", module);
      return;
    }

    // 3. 初始化
    initWidget({
      waifuPath: live2d_path + 'waifu-tips.json',
      cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',
      cubism2Path: live2d_path + 'live2d.min.js',
      cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
      tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
      logLevel: 'warn',
      drag: false,
    });

    console.log("Live2D 初始化成功！");

  } catch (error) {
    console.error("Live2D 加载发生错误:", error);
  }
})();

console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');
