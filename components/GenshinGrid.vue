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
    <template v-for="(_, index) in tianfudata.length" :key="index">
      <div :class="`tianfu tianfu${index + 1}`" v-if="tianfudata[index]">
        <div class="flex w-full flex-row">
          <div class="flex items-center">{{ tianfudata[index].name }}</div>
          <div class="img-wrap flex gap-1">
            <a
              v-for="(item, index) in 3"
              :key="index"
              :href="`https://bbs.mihoyo.com/ys/obc/content/${tianfudata[0].data[index].content_id}/detail?bbs_presentation_style=no_header`"
              target="_blank"
            >
              <img
                :src="tianfudata[0].data[index].icon"
                :alt="tianfudata[0].data[index].title"
                class="w-[50px]"
              />
            </a>
          </div>
        </div>
      </div>
    </template>

    <div class="role_title">角色</div>
    <!-- 天赋书 角色 -->
    <template v-for="(_, index) in tianfudata.length" :key="index">
      <div :class="`role role${index + 1} `" v-if="tianfudata[index]">
        <div class="flex flex-wrap gap-1 justify-start">
          <img
            v-for="img in tianfudata[index].role"
            :key="img.title"
            :src="img.image?.icon"
            :alt="img.title"
            @click="toDetail(img.content_id)"
            :title="img.title"
            class="mb-1 w-[calc((100%-8px)/3)]"
          />
        </div>
      </div>
    </template>
    <!-- 武器突破材料 标题 -->
    <div class="wqtpcl_title">
      <div>武器</div>
      <div>突破</div>
      <div>材料</div>
    </div>
    <!-- 武器突破材料 显示区 -->
    <template v-for="(_, index) in renderWuqi.length" :key="index">
      <div
        :class="`wqtpcl wqtpcl${index + 1} px-1`"
        v-if="renderWuqi[index].length > 0"
      >
        <div>【{{ renderWuqi[index][0].title.split(/的|之/)[0] }}】</div>
        <div class="flex w-full flex-row justify-around">
          <a
            v-for="(item, index) in renderWuqi[index]"
            :key="index"
            target="_blank"
            :href="`https://bbs.mihoyo.com/ys/obc/content/${item.content_id}/detail?bbs_presentation_style=no_header`"
            ><img :src="item.icon" class="mb-1"
          /></a>
        </div>
      </div>
    </template>
    <!-- 武器突破材料对应武器 -->
    <div class="wuqi_title">武器</div>
    <template v-for="(_, index) in renderWuqi.length" :key="index">
      <div :class="`wuqi wuqi${index + 1}`" v-if="renderWuqi[index].length > 0">
        <div class="flex flex-wrap gap-1 justify-start">
          <img
            v-for="item in renderWuqi[index][0].info.wuqi"
            :key="item.name"
            :src="item.src"
            @click="toDetail(item.content_id)"
            :title="item.name"
            class="mb-1 w-[calc((100%-8px)/3)]"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/mixins.scss" as *;
.grid-container {
  background-color: #886444;

  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 100px minmax(200px, auto) 120px minmax(0, auto);

  grid-template-areas:
    "tianfu tianfu1 tianfu2 tianfu3 tianfu4 tianfu5"
    "role role1 role2 role3 role4 role5"
    "wqtpcl wqtpcl1 wqtpcl2 wqtpcl3 wqtpcl4 wqtpcl5"
    "wuqi wuqi1 wuqi2 wuqi3 wuqi4 wuqi5";
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
}

.wuqi {
  background-color: #f0ede8;
  // column-count: 3;
  // column-width: 100px;
  // display: flex;
  // flex-wrap: wrap;
  padding: 10px;
  &_title {
    grid-area: wuqi;
    @include lightBg();
    @include flexCenter();
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
}

.role {
  // width: 100%;
  background-color: #f0ede8;
  // column-count: 2;
  // column-width: 100px;
  // flex-wrap: wrap;
  padding: 10px;
  // img {
  //   width: 110px;
  // }
  &_title {
    grid-area: role;
    @include lightBg();
    @include flexCenter();
  }
}
</style>
