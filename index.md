---
layout: home
title: 'A storybook By Vue3 && Vite Press '
titleTemplate: Vite & Vue powered static site generator
head:
  - - meta
    - name: description
      content: hello
  - - meta
    - name: keywords
      content: super duper SEO
hero:
  name: YMY
  text: 笔记专区
  tagline: 一个轻量级笔记记录站，基于 vue3 + typescript，全面拥抱 vue3
  image:
    src: /assets/102649628_p0.svg
    # src: /assets/102601409_p1.svg
    alt: youmengyin
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/install
    - theme: alt
      text: GitHub
      link: https://github.com/mcwmengxi

features:
  - icon: 💡
    title: 简洁至上
    details: ymy-ui 整体非常简洁明了，虽没有很多高级的组件，但它是使用最简单的方式达到实用的效果。
  - icon: ⚡️
    title: 轻量容易
    details: 使用方便，配置简单，目录清晰，结构简单，组件轻量级，上手简单，像复制粘贴一样容易。
  - icon: 🔑
    title: 使用 TypeScript
    details: 严格的 TypeScript 类型
---
<Home/>
<!-- Placeholder -->

<script setup>
import { onMounted } from 'vue'
import { addReleaseTag } from './.vitepress/utils/addReleaseTag.js'
import Home from '@theme/index.vue'
onMounted(() => {
  addReleaseTag()
})

</script>
