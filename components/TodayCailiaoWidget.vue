<script setup lang="ts">
import {
  createCailiaoData,
  flattenTodayRoles,
  flattenTodayWeapons,
  getGameDayOfWeek,
  weekLabelMap,
} from "~/utils/cailiao-day";
import { wuqiEvRanking } from "~/utils/wuqi-ev-ranking";

const emit = defineEmits<{
  /** 点击组件空白/标题：打开期望榜（可带预选角色） */
  openEv: [character?: string];
  /** 打开完整材料页 */
  openFull: [];
}>();

const bundle = getGenshinHomeBundle();
const dayOfWeek = getGameDayOfWeek();
const weekText = weekLabelMap[dayOfWeek];

const dayResult = computed(() => {
  if (dayOfWeek === 0) {
    // 周日：合并三天材料预览
    const merged = [1, 2, 3].map((d) => createCailiaoData(d, bundle));
    const roles = new Map<string, ReturnType<typeof flattenTodayRoles>[number]>();
    const weapons = new Map<
      string,
      ReturnType<typeof flattenTodayWeapons>[number]
    >();
    for (const r of merged) {
      for (const role of flattenTodayRoles(r)) roles.set(role.title, role);
      for (const w of flattenTodayWeapons(r)) weapons.set(w.name, w);
    }
    return {
      roles: [...roles.values()],
      weapons: [...weapons.values()],
    };
  }
  const result = createCailiaoData(dayOfWeek, bundle);
  return {
    roles: flattenTodayRoles(result),
    weapons: flattenTodayWeapons(result),
  };
});

const evNames = new Set(wuqiEvRanking.map((c) => c.character));

function onRoleClick(e: MouseEvent, title: string) {
  e.stopPropagation();
  emit("openEv", evNames.has(title) ? title : undefined);
}

</script>

<template>
  <div class="widget">
    <div class="widget-head">
      <div>
        <div class="widget-title">今日材料</div>
        <div class="widget-sub">{{ weekText }} · 点角色联动期望榜</div>
      </div>
      <button
        type="button"
        class="full-btn"
        title="打开完整材料页"
        @click.stop="emit('openFull')"
      >
        完整页
      </button>
    </div>

    <div class="widget-body">
      <div class="block">
        <div class="block-label">
          角色天赋
          <span class="count">{{ dayResult.roles.length }}</span>
        </div>
        <div class="avatar-grid">
          <button
            v-for="role in dayResult.roles"
            :key="role.title"
            type="button"
            class="avatar"
            :class="{ hasEv: evNames.has(role.title) }"
            :title="
              evNames.has(role.title)
                ? `${role.title} · 有期望数据`
                : role.title
            "
            @click="onRoleClick($event, role.title)"
          >
            <img v-if="role.icon" :src="role.icon" :alt="role.title" />
            <span v-else class="fallback">{{ role.title.slice(0, 1) }}</span>
          </button>
        </div>
      </div>

      <div class="block">
        <div class="block-label">
          武器突破
          <span class="count">{{ dayResult.weapons.length }}</span>
        </div>
        <div class="avatar-grid weapons">
          <div
            v-for="w in dayResult.weapons"
            :key="w.name"
            class="avatar weapon"
            :title="w.name"
          >
            <img v-if="w.icon" :src="w.icon" :alt="w.name" />
          </div>
        </div>
      </div>
    </div>

    <div class="hint">点角色可联动右侧期望榜 · 点「完整页」看大表</div>
  </div>
</template>

<style scoped lang="scss">
.widget {
  width: 340px;
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
  margin-bottom: 10px;
  flex-shrink: 0;
}

.widget-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
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

.block {
  margin-bottom: 10px;
}

.block-label {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.count {
  font-size: 11px;
  font-weight: 600;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(136, 100, 68, 0.15);
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  overflow: hidden;
  background: #e5dfd4;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &.hasEv {
    border-color: #886444;
  }

  &.weapon {
    border-radius: 6px;
    cursor: default;
  }

  .fallback {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }
}

.hint {
  flex-shrink: 0;
  font-size: 11px;
  opacity: 0.55;
  text-align: center;
  padding-top: 6px;
}
</style>
