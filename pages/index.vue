<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import imageData from "~/data-source/image-data";
import beibao from "~/data-source/beibao";
import roleWithTianfu from "~/data-source/role-with-tianfu";

const flatImageData = imageData;

// console.log(flatImageData);

const today = dayjs();
const dayOfWeek = today.day(); // 获取当前周几，返回0到6之间的整数
const day = ref<number>(dayOfWeek);

const map: Record<number, string> = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  7: "周日",
};

const weekText = map[day.value];

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
const useData: ItemType[] = data1.filter((f) => f.time === weekText);

useData.forEach((item) => {
  item.data = beibao.filter((f) => f.title.indexOf(item.name) > -1);
  item.role = roleWithTianfu
    .filter((f) => f.tianfu === item.name)
    .map((it) => ({
      ...it,
      image: flatImageData.find((f) => f.title === it.title),
    }));
});

// console.log("useData: ", useData);

const tianfudata: ItemType[] = [
  useData.find((f) => f.area === "蒙德") as ItemType,
  useData.find((f) => f.area === "璃月") as ItemType,
  useData.find((f) => f.area === "稻妻") as ItemType,
  useData.find((f) => f.area === "须弥") as ItemType,
];
</script>

<template>
  <div class="container">
    <div class="header">今日材料</div>
    <div class="time">{{ weekText }}</div>

    <div class="tianfu_title">材料</div>

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
  </div>
</template>

<style scoped lang="scss">
@mixin flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
@mixin flexAround {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.container {
  background-color: #886444;
  min-width: 1200px;
  // height: 100vh;
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 1fr;
  grid-template-rows: 50px 50px 200px 1fr 1fr;
  grid-template-areas:
    "header header header header header"
    "time time time time time"
    "tianfu tianfu1 tianfu2 tianfu3 tianfu4"
    "role role1 role2 role3 role4"
    "wuqi wuqi1 wuqi2 wuqi3 wuqi4";
  grid-gap: 20px;

  font-size: 20px;
}
.header {
  grid-area: header;
  background-color: #886444;
  color: #f0ede8;
  line-height: 50px;
  font-weight: 600;
  font-size: 24px;
}

.time {
  grid-area: time;
  background-color: #f0ede8;
  color: #886444;
  border-radius: 5px;

  line-height: 50px;
}
.flex-row {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.tianfu_title {
  grid-area: tianfu;
  background-color: #f0ede8;
  color: #886444;

  line-height: 200px;
}
.tianfu {
  background-color: #f0ede8;
  color: #886444;
  width: 100%;

  @include flexAround;
  flex-direction: column;
  img {
    width: 50px;
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
    background-color: #f0ede8;
    color: #886444;

    line-height: 200px;
  }
}

@for $i from 1 through 4 {
  .role#{$i} {
    grid-area: role#{$i};
  }

  .tianfu#{$i} {
    grid-area: tianfu#{$i};
  }
}

.img-wrap {
  width: 66%;
  @include flexAround;
}
</style>
