export const MANAGE_ROLES_PERMISSION_NAME = "Manage Roles"
export const MANAGE_SERVER_PERMISSION_NAME = "Manage Server"
export const CREATE_INVITE_PERMISSION_NAME = "Create Invite"
export const GUILD_BOT_ROLE_NAME = "Guild.xyz bot"
/**
 * If this list changes, make sure to replace the public/discord_permissions.png
 * image
 */
export const REQUIRED_PERMISSIONS = [
  MANAGE_ROLES_PERMISSION_NAME,
  "View Channels",
  MANAGE_SERVER_PERMISSION_NAME,
  CREATE_INVITE_PERMISSION_NAME,
  "Send Messages",
  "Embed Links",
  "Add Reactions",
  "Use External Emoji",
] as const
