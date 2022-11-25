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
    # src: https://tianyuhao.cn/images/tyh-ui/tyh-ui2.svg
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
<div align="center" style="margin-top: 50px">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&pause=1000&center=true&vCenter=true&width=435&lines=%E6%84%BF%E6%88%91%E5%A6%82%E9%95%BF%E9%A3%8E%EF%BC%8C%E6%B8%A1%E5%90%9B%E8%A1%8C%E4%B8%87%E9%87%8C%E3%80%82" />
{{ $frontmatter.title }}
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=36BCF7CC&center=true&vCenter=true&width=435&lines=%E6%84%BF%E6%88%91%E5%A6%82%E9%95%BF%E9%A3%8E%EF%BC%8C%E6%B8%A1%E5%90%9B%E8%A1%8C%E4%B8%87%E9%87%8C%E3%80%82" alt="Typing SVG" /></a>
</div>
<!-- Placeholder -->

<script setup>
import { onMounted } from 'vue'
import { addReleaseTag } from './.vitepress/utils/addReleaseTag.js'

onMounted(() => {
  addReleaseTag()
})

</script>