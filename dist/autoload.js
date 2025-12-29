/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// 你的专属域名
const live2d_path = 'https://live2d-widget-d9i.pages.dev/';

function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    else if (type === 'js') {
      tag = document.createElement('script');
      // 【关键修复】必须是 module，因为 waifu-tips.js 现在包含 export
      tag.type = 'module'; 
      tag.src = url;
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

  // 2. 加载 waifu-tips.js (它会自动挂载 window.showMessage 和 window.initWidget)
  await loadExternalResource(live2d_path + 'waifu-tips.js', 'js');

  // 3. 初始化
  // 给一点点时间让模块加载完成
  setTimeout(() => {
    if (typeof initWidget === 'function') {
        initWidget({
          waifuPath: live2d_path + 'waifu-tips.json',
          cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',

          modelId: 5,  // <--- 把 5 换成你刚才查到的实际数字
          modelTexturesId: 0,
          
          cubism2Path: live2d_path + 'live2d.min.js',
          cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
          tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
          logLevel: 'warn',
          drag: false,
        });
        console.log("Live2D 初始化成功");
    } else {
        console.error("等待 initWidget 超时");
    }
  }, 500); 
})();
