<script setup lang="ts">
import dayjs from "dayjs";

import wuqiData from "~/spider-data/data/tujian_wuqi.json";
import beibao from "~/spider-data/data/tujian_beibao.json";
import imageData from "~/spider-data/data/tujian_role.json";

import roleWithTianfu from "~/spider-data/data/role-with-tianfu.json";
import wuqiTupoCailiaoData from "~/spider-data/data/wuqi-tupo-cailiao.json";

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

console.log("dayOfWeek: ", dayOfWeek);

const mapData: any = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  0: "周日",
};
const weekText = ref(mapData[dayOfWeek]);

let tianfudata: Array<{
    name: string;
    area: string;
    time: string;
    data: ImageDataList;
    role: {
      content_id: number;
      title: string;
      tianfu: string;
      image: {
        content_id: 1220;
        title: string;
        ext: string;
        icon: string;
        bbs_url: string;
        article_user_name: string;
        article_time: string;
        avatar_url: string;
        summary: string;
      };
    }[];
  }> = [],
  renderWuqi: Array<
    ImageData &
      {
        info: {
          imgSrc: string;
          name: string;
          getWay: string[];
          describe: "用途：武器突破素材　　　【炼金】高塔孤王的残垣";
          wuqi: {
            name: string;
            src: string;
            count: string;
            content_id: number;
          }[];
        };
      }[]
  > = [];
const paimengImg =
  "https://act-upload.mihoyo.com/wiki-user-upload/2024/04/07/380453694/f17e67acac32aec78684d10fea22b0b8_6715540715200448148.png";
function createData(dayOfWeek: number) {
  const tupocailiaoMap = [
    // 蒙德
    ["凛风奔狼", "高塔孤王", "狮牙斗士"],
    // 璃月
    ["雾海云间", "孤云寒林", "漆黑陨铁"],
    // 稻妻
    ["鸣神御灵", "远海夷地", "今昔剧画"],
    // 须弥
    ["绿洲花园", "谧林涓露", "烈日威权"],
    // 枫丹
    ["悠古弦音", "纯圣露滴", "无垢之海"],
  ];
  function numberToChinese(num: number) {
    const digits = ["日", "一", "二", "三", "四", "五", "六", "日"];
    return digits[num];
  }
  // 武器逻辑
  function filterWuqiTupoCailiao() {
    const reg = new RegExp(numberToChinese(dayOfWeek));

    // 根据获取方式过滤出当日的武器材料
    const res = JSON.parse(JSON.stringify(wuqiTupoCailiaoData)).filter((f) =>
      f.info.getWay[0].match(reg)
    );

    res.forEach((item) => {
      // 排除四星以下武器
      item.info.wuqi = item.info.wuqi.filter((f) => {
        const _find = wuqiData.find((m) => m.title === f.name);
        if (_find) {
          f.content_id = _find.content_id;
          return true;
        } else {
          return false;
        }
      });
    });
    return res;
  }

  const _renderWuqiData = filterWuqiTupoCailiao();
  console.log("_renderWuqiData: ", _renderWuqiData);

  const renderWuqi: (typeof _renderWuqiData)[] = Array.from({
    length: tupocailiaoMap.length,
  }).map(() => []);

  function findMapIndex(str: string) {
    let index: number = -1;
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
    if (index > -1) {
      renderWuqi[index].push(_item);
    }
  }
  // 角色逻辑

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

  interface ItemType {
    name: string;
    area: string;
    time: string;
    data?: any;
    role?: any;
  }

  const useData: ItemType[] = data1.filter(
    (f) =>
      dayOfWeek === 7 || f.time.match(new RegExp(numberToChinese(dayOfWeek)))
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

  const tianfudata: ItemType[] = [
    useData.find((f) => f.area === "蒙德") as ItemType,
    useData.find((f) => f.area === "璃月") as ItemType,
    useData.find((f) => f.area === "稻妻") as ItemType,
    useData.find((f) => f.area === "须弥") as ItemType,
    useData.find((f) => f.area === "枫丹") as ItemType,
  ];

  return {
    tianfudata,
    renderWuqi,
  };
}

updateData(dayOfWeek);

onMounted(() => {
  setTimeout(async () => {
    const { data } = await useFetch("/api/check");
    console.log("data: ", data);

    if (!data.value?.checkRes) {
      alert("角色 武器数据有更新，等待管理员更新");
    }
  }, 1000);
});

const timeVal = ref(0);

function updateData(num: number) {
  console.log("num: ", num);
  const result = createData(num);

  tianfudata = result.tianfudata;
  console.log("tianfudata: ", tianfudata);
  renderWuqi = result.renderWuqi;
  console.log("renderWuqi: ", renderWuqi);
}

watch(
  () => timeVal.value,
  (val) => {
    weekText.value = mapData[val];
    updateData(val);
  }
);
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
    </div>

    <GenshinGrid
      v-if="weekText !== '周日'"
      :tianfudata="tianfudata"
      :renderWuqi="renderWuqi"
    />
    <template v-else>
      <GenshinGrid
        :tianfudata="createData(1).tianfudata"
        :renderWuqi="createData(1).renderWuqi"
        class="mb-2"
      />
      <GenshinGrid
        :tianfudata="createData(2).tianfudata"
        :renderWuqi="createData(2).renderWuqi"
        class="mb-2"
      />
      <GenshinGrid
        :tianfudata="createData(3).tianfudata"
        :renderWuqi="createData(3).renderWuqi"
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
}

.time {
  width: 100%;
  @include lightBg();
  border-radius: 5px;
  line-height: 50px;
  height: 50px;
}
</style>
