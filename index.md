---
layout: home
layoutClass: 'm-home-layout'
# title: '青萱织梦人的个人博客，记录随笔、开发经验和学习笔记'
# titleTemplate: Vite & Vue powered static site generator
# head:
#   - - meta
#     - name: description
#       content: hello
#   - - meta
#     - name: keywords
#       content: super duper SEO
# 首页部分元素定制
blog:
  name: "欢迎来到青萱织梦人的博客"
  motto: 记录日常和知识分享
  inspiring:
    - 没能留住你，也不曾忘记你
    - 人生就是不断取舍的过程，你可以拥有很多，但终究要放弃很多
  # 设置 inspiringTimeout 可以实现自动切换
  inspiringTimeout: 5000
  pageSize: 6
# pagefind-indexed: false
# hero:
#   name: YMY
#   text: 笔记专区
#   tagline: 一个轻量级笔记记录站，记录随笔、开发经验和学习笔记
#   image:
#     src: /assets/102649628_p0.svg
#     # src: /assets/102601409_p1.svg
#     alt: youmengyin
#   actions:
#     - theme: brand
#       text: 快速开始
#       link: /guide/install
#     - theme: alt
#       text: GitHub
#       link: https://github.com/mcwmengxi

# features:
#   - icon: ✍
#     title: 开发经验沉淀
#     details: 开发经验整理、踩坑记录，代码沉淀、可复用代码/样式等收集，实现高效开发。
#   - icon: 🔥
#     title: 前端开发
#     details: 前端开发工程师相关技能梳理、知识整理（初级、中级、高级）。思维导图方式记录、实现结构化、体系化、树形成长。
#   - icon: 🔑
#     title: 服务端开发
#     details: 暂时以 golang 为主、涉及接口实现、运维部署、nginx/docker/CI、CD 等
---
<Home/>
<!-- 纸屑效果 -->
<Confetti />
<script setup>
import { onMounted } from 'vue'
import { addReleaseTag } from './.vitepress/utils/addReleaseTag.js'
import Home from '@theme/index.vue'
onMounted(() => {
  addReleaseTag()
})
</script>
<style>
/*爱的魔力转圈圈*/
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .bottom-small {
  display: block;
  margin-top: 2em;
  text-align: right;
}
</style>
