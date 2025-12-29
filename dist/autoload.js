// =================================================
// ☠️ BOOM ARCADE 专用加载脚本 (路径修正版) ☠️
// =================================================

const my_cloud_path = 'https://live2d-widget-d9i.pages.dev/';

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
    const OriginalImage = window.Image;
    window.Image = function(...args) {
        const img = new OriginalImage(...args);
        img.crossOrigin = "anonymous";
        return img;
    };
    window.Image.prototype = OriginalImage.prototype;

    // 🔥🔥🔥 这里的链接已经修复 🔥🔥🔥
    await Promise.all([
        // 1. 加载你自己的 CSS
        loadExternalResource(my_cloud_path + 'waifu.css', 'css'),
        
        // 2. 加载核心库 (这个路径是对的)
        loadExternalResource('https://fastly.jsdelivr.net/npm/live2d-widget@3.1.4/lib/live2d.min.js', 'js'),
        
        // 3. ⚠️ 修正：逻辑库在根目录，且没有 .min ⚠️
        loadExternalResource('https://fastly.jsdelivr.net/npm/live2d-widget@3.1.4/waifu-tips.js', 'js')
    ]);

    initWidget({
        // 读取你 Cloudflare 上的台词 + 时间戳防缓存
        waifuPath: my_cloud_path + 'waifu-tips.json?v=' + new Date().getTime(),

        // 模型接口：字节跳动国内源
        cdnPath: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/live2d-api/model/",
        
        // 强制指定 Chitose 模型
        modelPath: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/live2d-widget-model-chitose/1.0.5/assets/chitose.model.json",

        tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
        drag: true,
        loading: true
    });
    
    console.log(`☠️ Neuro-sama Load Complete. Timestamp: ${new Date().getTime()}`);
})();
