// ==================== 存储 Key ====================
export const STORAGE_KEYS = {
  // 已有
  EYE_PROTECTION: 'eye_protection_enabled',
  BEDTIME_CHECKLIST: 'bedtime_checklist',

  // 新增
  BABY_PROFILE: 'baby_profile',
  FEEDING_LOGS: 'feeding_logs',
  DIAPER_LOGS: 'diaper_logs',
  MOOD_LOGS: 'mood_logs',
  VACCINATION_STATUS: 'vaccination_status',
  MILESTONE_STATUS: 'milestone_status',
  LAST_CLEANUP_DATE: 'last_cleanup_date',
} as const

// ==================== 定时器 ====================
export const DURATION_OPTIONS = [15, 30, 45, 60]

// ==================== 睡前清单默认项 ====================
export const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'd-1', text: '刷牙', checked: false, isDefault: true },
  { id: 'd-2', text: '洗脸', checked: false, isDefault: true },
  { id: 'd-3', text: '换睡衣', checked: false, isDefault: true },
  { id: 'd-4', text: '喝牛奶', checked: false, isDefault: true },
  { id: 'd-5', text: '读绘本', checked: false, isDefault: true },
  { id: 'd-6', text: '关灯', checked: false, isDefault: true },
  { id: 'd-7', text: '说晚安', checked: false, isDefault: true },
]

// ==================== 喂养类型 ====================
export const FEEDING_TYPES = [
  { value: 'breast_left', label: '母乳(左)', icon: '🍼', color: '#E8A87C' },
  { value: 'breast_right', label: '母乳(右)', icon: '🍼', color: '#D4956A' },
  { value: 'bottle', label: '奶粉', icon: '🍶', color: '#6B7FAE' },
  { value: 'mixed', label: '混合', icon: '🥛', color: '#8BB8C4' },
] as const

export const BOTTLE_AMOUNTS = [30, 60, 90, 120, 150, 180]

// ==================== 尿布类型 ====================
export const DIAPER_TYPES = [
  { value: 'wet', label: '湿', icon: '💧', color: '#7EC8E3' },
  { value: 'dirty', label: '脏', icon: '💩', color: '#C4A87C' },
  { value: 'both', label: '都有', icon: '👶', color: '#B8A0C8' },
] as const

// ==================== 心情 ====================
export const MOOD_OPTIONS = [
  { value: 'happy', label: '开心', emoji: '😊', color: '#F0C060' },
  { value: 'okay', label: '还行', emoji: '😐', color: '#8BB8C4' },
  { value: 'tired', label: '有点累', emoji: '😮‍💨', color: '#E8A87C' },
  { value: 'exhausted', label: '很疲惫', emoji: '😔', color: '#C4B8AD' },
] as const

// ==================== 成长里程碑日期 ====================
export const GROWTH_MILESTONES = [
  { days: 100, label: '100天' },
  { months: 6, label: '6个月' },
  { months: 12, label: '1岁' },
  { months: 18, label: '1岁半' },
  { months: 24, label: '2岁' },
  { months: 36, label: '3岁' },
]

// ==================== 疫苗接种参考 ====================
export interface Vaccine {
  id: string
  name: string
  disease: string
  doseOrder: number
  totalDoses: number
  ageLabel: string
  ageMonths: number
  category: 'mandatory' | 'optional'
}

export const VACCINATION_SCHEDULE: Vaccine[] = [
  // 出生
  { id: 'v-1', name: '乙肝疫苗', disease: '乙型肝炎', doseOrder: 1, totalDoses: 3, ageLabel: '出生', ageMonths: 0, category: 'mandatory' },
  { id: 'v-2', name: '卡介苗', disease: '结核病', doseOrder: 1, totalDoses: 1, ageLabel: '出生', ageMonths: 0, category: 'mandatory' },
  // 1月龄
  { id: 'v-3', name: '乙肝疫苗', disease: '乙型肝炎', doseOrder: 2, totalDoses: 3, ageLabel: '1月龄', ageMonths: 1, category: 'mandatory' },
  // 2月龄
  { id: 'v-4', name: '脊灰灭活疫苗', disease: '脊髓灰质炎', doseOrder: 1, totalDoses: 4, ageLabel: '2月龄', ageMonths: 2, category: 'mandatory' },
  // 3月龄
  { id: 'v-5', name: '脊灰灭活疫苗', disease: '脊髓灰质炎', doseOrder: 2, totalDoses: 4, ageLabel: '3月龄', ageMonths: 3, category: 'mandatory' },
  { id: 'v-6', name: '百白破疫苗', disease: '百日咳、白喉、破伤风', doseOrder: 1, totalDoses: 4, ageLabel: '3月龄', ageMonths: 3, category: 'mandatory' },
  // 4月龄
  { id: 'v-7', name: '脊灰减毒活疫苗', disease: '脊髓灰质炎', doseOrder: 3, totalDoses: 4, ageLabel: '4月龄', ageMonths: 4, category: 'mandatory' },
  { id: 'v-8', name: '百白破疫苗', disease: '百日咳、白喉、破伤风', doseOrder: 2, totalDoses: 4, ageLabel: '4月龄', ageMonths: 4, category: 'mandatory' },
  // 5月龄
  { id: 'v-9', name: '百白破疫苗', disease: '百日咳、白喉、破伤风', doseOrder: 3, totalDoses: 4, ageLabel: '5月龄', ageMonths: 5, category: 'mandatory' },
  // 6月龄
  { id: 'v-10', name: '乙肝疫苗', disease: '乙型肝炎', doseOrder: 3, totalDoses: 3, ageLabel: '6月龄', ageMonths: 6, category: 'mandatory' },
  { id: 'v-11', name: 'A群流脑多糖疫苗', disease: '流行性脑脊髓膜炎', doseOrder: 1, totalDoses: 2, ageLabel: '6月龄', ageMonths: 6, category: 'mandatory' },
  // 8月龄
  { id: 'v-12', name: '麻腮风疫苗', disease: '麻疹、腮腺炎、风疹', doseOrder: 1, totalDoses: 2, ageLabel: '8月龄', ageMonths: 8, category: 'mandatory' },
  { id: 'v-13', name: '乙脑减毒活疫苗', disease: '流行性乙型脑炎', doseOrder: 1, totalDoses: 2, ageLabel: '8月龄', ageMonths: 8, category: 'mandatory' },
  // 9月龄
  { id: 'v-14', name: 'A群流脑多糖疫苗', disease: '流行性脑脊髓膜炎', doseOrder: 2, totalDoses: 2, ageLabel: '9月龄', ageMonths: 9, category: 'mandatory' },
  // 18月龄
  { id: 'v-15', name: '百白破疫苗', disease: '百日咳、白喉、破伤风', doseOrder: 4, totalDoses: 4, ageLabel: '18月龄', ageMonths: 18, category: 'mandatory' },
  { id: 'v-16', name: '麻腮风疫苗', disease: '麻疹、腮腺炎、风疹', doseOrder: 2, totalDoses: 2, ageLabel: '18月龄', ageMonths: 18, category: 'mandatory' },
  { id: 'v-17', name: '甲肝减毒活疫苗', disease: '甲型肝炎', doseOrder: 1, totalDoses: 1, ageLabel: '18月龄', ageMonths: 18, category: 'mandatory' },
  // 2岁
  { id: 'v-18', name: '乙脑减毒活疫苗', disease: '流行性乙型脑炎', doseOrder: 2, totalDoses: 2, ageLabel: '2岁', ageMonths: 24, category: 'mandatory' },
  // 3岁
  { id: 'v-19', name: 'A+C群流脑多糖疫苗', disease: '流行性脑脊髓膜炎', doseOrder: 1, totalDoses: 2, ageLabel: '3岁', ageMonths: 36, category: 'mandatory' },
  // 4岁
  { id: 'v-20', name: '脊灰减毒活疫苗', disease: '脊髓灰质炎', doseOrder: 4, totalDoses: 4, ageLabel: '4岁', ageMonths: 48, category: 'mandatory' },
  // 6岁
  { id: 'v-21', name: '白破疫苗', disease: '白喉、破伤风', doseOrder: 1, totalDoses: 1, ageLabel: '6岁', ageMonths: 72, category: 'mandatory' },
  { id: 'v-22', name: 'A+C群流脑多糖疫苗', disease: '流行性脑脊髓膜炎', doseOrder: 2, totalDoses: 2, ageLabel: '6岁', ageMonths: 72, category: 'mandatory' },
]

// ==================== 发育里程碑参考 ====================
export interface Milestone {
  id: string
  ageMonths: number
  ageLabel: string
  domain: 'gross_motor' | 'fine_motor' | 'language' | 'social'
  description: string
}

export const DOMAIN_LABELS: Record<string, string> = {
  gross_motor: '大运动',
  fine_motor: '精细运动',
  language: '语言',
  social: '社交',
}

export const MILESTONES: Milestone[] = [
  // 1个月
  { id: 'm-1', ageMonths: 1, ageLabel: '1个月', domain: 'gross_motor', description: '俯卧时能短暂抬头几秒钟' },
  { id: 'm-2', ageMonths: 1, ageLabel: '1个月', domain: 'fine_motor', description: '手掌通常保持握拳状态' },
  { id: 'm-3', ageMonths: 1, ageLabel: '1个月', domain: 'language', description: '会用哭声表达不同的需求' },
  { id: 'm-4', ageMonths: 1, ageLabel: '1个月', domain: 'social', description: '能注视人脸，对声音有反应' },
  // 3个月
  { id: 'm-5', ageMonths: 3, ageLabel: '3个月', domain: 'gross_motor', description: '俯卧时能抬头45度以上' },
  { id: 'm-6', ageMonths: 3, ageLabel: '3个月', domain: 'fine_motor', description: '开始会挥动手臂，抓握玩具' },
  { id: 'm-7', ageMonths: 3, ageLabel: '3个月', domain: 'language', description: '开始发出"咕咕""啊啊"的声音' },
  { id: 'm-8', ageMonths: 3, ageLabel: '3个月', domain: 'social', description: '会对人微笑，喜欢看人的脸' },
  // 6个月
  { id: 'm-9', ageMonths: 6, ageLabel: '6个月', domain: 'gross_motor', description: '能从仰卧翻到俯卧，会撑坐' },
  { id: 'm-10', ageMonths: 6, ageLabel: '6个月', domain: 'fine_motor', description: '会伸手抓握玩具，把东西放嘴里' },
  { id: 'm-11', ageMonths: 6, ageLabel: '6个月', domain: 'language', description: '会笑出声，回应大人的声音' },
  { id: 'm-12', ageMonths: 6, ageLabel: '6个月', domain: 'social', description: '能认出熟悉的人，会玩简单的互动游戏' },
  // 9个月
  { id: 'm-13', ageMonths: 9, ageLabel: '9个月', domain: 'gross_motor', description: '能独坐，会匍匐爬行' },
  { id: 'm-14', ageMonths: 9, ageLabel: '9个月', domain: 'fine_motor', description: '会用拇指和食指捏取小物件' },
  { id: 'm-15', ageMonths: 9, ageLabel: '9个月', domain: 'language', description: '开始发出"baba""mama"等音节' },
  { id: 'm-16', ageMonths: 9, ageLabel: '9个月', domain: 'social', description: '会玩躲猫猫，有分离焦虑表现' },
  // 12个月
  { id: 'm-17', ageMonths: 12, ageLabel: '12个月', domain: 'gross_motor', description: '能扶着家具站立和行走' },
  { id: 'm-18', ageMonths: 12, ageLabel: '12个月', domain: 'fine_motor', description: '会用手抓食物自己吃' },
  { id: 'm-19', ageMonths: 12, ageLabel: '12个月', domain: 'language', description: '有意识地叫"爸爸""妈妈"' },
  { id: 'm-20', ageMonths: 12, ageLabel: '12个月', domain: 'social', description: '会挥手"拜拜"，模仿简单动作' },
  // 18个月
  { id: 'm-21', ageMonths: 18, ageLabel: '18个月', domain: 'gross_motor', description: '能独走，会尝试小跑' },
  { id: 'm-22', ageMonths: 18, ageLabel: '18个月', domain: 'fine_motor', description: '会用勺子吃饭，会乱涂乱画' },
  { id: 'm-23', ageMonths: 18, ageLabel: '18个月', domain: 'language', description: '会说10个左右的词' },
  { id: 'm-24', ageMonths: 18, ageLabel: '18个月', domain: 'social', description: '开始模仿大人做家务的动作' },
  // 24个月
  { id: 'm-25', ageMonths: 24, ageLabel: '24个月', domain: 'gross_motor', description: '能跑，会扶着上下楼梯' },
  { id: 'm-26', ageMonths: 24, ageLabel: '24个月', domain: 'fine_motor', description: '会一页一页翻书，会堆几块积木' },
  { id: 'm-27', ageMonths: 24, ageLabel: '24个月', domain: 'language', description: '会说2-3个词的短句' },
  { id: 'm-28', ageMonths: 24, ageLabel: '24个月', domain: 'social', description: '开始会在其他小朋友旁边玩' },
  // 36个月
  { id: 'm-29', ageMonths: 36, ageLabel: '36个月', domain: 'gross_motor', description: '能双脚跳，会骑三轮车' },
  { id: 'm-30', ageMonths: 36, ageLabel: '36个月', domain: 'fine_motor', description: '会画圆圈和直线，会穿珠子' },
  { id: 'm-31', ageMonths: 36, ageLabel: '36个月', domain: 'language', description: '会说完整的句子，能说出自己名字' },
  { id: 'm-32', ageMonths: 36, ageLabel: '36个月', domain: 'social', description: '开始懂得轮流等待，会玩过家家' },
]