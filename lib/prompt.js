/* PromptCraft 提示词拼装核心
 * 纯函数，不依赖 DOM。浏览器通过 window.PromptLib 使用，Node 通过 module.exports 引用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PromptLib = api;
})(typeof window !== 'undefined' ? window : null, function () {
  const STYLE_ZH = {
    'cinematic photo': '电影感摄影',
    'ink wash painting': '水墨画',
    '3d render, octane': '3D 渲染（Octane）',
    'anime key visual': '动画主视觉',
    'editorial fashion shot': '杂志时尚摄影',
  };

  const LIGHT_ZH = {
    'soft rim light, overcast': '柔和的轮廓光，阴天',
    'golden hour backlight': '黄金时刻逆光',
    'neon night, wet reflections': '霓虹夜景，湿润反射',
    'studio three point light': '影棚三点布光',
  };

  const LENS_ZH = {
    '35mm, f/1.8, medium shot': '35mm 焦距 · f/1.8 · 中景',
    '85mm, f/1.4, close-up': '85mm 焦距 · f/1.4 · 特写',
    '24mm wide angle, full body': '24mm 广角 · 全身入画',
    'macro detail shot': '微距细节特写',
  };

  const NEGATIVE = '低分辨率, 模糊, 变形肢体, 多余手指, 水印, 文字乱码, 过度锐化, 塑料感皮肤, 噪点过曝';

  function pick(map, key) {
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : key;
  }

  function buildZh(f) {
    const parts = [];
    if (f.subject) parts.push(f.subject);
    parts.push(pick(STYLE_ZH, f.style));
    parts.push(pick(LIGHT_ZH, f.light));
    parts.push(pick(LENS_ZH, f.lens));
    if (f.extra) parts.push(f.extra);
    parts.push(`画幅 ${f.ratio}`);
    return parts.join('，') + '。';
  }

  function buildEn(f) {
    const parts = [];
    if (f.subject) parts.push(f.subject);
    parts.push(f.style);
    parts.push(f.light);
    parts.push(f.lens);
    if (f.extra) parts.push(f.extra);
    parts.push(`--ar ${f.ratio}`);
    return parts.join(', ') + '.';
  }

  function tokenCount(en) {
    return en.split(/[,\s]+/).filter(Boolean).length;
  }

  function etaOf(ratio) {
    return ratio === '9:16' ? '约 18s' : '约 12s';
  }

  return { STYLE_ZH, LIGHT_ZH, LENS_ZH, NEGATIVE, buildZh, buildEn, tokenCount, etaOf };
});