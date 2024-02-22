import { Item } from "pages/page-builder"
import { describe, expect, test } from "vitest"
import move from "./pageBuilder"

describe("DESKTOP", () => {
  test("Moving a 1x1 card from (1,1) to (2,1) - no colliding items", () => {
    const GRID: Item[] = [
      {
        id: "card",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card",
        type: "ROLE",
        data: {},
        desktop: {
          width: 1,
          height: 1,
          x: 2,
          y: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 1,
      height: 1,
      x: 2,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 1x1 card from (1,1) to (2,1) - but a 1x1 card is already placed at (2,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 2,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 2,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 1,
      height: 1,
      x: 2,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 1x1 card from (1,1) to (6,1) - but a 1x1 card is already placed at (6,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 6,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 6,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 2,
          width: 1,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 1,
      height: 1,
      x: 6,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 2x1 card from (1,1) to (2,1) - but a 1x1 card is already placed at (3,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 2,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 2,
          y: 1,
          width: 2,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 2,
      height: 1,
      x: 2,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 2x1 card from (3,1) to (4,1) - but a 2x1 card is already placed at (5,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 1,
          width: 2,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 5,
          y: 1,
          width: 2,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 2,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 2,
          width: 2,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 2,
      height: 1,
      x: 4,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 1x1 card from (2,1) to (1,1) - a 1x1 card is already placed at (1,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 2,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 2,
          y: 1,
          width: 1,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[1], {
      width: 1,
      height: 1,
      x: 1,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 1x1 card from (3,1) to (4,1) - a 3x2 card is already at (4,1)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 3,
          height: 2,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 2,
          width: 3,
          height: 2,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 1,
      height: 1,
      x: 4,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })

  test("Moving a 1x1 card from (3,1) to (4,1) - a 3x2 card is already at (4,1) & a 1x1 card is at (3,3)", () => {
    const GRID: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 3,
          height: 2,
        },
      },
      {
        id: "card3",
        type: "ROLE",
        data: {},
        desktop: {
          x: 3,
          y: 3,
          width: 1,
          height: 1,
        },
      },
    ]

    const EXPECTED_OUTPUT: Item[] = [
      {
        id: "card1",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 1,
          width: 1,
          height: 1,
        },
      },
      {
        id: "card2",
        type: "ROLE",
        data: {},
        desktop: {
          x: 1,
          y: 2,
          width: 3,
          height: 2,
        },
      },
      {
        id: "card3",
        type: "ROLE",
        data: {},
        desktop: {
          x: 4,
          y: 3,
          width: 1,
          height: 1,
        },
      },
    ]

    move(GRID, GRID[0], {
      width: 1,
      height: 1,
      x: 4,
      y: 1,
    })

    expect(GRID).toEqual(EXPECTED_OUTPUT)
  })
})
