<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import imageData from "~/data-source/image-data";
import beibao from "~/data-source/beibao";
import roleWithTianfu from "~/data-source/role-with-tianfu";
import wuqiTupoCailiaoData from "~/data-source/wuqi-tupo-cailiao";
import wuqiData from "~/data-source/wuqi";

const flatImageData = imageData;

// console.log(flatImageData);

const today = dayjs();
const dayOfWeek = today.day();

const weekText = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  7: "周日",
}[dayOfWeek];

function numberToChinese(num: number) {
  const digits = ["零", "一", "二", "三", "四", "五", "六", "日"];
  return digits[num];
}

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
  (f) => weekText === "周日" || f.time === weekText
);

useData.forEach((item) => {
  item.data = beibao.filter((f) => f.title.indexOf(item.name) > -1);
  item.role = roleWithTianfu
    .filter((f) => f.tianfu === item.name)
    .map((it) => ({
      ...it,
      image: flatImageData.find((f) => f.title === it.title),
    }));
});

const tianfudata: ItemType[] = [
  useData.find((f) => f.area === "蒙德") as ItemType,
  useData.find((f) => f.area === "璃月") as ItemType,
  useData.find((f) => f.area === "稻妻") as ItemType,
  useData.find((f) => f.area === "须弥") as ItemType,
];
</script>

<template>
  <div class="header">今日材料</div>
  <div class="time">{{ weekText }}</div>
  
  <div class="grid-container" v-if="dayOfWeek !== 7">
    <!-- 天赋书 标题 -->
    <div class="tianfu_title">天赋书</div>

    <!-- 天赋书 显示区-->
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`tianfu tianfu${index + 1}`">
        <div class="flex-row">
          <div>{{ tianfudata[index].name }}</div>
          <div class="img-wrap">
            <img :src="tianfudata[0].data[0].icon" alt="" />
            <img :src="tianfudata[0].data[1].icon" alt="" />
            <img :src="tianfudata[0].data[2].icon" alt="" />
          </div>
        </div>
      </div>
    </template>

    <div class="role_title">角色</div>
    <!-- 天赋书对应角色 -->
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`role role${index + 1}`">
        <img
          v-for="img in tianfudata[index].role"
          :key="img.title"
          :src="img.image?.icon"
          :alt="img.title"
        />
      </div>
    </template>
    <!-- 武器突破材料 标题 -->
    <div class="wqtpcl_title">
      <div>武器</div>
      <div>突破</div>
      <div>材料</div>
    </div>
    <!-- 武器突破材料 显示区 -->
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`wqtpcl wqtpcl${index + 1}`">
        <div>【{{ renderWuqi[index][0].title.split(/的|之/)[0] }}】</div>
        <div class="img-wrap flex-row">
          <img v-for="item in renderWuqi[index]" :src="item.icon" />
        </div>
      </div>
    </template>
    <!-- 武器突破材料对应武器 -->
    <div class="wuqi_title">武器</div>
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`wuqi wuqi${index + 1}`">
        <img v-for="item in renderWuqi[index][0].info.wuqi" :src="item.src" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@mixin flexCenter($direction: row) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: $direction;
}
@mixin flexAround($direction: row) {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: $direction;
}

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
.grid-container {
  margin-top: 10px;
  background-color: #886444;
  min-width: 1200px;
  // height: 100vh;
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 1fr;
  grid-template-rows: 100px minmax(200px, auto) 120px minmax(0, auto);

  grid-template-areas:
    "tianfu tianfu1 tianfu2 tianfu3 tianfu4"
    "role role1 role2 role3 role4"
    "wqtpcl wqtpcl1 wqtpcl2 wqtpcl3 wqtpcl4"
    "wuqi wuqi1 wuqi2 wuqi3 wuqi4";
  grid-gap: 20px;

  font-size: 20px;
}

.wqtpcl {
  @include lightBg();
  @include flexAround(column);

  &_title {
    grid-area: wqtpcl;
    @include lightBg();
    @include flexCenter(column);
  }
  img {
    width: 50px;
  }
  .img-wrap {
    @include flexAround();
  }
}

.wuqi {
  background-color: #f0ede8;
  column-count: 3;
  // column-width: 100px;
  flex-wrap: wrap;
  padding: 10px;
  &_title {
    grid-area: wuqi;
    @include lightBg();
    @include flexCenter();
  }
  img {
    width: 66px;
  }
}
@for $i from 1 through 4 {
  .wqtpcl#{$i} {
    grid-area: wqtpcl#{$i};
  }

  .wuqi#{$i} {
    grid-area: wuqi#{$i};
  }

  .role#{$i} {
    grid-area: role#{$i};
  }

  .tianfu#{$i} {
    grid-area: tianfu#{$i};
  }
}

.flex-row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.tianfu {
  @include lightBg();
  @include flexAround;
  width: 100%;
  flex-direction: column;

  &_title {
    @include lightBg();
    grid-area: tianfu;
    @include flexCenter();
  }
  img {
    width: 50px;
  }
  .img-wrap {
    width: 66%;
    @include flexAround;
  }
}

.role {
  // width: 100%;
  background-color: #f0ede8;
  column-count: 2;
  column-width: 100px;
  flex-wrap: wrap;
  padding: 10px;
  img {
    width: 110px;
  }
  &_title {
    grid-area: role;
    @include lightBg();
    @include flexCenter();
  }
}
</style>
