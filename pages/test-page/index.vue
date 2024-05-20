<template>
  <el-calendar v-model="value" class="genshin-calendar">
    <template #date-cell="{ data }">
      <div>{{ data.day }}</div>
      <div>{{ calcCount(data.day) }}11</div>
    </template>
  </el-calendar>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import jsonData from "./text.json";
import dayjs from "dayjs";

const value = ref(new Date());

const testData = jsonData;
const typeMap = new Map(jsonData.typeMap);
const result = new Map(jsonData.result);

const obj = {};
const role = result.get("11");

for (let i = 0; i < role.length; i++) {
  const element = role[i];
  const dateKey = dayjs(element.time).format("YYYY-MM-DD");
  if (!obj[dateKey]) {
    obj[dateKey] = [];
  }
  // dayjs('2023-12-01').isSame('2023-12-01', 'day');
  obj[dateKey].push(element);
}

function calcCount(day) {
  const data = obj[day];
  return data ? data.length : "";
}
</script>

<style scoped lang="scss">
// .genshin-calendar:deep(.current .el-calendar-day) {
//   background-color: red;
// }
</style>
