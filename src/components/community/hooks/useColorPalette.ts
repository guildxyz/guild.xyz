import Color from "color"
import { useEffect, useState } from "react"

const useColorPalette = (
  prefix: string,
  colorCode: string
): { [x: string]: string } => {
  const [generatedColors, setGeneratedColors] = useState({})

  useEffect(() => {
    const lightness = 95
    const darkness = 10
    const darkSteps = 4
    const lightSteps = 5

    const lightnessStep = (lightness - 50) / lightSteps
    const darknessStep = (50 - darkness) / darkSteps

    const lightRotateStep = 1 / lightSteps
    const darkRotateStep = 1 / darkSteps

    const lightSaturateStep = 1 / lightSteps
    const darkSaturateStep = 1 / darkSteps

    const swatches = {
      [`--${prefix}-50`]: Color(colorCode)
        .lightness(48 + lightnessStep * 5.6)
        .rotate(lightRotateStep * 5)
        .saturate(lightSaturateStep * 10)
        .hex(),
      [`--${prefix}-100`]: Color(colorCode)
        .lightness(55 + lightnessStep * 4.6)
        .rotate(lightRotateStep * 4)
        .saturate(lightSaturateStep * 4)
        .hex(),
      [`--${prefix}-200`]: Color(colorCode)
        .lightness(54 + lightnessStep * 4)
        .rotate(lightRotateStep * 3)
        .saturate(lightSaturateStep * 3)
        .hex(),
      [`--${prefix}-300`]: Color(colorCode)
        .lightness(55 + lightnessStep * 3)
        .rotate(lightRotateStep * 2)
        .saturate(lightSaturateStep * 2)
        .hex(),
      [`--${prefix}-400`]: Color(colorCode)
        .lightness(55 + lightnessStep * 2.2)
        .rotate(lightRotateStep * 1)
        .saturate(lightSaturateStep * 1)
        .hex(),
      [`--${prefix}-500`]: Color(colorCode)
        .lightness(55 + lightnessStep)
        .hex(),
      [`--${prefix}-600`]: Color(colorCode)
        .lightness(65 - darknessStep * 0.8)
        .hex(),
      [`--${prefix}-700`]: Color(colorCode)
        .lightness(60 - darknessStep * 1.2)
        .rotate(darkRotateStep * 1)
        .saturate(darkSaturateStep * -1)
        .hex(),
      [`--${prefix}-800`]: Color(colorCode)
        .lightness(55 - darknessStep * 2.4)
        .rotate(darkRotateStep * 3)
        .hex(),
      [`--${prefix}-900`]: Color(colorCode)
        .lightness(55 - darknessStep * 3.4)
        .rotate(darkRotateStep * 4)
        .saturate(darkSaturateStep * 1)
        .hex(),
    }

    setGeneratedColors(swatches)
  }, [prefix, colorCode])

  return generatedColors
}

export default useColorPalette
