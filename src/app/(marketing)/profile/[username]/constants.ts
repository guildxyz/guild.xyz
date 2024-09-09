export const MAX_LEVEL = 100
export const RANKS = [
  { color: "#78c93d", title: "novice", requiredXp: 0, polygonCount: 20 },
  { color: "#88d525", title: "learner", requiredXp: 1e2, polygonCount: 20 },
  { color: "#f6ca45", title: "knight", requiredXp: 1e3, polygonCount: 4 },
  { color: "#78c93d", title: "veteran", requiredXp: 1e4, polygonCount: 4 },
  { color: "#ec5a53", title: "champion", requiredXp: 1e6, polygonCount: 4 },
  { color: "#53adf0", title: "hero", requiredXp: 1e8, polygonCount: 5 },
  { color: "#c385f8", title: "master", requiredXp: 1e9, polygonCount: 5 },
  { color: "#3e6fc3", title: "grand master", requiredXp: 1e11, polygonCount: 5 },
  { color: "#be4681", title: "legend", requiredXp: 1e12, polygonCount: 6 },
  { color: "#000000", title: "mythic", requiredXp: 1e13, polygonCount: 6 },
  {
    color: "linear-gradient(to left top, #00cbfa, #b9f2ff)",
    title: "???",
    requiredXp: 1e19,
    polygonCount: 6,
  },
] as const
