import Color from "color"
import { useMemo } from "react"

const lightness = 95
const darkness = 10
const darkSteps = 4
const lightSteps = 5

const LIGHTNESS_STEP = (lightness - 50) / lightSteps
const DARKNESS_STEP = (50 - darkness) / darkSteps

const LIGHT_ROTATE_STEP = 1 / lightSteps
const DARK_ROTATE_STEP = 1 / darkSteps

const LIGHT_SATURATE_STEP = 1 / lightSteps
const DARK_SATURATE_STEP = 1 / darkSteps

const useColorPalette = (
  prefix: string,
  colorCode: string
): { [x: string]: string } =>
  useMemo(() => {
    let color: Color
    try {
      color = Color(colorCode)
    } catch {
      color = Color("#000000")
    }
    return {
      [`--${prefix}-50`]: color
        .lightness(48 + LIGHTNESS_STEP * 5.6)
        .rotate(LIGHT_ROTATE_STEP * 5)
        .saturate(LIGHT_SATURATE_STEP * 10)
        .hex(),
      [`--${prefix}-100`]: color
        .lightness(55 + LIGHTNESS_STEP * 4.6)
        .rotate(LIGHT_ROTATE_STEP * 4)
        .saturate(LIGHT_SATURATE_STEP * 4)
        .hex(),
      [`--${prefix}-200`]: color
        .lightness(54 + LIGHTNESS_STEP * 4)
        .rotate(LIGHT_ROTATE_STEP * 3)
        .saturate(LIGHT_SATURATE_STEP * 3)
        .hex(),
      [`--${prefix}-300`]: color
        .lightness(55 + LIGHTNESS_STEP * 3)
        .rotate(LIGHT_ROTATE_STEP * 2)
        .saturate(LIGHT_SATURATE_STEP * 2)
        .hex(),
      [`--${prefix}-400`]: color
        .lightness(55 + LIGHTNESS_STEP * 2.2)
        .rotate(LIGHT_ROTATE_STEP * 1)
        .saturate(LIGHT_SATURATE_STEP * 1)
        .hex(),
      [`--${prefix}-500`]: color.lightness(55 + LIGHTNESS_STEP).hex(),
      [`--${prefix}-600`]: color.lightness(65 - DARKNESS_STEP * 0.8).hex(),
      [`--${prefix}-700`]: color
        .lightness(60 - DARKNESS_STEP * 1.2)
        .rotate(DARK_ROTATE_STEP * 1)
        .saturate(DARK_SATURATE_STEP * -1)
        .hex(),
      [`--${prefix}-800`]: color
        .lightness(55 - DARKNESS_STEP * 2.4)
        .rotate(DARK_ROTATE_STEP * 3)
        .hex(),
      [`--${prefix}-900`]: color
        .lightness(55 - DARKNESS_STEP * 3.4)
        .rotate(DARK_ROTATE_STEP * 4)
        .saturate(DARK_SATURATE_STEP * 1)
        .hex(),
    }
  }, [prefix, colorCode])

export default useColorPalette
