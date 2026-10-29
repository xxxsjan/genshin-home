<script setup lang="ts">
const props = defineProps<{
  character?: string;
}>();

const emit = defineEmits<{
  "update:character": [name: string];
  openFull: [];
}>();
</script>

<template>
  <div class="widget">
    <div class="widget-head">
      <div>
        <div class="widget-title">武器期望榜</div>
        <div class="widget-sub">专武精 1 = 100% · 点角色切换</div>
      </div>
      <button
        type="button"
        class="full-btn"
        title="打开完整期望页"
        @click="emit('openFull')"
      >
        完整页
      </button>
    </div>
    <div class="widget-body">
      <WuqiEvPanel
        :character="props.character"
        compact
        @update:character="emit('update:character', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.widget {
  width: 420px;
  max-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  text-align: left;
  color: #886444;
  background: rgba(240, 237, 232, 0.92);
  border: 1px solid rgba(136, 100, 68, 0.35);
  border-radius: 10px;
  padding: 12px 14px 10px;
  box-shadow: 0 10px 28px rgba(40, 24, 8, 0.22);
  backdrop-filter: blur(8px);
}

.widget-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.widget-title {
  font-size: 16px;
  font-weight: 750;
}

.widget-sub {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
}

.full-btn {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(136, 100, 68, 0.35);
  background: #886444;
  color: #f0ede8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
}

.widget-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  margin: 0 -6px;
  padding: 0 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 100, 68, 0.28) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(136, 100, 68, 0.28);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(136, 100, 68, 0.45);
  }

  :deep(.ev-panel) {
    padding: 4px 0 8px;
  }
}
</style>
