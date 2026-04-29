<template>
  <view class="home">
    <view class="home__bg-glow"></view>

    <view class="home__header">
      <view class="home__title-wrapper">
        <text class="home__moon-icon">🌙</text>
        <view class="home__title-group">
          <text class="home__title">哄睡伴侣</text>
          <text class="home__subtitle">定时关闭 · 护眼模式 · 规律作息</text>
        </view>
      </view>
    </view>

    <view class="home__toolbar">
      <view class="tool-card" @tap="onToolTap('timer')">
        <text class="tool-card__icon">⏱</text>
        <text class="tool-card__label">定时关闭</text>
      </view>
      <view class="tool-card" @tap="onToolTap('night')">
        <text class="tool-card__icon">🌙</text>
        <text class="tool-card__label">护眼模式</text>
      </view>
      <view class="tool-card" @tap="onToolTap('fav')">
        <text class="tool-card__icon">⭐</text>
        <text class="tool-card__label">收藏夹</text>
      </view>
      <view class="tool-card" @tap="onToolTap('history')">
        <text class="tool-card__icon">🕐</text>
        <text class="tool-card__label">播放记录</text>
      </view>
    </view>

    <view class="home__filters">
      <view class="filter-group">
        <scroll-view class="filter-group__tags" :scroll-x="true" enhanced :show-scrollbar="false">
          <view
            class="filter-tag"
            :class="{ 'filter-tag--active': selectedSet === '全部' }"
            @tap="selectSet('全部')"
          >全部场景</view>
          <view
            v-for="set in storySetOptions"
            :key="set"
            class="filter-tag"
            :class="{ 'filter-tag--active': selectedSet === set }"
            @tap="selectSet(set)"
          >{{ set }}</view>
        </scroll-view>
      </view>
      <view class="filter-group">
        <scroll-view class="filter-group__tags" :scroll-x="true" enhanced :show-scrollbar="false">
          <view
            class="filter-tag"
            :class="{ 'filter-tag--active': selectedAge === '全部' }"
            @tap="selectAge('全部')"
          >全部年龄</view>
          <view
            v-for="age in ageOptions"
            :key="age"
            class="filter-tag"
            :class="{ 'filter-tag--active': selectedAge === age }"
            @tap="selectAge(age)"
          >{{ age }}</view>
        </scroll-view>
      </view>
    </view>

    <scroll-view class="home__list" :scroll-y="true" enhanced :show-scrollbar="false">
      <view class="home__list-inner">
        <view
          v-for="(story, index) in filteredStories"
          :key="story.id"
          class="story-card"
          :style="{ animationDelay: `${index * 60}ms` }"
          @tap="goToDetail(story.id)"
        >
          <view class="story-card__cover">
            <text class="story-card__emoji">{{ getEmoji(story.theme) }}</text>
          </view>
          <view class="story-card__body">
            <text class="story-card__title">{{ story.title }}</text>
            <view class="story-card__info">
              <text class="story-card__author">{{ story.author }}</text>
              <text class="story-card__dot">·</text>
              <text class="story-card__set">{{ story.storySet }}</text>
            </view>
            <view class="story-card__meta">
              <view class="tag-mini tag-mini--age">{{ story.ageRange }}</view>
              <view class="tag-mini tag-mini--theme">{{ modeLabel(story.theme) }}</view>
            </view>
          </view>
          <view class="story-card__arrow">
            <text class="story-card__arrow-icon">›</text>
          </view>
        </view>

        <view v-if="filteredStories.length === 0" class="home__empty">
          <text class="home__empty-icon">☁️</text>
          <text class="home__empty-text">暂无可用场景</text>
          <text class="home__empty-hint">换个筛选条件试试吧</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { stories } from '@/data/stories'

const selectedSet = ref<string>('全部')
const selectedAge = ref<string>('全部')

const storySetOptions = computed(() => {
  const sets = [...new Set(stories.map((s) => s.storySet))]
  return sets.sort()
})

const ageOptions = computed(() => {
  const ages = [...new Set(stories.map((s) => s.ageRange))]
  return ages.sort()
})

const filteredStories = computed(() => {
  return stories.filter((story) => {
    const setMatch = selectedSet.value === '全部' || story.storySet === selectedSet.value
    const ageMatch = selectedAge.value === '全部' || story.ageRange === selectedAge.value
    return setMatch && ageMatch
  })
})

const selectSet = (set: string) => { selectedSet.value = set }
const selectAge = (age: string) => { selectedAge.value = age }

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/story/story?id=${id}`,
  })
}

const emojiMap: Record<string, string> = {
  '分享': '🤝',
  '勇气': '🦁',
  '友谊': '💛',
  '成长': '🌱',
  '温暖': '☀️',
  '奇遇': '🔮',
  '机智': '🦊',
  '真伪': '💎',
  '想象': '🌈',
  '勇敢': '⚔️',
  '幽默': '😄',
  '牺牲': '🧜‍♀️',
}

const getEmoji = (theme: string) => emojiMap[theme] || '📖'

const modeLabelMap: Record<string, string> = {
  '分享': '互动模式',
  '勇气': '激励模式',
  '友谊': '陪伴模式',
  '成长': '成长模式',
  '温暖': '安抚模式',
  '奇遇': '探索模式',
  '机智': '思维模式',
  '真伪': '认知模式',
  '想象': '创意模式',
  '勇敢': '激励模式',
  '幽默': '欢乐模式',
  '牺牲': '温情模式',
}

const modeLabel = (theme: string) => modeLabelMap[theme] || theme

const onToolTap = (type: string) => {
  const tips: Record<string, string> = {
    timer: '定时关闭 · 功能开发中',
    night: '护眼模式 · 功能开发中',
    fav: '收藏夹 · 功能开发中',
    history: '播放记录 · 功能开发中',
  }
  uni.showToast({ title: tips[type] || '功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
$color-bg: #FFFDF8;
$color-bg-warm: #FFF5EB;
$color-text-main: #2D2A26;
$color-text-sub: #8C8279;
$color-primary: #4A5D8A;
$color-primary-light: #6B7FAE;
$color-accent: #E8A87C;
$color-card-bg: #FFFFFF;
$color-tag-age-bg: #EDF1FA;
$color-tag-age-text: #4A5D8A;
$color-tag-theme-bg: #FFF0E0;
$color-tag-theme-text: #C47D4E;

.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $color-bg;
  position: relative;
  overflow: hidden;

  &__bg-glow {
    position: absolute;
    top: -100rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    height: 400rpx;
    background: radial-gradient(circle, rgba(232, 168, 124, 0.25) 0%, rgba(255, 253, 248, 0) 70%);
    z-index: 0;
    pointer-events: none;
  }

  &__header {
    position: relative;
    z-index: 1;
    padding: 60rpx 40rpx 32rpx;
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  &__moon-icon {
    font-size: 64rpx;
    line-height: 1;
    filter: drop-shadow(0 4rpx 8rpx rgba(232, 168, 124, 0.4));
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
  }

  &__title {
    font-size: 48rpx;
    font-weight: 800;
    color: $color-text-main;
    letter-spacing: 2rpx;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 24rpx;
    color: $color-text-sub;
    letter-spacing: 1rpx;
  }

  &__toolbar {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 16rpx;
    padding: 0 32rpx 20rpx;

    .tool-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 24rpx 12rpx;
      background-color: $color-card-bg;
      border-radius: 24rpx;
      border: 2rpx solid rgba(140, 130, 121, 0.08);
      box-shadow: 0 4rpx 16rpx rgba(45, 42, 38, 0.04);
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.96);
      }

      &__icon {
        font-size: 40rpx;
        line-height: 1;
      }

      &__label {
        font-size: 22rpx;
        color: $color-text-main;
        font-weight: 600;
      }
    }
  }

  &__filters {
    position: relative;
    z-index: 1;
    padding: 0 0 24rpx 32rpx;

    .filter-group {
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      &__tags {
        white-space: nowrap;
      }
    }

    .filter-tag {
      display: inline-block;
      padding: 12rpx 32rpx;
      margin-right: 16rpx;
      border-radius: 100rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: $color-text-sub;
      background-color: $color-card-bg;
      border: 2rpx solid rgba(140, 130, 121, 0.12);
      transition: all 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);

      &--active {
        color: #FFFFFF;
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
        border-color: transparent;
        box-shadow: 0 6rpx 20rpx rgba(74, 93, 138, 0.35);
        transform: scale(1.06);
        font-weight: 600;
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }

  &__list {
    flex: 1;
    overflow: hidden;

    &-inner {
      padding: 8rpx 32rpx 60rpx;
    }
  }

  .story-card {
    display: flex;
    align-items: center;
    padding: 28rpx;
    margin-bottom: 24rpx;
    background-color: $color-card-bg;
    border-radius: 32rpx;
    box-shadow: 0 4rpx 20rpx rgba(45, 42, 38, 0.06);
    border: 2rpx solid rgba(140, 130, 121, 0.06);
    position: relative;
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 2rpx 10rpx rgba(45, 42, 38, 0.04);
    }

    &__cover {
      width: 110rpx;
      height: 110rpx;
      background: linear-gradient(135deg, $color-bg-warm 0%, #FFF 100%);
      border-radius: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
      flex-shrink: 0;
      box-shadow: inset 0 2rpx 8rpx rgba(232, 168, 124, 0.1);
    }

    &__emoji {
      font-size: 52rpx;
      line-height: 1;
    }

    &__body {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 32rpx;
      font-weight: 700;
      color: $color-text-main;
      margin-bottom: 8rpx;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-bottom: 14rpx;
    }

    &__author {
      font-size: 22rpx;
      color: $color-text-sub;
    }

    &__dot {
      font-size: 22rpx;
      color: #D6C7BC;
    }

    &__set {
      font-size: 22rpx;
      color: $color-accent;
      font-weight: 500;
    }

    &__meta {
      display: flex;
      gap: 12rpx;

      .tag-mini {
        font-size: 20rpx;
        padding: 6rpx 18rpx;
        border-radius: 12rpx;
        font-weight: 500;

        &--age {
          color: $color-tag-age-text;
          background-color: $color-tag-age-bg;
        }

        &--theme {
          color: $color-tag-theme-text;
          background-color: $color-tag-theme-bg;
        }
      }
    }

    &__arrow {
      width: 56rpx;
      height: 56rpx;
      background-color: $color-bg;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 16rpx;
      flex-shrink: 0;

      &-icon {
        color: $color-text-sub;
        font-size: 32rpx;
        font-weight: 300;
        margin-top: -4rpx;
      }
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 140rpx 0;

    &-icon {
      font-size: 96rpx;
      margin-bottom: 24rpx;
      opacity: 0.8;
    }

    &-text {
      font-size: 30rpx;
      color: $color-text-sub;
      margin-bottom: 8rpx;
      font-weight: 500;
    }

    &-hint {
      font-size: 24rpx;
      color: #C4B8AD;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
