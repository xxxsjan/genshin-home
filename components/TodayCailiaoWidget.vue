<script setup lang="ts">
import {
  createCailiaoData,
  flattenTodayRoles,
  flattenTodayWeapons,
  getGameDayOfWeek,
  groupWeaponsByType,
  weekLabelMap,
  type TodayRoleItem,
  type TodayWeaponItem,
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
    const merged = [1, 2, 3].map((d) => createCailiaoData(d, bundle));
    const roles = new Map<string, TodayRoleItem>();
    const weapons = new Map<string, TodayWeaponItem>();
    for (const r of merged) {
      for (const role of flattenTodayRoles(r, bundle.tujian_role)) {
        roles.set(role.title, role);
      }
      for (const w of flattenTodayWeapons(r, bundle.tujian_wuqi)) {
        weapons.set(w.name, w);
      }
    }
    const roleList = [...roles.values()].sort(
      (a, b) => b.star - a.star || a.title.localeCompare(b.title, "zh")
    );
    const weaponList = [...weapons.values()].sort((a, b) => {
      const order = ["单手剑", "双手剑", "长柄武器", "弓", "法器", "其他"];
      const ta = order.indexOf(a.type);
      const tb = order.indexOf(b.type);
      if (ta !== tb) return (ta === -1 ? 99 : ta) - (tb === -1 ? 99 : tb);
      if (b.star !== a.star) return b.star - a.star;
      return a.name.localeCompare(b.name, "zh");
    });
    return { roles: roleList, weapons: weaponList };
  }
  const result = createCailiaoData(dayOfWeek, bundle);
  return {
    roles: flattenTodayRoles(result, bundle.tujian_role),
    weapons: flattenTodayWeapons(result, bundle.tujian_wuqi),
  };
});

const weaponGroups = computed(() =>
  groupWeaponsByType(dayResult.value.weapons)
);

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
        <div class="widget-sub">{{ weekText }} · 五星优先 · 点角色联动期望榜</div>
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
            :class="{ hasEv: evNames.has(role.title), five: role.star === 5 }"
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
        <div
          v-for="group in weaponGroups"
          :key="group.type"
          class="type-group"
        >
          <div class="type-label">{{ group.type }}</div>
          <div class="avatar-grid weapons">
            <div
              v-for="w in group.items"
              :key="w.name"
              class="avatar weapon"
              :class="{ five: w.star === 5 }"
              :title="`${w.name}${w.star ? ` · ${w.star}星` : ''}`"
            >
              <img v-if="w.icon" :src="w.icon" :alt="w.name" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hint">点角色可联动右侧期望榜 · 点「完整页」看大表</div>
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
  margin-bottom: 10px;
  flex-shrink: 0;
}

.widget-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
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

.type-group {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.type-label {
  font-size: 11px;
  font-weight: 650;
  opacity: 0.75;
  margin-bottom: 4px;
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

  &.five {
    box-shadow: 0 0 0 1px rgba(201, 152, 58, 0.65);
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
