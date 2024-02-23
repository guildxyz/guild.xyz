const useIsIOS = () =>
  typeof navigator !== "undefined" &&
  typeof window !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream

declare global {
  interface Window {
    MSStream: unknown
  }
}

export default useIsIOS
