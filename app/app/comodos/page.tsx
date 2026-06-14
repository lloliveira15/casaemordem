import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RoomManager } from "@/components/rooms/room-manager"
import { getRooms } from "@/lib/actions/rooms"

export default async function ComodosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const rooms = await getRooms(profile.household_id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-foreground">Cômodos</h1>
      <RoomManager rooms={rooms} householdId={profile.household_id} />
    </div>
  )
}
