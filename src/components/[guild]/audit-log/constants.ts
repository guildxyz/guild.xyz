import {
  ArrowRight,
  ArrowsClockwise,
  ArrowsLeftRight,
  Eye,
  FolderUser,
  House,
  IconProps,
  IdentificationCard,
  LinkSimple,
  LockKey,
  PaintBrushBroad,
  PlusMinus,
  Question,
  SignIn,
  SignOut,
  Star,
  StarHalf,
  TextT,
  UserCircleGear,
  UserFocus,
  UserList,
  UserMinus,
  UserSwitch,
} from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export enum AUDITLOG {
  // Guild
  CreateGuild = "create guild",
  UpdateGuild = "update guild",
  DeleteGuild = "delete guild",
  ExecutePendingActions = "execute pending actions",
  TransferOwnership = "transfer ownership",
  // Guild update
  AddAdmin = "add admin",
  RemoveAdmin = "remove admin",
  ShowMembersOn = "show members on",
  ShowMembersOff = "show members off",
  HideFromExplorerOn = "hide from explorer on",
  HideFromExplorerOff = "hide from explorer off",
  // Role
  CreateRole = "create role",
  UpdateRole = "update role",
  DeleteRole = "delete role",
  // Reward
  AddReward = "add reward",
  RemoveReward = "remove reward",
  UpdateReward = "update reward",
  // Requirement
  AddRequirement = "add requirement",
  UpdateRequirement = "update requirement",
  RemoveRequirement = "remove requirement",
  // Status update
  StartStatusUpdate = "start status update",
  RestartStatusUpdate = "restart status update",
  StopStatusUpdate = "stop status update",
  // User
  ClickJoinOnWeb = "click join on web",
  ClickJoinOnPlatform = "click join on platform",
  JoinGuild = "join guild",
  LeaveGuild = "leave guild",
  KickFromGuild = "kick from guild",
  UserStatusUpdate = "user status update",
  GetRole = "get role",
  LoseRole = "lose role",
  SendReward = "send reward",
  GetReward = "get reward",
  RevokeReward = "revoke reward",
  LoseReward = "lose reward",
  ConnectIdentity = "connect identity",
  DisconnectIdentity = "disconnect identity",
  // Poap (temporary)
  // TODO?

  // These actions are only used on the frontend
  UpdateUrlName = "UpdateUrlName",
  UpdateLogoOrTitle = "UpdateLogoOrTitle",
  UpdateDescription = "UpdateDescription",
  UpdateLogic = "UpdateLogic",
  UpdateTheme = "UpdateTheme",
}

export type AuditLogActionType = keyof typeof AUDITLOG

export type AuditLogAction = {
  id: string
  parentId?: string
  action: AUDITLOG
  correlationId: string
  service: string
  timestamp: string
  before?: Record<string, any>
  data?: Record<string, any>
  ids: {
    // TODO: maybe there are some missing ids here
    user?: number
    guild?: number
    role?: number
    rolePlatform?: number
  }
  children?: Array<AuditLogAction>
}

export const auditLogActionIcons: Record<
  AUDITLOG,
  {
    as: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
    color?: string
  }
> = {
  [AUDITLOG.CreateGuild]: {
    as: House,
    color: "green.500",
  },
  [AUDITLOG.UpdateGuild]: {
    as: House,
    color: "blue.400",
  },
  [AUDITLOG.DeleteGuild]: {
    as: House,
    color: "red.500",
  },
  [AUDITLOG.ExecutePendingActions]: {
    as: Question,
    color: "gray.500",
  },
  [AUDITLOG.TransferOwnership]: {
    as: ArrowsLeftRight,
    color: "green.500",
  },
  [AUDITLOG.AddAdmin]: {
    as: UserCircleGear,
    color: "green.500",
  },
  [AUDITLOG.RemoveAdmin]: {
    as: UserCircleGear,
    color: "red.500",
  },
  [AUDITLOG.ShowMembersOn]: {
    as: UserList,
    color: "green.500",
  },
  [AUDITLOG.ShowMembersOff]: {
    as: UserList,
    color: "red.500",
  },
  [AUDITLOG.HideFromExplorerOn]: {
    as: Eye,
    color: "red.500",
  },
  [AUDITLOG.HideFromExplorerOff]: {
    as: Eye,
    color: "green.500",
  },
  [AUDITLOG.CreateRole]: {
    as: FolderUser,
    color: "green.500",
  },
  [AUDITLOG.UpdateRole]: {
    as: FolderUser,
    color: "blue.400",
  },
  [AUDITLOG.DeleteRole]: {
    as: FolderUser,
    color: "red.500",
  },
  [AUDITLOG.AddReward]: {
    as: Star,
    color: "green.500",
  },
  [AUDITLOG.RemoveReward]: {
    as: Star,
    color: "red.500",
  },
  [AUDITLOG.UpdateReward]: {
    as: Star,
    color: "blue.400",
  },
  [AUDITLOG.AddRequirement]: {
    as: LockKey,
    color: "green.500",
  },
  [AUDITLOG.UpdateRequirement]: {
    as: LockKey,
    color: "blue.400",
  },
  [AUDITLOG.RemoveRequirement]: {
    as: LockKey,
    color: "red.500",
  },
  [AUDITLOG.StartStatusUpdate]: {
    as: ArrowsClockwise,
    color: "blue.400",
  },
  [AUDITLOG.RestartStatusUpdate]: {
    as: ArrowsClockwise,
    color: "orange.500",
  },
  [AUDITLOG.StopStatusUpdate]: {
    as: ArrowsClockwise,
    color: "red.500",
  },
  [AUDITLOG.ClickJoinOnWeb]: {
    as: SignIn,
    color: "green.500",
  },
  [AUDITLOG.ClickJoinOnPlatform]: {
    as: SignIn,
    color: "green.500",
  },
  [AUDITLOG.JoinGuild]: {
    as: SignIn,
    color: "green.500",
  },
  [AUDITLOG.LeaveGuild]: {
    as: SignOut,
    color: "red.500",
  },
  [AUDITLOG.KickFromGuild]: {
    as: UserMinus,
    color: "red.500",
  },
  [AUDITLOG.UserStatusUpdate]: {
    as: UserSwitch,
    color: "blue.400",
  },
  [AUDITLOG.GetRole]: {
    as: IdentificationCard,
    color: "green.500",
  },
  [AUDITLOG.LoseRole]: {
    as: IdentificationCard,
    color: "red.500",
  },
  [AUDITLOG.SendReward]: {
    as: ArrowRight,
  },
  [AUDITLOG.GetReward]: {
    as: Star,
    color: "green.500",
  },
  [AUDITLOG.RevokeReward]: {
    as: ArrowRight,
  },
  [AUDITLOG.LoseReward]: {
    as: StarHalf,
    color: "red.500",
  },
  [AUDITLOG.ConnectIdentity]: {
    as: UserFocus,
    color: "green.500",
  },
  [AUDITLOG.DisconnectIdentity]: {
    as: UserFocus,
    color: "red.500",
  },

  // Custom actions
  [AUDITLOG.UpdateUrlName]: {
    as: LinkSimple,
    color: "blue.400",
  },
  [AUDITLOG.UpdateLogoOrTitle]: {
    as: TextT,
    color: "blue.400",
  },
  [AUDITLOG.UpdateDescription]: {
    as: TextT,
    color: "blue.400",
  },
  [AUDITLOG.UpdateLogic]: {
    as: PlusMinus,
    color: "blue.400",
  },
  [AUDITLOG.UpdateTheme]: {
    as: PaintBrushBroad,
    color: "blue.400",
  },
}
