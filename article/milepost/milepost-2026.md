---
description: '2026 里程碑'
---

<BackTop />

# 2026 里程碑

## 2026-03-05

在 Vue 3 中，当 ref 属性在 v-for 循环内部使用时，Vue 会自动将其收集为数组形式。即使你的 v-if 条件确保只有一个组件被渲染，Vue 仍然会将其视为在循环中。

```vue
<template v-for="item in dynamicList" :key="item.id">
  <Item :id="item.id">
    <template v-else-if="item.id === 'BaseInfo'">
      <BaseInfoForm ref="BaseInfoFormRef" />
      <!-- ❌ 在 v-for 内部 -->
      <BaseInfoForm :ref="(el) => (BaseInfoFormRef = el)" />
      <!-- ✅ 正确用法 -->
    </template>
  </Item>
</template>
```
