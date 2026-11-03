# Dependabot remediation — 2026-11-03

Compared the current lockfile against all 60 open GitHub Dependabot alerts: 38 resolved by updated versions, 21 by removing the dependency, 1 remains. This is a local version-range comparison, not confirmation that GitHub has closed the alerts.

The original mixed Webpack 3 configuration / Webpack 5 dependencies required migrating the build configuration alongside the dependency updates. Babel 6, HappyPack, ExtractTextPlugin, image-webpack-loader, and other obsolete tools were replaced by supported Webpack 5 tooling. Images are optimized with Sharp. Multi-entry pages, shared CSS, template inheritance, and the API proxy are retained. Development now binds to loopback and retains Host / Origin validation. Node >=22.15 is required.

## Remaining upstream issue

Alert #89, GHSA-pfq8-rq6v-vf5m: art-template 4.13.4 and art-template-loader still depend on unpatched html-minifier. npm audit reports this one advisory as three affected packages (all high). The art-template loader explicitly uses `minimize: false`, disabling this old minifier on the configured template compilation path; HtmlWebpackPlugin performs final minification through its maintained minifier. This mitigation does not remove the vulnerable package. Do not process untrusted templates. A complete fix requires replacing the art-template compiler or an upstream release removing its old minifier dependency.

## Validation

- Production and development builds passed on Node 26.8.1.
- Two regression tests passed, covering four nested entries and rendered HTML/local asset references.
- Development server returned HTTP 200 for `/view/index.html`; untrusted Host returned HTTP 403.
- npm audit: 101 affected packages before (3 low / 25 moderate / 44 high / 29 critical), 3 high afterward, all from the single upstream advisory above.
- CI now runs clean install, production build, regression tests, and development build on Node 22. Remote CI remains pending until the branch is pushed.

## Alert-by-alert comparison

| Alert | Dependency | Advisory | Result | Installed versions |
| --- | --- | --- | --- | --- |
| #226 | serialize-javascript | GHSA-m5mm-p8h7-m29v | updated | 7.1.4 |
| #218 | node-forge | GHSA-86w9-cpqp-85rv | removed | removed |
| #217 | brace-expansion | GHSA-q2hr-2g5m-vwhr | updated | 5.0.12 |
| #214 | webpack-dev-middleware | GHSA-g84c-rxfj-3j2c | updated | 8.6.0 |
| #213 | decompress | GHSA-hrh2-vp3x-79xf | removed | removed |
| #207 | browserslist | GHSA-73wf-gq98-2v4g | updated | 4.29.5 |
| #206 | decode-uri-component | GHSA-vcc3-ghjq-m6fr | removed | removed |
| #204 | decompress | GHSA-jwp9-9v96-94mx | removed | removed |
| #196 | decompress | GHSA-h39j-r5qq-r9mm | removed | removed |
| #191 | webpack-dev-server | GHSA-m28w-2pqf-7qgj | updated | 6.1.0 |
| #189 | webpack-dev-server | GHSA-f5vj-f2hx-8m93 | updated | 6.1.0 |
| #186 | brace-expansion | GHSA-3jxr-9vmj-r5cp | updated | 5.0.12 |
| #184 | websocket-driver | GHSA-xv26-6w52-cph6 | removed | removed |
| #183 | decompress | GHSA-mp2f-45pm-3cg9 | removed | removed |
| #182 | http-proxy-middleware | GHSA-64mm-vxmg-q3vj | updated | 4.2.1 |
| #181 | ws | GHSA-96hv-2xvq-fx4p | updated | 8.22.1 |
| #179 | webpack-dev-server | GHSA-mx8g-39q3-5c79 | updated | 6.1.0 |
| #176 | uuid | GHSA-w5hq-g745-h8pq | removed | removed |
| #175 | serialize-javascript | GHSA-qj8w-gfj5-8c6v | updated | 7.1.4 |
| #173 | node-forge | GHSA-2328-f5f3-gj25 | removed | removed |
| #172 | node-forge | GHSA-q67f-28xg-22rw | removed | removed |
| #171 | webpack-dev-server | GHSA-79cf-xcqc-c78w | updated | 6.1.0 |
| #167 | fast-xml-parser | GHSA-gh4j-gqv2-49f6 | removed | removed |
| #166 | follow-redirects | GHSA-r4q5-vmmm-2653 | removed | removed |
| #164 | fast-xml-parser | GHSA-jp2q-39xq-3w4g | removed | removed |
| #163 | lodash | GHSA-r5fr-rjxr-66jc | updated | 4.18.1 |
| #162 | lodash | GHSA-f23m-r3pf-42rh | updated | 4.18.1 |
| #157 | node-forge | GHSA-ppp5-5v6c-4jwp | removed | removed |
| #155 | picomatch | GHSA-3v7f-55p6-f55p | updated | 2.3.2, 4.0.7 |
| #152 | fast-xml-parser | GHSA-8gc5-j5rx-235r | removed | removed |
| #148 | fast-xml-parser | GHSA-fj3w-jwp8-x2g3 | removed | removed |
| #147 | fast-xml-parser | GHSA-jmr7-xgp7-cmfj | removed | removed |
| #144 | serialize-javascript | GHSA-5c6j-r48x-rmvq | updated | 7.1.4 |
| #141 | minimatch | GHSA-7r86-cg39-jmmj | updated | 11.0.4 |
| #132 | qs | GHSA-w7fw-mjwx-w883 | updated | 6.17.1 |
| #130 | webpack | GHSA-8fgc-7cc6-rx7x | updated | 5.112.2 |
| #129 | webpack | GHSA-38r7-794h-5758 | updated | 5.112.2 |
| #127 | lodash | GHSA-xxjr-mmjv-4gpg | updated | 4.18.1 |
| #126 | qs | GHSA-6rw7-vpxm-498p | updated | 6.17.1 |
| #124 | node-forge | GHSA-65ch-62r8-g69g | removed | removed |
| #123 | node-forge | GHSA-5gfm-wpxj-wjgq | removed | removed |
| #119 | webpack-dev-server | GHSA-4v9v-hfq4-rm2v | updated | 6.1.0 |
| #117 | webpack-dev-server | GHSA-9jgg-88mc-972h | updated | 6.1.0 |
| #114 | http-proxy-middleware | GHSA-4www-5p9h-95mh | updated | 4.2.1 |
| #111 | serialize-javascript | GHSA-76p7-773f-r4q5 | updated | 7.1.4 |
| #103 | cookie | GHSA-pxg6-pf52-xh8x | updated | 0.7.2 |
| #102 | body-parser | GHSA-qwcr-r2fm-qrc7 | updated | 2.4.0 |
| #101 | express | GHSA-qw6h-vgh9-j6wx | updated | 5.3.0 |
| #100 | send | GHSA-m6fv-jmcg-4jfg | updated | 1.2.1 |
| #99 | serve-static | GHSA-cm22-4g7w-348p | updated | 2.2.1 |
| #97 | webpack | GHSA-4vvj-4cpr-p986 | updated | 5.112.2 |
| #91 | ws | GHSA-3h5v-q93c-6h6q | updated | 8.22.1 |
| #89 | html-minifier | GHSA-pfq8-rq6v-vf5m | remaining | 3.5.21 |
| #88 | babel-traverse | GHSA-67hx-6x53-jw92 | removed | removed |
| #55 | json5 | GHSA-9c47-m6qq-7p4h | updated | 2.2.3, 1.0.2 |
| #48 | loader-utils | GHSA-76p3-8jx3-jpfq | updated | 1.4.2 |
| #45 | got | GHSA-pfrx-2q88-qq97 | removed | removed |
| #28 | ajv | GHSA-v88g-cgmw-v5xw | updated | 8.20.0 |
| #12 | serialize-javascript | GHSA-hxcc-f52p-wc94 | updated | 7.1.4 |
| #10 | serialize-javascript | GHSA-h9rv-jmmf-4pgx | updated | 7.1.4 |
