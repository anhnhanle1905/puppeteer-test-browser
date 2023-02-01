const puppeteer = require("puppeteer");

async function bootstrap(options = {}) {
  const { devtools = false, slowMo = false, appUrl } = options;
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: [
      "--disable-extensions-except=./keplr-chrome-extension",
      "--load-extension=./keplr-chrome-extension",
    ],
    ...(slowMo && { slowMo }),
  });

  const appPage = await browser.newPage();
  await appPage.goto(appUrl, { waitUntil: "load" });

  const targets = await browser.targets();
  console.log("targets: ", targets);

  const extensionTarget = targets.find(
    (target) => target.type() === "background_page"
  );
  //background_page is selected from targets

  const partialExtensionUrl = extensionTarget.url() || "";

  // const [, , extensionId] = partialExtensionUrl.split("/");

  const extensionId = `dmkamcknogkgcdfhhbddcghachkejeap`;

  const extPage = await browser.newPage();
  const extensionUrl = `chrome-extension://${extensionId}/popup.html`;
  console.log("extensionUrl: ", extensionUrl);
  // const extensionUrl = `chrome-extension://dmkamcknogkgcdfhhbddcghachkejeap/popup.html#/register`;

  await extPage.goto(extensionUrl, { waitUntil: "load" });

  return {
    appPage,
    browser,
    extensionUrl,
    extPage,
  };
}

module.exports = { bootstrap };