import { STORAGE_KEYS } from './constants'

// ==================== 通用存储 ====================
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = wx.getStorageSync(key)
    return raw !== undefined && raw !== null && raw !== '' ? raw : defaultValue
  } catch (_) {
    return defaultValue
  }
}

export function setStorage(key: string, value: unknown): void {
  try {
    wx.setStorageSync(key, value)
  } catch (_) {
    // 存储失败静默处理
  }
}

// ==================== 宝宝档案 ====================
export interface BabyProfile {
  birthDate: string // '2025-08-15'
  name: string
}

export function getBabyProfile(): BabyProfile | null {
  return getStorage<BabyProfile | null>(STORAGE_KEYS.BABY_PROFILE, null)
}

export function setBabyProfile(profile: BabyProfile): void {
  setStorage(STORAGE_KEYS.BABY_PROFILE, profile)
}

// ==================== 日志清理 ====================
export function cleanupOldLogs(maxDays = 30): void {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = today.getTime() - maxDays * 24 * 60 * 60 * 1000

  const logKeys = [STORAGE_KEYS.FEEDING_LOGS, STORAGE_KEYS.DIAPER_LOGS, STORAGE_KEYS.MOOD_LOGS]
  for (const key of logKeys) {
    const logs = getStorage<any[]>(key, [])
    if (logs.length === 0) continue
    const filtered = logs.filter((log) => log.timestamp >= cutoff)
    if (filtered.length !== logs.length) {
      setStorage(key, filtered)
    }
  }
}

// ==================== 日志通用操作 ====================
export function getLogs<T>(key: string): T[] {
  return getStorage<T[]>(key, [])
}

export function addLog<T extends { id: string; timestamp: number }>(key: string, entry: T): void {
  const logs = getLogs<T>(key)
  logs.unshift(entry)
  setStorage(key, logs)
}

export function deleteLog<T extends { id: string }>(key: string, id: string): void {
  const logs = getLogs<T>(key)
  setStorage(key, logs.filter((l) => l.id !== id))
}

export function getTodayLogs<T extends { timestamp: number }>(key: string): T[] {
  const logs = getLogs<T>(key)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = today.getTime()
  return logs.filter((l) => l.timestamp >= start)
}