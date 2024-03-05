---
layout: home
title: '青萱织梦人的个人博客，记录随笔、开发经验和学习笔记'
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
  tagline: 一个轻量级笔记记录站，记录随笔、开发经验和学习笔记
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
  - icon: ✍
    title: 开发经验沉淀
    details: 开发经验整理、踩坑记录，代码沉淀、可复用代码/样式等收集，实现高效开发。
  - icon: 🔥
    title: 前端开发
    details: 前端开发工程师相关技能梳理、知识整理（初级、中级、高级）。思维导图方式记录、实现结构化、体系化、树形成长。
  - icon: 🔑
    title: 服务端开发
    details: 暂时以 golang 为主、涉及接口实现、运维部署、nginx/docker/CI、CD 等
---
<Home/>

<script setup>
import { onMounted } from 'vue'
import { addReleaseTag } from './.vitepress/utils/addReleaseTag.js'
import Home from '@theme/index.vue'
onMounted(() => {
  addReleaseTag()
})

</script>
