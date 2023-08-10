<template>
  <div class="time-toast" v-show="visible">
    <ul v-if="rendered">
      <li
        :class="timeVal == index + 1 ? 'active' : ''"
        v-for="(item, index) in items"
        :key="index"
        @click="handleTime(index + 1)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
const items = ["周一/周四", "周二/周五", "周三/周六"];

const visible = ref(false);
const rendered = ref(true);

const props = defineProps({
  modelValue: Boolean,
  timeVal: Number,
});

const emit = defineEmits(["update:modelValue", "update:timeVal"]);
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open();
    } else {
      close();
    }
  }
);
const handleTime = function (val: number) {
  val && emit("update:timeVal", val);
  emit("update:modelValue", false);
  close();
};
function close() {
  rendered.value = false;
  visible.value = false;
}
function open() {
  visible.value = true;
  rendered.value = true;
}
onMounted(() => {
  if (props.modelValue) {
    visible.value = true;
    rendered.value = true;
  }
});
</script>

<style scoped>
.time-toast {
  --bgcolor: aliceblue;

  position: absolute;
  left: 50%;

  width: 150px;
  /* transform: translate(-50%, -50%); */

  border-radius: 5px;

  background-color: var(--bgcolor);
  padding: 5px;
}

.time-toast::after {
  content: "";
  position: absolute;

  background-color: var(--bgcolor);

  width: 10px;
  height: 10px;
  left: 20%;
  top: -5px;
  margin-left: -5px;
  transform: rotateZ(45deg);
  z-index: 1;
}

.time-toast ul {
  padding: 0;
  list-style: none;
  z-index: 3;
}

.time-toast ul li:hover,
.time-toast ul li.active {
  background-color: antiquewhite;
}
</style>
