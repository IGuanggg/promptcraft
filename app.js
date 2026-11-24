const $ = (id) => document.getElementById(id);
const { buildZh, buildEn, tokenCount, etaOf, NEGATIVE } = window.PromptLib;

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

const FIELDS = ['subject', 'style', 'light', 'lens', 'ratio', 'extra'];

function readForm() {
  return FIELDS.reduce((acc, id) => {
    acc[id] = $(id).value.trim();
    return acc;
  }, {});
}

function render() {
  const f = readForm();
  const zh = buildZh(f);
  const en = buildEn(f);

  $('outZh').textContent = zh;
  $('outEn').textContent = en;
  $('outNeg').textContent = NEGATIVE;

  $('lenZh').textContent = zh.length;
  $('lenTokens').textContent = tokenCount(en);
  $('eta').textContent = etaOf(f.ratio);

  $('status').textContent = f.subject ? '提示词已更新' : '等待输入主体';
}

function copyText(id, btn) {
  const done = () => {
    btn.textContent = '已复制';
    btn.classList.add('done');
    setTimeout(() => {
      btn.textContent = '复制';
      btn.classList.remove('done');
    }, 1400);
  };

  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = $(id).textContent;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (e) {
      /* 静默失败，不打断用户 */
    }
    document.body.removeChild(ta);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText($(id).textContent).then(done).catch(fallback);
  } else {
    fallback();
  }
}

document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', () => copyText(btn.dataset.target, btn));
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const p = PRESETS[chip.dataset.preset];
    if (!p) return;
    FIELDS.forEach((id) => { $(id).value = p[id] ?? ''; });
    render();
  });
});

FIELDS.forEach((id) => {
  $(id).addEventListener('input', render);
  $(id).addEventListener('change', render);
});

render();