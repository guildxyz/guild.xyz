export const smoothScrollTo = (id: string) => {
  const target = document.getElementById(id)

  if (!target) return

  window.scrollTo({
    behavior: "smooth",
    top: target.offsetTop,
  })
}
