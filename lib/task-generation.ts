interface Template {
  id: string
  household_id: string
  description: string
  room_id: string | null
  assigned_to_id: string | null
  frequency: string
  day_value: number
}

interface TaskToCreate {
  household_id: string
  template_id: string
  description: string
  room_id: string | null
  assigned_to_id: string | null
  due_date: string
}

function isBiweeklyMatch(date: Date, dayValue: number): boolean {
  const dayOfMonth = date.getDate()
  if (dayValue === 1) return dayOfMonth <= 15
  if (dayValue === 2) return dayOfMonth > 15
  return false
}

export function shouldGenerateOnDate(template: Template, date: Date): boolean {
  switch (template.frequency) {
    case "daily":
      return true
    case "weekly":
      return date.getDay() === template.day_value
    case "biweekly":
      return isBiweeklyMatch(date, template.day_value)
    case "monthly":
      return date.getDate() === template.day_value
    default:
      return false
  }
}

export function generateTasksForRange(
  templates: Template[],
  householdId: string,
  startDate: Date,
  endDate: Date
): TaskToCreate[] {
  const tasks: TaskToCreate[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    for (const template of templates) {
      if (shouldGenerateOnDate(template, current)) {
        const dueDate = current.toISOString().split("T")[0]
        tasks.push({
          household_id: householdId,
          template_id: template.id,
          description: template.description,
          room_id: template.room_id,
          assigned_to_id: template.assigned_to_id,
          due_date: dueDate,
        })
      }
    }
    current.setDate(current.getDate() + 1)
  }

  return tasks
}
