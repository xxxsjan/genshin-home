<script setup lang="ts">
import {
  createCailiaoData,
  getGameDayOfWeek,
  weekLabelMap,
  type CailiaoGridItem,
} from "~/utils/cailiao-day";

useHead({
  title: "今日材料",
});

const dayOfWeek = getGameDayOfWeek();
const weekText = ref(weekLabelMap[dayOfWeek]);
const timeVal = ref(0);

const bundle = ref(getGenshinHomeBundle());

const tianfudata = ref<CailiaoGridItem[]>([]);
const renderWuqi = ref<WuqiTupoCailiaoItem[][]>([]);
const sundayGrids = ref<
  { tianfudata: CailiaoGridItem[]; renderWuqi: WuqiTupoCailiaoItem[][] }[]
>([]);

function applyDay(day: number) {
  if (!bundle.value) return;
  if (weekText.value === "周日" || day === 0) {
    sundayGrids.value = [1, 2, 3].map((d) =>
      createCailiaoData(d, bundle.value!)
    );
    tianfudata.value = [];
    renderWuqi.value = [];
    return;
  }
  const result = createCailiaoData(day, bundle.value);
  tianfudata.value = result.tianfudata;
  renderWuqi.value = result.renderWuqi;
}

watch(
  bundle,
  () => {
    const day = timeVal.value || dayOfWeek;
    applyDay(day === 0 ? 0 : day);
  },
  { immediate: true }
);

watch(timeVal, (val) => {
  weekText.value = weekLabelMap[val];
  applyDay(val);
});
</script>

<template>
  <div class="min-w-[1400px]">
    <div class="header">
      <NuxtLink to="/" class="header-link ml-4">← 桌面</NuxtLink>
      <span class="ml-4">今日材料</span>
      <div class="dropdown dropdown-bottom">
        <div tabindex="0" role="button" class="timeText ml-4">
          ({{ weekText }})
        </div>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-[#886444]"
        >
          <li
            v-for="(item, index) in ['周一/周四', '周二/周五', '周三/周六']"
            :key="index"
            @click="timeVal = index + 1"
          >
            <a>{{ item }}</a>
          </li>
        </ul>
      </div>
      <NuxtLink to="/wuqi-ev" class="header-link ml-auto mr-4">
        武器期望榜
      </NuxtLink>
    </div>

    <GenshinGrid
      v-if="weekText !== '周日'"
      :tianfudata="tianfudata"
      :renderWuqi="renderWuqi"
    />
    <template v-else>
      <GenshinGrid
        v-for="(grid, i) in sundayGrids"
        :key="i"
        :tianfudata="grid.tianfudata"
        :renderWuqi="grid.renderWuqi"
        :class="i < sundayGrids.length - 1 ? 'mb-2' : ''"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.header {
  @include darkBg();
  width: 100%;
  line-height: 50px;
  font-weight: 600;
  font-size: 24px;
  height: 50px;
  display: flex;
  align-items: center;
}

.header-link {
  color: #f0ede8;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  opacity: 0.9;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}
</style>
