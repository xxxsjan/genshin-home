<script setup lang="ts">
useHead({
  title: "资源页",
});

interface ResourceItem {
  date: string;
  type: string;
  url: string;
  name: string;
}

const resources: ResourceItem[] = [
  {
    date: "2026-11-04",
    type: "WEBP",
    url: "https://launcher-webstatic.mihoyo.com/launcher-public/2026/11/04/ff413e24446dc55c37177995743c42cb_4319383839570201840.webp",
    name: "ff413e24446dc55c37177995743c42cb_4319383839570201840.webp",
  },
  {
    date: "2026-10-14",
    type: "WEBP",
    url: "https://launcher-webstatic.mihoyo.com/launcher-public/2026/10/14/aa10489e2d17aae9ca7fa4708b8737f5_3678399391920397251.webp",
    name: "aa10489e2d17aae9ca7fa4708b8737f5_3678399391920397251.webp",
  },
  {
    date: "2026-10-28",
    type: "WEBM",
    url: "https://launcher-webstatic.mihoyo.com/launcher-public/2026/10/28/23bb82e77d271193e9e9da25aa9e026f_500896509362557603.webm",
    name: "23bb82e77d271193e9e9da25aa9e026f_500896509362557603.webm",
  },
];

function isVideo(item: ResourceItem) {
  return item.type === "WEBM";
}

function openResource(item: ResourceItem) {
  window.open(item.url, "_blank", "noopener");
}
</script>

<template>
  <div class="page">
    <header class="header">
      <NuxtLink to="/" class="nav-link">← 桌面</NuxtLink>
      <span class="title">资源页</span>
    </header>

    <section class="panel">
      <div class="resource-grid">
        <button
          v-for="item in resources"
          :key="item.url"
          type="button"
          class="resource-card"
          :title="item.name"
          @click="openResource(item)"
        >
          <span class="thumb-wrap">
            <video
              v-if="isVideo(item)"
              class="thumb"
              :src="item.url"
              muted
              playsinline
              preload="metadata"
            />
            <img
              v-else
              class="thumb"
              :src="item.url"
              :alt="item.name"
              loading="lazy"
            />
          </span>
          <span class="card-meta">
            <span class="card-date">{{ item.date }}</span>
            <span class="card-type">{{ item.type }}</span>
          </span>
          <span class="card-name">{{ item.name }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-width: 320px;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 48px;
}

.header {
  @include darkBg();
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  box-sizing: border-box;
}

.nav-link {
  color: #f0ede8;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  opacity: 0.9;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.title {
  flex: 1;
}

.panel {
  @include lightBg();
  margin: 12px 16px 0;
  padding: 16px 18px;
  border-radius: 6px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.resource-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  padding: 10px;
  border: 1px solid rgba(136, 100, 68, 0.25);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.55);
  color: #886444;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    box-shadow: 0 4px 14px rgba(136, 100, 68, 0.28);
    transform: translateY(-2px);
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid rgba(136, 100, 68, 0.5);
    outline-offset: 2px;
  }
}

.thumb-wrap {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(136, 100, 68, 0.12);
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.card-date {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #c0653a;
}

.card-type {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #3e8f6f;
}

.card-name {
  font-size: 12px;
  color: rgba(136, 100, 68, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
