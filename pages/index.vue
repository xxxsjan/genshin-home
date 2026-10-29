<script setup lang="ts">
useHead({
  title: "原神",
});

const evCharacter = ref<string | undefined>();
const mobileTab = ref<"cailiao" | "wuqi-ev">("cailiao");

const showCailiao = ref(true);
const showWuqiEv = ref(true);

const icons = [
  {
    id: "cailiao" as const,
    label: "今日材料",
    hint: "显示 / 隐藏今日材料",
  },
  {
    id: "wuqi-ev" as const,
    label: "武器期望",
    hint: "显示 / 隐藏武器期望榜",
  },
];

function isIconOn(id: "cailiao" | "wuqi-ev") {
  return id === "cailiao" ? showCailiao.value : showWuqiEv.value;
}

function toggleIcon(id: "cailiao" | "wuqi-ev") {
  if (id === "cailiao") showCailiao.value = !showCailiao.value;
  else showWuqiEv.value = !showWuqiEv.value;
}

function selectEvCharacter(character?: string) {
  if (character) {
    evCharacter.value = character;
    showWuqiEv.value = true;
    mobileTab.value = "wuqi-ev";
  }
}

const clock = ref("");
function tick() {
  const d = new Date();
  clock.value = d.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
tick();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(tick, 30_000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="desktop">
    <div class="wallpaper" aria-hidden="true" />

    <header class="taskbar">
      <div class="taskbar-left">原神</div>
      <div class="taskbar-apps" />
      <div class="taskbar-clock">{{ clock }}</div>
    </header>

    <aside class="icon-rail desktop-only">
      <button
        v-for="icon in icons"
        :key="icon.id"
        type="button"
        class="desk-icon"
        :class="{ off: !isIconOn(icon.id) }"
        :title="icon.hint"
        :aria-pressed="isIconOn(icon.id)"
        @click="toggleIcon(icon.id)"
      >
        <span class="icon-badge" :data-kind="icon.id">
          {{ icon.id === "cailiao" ? "材" : "武" }}
        </span>
        <span class="icon-label">{{ icon.label }}</span>
      </button>
    </aside>

    <nav class="mobile-tabs mobile-only" aria-label="功能切换">
      <button
        type="button"
        class="mobile-tab"
        :class="{ active: mobileTab === 'cailiao' }"
        @click="mobileTab = 'cailiao'"
      >
        今日材料
      </button>
      <button
        type="button"
        class="mobile-tab"
        :class="{ active: mobileTab === 'wuqi-ev' }"
        @click="mobileTab = 'wuqi-ev'"
      >
        武器期望
      </button>
    </nav>

    <div class="widget-row" :data-mobile-tab="mobileTab">
      <TodayCailiaoWidget
        class="widget-cailiao"
        :class="{ 'is-hidden': !showCailiao }"
        @open-ev="selectEvCharacter"
        @open-full="navigateTo('/cailiao')"
      />
      <WuqiEvWidget
        class="widget-wuqi"
        :class="{ 'is-hidden': !showWuqiEv }"
        v-model:character="evCharacter"
        @open-full="navigateTo('/wuqi-ev')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.desktop {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  text-align: left;
  color: #f0ede8;
}

.wallpaper {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 80% 60% at 70% 20%,
      rgba(240, 220, 180, 0.35),
      transparent 55%
    ),
    radial-gradient(
      ellipse 70% 50% at 15% 80%,
      rgba(90, 60, 30, 0.45),
      transparent 50%
    ),
    linear-gradient(165deg, #5c4030 0%, #886444 42%, #3d2a1c 100%);
  z-index: 0;
}

.icon-rail {
  position: absolute;
  top: 56px;
  left: 18px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.desk-icon {
  width: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #f0ede8;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s ease, filter 0.15s ease;

  &:hover {
    opacity: 0.88;
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
    background: transparent;
  }

  &.off {
    opacity: 0.38;
    filter: grayscale(0.35);

    &:hover {
      opacity: 0.5;
    }
  }
}

.icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  background: #f0ede8;
  color: #886444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  &[data-kind="wuqi-ev"] {
    background: #d9c4a4;
  }
}

.icon-label {
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
  text-align: center;
  line-height: 1.25;
}

.mobile-tabs {
  display: none;
}

.widget-row {
  position: absolute;
  top: 56px;
  left: 130px;
  right: 24px;
  bottom: 16px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
  overflow: auto;
}

.widget-cailiao.is-hidden,
.widget-wuqi.is-hidden {
  display: none;
}

.taskbar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 40px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  background: rgba(40, 28, 18, 0.72);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(240, 237, 232, 0.12);
  box-sizing: border-box;
}

.taskbar-left {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.taskbar-apps {
  flex: 1;
  min-width: 0;
}

.taskbar-clock {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  opacity: 0.9;
  white-space: nowrap;
}

.mobile-only {
  display: none !important;
}

@media (max-width: 720px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }

  .mobile-tabs {
    position: absolute;
    top: 48px;
    left: 12px;
    right: 12px;
    z-index: 40;
    display: flex;
    gap: 6px;
    padding: 4px;
    border-radius: 10px;
    background: rgba(40, 28, 18, 0.45);
    backdrop-filter: blur(8px);
    box-sizing: border-box;
  }

  .mobile-tab {
    flex: 1;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(240, 237, 232, 0.75);
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;

    &.active {
      background: #f0ede8;
      color: #886444;
    }
  }

  .widget-row {
    left: 12px;
    right: 12px;
    top: 100px;
    bottom: 12px;
    z-index: 3;
    display: block;
    overflow: hidden;
  }

  .widget-row :deep(.widget) {
    width: 100%;
    max-height: 100%;
    height: 100%;
  }

  .widget-row :deep(.full-btn) {
    display: none;
  }

  .widget-row[data-mobile-tab="cailiao"] .widget-cailiao {
    display: block !important;
  }

  .widget-row[data-mobile-tab="cailiao"] .widget-wuqi {
    display: none !important;
  }

  .widget-row[data-mobile-tab="wuqi-ev"] .widget-wuqi {
    display: block !important;
  }

  .widget-row[data-mobile-tab="wuqi-ev"] .widget-cailiao {
    display: none !important;
  }
}
</style>
