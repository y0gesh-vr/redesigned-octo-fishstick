    import {expect, Page} from "playwright/test";

    export default async function example(page: Page) {
        await page.goto("https://example.com/");
        await expect(page).toHaveTitle(/Example/);

        await page.getByRole("link", { name: "Learn more" }).click();
        await expect(page.getByRole("heading", { name: "Example" })).toBeVisible();
    }
