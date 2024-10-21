export type Proposal = {
  id: string
  title: string
  state: "active" | "pending" | "closed"
  space: { id: string; name: string }
}

export type Space = {
  id: string
  name: string
}
