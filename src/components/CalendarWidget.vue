<script setup>
import { computed } from 'vue'

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()
const today = now.getDate()

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
})
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <span class="calendar-title">{{ currentYear }}.{{ currentMonth + 1 }}</span>
    </div>
    <div class="calendar-week">
      <span v-for="d in weekDays" :key="d" class="cal-week-day">{{ d }}</span>
    </div>
    <div class="calendar-grid">
      <span
        v-for="(day, idx) in calendarDays"
        :key="idx"
        class="cal-day"
        :class="{ 'cal-day--today': day === today, 'cal-day--empty': day === null }"
      >{{ day ?? '' }}</span>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.875rem;
}

.calendar-header {
  text-align: center;
  margin-bottom: 0.625rem;
}

.calendar-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 2px;
}

.cal-week-day {
  text-align: center;
  font-size: 0.62rem;
  color: var(--text-tertiary);
  padding: 0.15rem 0;
  font-weight: 500;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.cal-day {
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-primary);
  padding: 0.2rem 0;
  border-radius: 4px;
  transition: background 0.15s;
}

.cal-day--today {
  background: var(--pink);
  color: #fff;
  font-weight: 700;
}

.cal-day--empty {
  visibility: hidden;
}

.cal-day:not(.cal-day--empty):not(.cal-day--today):hover {
  background: rgba(244, 114, 182, 0.08);
}
</style>
