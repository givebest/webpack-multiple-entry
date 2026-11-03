const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../config/webpack.config');
test('entry discovery preserves nested pages and excludes shared libraries', () => {
  assert.deepEqual(Object.keys(config.entry).sort(), ['about/index', 'index', 'user/index', 'user/list']);
  assert.equal(config.devServer.host, '127.0.0.1');
  assert.equal(config.devServer.allowedHosts, undefined);
});
test('all generated pages render templates and reference existing local bundles', () => {
  for (const page of ['index', 'about/index', 'user/index', 'user/list']) {
    const html = fs.readFileSync(path.join(__dirname, '../dist/view', page + '.html'), 'utf8');
    assert.ok(html.includes('</html>'));
    assert.ok(!html.includes("{{extend"));
    const bundles = [...html.matchAll(/(?:src|href)="(?:\/\/cdn\.com\/|\/)((?:js|css)\/[^"?]+)(?:\?[^" ]*)?"/g)];
    assert.ok(bundles.length >= 2, page);
    for (const [, file] of bundles) assert.ok(fs.existsSync(path.join(__dirname, '../dist', file)), file);
  }
});
