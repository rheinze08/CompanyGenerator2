const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const rootOutputPath = path.join(root, 'index.html');
const outputPath = path.join(root, 'output', 'index.html');
const dependenciesPath = path.join(root, 'output', 'dependencies.json');

test('publishes matching Roland Power Health Max Food Company website artifacts', () => {
  assert.equal(fs.existsSync(rootOutputPath), true);
  assert.equal(fs.existsSync(outputPath), true);
  const html = fs.readFileSync(outputPath, 'utf8');
  assert.equal(fs.readFileSync(rootOutputPath, 'utf8'), html);
  assert.match(html, /Roland's Power Health Max Food Company/);
  assert.match(html, /rolandspowerhealthmaxfood\.com/);
  assert.doesNotMatch(html, /FitLife Brands/i);
});

test('website includes the requested customer-facing sections and current social links', () => {
  const html = fs.readFileSync(outputPath, 'utf8');
  for (const label of ['Home', 'Our Brands', 'Learn &amp; Explore', 'Documents', 'Social Discovery', 'Contact']) {
    assert.match(html, new RegExp(label));
  }
  for (const url of ['https://facebook.com/fitlifebrands', 'https://instagram.com/fitlife_brands', 'https://pinterest.com/fitlife_brands', 'https://x.com/fitlifebrands', 'https://youtube.com/channel/UC8hqSCOoNYKxeRv7Vlx43Hg']) {
    assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(html, /Tool collectors|Provenance/);
  assert.match(html, /id="document-library"/);
  assert.match(html, /sanitizeBranding/);
});

test('dependency manifest names only the runtime source file', () => {
  assert.deepEqual(JSON.parse(fs.readFileSync(dependenciesPath, 'utf8')), ['brain_deliverables.json']);
});
