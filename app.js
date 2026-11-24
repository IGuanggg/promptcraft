const $ = (id) => document.getElementById(id);

const PRESETS = {
  portrait: {
    subject: '年轻女性肖像，侧脸，长发被风微微吹起',
    style: 'cinematic photo',
    light: 'soft rim light, overcast',
    lens: '85mm, f/1.4, close-up',
    ratio: '9:16',
    extra: '浅景深, 皮肤质感, 胶片颗粒',
  },
  product: {
    subject: '一只白色陶瓷马克杯放在哑光台面上',
    style: 'editorial fashion shot',
    light: 'studio three point light',
    lens: 'macro detail shot',
    ratio: '1:1',
    extra: '干净背景, 边缘高光, 商品级锐度',
  },
  scene: {
    subject: '雨夜霓虹街道，撑伞的人走向远处',
    style: 'cinematic photo',
    light: 'neon night, wet reflections',
    lens: '35mm, f/1.8, medium shot',
    ratio: '16:9',
    extra: '湿地面反射, 体积光, 冷暖对比',
  },
  poster: {
    subject: '未来城市天际线，悬浮轨道穿过楼群',
    style: '3d render, octane',
    light: 'golden hour backlight',
    lens: '24mm wide angle, full body',
    ratio: '9:16',
    extra: '大留白, 强透视, 电影感调色',
  },
};

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

function readForm() {
  return {
    subject: $('subject').value.trim(),
    style: $('style').value,
    light: $('light').value,
    lens: $('lens').value,
    ratio: $('ratio').value,
    extra: $('extra').value.trim(),
  };
}

function buildZh(f) {
  const parts = [];
  if (f.subject) parts.push(f.subject);
  parts.push(STYLE_ZH[f.style] || f.style);
  parts.push(LIGHT_ZH[f.light] || f.light);
  parts.push(LENS_ZH[f.lens] || f.lens);
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

const NEGATIVE = '低分辨率, 模糊, 变形肢体, 多余手指, 水印, 文字乱码, 过度锐化, 塑料感皮肤, 噪点过曝';

function render() {
  const f = readForm();
  const zh = buildZh(f);
  const en = buildEn(f);

  $('outZh').textContent = zh;
  $('outEn').textContent = en;
  $('outNeg').textContent = NEGATIVE;

  $('lenZh').textContent = zh.length;
  $('lenTokens').textContent = en.split(/[,\s]+/).filter(Boolean).length;
  $('eta').textContent = f.ratio === '9:16' ? '约 18s' : '约 12s';

  $('status').textContent = f.subject ? '提示词已更新' : '等待输入主体';
}

function copyText(id, btn) {
  const text = $(id).textContent;
  const done = () => {
    btn.textContent = '已复制';
    btn.classList.add('done');
    setTimeout(() => {
      btn.textContent = '复制';
      btn.classList.remove('done');
    }, 1400);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
}

document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', () => copyText(btn.dataset.target, btn));
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const p = PRESETS[chip.dataset.preset];
    if (!p) return;
    $('subject').value = p.subject;
    $('style').value = p.style;
    $('light').value = p.light;
    $('lens').value = p.lens;
    $('ratio').value = p.ratio;
    $('extra').value = p.extra;
    render();
  });
});

['subject', 'style', 'light', 'lens', 'ratio', 'extra'].forEach((id) => {
  $(id).addEventListener('input', render);
  $(id).addEventListener('change', render);
});

render();
