// =================================================
// ☠️ BOOM ARCADE 专用加载脚本 (修复版) ☠️
// =================================================

// 1. 定义你的 Cloudflare 基础路径
const my_cloud_path = 'https://live2d-widget-d9i.pages.dev/';

// 封装异步加载资源的方法 (保持不变)
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
    // 2. 避免图片资源跨域问题 (保持不变)
    const OriginalImage = window.Image;
    window.Image = function(...args) {
        const img = new OriginalImage(...args);
        img.crossOrigin = "anonymous";
        return img;
    };
    window.Image.prototype = OriginalImage.prototype;

    // 3. 🔥 关键修改：混合加载模式 🔥
    // CSS 加载你自己的 (为了配合你的样式)
    // JS 加载官方 CDN 的 (为了解决 export 报错)
    await Promise.all([
        loadExternalResource(my_cloud_path + 'waifu.css', 'css'),
        loadExternalResource('https://fastly.jsdelivr.net/npm/live2d-widget@3.1.4/lib/live2d.min.js', 'js'),
        loadExternalResource('https://fastly.jsdelivr.net/npm/live2d-widget@3.1.4/lib/waifu-tips.min.js', 'js')
    ]);

    // 4. 初始化配置
    initWidget({
        // 🔥🔥🔥 核心：强制读取你 Cloudflare 上的 JSON，并加时间戳防缓存 🔥🔥🔥
        waifuPath: my_cloud_path + 'waifu-tips.json?v=' + new Date().getTime(),

        // 模型接口：使用字节跳动国内极速源
        cdnPath: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/live2d-api/model/",
        
        // 强制指定 Chitose 模型 (金发小恶魔)
        modelPath: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/live2d-widget-model-chitose/1.0.5/assets/chitose.model.json",

        // 工具栏 (虽然你 CSS 隐藏了，但这里留着以防万一)
        tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
        
        drag: true,
        loading: true
    });
    
    console.log(`☠️ Neuro-sama Load Complete. Timestamp: ${new Date().getTime()}`);
})();
