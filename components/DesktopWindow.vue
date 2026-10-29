<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
  }>(),
  {
    x: 120,
    y: 80,
    width: 520,
    height: 560,
    zIndex: 10,
  }
);

const emit = defineEmits<{
  close: [];
  focus: [];
  move: [pos: { x: number; y: number }];
}>();

const pos = reactive({ x: props.x, y: props.y });
const dragging = ref(false);
const offset = reactive({ x: 0, y: 0 });

watch(
  () => [props.x, props.y],
  ([x, y]) => {
    if (!dragging.value) {
      pos.x = x as number;
      pos.y = y as number;
    }
  }
);

function onTitleDown(e: PointerEvent) {
  const target = e.target as HTMLElement;
  if (target.closest("[data-no-drag]")) return;
  dragging.value = true;
  offset.x = e.clientX - pos.x;
  offset.y = e.clientY - pos.y;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  emit("focus");
}

function onTitleMove(e: PointerEvent) {
  if (!dragging.value) return;
  const next = {
    x: Math.max(0, e.clientX - offset.x),
    y: Math.max(0, e.clientY - offset.y),
  };
  pos.x = next.x;
  pos.y = next.y;
  emit("move", next);
}

function onTitleUp() {
  dragging.value = false;
}
</script>

<template>
  <div
    class="desk-window"
    :style="{
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex,
    }"
    @pointerdown="emit('focus')"
  >
    <div
      class="titlebar"
      @pointerdown="onTitleDown"
      @pointermove="onTitleMove"
      @pointerup="onTitleUp"
      @pointercancel="onTitleUp"
    >
      <span class="title-text">{{ title }}</span>
      <button
        type="button"
        class="close-btn"
        data-no-drag
        aria-label="关闭"
        @click.stop="emit('close')"
      >
        ×
      </button>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.desk-window {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: #f0ede8;
  color: #886444;
  box-shadow: 0 12px 40px rgba(40, 24, 8, 0.35);
  border: 1px solid rgba(136, 100, 68, 0.35);
  text-align: left;
  min-width: 280px;
  min-height: 200px;
}

.titlebar {
  @include darkBg();
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 14px;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
}

.title-text {
  flex: 1;
  font-size: 13px;
  font-weight: 650;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.close-btn {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: none;
  padding: 0;
  background: transparent;
  color: #f0ede8;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(240, 237, 232, 0.18);
  }
}

.body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #f0ede8;
}
</style>
