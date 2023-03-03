const { useEffect } = require("react");
const { bootstrap } = require("./bootstrap");
const stakeValueTest = 1;
const unstakeValueTest = 1;
const addLiquidityValueTest = 1;
const withdrawLiquidityValueTest = 1;

describe("Test flow Liquid Finance app", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({
      appUrl: "http://localhost:3000/" /*, slowMo: 50, devtools: true*/,
    });

    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Connect wallet flow */
  describe("Test flow connect wallet with Keplr wallet extension", () => {
    it("should click button Import exists account", async () => {
      //button Import exists account
      const importExistsAccountButton = await extPage.$(
        ".btn-block:nth-child(5)"
      );
      await importExistsAccountButton.click();
    });

    it("should fill in information for 12 mnemonics word", async () => {
      const mnemonicWordInput1 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(1) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput1.type("burden");

      const mnemonicWordInput2 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(2) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput2.type("alley");

      const mnemonicWordInput3 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(3) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput3.type("test");

      const mnemonicWordInput4 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(4) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput4.type("mad");

      const mnemonicWordInput5 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(5) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput5.type("mind");

      const mnemonicWordInput6 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(6) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput6.type("dry");

      const mnemonicWordInput7 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(7) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput7.type("cradle");

      const mnemonicWordInput8 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(8) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput8.type("busy");

      const mnemonicWordInput9 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(9) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput9.type("there");

      const mnemonicWordInput10 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(10) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput10.type("vast");

      const mnemonicWordInput11 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(11) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput11.type("mix");

      const mnemonicWordInput12 = await extPage.$(
        ".mnemonic-word-container-1RmztzrkGoAxhL0xjcxz9y:nth-child(12) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await mnemonicWordInput12.type("circle");
    });

    it("should fill in your account information", async () => {
      const accountNameInput = await extPage.$(
        ".form-inner-container-1OFu9k06LiZAc8a8NY7ICA .form-group:nth-child(1) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await accountNameInput.type("test");

      const newPasswordInput = await extPage.$(
        ".form-inner-container-1OFu9k06LiZAc8a8NY7ICA .form-group:nth-child(2) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await newPasswordInput.type("12345678");

      const confirmPasswordInput = await extPage.$(
        ".form-inner-container-1OFu9k06LiZAc8a8NY7ICA .form-group:nth-child(3) .input-3D4RiQgfsq6CVDibN-Ssyh"
      );
      await confirmPasswordInput.type("12345678");

      const nextButton = await extPage.$(
        ".form-inner-container-1OFu9k06LiZAc8a8NY7ICA .btn-block"
      );
      await nextButton.click();
    });

    it("should click button next for confirm", async () => {
      const nextButton = await extPage.$(
        ".form-inner-container-1OFu9k06LiZAc8a8NY7ICA .btn-block"
      );
      await nextButton.click();
    });

    it("should click button done to complete the test with the Keplr extension", async () => {
      const doneButton = await extPage.$(
        ".container-2r_sTVfDeimjo0VLAYOa4O .btn-block"
      );
      await doneButton.click();

      await appPage.bringToFront();
      await extPage.close();
    });

    it("should click button connect wallet", async () => {
      const connectWalletButton = await appPage.$(".btn-connect-wallet");
      await connectWalletButton.click();
    });

    it("should click button arch", async () => {
      await sleep(2000);
      // const archBtn = await appPage.$(".iwqrYX .gbRZrU:nth-child(1)");
      // appPage.waitForTimeout(2000);

      const archBtn = await appPage.$(".btn-arch-wallet");
      await archBtn.click();
    });

    it("should click button approve request connection", async () => {
      await sleep(5000);
      const pageList = await browser.pages();
      const newPage = await pageList[pageList.length - 1];

      const isDisable = (await newPage.$("button[disable]")) !== null;
      console.log("isDisable: ", isDisable);

      const approveButton = await newPage.$(
        ".buttons-2nWpBrAPFoUYGbfor3EQeg .btn-primary"
      );
      await approveButton.click();

      // const enabledButton = await newPage.$(
      //   ".buttons-2nWpBrAPFoUYGbfor3EQeg .btn-primary:not([disabled])"
      // );
      // const isEnabled = enabledButton !== null;
      // console.log("isEnabled: ", isEnabled);
      // newPage.waitForSelector("button:not[disabled]").then(async () => {
      //   const approveButton = await newPage.$(
      //     ".buttons-2nWpBrAPFoUYGbfor3EQeg .btn-primary"
      //   );
      //   await approveButton.click();
      //   console.log("oke");
      // });
    });

    // it("should click button approve add Constantine Testnet", async () => {
    //   await sleep(5000);
    //   const pageList = await browser.pages();
    //   const newPage = await pageList[pageList.length - 1];

    //   const approveButton = await newPage.$(
    //     ".buttons-3kLWXpIpnbFout9JI1D6BJ .btn-primary"
    //   );
    //   await approveButton.click();
    // });
  });

  /** Stake flow */
  // describe("Test flow Stake feature in Liquid Finance app", () => {
  //   it("should click button Number Input", async () => {
  //     await sleep(5000);
  //     const numberInput = await appPage.$(".number-input");
  //     await numberInput.type(`${stakeValueTest}`);
  //   });

  //   it("should click button Stake", async () => {
  //     await sleep(1000);
  //     const btnStake = await appPage.$(".btn-stake");
  //     await btnStake.click();
  //   });

  //   it("should click button Stake Confirm Modal", async () => {
  //     await sleep(1000);
  //     const btnStakeConfirmModal = await appPage.$(".btn-stake-confirm-modal");
  //     await btnStakeConfirmModal.click();
  //   });

  //   it("should click button approve Staking ARCH", async () => {
  //     await sleep(7000);
  //     const pageList = await browser.pages();
  //     const newPage = await pageList[pageList.length - 1];

  //     const approveButton = await newPage.$(
  //       ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //     );
  //     await approveButton.click();
  //   });

  //   it("should check the result Stake is correct", async () => {
  //     /**
  //      * Prev Balance  = Next Balance  + ARCH Stake Balance + Fee Transaction
  //      *
  //      * Check the accuracy of the results by comparing the following:
  //      * Prev Balance > Next Balance + ARCH Stake Balance
  //      *
  //      */
  //     const prevBalanceARCH = await appPage.$(".balance-arch");
  //     const prevBalanceARCHText = await prevBalanceARCH.evaluate(
  //       (e) => e.innerText
  //     );

  //     await sleep(12000);

  //     const newBalanceARCH = await appPage.$(".balance-arch");
  //     const newBalanceARCHText = await newBalanceARCH.evaluate(
  //       (e) => e.innerText
  //     );

  //     const table = {
  //       prevBalanceARCHText: parseFloat(prevBalanceARCHText),
  //       stakeValueTest: stakeValueTest,
  //       newBalanceARCHText: parseFloat(newBalanceARCHText),
  //     };

  //     console.log("Stake:");
  //     console.table(table);

  //     expect(parseFloat(prevBalanceARCHText)).toBeGreaterThan(
  //       parseFloat(newBalanceARCHText) + stakeValueTest
  //     );
  //   });
  // });

  // /** Unstake flow */
  // describe("Test flow Unstake feature in Liquid Finance app", () => {
  //   it("should click button Unstake in header tab", async () => {
  //     await sleep(7000);
  //     const unstakeHeaderTab = await appPage.$(".header-tab:nth-child(2)");
  //     await unstakeHeaderTab.click();
  //   });

  //   describe("Test flow Instant Unstake feature in Unstake feature", () => {
  //     it("should click button Number Input", async () => {
  //       await sleep(1000);
  //       const numberInput = await appPage.$(".number-input");
  //       await numberInput.type(`${unstakeValueTest}`);
  //     });

  //     it("should click button Unstake now", async () => {
  //       await sleep(1000);
  //       const btnUnstakeNow = await appPage.$(".btn-unstake-now");
  //       await btnUnstakeNow.click();
  //     });

  //     it("should click button Unstake Confirm Modal", async () => {
  //       await sleep(1000);
  //       const btnUnstakeConfirmModal = await appPage.$(
  //         ".btn-unstake-confirm-modal"
  //       );
  //       await btnUnstakeConfirmModal.click();
  //     });

  //     it("should click button approve instant unstake", async () => {
  //       await sleep(7000);
  //       const pageList = await browser.pages();
  //       const newPage = await pageList[pageList.length - 1];
  //       const approveButton = await newPage.$(
  //         ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //       );
  //       await approveButton.click();
  //     });
  //     it("should check the result Instant Unstake is correct", async () => {
  //       /**
  //        * Prev Balance  = Next Balance  + sARCH Unstake Balance
  //        *
  //        * Check the accuracy of the results by comparing the following:
  //        * Prev Balance = Next Balance  + sARCH Unstake Balance
  //        *
  //        */
  //       const prevBalanceSARCH = await appPage.$(".balance-sarch");
  //       const prevBalanceSARCHText = await prevBalanceSARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       await sleep(12000);

  //       const newBalanceSARCH = await appPage.$(".balance-sarch");
  //       const newBalanceSARCHText = await newBalanceSARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       const table = {
  //         prevBalanceSARCHText: parseFloat(prevBalanceSARCHText.slice(0, -1)),
  //         unstakeValueTest: unstakeValueTest,
  //         newBalanceSARCHText: parseFloat(newBalanceSARCHText.slice(0, -1)),
  //       };
  //       console.log("Instant Unstake:");
  //       console.table(table);

  //       expect(parseFloat(prevBalanceSARCHText.slice(0, -1))).toEqual(
  //         parseFloat(newBalanceSARCHText.slice(0, -1)) + unstakeValueTest
  //       );
  //     });
  //   });

  //   describe("Test flow Unstake in ~21 days feature in Unstake feature", () => {
  //     it("should click unstake in 21 days card", async () => {
  //       const delayedUnstakeCard = await appPage.$(".delayed-unstake-card");
  //       await delayedUnstakeCard.click();
  //     });
  //     it("should click button Number Input", async () => {
  //       await sleep(1000);
  //       const numberInput = await appPage.$(".number-input");
  //       await numberInput.type(`${unstakeValueTest}`);
  //     });

  //     it("should click button Start Delayed Unstake", async () => {
  //       const btnUnstakeNow = await appPage.$(".btn-unstake-now");
  //       await btnUnstakeNow.click();
  //     });

  //     it("should click button Unstake Confirm Modal", async () => {
  //       await sleep(1000);
  //       const btnUnstakeConfirmModal = await appPage.$(
  //         ".btn-unstake-confirm-modal"
  //       );
  //       await btnUnstakeConfirmModal.click();
  //     });

  //     it("should click button approve delayed unstake", async () => {
  //       await sleep(10000);
  //       const pageList = await browser.pages();
  //       const newPage = await pageList[pageList.length - 1];
  //       const approveButton = await newPage.$(
  //         ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //       );
  //       await approveButton.click();
  //     });

  //     it("should check the result Unstake in ~21 days is correct", async () => {
  //       /**
  //        * Prev Balance  = Next Balance  + sARCH Unstake Balance
  //        *
  //        * Check the accuracy of the results by comparing the following:
  //        * Prev Balance  = Next Balance  + sARCH Unstake Balance
  //        *
  //        */
  //       const prevBalanceSARCH = await appPage.$(".balance-sarch");
  //       const prevBalanceSARCHText = await prevBalanceSARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       await sleep(12000);

  //       const newBalanceSARCH = await appPage.$(".balance-sarch");
  //       const newBalanceSARCHText = await newBalanceSARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       const table = {
  //         prevBalanceSARCHText: parseFloat(prevBalanceSARCHText),
  //         unstakeValueTest: unstakeValueTest,
  //         newBalanceSARCHText: parseFloat(newBalanceSARCHText),
  //       };
  //       console.log("Unstake in ~21 days:");
  //       console.table(table);

  //       expect(parseFloat(prevBalanceSARCHText)).toEqual(
  //         parseFloat(newBalanceSARCHText) + parseFloat(unstakeValueTest)
  //       );
  //     });
  //   });
  // });

  // /** Queue flow */
  // describe("Test flow Queue feature in Liquid Finance app", () => {
  //   it("should click button Queue in header tab", async () => {
  //     await sleep(7000);
  //     const unstakeHeaderTab = await appPage.$(".header-tab:nth-child(3)");
  //     await unstakeHeaderTab.click();
  //   });

  //   describe("Test flow Add Liquidity feature", () => {
  //     it("should click button Number Input", async () => {
  //       await sleep(1000);
  //       const numberInput = await appPage.$(".number-input");
  //       await numberInput.type(`${addLiquidityValueTest}`);
  //     });

  //     it("should click button Add Liquidity", async () => {
  //       await sleep(1000);
  //       const btnAddLiquidity = await appPage.$(".btn-add-liquidity");
  //       await btnAddLiquidity.click();
  //     });
  //     it("should click button Confirm", async () => {
  //       await sleep(1000);
  //       const btnConfirm = await appPage.$(".btn-confirm");
  //       await btnConfirm.click();
  //     });
  //     it("should click button approve add liquidity", async () => {
  //       await sleep(10000);
  //       const pageList = await browser.pages();
  //       const newPage = await pageList[pageList.length - 1];
  //       const approveButton = await newPage.$(
  //         ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //       );
  //       await approveButton.click();
  //     });
  //     it("should check the result Add Liquidity is correct", async () => {
  //       /**
  //        * Prev Balance  = Next Balance  + ARCH Add Liquidity Balance + Fee Transaction
  //        *
  //        * Check the accuracy of the results by comparing the following:
  //        * Prev Balance > Next Balance + ARCH Add Liquidity Balance
  //        *
  //        */
  //       const prevBalanceARCH = await appPage.$(".balance-arch");
  //       const prevBalanceARCHText = await prevBalanceARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       await sleep(12000);

  //       const newBalanceARCH = await appPage.$(".balance-arch");
  //       const newBalanceARCHText = await newBalanceARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       const table = {
  //         prevBalanceARCHText: parseFloat(prevBalanceARCHText),
  //         addLiquidityValueTest: addLiquidityValueTest,
  //         newBalanceARCHText: parseFloat(newBalanceARCHText),
  //       };
  //       console.log("Add liquidity:");
  //       console.table(table);

  //       expect(parseFloat(prevBalanceARCHText)).toBeGreaterThan(
  //         parseFloat(newBalanceARCHText) + parseFloat(addLiquidityValueTest)
  //       );
  //     });
  //   });
  //   describe("Test flow Withdraw Liquidity feature", () => {
  //     it("should click button Withdraw", async () => {
  //       await sleep(12000);
  //       const btnWithdraw = await appPage.$(".btn-withdraw");
  //       await btnWithdraw.click();
  //     });
  //     it("should click button Withdraw confirm modal", async () => {
  //       await sleep(1000);
  //       const btnWithdraw = await appPage.$(".btn-withdraw-confirm-modal");
  //       await btnWithdraw.click();
  //     });
  //     it("should click button approve withdraw liquidity", async () => {
  //       await sleep(10000);
  //       const pageList = await browser.pages();
  //       const newPage = await pageList[pageList.length - 1];
  //       const approveButton = await newPage.$(
  //         ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //       );
  //       await approveButton.click();
  //     });
  //     it("should check the result Withdraw Liquidity is correct", async () => {
  //       /**
  //        * New ARCH Balance  = Prev ARCH Balance  + ARCH Withdraw Liquidity Balance - Fee Transaction
  //        *
  //        * Check the accuracy of the results by comparing the following:
  //        * New ARCH Balance > Prev ARCH Balance &&
  //        * New ARCH Balance < Prev ARCH Balance  + ARCH Withdraw Liquidity Balance &&
  //        * New ARCH Balance = 0
  //        *
  //        */
  //       const prevBalanceARCH = await appPage.$(".balance-arch");
  //       const prevBalanceARCHText = await prevBalanceARCH.evaluate(
  //         (e) => e.innerText
  //       );

  //       const yourArchSupplyBalance = await appPage.$(
  //         ".your-arch-supply-balance"
  //       );
  //       const yourArchSupplyBalanceText = await yourArchSupplyBalance.evaluate(
  //         (e) => e.innerText
  //       );

  //       await sleep(12000);

  //       const newBalanceARCH = await appPage.$(".balance-arch");
  //       const newBalanceARCHText = await newBalanceARCH.evaluate(
  //         (e) => e.innerText
  //       );
  //       const newYourArchSupplyBalance = await appPage.$(
  //         ".your-arch-supply-balance"
  //       );
  //       const newYourArchSupplyBalanceText =
  //         await newYourArchSupplyBalance.evaluate((e) => e.innerText);

  //       const table = {
  //         prevBalanceARCHText: parseFloat(prevBalanceARCHText),
  //         archWithdrawLiquidityBalance: parseFloat(yourArchSupplyBalanceText),
  //         newBalanceARCHText: parseFloat(newBalanceARCHText),
  //         newYourArchSupplyBalanceText: parseFloat(
  //           newYourArchSupplyBalanceText
  //         ),
  //       };
  //       console.log("Withdraw liquidity:");
  //       console.table(table);

  //       expect(parseFloat(newBalanceARCHText)).toBeGreaterThan(
  //         parseFloat(prevBalanceARCHText)
  //       );

  //       expect(parseFloat(newBalanceARCHText)).toBeLessThan(
  //         parseFloat(prevBalanceARCHText) +
  //           parseFloat(yourArchSupplyBalanceText)
  //       );

  //       expect(parseFloat(newYourArchSupplyBalanceText)).toEqual(0);
  //     });
  //   });

  //   describe("Test flow Compound feature", () => {
  //     it("should click button Withdraw", async () => {
  //       await sleep(10000);
  //       const toggleCompound = await appPage.$("#toggle-expert-mode-button");
  //       await toggleCompound.click();
  //     });
  //     describe("Test flow Add Liquidity feature", () => {
  //       it("should click button Number Input", async () => {
  //         await sleep(1000);
  //         const numberInput = await appPage.$(".number-input");
  //         await numberInput.type(`${addLiquidityValueTest}`);
  //       });

  //       it("should click button Add Liquidity", async () => {
  //         await sleep(1000);
  //         const btnAddLiquidity = await appPage.$(".btn-add-liquidity");
  //         await btnAddLiquidity.click();
  //       });
  //       it("should click button Confirm", async () => {
  //         await sleep(1000);
  //         const btnConfirm = await appPage.$(".btn-confirm");
  //         await btnConfirm.click();
  //       });
  //       it("should click button approve add liquidity", async () => {
  //         await sleep(10000);
  //         const pageList = await browser.pages();
  //         const newPage = await pageList[pageList.length - 1];
  //         const approveButton = await newPage.$(
  //           ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //         );
  //         await approveButton.click();
  //       });
  //       it("should check the result Add Liquidity is correct", async () => {
  //         /**
  //          * Prev Balance  = Next Balance  + ARCH Add Liquidity Balance + Fee Transaction
  //          *
  //          * Check the accuracy of the results by comparing the following:
  //          * Prev Balance > Next Balance + ARCH Add Liquidity Balance
  //          *
  //          */
  //         const prevBalanceARCH = await appPage.$(".balance-arch");
  //         const prevBalanceARCHText = await prevBalanceARCH.evaluate(
  //           (e) => e.innerText
  //         );

  //         await sleep(12000);

  //         const newBalanceARCH = await appPage.$(".balance-arch");
  //         const newBalanceARCHText = await newBalanceARCH.evaluate(
  //           (e) => e.innerText
  //         );

  //         const table = {
  //           prevBalanceARCHText: parseFloat(prevBalanceARCHText),
  //           addLiquidityValueTest: addLiquidityValueTest,
  //           newBalanceARCHText: parseFloat(newBalanceARCHText),
  //         };
  //         console.log("Add liquidity in Compound: ");
  //         console.table(table);

  //         expect(parseFloat(prevBalanceARCHText)).toBeGreaterThan(
  //           parseFloat(newBalanceARCHText) + parseFloat(addLiquidityValueTest)
  //         );
  //       });
  //     });
  //     describe("Test flow Withdraw Liquidity feature", () => {
  //       it("should click button Withdraw", async () => {
  //         await sleep(12000);
  //         const btnWithdraw = await appPage.$(".btn-withdraw");
  //         await btnWithdraw.click();
  //       });
  //       it("should click button Number Input", async () => {
  //         await sleep(1000);
  //         const numberInput = await appPage.$(".number-input");
  //         await numberInput.type(`${withdrawLiquidityValueTest}`);
  //       });
  //       it("should click button Withdraw confirm modal", async () => {
  //         await sleep(1000);
  //         const btnWithdraw = await appPage.$(".btn-withdraw-confirm-modal");
  //         await btnWithdraw.click();
  //       });
  //       it("should click button approve withdraw liquidity", async () => {
  //         await sleep(10000);
  //         const pageList = await browser.pages();
  //         const newPage = await pageList[pageList.length - 1];
  //         const approveButton = await newPage.$(
  //           ".buttons-3vrCU9UlYWfCD3LBM3zLtL .btn-primary"
  //         );
  //         await approveButton.click();
  //       });
  //     });
  //     it("should check the result Withdraw Liquidity is correct", async () => {
  //       /**
  //        * Prev ARCH Balance = New ARCH Balance + ARCH Withdraw Liquidity Balance - Fee Transaction
  //        *
  //        * Check the accuracy of the results by comparing the following:
  //        * Prev ARCH Supply Balance = New ARCH Supply Balance + withdrawLiquidityValueTest
  //        *
  //        *
  //        */

  //       const prevYourArchSupplyBalance = await appPage.$(
  //         ".your-arch-supply-balance"
  //       );
  //       const prevYourArchSupplyBalanceText =
  //         await prevYourArchSupplyBalance.evaluate((e) => e.innerText);

  //       await sleep(12000);

  //       const newYourArchSupplyBalance = await appPage.$(
  //         ".your-arch-supply-balance"
  //       );
  //       const newYourArchSupplyBalanceText =
  //         await newYourArchSupplyBalance.evaluate((e) => e.innerText);

  //       const table = {
  //         prevYourArchSupplyBalanceText: parseFloat(
  //           prevYourArchSupplyBalanceText.slice(0, -1)
  //         ),
  //         withdrawLiquidityValueTest: parseFloat(withdrawLiquidityValueTest),
  //         newYourArchSupplyBalanceText: parseFloat(
  //           newYourArchSupplyBalanceText.slice(0, -1)
  //         ),
  //       };
  //       console.log("Withdraw liquidity in Compound: ");
  //       console.table(table);

  //       expect(parseFloat(prevYourArchSupplyBalanceText.slice(0, -1))).toEqual(
  //         parseFloat(newYourArchSupplyBalanceText.slice(0, -1)) +
  //           parseFloat(withdrawLiquidityValueTest)
  //       );
  //     });
  //   });
  // });

  // afterAll(async () => {
  //   await browser.close();
  // });
});
