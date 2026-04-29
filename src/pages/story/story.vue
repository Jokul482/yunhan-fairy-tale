<template>
  <view class="detail" v-if="story">
    <view class="detail__hero">
      <view class="detail__hero-bg"></view>
      <text class="detail__hero-emoji">{{ getEmoji(story.theme) }}</text>
      <text class="detail__title">{{ story.title }}</text>
      <view class="detail__meta">
        <text class="detail__author">素材 · {{ story.author }}</text>
        <view class="detail__labels">
          <text class="label label--age">{{ story.ageRange }}</text>
          <text class="label label--theme">{{ modeLabel(story.theme) }}</text>
        </view>
      </view>
    </view>

    <view class="detail__console">
      <view class="detail__console-card">
        <view class="console-play" @tap="togglePlay">
          <view class="console-play__btn" :class="{ 'console-play__btn--active': isPlaying }">
            <text class="console-play__icon">{{ isPlaying ? '⏸' : '▶' }}</text>
          </view>
          <text class="console-play__label">{{ isPlaying ? '播放中' : '开始播放' }}</text>
          <text class="console-play__hint">点击控制播放状态</text>
        </view>

        <view class="console-tools">
          <view class="console-tool" @tap="toggleTimer">
            <text class="console-tool__icon">⏱</text>
            <text class="console-tool__text">定时关闭</text>
            <text class="console-tool__val">{{ timerLabel }}</text>
          </view>
          <view class="console-tool" @tap="toggleNightMode">
            <text class="console-tool__icon">🌙</text>
            <text class="console-tool__text">护眼模式</text>
            <text class="console-tool__val">{{ nightMode ? '已开启' : '未开启' }}</text>
          </view>
          <view class="console-tool" @tap="toggleFav">
            <text class="console-tool__icon">⭐</text>
            <text class="console-tool__text">收藏场景</text>
            <text class="console-tool__val">{{ isFav ? '已收藏' : '未收藏' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail__main">
      <scroll-view class="detail__body" :scroll-y="true" enhanced :show-scrollbar="false">
        <view class="detail__content-card">
          <view class="detail__transcript-toggle" @tap="toggleTranscript">
            <text class="transcript-toggle__icon">{{ showTranscript ? '▾' : '▸' }}</text>
            <text class="transcript-toggle__text">场景文字稿</text>
            <text class="transcript-toggle__hint">—— 点击{{ showTranscript ? '收起' : '展开' }} ——</text>
          </view>

          <view v-if="showTranscript" class="detail__transcript-body">
            <rich-text :nodes="story.content" class="detail__rich-text"></rich-text>

            <view class="detail__end">
              <view class="line"></view>
              <text class="end-text">晚安 · 好梦</text>
              <view class="line"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="player-bar">
      <view class="player-bar__inner">
        <view class="player-bar__info">
          <view class="player-bar__icon-bg">
            <text class="player-bar__icon">🎵</text>
          </view>
          <view class="player-bar__text">
            <text class="player-bar__name">场景音频</text>
            <text class="player-bar__tip">轻柔播放中...</text>
          </view>
        </view>
        <view class="player-bar__btn">
          <text>打开音频</text>
        </view>
      </view>
    </view>
  </view>

  <view class="detail detail--error" v-else>
    <text class="detail__error-icon">😴</text>
    <text class="detail__error-text">该场景暂不可用</text>
    <text class="detail__back-hint" @tap="goBack">点击返回选择其他场景</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { stories, type Story } from '@/data/stories'

const story = ref<Story | null>(null)
const isPlaying = ref(false)
const showTranscript = ref(false)
const nightMode = ref(false)
const isFav = ref(false)
const timerValue = ref(0)

onLoad((options) => {
  const id = Number(options?.id)
  if (!isNaN(id)) {
    story.value = stories.find((s) => s.id === id) ?? null
  }
})

const goBack = () => {
  uni.navigateBack()
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const toggleTranscript = () => {
  showTranscript.value = !showTranscript.value
}

const toggleNightMode = () => {
  nightMode.value = !nightMode.value
  uni.showToast({
    title: nightMode.value ? '护眼模式已开启' : '护眼模式已关闭',
    icon: 'none',
  })
}

const toggleFav = () => {
  isFav.value = !isFav.value
  uni.showToast({
    title: isFav.value ? '已添加到收藏' : '已取消收藏',
    icon: 'none',
  })
}

const timerOptions = [0, 15, 30, 45, 60]
const toggleTimer = () => {
  const idx = timerOptions.indexOf(timerValue.value)
  timerValue.value = timerOptions[(idx + 1) % timerOptions.length]
  uni.showToast({
    title: timerValue.value > 0 ? `定时关闭：${timerValue.value}分钟` : '定时关闭：已取消',
    icon: 'none',
  })
}

const timerLabel = computed(() => {
  return timerValue.value > 0 ? `${timerValue.value}分钟` : '未设置'
})

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
$color-player: #4A5D8A;

.detail {
  min-height: 100vh;
  background-color: $color-bg;
  display: flex;
  flex-direction: column;
  position: relative;

  &__hero {
    padding: 60rpx 48rpx 28rpx;
    text-align: center;
    position: relative;
    overflow: hidden;

    &-bg {
      position: absolute;
      top: -200rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 800rpx;
      height: 600rpx;
      background: radial-gradient(circle, rgba(232, 168, 124, 0.22) 0%, rgba(255, 253, 248, 0) 70%);
      z-index: 0;
      pointer-events: none;
    }

    &-emoji {
      font-size: 80rpx;
      margin-bottom: 16rpx;
      display: block;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 4rpx 12rpx rgba(232, 168, 124, 0.35));
    }

    .detail__title {
      font-size: 40rpx;
      font-weight: 800;
      color: $color-text-main;
      margin-bottom: 16rpx;
      display: block;
      position: relative;
      z-index: 1;
      letter-spacing: 2rpx;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    position: relative;
    z-index: 1;

    .detail__author {
      font-size: 24rpx;
      color: $color-text-sub;
      letter-spacing: 1rpx;
    }

    .detail__labels {
      display: flex;
      gap: 14rpx;

      .label {
        font-size: 21rpx;
        padding: 6rpx 24rpx;
        border-radius: 100rpx;
        font-weight: 500;

        &--age {
          background-color: #EDF1FA;
          color: #4A5D8A;
        }

        &--theme {
          background-color: #FFF0E0;
          color: #C47D4E;
        }
      }
    }
  }

  &__console {
    padding: 0 32rpx 20rpx;
    position: relative;
    z-index: 1;

    &-card {
      background-color: $color-card-bg;
      border-radius: 32rpx;
      padding: 36rpx;
      box-shadow: 0 4rpx 24rpx rgba(45, 42, 38, 0.06);
      border: 2rpx solid rgba(140, 130, 121, 0.06);
    }
  }

  .console-play {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 32rpx;
    border-bottom: 2rpx solid rgba(140, 130, 121, 0.08);
    margin-bottom: 28rpx;

    &__btn {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      box-shadow: 0 8rpx 28rpx rgba(74, 93, 138, 0.35);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:active {
        transform: scale(0.94);
      }

      &--active {
        background: linear-gradient(135deg, $color-accent 0%, #D4956A 100%);
        box-shadow: 0 8rpx 28rpx rgba(232, 168, 124, 0.4);
      }
    }

    &__icon {
      font-size: 44rpx;
      color: #FFFFFF;
    }

    &__label {
      font-size: 28rpx;
      font-weight: 700;
      color: $color-text-main;
      margin-bottom: 4rpx;
    }

    &__hint {
      font-size: 22rpx;
      color: $color-text-sub;
    }
  }

  .console-tools {
    display: flex;
    justify-content: space-between;
    gap: 14rpx;

    .console-tool {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 18rpx 10rpx;
      background-color: $color-bg;
      border-radius: 20rpx;
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.96);
      }

      &__icon {
        font-size: 36rpx;
        margin-bottom: 6rpx;
      }

      &__text {
        font-size: 21rpx;
        color: $color-text-main;
        font-weight: 600;
        margin-bottom: 4rpx;
      }

      &__val {
        font-size: 18rpx;
        color: $color-text-sub;
      }
    }
  }

  &__main {
    flex: 1;
    overflow: hidden;
    position: relative;
    z-index: 1;
    min-height: 200rpx;

    .detail__body {
      height: 100%;
    }
  }

  &__content-card {
    background-color: $color-card-bg;
    margin: 0 32rpx 40rpx;
    padding: 32rpx 40rpx;
    border-radius: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(45, 42, 38, 0.04);
    border: 2rpx solid rgba(140, 130, 121, 0.05);
  }

  &__transcript-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    gap: 8rpx;

    .transcript-toggle {
      &__icon {
        font-size: 28rpx;
        color: $color-primary;
        font-weight: 700;
      }

      &__text {
        font-size: 26rpx;
        color: $color-primary;
        font-weight: 600;
      }

      &__hint {
        font-size: 22rpx;
        color: $color-text-sub;
      }
    }
  }

  &__transcript-body {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 2rpx solid rgba(140, 130, 121, 0.08);

    .detail__rich-text {
      font-size: 34rpx;
      color: $color-text-main;
      line-height: 2.0;
      letter-spacing: 2rpx;
      text-align: justify;

      ::v-deep p {
        margin-bottom: 28rpx;
      }
    }
  }

  &__end {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 60rpx;
    gap: 20rpx;

    .line {
      flex: 1;
      height: 2rpx;
      background: linear-gradient(90deg, transparent 0%, #E8DDD4 50%, transparent 100%);
    }

    .end-text {
      font-size: 24rpx;
      color: #C4B8AD;
      letter-spacing: 4rpx;
      white-space: nowrap;
    }
  }

  .player-bar {
    padding: 20rpx 32rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: $color-card-bg;
    border-top: 2rpx solid rgba(140, 130, 121, 0.06);

    &__inner {
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
      border-radius: 100rpx;
      padding: 16rpx 16rpx 16rpx 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10rpx 30rpx rgba(74, 93, 138, 0.3);
    }

    &__info {
      display: flex;
      align-items: center;
    }

    &__icon-bg {
      width: 68rpx;
      height: 68rpx;
      background-color: rgba(255, 255, 255, 0.18);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      .player-bar__icon {
        font-size: 32rpx;
      }
    }

    &__text {
      .player-bar__name {
        color: #FFFFFF;
        font-size: 28rpx;
        font-weight: 600;
        display: block;
        margin-bottom: 4rpx;
      }

      .player-bar__tip {
        color: rgba(255, 255, 255, 0.65);
        font-size: 20rpx;
      }
    }

    &__btn {
      background-color: #FFFFFF;
      color: $color-primary;
      padding: 16rpx 36rpx;
      border-radius: 100rpx;
      font-size: 26rpx;
      font-weight: 700;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.96);
      }
    }
  }

  &--error {
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: $color-bg;

    .detail__error-icon {
      font-size: 120rpx;
      margin-bottom: 40rpx;
      filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.08));
    }

    .detail__error-text {
      font-size: 36rpx;
      color: $color-text-main;
      margin-bottom: 20rpx;
      font-weight: 600;
    }

    .detail__back-hint {
      color: $color-primary;
      text-decoration: underline;
      font-size: 28rpx;
      padding: 12rpx;

      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
