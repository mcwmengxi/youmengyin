<template>
  <div class="layout-bottom-extra-tips">
    <span>👁️‍🗨️总访问量 <span id="busuanzi_value_site_pv" /> 次&nbsp;|&nbsp;</span>
    <span>👤访客数 <span id="busuanzi_value_site_uv" /> 次&nbsp;|&nbsp;</span>
    <span>🏃已运行 {{ getDiffDate("2022-11-07") }} 天</span>
  </div>
</template>

<script setup lang="ts">
import { getDiffDate } from "../utils/index";

</script>
<style scoped lang="scss">
.layout-bottom-extra-tips {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  /* 以上取footer相同样式 */
  margin-top: -20px;
  padding-bottom: 20px;
  z-index: 1;
  display: none;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  &>span{
    white-space: nowrap;
  }
}
.blog-footer + .layout-bottom-extra-tips{
  display: flex;
}
</style>
