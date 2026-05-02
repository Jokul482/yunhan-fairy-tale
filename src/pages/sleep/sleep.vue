<template>
  <view class="sleep">
    <view class="sleep__bg-glow"></view>

    <!-- 护眼模式遮罩 -->
    <view v-if="eyeProtectionOn" class="eye-shield"></view>

    <!-- 头部 -->
    <view class="sleep__header">
      <view class="sleep__title-row">
        <text class="sleep__moon">🌙</text>
        <text class="sleep__title">睡前时光</text>
      </view>
      <text class="sleep__subtitle">放松下来，准备进入梦乡</text>
    </view>

    <scroll-view class="sleep__body" :scroll-y="true" enhanced :show-scrollbar="false">
      <view class="sleep__body-inner">
        <!-- 睡眠定时器 -->
        <view class="card">
          <view class="card__header">
            <text class="card__icon">⏱</text>
            <text class="card__title">睡眠定时器</text>
          </view>

          <view class="timer__display" :class="{ 'timer__display--active': timerState === 'running' }">
            <text class="timer__time">{{ formattedTime }}</text>
            <text class="timer__label">
              {{ timerState === 'idle' ? '设定好就交给时间吧' : timerState === 'running' ? '正在计时...' : timerState === 'paused' ? '已暂停' : '' }}
            </text>
          </view>

          <view class="timer__presets">
            <view
              v-for="opt in durationOptions"
              :key="opt"
              class="timer__preset"
              :class="{ 'timer__preset--active': selectedDuration === opt && timerState === 'idle' }"
              :style="{ opacity: timerState === 'running' ? 0.5 : 1 }"
              @tap="selectDuration(opt)"
            >
              <text class="timer__preset-num">{{ opt }}</text>
              <text class="timer__preset-unit">分钟</text>
            </view>
          </view>

          <view class="timer__actions">
            <view class="timer__btn timer__btn--reset" @tap="resetTimer">
              <text>↺</text>
            </view>
            <view
              v-if="timerState === 'running'"
              class="timer__btn timer__btn--pause"
              @tap="pauseTimer"
            >
              <text>⏸ 暂停</text>
            </view>
            <view
              v-else
              class="timer__btn timer__btn--start"
              @tap="startTimer"
            >
              <text>{{ timerState === 'paused' ? '▶ 继续' : '▶ 开始' }}</text>
            </view>
          </view>
        </view>

        <!-- 护眼模式 -->
        <view class="card">
          <view class="card__header">
            <text class="card__icon">🌙</text>
            <text class="card__title">护眼模式</text>
          </view>
          <text class="eye__desc">开启后屏幕会叠加一层暖色柔光，减少睡前蓝光刺激。</text>
          <view
            class="eye__switch"
            :class="{ 'eye__switch--on': eyeProtectionOn }"
            @tap="toggleEyeProtection"
          >
            <view class="eye__switch-knob"></view>
          </view>
        </view>

        <!-- 睡前仪式清单 -->
        <view class="card">
          <view class="card__header">
            <text class="card__icon">✅</text>
            <text class="card__title">睡前仪式清单</text>
          </view>

          <view class="checklist__progress">
            <text class="checklist__progress-text">{{ doneCount }}/{{ checklist.length }} 已完成</text>
            <view class="checklist__progress-bar">
              <view
                class="checklist__progress-fill"
                :style="{ width: checklist.length > 0 ? (doneCount / checklist.length * 100) + '%' : '0%' }"
              ></view>
            </view>
          </view>

          <view class="checklist__items">
            <view
              v-for="item in checklist"
              :key="item.id"
              class="checklist__item"
              :class="{ 'checklist__item--done': item.checked }"
              @tap="toggleItem(item.id)"
            >
              <view class="checklist__circle" :class="{ 'checklist__circle--checked': item.checked }">
                <text v-if="item.checked" class="checklist__checkmark">✓</text>
              </view>
              <text class="checklist__item-text" :class="{ 'checklist__item-text--done': item.checked }">
                {{ item.text }}
              </text>
              <view
                v-if="!item.isDefault"
                class="checklist__delete"
                @tap.stop="removeItem(item.id)"
              >
                <text>×</text>
              </view>
            </view>
          </view>

          <view class="checklist__add">
            <input
              v-model="newItemText"
              class="checklist__input"
              placeholder="添加自定义事项..."
              placeholder-style="color: #C4B8AD;"
              :maxlength="20"
              @confirm="addItem"
            />
            <view class="checklist__add-btn" @tap="addItem">
              <text>添加</text>
            </view>
          </view>

          <view class="checklist__reset" @tap="resetChecklist">
            <text>重置所有事项</text>
          </view>
        </view>

        <!-- 页脚 -->
        <view class="sleep__footer">
          <text class="sleep__footer-text">🌙 晚安，愿你有个好梦</text>
        </view>
      </view>
    </scroll-view>

    <!-- 定时器完成弹窗 -->
    <view v-if="showCompletion" class="completion-overlay" @tap="dismissCompletion">
      <view class="completion-overlay__card">
        <text class="completion-overlay__icon">🌙</text>
        <text class="completion-overlay__title">该睡觉啦！</text>
        <text class="completion-overlay__hint">点击任意位置关闭</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { DURATION_OPTIONS, DEFAULT_CHECKLIST_ITEMS } from '@/utils/constants'
import { getStorage, setStorage } from '@/utils/storage'

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  isDefault: boolean
}

// ==================== 定时器 ====================
const durationOptions = DURATION_OPTIONS
const selectedDuration = ref(15)
const remaining = ref(15 * 60)
const timerState = ref<'idle' | 'running' | 'paused' | 'completed'>('idle')
const showCompletion = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
let hideTime: number | null = null

const formattedTime = computed(() => {
  const mins = Math.floor(remaining.value / 60)
  const secs = remaining.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

function selectDuration(mins: number) {
  if (timerState.value === 'running') return
  selectedDuration.value = mins
  remaining.value = mins * 60
  timerState.value = 'idle'
  showCompletion.value = false
}

function startTimer() {
  if (timerState.value === 'running') return
  if (remaining.value <= 0) {
    remaining.value = selectedDuration.value * 60
  }
  timerState.value = 'running'
  showCompletion.value = false
  hideTime = null
  tick()
  timerInterval = setInterval(tick, 1000)
}

function tick() {
  remaining.value--
  if (remaining.value <= 0) {
    completeTimer()
  }
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerState.value = 'paused'
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  remaining.value = selectedDuration.value * 60
  timerState.value = 'idle'
  showCompletion.value = false
  hideTime = null
}

function completeTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerState.value = 'completed'
  showCompletion.value = true
  remaining.value = 0
  try { wx.vibrateLong() } catch (_) { /* 部分设备不支持 */ }
}

function dismissCompletion() {
  showCompletion.value = false
  remaining.value = selectedDuration.value * 60
  timerState.value = 'idle'
}

// ==================== 护眼模式 ====================
const eyeProtectionOn = ref(false)

function toggleEyeProtection() {
  eyeProtectionOn.value = !eyeProtectionOn.value
  setStorage('eye_protection_enabled', eyeProtectionOn.value)
  uni.showToast({
    title: eyeProtectionOn.value ? '护眼模式已开启' : '护眼模式已关闭',
    icon: 'none',
    duration: 1500,
  })
}

// ==================== 睡前清单 ====================
const checklist = ref<ChecklistItem[]>([])
const newItemText = ref('')
const doneCount = computed(() => checklist.value.filter((i) => i.checked).length)

function loadChecklist() {
  const saved = getStorage<ChecklistItem[]>('bedtime_checklist', [])
  if (saved.length > 0) {
    checklist.value = saved
    return
  }
  checklist.value = DEFAULT_CHECKLIST_ITEMS.map((i) => ({ ...i }))
  saveChecklist()
}

function saveChecklist() {
  setStorage('bedtime_checklist', checklist.value)
}

function toggleItem(id: string) {
  const item = checklist.value.find((i) => i.id === id)
  if (item) {
    item.checked = !item.checked
    saveChecklist()
  }
}

function addItem() {
  const text = newItemText.value.trim()
  if (!text) return
  if (text.length > 20) {
    uni.showToast({ title: '事项不能超过20个字', icon: 'none' })
    return
  }
  checklist.value.push({
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    checked: false,
    isDefault: false,
  })
  newItemText.value = ''
  saveChecklist()
}

function removeItem(id: string) {
  const item = checklist.value.find((i) => i.id === id)
  if (!item || item.isDefault) return
  checklist.value = checklist.value.filter((i) => i.id !== id)
  saveChecklist()
}

function resetChecklist() {
  uni.showModal({
    title: '重置确认',
    content: '确定要重置所有事项的勾选状态吗？',
    success: (res: any) => {
      if (res.confirm) {
        checklist.value.forEach((item) => { item.checked = false })
        saveChecklist()
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    },
  })
}

// ==================== 生命周期 ====================
loadChecklist()
eyeProtectionOn.value = getStorage<boolean>('eye_protection_enabled', false)

onShow(() => {
  if (timerState.value === 'running' && hideTime !== null) {
    const elapsed = Math.floor((Date.now() - hideTime) / 1000)
    remaining.value = Math.max(0, remaining.value - elapsed)
    hideTime = null
    if (remaining.value <= 0) {
      completeTimer()
      return
    }
  }
  if (timerState.value === 'running' && !timerInterval) {
    timerInterval = setInterval(tick, 1000)
  }
  // 每次显示时重新加载清单（可能在其他 Tab 被修改）
  loadChecklist()
})

onHide(() => {
  if (timerState.value === 'running') {
    hideTime = Date.now()
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.sleep {
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
    padding: 40rpx 40rpx 24rpx;
    text-align: center;
  }

  &__title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 8rpx;
  }

  &__moon {
    font-size: 48rpx;
    line-height: 1;
    filter: drop-shadow(0 4rpx 8rpx rgba(232, 168, 124, 0.4));
  }

  &__title {
    font-size: 40rpx;
    font-weight: $weight-extrabold;
    color: $color-text-main;
    letter-spacing: 2rpx;
  }

  &__subtitle {
    font-size: 24rpx;
    color: $color-text-sub;
    letter-spacing: 1rpx;
  }

  &__body {
    flex: 1;
    overflow: hidden;
    position: relative;
    z-index: 1;

    &-inner {
      padding: 0 32rpx 60rpx;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding: 40rpx 0 80rpx;

    &-text {
      font-size: 24rpx;
      color: $color-text-muted;
      letter-spacing: 4rpx;
    }
  }
}

// 护眼遮罩
.eye-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(255, 180, 100, 0.20);
  pointer-events: none;
}

// 通用卡片
.card {
  background-color: $color-card-bg;
  border-radius: $radius-lg;
  padding: 36rpx;
  margin-bottom: 28rpx;
  box-shadow: $shadow-card;
  border: 2rpx solid $color-card-border;

  &__header {
    display: flex;
    align-items: center;
    gap: 14rpx;
    margin-bottom: 28rpx;
  }

  &__icon {
    font-size: 36rpx;
    line-height: 1;
  }

  &__title {
    font-size: 30rpx;
    font-weight: $weight-bold;
    color: $color-text-main;
  }
}

// 定时器
.timer {
  &__display {
    text-align: center;
    padding: 28rpx 0 36rpx;

    &--active .timer__time {
      color: $color-primary;
    }
  }

  &__time {
    font-size: 88rpx;
    font-weight: $weight-extrabold;
    color: $color-text-main;
    letter-spacing: 4rpx;
    font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
    display: block;
    line-height: 1.1;
    transition: color 0.3s ease;
  }

  &__label {
    font-size: 24rpx;
    color: $color-text-sub;
    margin-top: 10rpx;
    display: block;
  }

  &__presets {
    display: flex;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 36rpx;
  }

  &__preset {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 24rpx;
    border-radius: $radius-md;
    background-color: $color-bg;
    border: 2rpx solid $color-border;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
    }

    &--active {
      border-color: $color-primary;
      background-color: $color-bg-cool;

      .timer__preset-num {
        color: $color-primary;
      }

      .timer__preset-unit {
        color: $color-primary-light;
      }
    }
  }

  &__preset-num {
    font-size: 36rpx;
    font-weight: $weight-extrabold;
    color: $color-text-main;
    line-height: 1.2;
  }

  &__preset-unit {
    font-size: 20rpx;
    color: $color-text-sub;
  }

  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28rpx;
  }

  &__btn {
    padding: 20rpx 56rpx;
    border-radius: $radius-full;
    font-size: 28rpx;
    font-weight: $weight-bold;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:active {
      transform: scale(0.96);
    }

    &--start {
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
      color: $color-text-inverse;
      box-shadow: $shadow-btn;
    }

    &--pause {
      background: linear-gradient(135deg, $color-accent 0%, $color-accent-dark 100%);
      color: $color-text-inverse;
      box-shadow: $shadow-btn-accent;
    }

    &--reset {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      background-color: $color-bg;
      border: 2rpx solid $color-border;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: $color-text-sub;
      padding: 0;
    }
  }
}

// 护眼模式
.eye {
  &__desc {
    font-size: 26rpx;
    color: $color-text-sub;
    line-height: 1.6;
    display: block;
    margin-bottom: 28rpx;
  }

  &__switch {
    width: 120rpx;
    height: 60rpx;
    border-radius: 60rpx;
    background-color: #E0DCD5;
    display: flex;
    align-items: center;
    padding: 6rpx;
    transition: background-color 0.25s ease;
    margin: 0 auto;

    &--on {
      background-color: $color-accent;

      .eye__switch-knob {
        transform: translateX(60rpx);
      }
    }
  }

  &__switch-knob {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background-color: $color-text-inverse;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
    transition: transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
}

// 清单
.checklist {
  &__progress {
    margin-bottom: 24rpx;
  }

  &__progress-text {
    font-size: 22rpx;
    color: $color-text-sub;
    margin-bottom: 10rpx;
    display: block;
  }

  &__progress-bar {
    height: 8rpx;
    background-color: $color-bg;
    border-radius: 8rpx;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $color-accent 0%, $color-accent-dark 100%);
    border-radius: 8rpx;
    transition: width 0.3s ease;
  }

  &__items {
    margin-bottom: 24rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 20rpx 8rpx;
    border-bottom: 2rpx solid $color-border-light;
    transition: background-color 0.15s ease;

    &:active {
      background-color: $color-bg;
    }

    &--done {
      opacity: 0.55;
    }
  }

  &__circle {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    border: 3rpx solid #D6C7BC;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &--checked {
      background-color: $color-accent;
      border-color: $color-accent;
    }
  }

  &__checkmark {
    font-size: 24rpx;
    color: $color-text-inverse;
    font-weight: $weight-bold;
  }

  &__item-text {
    flex: 1;
    font-size: 30rpx;
    color: $color-text-main;
    font-weight: $weight-medium;

    &--done {
      text-decoration: line-through;
      color: $color-text-muted;
    }
  }

  &__delete {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    background-color: $color-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: $color-text-muted;
    margin-left: 12rpx;

    &:active {
      background-color: #FFE8E0;
      color: $color-danger;
    }
  }

  &__add {
    display: flex;
    gap: 16rpx;
    margin-bottom: 24rpx;
  }

  &__input {
    flex: 1;
    height: 80rpx;
    border-radius: $radius-md;
    background-color: $color-bg;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: $color-text-main;
    border: 2rpx solid $color-border;
  }

  &__add-btn {
    width: 140rpx;
    height: 80rpx;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
    color: $color-text-inverse;
    font-size: 28rpx;
    font-weight: $weight-semibold;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.85;
      transform: scale(0.96);
    }
  }

  &__reset {
    text-align: center;
    padding: 16rpx;

    text {
      font-size: 24rpx;
      color: $color-text-sub;
    }
  }
}

// 完成弹窗
.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &__card {
    background-color: $color-text-inverse;
    border-radius: 40rpx;
    padding: 80rpx;
    text-align: center;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
    animation: popIn 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }

  &__icon {
    font-size: 120rpx;
    display: block;
    margin-bottom: 24rpx;
    filter: drop-shadow(0 4rpx 12rpx rgba(232, 168, 124, 0.4));
  }

  &__title {
    font-size: 44rpx;
    font-weight: $weight-extrabold;
    color: $color-text-main;
    display: block;
    margin-bottom: 16rpx;
    letter-spacing: 4rpx;
  }

  &__hint {
    font-size: 24rpx;
    color: $color-text-sub;
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>