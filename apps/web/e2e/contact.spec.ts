import { expect, test } from "@playwright/test"

const nameHeading = "What\u2019s your name?"
const thanks = "Got it! I\u2019ll email you as soon as I can."

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("submits the contact wizard", async ({ page }) => {
  await page.goto("/en/contact")

  const form = page.getByRole("form")
  const nameField = form.getByPlaceholder("Jane Doe")
  await expect(nameField).toBeFocused()
  await nameField.fill("Jane Doe")
  await form.getByRole("button", { name: "Next" }).click()

  await expect(
    page.getByRole("heading", { name: "What\u2019s your email?" })
  ).toBeVisible()
  await form.getByPlaceholder("you@example.com").fill("you@example.com")
  await form.getByRole("button", { name: "Next" }).click()

  await expect(
    page.getByRole("heading", { name: "What is this about?" })
  ).toBeVisible()
  await form.getByRole("button", { name: "Hiring" }).click()
  await form.getByRole("button", { name: "Next" }).click()

  await expect(
    page.getByRole("heading", { name: "What would you like to talk about?" })
  ).toBeVisible()
  await form
    .getByPlaceholder("A short note about the role, project, or idea.")
    .fill("A short note about the role, project, or idea.")
  await form.getByRole("button", { name: "Next" }).click()

  await expect(
    page.getByRole("heading", { name: "Does this look right?" })
  ).toBeVisible()
  await expect(form.getByText("Jane Doe")).toBeVisible()
  await expect(form.getByText("you@example.com")).toBeVisible()
  await expect(form.getByText("Hiring", { exact: true })).toBeVisible()
  await expect(
    form.getByText("A short note about the role, project, or idea.")
  ).toBeVisible()
  await form.getByRole("button", { name: "Send" }).click()

  await expect(page.getByText(thanks)).toBeVisible()
})

test("stays on name when the first step is invalid", async ({ page }) => {
  await page.goto("/en/contact")

  const form = page.getByRole("form")
  await expect(form.getByPlaceholder("Jane Doe")).toBeFocused()
  await form.getByRole("button", { name: "Next" }).click()

  await expect(form.getByRole("alert")).toHaveText(
    "Please enter at least 2 characters."
  )
  await expect(page.getByRole("heading", { name: nameHeading })).toBeVisible()
})
