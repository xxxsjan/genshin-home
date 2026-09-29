<script setup lang="ts">
import dayjs from "dayjs";

useHead({
  title: "原神素材",
});

const today = dayjs();
const currentTime = dayjs().format("HH");

const dayOfWeek =
  +currentTime < 4
    ? today.day() - 1 === -1
      ? 6
      : today.day() - 1
    : today.day();

const mapData: Record<number, string> = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  0: "周日",
};
const weekText = ref(mapData[dayOfWeek]);
const timeVal = ref(0);

const {
  data: bundle,
  pending,
  error,
  refresh,
} = await useFetch<GenshinHomeBundle>("/api/genshin-data", {
  key: "genshin-home-data",
  server: true,
});

/** 若本轮补全已达上限，说明后面还有，自动再拉一轮 */
watch(
  () => bundle.value?.synced,
  (synced) => {
    if (!synced) return;
    if (synced.roleTianfu >= 24 || synced.wuqiCailiao >= 24) {
      setTimeout(() => refresh(), 800);
    }
  }
);

type GridItem = {
  name: string;
  area: string;
  time: string;
  data?: any;
  role?: any;
};

const tianfudata = ref<GridItem[]>([]);
const renderWuqi = ref<any[]>([]);
const sundayGrids = ref<{ tianfudata: GridItem[]; renderWuqi: any[] }[]>([]);

function createData(day: number, src: GenshinHomeBundle) {
  const wuqiData = src.tujian_wuqi;
  const beibao = src.tujian_beibao;
  const imageData = src.tujian_role;
  const roleWithTianfu = src.roleWithTianfu;
  const wuqiTupoCailiaoData = src.wuqiTupoCailiao;

  const tupocailiaoMap = [
    ["凛风奔狼", "高塔孤王", "狮牙斗士"],
    ["雾海云间", "孤云寒林", "漆黑陨铁"],
    ["鸣神御灵", "远海夷地", "今昔剧画"],
    ["绿洲花园", "谧林涓露", "烈日威权"],
    ["悠古弦音", "纯圣露滴", "无垢之海"],
  ];

  function numberToChinese(num: number) {
    const digits = ["日", "一", "二", "三", "四", "五", "六", "日"];
    return digits[num];
  }

  function filterWuqiTupoCailiao() {
    const reg = new RegExp(numberToChinese(day));
    const res = JSON.parse(JSON.stringify(wuqiTupoCailiaoData)).filter(
      (f: any) => f.info?.getWay?.[0]?.match(reg)
    );

    res.forEach((item: WuqiTupoCailiaoItem) => {
      item.info.wuqi = item.info.wuqi.filter((f) => {
        const _find = wuqiData.find((m) => m.title === f.name);
        if (_find) {
          f.content_id = _find.content_id;
          return true;
        }
        return false;
      });
    });
    return res;
  }

  const _renderWuqiData = filterWuqiTupoCailiao();
  const nextRenderWuqi: (typeof _renderWuqiData)[] = Array.from({
    length: tupocailiaoMap.length,
  }).map(() => []);

  function findMapIndex(str: string) {
    let index = -1;
    for (const [key, value] of Object.entries(tupocailiaoMap)) {
      if (value.find((f) => str.match(new RegExp(f)))) {
        index = Number(key);
        break;
      }
    }
    return index;
  }

  while (_renderWuqiData.length) {
    const _item = _renderWuqiData.shift()!;
    const index = findMapIndex(_item.title);
    if (index > -1) nextRenderWuqi[index].push(_item);
  }

  const data1 = [
    { name: "「自由」", area: "蒙德", time: "周一/周四" },
    { name: "「繁荣」", area: "璃月", time: "周一/周四" },
    { name: "「浮世」", area: "稻妻", time: "周一/周四" },
    { name: "「诤言」", area: "须弥", time: "周一/周四" },
    { name: "「公平」", area: "枫丹", time: "周一/周四" },
    { name: "「抗争」", area: "蒙德", time: "周二/周五" },
    { name: "「勤劳」", area: "璃月", time: "周二/周五" },
    { name: "「风雅」", area: "稻妻", time: "周二/周五" },
    { name: "「巧思」", area: "须弥", time: "周二/周五" },
    { name: "「正义」", area: "枫丹", time: "周二/周五" },
    { name: "「诗文」", area: "蒙德", time: "周三/周六" },
    { name: "「黄金」", area: "璃月", time: "周三/周六" },
    { name: "「天光」", area: "稻妻", time: "周三/周六" },
    { name: "「笃行」", area: "须弥", time: "周三/周六" },
    { name: "「秩序」", area: "枫丹", time: "周三/周六" },
  ];

  const useData: GridItem[] = data1.filter(
    (f) => day === 7 || f.time.match(new RegExp(numberToChinese(day)))
  );

  useData.forEach((item) => {
    item.data = beibao.filter((f) => f.title.indexOf(item.name) > -1);
    item.role = roleWithTianfu
      .filter((f) => f.tianfu && f.tianfu === item.name)
      .map((it) => ({
        ...it,
        image: imageData.find((f) => f.title === it.title),
      }));
  });

  const nextTianfu: GridItem[] = [
    useData.find((f) => f.area === "蒙德") as GridItem,
    useData.find((f) => f.area === "璃月") as GridItem,
    useData.find((f) => f.area === "稻妻") as GridItem,
    useData.find((f) => f.area === "须弥") as GridItem,
    useData.find((f) => f.area === "枫丹") as GridItem,
  ];

  return {
    tianfudata: nextTianfu,
    renderWuqi: nextRenderWuqi,
  };
}

function applyDay(day: number) {
  if (!bundle.value) return;
  if (weekText.value === "周日" || day === 0) {
    sundayGrids.value = [1, 2, 3].map((d) => createData(d, bundle.value!));
    tianfudata.value = [];
    renderWuqi.value = [];
    return;
  }
  const result = createData(day, bundle.value);
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
  weekText.value = mapData[val];
  applyDay(val);
});
</script>

<template>
  <div class="min-w-[1400px]">
    <div class="header">
      <span>今日材料</span>
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
      <span
        v-if="
          bundle?.synced &&
          (bundle.synced.roleTianfu > 0 || bundle.synced.wuqiCailiao > 0)
        "
        class="ml-4 text-sm font-normal opacity-70"
      >
        已补全天赋 {{ bundle.synced.roleTianfu }} / 材料
        {{ bundle.synced.wuqiCailiao }}，继续同步中…
      </span>
    </div>

    <div v-if="pending && !bundle" class="p-8 text-center text-lg">
      正在拉取最新图鉴…
    </div>
    <div v-else-if="error && !bundle" class="p-8 text-center text-lg text-red-600">
      数据加载失败：{{ error.message || error }}
      <button class="btn btn-sm ml-2" @click="refresh()">重试</button>
    </div>

    <template v-else>
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

.time {
  width: 100%;
  @include lightBg();
  border-radius: 5px;
  line-height: 50px;
  height: 50px;
}
</style>
