const { test } = require('node:test');
const assert = require('node:assert');
const { buildZh, buildEn, tokenCount, etaOf, NEGATIVE, STYLE_ZH } = require('../lib/prompt.js');

const base = {
  subject: '穿汉服的少女',
  style: 'cinematic photo',
  light: 'soft rim light, overcast',
  lens: '85mm, f/1.4, close-up',
  ratio: '16:9',
  extra: '',
};

test('中文提示词把六个维度按顺序拼接并以句号收尾', () => {
  const zh = buildZh(base);
  assert.strictEqual(
    zh,
    '穿汉服的少女，电影感摄影，柔和的轮廓光，阴天，85mm 焦距 · f/1.4 · 特写，画幅 16:9。'
  );
});

test('主体为空时不产生空字段缝隙', () => {
  const zh = buildZh({ ...base, subject: '' });
  assert.ok(!zh.startsWith('，'));
  assert.ok(zh.startsWith('电影感摄影'));
});

test('补充约束插在画幅之前', () => {
  const zh = buildZh({ ...base, extra: '胶片颗粒' });
  assert.ok(zh.indexOf('胶片颗粒') < zh.indexOf('画幅'));
});

test('英文提示词带 --ar 比例参数', () => {
  assert.ok(buildEn({ ...base, ratio: '9:16' }).includes('--ar 9:16'));
});

test('未知风格原样透传不报错', () => {
  const zh = buildZh({ ...base, style: 'custom-style' });
  assert.ok(zh.includes('custom-style'));
});

test('风格映射覆盖全部下拉选项', () => {
  assert.strictEqual(Object.keys(STYLE_ZH).length, 5);
});

test('词条数忽略连续分隔符与空格', () => {
  assert.strictEqual(tokenCount('a, b,  c'), 3);
  assert.strictEqual(tokenCount(''), 0);
});

test('竖版耗时高于横版', () => {
  assert.strictEqual(etaOf('9:16'), '约 18s');
  assert.strictEqual(etaOf('16:9'), '约 12s');
});

test('负向词包含常见问题项', () => {
  assert.ok(NEGATIVE.includes('水印'));
  assert.ok(NEGATIVE.includes('变形肢体'));
});