export interface Profile {
  id: string
  username: string
  email: string
  phone: string | null
  household_id: string | null
  role: string
  created_at: string
}

export interface Household {
  id: string
  name: string | null
  admin_id: string
  invite_code: string
  created_at: string
}

export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  role: string
  notifications_enabled: boolean
  joined_at: string
}

export interface Room {
  id: string
  household_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface TaskTemplate {
  id: string
  household_id: string
  description: string
  room_id: string | null
  assigned_to_id: string | null
  frequency: string
  day_value: number
  is_sporadic: boolean
  is_active: boolean
  created_at: string
}

export interface Task {
  id: string
  household_id: string
  template_id: string | null
  description: string
  room_id: string | null
  assigned_to_id: string | null
  due_date: string
  completed: boolean
  completed_by: string | null
  completed_at: string | null
  created_at: string
}

export interface Event {
  id: string
  household_id: string
  created_by: string
  description: string
  event_date_time: string
  location: string | null
  completed: boolean
  completed_by: string | null
  completed_at: string | null
  notified_1h: boolean
  notified_30min: boolean
  created_at: string
}

export interface ShoppingItem {
  id: string
  household_id: string
  item_name: string
  category: string | null
  quantity: string | null
  completed: boolean
  completed_by: string | null
  completed_at: string | null
  created_at: string
}

export interface ShoppingCategory {
  id: string
  household_id: string
  name: string
  keywords: string[]
  sort_order: number
}

export interface FamilyMember {
  id: string
  household_id: string
  name: string
  type: 'baby' | 'pet' | 'other'
  phone: string | null
  notes: string | null
  created_at: string
}

export interface NotificationSettings {
  id: string
  household_id: string
  email_enabled: boolean
  events_enabled: boolean
  reminder_time: string
  reminder_freq: string
  reminder_times: string[]
  deadline_time: string
  created_at: string
}
