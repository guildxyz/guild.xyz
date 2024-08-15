import { FileError } from "react-dropzone"

export const getWidthAndHeightFromFile = (
  file: File
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const dataURL = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      URL.revokeObjectURL(dataURL)
      resolve({
        width,
        height,
      })
    }
    img.src = dataURL
  })

export const imageDimensionsValidator = (
  file: File & { width?: number; height?: number },
  minW: number,
  minH: number
): FileError | null => {
  const { width = 0, height = 0 } = file

  if (width < minW || height < minH)
    return {
      code: "dimension-too-small",
      message: getDimensionErrorMessage(minW, minH),
    }

  return null
}

export const getDimensionErrorMessage = (minW?: number, minH?: number): string => {
  if (minW && minH) return `Image should be at least ${minW}x${minH}px`
  return `Image ${minW ? "width" : "height"} should be at least ${minW || minH}px`
}

export const convertFilesFromEvent = async (event: any) => {
  // This happens in Chromium after choosing image with click. Event is an array of FileSystemHandle objects
  if (Array.isArray(event)) {
    return await Promise.all(event.map(async (file) => await file.getFile()))
  }

  // This happens on choosing image with drag & drop
  if (event.dataTransfer) return event.dataTransfer.files

  // This happens in Firefox on choosing image with click
  return event.target.files
}
