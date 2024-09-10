export const MAX_LEVEL = 100
export const MAX_XP = 11e4
export const RANKS = [
  { color: "#78c93d", title: "novice", polygonCount: 20 },
  { color: "#88d525", title: "learner", polygonCount: 20 },
  { color: "#f6ca45", title: "knight", polygonCount: 4 },
  { color: "#78c93d", title: "veteran", polygonCount: 4 },
  { color: "#ec5a53", title: "champion", polygonCount: 4 },
  { color: "#53adf0", title: "hero", polygonCount: 5 },
  { color: "#c385f8", title: "master", polygonCount: 5 },
  { color: "#3e6fc3", title: "grand master", polygonCount: 5 },
  { color: "#be4681", title: "legend", polygonCount: 6 },
  { color: "#000000", title: "mythic", polygonCount: 6 },
  {
    color: "linear-gradient(to left top, #00cbfa, #b9f2ff)",
    title: "???",
    requiredXp: 1e19,
    polygonCount: 6,
  },
] as const
