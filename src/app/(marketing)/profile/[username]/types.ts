export type Profile = {
  id: number
  userId: number
  username: string
  name?: string
  bio?: string
  profileImageUrl?: string
  backgroundImageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export type ProfileContribution = {
  id: number
  profileId: number
  guildId: number
  roleId: number
}
