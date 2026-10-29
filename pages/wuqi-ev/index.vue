<script setup lang="ts">
useHead({
  title: "武器期望榜",
});

const panelRef = ref<{
  onExport: () => Promise<void>;
  exporting: boolean;
  exportError: string;
} | null>(null);

function onExport() {
  panelRef.value?.onExport();
}
</script>

<template>
  <div class="page">
    <header class="header">
      <NuxtLink to="/" class="nav-link">← 桌面</NuxtLink>
      <span class="title">武器期望榜</span>
      <NuxtLink to="/cailiao" class="nav-link right">完整材料页</NuxtLink>
    </header>

    <section class="panel toolbar">
      <button
        type="button"
        class="export-btn"
        :disabled="!!panelRef?.exporting"
        @click="onExport"
      >
        {{ panelRef?.exporting ? "生成预览中…" : "导出榜单" }}
      </button>
      <span v-if="panelRef?.exportError" class="export-error">
        {{ panelRef.exportError }}
      </span>
    </section>

    <section class="panel">
      <WuqiEvPanel ref="panelRef" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-width: 320px;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 48px;
}

.header {
  @include darkBg();
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  box-sizing: border-box;
}

.nav-link {
  color: #f0ede8;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  opacity: 0.9;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }

  &.right {
    margin-left: auto;
  }
}

.title {
  flex: 1;
}

.panel {
  @include lightBg();
  margin: 12px 16px 0;
  padding: 16px 18px;
  border-radius: 6px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.export-btn {
  padding: 7px 16px;
  border-radius: 5px;
  border: 1px solid rgba(136, 100, 68, 0.35);
  background: #886444;
  color: #f0ede8;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.export-error {
  font-size: 12px;
  color: #a04830;
}
</style>
