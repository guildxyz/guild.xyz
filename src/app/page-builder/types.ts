export type Item = {
  id: string
  desktop: {
    x: number
    y: number
    width: 1 | 2 | 3 | 6
    height: 1 | 2 | 3 | "AUTO"
  }
  // mobile: {
  //   position: number
  //   width: 1 | 2
  //   height: 1 | 2 | "AUTO"
  // }
  type: "REWARD" | "ROLE" | "PAGE" | "SECTION"
  data: any
}
