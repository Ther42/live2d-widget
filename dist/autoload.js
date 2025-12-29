// =================================================
// ☠️ BOOM ARCADE 专用加载脚本 (新版适配) ☠️
// =================================================

// 1. 核心资源路径：使用官方 CDN (这里是程序代码，必须用 CDN 上的编译版，否则报 export 错)
const live2d_path = 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.0-rc.6/dist/';

// 封装异步加载资源的方法 (不用动)
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
  // 2. 避免图片资源跨域问题 (不用动)
  const OriginalImage = window.Image;
  window.Image = function(...args) {
    const img = new OriginalImage(...args);
    img.crossOrigin = "anonymous";
    return img;
  };
  window.Image.prototype = OriginalImage.prototype;

  // 3. 加载样式和逻辑代码 (从 CDN 加载，保证不报错)
  await Promise.all([
    // 加载你自己的 CSS (覆盖默认样式)
    loadExternalResource('waifu.css', 'css'),
    // 加载官方核心逻辑 JS
    loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
  ]);

  // 4. 初始化配置 (根据你的表格填写的配置)
  initWidget({
    // [配置1] 看板娘台词路径
    // 指向你本地文件 + 时间戳 (彻底解决手机缓存问题)
    waifuPath: 'waifu-tips.json?v=' + Date.now(),

    // [配置2] CDN 路径 (模型仓库)
    // 使用国内极速源，防止模型加载慢
    cdnPath: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/live2d-api/model/",

    // [配置3] 核心引擎路径 (关键修改！)
    // 你之前下载了 live2d.min.js 到 js 文件夹对吧？这里直接用它！
    // 这样就再也不会报 "Live2D 引擎未加载" 了
    cubism2Path: "js/live2d.min.js",

    // [配置4] 工具栏
    tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
    
    // 其他配置
    logLevel: 'warn', // 减少控制台废话
    drag: true        // 允许拖拽
  });
  
  console.log(`☠️ Neuro-sama Ready. Timestamp: ${Date.now()}`);
})();
