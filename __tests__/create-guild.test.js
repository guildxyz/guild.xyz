describe("create-guild page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000/create-guild")
    console.log(await page.$$("button.chakra-button"))
    connectButton.click()
  })

  it("should render", async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const elements = await page.$$("span.css-ppre2")
    expect(elements.length).toBeGreaterThan(0)
    elements.forEach((item) => {
      expect(item.toString()).toMatch(/^10x.*$/)
    })
  })
})
