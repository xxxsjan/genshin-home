<script setup lang="ts">
const props = defineProps<{
  tianfudata: any;
  renderWuqi: any;
}>();

const { tianfudata, renderWuqi } = toRefs(props);

function toDetail(content_id: string | number) {
  const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
  window.open(url);
}
</script>

<template>
  <div class="grid-container">
    <!-- 天赋书 标题 -->
    <div class="tianfu_title">天赋书</div>

    <!-- 天赋书 显示区-->
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`tianfu tianfu${index + 1}`" v-if="tianfudata[index]">
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
      <div :class="`role role${index + 1}`" v-if="tianfudata[index]">
        <img
          v-for="img in tianfudata[index].role"
          :key="img.title"
          :src="img.image?.icon"
          :alt="img.title"
          @click="toDetail(img.content_id)"
          :title="img.title"
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
      <div
        :class="`wqtpcl wqtpcl${index + 1}`"
        v-if="renderWuqi[index].length > 0"
      >
        <div>【{{ renderWuqi[index][0].title.split(/的|之/)[0] }}】</div>
        <div class="img-wrap flex-row">
          <img v-for="item in renderWuqi[index]" :src="item.icon" />
        </div>
      </div>
    </template>
    <!-- 武器突破材料对应武器 -->
    <div class="wuqi_title">武器</div>
    <template v-for="(_, index) in 4" :key="index">
      <div :class="`wuqi wuqi${index + 1}`" v-if="renderWuqi[index].length > 0">
        <img
          v-for="item in renderWuqi[index][0].info.wuqi"
          :src="item.src"
          @click="toDetail(item.content_id)"
          :title="item.name"
        />
      </div>
    </template>
  </div>
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
