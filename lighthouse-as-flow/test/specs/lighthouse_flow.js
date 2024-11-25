import { browser, expect } from "@wdio/globals";

import { startFlow, desktopConfig } from "lighthouse/core/index.js";
import { writeFileSync } from "fs";

import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";

describe("Lighthouse flows", () => {
  it("should login with valid credentials using wdio commands", async () => {
    const puppeteer = await browser.getPuppeteer();
    let pages = await puppeteer.pages();
    console.log(pages.length);
    const page = pages[0];
    const flow = await startFlow(page, { config: desktopConfig });
    await LoginPage.open();
    await flow.snapshot({ name: "Login Page" });
    await flow.startTimespan({ name: "Login Flow" });
    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveText(
      expect.stringContaining("You logged into a secure area!")
    );
    await flow.endTimespan();
    await flow.snapshot({ name: "Loged In Secure Page" });
    writeFileSync(
      "../html_reports/full-flow-without-puppeteer-report.html",
      await flow.generateReport()
    );
  });
});
