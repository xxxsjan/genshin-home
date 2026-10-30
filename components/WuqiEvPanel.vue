<script setup lang="ts">
import {
  wuqiEvRanking,
  type WuqiEvCharacter,
  type WuqiEvWeapon,
} from "~/utils/wuqi-ev-ranking";
import {
  downloadWuqiEvPng,
  exportWuqiEvPng,
} from "~/utils/export-wuqi-ev";

const props = defineProps<{
  /** 预选角色；若不在数据中则回退到列表第一项 */
  character?: string;
  compact?: boolean;
}>();

const emit = defineEmits<{
  "update:character": [name: string];
}>();

const bundle = getGenshinHomeBundle();
const roleMap = new Map(bundle.tujian_role.map((r) => [r.title, r] as const));
const wuqiMap = new Map(bundle.tujian_wuqi.map((w) => [w.title, w] as const));

const charactersWithData = computed(() =>
  wuqiEvRanking.map((item) => ({
    ...item,
    icon: roleMap.get(item.character)?.icon || item.icon || "",
  }))
);

const selectedName = ref("");

function selectCharacter(name: string) {
  selectedName.value = name;
  emit("update:character", name);
}

watch(
  () => props.character,
  (name) => {
    if (name && wuqiEvRanking.some((c) => c.character === name)) {
      selectedName.value = name;
      return;
    }
    if (!selectedName.value) {
      selectedName.value = charactersWithData.value[0]?.character ?? "";
    }
  },
  { immediate: true }
);

const selected = computed<WuqiEvCharacter | undefined>(() =>
  wuqiEvRanking.find((c) => c.character === selectedName.value)
);

type RankRow = WuqiEvWeapon & {
  rank: number;
  icon: string;
  detailUrl: string;
  isSignature: boolean;
};

function weaponDetailUrl(contentId?: number) {
  if (!contentId) return "";
  return `https://bbs.mihoyo.com/ys/obc/content/${contentId}/detail?bbs_presentation_style=no_header`;
}

const ranking = computed<RankRow[]>(() => {
  const cur = selected.value;
  if (!cur) return [];
  return [...cur.weapons]
    .sort((a, b) => b.expect - a.expect)
    .map((w, i) => {
      const meta = wuqiMap.get(w.name);
      return {
        ...w,
        rank: i + 1,
        icon: meta?.icon || w.icon || "",
        detailUrl: weaponDetailUrl(meta?.content_id),
        isSignature:
          w.name === cur.signature && (w.refine === "精1" || !w.refine),
      };
    });
});

function barWidth(expect: number) {
  const max = ranking.value[0]?.expect ?? 100;
  return `${Math.min(100, (expect / max) * 100)}%`;
}

function expectClass(expect: number) {
  if (expect >= 95) return "tier-s";
  if (expect >= 85) return "tier-a";
  if (expect >= 75) return "tier-b";
  return "tier-c";
}

const exporting = ref(false);
const exportError = ref("");
const previewOpen = ref(false);
const previewUrl = ref("");
const previewFilename = ref("");

const selectedAvatar = computed(
  () =>
    roleMap.get(selectedName.value)?.icon ||
    selected.value?.icon ||
    ""
);

function revokePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
  }
}

function closePreview() {
  previewOpen.value = false;
  revokePreview();
  previewFilename.value = "";
}

async function onExport() {
  if (!selected.value || exporting.value) return;
  exporting.value = true;
  exportError.value = "";
  try {
    const result = await exportWuqiEvPng({
      character: selected.value.character,
      avatarUrl: selectedAvatar.value,
      signature: selected.value.signature,
      scenario: selected.value.scenario,
      rows: ranking.value.map((r) => ({
        rank: r.rank,
        name: r.name,
        expect: r.expect,
        refine: r.refine,
        note: r.note,
        icon: r.icon,
        isSignature: r.isSignature,
      })),
    });
    revokePreview();
    previewUrl.value = result.objectUrl;
    previewFilename.value = result.filename;
    previewOpen.value = true;
  } catch (e) {
    exportError.value = e instanceof Error ? e.message : "导出失败";
  } finally {
    exporting.value = false;
  }
}

function onSavePreview() {
  if (!previewUrl.value || !previewFilename.value) return;
  downloadWuqiEvPng(previewUrl.value, previewFilename.value);
}

onBeforeUnmount(() => {
  revokePreview();
});

defineExpose({
  onExport,
  exporting,
  exportError,
});
</script>

<template>
  <div class="ev-panel" :class="{ compact }">
    <div class="role-row">
      <button
        v-for="c in charactersWithData"
        :key="c.character"
        type="button"
        class="role-chip"
        :class="{ active: selectedName === c.character }"
        @click="selectCharacter(c.character)"
      >
        <img v-if="c.icon" :src="c.icon" :alt="c.character" />
        <span>{{ c.character }}</span>
      </button>
    </div>

    <template v-if="selected">
      <template v-if="!compact">
        <p v-if="selected.scenario" class="meta">场景：{{ selected.scenario }}</p>
        <p class="meta muted">
          基准：{{ selected.signature }}（精 1 = 100%）
        </p>
        <p v-if="selected.source || selected.sourceUrl" class="meta source">
          参考攻略：
          <a
            v-if="selected.sourceUrl"
            :href="selected.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="source-link"
          >
            {{ selected.source || selected.sourceUrl }}
          </a>
          <span v-else>{{ selected.source }}</span>
        </p>
      </template>

      <ol class="rank-list">
        <li
          v-for="row in ranking"
          :key="`${row.name}-${row.refine}-${row.note}-${row.rank}`"
          class="rank-row"
          :class="{ signature: row.isSignature }"
        >
          <span class="rank-num">{{ row.rank }}</span>
          <a
            v-if="row.icon && row.detailUrl"
            class="weapon-icon-link"
            :href="row.detailUrl"
            target="_blank"
            rel="noopener noreferrer"
            :title="`${row.name} · 米游社详情`"
          >
            <img class="weapon-icon" :src="row.icon" :alt="row.name" />
          </a>
          <img
            v-else-if="row.icon"
            class="weapon-icon"
            :src="row.icon"
            :alt="row.name"
          />
          <div v-else class="weapon-icon weapon-icon--empty" />
          <div class="weapon-info">
            <div class="weapon-name">
              {{ row.name }}
              <span v-if="row.refine" class="tag">{{ row.refine }}</span>
              <span v-if="row.isSignature" class="tag signature-tag">专武</span>
              <span v-if="row.note" class="tag note">{{ row.note }}</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :class="expectClass(row.expect)"
                :style="{ width: barWidth(row.expect) }"
              />
            </div>
          </div>
          <div class="expect" :class="expectClass(row.expect)">
            {{ row.expect.toFixed(1) }}%
          </div>
        </li>
      </ol>
    </template>
    <p v-else class="empty">暂无该角色期望数据</p>

    <Teleport to="body">
      <div
        v-if="previewOpen"
        class="preview-mask"
        @click.self="closePreview"
      >
        <div class="preview-dialog" role="dialog" aria-modal="true">
          <div class="preview-head">
            <span>导出预览</span>
            <button
              type="button"
              class="preview-close"
              aria-label="关闭"
              @click="closePreview"
            >
              ×
            </button>
          </div>
          <div class="preview-body">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              :alt="previewFilename"
              class="preview-img"
            />
          </div>
          <div class="preview-actions">
            <button type="button" class="btn-ghost" @click="closePreview">
              取消
            </button>
            <button type="button" class="btn-primary" @click="onSavePreview">
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.ev-panel {
  padding: 12px 14px 16px;
  color: #886444;
}

.preview-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: rgba(40, 28, 18, 0.55);
  backdrop-filter: blur(4px);
}

.preview-dialog {
  width: min(760px, 100%);
  max-height: min(90vh, 920px);
  display: flex;
  flex-direction: column;
  background: #f0ede8;
  color: #886444;
  border-radius: 10px;
  border: 1px solid rgba(136, 100, 68, 0.35);
  box-shadow: 0 16px 48px rgba(40, 24, 8, 0.35);
  overflow: hidden;
}

.preview-head {
  @include darkBg();
  height: 44px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.preview-close {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  padding: 0;
  background: transparent;
  color: #f0ede8;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(240, 237, 232, 0.18);
  }
}

.preview-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  background: rgba(136, 100, 68, 0.06);
}

.preview-img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 6px;
  background: #f0ede8;
  box-shadow: 0 4px 16px rgba(40, 24, 8, 0.12);
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid rgba(136, 100, 68, 0.15);
  flex-shrink: 0;
}

.btn-ghost,
.btn-primary {
  padding: 7px 16px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.btn-ghost {
  border: 1px solid rgba(136, 100, 68, 0.35);
  background: transparent;
  color: #886444;
}

.btn-primary {
  border: 1px solid rgba(136, 100, 68, 0.35);
  background: #886444;
  color: #f0ede8;

  &:hover {
    filter: brightness(1.05);
  }
}

.role-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.role-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(136, 100, 68, 0.1);
  color: #886444;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }

  &.active {
    border-color: #886444;
    background: rgba(136, 100, 68, 0.2);
  }
}

.meta {
  margin: 0 0 4px;
  font-size: 12px;
  line-height: 1.45;

  &.muted {
    opacity: 0.72;
  }

  &.source {
    margin-bottom: 12px;
    word-break: break-all;
  }
}

.source-link {
  color: #886444;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #5a4024;
  }
}

.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rank-row {
  display: grid;
  grid-template-columns: 28px 40px 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(136, 100, 68, 0.06);

  &.signature {
    background: rgba(136, 100, 68, 0.14);
  }
}

.rank-num {
  font-weight: 800;
  text-align: center;
}

.weapon-icon-link {
  display: block;
  line-height: 0;
  border-radius: 5px;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.85;
    transform: scale(1.04);
  }

  &:focus-visible {
    outline: 2px solid #886444;
    outline-offset: 2px;
  }
}

.weapon-icon {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
  background: #e5dfd4;
  display: block;

  &--empty {
    visibility: hidden;
  }
}

.weapon-name {
  font-size: 13px;
  font-weight: 650;
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(136, 100, 68, 0.15);

  &.signature-tag {
    background: #886444;
    color: #f0ede8;
  }
}

.bar-track {
  height: 7px;
  border-radius: 999px;
  background: rgba(136, 100, 68, 0.12);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: #886444;

  &.tier-s {
    background: #6b4f2e;
  }
  &.tier-a {
    background: #886444;
  }
  &.tier-b {
    background: #a88860;
  }
  &.tier-c {
    background: #c4ad8e;
  }
}

.expect {
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  min-width: 64px;
  text-align: right;
}

.tier-s {
  color: #5a4024;
}
.tier-a {
  color: #886444;
}
.tier-b {
  color: #9a7a52;
}
.tier-c {
  color: #b39a78;
}

.empty {
  text-align: center;
  opacity: 0.7;
  padding: 24px 0;
}

.compact .rank-row {
  padding: 6px 8px;
}
</style>
