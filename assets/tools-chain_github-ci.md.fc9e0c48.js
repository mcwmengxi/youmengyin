import{_ as s,o as n,c as a,a as l}from"./app.87e390a5.js";const m=JSON.parse('{"title":"github-ci","description":"","frontmatter":{},"headers":[{"level":2,"title":"github-ci","slug":"github-ci"}],"relativePath":"tools-chain/github-ci.md","lastUpdated":1671468376000}'),p={name:"tools-chain/github-ci.md"},e=l(`<h2 id="github-ci" tabindex="-1">github-ci <a class="header-anchor" href="#github-ci" aria-hidden="true">#</a></h2><div class="language-bash line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">name: Build and Deploy</span></span>
<span class="line"><span style="color:#A6ACCD;">permissions:</span></span>
<span class="line"><span style="color:#A6ACCD;">  contents: write</span></span>
<span class="line"><span style="color:#A6ACCD;">on:</span></span>
<span class="line"><span style="color:#A6ACCD;">  push:</span></span>
<span class="line"><span style="color:#A6ACCD;">    branches:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - master</span></span>
<span class="line"><span style="color:#A6ACCD;">jobs:</span></span>
<span class="line"><span style="color:#A6ACCD;">  deploy:</span></span>
<span class="line"><span style="color:#A6ACCD;">    concurrency: ci-</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">{ github.ref </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    runs-on: ubuntu-latest</span></span>
<span class="line"><span style="color:#A6ACCD;">    steps:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - name: Checkout \u{1F6CE}\uFE0F</span></span>
<span class="line"><span style="color:#A6ACCD;">        uses: actions/checkout@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">      - name: Setup node</span></span>
<span class="line"><span style="color:#A6ACCD;">        uses: actions/setup-node@v2</span></span>
<span class="line"><span style="color:#A6ACCD;">        with:</span></span>
<span class="line"><span style="color:#A6ACCD;">          node-version: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">16</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">          registry-url: https://registry.npmjs.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">      - name: Setup pnpm</span></span>
<span class="line"><span style="color:#A6ACCD;">        uses: pnpm/action-setup@v2</span></span>
<span class="line"><span style="color:#A6ACCD;">        with:</span></span>
<span class="line"><span style="color:#A6ACCD;">          version: latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">      - name: Install and Build \u{1F527} </span><span style="color:#676E95;font-style:italic;"># This example project is built using npm and outputs the result to the &#39;build&#39; folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.</span></span>
<span class="line"><span style="color:#A6ACCD;">        run: </span><span style="color:#89DDFF;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">          pnpm install</span></span>
<span class="line"><span style="color:#A6ACCD;">          pnpm build</span></span>
<span class="line"><span style="color:#A6ACCD;">          </span><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> docs/.vitepress/dist</span></span>
<span class="line"><span style="color:#A6ACCD;">          touch README.md .nojekyll</span></span>
<span class="line"><span style="color:#A6ACCD;">      - name: Deploy \u{1F680}</span></span>
<span class="line"><span style="color:#A6ACCD;">        uses: JamesIves/github-pages-deploy-action@v4</span></span>
<span class="line"><span style="color:#A6ACCD;">        with:</span></span>
<span class="line"><span style="color:#A6ACCD;">          folder: docs/.vitepress/dist</span></span>
<span class="line"><span style="color:#A6ACCD;">          clean: </span><span style="color:#82AAFF;">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div>`,2),r=[e];function c(o,i,t,b,u,A){return n(),a("div",null,r)}var y=s(p,[["render",c]]);export{m as __pageData,y as default};
