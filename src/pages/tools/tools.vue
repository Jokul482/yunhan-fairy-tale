<template>
  <view class="tools">
    <scroll-view class="tools__body" :scroll-y="true" enhanced :show-scrollbar="false">
      <view class="tools__body-inner">
        <!-- ========== 宝宝成长日历 ========== -->
        <view class="card card--hero">
          <view v-if="!babyProfile" class="hero__setup">
            <text class="hero__setup-icon">👶</text>
            <text class="hero__setup-title">添加宝宝生日</text>
            <text class="hero__setup-desc">记录宝宝的成长，解锁个性化提醒</text>
            <view class="hero__setup-btn" @tap="openBirthPicker">
              <text>立即设置</text>
            </view>
          </view>
          <view v-else class="hero__info">
            <text class="hero__name">{{ babyProfile.name || '小宝贝' }}</text>
            <text class="hero__days">已经 {{ babyDays }} 天</text>
            <text class="hero__detail">{{ babyMonthAge }}</text>
            <view class="hero__milestones">
              <view
                v-for="m in growthMilestones"
                :key="m.key"
                class="hero__milestone"
                :class="{ 'hero__milestone--done': m.reached, 'hero__milestone--next': m.isNext }"
              >
                <text class="hero__milestone-label">{{ m.label }}</text>
                <text v-if="m.reached" class="hero__milestone-status hero__milestone-status--done">已完成</text>
                <text v-else class="hero__milestone-status">还剩 {{ m.remaining }} 天</text>
              </view>
            </view>
            <text class="hero__edit" @tap="openBirthPicker">修改生日</text>
          </view>
        </view>

        <!-- ========== 疫苗接种参考 ========== -->
        <view class="card">
          <view class="card__header">
            <text class="card__icon">💉</text>
            <text class="card__title">疫苗接种参考</text>
          </view>
          <text v-if="nextVaccine" class="vaccine__next">
            下次接种：<text class="vaccine__next-highlight">{{ nextVaccine }}</text>
          </text>

          <view v-for="group in vaccineGroups" :key="group.ageLabel" class="vaccine__group">
            <view class="vaccine__group-header" :class="{ 'vaccine__group-header--current': group.isCurrent }">
              <text class="vaccine__group-age">{{ group.ageLabel }}</text>
              <text v-if="group.isCurrent" class="vaccine__current-tag">当前</text>
            </view>
            <view v-for="v in group.vaccines" :key="v.id" class="vaccine__item">
              <view class="vaccine__item-left">
                <text class="vaccine__item-name">{{ v.name }}</text>
                <text class="vaccine__item-disease">{{ v.disease }}</text>
              </view>
              <view class="vaccine__item-right">
                <text class="vaccine__item-dose">第{{ v.doseOrder }}剂 / 共{{ v.totalDoses }}剂</text>
                <view
                  class="vaccine__check"
                  :class="{ 'vaccine__check--done': vaccineStatus[v.id] }"
                  @tap="toggleVaccine(v.id)"
                >
                  <text v-if="vaccineStatus[v.id]">✓</text>
                  <text v-else>○</text>
                </view>
              </view>
            </view>
          </view>

          <text class="disclaimer">以上信息仅供参考，具体接种安排请以当地接种点医生建议为准。</text>
        </view>

        <!-- ========== 发育里程碑 ========== -->
        <view class="card">
          <view class="card__header">
            <text class="card__icon">🌱</text>
            <text class="card__title">发育里程碑参考</text>
          </view>

          <view class="milestone__tabs">
            <view
              v-for="group in milestoneGroups"
              :key="group.ageMonths"
              class="milestone__tab"
              :class="{ 'milestone__tab--active': milestoneTab === group.ageMonths, 'milestone__tab--current': group.isCurrent }"
              @tap="milestoneTab = group.ageMonths"
            >
              <text>{{ group.ageLabel }}</text>
            </view>
          </view>

          <view v-for="domain in activeDomains" :key="domain.key" class="milestone__domain">
            <text class="milestone__domain-label">{{ domain.label }}</text>
            <view
              v-for="m in domain.items"
              :key="m.id"
              class="milestone__item"
              :class="{ 'milestone__item--checked': milestoneStatus[m.id] }"
              @tap="toggleMilestone(m.id)"
            >
              <view class="milestone__check-circle" :class="{ 'milestone__check-circle--done': milestoneStatus[m.id] }">
                <text v-if="milestoneStatus[m.id]">✓</text>
              </view>
              <text class="milestone__item-text">{{ m.description }}</text>
            </view>
          </view>

          <text class="disclaimer">每个宝宝发展速度不同，以上内容仅供参考，如有疑虑请咨询专业医生。</text>
        </view>

        <!-- ========== 意见反馈 ========== -->
        <!-- <view class="card">
          <view class="card__header">
            <text class="card__icon">💬</text>
            <text class="card__title">意见反馈</text>
          </view>
          <text class="feedback__desc">欢迎提出建议或反馈 bug，帮助小鹿妈妈变得更好。</text>
          <view class="feedback__actions">
            <view class="feedback__btn feedback__btn--primary" @tap="openFeedback">
              <text>✍️ 提交反馈</text>
            </view>
            <view class="feedback__btn feedback__btn--ghost" @tap="openCustomerService">
              <text>💬 在线客服</text>
            </view>
          </view>
        </view> -->

        <!-- 底部 -->
        <view class="tools__footer">
          <text class="tools__footer-text">小鹿妈妈 · 陪伴成长每一步</text>
        </view>
      </view>
    </scroll-view>

    <!-- 宝宝生日弹窗 -->
    <view v-if="birthOpen" class="sheet-overlay" @tap="birthOpen = false">
      <view class="sheet" @tap.stop>
        <text class="sheet__title">设置宝宝生日</text>
        <view class="sheet__form">
          <picker mode="date" :value="tempBirthDate" :end="todayStr" @change="onBirthChange">
            <view class="sheet__date-picker">
              <text>{{ tempBirthDate || '请选择宝宝的出生日期' }}</text>
              <text class="sheet__date-arrow">📅</text>
            </view>
          </picker>
        </view>
        <view class="sheet__confirm">
          <view class="sheet__btn sheet__btn--ghost" @tap="birthOpen = false">
            <text>取消</text>
          </view>
          <view class="sheet__btn sheet__btn--primary" @tap="saveBirth">
            <text>保存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 意见反馈弹窗 -->
    <view v-if="feedbackOpen" class="sheet-overlay" @tap="feedbackOpen = false">
      <view class="sheet" @tap.stop>
        <text class="sheet__title">提交反馈</text>
        <view class="sheet__form">
          <textarea
            v-model="feedbackText"
            class="feedback__textarea"
            placeholder="请输入您的意见或问题描述..."
            placeholder-style="color: #C4B8AD;"
            :maxlength="500"
            :auto-height="true"
          />
        </view>
        <view class="sheet__confirm">
          <view class="sheet__btn sheet__btn--ghost" @tap="feedbackOpen = false">
            <text>取消</text>
          </view>
          <view class="sheet__btn sheet__btn--primary" @tap="submitFeedback">
            <text>提交</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { GROWTH_MILESTONES, VACCINATION_SCHEDULE, MILESTONES, DOMAIN_LABELS } from '@/utils/constants'
import { getBabyProfile, setBabyProfile, getStorage, setStorage } from '@/utils/storage'
import type { BabyProfile } from '@/utils/storage'
import type { Vaccine, Milestone } from '@/utils/constants'

// ==================== 日期 ====================
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// ==================== 宝宝生日弹窗 ====================
const birthOpen = ref(false)
const tempBirthDate = ref('')

function openBirthPicker() {
  const profile = getBabyProfile()
  tempBirthDate.value = profile?.birthDate || ''
  birthOpen.value = true
}

function onBirthChange(e: any) {
  tempBirthDate.value = e.detail.value
}

function saveBirth() {
  if (!tempBirthDate.value) {
    uni.showToast({ title: '请先选择日期', icon: 'none' })
    return
  }
  const profile = getBabyProfile()
  setBabyProfile({ birthDate: tempBirthDate.value, name: profile?.name || '' })
  birthOpen.value = false
  uni.showToast({ title: '已保存', icon: 'success' })
}

// ==================== 宝宝信息 ====================
const babyProfile = ref<BabyProfile | null>(null)
const babyDays = ref(0)
const babyMonths = ref(0)

function refreshBabyProfile() {
  babyProfile.value = getBabyProfile()
  if (babyProfile.value?.birthDate) {
    const birth = new Date(babyProfile.value.birthDate)
    const now = new Date()
    babyDays.value = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    babyMonths.value = babyDays.value / 30.44
  }
}

const babyMonthAge = computed(() => {
  if (!babyProfile.value?.birthDate) return ''
  const totalMonths = Math.floor(babyMonths.value)
  if (totalMonths < 24) {
    const remainingDays = babyDays.value - Math.floor(totalMonths * 30.44)
    return `${totalMonths}个月${remainingDays}天 · ${Math.floor(babyDays.value / 7)}周${babyDays.value % 7}天`
  }
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return months > 0 ? `${years}岁${months}个月` : `${years}岁`
})

// ==================== 成长里程碑 ====================
const growthMilestones = computed(() => {
  if (!babyProfile.value?.birthDate) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const birth = new Date(babyProfile.value.birthDate)

  const ms = GROWTH_MILESTONES.map((m) => {
    let target: Date
    if (m.days) {
      target = new Date(birth.getTime() + m.days * 24 * 60 * 60 * 1000)
    } else {
      target = new Date(birth)
      target.setMonth(target.getMonth() + (m.months || 0))
    }
    const remaining = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return {
      key: m.label,
      label: m.label,
      reached: remaining <= 0,
      remaining: Math.abs(remaining),
      isNext: false,
    }
  })

  const next = ms.find((m) => !m.reached)
  if (next) next.isNext = true

  return ms
})

// ==================== 疫苗接种 ====================
const vaccineStatus = reactive<Record<string, boolean>>({})

function loadVaccineStatus() {
  const saved = getStorage<Record<string, boolean>>('vaccination_status', {})
  Object.keys(saved).forEach((k) => { vaccineStatus[k] = saved[k] })
}

function toggleVaccine(id: string) {
  vaccineStatus[id] = !vaccineStatus[id]
  setStorage('vaccination_status', { ...vaccineStatus })
}

const nextVaccine = computed(() => {
  if (!babyProfile.value?.birthDate) {
    // 无生日时显示第一条未完成疫苗的年龄
    const first = VACCINATION_SCHEDULE.find((v) => !vaccineStatus[v.id])
    return first ? `${first.ageLabel} · ${first.name}` : ''
  }
  // 按宝宝月龄找最近未完成的
  const currentAgeMonths = babyMonths.value
  let closest: Vaccine | null = null
  let minDiff = Infinity
  for (const v of VACCINATION_SCHEDULE) {
    if (vaccineStatus[v.id]) continue
    const diff = v.ageMonths - currentAgeMonths
    if (diff >= 0 && diff < minDiff) {
      minDiff = diff
      closest = v
    }
  }
  return closest ? `${closest.ageLabel} · ${closest.name}` : ''
})

const vaccineGroups = computed(() => {
  const groups: Record<string, { ageLabel: string; ageMonths: number; vaccines: Vaccine[]; isCurrent: boolean }> = {}
  for (const v of VACCINATION_SCHEDULE) {
    if (!groups[v.ageLabel]) {
      groups[v.ageLabel] = { ageLabel: v.ageLabel, ageMonths: v.ageMonths, vaccines: [], isCurrent: false }
    }
    groups[v.ageLabel].vaccines.push(v)
  }

  const currentAgeMonths = babyMonths.value
  const result = Object.values(groups)
  // 标记当前月龄段
  let closestGroup = result[0]
  let minDiff = Infinity
  for (const g of result) {
    const diff = Math.abs(g.ageMonths - currentAgeMonths)
    if (diff < minDiff) {
      minDiff = diff
      closestGroup = g
    }
  }
  if (closestGroup && babyProfile.value?.birthDate) {
    closestGroup.isCurrent = true
  }
  return result
})

// ==================== 发育里程碑 ====================
const milestoneStatus = reactive<Record<string, boolean>>({})
const milestoneTab = ref(1)

function loadMilestoneStatus() {
  const saved = getStorage<Record<string, boolean>>('milestone_status', {})
  Object.keys(saved).forEach((k) => { milestoneStatus[k] = saved[k] })
}

function toggleMilestone(id: string) {
  milestoneStatus[id] = !milestoneStatus[id]
  setStorage('milestone_status', { ...milestoneStatus })
}

// 按年龄分组获取唯一的年龄列表
const milestoneGroups = computed(() => {
  const ages = new Map<number, { ageMonths: number; ageLabel: string; isCurrent: boolean }>()
  for (const m of MILESTONES) {
    if (!ages.has(m.ageMonths)) {
      ages.set(m.ageMonths, { ageMonths: m.ageMonths, ageLabel: m.ageLabel, isCurrent: false })
    }
  }
  const currentAgeMonths = babyMonths.value
  const result = Array.from(ages.values()).sort((a, b) => a.ageMonths - b.ageMonths)
  // 标记最接近的年龄段
  let closest = result[0]
  let minDiff = Infinity
  for (const g of result) {
    const diff = Math.abs(g.ageMonths - currentAgeMonths)
    if (diff < minDiff) {
      minDiff = diff
      closest = g
    }
  }
  if (closest && babyProfile.value?.birthDate) {
    closest.isCurrent = true
  }
  // 默认选中离宝宝月龄最接近的阶段
  if (milestoneTab.value === 1 && babyProfile.value?.birthDate) {
    milestoneTab.value = closest?.ageMonths || 1
  }
  return result
})

const activeDomains = computed(() => {
  const items = MILESTONES.filter((m) => m.ageMonths === milestoneTab.value)
  const domains: { key: string; label: string; items: Milestone[] }[] = []
  const domainOrder = ['gross_motor', 'fine_motor', 'language', 'social']
  for (const key of domainOrder) {
    const domainItems = items.filter((m) => m.domain === key)
    if (domainItems.length > 0) {
      domains.push({ key, label: DOMAIN_LABELS[key] || key, items: domainItems })
    }
  }
  return domains
})

// ==================== 生命周期 ====================
onShow(() => {
  refreshBabyProfile()
  loadVaccineStatus()
  loadMilestoneStatus()
})

// ==================== 意见反馈 ====================
const feedbackOpen = ref(false)
const feedbackText = ref('')

function openFeedback() {
  feedbackText.value = ''
  feedbackOpen.value = true
}

function submitFeedback() {
  const text = feedbackText.value.trim()
  if (!text) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' })
    return
  }
  // 复制到剪贴板
  wx.setClipboardData({
    data: text,
    success: () => {
      uni.showModal({
        title: '提交成功',
        content: '反馈内容已复制到剪贴板。请添加开发者微信发送反馈，感谢你的宝贵意见！',
        showCancel: false,
      })
    },
    fail: () => {
      uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    },
  })
  feedbackOpen.value = false
}

function openCustomerService() {
  // 微信客服：需在 MP 后台 功能->客服 中启用
  // @ts-ignore openCustomerServiceConversation 在 mp-weixin 类型中可能未声明
  uni.openCustomerServiceConversation({
    success: () => {},
    fail: () => {
      wx.setClipboardData({
        data: '小鹿妈妈 反馈',
        success: () => {
          uni.showModal({
            title: '联系开发者',
            content: '在线客服暂未开启。已复制联系方式，请添加开发者微信直接反馈！',
            showCancel: false,
          })
        },
      })
    },
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.tools {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $color-bg;

  &__body {
    flex: 1;
    overflow: hidden;

    &-inner {
      padding: 24rpx 32rpx 60rpx;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding: 40rpx 0;

    &-text {
      font-size: 24rpx;
      color: $color-text-muted;
      letter-spacing: 2rpx;
    }
  }
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
    margin-bottom: 24rpx;
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

  &--hero {
    background: linear-gradient(135deg, #FFFDF8 0%, #FFF5EB 100%);
    border-color: rgba(232, 168, 124, 0.15);
  }
}

// 免责声明
.disclaimer {
  font-size: 22rpx;
  color: $color-text-muted;
  text-align: center;
  display: block;
  margin-top: 28rpx;
  line-height: 1.5;
}

// ==================== 宝宝成长卡片 ====================
.hero {
  &__setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx 0;

    &-icon {
      font-size: 72rpx;
      margin-bottom: 16rpx;
    }

    &-title {
      font-size: 32rpx;
      font-weight: $weight-bold;
      color: $color-text-main;
      margin-bottom: 8rpx;
    }

    &-desc {
      font-size: 24rpx;
      color: $color-text-sub;
      margin-bottom: 24rpx;
    }

    &-btn {
      padding: 20rpx 56rpx;
      border-radius: $radius-full;
      background: linear-gradient(135deg, $color-accent 0%, $color-accent-dark 100%);
      color: $color-text-inverse;
      font-size: 28rpx;
      font-weight: $weight-semibold;

      &:active {
        opacity: 0.85;
        transform: scale(0.96);
      }
    }
  }

  &__info {
    text-align: center;
  }

  &__name {
    font-size: 40rpx;
    font-weight: $weight-bold;
    color: $color-text-main;
    display: block;
    margin-bottom: 8rpx;
  }

  &__days {
    font-size: 52rpx;
    font-weight: $weight-extrabold;
    color: $color-accent;
    display: block;
    margin-bottom: 4rpx;
  }

  &__detail {
    font-size: 24rpx;
    color: $color-text-sub;
    display: block;
    margin-bottom: 24rpx;
  }

  &__milestones {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
  }

  &__milestone {
    padding: 12rpx 20rpx;
    border-radius: $radius-md;
    background-color: $color-bg;
    border: 2rpx solid $color-border;

    &--done {
      opacity: 0.6;

      .hero__milestone-label {
        text-decoration: line-through;
      }
    }

    &--next {
      border-color: $color-accent;
      background-color: #FFF5EB;
    }
  }

  &__milestone-label {
    font-size: 24rpx;
    color: $color-text-main;
    font-weight: $weight-medium;
    display: block;
  }

  &__milestone-status {
    font-size: 20rpx;
    color: $color-accent;
    display: block;

    &--done {
      color: $color-success;
    }
  }

  &__edit {
    font-size: 24rpx;
    color: $color-primary;
    display: inline-block;
    padding: 8rpx 16rpx;
  }
}

// ==================== 疫苗 ====================
.vaccine {
  &__next {
    font-size: 26rpx;
    color: $color-text-sub;
    display: block;
    margin-bottom: 20rpx;
    padding: 16rpx 24rpx;
    background-color: $color-bg;
    border-radius: $radius-md;
  }

  &__next-highlight {
    color: $color-primary;
    font-weight: $weight-bold;
  }

  &__group {
    margin-bottom: 20rpx;
  }

  &__group-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 12rpx 0;
    border-bottom: 2rpx solid $color-border-light;
    margin-bottom: 10rpx;

    &--current {
      .vaccine__group-age {
        color: $color-primary;
      }
    }
  }

  &__group-age {
    font-size: 28rpx;
    font-weight: $weight-bold;
    color: $color-text-main;
  }

  &__current-tag {
    font-size: 20rpx;
    padding: 4rpx 14rpx;
    border-radius: $radius-full;
    background-color: $color-bg-cool;
    color: $color-primary;
    font-weight: $weight-medium;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 8rpx;
    border-bottom: 1rpx solid $color-border-light;

    &-left {
      flex: 1;
    }

    &-name {
      font-size: 28rpx;
      font-weight: $weight-medium;
      color: $color-text-main;
      display: block;
    }

    &-disease {
      font-size: 22rpx;
      color: $color-text-sub;
      margin-top: 4rpx;
      display: block;
    }

    &-right {
      display: flex;
      align-items: center;
      gap: 16rpx;
    }

    &-dose {
      font-size: 22rpx;
      color: $color-text-sub;
    }
  }

  &__check {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: $color-text-muted;

    &--done {
      background-color: $color-accent;
      color: $color-text-inverse;
    }
  }
}

// ==================== 里程碑 ====================
.milestone {
  &__tabs {
    display: flex;
    gap: 8rpx;
    margin-bottom: 24rpx;
    flex-wrap: wrap;
  }

  &__tab {
    padding: 12rpx 22rpx;
    border-radius: $radius-md;
    background-color: $color-bg;
    font-size: 24rpx;
    color: $color-text-sub;
    border: 2rpx solid transparent;

    &--active {
      border-color: $color-primary;
      color: $color-primary;
      font-weight: $weight-semibold;
    }

    &--current {
      background-color: $color-bg-cool;
    }
  }

  &__domain {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__domain-label {
    font-size: 24rpx;
    font-weight: $weight-bold;
    color: $color-accent;
    display: block;
    margin-bottom: 10rpx;
    padding-left: 4rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 8rpx;
    border-bottom: 1rpx solid $color-border-light;

    &--checked {
      opacity: 0.55;

      .milestone__item-text {
        text-decoration: line-through;
        color: $color-text-muted;
      }
    }
  }

  &__check-circle {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 3rpx solid #D6C7BC;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    color: transparent;
    flex-shrink: 0;

    &--done {
      background-color: $color-accent;
      border-color: $color-accent;
      color: $color-text-inverse;
    }
  }

  &__item-text {
    font-size: 26rpx;
    color: $color-text-main;
    line-height: 1.5;
    flex: 1;
  }
}

// ==================== 通用弹窗 ====================
.sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  width: 100%;
  background-color: $color-card-bg;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: 40rpx 36rpx;
  padding-bottom: 60rpx;

  &__title {
    font-size: 34rpx;
    font-weight: $weight-bold;
    color: $color-text-main;
    text-align: center;
    display: block;
    margin-bottom: 32rpx;
  }

  &__form {
    margin-bottom: 32rpx;
    padding: 0 20rpx;
  }

  &__date-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28rpx 24rpx;
    border-radius: $radius-md;
    background-color: $color-bg;
    border: 2rpx solid $color-border;
    font-size: 28rpx;
    color: $color-text-main;
  }

  &__date-arrow {
    font-size: 28rpx;
  }

  &__confirm {
    display: flex;
    justify-content: center;
    gap: 24rpx;
  }

  &__btn {
    padding: 22rpx 64rpx;
    border-radius: $radius-full;
    font-size: 28rpx;
    font-weight: $weight-semibold;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.96);
    }

    &--primary {
      background: linear-gradient(135deg, $color-accent 0%, $color-accent-dark 100%);
      color: $color-text-inverse;
      box-shadow: $shadow-btn-accent;
    }

    &--ghost {
      background-color: $color-bg;
      color: $color-text-sub;
      border: 2rpx solid $color-border;
    }
  }
}

// ==================== 反馈 ====================
.feedback {
  &__desc {
    font-size: 26rpx;
    color: $color-text-sub;
    line-height: 1.6;
    display: block;
    margin-bottom: 24rpx;
  }

  &__actions {
    display: flex;
    gap: 20rpx;
  }

  &__btn {
    flex: 1;
    padding: 24rpx;
    border-radius: $radius-md;
    font-size: 26rpx;
    font-weight: $weight-semibold;
    text-align: center;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.96);
    }

    &--primary {
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
      color: $color-text-inverse;
    }

    &--ghost {
      background-color: $color-bg;
      color: $color-text-sub;
      border: 2rpx solid $color-border;
    }
  }

  &__textarea {
    width: 100%;
    min-height: 200rpx;
    background-color: $color-bg;
    border-radius: $radius-md;
    padding: 24rpx;
    font-size: 28rpx;
    color: $color-text-main;
    border: 2rpx solid $color-border;
    box-sizing: border-box;
  }
}
</style>