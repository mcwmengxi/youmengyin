<template>
  <BlogTheme.Layout v-bind="$attrs">
    <!--
        相关插槽
        https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
        https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue
      -->
    <template #layout-top>
      <ClientOnly>
        <BabyPulm />
        <!-- 在布局下方添加 雪花特效 -->
        <div class="snow" v-if="theme.website?.showSnow && isDark">
          <div v-for="index in 80" :key="index" class="dot"></div>
        </div>
        <!-- <Lantern /> -->
      </ClientOnly>
    </template>
    <template #home-hero-actions-after
      >、 111111111111111
      <!-- 梅林宝宝 -->
      <BabyPulm />
    </template>
    <template #nav-bar-title-after>
      <MNavVisitor />
    </template>
    <!-- <template #aside-outline-before> My custom sidebar top content </template> -->
    <template #doc-after>
      <MDocFooter />
    </template>
  </BlogTheme.Layout>
</template>

<script setup lang="ts">
import BlogTheme from '@sugarat/theme'
import MNavVisitor from './MNavVisitor.vue'
import { useData } from 'vitepress'
import MDocFooter from './MDocFooter.vue'

const { isDark, theme, frontmatter } = useData()
</script>
