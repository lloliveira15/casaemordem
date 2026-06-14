import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { RoomTasks } from "@/components/rooms/room-tasks"

export default async function RoomTasksPage(props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: room } = await supabase
    .from("rooms").select("*").eq("id", roomId).eq("household_id", profile.household_id)
    .single()

  if (!room) notFound()

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*, room:rooms(name), assigned:household_members!task_templates_assigned_to_id_fkey(user_id, profiles!inner(username))")
    .eq("household_id", profile.household_id)
    .eq("room_id", roomId)
    .eq("is_active", true)
    .eq("is_sporadic", false)
    .order("created_at")

  const { data: members } = await supabase
    .from("household_members")
    .select("id, user_id, profiles!inner(username)")
    .eq("household_id", profile.household_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/app/comodos" className="text-sm text-muted-foreground hover:text-primary">&larr; Cômodos</a>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-extrabold text-foreground">{room.name}</h1>
      </div>
      <RoomTasks
        roomId={roomId}
        templates={templates ?? []}
        members={members ?? []}
      />
    </div>
  )
}
