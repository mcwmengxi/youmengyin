<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div align="center" style="margin-top: 50px">
    <!-- <img
      src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&pause=1000&center=true&vCenter=true&width=435&lines=%E6%84%BF%E6%88%91%E5%A6%82%E9%95%BF%E9%A3%8E%EF%BC%8C%E6%B8%A1%E5%90%9B%E8%A1%8C%E4%B8%87%E9%87%8C%E3%80%82"
    /> -->
    {{ frontmatter.title }}
    <a href="https://git.io/typing-svg"
      ><img
        src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=36BCF7CC&center=true&vCenter=true&width=435&lines=%E6%84%BF%E6%88%91%E5%A6%82%E9%95%BF%E9%A3%8E%EF%BC%8C%E6%B8%A1%E5%90%9B%E8%A1%8C%E4%B8%87%E9%87%8C%E3%80%82"
        alt="Typing SVG"
    /></a>
  </div>
</template>

<style scoped>
.f-main {
  max-width: 620px;
  margin: 40px auto;
  box-sizing: border-box;
  padding: 40px;
  padding-bottom: 0;
}

.f-button-default {
  margin-left: 10px;
}

.f-text {
  display: block;
  line-height: 40px;
}
</style>
