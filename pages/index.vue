<script setup lang="ts">
import dayjs from "dayjs";

import roleWithTianfu from "~/spider-data/data/role-with-tianfu.json";
import wuqiData from "~/spider-data/data/wuqi.json";
import beibao from "~/spider-data/data/beibao.json";
import wuqiTupoCailiaoData from "~/spider-data/data/wuqi-tupo-cailiao.json";
import imageData from "~/spider-data/data/role-data.json";

const today = dayjs();
const dayOfWeek = today.day();
// const dayOfWeek = 7;

const weekText = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  7: "周日",
}[dayOfWeek];
const { tianfudata, renderWuqi } = createData(dayOfWeek);

function createData(dayOfWeek: number) {
  function numberToChinese(num: number) {
    const digits = ["零", "一", "二", "三", "四", "五", "六", "日"];
    return digits[num];
  }
  // 武器逻辑
  function filterWuqiTupoCailiao() {
    const reg = new RegExp(numberToChinese(dayOfWeek));
    const res = wuqiTupoCailiaoData.filter((f) => f.info.getWay[0].match(reg));
    res.forEach((item) => {
      item.info.wuqi = item.info.wuqi.filter((f) =>
        wuqiData.map((m) => m.title).includes(f.name)
      );
    });
    return res;
  }
  const tupocailiaoMap = {
    // 蒙德
    0: ["凛风奔狼", "高塔孤王", "狮牙斗士"],
    // 璃月
    1: ["雾海云间", "孤云寒林", "漆黑陨铁"],
    // 稻妻
    2: ["鸣神御灵", "远海夷地", "今昔剧画"],
    // 须弥
    3: ["绿洲花园", "谧林涓露", "烈日威权"],
  };
  const _renderWuqiData = filterWuqiTupoCailiao();

  const renderWuqi: (typeof _renderWuqiData)[] = Array.from({ length: 4 }).map(
    () => []
  );

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
  const tianfuMap = {
    // 蒙德
    0: ["凛风奔狼", "高塔孤王", "狮牙斗士"],
    // 璃月
    1: ["雾海云间", "孤云寒林", "漆黑陨铁"],
    // 稻妻
    2: ["鸣神御灵", "远海夷地", "今昔剧画"],
    // 须弥
    3: ["绿洲花园", "谧林涓露", "烈日威权"],
  };
  const data1 = [
    { name: "「自由」", area: "蒙德", time: "周一/周四" },
    { name: "「繁荣」", area: "璃月", time: "周一/周四" },
    { name: "「浮世」", area: "稻妻", time: "周一/周四" },
    { name: "「诤言」", area: "须弥", time: "周一/周四" },

    { name: "「抗争」", area: "蒙德", time: "周二/周五" },
    { name: "「勤劳」", area: "璃月", time: "周二/周五" },
    { name: "「风雅」", area: "稻妻", time: "周二/周五" },
    { name: "「巧思」", area: "须弥", time: "周二/周五" },

    { name: "「诗文」", area: "蒙德", time: "周三/周六" },
    { name: "「黄金」", area: "璃月", time: "周三/周六" },
    { name: "「天光」", area: "稻妻", time: "周三/周六" },
    { name: "「笃行」", area: "须弥", time: "周三/周六" },
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
      .filter((f) => f.tianfu === item.name)
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
  ];

  return {
    tianfudata,
    renderWuqi,
  };
}
</script>

<template>
  <div class="header">今日材料</div>
  <div class="time">{{ weekText }}</div>

  <GenshinGrid
    v-if="weekText !== '周日'"
    :tianfudata="tianfudata"
    :renderWuqi="renderWuqi"
  />
  <template v-else>
    <GenshinGrid
      :tianfudata="createData(1).tianfudata"
      :renderWuqi="createData(1).renderWuqi"
    />
    <GenshinGrid
      :tianfudata="createData(2).tianfudata"
      :renderWuqi="createData(2).renderWuqi"
    />
    <GenshinGrid
      :tianfudata="createData(3).tianfudata"
      :renderWuqi="createData(3).renderWuqi"
    />
  </template>
</template>

<style scoped lang="scss">
@mixin lightBg {
  background-color: #f0ede8;
  color: #886444;
}

@mixin darkBg {
  background-color: #886444;
  color: #f0ede8;
}

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
