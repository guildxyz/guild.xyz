import { JoinState } from "../../utils/mapAccessJobState"

export const progressTitle = {
  role: "Get roles",
  reward: "Get rewards",
  requirement: "Satisfy the requirements",
}

export const JOIN_LOADING_TEXTS: Record<
  Exclude<JoinState["state"], "FINISHED" | "NO_ACCESS">,
  [string, string]
> = {
  INITIAL: ["Preparing access check", null],
  PREPARING: [
    "Preparing access check",
    "There are a lot of users joining right now, so you have to wait a bit. There are POSITION users ahead of you. Feel free to close the site and come back later!",
  ],
  CHECKING: [
    null,
    "Waiting to check the next one, there are POSITION users ahead of you. Feel free to close the site and come back later!",
  ],
  MANAGING_ROLES: [
    "Evaluating which roles you have access to",
    "There are a lot of users joining right now, so you have to wait a bit. There are POSITION users ahead of you. Feel free to close the site and come back later!",
  ],
  MANAGING_REWARDS: [
    "Evaluating which rewards you will get",
    "There are a lot of users joining right now, so you have to wait a bit. There are POSITION users ahead of you. Feel free to close the site and come back later!",
  ],
}
