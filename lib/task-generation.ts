interface Template {
  id: string
  household_id: string
  description: string
  room: string | null
  assigned_to: string | null
  frequency: string
  day_value: number
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

interface TaskToCreate {
  household_id: string
  template_id: string
  description: string
  room: string | null
  assigned_to: string | null
  due_date: string
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
          room: template.room,
          assigned_to: template.assigned_to,
          due_date: dueDate,
        })
      }
    }
    current.setDate(current.getDate() + 1)
  }

  return tasks
}
