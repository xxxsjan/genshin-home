<script setup lang="ts">
import { resources } from "~/utils/resources";

useHead({
  title: "资源下载",
});
</script>

<template>
  <div class="resources-page">
    <header class="page-header">
      <h1>资源下载</h1>
      <p class="subtitle">自制软件与工具，直链或网盘下载</p>
    </header>

    <ul v-if="resources.length" class="resource-list">
      <li v-for="item in resources" :key="item.id" class="resource-item">
        <div class="meta">
          <div class="title-row">
            <h2>{{ item.name }}</h2>
            <span v-if="item.version" class="version">v{{ item.version }}</span>
          </div>
          <p v-if="item.description" class="desc">{{ item.description }}</p>
        </div>
        <div class="links">
          <a
            v-for="(link, i) in item.links.filter((l) => l.url.trim())"
            :key="i"
            :href="link.url"
            class="download-link"
            :class="link.type"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </li>
    </ul>

    <p v-else class="empty">暂无资源</p>
  </div>
</template>

<style scoped lang="scss">
.resources-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  text-align: left;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 36px;

  h1 {
    margin: 12px 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: #f0ede8;
  }
}

.back-link {
  color: rgba(240, 237, 232, 0.75);
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: #f0ede8;
  }
}

.subtitle {
  margin: 0;
  font-size: 15px;
  color: rgba(240, 237, 232, 0.7);
}

.resource-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(240, 237, 232, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.resource-item {
  @include lightBg();
  padding: 20px 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.meta {
  flex: 1 1 220px;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.version {
  font-size: 13px;
  opacity: 0.65;
}

.desc {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.8;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;
}

.download-link {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition:
    opacity 0.2s,
    background-color 0.2s;

  &.direct {
    @include darkBg();

    &:hover {
      opacity: 0.9;
    }
  }

  &.cloud {
    background: transparent;
    color: #886444;
    border: 1px solid #886444;

    &:hover {
      background: rgba(136, 100, 68, 0.1);
    }
  }
}

.empty {
  text-align: center;
  color: rgba(240, 237, 232, 0.6);
  margin-top: 48px;
}
</style>
