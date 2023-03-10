(window.webpackJsonp = window.webpackJsonp || []).push([
  [8],
  {
    1040: function (e, t) {},
    1156: function (e, t) {},
    1247: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.Keplr = void 0);
      const o = n(4),
        s = n(1248),
        a = n(367),
        d = n(368),
        c = i(n(266)),
        u = i(n(25)),
        l = n(2);
      t.Keplr = class {
        constructor(e, t, n) {
          (this.version = e),
            (this.mode = t),
            (this.requester = n),
            (this.enigmaUtils = new Map()),
            (this.defaultOptions = {});
        }
        enable(e) {
          return r(this, void 0, void 0, function* () {
            "string" == typeof e && (e = [e]),
              yield this.requester.sendMessage(
                o.BACKGROUND_PORT,
                new s.EnableAccessMsg(e)
              );
          });
        }
        disable(e) {
          return r(this, void 0, void 0, function* () {
            "string" == typeof e && (e = [e]),
              yield this.requester.sendMessage(
                o.BACKGROUND_PORT,
                new s.DisableAccessMsg(null != e ? e : [])
              );
          });
        }
        experimentalSuggestChain(e) {
          return r(this, void 0, void 0, function* () {
            if (e.gasPriceStep) {
              const t = Object.assign({}, e.gasPriceStep);
              for (const n of e.feeCurrencies)
                n.gasPriceStep || (n.gasPriceStep = t);
              delete e.gasPriceStep,
                console.warn(
                  "The `gasPriceStep` field of the `ChainInfo` has been moved under `feeCurrencies`. This is automatically handled as of right now, but the upcoming update would potentially cause errors."
                );
            }
            const t = new s.SuggestChainInfoMsg(e);
            yield this.requester.sendMessage(o.BACKGROUND_PORT, t);
          });
        }
        getKey(e) {
          return r(this, void 0, void 0, function* () {
            const t = new s.GetKeyMsg(e);
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, t);
          });
        }
        getChainInfosWithoutEndpoints() {
          return r(this, void 0, void 0, function* () {
            const e = new s.GetChainInfosWithoutEndpointsMsg();
            return (yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              e
            )).chainInfos;
          });
        }
        sendTx(e, t, n) {
          return r(this, void 0, void 0, function* () {
            const r = new s.SendTxMsg(e, t, n);
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, r);
          });
        }
        signAmino(e, t, n, i = {}) {
          var a;
          return r(this, void 0, void 0, function* () {
            const r = new s.RequestSignAminoMsg(
              e,
              t,
              n,
              c.default(
                null !== (a = this.defaultOptions.sign) && void 0 !== a
                  ? a
                  : {},
                i
              )
            );
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, r);
          });
        }
        signDirect(e, t, n, i = {}) {
          var a;
          return r(this, void 0, void 0, function* () {
            const r = new s.RequestSignDirectMsg(
                e,
                t,
                {
                  bodyBytes: n.bodyBytes,
                  authInfoBytes: n.authInfoBytes,
                  chainId: n.chainId,
                  accountNumber: n.accountNumber
                    ? n.accountNumber.toString()
                    : null,
                },
                c.default(
                  null !== (a = this.defaultOptions.sign) && void 0 !== a
                    ? a
                    : {},
                  i
                )
              ),
              d = yield this.requester.sendMessage(o.BACKGROUND_PORT, r);
            return {
              signed: {
                bodyBytes: d.signed.bodyBytes,
                authInfoBytes: d.signed.authInfoBytes,
                chainId: d.signed.chainId,
                accountNumber: u.default.fromString(d.signed.accountNumber),
              },
              signature: d.signature,
            };
          });
        }
        signArbitrary(e, t, n) {
          return r(this, void 0, void 0, function* () {
            let r;
            [n, r] = this.getDataForADR36(n);
            const i = this.getADR36SignDoc(t, n),
              a = new s.RequestSignAminoMsg(e, t, i, { isADR36WithString: r });
            return (yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              a
            )).signature;
          });
        }
        verifyArbitrary(e, t, n, i) {
          return r(this, void 0, void 0, function* () {
            return (
              "string" == typeof n && (n = l.Buffer.from(n)),
              yield this.requester.sendMessage(
                o.BACKGROUND_PORT,
                new s.RequestVerifyADR36AminoSignDoc(e, t, n, i)
              )
            );
          });
        }
        signEthereum(e, t, n, i) {
          return r(this, void 0, void 0, function* () {
            let r;
            [n, r] = this.getDataForADR36(n);
            const a = this.getADR36SignDoc(t, n);
            if ("" === n)
              throw new Error("Signing empty data is not supported.");
            const d = new s.RequestSignAminoMsg(e, t, a, {
                isADR36WithString: r,
                ethSignType: i,
              }),
              c = (yield this.requester.sendMessage(o.BACKGROUND_PORT, d))
                .signature;
            return l.Buffer.from(c.signature, "base64");
          });
        }
        signICNSAdr36(e, t, n, r, i) {
          return this.requester.sendMessage(
            o.BACKGROUND_PORT,
            new s.RequestICNSAdr36SignaturesMsg(e, t, n, r, i)
          );
        }
        getOfflineSigner(e) {
          return new d.CosmJSOfflineSigner(e, this);
        }
        getOfflineSignerOnlyAmino(e) {
          return new d.CosmJSOfflineSignerOnlyAmino(e, this);
        }
        getOfflineSignerAuto(e) {
          return r(this, void 0, void 0, function* () {
            return (yield this.getKey(e)).isNanoLedger
              ? new d.CosmJSOfflineSignerOnlyAmino(e, this)
              : new d.CosmJSOfflineSigner(e, this);
          });
        }
        suggestToken(e, t, n) {
          return r(this, void 0, void 0, function* () {
            const r = new s.SuggestTokenMsg(e, t, n);
            yield this.requester.sendMessage(o.BACKGROUND_PORT, r);
          });
        }
        getSecret20ViewingKey(e, t) {
          return r(this, void 0, void 0, function* () {
            const n = new s.GetSecret20ViewingKey(e, t);
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, n);
          });
        }
        getEnigmaPubKey(e) {
          return r(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.GetPubkeyMsg(e)
            );
          });
        }
        getEnigmaTxEncryptionKey(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.GetTxEncryptionKeyMsg(e, t)
            );
          });
        }
        enigmaEncrypt(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.ReqeustEncryptMsg(e, t, n)
            );
          });
        }
        enigmaDecrypt(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return t && 0 !== t.length
              ? yield this.requester.sendMessage(
                  o.BACKGROUND_PORT,
                  new s.RequestDecryptMsg(e, t, n)
                )
              : new Uint8Array();
          });
        }
        getEnigmaUtils(e) {
          if (this.enigmaUtils.has(e)) return this.enigmaUtils.get(e);
          const t = new a.KeplrEnigmaUtils(e, this);
          return this.enigmaUtils.set(e, t), t;
        }
        experimentalSignEIP712CosmosTx_v0(e, t, n, i, a = {}) {
          var d;
          return r(this, void 0, void 0, function* () {
            const r = new s.RequestSignEIP712CosmosTxMsg_v0(
              e,
              t,
              n,
              i,
              c.default(
                null !== (d = this.defaultOptions.sign) && void 0 !== d
                  ? d
                  : {},
                a
              )
            );
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, r);
          });
        }
        getDataForADR36(e) {
          let t = !1;
          return (
            "string" == typeof e
              ? ((e = l.Buffer.from(e).toString("base64")), (t = !0))
              : (e = l.Buffer.from(e).toString("base64")),
            [e, t]
          );
        }
        getADR36SignDoc(e, t) {
          return {
            chain_id: "",
            account_number: "0",
            sequence: "0",
            fee: { gas: "0", amount: [] },
            msgs: [{ type: "sign/MsgSignData", value: { signer: e, data: t } }],
            memo: "",
          };
        }
        __core__getAnalyticsId() {
          const e = new s.GetAnalyticsIdMsg();
          return this.requester.sendMessage(o.BACKGROUND_PORT, e);
        }
        changeKeyRingName({ defaultName: e, editable: t = !0 }) {
          return r(this, void 0, void 0, function* () {
            const n = new s.ChangeKeyRingNameMsg(e, t);
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, n);
          });
        }
      };
    },
    1248: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1249), t);
    },
    1249: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ChangeKeyRingNameMsg =
          t.GetAnalyticsIdMsg =
          t.GetChainInfosWithoutEndpointsMsg =
          t.GetTxEncryptionKeyMsg =
          t.RequestDecryptMsg =
          t.ReqeustEncryptMsg =
          t.GetPubkeyMsg =
          t.RequestSignDirectMsg =
          t.RequestVerifyADR36AminoSignDoc =
          t.RequestICNSAdr36SignaturesMsg =
          t.RequestSignEIP712CosmosTxMsg_v0 =
          t.RequestSignAminoMsg =
          t.GetSecret20ViewingKey =
          t.SendTxMsg =
          t.SuggestTokenMsg =
          t.SuggestChainInfoMsg =
          t.GetKeyMsg =
          t.DisableAccessMsg =
          t.EnableAccessMsg =
            void 0);
      const r = n(4);
      class i extends r.Message {
        constructor(e) {
          super(), (this.chainIds = e);
        }
        static type() {
          return "enable-access";
        }
        validateBasic() {
          if (!this.chainIds || 0 === this.chainIds.length)
            throw new Error("chain id not set");
        }
        route() {
          return "permission";
        }
        type() {
          return i.type();
        }
      }
      t.EnableAccessMsg = i;
      class o extends r.Message {
        constructor(e) {
          super(), (this.chainIds = e);
        }
        static type() {
          return "disable-access";
        }
        validateBasic() {
          if (!this.chainIds) throw new Error("chain id not set");
        }
        route() {
          return "permission";
        }
        type() {
          return o.type();
        }
      }
      t.DisableAccessMsg = o;
      class s extends r.Message {
        constructor(e) {
          super(), (this.chainId = e);
        }
        static type() {
          return "get-key";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
        }
        route() {
          return "keyring";
        }
        type() {
          return s.type();
        }
      }
      t.GetKeyMsg = s;
      class a extends r.Message {
        constructor(e) {
          super(), (this.chainInfo = e);
        }
        static type() {
          return "suggest-chain-info";
        }
        validateBasic() {
          if (!this.chainInfo) throw new Error("chain info not set");
        }
        route() {
          return "chains";
        }
        type() {
          return a.type();
        }
      }
      t.SuggestChainInfoMsg = a;
      class d extends r.Message {
        constructor(e, t, n) {
          super(),
            (this.chainId = e),
            (this.contractAddress = t),
            (this.viewingKey = n);
        }
        static type() {
          return "suggest-token";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("Chain id is empty");
          if (!this.contractAddress)
            throw new Error("Contract address is empty");
        }
        route() {
          return "tokens";
        }
        type() {
          return d.type();
        }
      }
      t.SuggestTokenMsg = d;
      class c extends r.Message {
        constructor(e, t, n) {
          super(), (this.chainId = e), (this.tx = t), (this.mode = n);
        }
        static type() {
          return "send-tx-to-background";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id is empty");
          if (!this.tx) throw new Error("tx is empty");
          if (
            !this.mode ||
            ("sync" !== this.mode &&
              "async" !== this.mode &&
              "block" !== this.mode)
          )
            throw new Error("invalid mode");
        }
        route() {
          return "background-tx";
        }
        type() {
          return c.type();
        }
      }
      t.SendTxMsg = c;
      class u extends r.Message {
        constructor(e, t) {
          super(), (this.chainId = e), (this.contractAddress = t);
        }
        static type() {
          return "get-secret20-viewing-key";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("Chain id is empty");
          if (!this.contractAddress)
            throw new Error("Contract address is empty");
        }
        route() {
          return "tokens";
        }
        type() {
          return u.type();
        }
      }
      t.GetSecret20ViewingKey = u;
      class l extends r.Message {
        constructor(e, t, n, r = {}) {
          super(),
            (this.chainId = e),
            (this.signer = t),
            (this.signDoc = n),
            (this.signOptions = r);
        }
        static type() {
          return "request-sign-amino";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.signer) throw new Error("signer not set");
          const e = this.signDoc;
          if (
            !(() => {
              if (e && e.msgs && Array.isArray(e.msgs) && 1 === e.msgs.length) {
                return "sign/MsgSignData" === e.msgs[0].type;
              }
              return !1;
            })() &&
            e.chain_id !== this.chainId
          )
            throw new Error(
              "Chain id in the message is not matched with the requested chain id"
            );
          if (!this.signOptions) throw new Error("Sign options are null");
        }
        route() {
          return "keyring";
        }
        type() {
          return l.type();
        }
      }
      t.RequestSignAminoMsg = l;
      class h extends r.Message {
        constructor(e, t, n, r, i) {
          super(),
            (this.chainId = e),
            (this.signer = t),
            (this.eip712 = n),
            (this.signDoc = r),
            (this.signOptions = i);
        }
        static type() {
          return "request-sign-eip-712-cosmos-tx-v0";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.signer) throw new Error("signer not set");
          if (this.signDoc.chain_id !== this.chainId)
            throw new Error(
              "Chain id in the message is not matched with the requested chain id"
            );
          if (!this.signOptions) throw new Error("Sign options are null");
        }
        approveExternal() {
          return !0;
        }
        route() {
          return "keyring";
        }
        type() {
          return h.type();
        }
      }
      t.RequestSignEIP712CosmosTxMsg_v0 = h;
      class p extends r.Message {
        constructor(e, t, n, r, i) {
          super(),
            (this.chainId = e),
            (this.contractAddress = t),
            (this.owner = n),
            (this.username = r),
            (this.addressChainIds = i);
        }
        static type() {
          return "request-icns-adr-36-signatures";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.contractAddress)
            throw new Error("contract address not set");
          if (!this.owner) throw new Error("signer not set");
          if (!this.username) throw new Error("username not set");
          if (!this.addressChainIds || 0 === this.addressChainIds.length)
            throw new Error("address chain ids not set");
        }
        approveExternal() {
          return !0;
        }
        route() {
          return "keyring";
        }
        type() {
          return p.type();
        }
      }
      t.RequestICNSAdr36SignaturesMsg = p;
      class f extends r.Message {
        constructor(e, t, n, r) {
          super(),
            (this.chainId = e),
            (this.signer = t),
            (this.data = n),
            (this.signature = r);
        }
        static type() {
          return "request-verify-adr-36-amino-doc";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.signer) throw new Error("signer not set");
          if (!this.signature) throw new Error("Signature not set");
        }
        route() {
          return "keyring";
        }
        type() {
          return f.type();
        }
      }
      t.RequestVerifyADR36AminoSignDoc = f;
      class g extends r.Message {
        constructor(e, t, n, r = {}) {
          super(),
            (this.chainId = e),
            (this.signer = t),
            (this.signDoc = n),
            (this.signOptions = r);
        }
        static type() {
          return "request-sign-direct";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.signer) throw new Error("signer not set");
          if (!this.signOptions) throw new Error("Sign options are null");
        }
        route() {
          return "keyring";
        }
        type() {
          return g.type();
        }
      }
      t.RequestSignDirectMsg = g;
      class m extends r.Message {
        constructor(e) {
          super(), (this.chainId = e);
        }
        static type() {
          return "get-pubkey-msg";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
        }
        route() {
          return "secret-wasm";
        }
        type() {
          return m.type();
        }
      }
      t.GetPubkeyMsg = m;
      class v extends r.Message {
        constructor(e, t, n) {
          super(),
            (this.chainId = e),
            (this.contractCodeHash = t),
            (this.msg = n);
        }
        static type() {
          return "request-encrypt-msg";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.contractCodeHash)
            throw new Error("contract code hash not set");
          if (!this.msg) throw new Error("msg not set");
        }
        route() {
          return "secret-wasm";
        }
        type() {
          return v.type();
        }
      }
      t.ReqeustEncryptMsg = v;
      class y extends r.Message {
        constructor(e, t, n) {
          super(), (this.chainId = e), (this.cipherText = t), (this.nonce = n);
        }
        static type() {
          return "request-decrypt-msg";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.cipherText || 0 === this.cipherText.length)
            throw new Error("ciphertext not set");
          if (!this.nonce || 0 === this.nonce.length)
            throw new Error("nonce not set");
        }
        route() {
          return "secret-wasm";
        }
        type() {
          return y.type();
        }
      }
      t.RequestDecryptMsg = y;
      class b extends r.Message {
        constructor(e, t) {
          super(), (this.chainId = e), (this.nonce = t);
        }
        static type() {
          return "get-tx-encryption-key-msg";
        }
        validateBasic() {
          if (!this.chainId) throw new Error("chain id not set");
          if (!this.nonce) throw new Error("nonce is null");
        }
        route() {
          return "secret-wasm";
        }
        type() {
          return b.type();
        }
      }
      t.GetTxEncryptionKeyMsg = b;
      class S extends r.Message {
        static type() {
          return "get-chain-infos-without-endpoints";
        }
        validateBasic() {}
        route() {
          return "chains";
        }
        type() {
          return S.type();
        }
      }
      t.GetChainInfosWithoutEndpointsMsg = S;
      class O extends r.Message {
        static type() {
          return "get-analytics-id";
        }
        constructor() {
          super();
        }
        validateBasic() {}
        approveExternal() {
          return !0;
        }
        route() {
          return "analytics";
        }
        type() {
          return O.type();
        }
      }
      t.GetAnalyticsIdMsg = O;
      class _ extends r.Message {
        constructor(e, t) {
          super(), (this.defaultName = e), (this.editable = t);
        }
        static type() {
          return "change-keyring-name-msg";
        }
        validateBasic() {
          if (!this.defaultName) throw new Error("default name not set");
        }
        route() {
          return "keyring";
        }
        type() {
          return _.type();
        }
      }
      t.ChangeKeyRingNameMsg = _;
    },
    1250: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.InjectedKeplr = t.injectKeplrToWindow = void 0);
      const o = n(4),
        s = n(367),
        a = n(368),
        d = i(n(266)),
        c = i(n(25));
      function u(e, t, n) {
        const r = Object.getOwnPropertyDescriptor(e, t);
        !r || r.writable
          ? !r || r.configurable
            ? Object.defineProperty(e, t, { value: n, writable: !1 })
            : (e[t] = n)
          : console.warn(
              `Failed to inject ${t} from keplr. Probably, other wallet is trying to intercept Keplr`
            );
      }
      t.injectKeplrToWindow = function (e) {
        u(window, "keplr", e),
          u(window, "getOfflineSigner", e.getOfflineSigner),
          u(window, "getOfflineSignerOnlyAmino", e.getOfflineSignerOnlyAmino),
          u(window, "getOfflineSignerAuto", e.getOfflineSignerAuto),
          u(window, "getEnigmaUtils", e.getEnigmaUtils);
      };
      class l {
        constructor(
          e,
          t,
          n = {
            addMessageListener: (e) => window.addEventListener("message", e),
            removeMessageListener: (e) =>
              window.removeEventListener("message", e),
            postMessage: (e) => window.postMessage(e, window.location.origin),
          },
          r
        ) {
          (this.version = e),
            (this.mode = t),
            (this.eventListener = n),
            (this.parseMessage = r),
            (this.enigmaUtils = new Map()),
            (this.defaultOptions = {});
          const i = Object.keys(this);
          for (const e of i)
            if (
              ("defaultOptions" !== e &&
                Object.defineProperty(this, e, {
                  value: this[e],
                  writable: !1,
                }),
              "eventListener" === e)
            ) {
              const e = Object.keys(this.eventListener);
              for (const t of e)
                Object.defineProperty(this.eventListener, t, {
                  value: this.eventListener[t],
                  writable: !1,
                });
            }
          const o = Object.getOwnPropertyNames(l.prototype);
          for (const e of o)
            "constructor" !== e &&
              "function" == typeof this[e] &&
              Object.defineProperty(this, e, {
                value: this[e].bind(this),
                writable: !1,
              });
        }
        static startProxy(
          e,
          t = {
            addMessageListener: (e) => window.addEventListener("message", e),
            postMessage: (e) => window.postMessage(e, window.location.origin),
          },
          n
        ) {
          t.addMessageListener((i) =>
            r(this, void 0, void 0, function* () {
              const s = n ? n(i.data) : i.data;
              if (s && "proxy-request" === s.type)
                try {
                  if (!s.id) throw new Error("Empty id");
                  if ("version" === s.method)
                    throw new Error("Version is not function");
                  if ("mode" === s.method)
                    throw new Error("Mode is not function");
                  if ("defaultOptions" === s.method)
                    throw new Error("DefaultOptions is not function");
                  if (!e[s.method] || "function" != typeof e[s.method])
                    throw new Error("Invalid method: " + s.method);
                  if ("getOfflineSigner" === s.method)
                    throw new Error(
                      "GetOfflineSigner method can't be proxy request"
                    );
                  if ("getOfflineSignerOnlyAmino" === s.method)
                    throw new Error(
                      "GetOfflineSignerOnlyAmino method can't be proxy request"
                    );
                  if ("getOfflineSignerAuto" === s.method)
                    throw new Error(
                      "GetOfflineSignerAuto method can't be proxy request"
                    );
                  if ("getEnigmaUtils" === s.method)
                    throw new Error(
                      "GetEnigmaUtils method can't be proxy request"
                    );
                  const n =
                      "signDirect" === s.method
                        ? yield (() =>
                            r(this, void 0, void 0, function* () {
                              const t = s.args[2],
                                n = yield e.signDirect(
                                  s.args[0],
                                  s.args[1],
                                  {
                                    bodyBytes: t.bodyBytes,
                                    authInfoBytes: t.authInfoBytes,
                                    chainId: t.chainId,
                                    accountNumber: t.accountNumber
                                      ? c.default.fromString(t.accountNumber)
                                      : null,
                                  },
                                  s.args[3]
                                );
                              return {
                                signed: {
                                  bodyBytes: n.signed.bodyBytes,
                                  authInfoBytes: n.signed.authInfoBytes,
                                  chainId: n.signed.chainId,
                                  accountNumber:
                                    n.signed.accountNumber.toString(),
                                },
                                signature: n.signature,
                              };
                            }))()
                        : yield e[s.method](...o.JSONUint8Array.unwrap(s.args)),
                    i = {
                      type: "proxy-request-response",
                      id: s.id,
                      result: { return: o.JSONUint8Array.wrap(n) },
                    };
                  t.postMessage(i);
                } catch (e) {
                  const n = {
                    type: "proxy-request-response",
                    id: s.id,
                    result: { error: e.message || e.toString() },
                  };
                  t.postMessage(n);
                }
            })
          );
        }
        requestMethod(e, t) {
          const n = new Uint8Array(8),
            r = Array.from(crypto.getRandomValues(n))
              .map((e) => e.toString(16))
              .join(""),
            i = {
              type: "proxy-request",
              id: r,
              method: e,
              args: o.JSONUint8Array.wrap(t),
            };
          return new Promise((e, t) => {
            const n = (i) => {
              const s = this.parseMessage ? this.parseMessage(i.data) : i.data;
              if (!s || "proxy-request-response" !== s.type) return;
              if (s.id !== r) return;
              this.eventListener.removeMessageListener(n);
              const a = o.JSONUint8Array.unwrap(s.result);
              a
                ? a.error
                  ? t(new Error(a.error))
                  : e(a.return)
                : t(new Error("Result is null"));
            };
            this.eventListener.addMessageListener(n),
              this.eventListener.postMessage(i);
          });
        }
        enable(e) {
          return r(this, void 0, void 0, function* () {
            yield this.requestMethod("enable", [e]);
          });
        }
        disable(e) {
          return r(this, void 0, void 0, function* () {
            yield this.requestMethod("disable", [e]);
          });
        }
        experimentalSuggestChain(e) {
          var t, n;
          return r(this, void 0, void 0, function* () {
            ((null === (t = e.features) || void 0 === t
              ? void 0
              : t.includes("stargate")) ||
              (null === (n = e.features) || void 0 === n
                ? void 0
                : n.includes("no-legacy-stdTx"))) &&
              console.warn(
                "???stargate???, ???no-legacy-stdTx??? feature has been deprecated. The launchpad is no longer supported, thus works without the two features. We would keep the aforementioned two feature for a while, but the upcoming update would potentially cause errors. Remove the two feature."
              ),
              yield this.requestMethod("experimentalSuggestChain", [e]);
          });
        }
        getKey(e) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("getKey", [e]);
          });
        }
        sendTx(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return (
              "length" in t ||
                console.warn(
                  "Do not send legacy std tx via `sendTx` API. We now only support protobuf tx. The usage of legeacy std tx would throw an error in the near future."
                ),
              yield this.requestMethod("sendTx", [e, t, n])
            );
          });
        }
        signAmino(e, t, n, i = {}) {
          var o;
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("signAmino", [
              e,
              t,
              n,
              d.default(
                null !== (o = this.defaultOptions.sign) && void 0 !== o
                  ? o
                  : {},
                i
              ),
            ]);
          });
        }
        signDirect(e, t, n, i = {}) {
          var o;
          return r(this, void 0, void 0, function* () {
            const r = yield this.requestMethod("signDirect", [
                e,
                t,
                {
                  bodyBytes: n.bodyBytes,
                  authInfoBytes: n.authInfoBytes,
                  chainId: n.chainId,
                  accountNumber: n.accountNumber
                    ? n.accountNumber.toString()
                    : null,
                },
                d.default(
                  null !== (o = this.defaultOptions.sign) && void 0 !== o
                    ? o
                    : {},
                  i
                ),
              ]),
              s = r.signed;
            return {
              signed: {
                bodyBytes: s.bodyBytes,
                authInfoBytes: s.authInfoBytes,
                chainId: s.chainId,
                accountNumber: c.default.fromString(s.accountNumber),
              },
              signature: r.signature,
            };
          });
        }
        signArbitrary(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("signArbitrary", [e, t, n]);
          });
        }
        signICNSAdr36(e, t, n, r, i) {
          return this.requestMethod("signICNSAdr36", [e, t, n, r, i]);
        }
        verifyArbitrary(e, t, n, i) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyArbitrary", [e, t, n, i]);
          });
        }
        signEthereum(e, t, n, i) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("signEthereum", [e, t, n, i]);
          });
        }
        getOfflineSigner(e) {
          return new a.CosmJSOfflineSigner(e, this);
        }
        getOfflineSignerOnlyAmino(e) {
          return new a.CosmJSOfflineSignerOnlyAmino(e, this);
        }
        getOfflineSignerAuto(e) {
          return r(this, void 0, void 0, function* () {
            return (yield this.getKey(e)).isNanoLedger
              ? new a.CosmJSOfflineSignerOnlyAmino(e, this)
              : new a.CosmJSOfflineSigner(e, this);
          });
        }
        suggestToken(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("suggestToken", [e, t, n]);
          });
        }
        getSecret20ViewingKey(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("getSecret20ViewingKey", [e, t]);
          });
        }
        getEnigmaPubKey(e) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("getEnigmaPubKey", [e]);
          });
        }
        getEnigmaTxEncryptionKey(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("getEnigmaTxEncryptionKey", [e, t]);
          });
        }
        enigmaEncrypt(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("enigmaEncrypt", [e, t, n]);
          });
        }
        enigmaDecrypt(e, t, n) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("enigmaDecrypt", [e, t, n]);
          });
        }
        getEnigmaUtils(e) {
          if (this.enigmaUtils.has(e)) return this.enigmaUtils.get(e);
          const t = new s.KeplrEnigmaUtils(e, this);
          return this.enigmaUtils.set(e, t), t;
        }
        experimentalSignEIP712CosmosTx_v0(e, t, n, i, o = {}) {
          var s;
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod(
              "experimentalSignEIP712CosmosTx_v0",
              [
                e,
                t,
                n,
                i,
                d.default(
                  null !== (s = this.defaultOptions.sign) && void 0 !== s
                    ? s
                    : {},
                  o
                ),
              ]
            );
          });
        }
        getChainInfosWithoutEndpoints() {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod(
              "getChainInfosWithoutEndpoints",
              []
            );
          });
        }
        __core__getAnalyticsId() {
          return this.requestMethod("__core__getAnalyticsId", []);
        }
        changeKeyRingName({ defaultName: e, editable: t = !0 }) {
          return r(this, void 0, void 0, function* () {
            return yield this.requestMethod("changeKeyRingName", [
              { defaultName: e, editable: t },
            ]);
          });
        }
      }
      t.InjectedKeplr = l;
    },
    1287: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.getEip712TypedDataBasedOnChainId = t.txEventsWithPreOnFulfill =
          void 0);
      const r = n(8);
      t.txEventsWithPreOnFulfill = function (e, t) {
        const n = e
            ? "function" == typeof e
              ? void 0
              : e.onBroadcasted
            : void 0,
          r = e ? ("function" == typeof e ? e : e.onFulfill) : void 0,
          i = t ? ("function" == typeof t ? void 0 : t.onBroadcasted) : void 0,
          o = t ? ("function" == typeof t ? t : t.onFulfill) : void 0;
        if (n || r || i || o)
          return {
            onBroadcasted:
              n || i
                ? (e) => {
                    i && i(e), n && n(e);
                  }
                : void 0,
            onFulfill:
              r || o
                ? (e) => {
                    o && o(e), r && r(e);
                  }
                : void 0,
          };
      };
      t.getEip712TypedDataBasedOnChainId = (e, t) => {
        const n = e.startsWith("injective"),
          { ethChainId: i } = r.EthermintChainIdHelper.parse(e),
          o = {
            types: Object.assign(
              {
                EIP712Domain: [
                  { name: "name", type: "string" },
                  { name: "version", type: "string" },
                  { name: "chainId", type: "uint256" },
                  { name: "verifyingContract", type: "string" },
                  { name: "salt", type: "string" },
                ],
                Tx: [
                  { name: "account_number", type: "string" },
                  { name: "chain_id", type: "string" },
                  { name: "fee", type: "Fee" },
                  { name: "memo", type: "string" },
                  { name: "msgs", type: "Msg[]" },
                  { name: "sequence", type: "string" },
                ],
                Fee: [
                  { name: "feePayer", type: "string" },
                  { name: "amount", type: "Coin[]" },
                  { name: "gas", type: "string" },
                ],
                Coin: [
                  { name: "denom", type: "string" },
                  { name: "amount", type: "string" },
                ],
                Msg: [
                  { name: "type", type: "string" },
                  { name: "value", type: "MsgValue" },
                ],
              },
              t.rlpTypes
            ),
            domain: {
              name: "Cosmos Web3",
              version: "1.0.0",
              chainId: i.toString(),
              verifyingContract: "cosmos",
              salt: "0",
            },
            primaryType: "Tx",
          };
        return n
          ? ((o.types.Tx = [
              ...o.types.Tx,
              { name: "timeout_height", type: "string" },
            ]),
            (o.domain.name = "Injective Web3"),
            (o.domain.chainId = "0x" + i.toString(16)),
            (o.types.Fee = [
              { name: "amount", type: "Coin[]" },
              { name: "gas", type: "string" },
            ]),
            o)
          : o;
      };
    },
    1330: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1969), t),
        i(n(1496), t),
        i(n(1974), t),
        i(n(1497), t),
        i(n(1498), t);
    },
    1340: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.AccountSetBaseSuper = t.AccountSetBase = t.WalletStatus = void 0);
      const o = n(7),
        s = n(29),
        a = n(8);
      var d;
      !(function (e) {
        (e.NotInit = "NotInit"),
          (e.Loading = "Loading"),
          (e.Loaded = "Loaded"),
          (e.NotExist = "NotExist"),
          (e.Rejected = "Rejected");
      })((d = t.WalletStatus || (t.WalletStatus = {})));
      class c {
        constructor(e, t, n, r) {
          (this.eventListener = e),
            (this.chainGetter = t),
            (this.chainId = n),
            (this.opts = r),
            (this._walletVersion = void 0),
            (this._walletStatus = d.NotInit),
            (this._rejectionReason = void 0),
            (this._name = ""),
            (this._bech32Address = ""),
            (this._isNanoLedger = !1),
            (this._isKeystone = !1),
            (this._txTypeInProgress = ""),
            (this.hasInited = !1),
            (this.sendTokenFns = []),
            (this.makeSendTokenTxFns = []),
            (this.handleInit = () => this.init()),
            o.makeObservable(this),
            (this._pubKey = new Uint8Array()),
            r.autoInit && this.init();
        }
        getKeplr() {
          return this.opts.getKeplr();
        }
        registerSendTokenFn(e) {
          this.sendTokenFns.push(e);
        }
        registerMakeSendTokenFn(e) {
          this.makeSendTokenTxFns.push(e);
        }
        enable(e, t) {
          return i(this, void 0, void 0, function* () {
            const n = this.chainGetter.getChain(t);
            this.opts.suggestChain &&
              (this.opts.suggestChainFn
                ? yield this.opts.suggestChainFn(e, n)
                : yield this.suggestChain(e, n)),
              yield e.enable(t);
          });
        }
        suggestChain(e, t) {
          return i(this, void 0, void 0, function* () {
            yield e.experimentalSuggestChain(t.raw);
          });
        }
        *init() {
          if (this.walletStatus === d.NotExist) return;
          this.hasInited ||
            this.eventListener.addEventListener(
              "keplr_keystorechange",
              this.handleInit
            ),
            (this.hasInited = !0),
            (this._walletStatus = d.Loading);
          const e = yield* s.toGenerator(this.getKeplr());
          if (e) {
            this._walletVersion = e.version;
            try {
              yield this.enable(e, this.chainId);
            } catch (e) {
              return (
                console.log(e),
                (this._walletStatus = d.Rejected),
                void (this._rejectionReason = e)
              );
            }
            try {
              const t = yield* s.toGenerator(e.getKey(this.chainId));
              (this._bech32Address = t.bech32Address),
                (this._isNanoLedger = t.isNanoLedger),
                (this._isKeystone = t.isKeystone),
                (this._name = t.name),
                (this._pubKey = t.pubKey),
                (this._walletStatus = d.Loaded);
            } catch (e) {
              console.log(e),
                (this._bech32Address = ""),
                (this._isNanoLedger = !1),
                (this._isKeystone = !1),
                (this._name = ""),
                (this._pubKey = new Uint8Array(0)),
                (this._walletStatus = d.Rejected),
                (this._rejectionReason = e);
            }
            this._walletStatus !== d.Rejected &&
              (this._rejectionReason = void 0);
          } else this._walletStatus = d.NotExist;
        }
        disconnect() {
          (this._walletStatus = d.NotInit),
            (this.hasInited = !1),
            this.eventListener.removeEventListener(
              "keplr_keystorechange",
              this.handleInit
            ),
            (this._bech32Address = ""),
            (this._isNanoLedger = !1),
            (this._isKeystone = !1),
            (this._name = ""),
            (this._pubKey = new Uint8Array(0)),
            (this._rejectionReason = void 0);
        }
        get walletVersion() {
          return this._walletVersion;
        }
        get isReadyToSendTx() {
          return this.walletStatus === d.Loaded && "" !== this.bech32Address;
        }
        get isReadyToSendMsgs() {
          return this.walletStatus === d.Loaded && "" !== this.bech32Address;
        }
        makeSendTokenTx(e, t, n) {
          for (let r = 0; r < this.makeSendTokenTxFns.length; r++) {
            const i = (0, this.makeSendTokenTxFns[r])(e, t, n);
            if (i) return i;
          }
          const r = new s.DenomHelper(t.coinMinimalDenom);
          throw new Error(`Unsupported type of currency (${r.type})`);
        }
        sendToken(e, t, n, r = "", o = {}, a, d) {
          return i(this, void 0, void 0, function* () {
            for (let i = 0; i < this.sendTokenFns.length; i++) {
              const s = this.sendTokenFns[i];
              if (yield s(e, t, n, r, o, a, d)) return;
            }
            const i = new s.DenomHelper(t.coinMinimalDenom);
            throw new Error(`Unsupported type of currency (${i.type})`);
          });
        }
        get walletStatus() {
          return this._walletStatus;
        }
        get rejectionReason() {
          return this._rejectionReason;
        }
        get name() {
          return this._name;
        }
        get bech32Address() {
          return this._bech32Address;
        }
        get pubKey() {
          return this._pubKey.slice();
        }
        get isNanoLedger() {
          return this._isNanoLedger;
        }
        get isKeystone() {
          return this._isKeystone;
        }
        get txTypeInProgress() {
          return this._txTypeInProgress;
        }
        get isSendingMsg() {
          return this.txTypeInProgress;
        }
        get hasEthereumHexAddress() {
          var e, t;
          return (
            null !==
              (t =
                null ===
                  (e = this.chainGetter.getChain(this.chainId).features) ||
                void 0 === e
                  ? void 0
                  : e.includes("eth-address-gen")) &&
            void 0 !== t &&
            t
          );
        }
        get ethereumHexAddress() {
          return "" === this.bech32Address
            ? ""
            : a.Bech32Address.fromBech32(
                this.bech32Address,
                this.chainGetter.getChain(this.chainId).bech32Config
                  .bech32PrefixAccAddr
              ).toHex(!0);
        }
      }
      r([o.observable], c.prototype, "_walletVersion", void 0),
        r([o.observable], c.prototype, "_walletStatus", void 0),
        r([o.observable.ref], c.prototype, "_rejectionReason", void 0),
        r([o.observable], c.prototype, "_name", void 0),
        r([o.observable], c.prototype, "_bech32Address", void 0),
        r([o.observable], c.prototype, "_isNanoLedger", void 0),
        r([o.observable], c.prototype, "_isKeystone", void 0),
        r([o.observable], c.prototype, "_txTypeInProgress", void 0),
        r([o.flow], c.prototype, "init", null),
        r([o.action], c.prototype, "disconnect", null),
        r([o.computed], c.prototype, "isReadyToSendTx", null),
        r([o.computed], c.prototype, "isReadyToSendMsgs", null),
        r([o.computed], c.prototype, "ethereumHexAddress", null),
        (t.AccountSetBase = c);
      class u extends c {
        constructor(...e) {
          super(...e), o.makeObservable(this);
        }
        setTxTypeInProgress(e) {
          this._txTypeInProgress = e;
        }
      }
      r([o.action], u.prototype, "setTxTypeInProgress", null),
        (t.AccountSetBaseSuper = u);
    },
    1341: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.BondStatus = void 0),
        (function (e) {
          (e.Unbonded = "Unbonded"),
            (e.Unbonding = "Unbonding"),
            (e.Bonded = "Bonded"),
            (e.Unspecified = "Unspecified");
        })(t.BondStatus || (t.BondStatus = {}));
    },
    1342: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.HasMapStore = void 0);
      const i = n(7);
      class o {
        constructor(e) {
          (this.creater = e), (this.map = new Map()), i.makeObservable(this);
        }
        get(e) {
          if (!this.map.has(e)) {
            const t = this.creater(e);
            i.runInAction(() => {
              this.map.set(e, t);
            });
          }
          return this.map.get(e);
        }
        has(e) {
          return this.map.has(e);
        }
      }
      r([i.observable.shallow], o.prototype, "map", void 0),
        (t.HasMapStore = o);
    },
    1343: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableCosmwasmContractChainQuery = void 0);
      const i = n(91),
        o = n(2),
        s = n(7);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, a.getUrlFromObj(r, i)),
            (this.contractAddress = r),
            (this.obj = i);
        }
        onStart() {
          return (
            super.onStart(),
            new Promise((e) => {
              this.disposer = s.autorun(() => {
                const t = this.chainGetter.getChain(this.chainId);
                t.features && t.features.includes("wasmd_0.24+")
                  ? this.url.startsWith("/wasm/v1/") &&
                    this.setUrl("/cosmwasm" + this.url)
                  : this.url.startsWith("/cosmwasm/") &&
                    this.setUrl("" + this.url.replace("/cosmwasm", "")),
                  e();
              });
            })
          );
        }
        onStop() {
          this.disposer && (this.disposer(), (this.disposer = void 0)),
            super.onStop();
        }
        static getUrlFromObj(e, t) {
          const n = JSON.stringify(t);
          return `/wasm/v1/contract/${e}/smart/${o.Buffer.from(n).toString(
            "base64"
          )}`;
        }
        canFetch() {
          return 0 !== this.contractAddress.length;
        }
        fetchResponse(e) {
          const t = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse },
          });
          return r(this, void 0, void 0, function* () {
            const { response: n, headers: r } = yield t.fetchResponse.call(
                this,
                e
              ),
              i = n.data;
            if (!i)
              throw new Error("Failed to get the response from the contract");
            return {
              headers: r,
              response: {
                data: i.data,
                status: n.status,
                staled: !1,
                timestamp: Date.now(),
              },
            };
          });
        }
      }
      t.ObservableCosmwasmContractChainQuery = a;
    },
    136: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Fee =
            t.ModeInfo_Multi =
            t.ModeInfo_Single =
            t.ModeInfo =
            t.SignerInfo =
            t.AuthInfo =
            t.TxBody =
            t.SignDoc =
            t.TxRaw =
            t.Tx =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(676),
          a = n(94),
          d = n(431),
          c = n(93);
        function u() {
          return {
            bodyBytes: new Uint8Array(),
            authInfoBytes: new Uint8Array(),
            signatures: [],
          };
        }
        function l() {
          return {
            bodyBytes: new Uint8Array(),
            authInfoBytes: new Uint8Array(),
            chainId: "",
            accountNumber: "0",
          };
        }
        (t.protobufPackage = "cosmos.tx.v1beta1"),
          (t.Tx = {
            encode(e, n = o.default.Writer.create()) {
              void 0 !== e.body &&
                t.TxBody.encode(e.body, n.uint32(10).fork()).ldelim(),
                void 0 !== e.authInfo &&
                  t.AuthInfo.encode(e.authInfo, n.uint32(18).fork()).ldelim();
              for (const t of e.signatures) n.uint32(26).bytes(t);
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { body: void 0, authInfo: void 0, signatures: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.body = t.TxBody.decode(r, r.uint32());
                    break;
                  case 2:
                    s.authInfo = t.AuthInfo.decode(r, r.uint32());
                    break;
                  case 3:
                    s.signatures.push(r.bytes());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              body: y(e.body) ? t.TxBody.fromJSON(e.body) : void 0,
              authInfo: y(e.authInfo)
                ? t.AuthInfo.fromJSON(e.authInfo)
                : void 0,
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) => f(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.body &&
                  (n.body = e.body ? t.TxBody.toJSON(e.body) : void 0),
                void 0 !== e.authInfo &&
                  (n.authInfo = e.authInfo
                    ? t.AuthInfo.toJSON(e.authInfo)
                    : void 0),
                e.signatures
                  ? (n.signatures = e.signatures.map((e) =>
                      m(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (n.signatures = []),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { body: void 0, authInfo: void 0, signatures: [] };
              return (
                (r.body =
                  void 0 !== e.body && null !== e.body
                    ? t.TxBody.fromPartial(e.body)
                    : void 0),
                (r.authInfo =
                  void 0 !== e.authInfo && null !== e.authInfo
                    ? t.AuthInfo.fromPartial(e.authInfo)
                    : void 0),
                (r.signatures =
                  (null === (n = e.signatures) || void 0 === n
                    ? void 0
                    : n.map((e) => e)) || []),
                r
              );
            },
          }),
          (t.TxRaw = {
            encode(e, t = o.default.Writer.create()) {
              0 !== e.bodyBytes.length && t.uint32(10).bytes(e.bodyBytes),
                0 !== e.authInfoBytes.length &&
                  t.uint32(18).bytes(e.authInfoBytes);
              for (const n of e.signatures) t.uint32(26).bytes(n);
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = u();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.bodyBytes = n.bytes();
                    break;
                  case 2:
                    i.authInfoBytes = n.bytes();
                    break;
                  case 3:
                    i.signatures.push(n.bytes());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              bodyBytes: y(e.bodyBytes) ? f(e.bodyBytes) : new Uint8Array(),
              authInfoBytes: y(e.authInfoBytes)
                ? f(e.authInfoBytes)
                : new Uint8Array(),
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) => f(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.bodyBytes &&
                  (t.bodyBytes = m(
                    void 0 !== e.bodyBytes ? e.bodyBytes : new Uint8Array()
                  )),
                void 0 !== e.authInfoBytes &&
                  (t.authInfoBytes = m(
                    void 0 !== e.authInfoBytes
                      ? e.authInfoBytes
                      : new Uint8Array()
                  )),
                e.signatures
                  ? (t.signatures = e.signatures.map((e) =>
                      m(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (t.signatures = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = u();
              return (
                (i.bodyBytes =
                  null !== (t = e.bodyBytes) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (i.authInfoBytes =
                  null !== (n = e.authInfoBytes) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (i.signatures =
                  (null === (r = e.signatures) || void 0 === r
                    ? void 0
                    : r.map((e) => e)) || []),
                i
              );
            },
          }),
          (t.SignDoc = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.bodyBytes.length && t.uint32(10).bytes(e.bodyBytes),
              0 !== e.authInfoBytes.length &&
                t.uint32(18).bytes(e.authInfoBytes),
              "" !== e.chainId && t.uint32(26).string(e.chainId),
              "0" !== e.accountNumber && t.uint32(32).uint64(e.accountNumber),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = l();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.bodyBytes = n.bytes();
                    break;
                  case 2:
                    i.authInfoBytes = n.bytes();
                    break;
                  case 3:
                    i.chainId = n.string();
                    break;
                  case 4:
                    i.accountNumber = v(n.uint64());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              bodyBytes: y(e.bodyBytes) ? f(e.bodyBytes) : new Uint8Array(),
              authInfoBytes: y(e.authInfoBytes)
                ? f(e.authInfoBytes)
                : new Uint8Array(),
              chainId: y(e.chainId) ? String(e.chainId) : "",
              accountNumber: y(e.accountNumber) ? String(e.accountNumber) : "0",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.bodyBytes &&
                  (t.bodyBytes = m(
                    void 0 !== e.bodyBytes ? e.bodyBytes : new Uint8Array()
                  )),
                void 0 !== e.authInfoBytes &&
                  (t.authInfoBytes = m(
                    void 0 !== e.authInfoBytes
                      ? e.authInfoBytes
                      : new Uint8Array()
                  )),
                void 0 !== e.chainId && (t.chainId = e.chainId),
                void 0 !== e.accountNumber &&
                  (t.accountNumber = e.accountNumber),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = l();
              return (
                (o.bodyBytes =
                  null !== (t = e.bodyBytes) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (o.authInfoBytes =
                  null !== (n = e.authInfoBytes) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (o.chainId = null !== (r = e.chainId) && void 0 !== r ? r : ""),
                (o.accountNumber =
                  null !== (i = e.accountNumber) && void 0 !== i ? i : "0"),
                o
              );
            },
          }),
          (t.TxBody = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.messages)
                a.Any.encode(n, t.uint32(10).fork()).ldelim();
              "" !== e.memo && t.uint32(18).string(e.memo),
                "0" !== e.timeoutHeight && t.uint32(24).uint64(e.timeoutHeight);
              for (const n of e.extensionOptions)
                a.Any.encode(n, t.uint32(8186).fork()).ldelim();
              for (const n of e.nonCriticalExtensionOptions)
                a.Any.encode(n, t.uint32(16378).fork()).ldelim();
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = {
                messages: [],
                memo: "",
                timeoutHeight: "0",
                extensionOptions: [],
                nonCriticalExtensionOptions: [],
              };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.messages.push(a.Any.decode(n, n.uint32()));
                    break;
                  case 2:
                    i.memo = n.string();
                    break;
                  case 3:
                    i.timeoutHeight = v(n.uint64());
                    break;
                  case 1023:
                    i.extensionOptions.push(a.Any.decode(n, n.uint32()));
                    break;
                  case 2047:
                    i.nonCriticalExtensionOptions.push(
                      a.Any.decode(n, n.uint32())
                    );
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              messages: Array.isArray(null == e ? void 0 : e.messages)
                ? e.messages.map((e) => a.Any.fromJSON(e))
                : [],
              memo: y(e.memo) ? String(e.memo) : "",
              timeoutHeight: y(e.timeoutHeight) ? String(e.timeoutHeight) : "0",
              extensionOptions: Array.isArray(
                null == e ? void 0 : e.extensionOptions
              )
                ? e.extensionOptions.map((e) => a.Any.fromJSON(e))
                : [],
              nonCriticalExtensionOptions: Array.isArray(
                null == e ? void 0 : e.nonCriticalExtensionOptions
              )
                ? e.nonCriticalExtensionOptions.map((e) => a.Any.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                e.messages
                  ? (t.messages = e.messages.map((e) =>
                      e ? a.Any.toJSON(e) : void 0
                    ))
                  : (t.messages = []),
                void 0 !== e.memo && (t.memo = e.memo),
                void 0 !== e.timeoutHeight &&
                  (t.timeoutHeight = e.timeoutHeight),
                e.extensionOptions
                  ? (t.extensionOptions = e.extensionOptions.map((e) =>
                      e ? a.Any.toJSON(e) : void 0
                    ))
                  : (t.extensionOptions = []),
                e.nonCriticalExtensionOptions
                  ? (t.nonCriticalExtensionOptions =
                      e.nonCriticalExtensionOptions.map((e) =>
                        e ? a.Any.toJSON(e) : void 0
                      ))
                  : (t.nonCriticalExtensionOptions = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i, o;
              const s = {
                messages: [],
                memo: "",
                timeoutHeight: "0",
                extensionOptions: [],
                nonCriticalExtensionOptions: [],
              };
              return (
                (s.messages =
                  (null === (t = e.messages) || void 0 === t
                    ? void 0
                    : t.map((e) => a.Any.fromPartial(e))) || []),
                (s.memo = null !== (n = e.memo) && void 0 !== n ? n : ""),
                (s.timeoutHeight =
                  null !== (r = e.timeoutHeight) && void 0 !== r ? r : "0"),
                (s.extensionOptions =
                  (null === (i = e.extensionOptions) || void 0 === i
                    ? void 0
                    : i.map((e) => a.Any.fromPartial(e))) || []),
                (s.nonCriticalExtensionOptions =
                  (null === (o = e.nonCriticalExtensionOptions) || void 0 === o
                    ? void 0
                    : o.map((e) => a.Any.fromPartial(e))) || []),
                s
              );
            },
          }),
          (t.AuthInfo = {
            encode(e, n = o.default.Writer.create()) {
              for (const r of e.signerInfos)
                t.SignerInfo.encode(r, n.uint32(10).fork()).ldelim();
              return (
                void 0 !== e.fee &&
                  t.Fee.encode(e.fee, n.uint32(18).fork()).ldelim(),
                n
              );
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { signerInfos: [], fee: void 0 };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.signerInfos.push(t.SignerInfo.decode(r, r.uint32()));
                    break;
                  case 2:
                    s.fee = t.Fee.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              signerInfos: Array.isArray(null == e ? void 0 : e.signerInfos)
                ? e.signerInfos.map((e) => t.SignerInfo.fromJSON(e))
                : [],
              fee: y(e.fee) ? t.Fee.fromJSON(e.fee) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                e.signerInfos
                  ? (n.signerInfos = e.signerInfos.map((e) =>
                      e ? t.SignerInfo.toJSON(e) : void 0
                    ))
                  : (n.signerInfos = []),
                void 0 !== e.fee &&
                  (n.fee = e.fee ? t.Fee.toJSON(e.fee) : void 0),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { signerInfos: [], fee: void 0 };
              return (
                (r.signerInfos =
                  (null === (n = e.signerInfos) || void 0 === n
                    ? void 0
                    : n.map((e) => t.SignerInfo.fromPartial(e))) || []),
                (r.fee =
                  void 0 !== e.fee && null !== e.fee
                    ? t.Fee.fromPartial(e.fee)
                    : void 0),
                r
              );
            },
          }),
          (t.SignerInfo = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.publicKey &&
                a.Any.encode(e.publicKey, n.uint32(10).fork()).ldelim(),
              void 0 !== e.modeInfo &&
                t.ModeInfo.encode(e.modeInfo, n.uint32(18).fork()).ldelim(),
              "0" !== e.sequence && n.uint32(24).uint64(e.sequence),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { publicKey: void 0, modeInfo: void 0, sequence: "0" };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.publicKey = a.Any.decode(r, r.uint32());
                    break;
                  case 2:
                    s.modeInfo = t.ModeInfo.decode(r, r.uint32());
                    break;
                  case 3:
                    s.sequence = v(r.uint64());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              publicKey: y(e.publicKey) ? a.Any.fromJSON(e.publicKey) : void 0,
              modeInfo: y(e.modeInfo)
                ? t.ModeInfo.fromJSON(e.modeInfo)
                : void 0,
              sequence: y(e.sequence) ? String(e.sequence) : "0",
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.publicKey &&
                  (n.publicKey = e.publicKey
                    ? a.Any.toJSON(e.publicKey)
                    : void 0),
                void 0 !== e.modeInfo &&
                  (n.modeInfo = e.modeInfo
                    ? t.ModeInfo.toJSON(e.modeInfo)
                    : void 0),
                void 0 !== e.sequence && (n.sequence = e.sequence),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { publicKey: void 0, modeInfo: void 0, sequence: "0" };
              return (
                (r.publicKey =
                  void 0 !== e.publicKey && null !== e.publicKey
                    ? a.Any.fromPartial(e.publicKey)
                    : void 0),
                (r.modeInfo =
                  void 0 !== e.modeInfo && null !== e.modeInfo
                    ? t.ModeInfo.fromPartial(e.modeInfo)
                    : void 0),
                (r.sequence =
                  null !== (n = e.sequence) && void 0 !== n ? n : "0"),
                r
              );
            },
          }),
          (t.ModeInfo = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.single &&
                t.ModeInfo_Single.encode(
                  e.single,
                  n.uint32(10).fork()
                ).ldelim(),
              void 0 !== e.multi &&
                t.ModeInfo_Multi.encode(e.multi, n.uint32(18).fork()).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { single: void 0, multi: void 0 };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.single = t.ModeInfo_Single.decode(r, r.uint32());
                    break;
                  case 2:
                    s.multi = t.ModeInfo_Multi.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              single: y(e.single)
                ? t.ModeInfo_Single.fromJSON(e.single)
                : void 0,
              multi: y(e.multi) ? t.ModeInfo_Multi.fromJSON(e.multi) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.single &&
                  (n.single = e.single
                    ? t.ModeInfo_Single.toJSON(e.single)
                    : void 0),
                void 0 !== e.multi &&
                  (n.multi = e.multi
                    ? t.ModeInfo_Multi.toJSON(e.multi)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              const n = { single: void 0, multi: void 0 };
              return (
                (n.single =
                  void 0 !== e.single && null !== e.single
                    ? t.ModeInfo_Single.fromPartial(e.single)
                    : void 0),
                (n.multi =
                  void 0 !== e.multi && null !== e.multi
                    ? t.ModeInfo_Multi.fromPartial(e.multi)
                    : void 0),
                n
              );
            },
          }),
          (t.ModeInfo_Single = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.mode && t.uint32(8).int32(e.mode), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { mode: 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.mode = n.int32();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              mode: y(e.mode) ? s.signModeFromJSON(e.mode) : 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.mode && (t.mode = s.signModeToJSON(e.mode)), t
              );
            },
            fromPartial(e) {
              var t;
              const n = { mode: 0 };
              return (
                (n.mode = null !== (t = e.mode) && void 0 !== t ? t : 0), n
              );
            },
          }),
          (t.ModeInfo_Multi = {
            encode(e, n = o.default.Writer.create()) {
              void 0 !== e.bitarray &&
                d.CompactBitArray.encode(
                  e.bitarray,
                  n.uint32(10).fork()
                ).ldelim();
              for (const r of e.modeInfos)
                t.ModeInfo.encode(r, n.uint32(18).fork()).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { bitarray: void 0, modeInfos: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.bitarray = d.CompactBitArray.decode(r, r.uint32());
                    break;
                  case 2:
                    s.modeInfos.push(t.ModeInfo.decode(r, r.uint32()));
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              bitarray: y(e.bitarray)
                ? d.CompactBitArray.fromJSON(e.bitarray)
                : void 0,
              modeInfos: Array.isArray(null == e ? void 0 : e.modeInfos)
                ? e.modeInfos.map((e) => t.ModeInfo.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.bitarray &&
                  (n.bitarray = e.bitarray
                    ? d.CompactBitArray.toJSON(e.bitarray)
                    : void 0),
                e.modeInfos
                  ? (n.modeInfos = e.modeInfos.map((e) =>
                      e ? t.ModeInfo.toJSON(e) : void 0
                    ))
                  : (n.modeInfos = []),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { bitarray: void 0, modeInfos: [] };
              return (
                (r.bitarray =
                  void 0 !== e.bitarray && null !== e.bitarray
                    ? d.CompactBitArray.fromPartial(e.bitarray)
                    : void 0),
                (r.modeInfos =
                  (null === (n = e.modeInfos) || void 0 === n
                    ? void 0
                    : n.map((e) => t.ModeInfo.fromPartial(e))) || []),
                r
              );
            },
          }),
          (t.Fee = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.amount)
                c.Coin.encode(n, t.uint32(10).fork()).ldelim();
              return (
                "0" !== e.gasLimit && t.uint32(16).uint64(e.gasLimit),
                "" !== e.payer && t.uint32(26).string(e.payer),
                "" !== e.granter && t.uint32(34).string(e.granter),
                t
              );
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { amount: [], gasLimit: "0", payer: "", granter: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.amount.push(c.Coin.decode(n, n.uint32()));
                    break;
                  case 2:
                    i.gasLimit = v(n.uint64());
                    break;
                  case 3:
                    i.payer = n.string();
                    break;
                  case 4:
                    i.granter = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              amount: Array.isArray(null == e ? void 0 : e.amount)
                ? e.amount.map((e) => c.Coin.fromJSON(e))
                : [],
              gasLimit: y(e.gasLimit) ? String(e.gasLimit) : "0",
              payer: y(e.payer) ? String(e.payer) : "",
              granter: y(e.granter) ? String(e.granter) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                e.amount
                  ? (t.amount = e.amount.map((e) =>
                      e ? c.Coin.toJSON(e) : void 0
                    ))
                  : (t.amount = []),
                void 0 !== e.gasLimit && (t.gasLimit = e.gasLimit),
                void 0 !== e.payer && (t.payer = e.payer),
                void 0 !== e.granter && (t.granter = e.granter),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = { amount: [], gasLimit: "0", payer: "", granter: "" };
              return (
                (o.amount =
                  (null === (t = e.amount) || void 0 === t
                    ? void 0
                    : t.map((e) => c.Coin.fromPartial(e))) || []),
                (o.gasLimit =
                  null !== (n = e.gasLimit) && void 0 !== n ? n : "0"),
                (o.payer = null !== (r = e.payer) && void 0 !== r ? r : ""),
                (o.granter = null !== (i = e.granter) && void 0 !== i ? i : ""),
                o
              );
            },
          });
        var h = (() => {
          if (void 0 !== h) return h;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const p =
          h.atob || ((e) => h.Buffer.from(e, "base64").toString("binary"));
        function f(e) {
          const t = p(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const g =
          h.btoa || ((e) => h.Buffer.from(e, "binary").toString("base64"));
        function m(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return g(t.join(""));
        }
        function v(e) {
          return e.toString();
        }
        function y(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    1422: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1684), t),
        i(n(1685), t);
    },
    1424: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1694), t),
        i(n(1426), t),
        i(n(1425), t),
        i(n(1695), t);
    },
    1425: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryGovParamDeposit =
          t.ObservableQueryGovParamVoting =
          t.ObservableQueryGovParamTally =
            void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/gov/v1beta1/params/tallying");
        }
      }
      t.ObservableQueryGovParamTally = i;
      class o extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/gov/v1beta1/params/voting");
        }
      }
      t.ObservableQueryGovParamVoting = o;
      class s extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/gov/v1beta1/params/deposit");
        }
      }
      t.ObservableQueryGovParamDeposit = s;
    },
    1426: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryProposal = void 0);
      const i = n(91),
        o = n(1427),
        s = n(7),
        a = n(32);
      class d extends i.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(
            e,
            t,
            n,
            `/cosmos/gov/v1beta1/proposals/${r.proposal_id}/tally`
          ),
            (this._raw = r),
            (this.governance = i),
            s.makeObservable(this);
        }
        canFetch() {
          return this.proposalStatus === o.ProposalStatus.VOTING_PERIOD;
        }
        get raw() {
          return this._raw;
        }
        get proposalStatus() {
          switch (this.raw.status) {
            case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
              return o.ProposalStatus.DEPOSIT_PERIOD;
            case "PROPOSAL_STATUS_VOTING_PERIOD":
              return o.ProposalStatus.VOTING_PERIOD;
            case "PROPOSAL_STATUS_PASSED":
              return o.ProposalStatus.PASSED;
            case "PROPOSAL_STATUS_REJECTED":
              return o.ProposalStatus.REJECTED;
            case "PROPOSAL_STATUS_FAILED":
              return o.ProposalStatus.FAILED;
            default:
              return o.ProposalStatus.UNSPECIFIED;
          }
        }
        get id() {
          return this.raw.proposal_id;
        }
        get title() {
          return this.raw.content.title;
        }
        get description() {
          return this.raw.content.description;
        }
        get turnout() {
          const e = this.governance.getQueryPool(),
            t = e.bondedTokens.toDec();
          if (!e.response || t.equals(new a.Dec(0)))
            return new a.IntPretty(new a.Dec(0)).ready(!1);
          const n = this.tally,
            r = n.yes.add(n.no).add(n.abstain).add(n.noWithVeto);
          return new a.IntPretty(
            r.toDec().quoTruncate(t).mulTruncate(a.DecUtils.getPrecisionDec(2))
          ).ready(n.yes.isReady);
        }
        get tally() {
          const e = this.chainGetter.getChain(this.chainId).stakeCurrency;
          return this.proposalStatus !== o.ProposalStatus.VOTING_PERIOD
            ? {
                yes: new a.IntPretty(new a.Int(this.raw.final_tally_result.yes))
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                no: new a.IntPretty(new a.Int(this.raw.final_tally_result.no))
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                abstain: new a.IntPretty(
                  new a.Int(this.raw.final_tally_result.abstain)
                )
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                noWithVeto: new a.IntPretty(
                  new a.Int(this.raw.final_tally_result.no_with_veto)
                )
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
              }
            : this.response
            ? {
                yes: new a.IntPretty(new a.Int(this.response.data.tally.yes))
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                no: new a.IntPretty(new a.Int(this.response.data.tally.no))
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                abstain: new a.IntPretty(
                  new a.Int(this.response.data.tally.abstain)
                )
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                noWithVeto: new a.IntPretty(
                  new a.Int(this.response.data.tally.no_with_veto)
                )
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
              }
            : {
                yes: new a.IntPretty(new a.Int(0))
                  .ready(!1)
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                no: new a.IntPretty(new a.Int(0))
                  .ready(!1)
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                abstain: new a.IntPretty(new a.Int(0))
                  .ready(!1)
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
                noWithVeto: new a.IntPretty(new a.Int(0))
                  .ready(!1)
                  .moveDecimalPointLeft(e.coinDecimals)
                  .maxDecimals(e.coinDecimals),
              };
        }
        get total() {
          const e = this.tally,
            t = e.yes.add(e.no).add(e.abstain).add(e.noWithVeto),
            n = this.chainGetter.getChain(this.chainId).stakeCurrency;
          return new a.CoinPretty(n, t);
        }
        get tallyRatio() {
          const e = this.tally,
            t = e.yes.add(e.no).add(e.abstain).add(e.noWithVeto);
          return t.toDec().equals(new a.Dec(0))
            ? {
                yes: new a.IntPretty(new a.Int(0)).ready(!1),
                no: new a.IntPretty(new a.Int(0)).ready(!1),
                abstain: new a.IntPretty(new a.Int(0)).ready(!1),
                noWithVeto: new a.IntPretty(new a.Int(0)).ready(!1),
              }
            : {
                yes: new a.IntPretty(
                  e.yes
                    .toDec()
                    .quoTruncate(t.toDec())
                    .mulTruncate(a.DecUtils.getPrecisionDec(2))
                ).ready(e.yes.isReady),
                no: new a.IntPretty(
                  e.no
                    .toDec()
                    .quoTruncate(t.toDec())
                    .mulTruncate(a.DecUtils.getPrecisionDec(2))
                ).ready(e.no.isReady),
                abstain: new a.IntPretty(
                  e.abstain
                    .toDec()
                    .quoTruncate(t.toDec())
                    .mulTruncate(a.DecUtils.getPrecisionDec(2))
                ).ready(e.abstain.isReady),
                noWithVeto: new a.IntPretty(
                  e.noWithVeto
                    .toDec()
                    .quoTruncate(t.toDec())
                    .mulTruncate(a.DecUtils.getPrecisionDec(2))
                ).ready(e.noWithVeto.isReady),
              };
        }
      }
      r([s.computed], d.prototype, "turnout", null),
        r([s.computed], d.prototype, "tally", null),
        r([s.computed], d.prototype, "total", null),
        r([s.computed], d.prototype, "tallyRatio", null),
        (t.ObservableQueryProposal = d);
    },
    1427: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ProposalStatus = void 0),
        (function (e) {
          (e[(e.UNSPECIFIED = 0)] = "UNSPECIFIED"),
            (e[(e.DEPOSIT_PERIOD = 1)] = "DEPOSIT_PERIOD"),
            (e[(e.VOTING_PERIOD = 2)] = "VOTING_PERIOD"),
            (e[(e.PASSED = 3)] = "PASSED"),
            (e[(e.REJECTED = 4)] = "REJECTED"),
            (e[(e.FAILED = 5)] = "FAILED");
        })(t.ProposalStatus || (t.ProposalStatus = {}));
    },
    1428: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1696), t),
        i(n(1697), t),
        i(n(1698), t),
        i(n(1699), t),
        i(n(1705), t),
        i(n(1706), t);
    },
    1429: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1707), t),
        i(n(1708), t),
        i(n(1709), t);
    },
    1430: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryAccount = t.ObservableQueryAccountInner = void 0);
      const i = n(91),
        o = n(7),
        s = n(8);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/cosmos/auth/v1beta1/accounts/" + r),
            (this.bech32Address = r),
            o.makeObservable(this);
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
        get sequence() {
          if (!this.response) return "0";
          try {
            return s.BaseAccount.fromProtoJSON(
              this.response.data,
              this.bech32Address
            )
              .getSequence()
              .toString();
          } catch (e) {
            return "0";
          }
        }
        get isVestingAccount() {
          var e;
          return (
            !!this.response &&
            !!(null === (e = this.response.data) || void 0 === e
              ? void 0
              : e.account.base_vesting_account)
          );
        }
      }
      r([o.computed], a.prototype, "sequence", null),
        r([o.computed], a.prototype, "isVestingAccount", null),
        (t.ObservableQueryAccountInner = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new a(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryAccount = d;
    },
    1431: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1710), t),
        i(n(1711), t),
        i(n(1712), t);
    },
    1432: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1713), t),
        i(n(1714), t);
    },
    1433: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryCw20BalanceRegistry =
          t.ObservableQueryCw20BalanceInner =
          t.ObservableQueryCw20Balance =
            void 0);
      const i = n(7),
        o = n(29),
        s = n(32),
        a = n(924),
        d = n(1343);
      class c extends d.ObservableCosmwasmContractChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, r, { balance: { address: i } }),
            (this.contractAddress = r),
            (this.bech32Address = i);
        }
        canFetch() {
          return super.canFetch() && "" !== this.bech32Address;
        }
      }
      t.ObservableQueryCw20Balance = c;
      class u extends a.ObservableQueryBalanceInner {
        constructor(e, t, n, r, o) {
          super(e, t, n, "", r),
            (this.bech32Address = o),
            i.makeObservable(this),
            (this.queryCw20Balance = new c(e, t, n, r.contractAddress, o));
        }
        canFetch() {
          return !1;
        }
        *fetch() {
          yield this.queryCw20Balance.fetch();
        }
        get balance() {
          const e = this.denomHelper.denom,
            t = this.chainGetter
              .getChain(this.chainId)
              .currencies.find((t) => t.coinMinimalDenom === e);
          if (!t) throw new Error("Unknown currency: " + e);
          return this.queryCw20Balance.response &&
            this.queryCw20Balance.response.data.balance
            ? new s.CoinPretty(
                t,
                new s.Int(this.queryCw20Balance.response.data.balance)
              )
            : new s.CoinPretty(t, new s.Int(0)).ready(!1);
        }
      }
      r([i.override], u.prototype, "fetch", null),
        r([i.computed], u.prototype, "balance", null),
        (t.ObservableQueryCw20BalanceInner = u);
      t.ObservableQueryCw20BalanceRegistry = class {
        constructor(e) {
          this.kvStore = e;
        }
        getBalanceInner(e, t, n, r) {
          const i = new o.DenomHelper(r);
          if ("cw20" === i.type) return new u(this.kvStore, e, t, i, n);
        }
      };
    },
    1434: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySecretContractCodeHash =
          t.ObservableQuerySecretContractCodeHashInner =
            void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/compute/v1beta1/code_hash/by_contract_address/" + r),
            (this.contractAddress = r);
        }
        canFetch() {
          return this.contractAddress.length > 0;
        }
      }
      t.ObservableQuerySecretContractCodeHashInner = i;
      class o extends r.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new i(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryContract(e) {
          return this.get(e);
        }
      }
      t.ObservableQuerySecretContractCodeHash = o;
    },
    1435: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySecret20BalanceRegistry =
          t.ObservableQuerySecret20BalanceInner =
          t.ObservableQuerySecret20Balance =
            void 0);
      const o = n(7),
        s = n(29),
        a = n(32),
        d = n(924),
        c = n(1436),
        u = n(1437);
      class l extends c.ObservableSecretContractChainQuery {
        constructor(e, t, n, r, i, s, a, d) {
          super(e, t, n, r, i, { balance: { address: s, key: a } }, d),
            (this.apiGetter = r),
            (this.contractAddress = i),
            (this.bech32Address = s),
            (this.viewingKey = a),
            (this.querySecretContractCodeHash = d),
            o.makeObservable(this),
            this.viewingKey ||
              this.setError({
                status: 0,
                statusText: "Viewing key is empty",
                message: "Viewing key is empty",
              });
        }
        canFetch() {
          return (
            super.canFetch() &&
            "" !== this.bech32Address &&
            "" !== this.viewingKey
          );
        }
        fetchResponse(e) {
          const t = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse },
          });
          var n;
          return i(this, void 0, void 0, function* () {
            const { response: r, headers: i } = yield t.fetchResponse.call(
              this,
              e
            );
            if (r.data.viewing_key_error)
              throw new u.WrongViewingKeyError(
                null === (n = r.data.viewing_key_error) || void 0 === n
                  ? void 0
                  : n.msg
              );
            return { headers: i, response: r };
          });
        }
      }
      t.ObservableQuerySecret20Balance = l;
      class h extends d.ObservableQueryBalanceInner {
        constructor(e, t, n, r, i, s, a) {
          super(e, t, n, "", i),
            (this.apiGetter = r),
            (this.bech32Address = s),
            (this.querySecretContractCodeHash = a),
            o.makeObservable(this);
          const d = (() => {
            const e = this.currency;
            return "type" in e && "secret20" === e.type ? e.viewingKey : "";
          })();
          this.querySecret20Balance = new l(
            e,
            t,
            n,
            this.apiGetter,
            i.contractAddress,
            s,
            d,
            this.querySecretContractCodeHash
          );
        }
        canFetch() {
          return !1;
        }
        *fetch() {
          yield this.querySecret20Balance.fetch();
        }
        get isFetching() {
          return (
            this.querySecretContractCodeHash.getQueryContract(
              this.denomHelper.contractAddress
            ).isFetching || this.querySecret20Balance.isFetching
          );
        }
        get error() {
          return (
            this.querySecretContractCodeHash.getQueryContract(
              this.denomHelper.contractAddress
            ).error || this.querySecret20Balance.error
          );
        }
        get balance() {
          const e = this.denomHelper.denom,
            t = this.chainGetter.getChain(this.chainId).findCurrency(e);
          if (!t) throw new Error("Unknown currency: " + e);
          return this.querySecret20Balance.response &&
            this.querySecret20Balance.response.data.balance
            ? new a.CoinPretty(
                t,
                new a.Int(
                  this.querySecret20Balance.response.data.balance.amount
                )
              )
            : new a.CoinPretty(t, new a.Int(0)).ready(!1);
        }
      }
      r([o.override], h.prototype, "fetch", null),
        r([o.computed], h.prototype, "balance", null),
        (t.ObservableQuerySecret20BalanceInner = h);
      t.ObservableQuerySecret20BalanceRegistry = class {
        constructor(e, t, n) {
          (this.kvStore = e),
            (this.apiGetter = t),
            (this.querySecretContractCodeHash = n);
        }
        getBalanceInner(e, t, n, r) {
          const i = new s.DenomHelper(r);
          if ("secret20" === i.type)
            return new h(
              this.kvStore,
              e,
              t,
              this.apiGetter,
              i,
              n,
              this.querySecretContractCodeHash
            );
        }
      };
    },
    1436: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableSecretContractChainQuery = void 0);
      const o = n(91),
        s = n(29),
        a = n(7),
        d = n(2);
      class c extends o.ObservableChainQuery {
        constructor(e, t, n, r, i, o, s) {
          super(e, t, n, ""),
            (this.apiGetter = r),
            (this.contractAddress = i),
            (this.obj = o),
            (this.querySecretContractCodeHash = s),
            (this.keplr = void 0),
            (this._isIniting = !1),
            a.makeObservable(this);
        }
        onStart() {
          const e = Object.create(null, {
            onStart: { get: () => super.onStart },
          });
          return i(this, void 0, void 0, function* () {
            if (
              (e.onStart.call(this),
              this.keplr || (yield this.initKeplr()),
              !this.keplr)
            )
              throw new Error("Failed to get keplr");
            yield this.querySecretContractCodeHash
              .getQueryContract(this.contractAddress)
              .waitResponse(),
              yield this.init();
          });
        }
        get isFetching() {
          return (
            this.querySecretContractCodeHash.getQueryContract(
              this.contractAddress
            ).isFetching ||
            null == this.keplr ||
            this._isIniting ||
            super.isFetching
          );
        }
        canFetch() {
          return (
            !!this.querySecretContractCodeHash.getQueryContract(
              this.contractAddress
            ).response &&
            0 !== this.contractAddress.length &&
            null != this.nonce
          );
        }
        *initKeplr() {
          this.keplr = yield* s.toGenerator(this.apiGetter());
        }
        *init() {
          if (((this._isIniting = !0), this.keplr && this.contractCodeHash)) {
            const e = this.keplr.getEnigmaUtils(this.chainId),
              t = yield* s.toGenerator(
                e.encrypt(this.contractCodeHash, this.obj)
              );
            this.nonce = t.slice(0, 32);
            const n = d.Buffer.from(t).toString("base64");
            this.setUrl(this.getSecretWasmUrl(this.contractAddress, n));
          }
          this._isIniting = !1;
        }
        fetchResponse(e) {
          const t = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse },
          });
          var n, r;
          return i(this, void 0, void 0, function* () {
            let i, o;
            try {
              const n = yield t.fetchResponse.call(this, e);
              (i = n.response), (o = n.headers);
            } catch (e) {
              if (
                null ===
                  (r =
                    null === (n = e.response) || void 0 === n
                      ? void 0
                      : n.data) || void 0 === r
                  ? void 0
                  : r.error
              ) {
                const t = e.response.data.error,
                  n = /rpc error: code = (.+) = encrypted: (.+): (.+)/g.exec(t);
                if (null != n && 4 === n.length) {
                  const e = n[2],
                    t = d.Buffer.from(e, "base64");
                  if (this.keplr && this.nonce) {
                    const e = yield this.keplr
                        .getEnigmaUtils(this.chainId)
                        .decrypt(t, this.nonce),
                      n = d.Buffer.from(e).toString();
                    throw new Error(n);
                  }
                }
              }
              throw e;
            }
            const s = i.data;
            if (!this.keplr) throw new Error("Keplr API not initialized");
            if (!this.nonce) throw new Error("Nonce is unknown");
            if (!s)
              throw new Error("Failed to get the response from the contract");
            const a = yield this.keplr
                .getEnigmaUtils(this.chainId)
                .decrypt(d.Buffer.from(s.data, "base64"), this.nonce),
              c = d.Buffer.from(
                d.Buffer.from(a).toString(),
                "base64"
              ).toString();
            return {
              headers: o,
              response: {
                data: JSON.parse(c),
                status: i.status,
                staled: !1,
                timestamp: Date.now(),
              },
            };
          });
        }
        getSecretWasmUrl(e, t) {
          return `/compute/v1beta1/query/${e}?${new URLSearchParams({
            query: t,
          }).toString()}`;
        }
        getCacheKey() {
          return `${this.instance.name}-${
            this.instance.defaults.baseURL
          }${this.instance.getUri({
            url: this.getSecretWasmUrl(
              this.contractAddress,
              JSON.stringify(this.obj)
            ),
          })}`;
        }
        get contractCodeHash() {
          const e = this.querySecretContractCodeHash.getQueryContract(
            this.contractAddress
          );
          if (e.response) return e.response.data.code_hash;
        }
      }
      r([a.observable.ref], c.prototype, "keplr", void 0),
        r([a.observable], c.prototype, "_isIniting", void 0),
        r([a.flow], c.prototype, "initKeplr", null),
        r([a.flow], c.prototype, "init", null),
        r([a.computed], c.prototype, "contractCodeHash", null),
        (t.ObservableSecretContractChainQuery = c);
    },
    1437: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.WrongViewingKeyError = void 0);
      class r extends Error {
        constructor(e) {
          super(e), Object.setPrototypeOf(this, r.prototype);
        }
      }
      t.WrongViewingKeyError = r;
    },
    1438: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryTxFeesFeeTokens = void 0);
      const i = n(91),
        o = n(7),
        s = n(252);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/osmosis/txfees/v1beta1/fee_tokens"),
            (this.isTxFeeToken = s.computedFn(
              (e) => !!this.response && !0 === this.feeCurrenciesDenomMap.get(e)
            )),
            o.makeObservable(this);
        }
        setResponse(e) {
          super.setResponse(e);
          const t = this.chainGetter.getChain(this.chainId),
            n = e.data.fee_tokens.map((e) => e.denom);
          t.addUnknownCurrencies(...n);
        }
        get feeCurrenciesDenomMap() {
          const e = new Map();
          if (!this.response) return e;
          for (const t of this.response.data.fee_tokens) e.set(t.denom, !0);
          return e;
        }
        get feeCurrencies() {
          if (!this.response) return [];
          const e = [],
            t = this.chainGetter.getChain(this.chainId);
          for (const n of this.response.data.fee_tokens) {
            const r = t.findCurrency(n.denom);
            r && e.push(r);
          }
          return e;
        }
      }
      r([o.computed], a.prototype, "feeCurrenciesDenomMap", null),
        r([o.computed], a.prototype, "feeCurrencies", null),
        (t.ObservableQueryTxFeesFeeTokens = a);
    },
    1439: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryTxFeesSpotPriceByDenom =
          t.ObservableQueryTxFeesSpotPriceByDenomInner =
            void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            "osmosis/txfees/v1beta1/spot_price_by_denom?denom=" + r
          ),
            o.makeObservable(this);
        }
        get poolId() {
          return this.response ? this.response.data.poolID : "";
        }
        get spotPriceDec() {
          return this.response
            ? new s.Dec(this.response.data.spot_price)
            : new s.Dec(0);
        }
      }
      r([o.computed], a.prototype, "spotPriceDec", null),
        (t.ObservableQueryTxFeesSpotPriceByDenomInner = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new a(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryDenom(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryTxFeesSpotPriceByDenom = d;
    },
    1440: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryTxFeesBaseDenom = void 0);
      const r = n(91),
        i = n(7);
      class o extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/osmosis/txfees/v1beta1/base_denom"),
            i.makeObservable(this);
        }
        get baseDenom() {
          var e, t;
          return null !==
            (t =
              null === (e = this.response) || void 0 === e
                ? void 0
                : e.data.base_denom) && void 0 !== t
            ? t
            : "";
        }
      }
      t.ObservableQueryTxFeesBaseDenom = o;
    },
    1441: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryICNSNames = t.ObservableQueryICNSNamesInner = void 0);
      const i = n(1343),
        o = n(7),
        s = n(91);
      class a extends i.ObservableCosmwasmContractChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, r, { icns_names: { address: i } }),
            (this.contractAddress = r),
            (this.address = i);
        }
        get primaryName() {
          return this.response && this.response.data
            ? this.response.data.primary_name
            : "";
        }
        get names() {
          return this.response && this.response.data
            ? this.response.data.names
            : [];
        }
      }
      r([o.computed], a.prototype, "primaryName", null),
        r([o.computed], a.prototype, "names", null),
        (t.ObservableQueryICNSNamesInner = a);
      class d extends s.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(e, t, n, (e) => {
            const t = e.split("/");
            return new a(
              this.kvStore,
              this.chainId,
              this.chainGetter,
              t[0],
              t[1]
            );
          }),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryContract(e, t) {
          return this.get(`${e}/${t}`);
        }
      }
      t.ObservableQueryICNSNames = d;
    },
    1496: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1970), t);
    },
    1497: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1971), t),
        i(n(1972), t);
    },
    1498: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1973), t);
    },
    155: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Uint = t.Int = void 0);
      const i = r(n(420)),
        o = n(156),
        s = n(422);
      class a {
        constructor(e) {
          if (
            ("number" == typeof e && (e = e.toString()), "string" == typeof e)
          ) {
            if (!s.isValidIntegerString(e)) {
              if (!s.isExponentDecString(e))
                throw new Error("invalid integer: " + e);
              e = s.exponentDecStringToDecString(e);
            }
            this.int = i.default(e);
          } else this.int = i.default(e);
          this.checkBitLen();
        }
        checkBitLen() {
          if (this.int.abs().gt(a.maxInt))
            throw new Error("Integer out of range " + this.int.toString());
        }
        toString() {
          return this.int.toString(10);
        }
        isNegative() {
          return this.int.isNegative();
        }
        isPositive() {
          return this.int.isPositive();
        }
        isZero() {
          return this.int.eq(i.default(0));
        }
        equals(e) {
          return this.int.equals(e.int);
        }
        gt(e) {
          return this.int.gt(e.int);
        }
        gte(e) {
          return this.int.greaterOrEquals(e.int);
        }
        lt(e) {
          return this.int.lt(e.int);
        }
        lte(e) {
          return this.int.lesserOrEquals(e.int);
        }
        abs() {
          return new a(this.int.abs());
        }
        absUInt() {
          return new d(this.int.abs());
        }
        add(e) {
          return new a(this.int.add(e.int));
        }
        sub(e) {
          return new a(this.int.subtract(e.int));
        }
        mul(e) {
          return new a(this.int.multiply(e.int));
        }
        div(e) {
          return new a(this.int.divide(e.int));
        }
        mod(e) {
          return new a(this.int.mod(e.int));
        }
        neg() {
          return new a(this.int.negate());
        }
        pow(e) {
          return new a(this.int.pow(e.toBigNumber()));
        }
        toDec() {
          return new o.Dec(this);
        }
        toBigNumber() {
          return this.int;
        }
      }
      (t.Int = a),
        (a.maxInt = i.default(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        ));
      class d {
        constructor(e) {
          if (
            ("number" == typeof e && (e = e.toString()), "string" == typeof e)
          ) {
            if (!s.isValidIntegerString(e)) {
              if (!s.isExponentDecString(e))
                throw new Error("invalid integer: " + e);
              e = s.exponentDecStringToDecString(e);
            }
            this.uint = i.default(e);
          } else this.uint = i.default(e);
          if (this.uint.isNegative())
            throw new TypeError("Uint should not be negative");
          this.checkBitLen();
        }
        checkBitLen() {
          if (this.uint.abs().bitLength().gt(256))
            throw new Error("Integer out of range " + this.uint.toString());
        }
        toString() {
          return this.uint.toString(10);
        }
        isZero() {
          return this.uint.eq(i.default(0));
        }
        equals(e) {
          return this.uint.equals(e.uint);
        }
        gt(e) {
          return this.uint.gt(e.uint);
        }
        gte(e) {
          return this.uint.greaterOrEquals(e.uint);
        }
        lt(e) {
          return this.uint.lt(e.uint);
        }
        lte(e) {
          return this.uint.lesserOrEquals(e.uint);
        }
        add(e) {
          return new d(this.uint.add(e.uint));
        }
        sub(e) {
          return new d(this.uint.subtract(e.uint));
        }
        mul(e) {
          return new d(this.uint.multiply(e.uint));
        }
        div(e) {
          return new d(this.uint.divide(e.uint));
        }
        mod(e) {
          return new d(this.uint.mod(e.uint));
        }
        pow(e) {
          return new d(this.uint.pow(e.toBigNumber()));
        }
        toDec() {
          return new o.Dec(new a(this.toString()));
        }
        toBigNumber() {
          return this.uint;
        }
      }
      t.Uint = d;
    },
    156: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.Dec = void 0);
      const i = r(n(420)),
        o = n(155),
        s = n(283),
        a = n(422);
      class d {
        constructor(e, t = 0) {
          if (
            ("number" == typeof e && (e = e.toString()), "string" == typeof e)
          ) {
            if (0 === e.length) throw new Error("empty string");
            if (!a.isValidDecimalString(e)) {
              if (!a.isExponentDecString(e))
                throw new Error("invalid decimal: " + e);
              e = a.exponentDecStringToDecString(e);
            }
            const n = d.reduceDecimalsFromString(e);
            n.isDownToZero &&
              console.log(
                `WARNING: Got ${e}. Dec can only handle up to 18 decimals. However, since the decimal point of the input exceeds 18 digits, the remainder is discarded. As a result, input becomes 0.`
              ),
              (e = n.res).indexOf(".") >= 0 &&
                ((t = e.length - e.indexOf(".") - 1), (e = e.replace(".", ""))),
              (this.int = i.default(e));
          } else
            e instanceof o.Int
              ? (this.int = i.default(e.toString()))
              : (this.int = i.default(e));
          (this.int = this.int.multiply(d.calcPrecisionMultiplier(t))),
            this.checkBitLen();
        }
        static calcPrecisionMultiplier(e) {
          if (e < 0) throw new Error("Invalid prec");
          if (e > d.precision) throw new Error("Too much precision");
          if (d.precisionMultipliers[e.toString()])
            return d.precisionMultipliers[e.toString()];
          const t = d.precision - e,
            n = i.default(10).pow(t);
          return (d.precisionMultipliers[e.toString()] = n), n;
        }
        static reduceDecimalsFromString(e) {
          const t = e.indexOf(".");
          if (t < 0) return { res: e, isDownToZero: !1 };
          const n = e.length - 1 - t - d.precision;
          if (n <= 0) return { res: e, isDownToZero: !1 };
          const r = e.slice(0, e.length - n);
          return { res: r, isDownToZero: /^[0.]*$/.test(r) };
        }
        checkBitLen() {
          if (this.int.abs().gt(d.maxDec))
            throw new Error("Integer out of range " + this.int.toString());
        }
        isZero() {
          return this.int.eq(i.default(0));
        }
        isNegative() {
          return this.int.isNegative();
        }
        isPositive() {
          return this.int.isPositive();
        }
        equals(e) {
          return this.int.eq(e.int);
        }
        gt(e) {
          return this.int.gt(e.int);
        }
        gte(e) {
          return this.int.geq(e.int);
        }
        lt(e) {
          return this.int.lt(e.int);
        }
        lte(e) {
          return this.int.leq(e.int);
        }
        neg() {
          return new d(this.int.negate(), d.precision);
        }
        abs() {
          return new d(this.int.abs(), d.precision);
        }
        add(e) {
          return new d(this.int.add(e.int), d.precision);
        }
        sub(e) {
          return new d(this.int.subtract(e.int), d.precision);
        }
        pow(e) {
          if (e.isZero()) return new d(1);
          if (e.isNegative()) return new d(1).quo(this.pow(e.abs()));
          let t = new d(this.int, d.precision),
            n = new d(1);
          for (let r = e; r.gt(new o.Int(1)); r = r.div(new o.Int(2)))
            r.mod(new o.Int(2)).isZero() || (n = n.mul(t)), (t = t.mul(t));
          return t.mul(n);
        }
        mul(e) {
          return new d(this.mulRaw(e).chopPrecisionAndRound(), d.precision);
        }
        mulTruncate(e) {
          return new d(this.mulRaw(e).chopPrecisionAndTruncate(), d.precision);
        }
        mulRaw(e) {
          return new d(this.int.multiply(e.int), d.precision);
        }
        quo(e) {
          return new d(this.quoRaw(e).chopPrecisionAndRound(), d.precision);
        }
        quoTruncate(e) {
          return new d(this.quoRaw(e).chopPrecisionAndTruncate(), d.precision);
        }
        quoRoundUp(e) {
          return new d(this.quoRaw(e).chopPrecisionAndRoundUp(), d.precision);
        }
        quoRaw(e) {
          const t = d.calcPrecisionMultiplier(0),
            n = this.int.multiply(t).multiply(t);
          return new d(n.divide(e.int), d.precision);
        }
        isInteger() {
          const e = d.calcPrecisionMultiplier(0);
          return this.int.remainder(e).equals(i.default(0));
        }
        chopPrecisionAndRound() {
          if (this.isNegative()) {
            return this.abs().chopPrecisionAndRound().negate();
          }
          const e = d.calcPrecisionMultiplier(0),
            t = e.divide(i.default(2)),
            { quotient: n, remainder: r } = this.int.divmod(e);
          return r.equals(i.default(0)) || r.lt(t)
            ? n
            : r.gt(t)
            ? n.add(i.default(1))
            : n.divide(i.default(2)).equals(i.default(0))
            ? n
            : n.add(i.default(1));
        }
        chopPrecisionAndRoundUp() {
          if (this.isNegative()) {
            return this.abs().chopPrecisionAndTruncate().negate();
          }
          const e = d.calcPrecisionMultiplier(0),
            { quotient: t, remainder: n } = this.int.divmod(e);
          return n.equals(i.default(0)) ? t : t.add(i.default(1));
        }
        chopPrecisionAndTruncate() {
          const e = d.calcPrecisionMultiplier(0);
          return this.int.divide(e);
        }
        toString(e = d.precision, t = !1) {
          const n = d.calcPrecisionMultiplier(0),
            r = this.int.abs(),
            { quotient: o, remainder: a } = r.divmod(n);
          let c = a.toString(10);
          for (let e = 0, t = c.length; e < d.precision - t; e++) c = "0" + c;
          c = c.substring(0, e);
          return `${
            this.isNegative() && !(o.eq(i.default(0)) && 0 === c.length)
              ? "-"
              : ""
          }${
            t
              ? s.CoinUtils.integerStringToUSLocaleString(o.toString())
              : o.toString()
          }${c.length > 0 ? "." + c : ""}`;
        }
        round() {
          return new o.Int(this.chopPrecisionAndRound());
        }
        roundUp() {
          return new o.Int(this.chopPrecisionAndRoundUp());
        }
        truncate() {
          return new o.Int(this.chopPrecisionAndTruncate());
        }
        roundDec() {
          return new d(this.chopPrecisionAndRound(), 0);
        }
        roundUpDec() {
          return new d(this.chopPrecisionAndRoundUp(), 0);
        }
        truncateDec() {
          return new d(this.chopPrecisionAndTruncate(), 0);
        }
      }
      (t.Dec = d),
        (d.precision = 18),
        (d.decimalPrecisionBits = 60),
        (d.maxDec = i.default(
          "133499189745056880149688856635597007162669032647290798121690100488888732861290034376435130433535"
        )),
        (d.precisionMultipliers = {});
    },
    157: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Timestamp = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28));
      function s(e) {
        return null != e;
      }
      (t.protobufPackage = "google.protobuf"),
        (t.Timestamp = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.seconds && t.uint32(8).int64(e.seconds),
            0 !== e.nanos && t.uint32(16).int32(e.nanos),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { seconds: "0", nanos: 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.seconds = n.int64().toString();
                  break;
                case 2:
                  i.nanos = n.int32();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            seconds: s(e.seconds) ? String(e.seconds) : "0",
            nanos: s(e.nanos) ? Number(e.nanos) : 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.seconds && (t.seconds = e.seconds),
              void 0 !== e.nanos && (t.nanos = Math.round(e.nanos)),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { seconds: "0", nanos: 0 };
            return (
              (r.seconds = null !== (t = e.seconds) && void 0 !== t ? t : "0"),
              (r.nanos = null !== (n = e.nanos) && void 0 !== n ? n : 0),
              r
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    1573: function (e, t) {},
    1589: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.SendAuthorization = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93);
      (t.protobufPackage = "cosmos.bank.v1beta1"),
        (t.SendAuthorization = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.spendLimit)
              s.Coin.encode(n, t.uint32(10).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { spendLimit: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.spendLimit.push(s.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            spendLimit: Array.isArray(null == e ? void 0 : e.spendLimit)
              ? e.spendLimit.map((e) => s.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.spendLimit
                ? (t.spendLimit = e.spendLimit.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.spendLimit = []),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { spendLimit: [] };
            return (
              (n.spendLimit =
                (null === (t = e.spendLimit) || void 0 === t
                  ? void 0
                  : t.map((e) => s.Coin.fromPartial(e))) || []),
              n
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    1675: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1676), t),
        i(n(1340), t),
        i(n(1677), t),
        i(n(1680), t),
        i(n(1681), t),
        i(n(1683), t),
        i(n(1689), t),
        i(n(1287), t);
    },
    1676: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1677: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmosAccountImpl =
          t.defaultCosmosMsgOpts =
          t.CosmosAccount =
            void 0);
      const o = n(1340),
        s = n(29),
        a = n(32),
        d = n(136),
        c = n(676),
        u = n(1678),
        l = n(669),
        h = n(675),
        p = n(670),
        f = n(673),
        g = n(671),
        m = n(672),
        v = n(8),
        y = n(1341),
        b = i(n(62)),
        S = i(n(266)),
        O = n(2),
        _ = n(1287),
        w = n(1679);
      (t.CosmosAccount = {
        use: (e) => (n, r, i) => {
          const o = e.msgOptsCreator ? e.msgOptsCreator(i) : void 0;
          return {
            cosmos: new P(
              n,
              r,
              i,
              e.queriesStore,
              S.default(t.defaultCosmosMsgOpts, o || {}),
              e
            ),
          };
        },
      }),
        (t.defaultCosmosMsgOpts = {
          send: { native: { type: "cosmos-sdk/MsgSend", gas: 8e4 } },
          ibcTransfer: { type: "cosmos-sdk/MsgTransfer", gas: 45e4 },
          delegate: { type: "cosmos-sdk/MsgDelegate", gas: 25e4 },
          undelegate: { type: "cosmos-sdk/MsgUndelegate", gas: 25e4 },
          redelegate: { type: "cosmos-sdk/MsgBeginRedelegate", gas: 25e4 },
          withdrawRewards: {
            type: "cosmos-sdk/MsgWithdrawDelegationReward",
            gas: 14e4,
          },
          govVote: { type: "cosmos-sdk/MsgVote", gas: 25e4 },
        });
      class P {
        constructor(e, t, n, r, i, o) {
          (this.base = e),
            (this.chainGetter = t),
            (this.chainId = n),
            (this.queriesStore = r),
            (this._msgOpts = i),
            (this.txOpts = o),
            (this.broadcastMode = "sync"),
            this.base.registerMakeSendTokenFn(
              this.processMakeSendTokenTx.bind(this)
            ),
            this.base.registerSendTokenFn(this.processSendToken.bind(this));
        }
        get msgOpts() {
          return this._msgOpts;
        }
        processMakeSendTokenTx(e, t, n) {
          if ("native" === new s.DenomHelper(t.coinMinimalDenom).type) {
            const r = (() => {
              let n = new a.Dec(e);
              return (
                (n = n.mul(a.DecUtils.getPrecisionDec(t.coinDecimals))),
                n.truncate().toString()
              );
            })();
            v.Bech32Address.validate(
              n,
              this.chainGetter.getChain(this.chainId).bech32Config
                .bech32PrefixAccAddr
            );
            const i = {
              type: this.msgOpts.send.native.type,
              value: {
                from_address: this.base.bech32Address,
                to_address: n,
                amount: [{ denom: t.coinMinimalDenom, amount: r }],
              },
            };
            return this.makeTx(
              "send",
              {
                aminoMsgs: [i],
                protoMsgs: [
                  {
                    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                    value: l.MsgSend.encode({
                      fromAddress: i.value.from_address,
                      toAddress: i.value.to_address,
                      amount: i.value.amount,
                    }).finish(),
                  },
                ],
                rlpTypes: {
                  MsgValue: [
                    { name: "from_address", type: "string" },
                    { name: "to_address", type: "string" },
                    { name: "amount", type: "TypeAmount[]" },
                  ],
                  TypeAmount: [
                    { name: "denom", type: "string" },
                    { name: "amount", type: "string" },
                  ],
                },
              },
              (e) => {
                if (null == e.code || 0 === e.code) {
                  const e = this.queries.queryBalances
                    .getQueryBech32Address(this.base.bech32Address)
                    .balances.find(
                      (e) => e.currency.coinMinimalDenom === t.coinMinimalDenom
                    );
                  e && e.fetch();
                }
              }
            );
          }
        }
        processSendToken(e, t, n, i, o, d, c) {
          var u, h;
          return r(this, void 0, void 0, function* () {
            switch (new s.DenomHelper(t.coinMinimalDenom).type) {
              case "native":
                const r = (() => {
                    let n = new a.Dec(e);
                    return (
                      (n = n.mul(a.DecUtils.getPrecisionDec(t.coinDecimals))),
                      n.truncate().toString()
                    );
                  })(),
                  s = {
                    type: this.msgOpts.send.native.type,
                    value: {
                      from_address: this.base.bech32Address,
                      to_address: n,
                      amount: [{ denom: t.coinMinimalDenom, amount: r }],
                    },
                  };
                return (
                  yield this.sendMsgs(
                    "send",
                    {
                      aminoMsgs: [s],
                      protoMsgs: [
                        {
                          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                          value: l.MsgSend.encode({
                            fromAddress: s.value.from_address,
                            toAddress: s.value.to_address,
                            amount: s.value.amount,
                          }).finish(),
                        },
                      ],
                    },
                    i,
                    {
                      amount: null !== (u = o.amount) && void 0 !== u ? u : [],
                      gas:
                        null !== (h = o.gas) && void 0 !== h
                          ? h
                          : this.msgOpts.send.native.gas.toString(),
                    },
                    d,
                    _.txEventsWithPreOnFulfill(c, (e) => {
                      if (null == e.code || 0 === e.code) {
                        const e = this.queries.queryBalances
                          .getQueryBech32Address(this.base.bech32Address)
                          .balances.find(
                            (e) =>
                              e.currency.coinMinimalDenom === t.coinMinimalDenom
                          );
                        e && e.fetch();
                      }
                    })
                  ),
                  !0
                );
            }
            return !1;
          });
        }
        sendMsgs(e, t, n = "", i, o, s) {
          var a, d;
          return r(this, void 0, void 0, function* () {
            let r, c, u, l;
            this.base.setTxTypeInProgress(e);
            try {
              "function" == typeof t && (t = yield t());
              const e = yield this.broadcastMsgs(
                t,
                i,
                n,
                o,
                this.broadcastMode
              );
              (r = e.txHash), (c = e.signDoc);
            } catch (e) {
              throw (
                (this.base.setTxTypeInProgress(""),
                (null === (a = this.txOpts.preTxEvents) || void 0 === a
                  ? void 0
                  : a.onBroadcastFailed) &&
                  this.txOpts.preTxEvents.onBroadcastFailed(this.chainId, e),
                s &&
                  "onBroadcastFailed" in s &&
                  s.onBroadcastFailed &&
                  s.onBroadcastFailed(e),
                e)
              );
            }
            s &&
              ("function" == typeof s
                ? (l = s)
                : ((u = s.onBroadcasted), (l = s.onFulfill))),
              (null === (d = this.txOpts.preTxEvents) || void 0 === d
                ? void 0
                : d.onBroadcasted) &&
                this.txOpts.preTxEvents.onBroadcasted(this.chainId, r),
              u && u(r);
            const h = new v.TendermintTxTracer(
              this.chainGetter.getChain(this.chainId).rpc,
              "/websocket",
              { wsObject: this.txOpts.wsObject }
            );
            h.traceTx(r).then((e) => {
              var t;
              h.close(), this.base.setTxTypeInProgress("");
              for (const e of c.fee.amount) {
                const t = this.queries.queryBalances
                  .getQueryBech32Address(this.base.bech32Address)
                  .balances.find(
                    (t) => t.currency.coinMinimalDenom === e.denom
                  );
                t && t.fetch();
              }
              e && !e.hash && (e.hash = O.Buffer.from(r).toString("hex")),
                (null === (t = this.txOpts.preTxEvents) || void 0 === t
                  ? void 0
                  : t.onFulfill) &&
                  this.txOpts.preTxEvents.onFulfill(this.chainId, e),
                l && l(e);
            });
          });
        }
        broadcastMsgs(e, t, n = "", i, a = "async") {
          var l;
          return r(this, void 0, void 0, function* () {
            if (this.base.walletStatus !== o.WalletStatus.Loaded)
              throw new Error(
                "Wallet is not loaded: " + this.base.walletStatus
              );
            const h = e.aminoMsgs,
              p = e.protoMsgs;
            if (0 === h.length || 0 === p.length)
              throw new Error("There is no msg to send");
            if (h.length !== p.length)
              throw new Error(
                "The length of aminoMsgs and protoMsgs are different"
              );
            const f = yield v.BaseAccount.fetchFromRest(
                this.instance,
                this.base.bech32Address,
                !0
              ),
              g =
                !0 ===
                (null ===
                  (l = this.chainGetter.getChain(this.chainId).features) ||
                void 0 === l
                  ? void 0
                  : l.includes("eth-key-sign")),
              m = g && (this.base.isNanoLedger || this.base.isKeystone);
            if (m && !e.rlpTypes)
              throw new Error(
                "RLP types information is needed for signing tx for ethermint chain with ledger"
              );
            const y = yield this.base.getKeplr(),
              b = {
                chain_id: this.chainId,
                account_number: f.getAccountNumber().toString(),
                sequence: f.getSequence().toString(),
                fee: t,
                msgs: h,
                memo: s.escapeHTML(n),
              },
              S = this.chainId.startsWith("injective");
            m &&
              (S
                ? (b.timeout_height = Number.MAX_SAFE_INTEGER.toString())
                : (b.fee = Object.assign(Object.assign({}, b.fee), {
                    feePayer: this.base.bech32Address,
                  })));
            const P = s.sortObjectByKey(b),
              I = yield (() =>
                r(this, void 0, void 0, function* () {
                  return m
                    ? yield y.experimentalSignEIP712CosmosTx_v0(
                        this.chainId,
                        this.base.bech32Address,
                        _.getEip712TypedDataBasedOnChainId(this.chainId, e),
                        P,
                        i
                      )
                    : yield y.signAmino(
                        this.chainId,
                        this.base.bech32Address,
                        P,
                        i
                      );
                }))(),
              A = d.TxRaw.encode({
                bodyBytes: d.TxBody.encode(
                  d.TxBody.fromPartial({
                    messages: p,
                    timeoutHeight: I.signed.timeout_height,
                    memo: I.signed.memo,
                    extensionOptions: m
                      ? [
                          {
                            typeUrl: S
                              ? "/injective.types.v1beta1.ExtensionOptionsWeb3Tx"
                              : "/ethermint.types.v1.ExtensionOptionsWeb3Tx",
                            value: w.ExtensionOptionsWeb3Tx.encode(
                              w.ExtensionOptionsWeb3Tx.fromPartial({
                                typedDataChainId:
                                  v.EthermintChainIdHelper.parse(
                                    this.chainId
                                  ).ethChainId.toString(),
                                feePayer: S ? void 0 : I.signed.fee.feePayer,
                                feePayerSig: S
                                  ? void 0
                                  : O.Buffer.from(
                                      I.signature.signature,
                                      "base64"
                                    ),
                              })
                            ).finish(),
                          },
                        ]
                      : void 0,
                  })
                ).finish(),
                authInfoBytes: d.AuthInfo.encode({
                  signerInfos: [
                    {
                      publicKey: {
                        typeUrl: g
                          ? S
                            ? "/injective.crypto.v1beta1.ethsecp256k1.PubKey"
                            : "/ethermint.crypto.v1.ethsecp256k1.PubKey"
                          : "/cosmos.crypto.secp256k1.PubKey",
                        value: u.PubKey.encode({
                          key: O.Buffer.from(
                            I.signature.pub_key.value,
                            "base64"
                          ),
                        }).finish(),
                      },
                      modeInfo: {
                        single: {
                          mode: c.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
                        },
                        multi: void 0,
                      },
                      sequence: I.signed.sequence,
                    },
                  ],
                  fee: d.Fee.fromPartial({
                    amount: I.signed.fee.amount,
                    gasLimit: I.signed.fee.gas,
                    payer: m && !S ? I.signed.fee.feePayer : void 0,
                  }),
                }).finish(),
                signatures:
                  !m || S
                    ? [O.Buffer.from(I.signature.signature, "base64")]
                    : [new Uint8Array(0)],
              }).finish();
            return {
              txHash: yield y.sendTx(this.chainId, A, a),
              signDoc: I.signed,
            };
          });
        }
        simulateTx(e, t, n = "") {
          return r(this, void 0, void 0, function* () {
            const r = yield v.BaseAccount.fetchFromRest(
                this.instance,
                this.base.bech32Address,
                !0
              ),
              i = d.TxRaw.encode({
                bodyBytes: d.TxBody.encode(
                  d.TxBody.fromPartial({ messages: e, memo: n })
                ).finish(),
                authInfoBytes: d.AuthInfo.encode({
                  signerInfos: [
                    d.SignerInfo.fromPartial({
                      modeInfo: {
                        single: {
                          mode: c.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
                        },
                        multi: void 0,
                      },
                      sequence: r.getSequence().toString(),
                    }),
                  ],
                  fee: d.Fee.fromPartial({
                    amount: t.amount.map((e) => ({
                      amount: e.amount,
                      denom: e.denom,
                    })),
                  }),
                }).finish(),
                signatures: [new Uint8Array(64)],
              }).finish(),
              o = yield this.instance.post("/cosmos/tx/v1beta1/simulate", {
                tx_bytes: O.Buffer.from(i).toString("base64"),
              }),
              s = parseInt(o.data.gas_info.gas_used);
            if (Number.isNaN(s))
              throw new Error(
                "Invalid integer gas: " + o.data.gas_info.gas_used
              );
            return { gasUsed: s };
          });
        }
        makeTx(e, t, n) {
          const i = (e = {}, n = "") =>
              r(this, void 0, void 0, function* () {
                var r;
                return (
                  "function" == typeof t && (t = yield t()),
                  this.simulateTx(
                    t.protoMsgs,
                    {
                      amount: null !== (r = e.amount) && void 0 !== r ? r : [],
                    },
                    n
                  )
                );
              }),
            o = (i, o = "", s, d) =>
              r(this, void 0, void 0, function* () {
                if (i.gas < 0) throw new Error("Gas is zero or negative");
                const r = {
                  gas: i.gas.toString(),
                  amount: i.gasPrice
                    ? [
                        {
                          denom: i.gasPrice.denom,
                          amount: i.gasPrice.amount
                            .mul(new a.Dec(i.gas))
                            .truncate()
                            .toString(),
                        },
                      ]
                    : [],
                };
                return this.sendMsgs(
                  e,
                  t,
                  o,
                  r,
                  s,
                  _.txEventsWithPreOnFulfill(d, n)
                );
              });
          return {
            msgs: () =>
              r(this, void 0, void 0, function* () {
                return "function" == typeof t && (t = yield t()), t;
              }),
            simulate: i,
            simulateAndSend: (t, n = "", s, a) =>
              r(this, void 0, void 0, function* () {
                this.base.setTxTypeInProgress(e);
                try {
                  const { gasUsed: e } = yield i({}, n);
                  if (e < 0)
                    throw new Error("Gas estimated is zero or negative");
                  const r = Math.floor(t.gasAdjustment * e);
                  return o({ gas: r, gasPrice: t.gasPrice }, n, s, a);
                } catch (e) {
                  throw (this.base.setTxTypeInProgress(""), e);
                }
              }),
            send: (i, o = "", s, a) =>
              r(this, void 0, void 0, function* () {
                return this.sendMsgs(
                  e,
                  t,
                  o,
                  i,
                  s,
                  _.txEventsWithPreOnFulfill(a, n)
                );
              }),
            sendWithGasPrice: o,
          };
        }
        get instance() {
          const e = this.chainGetter.getChain(this.chainId);
          return b.default.create(
            Object.assign({ baseURL: e.rest }, e.restConfig)
          );
        }
        makeIBCTransferTx(e, t, n, i) {
          if ("native" !== new s.DenomHelper(n.coinMinimalDenom).type)
            throw new Error("Only native token can be sent via IBC");
          const o = (() => {
              let e = new a.Dec(t);
              return (
                (e = e.mul(a.DecUtils.getPrecisionDec(n.coinDecimals))),
                e.truncate().toString()
              );
            })(),
            d = this.queriesStore.get(e.counterpartyChainId).cosmos
              .queryRPCStatus;
          return this.makeTx(
            "ibcTransfer",
            () =>
              r(this, void 0, void 0, function* () {
                var t;
                if ((yield d.waitFreshResponse(), !d.network))
                  throw new Error(
                    "Failed to fetch the network chain id of " +
                      e.counterpartyChainId
                  );
                if (
                  v.ChainIdHelper.parse(d.network).identifier !==
                  v.ChainIdHelper.parse(e.counterpartyChainId).identifier
                )
                  throw new Error(
                    `Fetched the network chain id is different with counterparty chain id (${d.network}, ${e.counterpartyChainId})`
                  );
                if (
                  !d.latestBlockHeight ||
                  d.latestBlockHeight.equals(new a.Int("0"))
                )
                  throw new Error(
                    "Failed to fetch the latest block of " +
                      e.counterpartyChainId
                  );
                const r =
                    !0 ===
                      (null ===
                        (t = this.chainGetter.getChain(
                          this.chainId
                        ).features) || void 0 === t
                        ? void 0
                        : t.includes("eth-key-sign")) && this.base.isNanoLedger
                      ? "18446744073709551615"
                      : "0",
                  s = {
                    type: this.msgOpts.ibcTransfer.type,
                    value: {
                      source_port: e.portId,
                      source_channel: e.channelId,
                      token: { denom: n.coinMinimalDenom, amount: o },
                      sender: this.base.bech32Address,
                      receiver: i,
                      timeout_height: {
                        revision_number: v.ChainIdHelper.parse(
                          d.network
                        ).version.toString(),
                        revision_height: d.latestBlockHeight
                          .add(new a.Int("150"))
                          .toString(),
                      },
                      timeout_timestamp: r,
                    },
                  };
                return (
                  "0" === s.value.timeout_height.revision_number &&
                    delete s.value.timeout_height.revision_number,
                  "0" === s.value.timeout_timestamp &&
                    delete s.value.timeout_timestamp,
                  {
                    aminoMsgs: [s],
                    protoMsgs: [
                      {
                        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                        value: h.MsgTransfer.encode(
                          h.MsgTransfer.fromPartial({
                            sourcePort: s.value.source_port,
                            sourceChannel: s.value.source_channel,
                            token: s.value.token,
                            sender: s.value.sender,
                            receiver: s.value.receiver,
                            timeoutHeight: {
                              revisionNumber: s.value.timeout_height
                                .revision_number
                                ? s.value.timeout_height.revision_number
                                : "0",
                              revisionHeight:
                                s.value.timeout_height.revision_height,
                            },
                            timeoutTimestamp: s.value.timeout_timestamp,
                          })
                        ).finish(),
                      },
                    ],
                    rlpTypes: {
                      MsgValue: [
                        { name: "source_port", type: "string" },
                        { name: "source_channel", type: "string" },
                        { name: "token", type: "TypeToken" },
                        { name: "sender", type: "string" },
                        { name: "receiver", type: "string" },
                        { name: "timeout_height", type: "TypeTimeoutHeight" },
                        { name: "timeout_timestamp", type: "uint64" },
                      ],
                      TypeToken: [
                        { name: "denom", type: "string" },
                        { name: "amount", type: "string" },
                      ],
                      TypeTimeoutHeight: [
                        { name: "revision_number", type: "uint64" },
                        { name: "revision_height", type: "uint64" },
                      ],
                    },
                  }
                );
              }),
            (e) => {
              if (null == e.code || 0 === e.code) {
                const e = this.queries.queryBalances
                  .getQueryBech32Address(this.base.bech32Address)
                  .balances.find(
                    (e) => e.currency.coinMinimalDenom === n.coinMinimalDenom
                  );
                e && e.fetch();
              }
            }
          );
        }
        sendIBCTransferMsg(e, t, n, i, o = "", d = {}, c, u) {
          var l, p;
          return r(this, void 0, void 0, function* () {
            if ("native" !== new s.DenomHelper(n.coinMinimalDenom).type)
              throw new Error("Only native token can be sent via IBC");
            const f = (() => {
                let e = new a.Dec(t);
                return (
                  (e = e.mul(a.DecUtils.getPrecisionDec(n.coinDecimals))),
                  e.truncate().toString()
                );
              })(),
              g = this.queriesStore.get(e.counterpartyChainId).cosmos
                .queryRPCStatus;
            yield this.sendMsgs(
              "ibcTransfer",
              () =>
                r(this, void 0, void 0, function* () {
                  if ((yield g.waitFreshResponse(), !g.network))
                    throw new Error(
                      "Failed to fetch the network chain id of " +
                        e.counterpartyChainId
                    );
                  if (
                    v.ChainIdHelper.parse(g.network).identifier !==
                    v.ChainIdHelper.parse(e.counterpartyChainId).identifier
                  )
                    throw new Error(
                      `Fetched the network chain id is different with counterparty chain id (${g.network}, ${e.counterpartyChainId})`
                    );
                  if (
                    !g.latestBlockHeight ||
                    g.latestBlockHeight.equals(new a.Int("0"))
                  )
                    throw new Error(
                      "Failed to fetch the latest block of " +
                        e.counterpartyChainId
                    );
                  const t = {
                    type: this.msgOpts.ibcTransfer.type,
                    value: {
                      source_port: e.portId,
                      source_channel: e.channelId,
                      token: { denom: n.coinMinimalDenom, amount: f },
                      sender: this.base.bech32Address,
                      receiver: i,
                      timeout_height: {
                        revision_number: v.ChainIdHelper.parse(
                          g.network
                        ).version.toString(),
                        revision_height: g.latestBlockHeight
                          .add(new a.Int("150"))
                          .toString(),
                      },
                    },
                  };
                  return (
                    "0" === t.value.timeout_height.revision_number &&
                      delete t.value.timeout_height.revision_number,
                    {
                      aminoMsgs: [t],
                      protoMsgs: [
                        {
                          typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                          value: h.MsgTransfer.encode(
                            h.MsgTransfer.fromPartial({
                              sourcePort: t.value.source_port,
                              sourceChannel: t.value.source_channel,
                              token: t.value.token,
                              sender: t.value.sender,
                              receiver: t.value.receiver,
                              timeoutHeight: {
                                revisionNumber: t.value.timeout_height
                                  .revision_number
                                  ? t.value.timeout_height.revision_number
                                  : "0",
                                revisionHeight:
                                  t.value.timeout_height.revision_height,
                              },
                            })
                          ).finish(),
                        },
                      ],
                    }
                  );
                }),
              o,
              {
                amount: null !== (l = d.amount) && void 0 !== l ? l : [],
                gas:
                  null !== (p = d.gas) && void 0 !== p
                    ? p
                    : this.msgOpts.ibcTransfer.gas.toString(),
              },
              c,
              _.txEventsWithPreOnFulfill(u, (e) => {
                if (null == e.code || 0 === e.code) {
                  const e = this.queries.queryBalances
                    .getQueryBech32Address(this.base.bech32Address)
                    .balances.find(
                      (e) => e.currency.coinMinimalDenom === n.coinMinimalDenom
                    );
                  e && e.fetch();
                }
              })
            );
          });
        }
        makeDelegateTx(e, t) {
          v.Bech32Address.validate(
            t,
            this.chainGetter.getChain(this.chainId).bech32Config
              .bech32PrefixValAddr
          );
          const n = this.chainGetter.getChain(this.chainId).stakeCurrency;
          let r = new a.Dec(e);
          r = r.mulTruncate(a.DecUtils.getPrecisionDec(n.coinDecimals));
          const i = {
            type: this.msgOpts.delegate.type,
            value: {
              delegator_address: this.base.bech32Address,
              validator_address: t,
              amount: {
                denom: n.coinMinimalDenom,
                amount: r.truncate().toString(),
              },
            },
          };
          return this.makeTx(
            "delegate",
            {
              aminoMsgs: [i],
              protoMsgs: [
                {
                  typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                  value: p.MsgDelegate.encode({
                    delegatorAddress: i.value.delegator_address,
                    validatorAddress: i.value.validator_address,
                    amount: i.value.amount,
                  }).finish(),
                },
              ],
              rlpTypes: {
                MsgValue: [
                  { name: "delegator_address", type: "string" },
                  { name: "validator_address", type: "string" },
                  { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                  { name: "denom", type: "string" },
                  { name: "amount", type: "string" },
                ],
              },
            },
            (e) => {
              (null != e.code && 0 !== e.code) ||
                (this.queries.cosmos.queryValidators
                  .getQueryStatus(y.BondStatus.Bonded)
                  .fetch(),
                this.queries.cosmos.queryDelegations
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch(),
                this.queries.cosmos.queryRewards
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch());
            }
          );
        }
        sendDelegateMsg(e, t, n = "", i = {}, o, s) {
          var d, c;
          return r(this, void 0, void 0, function* () {
            const r = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let u = new a.Dec(e);
            u = u.mulTruncate(a.DecUtils.getPrecisionDec(r.coinDecimals));
            const l = {
              type: this.msgOpts.delegate.type,
              value: {
                delegator_address: this.base.bech32Address,
                validator_address: t,
                amount: {
                  denom: r.coinMinimalDenom,
                  amount: u.truncate().toString(),
                },
              },
            };
            yield this.sendMsgs(
              "delegate",
              {
                aminoMsgs: [l],
                protoMsgs: [
                  {
                    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                    value: p.MsgDelegate.encode({
                      delegatorAddress: l.value.delegator_address,
                      validatorAddress: l.value.validator_address,
                      amount: l.value.amount,
                    }).finish(),
                  },
                ],
              },
              n,
              {
                amount: null !== (d = i.amount) && void 0 !== d ? d : [],
                gas:
                  null !== (c = i.gas) && void 0 !== c
                    ? c
                    : this.msgOpts.delegate.gas.toString(),
              },
              o,
              _.txEventsWithPreOnFulfill(s, (e) => {
                (null != e.code && 0 !== e.code) ||
                  (this.queries.cosmos.queryValidators
                    .getQueryStatus(y.BondStatus.Bonded)
                    .fetch(),
                  this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch(),
                  this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch());
              })
            );
          });
        }
        makeUndelegateTx(e, t) {
          v.Bech32Address.validate(
            t,
            this.chainGetter.getChain(this.chainId).bech32Config
              .bech32PrefixValAddr
          );
          const n = this.chainGetter.getChain(this.chainId).stakeCurrency;
          let r = new a.Dec(e);
          r = r.mulTruncate(a.DecUtils.getPrecisionDec(n.coinDecimals));
          const i = {
            type: this.msgOpts.undelegate.type,
            value: {
              delegator_address: this.base.bech32Address,
              validator_address: t,
              amount: {
                denom: n.coinMinimalDenom,
                amount: r.truncate().toString(),
              },
            },
          };
          return this.makeTx(
            "undelegate",
            {
              aminoMsgs: [i],
              protoMsgs: [
                {
                  typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                  value: p.MsgUndelegate.encode({
                    delegatorAddress: i.value.delegator_address,
                    validatorAddress: i.value.validator_address,
                    amount: i.value.amount,
                  }).finish(),
                },
              ],
              rlpTypes: {
                MsgValue: [
                  { name: "delegator_address", type: "string" },
                  { name: "validator_address", type: "string" },
                  { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                  { name: "denom", type: "string" },
                  { name: "amount", type: "string" },
                ],
              },
            },
            (e) => {
              (null != e.code && 0 !== e.code) ||
                (this.queries.cosmos.queryValidators
                  .getQueryStatus(y.BondStatus.Bonded)
                  .fetch(),
                this.queries.cosmos.queryDelegations
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch(),
                this.queries.cosmos.queryUnbondingDelegations
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch(),
                this.queries.cosmos.queryRewards
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch());
            }
          );
        }
        sendUndelegateMsg(e, t, n = "", i = {}, o, s) {
          var d, c;
          return r(this, void 0, void 0, function* () {
            const r = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let u = new a.Dec(e);
            u = u.mulTruncate(a.DecUtils.getPrecisionDec(r.coinDecimals));
            const l = {
              type: this.msgOpts.undelegate.type,
              value: {
                delegator_address: this.base.bech32Address,
                validator_address: t,
                amount: {
                  denom: r.coinMinimalDenom,
                  amount: u.truncate().toString(),
                },
              },
            };
            yield this.sendMsgs(
              "undelegate",
              {
                aminoMsgs: [l],
                protoMsgs: [
                  {
                    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                    value: p.MsgUndelegate.encode({
                      delegatorAddress: l.value.delegator_address,
                      validatorAddress: l.value.validator_address,
                      amount: l.value.amount,
                    }).finish(),
                  },
                ],
              },
              n,
              {
                amount: null !== (d = i.amount) && void 0 !== d ? d : [],
                gas:
                  null !== (c = i.gas) && void 0 !== c
                    ? c
                    : this.msgOpts.undelegate.gas.toString(),
              },
              o,
              _.txEventsWithPreOnFulfill(s, (e) => {
                (null != e.code && 0 !== e.code) ||
                  (this.queries.cosmos.queryValidators
                    .getQueryStatus(y.BondStatus.Bonded)
                    .fetch(),
                  this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch(),
                  this.queries.cosmos.queryUnbondingDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch(),
                  this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch());
              })
            );
          });
        }
        makeBeginRedelegateTx(e, t, n) {
          v.Bech32Address.validate(
            t,
            this.chainGetter.getChain(this.chainId).bech32Config
              .bech32PrefixValAddr
          ),
            v.Bech32Address.validate(
              n,
              this.chainGetter.getChain(this.chainId).bech32Config
                .bech32PrefixValAddr
            );
          const r = this.chainGetter.getChain(this.chainId).stakeCurrency;
          let i = new a.Dec(e);
          i = i.mulTruncate(a.DecUtils.getPrecisionDec(r.coinDecimals));
          const o = {
            type: this.msgOpts.redelegate.type,
            value: {
              delegator_address: this.base.bech32Address,
              validator_src_address: t,
              validator_dst_address: n,
              amount: {
                denom: r.coinMinimalDenom,
                amount: i.truncate().toString(),
              },
            },
          };
          return this.makeTx(
            "redelegate",
            {
              aminoMsgs: [o],
              protoMsgs: [
                {
                  typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                  value: p.MsgBeginRedelegate.encode({
                    delegatorAddress: o.value.delegator_address,
                    validatorSrcAddress: o.value.validator_src_address,
                    validatorDstAddress: o.value.validator_dst_address,
                    amount: o.value.amount,
                  }).finish(),
                },
              ],
              rlpTypes: {
                MsgValue: [
                  { name: "delegator_address", type: "string" },
                  { name: "validator_src_address", type: "string" },
                  { name: "validator_dst_address", type: "string" },
                  { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                  { name: "denom", type: "string" },
                  { name: "amount", type: "string" },
                ],
              },
            },
            (e) => {
              (null != e.code && 0 !== e.code) ||
                (this.queries.cosmos.queryValidators
                  .getQueryStatus(y.BondStatus.Bonded)
                  .fetch(),
                this.queries.cosmos.queryDelegations
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch(),
                this.queries.cosmos.queryRewards
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch());
            }
          );
        }
        sendBeginRedelegateMsg(e, t, n, i = "", o = {}, s, d) {
          var c, u;
          return r(this, void 0, void 0, function* () {
            const r = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let l = new a.Dec(e);
            l = l.mulTruncate(a.DecUtils.getPrecisionDec(r.coinDecimals));
            const h = {
              type: this.msgOpts.redelegate.type,
              value: {
                delegator_address: this.base.bech32Address,
                validator_src_address: t,
                validator_dst_address: n,
                amount: {
                  denom: r.coinMinimalDenom,
                  amount: l.truncate().toString(),
                },
              },
            };
            yield this.sendMsgs(
              "redelegate",
              {
                aminoMsgs: [h],
                protoMsgs: [
                  {
                    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                    value: p.MsgBeginRedelegate.encode({
                      delegatorAddress: h.value.delegator_address,
                      validatorSrcAddress: h.value.validator_src_address,
                      validatorDstAddress: h.value.validator_dst_address,
                      amount: h.value.amount,
                    }).finish(),
                  },
                ],
              },
              i,
              {
                amount: null !== (c = o.amount) && void 0 !== c ? c : [],
                gas:
                  null !== (u = o.gas) && void 0 !== u
                    ? u
                    : this.msgOpts.redelegate.gas.toString(),
              },
              s,
              _.txEventsWithPreOnFulfill(d, (e) => {
                (null != e.code && 0 !== e.code) ||
                  (this.queries.cosmos.queryValidators
                    .getQueryStatus(y.BondStatus.Bonded)
                    .fetch(),
                  this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch(),
                  this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch());
              })
            );
          });
        }
        makeWithdrawDelegationRewardTx(e) {
          for (const t of e)
            v.Bech32Address.validate(
              t,
              this.chainGetter.getChain(this.chainId).bech32Config
                .bech32PrefixValAddr
            );
          const t = e.map((e) => ({
            type: this.msgOpts.withdrawRewards.type,
            value: {
              delegator_address: this.base.bech32Address,
              validator_address: e,
            },
          }));
          return this.makeTx(
            "withdrawRewards",
            {
              aminoMsgs: t,
              protoMsgs: t.map((e) => ({
                typeUrl:
                  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                value: f.MsgWithdrawDelegatorReward.encode({
                  delegatorAddress: e.value.delegator_address,
                  validatorAddress: e.value.validator_address,
                }).finish(),
              })),
              rlpTypes: {
                MsgValue: [
                  { name: "delegator_address", type: "string" },
                  { name: "validator_address", type: "string" },
                ],
              },
            },
            (e) => {
              (null != e.code && 0 !== e.code) ||
                this.queries.cosmos.queryRewards
                  .getQueryBech32Address(this.base.bech32Address)
                  .fetch();
            }
          );
        }
        sendWithdrawDelegationRewardMsgs(e, t = "", n = {}, i, o) {
          var s, a;
          return r(this, void 0, void 0, function* () {
            const r = e.map((e) => ({
              type: this.msgOpts.withdrawRewards.type,
              value: {
                delegator_address: this.base.bech32Address,
                validator_address: e,
              },
            }));
            yield this.sendMsgs(
              "withdrawRewards",
              {
                aminoMsgs: r,
                protoMsgs: r.map((e) => ({
                  typeUrl:
                    "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                  value: f.MsgWithdrawDelegatorReward.encode({
                    delegatorAddress: e.value.delegator_address,
                    validatorAddress: e.value.validator_address,
                  }).finish(),
                })),
              },
              t,
              {
                amount: null !== (s = n.amount) && void 0 !== s ? s : [],
                gas:
                  null !== (a = n.gas) && void 0 !== a
                    ? a
                    : (this.msgOpts.withdrawRewards.gas * e.length).toString(),
              },
              i,
              _.txEventsWithPreOnFulfill(o, (e) => {
                (null != e.code && 0 !== e.code) ||
                  this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
              })
            );
          });
        }
        makeGovVoteTx(e, t) {
          const n = (() => {
              switch (t) {
                case "Yes":
                  return 1;
                case "Abstain":
                  return 2;
                case "No":
                  return 3;
                case "NoWithVeto":
                  return 4;
              }
            })(),
            r = {
              type: this.msgOpts.govVote.type,
              value: {
                option: n,
                proposal_id: e,
                voter: this.base.bech32Address,
              },
            };
          return this.makeTx(
            "govVote",
            {
              aminoMsgs: [r],
              protoMsgs: [
                {
                  typeUrl: "/cosmos.gov.v1beta1.MsgVote",
                  value: g.MsgVote.encode({
                    proposalId: r.value.proposal_id,
                    voter: r.value.voter,
                    option: (() => {
                      switch (r.value.option) {
                        case 1:
                          return m.VoteOption.VOTE_OPTION_YES;
                        case 2:
                          return m.VoteOption.VOTE_OPTION_ABSTAIN;
                        case 3:
                          return m.VoteOption.VOTE_OPTION_NO;
                        case 4:
                          return m.VoteOption.VOTE_OPTION_NO_WITH_VETO;
                        default:
                          return m.VoteOption.VOTE_OPTION_UNSPECIFIED;
                      }
                    })(),
                  }).finish(),
                },
              ],
              rlpTypes: {
                MsgValue: [
                  { name: "proposal_id", type: "uint64" },
                  { name: "voter", type: "string" },
                  { name: "option", type: "int32" },
                ],
              },
            },
            (t) => {
              if (null == t.code || 0 === t.code) {
                const t = this.queries.cosmos.queryGovernance.proposals.find(
                  (t) => t.id === e
                );
                t && t.fetch();
                this.queries.cosmos.queryProposalVote
                  .getVote(e, this.base.bech32Address)
                  .fetch();
              }
            }
          );
        }
        sendGovVoteMsg(e, t, n = "", i = {}, o, s) {
          var a, d;
          return r(this, void 0, void 0, function* () {
            const r = (() => {
                switch (t) {
                  case "Yes":
                    return 1;
                  case "Abstain":
                    return 2;
                  case "No":
                    return 3;
                  case "NoWithVeto":
                    return 4;
                }
              })(),
              c = {
                type: this.msgOpts.govVote.type,
                value: {
                  option: r,
                  proposal_id: e,
                  voter: this.base.bech32Address,
                },
              };
            yield this.sendMsgs(
              "govVote",
              {
                aminoMsgs: [c],
                protoMsgs: [
                  {
                    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
                    value: g.MsgVote.encode({
                      proposalId: c.value.proposal_id,
                      voter: c.value.voter,
                      option: (() => {
                        switch (c.value.option) {
                          case 1:
                            return m.VoteOption.VOTE_OPTION_YES;
                          case 2:
                            return m.VoteOption.VOTE_OPTION_ABSTAIN;
                          case 3:
                            return m.VoteOption.VOTE_OPTION_NO;
                          case 4:
                            return m.VoteOption.VOTE_OPTION_NO_WITH_VETO;
                          default:
                            return m.VoteOption.VOTE_OPTION_UNSPECIFIED;
                        }
                      })(),
                    }).finish(),
                  },
                ],
              },
              n,
              {
                amount: null !== (a = i.amount) && void 0 !== a ? a : [],
                gas:
                  null !== (d = i.gas) && void 0 !== d
                    ? d
                    : this.msgOpts.govVote.gas.toString(),
              },
              o,
              _.txEventsWithPreOnFulfill(s, (t) => {
                if (null == t.code || 0 === t.code) {
                  const t = this.queries.cosmos.queryGovernance.proposals.find(
                    (t) => t.id === e
                  );
                  t && t.fetch();
                  this.queries.cosmos.queryProposalVote
                    .getVote(e, this.base.bech32Address)
                    .fetch();
                }
              })
            );
          });
        }
        get queries() {
          return this.queriesStore.get(this.chainId);
        }
      }
      t.CosmosAccountImpl = P;
    },
    1678: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PrivKey = t.PubKey = t.protobufPackage = void 0);
        const i = r(n(25)),
          o = r(n(28));
        function s() {
          return { key: new Uint8Array() };
        }
        function a() {
          return { key: new Uint8Array() };
        }
        (t.protobufPackage = "cosmos.crypto.secp256k1"),
          (t.PubKey = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.key.length && t.uint32(10).bytes(e.key), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = s();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.key = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({ key: p(e.key) ? u(e.key) : new Uint8Array() }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.key &&
                  (t.key = h(void 0 !== e.key ? e.key : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = s();
              return (
                (n.key =
                  null !== (t = e.key) && void 0 !== t ? t : new Uint8Array()),
                n
              );
            },
          }),
          (t.PrivKey = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.key.length && t.uint32(10).bytes(e.key), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = a();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.key = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({ key: p(e.key) ? u(e.key) : new Uint8Array() }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.key &&
                  (t.key = h(void 0 !== e.key ? e.key : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = a();
              return (
                (n.key =
                  null !== (t = e.key) && void 0 !== t ? t : new Uint8Array()),
                n
              );
            },
          });
        var d = (() => {
          if (void 0 !== d) return d;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const c =
          d.atob || ((e) => d.Buffer.from(e, "base64").toString("binary"));
        function u(e) {
          const t = c(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const l =
          d.btoa || ((e) => d.Buffer.from(e, "binary").toString("base64"));
        function h(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return l(t.join(""));
        }
        function p(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    1679: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.ExtensionOptionsWeb3Tx = t.protobufPackage = void 0);
        const i = r(n(25)),
          o = r(n(28));
        function s() {
          return {
            typedDataChainId: "0",
            feePayer: "",
            feePayerSig: new Uint8Array(),
          };
        }
        (t.protobufPackage = "ethermint.types.v1"),
          (t.ExtensionOptionsWeb3Tx = {
            encode: (e, t = o.default.Writer.create()) => (
              "0" !== e.typedDataChainId &&
                t.uint32(8).uint64(e.typedDataChainId),
              "" !== e.feePayer && t.uint32(18).string(e.feePayer),
              0 !== e.feePayerSig.length && t.uint32(26).bytes(e.feePayerSig),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = s();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.typedDataChainId = n.uint64().toString();
                    break;
                  case 2:
                    i.feePayer = n.string();
                    break;
                  case 3:
                    i.feePayerSig = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              typedDataChainId: l(e.typedDataChainId)
                ? String(e.typedDataChainId)
                : "0",
              feePayer: l(e.feePayer) ? String(e.feePayer) : "",
              feePayerSig: l(e.feePayerSig)
                ? c(e.feePayerSig)
                : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.typedDataChainId &&
                  (t.typedDataChainId = e.typedDataChainId),
                void 0 !== e.feePayer && (t.feePayer = e.feePayer),
                void 0 !== e.feePayerSig &&
                  (t.feePayerSig = (function (e) {
                    const t = [];
                    for (const n of e) t.push(String.fromCharCode(n));
                    return u(t.join(""));
                  })(
                    void 0 !== e.feePayerSig ? e.feePayerSig : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = s();
              return (
                (i.typedDataChainId =
                  null !== (t = e.typedDataChainId) && void 0 !== t ? t : "0"),
                (i.feePayer =
                  null !== (n = e.feePayer) && void 0 !== n ? n : ""),
                (i.feePayerSig =
                  null !== (r = e.feePayerSig) && void 0 !== r
                    ? r
                    : new Uint8Array()),
                i
              );
            },
          });
        var a = (() => {
          if (void 0 !== a) return a;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const d =
          a.atob || ((e) => a.Buffer.from(e, "base64").toString("binary"));
        function c(e) {
          const t = d(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const u =
          a.btoa || ((e) => a.Buffer.from(e, "binary").toString("base64"));
        function l(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    1680: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.getKeplrFromWindow = void 0);
      t.getKeplrFromWindow = () =>
        r(void 0, void 0, void 0, function* () {
          if ("undefined" != typeof window)
            return window.keplr || "complete" === document.readyState
              ? window.keplr
              : new Promise((e) => {
                  const t = (n) => {
                    n.target &&
                      "complete" === n.target.readyState &&
                      (e(window.keplr),
                      document.removeEventListener("readystatechange", t));
                  };
                  document.addEventListener("readystatechange", t);
                });
        });
    },
    1681: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.SecretAccountImpl =
          t.defaultSecretMsgOpts =
          t.SecretAccount =
            void 0);
      const o = n(2),
        s = n(29),
        a = n(1682),
        d = n(8),
        c = n(32),
        u = i(n(266)),
        l = n(1287);
      (t.SecretAccount = {
        use: (e) => (n, r, i) => {
          const o = e.msgOptsCreator ? e.msgOptsCreator(i) : void 0;
          return {
            secret: new h(
              n,
              r,
              i,
              e.queriesStore,
              u.default(t.defaultSecretMsgOpts, o || {})
            ),
          };
        },
      }),
        (t.defaultSecretMsgOpts = {
          send: { secret20: { gas: 25e4 } },
          createSecret20ViewingKey: { gas: 15e4 },
          executeSecretWasm: { type: "wasm/MsgExecuteContract" },
        });
      class h {
        constructor(e, t, n, r, i) {
          (this.base = e),
            (this.chainGetter = t),
            (this.chainId = n),
            (this.queriesStore = r),
            (this._msgOpts = i),
            this.base.registerMakeSendTokenFn(
              this.processMakeSendTokenTx.bind(this)
            ),
            this.base.registerSendTokenFn(this.processSendToken.bind(this));
        }
        get msgOpts() {
          return this._msgOpts;
        }
        processMakeSendTokenTx(e, t, n) {
          if ("secret20" === new s.DenomHelper(t.coinMinimalDenom).type) {
            const r = (() => {
              let n = new c.Dec(e);
              return (
                (n = n.mul(c.DecUtils.getPrecisionDec(t.coinDecimals))),
                n.truncate().toString()
              );
            })();
            if (!("type" in t) || "secret20" !== t.type)
              throw new Error("Currency is not secret20");
            return (
              d.Bech32Address.validate(
                n,
                this.chainGetter.getChain(this.chainId).bech32Config
                  .bech32PrefixAccAddr
              ),
              this.makeExecuteSecretContractTx(
                "send",
                t.contractAddress,
                { transfer: { recipient: n, amount: r } },
                [],
                (e) => {
                  if (null == e.code || 0 === e.code) {
                    const e = this.queries.queryBalances
                      .getQueryBech32Address(this.base.bech32Address)
                      .balances.find(
                        (e) =>
                          e.currency.coinMinimalDenom === t.coinMinimalDenom
                      );
                    e && e.fetch();
                  }
                }
              )
            );
          }
        }
        processSendToken(e, t, n, i, o, a, d) {
          var u, h;
          return r(this, void 0, void 0, function* () {
            switch (new s.DenomHelper(t.coinMinimalDenom).type) {
              case "secret20":
                const r = (() => {
                  let n = new c.Dec(e);
                  return (
                    (n = n.mul(c.DecUtils.getPrecisionDec(t.coinDecimals))),
                    n.truncate().toString()
                  );
                })();
                if (!("type" in t) || "secret20" !== t.type)
                  throw new Error("Currency is not secret20");
                return (
                  yield this.sendExecuteSecretContractMsg(
                    "send",
                    t.contractAddress,
                    { transfer: { recipient: n, amount: r } },
                    [],
                    i,
                    {
                      amount: null !== (u = o.amount) && void 0 !== u ? u : [],
                      gas:
                        null !== (h = o.gas) && void 0 !== h
                          ? h
                          : this.msgOpts.send.secret20.gas.toString(),
                    },
                    a,
                    l.txEventsWithPreOnFulfill(d, (e) => {
                      if (null == e.code || 0 === e.code) {
                        const e = this.queries.queryBalances
                          .getQueryBech32Address(this.base.bech32Address)
                          .balances.find(
                            (e) =>
                              e.currency.coinMinimalDenom === t.coinMinimalDenom
                          );
                        e && e.fetch();
                      }
                    })
                  ),
                  !0
                );
            }
            return !1;
          });
        }
        createSecret20ViewingKey(e, t = "", n = {}, i, s) {
          var a, d;
          return r(this, void 0, void 0, function* () {
            const r = new Uint8Array(32);
            crypto.getRandomValues(r);
            const c = o.Buffer.from(r).toString("hex");
            yield this.makeExecuteSecretContractTx(
              "createSecret20ViewingKey",
              e,
              { set_viewing_key: { key: c } },
              []
            ).send(
              {
                amount: null !== (a = n.amount) && void 0 !== a ? a : [],
                gas:
                  null !== (d = n.gas) && void 0 !== d
                    ? d
                    : this.msgOpts.createSecret20ViewingKey.gas.toString(),
              },
              t,
              i,
              (e) => {
                let t = "";
                (null != e.code && 0 !== e.code) || (t = c), s && s(e, t);
              }
            );
          });
        }
        makeExecuteSecretContractTx(e = "executeSecretWasm", t, n, i, s) {
          let c;
          return (
            d.Bech32Address.validate(
              t,
              this.chainGetter.getChain(this.chainId).bech32Config
                .bech32PrefixAccAddr
            ),
            this.base.cosmos.makeTx(
              e,
              () =>
                r(this, void 0, void 0, function* () {
                  c = yield this.encryptSecretContractMsg(t, n);
                  const e = {
                    type: this.msgOpts.executeSecretWasm.type,
                    value: {
                      sender: this.base.bech32Address,
                      contract: t,
                      msg: o.Buffer.from(c).toString("base64"),
                      sent_funds: i,
                    },
                  };
                  return {
                    aminoMsgs: [e],
                    protoMsgs: [
                      {
                        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
                        value: a.MsgExecuteContract.encode(
                          a.MsgExecuteContract.fromPartial({
                            sender: d.Bech32Address.fromBech32(e.value.sender)
                              .address,
                            contract: d.Bech32Address.fromBech32(
                              e.value.contract
                            ).address,
                            msg: o.Buffer.from(e.value.msg, "base64"),
                            sentFunds: e.value.sent_funds,
                          })
                        ).finish(),
                      },
                    ],
                  };
                }),
              s
            )
          );
        }
        sendExecuteSecretContractMsg(
          e = "executeSecretWasm",
          t,
          n,
          i,
          s = "",
          c,
          u,
          l
        ) {
          var h;
          return r(this, void 0, void 0, function* () {
            let p;
            return (
              yield this.base.cosmos.sendMsgs(
                e,
                () =>
                  r(this, void 0, void 0, function* () {
                    p = yield this.encryptSecretContractMsg(t, n);
                    const e = {
                      type: this.msgOpts.executeSecretWasm.type,
                      value: {
                        sender: this.base.bech32Address,
                        contract: t,
                        msg: o.Buffer.from(p).toString("base64"),
                        sent_funds: i,
                      },
                    };
                    return {
                      aminoMsgs: [e],
                      protoMsgs: [
                        {
                          typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
                          value: a.MsgExecuteContract.encode(
                            a.MsgExecuteContract.fromPartial({
                              sender: d.Bech32Address.fromBech32(e.value.sender)
                                .address,
                              contract: d.Bech32Address.fromBech32(
                                e.value.contract
                              ).address,
                              msg: o.Buffer.from(e.value.msg, "base64"),
                              sentFunds: e.value.sent_funds,
                            })
                          ).finish(),
                        },
                      ],
                    };
                  }),
                s,
                {
                  amount: null !== (h = c.amount) && void 0 !== h ? h : [],
                  gas: c.gas,
                },
                u,
                l
              ),
              p
            );
          });
        }
        encryptSecretContractMsg(e, t) {
          return r(this, void 0, void 0, function* () {
            const n = yield this.queries.secret.querySecretContractCodeHash
              .getQueryContract(e)
              .waitResponse();
            if (!n)
              throw new Error(`Can't get the code hash of the contract (${e})`);
            const r = n.data.code_hash,
              i = yield this.base.getKeplr();
            if (!i) throw new Error("Can't get the Keplr API");
            const o = i.getEnigmaUtils(this.chainId);
            return yield o.encrypt(r, t);
          });
        }
        get queries() {
          return this.queriesStore.get(this.chainId);
        }
      }
      t.SecretAccountImpl = h;
    },
    1682: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MsgExecuteContract =
            t.MsgInstantiateContract =
            t.MsgStoreCode =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(93);
        function a() {
          return {
            sender: new Uint8Array(),
            wasmByteCode: new Uint8Array(),
            source: "",
            builder: "",
          };
        }
        function d() {
          return {
            sender: new Uint8Array(),
            callbackCodeHash: "",
            codeId: "0",
            label: "",
            initMsg: new Uint8Array(),
            initFunds: [],
            callbackSig: new Uint8Array(),
          };
        }
        function c() {
          return {
            sender: new Uint8Array(),
            contract: new Uint8Array(),
            msg: new Uint8Array(),
            callbackCodeHash: "",
            sentFunds: [],
            callbackSig: new Uint8Array(),
          };
        }
        (t.protobufPackage = "secret.compute.v1beta1"),
          (t.MsgStoreCode = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.sender.length && t.uint32(10).bytes(e.sender),
              0 !== e.wasmByteCode.length && t.uint32(18).bytes(e.wasmByteCode),
              "" !== e.source && t.uint32(26).string(e.source),
              "" !== e.builder && t.uint32(34).string(e.builder),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = a();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.bytes();
                    break;
                  case 2:
                    i.wasmByteCode = n.bytes();
                    break;
                  case 3:
                    i.source = n.string();
                    break;
                  case 4:
                    i.builder = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: g(e.sender) ? h(e.sender) : new Uint8Array(),
              wasmByteCode: g(e.wasmByteCode)
                ? h(e.wasmByteCode)
                : new Uint8Array(),
              source: g(e.source) ? String(e.source) : "",
              builder: g(e.builder) ? String(e.builder) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender &&
                  (t.sender = f(
                    void 0 !== e.sender ? e.sender : new Uint8Array()
                  )),
                void 0 !== e.wasmByteCode &&
                  (t.wasmByteCode = f(
                    void 0 !== e.wasmByteCode
                      ? e.wasmByteCode
                      : new Uint8Array()
                  )),
                void 0 !== e.source && (t.source = e.source),
                void 0 !== e.builder && (t.builder = e.builder),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = a();
              return (
                (o.sender =
                  null !== (t = e.sender) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (o.wasmByteCode =
                  null !== (n = e.wasmByteCode) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (o.source = null !== (r = e.source) && void 0 !== r ? r : ""),
                (o.builder = null !== (i = e.builder) && void 0 !== i ? i : ""),
                o
              );
            },
          }),
          (t.MsgInstantiateContract = {
            encode(e, t = o.default.Writer.create()) {
              0 !== e.sender.length && t.uint32(10).bytes(e.sender),
                "" !== e.callbackCodeHash &&
                  t.uint32(18).string(e.callbackCodeHash),
                "0" !== e.codeId && t.uint32(24).uint64(e.codeId),
                "" !== e.label && t.uint32(34).string(e.label),
                0 !== e.initMsg.length && t.uint32(42).bytes(e.initMsg);
              for (const n of e.initFunds)
                s.Coin.encode(n, t.uint32(50).fork()).ldelim();
              return (
                0 !== e.callbackSig.length && t.uint32(58).bytes(e.callbackSig),
                t
              );
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = d();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.bytes();
                    break;
                  case 2:
                    i.callbackCodeHash = n.string();
                    break;
                  case 3:
                    i.codeId = n.uint64().toString();
                    break;
                  case 4:
                    i.label = n.string();
                    break;
                  case 5:
                    i.initMsg = n.bytes();
                    break;
                  case 6:
                    i.initFunds.push(s.Coin.decode(n, n.uint32()));
                    break;
                  case 7:
                    i.callbackSig = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: g(e.sender) ? h(e.sender) : new Uint8Array(),
              callbackCodeHash: g(e.callbackCodeHash)
                ? String(e.callbackCodeHash)
                : "",
              codeId: g(e.codeId) ? String(e.codeId) : "0",
              label: g(e.label) ? String(e.label) : "",
              initMsg: g(e.initMsg) ? h(e.initMsg) : new Uint8Array(),
              initFunds: Array.isArray(null == e ? void 0 : e.initFunds)
                ? e.initFunds.map((e) => s.Coin.fromJSON(e))
                : [],
              callbackSig: g(e.callbackSig)
                ? h(e.callbackSig)
                : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender &&
                  (t.sender = f(
                    void 0 !== e.sender ? e.sender : new Uint8Array()
                  )),
                void 0 !== e.callbackCodeHash &&
                  (t.callbackCodeHash = e.callbackCodeHash),
                void 0 !== e.codeId && (t.codeId = e.codeId),
                void 0 !== e.label && (t.label = e.label),
                void 0 !== e.initMsg &&
                  (t.initMsg = f(
                    void 0 !== e.initMsg ? e.initMsg : new Uint8Array()
                  )),
                e.initFunds
                  ? (t.initFunds = e.initFunds.map((e) =>
                      e ? s.Coin.toJSON(e) : void 0
                    ))
                  : (t.initFunds = []),
                void 0 !== e.callbackSig &&
                  (t.callbackSig = f(
                    void 0 !== e.callbackSig ? e.callbackSig : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i, o, a, c;
              const u = d();
              return (
                (u.sender =
                  null !== (t = e.sender) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (u.callbackCodeHash =
                  null !== (n = e.callbackCodeHash) && void 0 !== n ? n : ""),
                (u.codeId = null !== (r = e.codeId) && void 0 !== r ? r : "0"),
                (u.label = null !== (i = e.label) && void 0 !== i ? i : ""),
                (u.initMsg =
                  null !== (o = e.initMsg) && void 0 !== o
                    ? o
                    : new Uint8Array()),
                (u.initFunds =
                  (null === (a = e.initFunds) || void 0 === a
                    ? void 0
                    : a.map((e) => s.Coin.fromPartial(e))) || []),
                (u.callbackSig =
                  null !== (c = e.callbackSig) && void 0 !== c
                    ? c
                    : new Uint8Array()),
                u
              );
            },
          }),
          (t.MsgExecuteContract = {
            encode(e, t = o.default.Writer.create()) {
              0 !== e.sender.length && t.uint32(10).bytes(e.sender),
                0 !== e.contract.length && t.uint32(18).bytes(e.contract),
                0 !== e.msg.length && t.uint32(26).bytes(e.msg),
                "" !== e.callbackCodeHash &&
                  t.uint32(34).string(e.callbackCodeHash);
              for (const n of e.sentFunds)
                s.Coin.encode(n, t.uint32(42).fork()).ldelim();
              return (
                0 !== e.callbackSig.length && t.uint32(50).bytes(e.callbackSig),
                t
              );
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = c();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.bytes();
                    break;
                  case 2:
                    i.contract = n.bytes();
                    break;
                  case 3:
                    i.msg = n.bytes();
                    break;
                  case 4:
                    i.callbackCodeHash = n.string();
                    break;
                  case 5:
                    i.sentFunds.push(s.Coin.decode(n, n.uint32()));
                    break;
                  case 6:
                    i.callbackSig = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: g(e.sender) ? h(e.sender) : new Uint8Array(),
              contract: g(e.contract) ? h(e.contract) : new Uint8Array(),
              msg: g(e.msg) ? h(e.msg) : new Uint8Array(),
              callbackCodeHash: g(e.callbackCodeHash)
                ? String(e.callbackCodeHash)
                : "",
              sentFunds: Array.isArray(null == e ? void 0 : e.sentFunds)
                ? e.sentFunds.map((e) => s.Coin.fromJSON(e))
                : [],
              callbackSig: g(e.callbackSig)
                ? h(e.callbackSig)
                : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender &&
                  (t.sender = f(
                    void 0 !== e.sender ? e.sender : new Uint8Array()
                  )),
                void 0 !== e.contract &&
                  (t.contract = f(
                    void 0 !== e.contract ? e.contract : new Uint8Array()
                  )),
                void 0 !== e.msg &&
                  (t.msg = f(void 0 !== e.msg ? e.msg : new Uint8Array())),
                void 0 !== e.callbackCodeHash &&
                  (t.callbackCodeHash = e.callbackCodeHash),
                e.sentFunds
                  ? (t.sentFunds = e.sentFunds.map((e) =>
                      e ? s.Coin.toJSON(e) : void 0
                    ))
                  : (t.sentFunds = []),
                void 0 !== e.callbackSig &&
                  (t.callbackSig = f(
                    void 0 !== e.callbackSig ? e.callbackSig : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i, o, a;
              const d = c();
              return (
                (d.sender =
                  null !== (t = e.sender) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (d.contract =
                  null !== (n = e.contract) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (d.msg =
                  null !== (r = e.msg) && void 0 !== r ? r : new Uint8Array()),
                (d.callbackCodeHash =
                  null !== (i = e.callbackCodeHash) && void 0 !== i ? i : ""),
                (d.sentFunds =
                  (null === (o = e.sentFunds) || void 0 === o
                    ? void 0
                    : o.map((e) => s.Coin.fromPartial(e))) || []),
                (d.callbackSig =
                  null !== (a = e.callbackSig) && void 0 !== a
                    ? a
                    : new Uint8Array()),
                d
              );
            },
          });
        var u = (() => {
          if (void 0 !== u) return u;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const l =
          u.atob || ((e) => u.Buffer.from(e, "base64").toString("binary"));
        function h(e) {
          const t = l(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const p =
          u.btoa || ((e) => u.Buffer.from(e, "binary").toString("base64"));
        function f(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return p(t.join(""));
        }
        function g(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    1683: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.AccountStore = void 0);
      const r = n(199),
        i = n(1340);
      class o extends r.HasMapStore {
        constructor(e, t, n, ...o) {
          super((o) => {
            const s = new i.AccountSetBaseSuper(e, t, o, n(o));
            return r.mergeStores(
              s,
              [this.chainGetter, o],
              ...this.accountSetCreators
            );
          }),
            (this.eventListener = e),
            (this.chainGetter = t),
            (this.storeOptsCreator = n),
            (this.accountSetCreators = o);
        }
        getAccount(e) {
          return this.get(e);
        }
        hasAccount(e) {
          return this.has(e);
        }
      }
      t.AccountStore = o;
    },
    1684: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryMap =
          t.ObservableQuery =
          t.ObservableQueryBase =
          t.DeferInitialQueryController =
          t.defaultOptions =
            void 0);
      const s = n(7),
        a = o(n(62)),
        d = n(29),
        c = n(1342),
        u = o(n(1423));
      t.defaultOptions = { cacheMaxAge: 0, fetchingInterval: 0 };
      class l extends Error {
        constructor(e) {
          super(e), Object.setPrototypeOf(this, l.prototype);
        }
      }
      class h {
        constructor() {
          this.rejectors = [];
        }
        get hasCancelable() {
          return this.rejectors.length > 0;
        }
        cancel(e) {
          for (; this.rejectors.length > 0; ) {
            const t = this.rejectors.shift();
            t && (t.reject(new l(e)), t.onCancel && t.onCancel());
          }
        }
        callOrCanceledWithPromise(e, t) {
          return new Promise((n, r) => {
            this.rejectors.push({ reject: r, onCancel: t }),
              e.then(
                (e) => {
                  const t = this.rejectors.findIndex((e) => e.reject === r);
                  t >= 0 && this.rejectors.splice(t, 1), n(e);
                },
                (e) => {
                  const t = this.rejectors.findIndex((e) => e.reject === r);
                  t >= 0 && this.rejectors.splice(t, 1), r(e);
                }
              );
          });
        }
        callOrCanceled(e, t) {
          return new Promise((n, r) => {
            this.rejectors.push({ reject: r, onCancel: t }),
              Promise.resolve().then(() => {
                this.rejectors.find((e) => e.reject === r) &&
                  e().then(
                    (e) => {
                      const t = this.rejectors.findIndex((e) => e.reject === r);
                      t >= 0 && this.rejectors.splice(t, 1), n(e);
                    },
                    (e) => {
                      const t = this.rejectors.findIndex((e) => e.reject === r);
                      t >= 0 && this.rejectors.splice(t, 1), r(e);
                    }
                  );
              });
          });
        }
      }
      class p {
        constructor() {
          (this._isReady = !1), s.makeObservable(this);
        }
        ready() {
          this._isReady = !0;
        }
        wait() {
          return this.isReady
            ? Promise.resolve()
            : new Promise((e) => {
                const t = s.autorun(() => {
                  this.isReady && (e(), t && t());
                });
              });
        }
        get isReady() {
          return this._isReady;
        }
      }
      r([s.observable], p.prototype, "_isReady", void 0),
        r([s.action], p.prototype, "ready", null),
        (t.DeferInitialQueryController = p);
      class f {
        constructor(e, n) {
          (this._response = void 0),
            (this._isFetching = !1),
            (this._error = void 0),
            (this._isStarted = !1),
            (this._pendingOnStart = !1),
            (this.observedCount = 0),
            (this.intervalId = void 0),
            (this.becomeObserved = () => {
              0 === this.observedCount && this.start(), this.observedCount++;
            }),
            (this.becomeUnobserved = () => {
              this.observedCount--, 0 === this.observedCount && this.stop();
            }),
            (this.intervalFetch = () => {
              this.isFetching || this.fetch();
            }),
            (this.options = Object.assign(
              Object.assign({}, t.defaultOptions),
              n
            )),
            (this._instance = e),
            (this.queryCanceler = new h()),
            (this.onStartCanceler = new h()),
            (this.queryControllerConceler = new h()),
            s.makeObservable(this),
            s.onBecomeObserved(this, "_response", this.becomeObserved),
            s.onBecomeObserved(this, "_isFetching", this.becomeObserved),
            s.onBecomeObserved(this, "_error", this.becomeObserved),
            s.onBecomeUnobserved(this, "_response", this.becomeUnobserved),
            s.onBecomeUnobserved(this, "_isFetching", this.becomeUnobserved),
            s.onBecomeUnobserved(this, "_error", this.becomeUnobserved);
        }
        static guessResponseTruncated(e, t) {
          return (
            e &&
            "string" == typeof e["content-type"] &&
            e["content-type"].startsWith("application/json") &&
            t.startsWith("{")
          );
        }
        get isObserved() {
          return this.observedCount > 0;
        }
        start() {
          if (!this._isStarted) {
            this._isStarted = !0;
            const e = this.onStart();
            e ? this.handleAsyncOnStart(e) : this.postStart();
          }
        }
        *handleAsyncOnStart(e) {
          (this._pendingOnStart = !0), (this._isFetching = !0);
          try {
            yield this.onStartCanceler.callOrCanceledWithPromise(e),
              this._isStarted &&
                ((this._pendingOnStart = !1), this.postStart());
          } catch (e) {
            if (e instanceof l) return;
            throw e;
          }
        }
        stop() {
          this._isStarted &&
            (this.onStartCanceler.hasCancelable &&
              this.onStartCanceler.cancel(),
            this.isFetching &&
              this.queryCanceler.hasCancelable &&
              this.cancel(),
            (this._pendingOnStart = !1),
            (this._isFetching = !1),
            null != this.intervalId && clearInterval(this.intervalId),
            (this.intervalId = void 0),
            this.onStop(),
            (this._isStarted = !1));
        }
        get isStarted() {
          return this._isStarted;
        }
        postStart() {
          this.fetch(),
            this.options.fetchingInterval > 0 &&
              (this.intervalId = setInterval(
                this.intervalFetch,
                this.options.fetchingInterval
              ));
        }
        onStart() {}
        onStop() {}
        canFetch() {
          return !0;
        }
        get isFetching() {
          return this._isFetching;
        }
        get instance() {
          return this._instance;
        }
        *fetch() {
          var e, t, n;
          if (!this.isStarted || this._pendingOnStart) return;
          if (
            f.experimentalDeferInitialQueryController &&
            !f.experimentalDeferInitialQueryController.isReady
          ) {
            (this._isFetching = !0),
              this.queryControllerConceler.hasCancelable &&
                this.queryControllerConceler.cancel();
            try {
              yield this.queryControllerConceler.callOrCanceled(() => {
                var e, t;
                return null !==
                  (t =
                    null === (e = f.experimentalDeferInitialQueryController) ||
                    void 0 === e
                      ? void 0
                      : e.wait()) && void 0 !== t
                  ? t
                  : Promise.resolve();
              });
            } catch (e) {
              if (e instanceof l) return;
              throw e;
            }
            if (!this.isStarted) return;
          }
          if (!this.canFetch()) return;
          if (
            (this.isFetching &&
              this.queryCanceler.hasCancelable &&
              this.cancel("__fetching__proceed__next__"),
            this._response)
          ) {
            if (
              this.options.cacheMaxAge > 0 &&
              this._response.timestamp > Date.now() - this.options.cacheMaxAge
            )
              return void (this._isFetching = !1);
            (this._isFetching = !0),
              this.setResponse(
                Object.assign(Object.assign({}, this._response), { staled: !0 })
              );
          } else {
            this._isFetching = !0;
            const e = this.loadStaledResponse(),
              t = (e) =>
                !(
                  !e ||
                  this._response ||
                  !(
                    this.options.cacheMaxAge <= 0 ||
                    e.timestamp > Date.now() - this.options.cacheMaxAge
                  )
                ) && (this.setResponse(e), !0);
            if (this.options.cacheMaxAge <= 0)
              e.then((e) => {
                t(e);
              });
            else {
              const n = yield* d.toGenerator(e);
              if (t(n)) return void (this._isFetching = !1);
            }
          }
          const r = new AbortController();
          let i = !1,
            o = !1;
          try {
            let e = !1,
              { response: t, headers: n } = yield* d.toGenerator(
                this.queryCanceler.callOrCanceled(
                  () => ((e = !0), this.fetchResponse(r)),
                  () => {
                    e && r.abort();
                  }
                )
              );
            if (
              t.data &&
              "string" == typeof t.data &&
              (t.data.startsWith("stream was reset:") ||
                g.suspectedResponseDatasWithInvalidValue.includes(t.data) ||
                g.guessResponseTruncated(n, t.data))
            ) {
              if (r.signal.aborted) return;
              console.log(
                "There is an unknown problem to the response. Request one more time."
              );
              let e = !1;
              const i = yield* d.toGenerator(
                this.queryCanceler.callOrCanceled(
                  () => ((e = !0), this.fetchResponse(r)),
                  () => {
                    e && r.abort();
                  }
                )
              );
              if (
                ((t = i.response),
                (n = i.headers),
                t.data && "string" == typeof t.data)
              ) {
                if (
                  t.data.startsWith("stream was reset:") ||
                  g.suspectedResponseDatasWithInvalidValue.includes(t.data)
                )
                  throw new Error(t.data);
                if (g.guessResponseTruncated(n, t.data))
                  throw new Error("The response data seems to be truncated");
              }
            }
            this.setResponse(t), this.setError(void 0), this.saveResponse(t);
          } catch (r) {
            if (a.default.isCancel(r)) return void (o = !0);
            if (r instanceof l)
              return void (
                "__fetching__proceed__next__" === r.message && (i = !0)
              );
            if (r.response) {
              let i = r.response.statusText;
              const o =
                "string" ==
                typeof (null === (e = r.response.headers) || void 0 === e
                  ? void 0
                  : e["content-type"])
                  ? r.response.headers["content-type"]
                  : "";
              o.startsWith("text/plain") &&
                "string" == typeof r.response.data &&
                (i = r.response.data),
                o.startsWith("application/json") &&
                  (null === (t = r.response.data) || void 0 === t
                    ? void 0
                    : t.message) &&
                  "string" ==
                    typeof (null === (n = r.response.data) || void 0 === n
                      ? void 0
                      : n.message) &&
                  (i = r.response.data.message);
              const s = {
                status: r.response.status,
                statusText: r.response.statusText,
                message: i,
                data: r.response.data,
              };
              this.setError(s);
            } else if (r.request) {
              const e = {
                status: 0,
                statusText: "Failed to get response",
                message: "Failed to get response",
              };
              this.setError(e);
            } else {
              const e = {
                status: 0,
                statusText: r.message,
                message: r.message,
                data: r,
              };
              this.setError(e);
            }
          } finally {
            o || i || (this._isFetching = !1);
          }
        }
        get response() {
          return this._response;
        }
        get error() {
          return this._error;
        }
        setResponse(e) {
          this._response = e;
        }
        setError(e) {
          this._error = e;
        }
        cancel(e) {
          this.queryCanceler.cancel(e);
        }
        waitResponse() {
          if (this.response) return Promise.resolve(this.response);
          const e = [];
          let t = !1;
          return (
            e.push(
              s.reaction(
                () => this.isFetching,
                () => {
                  t || (this.isFetching || this.fetch(), (t = !0));
                },
                { fireImmediately: !0 }
              )
            ),
            new Promise((t) => {
              const n = s.autorun(() => {
                this.isFetching || t(this.response);
              });
              e.push(n);
            }).finally(() => {
              for (const t of e) t();
            })
          );
        }
        waitFreshResponse() {
          const e = [];
          let t = !1;
          return (
            e.push(
              s.reaction(
                () => this.isFetching,
                () => {
                  t || (this.isFetching || this.fetch(), (t = !0));
                },
                { fireImmediately: !0 }
              )
            ),
            new Promise((t) => {
              const n = s.autorun(() => {
                this.isFetching || t(this.response);
              });
              e.push(n);
            }).finally(() => {
              for (const t of e) t();
            })
          );
        }
      }
      (f.experimentalDeferInitialQueryController = void 0),
        (f.suspectedResponseDatasWithInvalidValue = [
          "The network connection was lost.",
          "The request timed out.",
        ]),
        r([s.observable.ref], f.prototype, "_response", void 0),
        r([s.observable], f.prototype, "_isFetching", void 0),
        r([s.observable.ref], f.prototype, "_error", void 0),
        r([s.observable], f.prototype, "_isStarted", void 0),
        r([s.observable.ref], f.prototype, "_instance", void 0),
        r([s.action], f.prototype, "start", null),
        r([s.flow], f.prototype, "handleAsyncOnStart", null),
        r([s.action], f.prototype, "stop", null),
        r([s.computed], f.prototype, "instance", null),
        r([s.flow], f.prototype, "fetch", null),
        r([s.action], f.prototype, "setResponse", null),
        r([s.action], f.prototype, "setError", null),
        (t.ObservableQueryBase = f);
      class g extends f {
        constructor(e, t, n, r = {}) {
          super(t, r),
            (this.kvStore = e),
            (this._url = ""),
            (this.refreshHandler = (e) => {
              (null == e ? void 0 : e.ifError)
                ? this.error && this.fetch()
                : this.fetch();
            }),
            s.makeObservable(this),
            this.setUrl(n);
        }
        static refreshAllObserved() {
          g.eventListener.emit("refresh");
        }
        static refreshAllObservedIfError() {
          g.eventListener.emit("refresh", { ifError: !0 });
        }
        onStart() {
          super.onStart(),
            g.eventListener.addListener("refresh", this.refreshHandler);
        }
        onStop() {
          super.onStop(),
            g.eventListener.addListener("refresh", this.refreshHandler);
        }
        get url() {
          return this._url;
        }
        setUrl(e) {
          this._url !== e && ((this._url = e), this.fetch());
        }
        fetchResponse(e) {
          return i(this, void 0, void 0, function* () {
            const t = yield this.instance.get(this.url, { signal: e.signal });
            return {
              headers: t.headers,
              response: {
                data: t.data,
                status: t.status,
                staled: !1,
                timestamp: Date.now(),
              },
            };
          });
        }
        getCacheKey() {
          return `${this.instance.name}-${
            this.instance.defaults.baseURL
          }${this.instance.getUri({ url: this.url })}`;
        }
        saveResponse(e) {
          return i(this, void 0, void 0, function* () {
            const t = this.getCacheKey();
            yield this.kvStore.set(t, e);
          });
        }
        loadStaledResponse() {
          return i(this, void 0, void 0, function* () {
            const e = this.getCacheKey(),
              t = yield this.kvStore.get(e);
            if (t) return Object.assign(Object.assign({}, t), { staled: !0 });
          });
        }
      }
      (g.eventListener = new u.default()),
        r([s.observable], g.prototype, "_url", void 0),
        r([s.action], g.prototype, "setUrl", null),
        (t.ObservableQuery = g);
      class m extends c.HasMapStore {
        constructor(e) {
          super(e);
        }
      }
      t.ObservableQueryMap = m;
    },
    1685: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableJsonRPCQueryMap = t.ObservableJsonRPCQuery = void 0);
      const o = n(1422),
        s = n(7),
        a = n(60),
        d = n(2),
        c = n(1342);
      class u extends o.ObservableQuery {
        constructor(e, t, n, r, i, o = {}) {
          super(e, t, n, o),
            (this.method = r),
            (this._params = i),
            s.makeObservable(this);
        }
        get params() {
          return this._params;
        }
        setParams(e) {
          (this._params = e), this.fetch();
        }
        fetchResponse(e) {
          return i(this, void 0, void 0, function* () {
            const t = yield this.instance.post(
              this.url,
              {
                jsonrpc: "2.0",
                id: "1",
                method: this.method,
                params: this.params,
              },
              { signal: e.signal }
            );
            if (t.data.error && t.data.error.message)
              throw new Error(t.data.error.message);
            if (!t.data.result) throw new Error("Unknown error");
            return {
              headers: t.headers,
              response: {
                data: t.data.result,
                status: t.status,
                staled: !1,
                timestamp: Date.now(),
              },
            };
          });
        }
        getCacheKey() {
          const e = d.Buffer.from(
            a.Hash.sha256(d.Buffer.from(JSON.stringify(this.params))).slice(
              0,
              8
            )
          ).toString("hex");
          return `${super.getCacheKey()}-${this.method}-${e}`;
        }
      }
      r([s.observable.ref], u.prototype, "_params", void 0),
        r([s.action], u.prototype, "setParams", null),
        (t.ObservableJsonRPCQuery = u);
      class l extends c.HasMapStore {
        constructor(e) {
          super(e);
        }
      }
      t.ObservableJsonRPCQueryMap = l;
    },
    1686: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.StoreUtils = void 0);
      const r = n(32);
      class i {
        static getBalancesFromCurrencies(e, t) {
          const n = [];
          for (const i of t) {
            const t = e[i.denom];
            if (t) {
              const e = new r.Dec(i.amount);
              e.truncate().gt(new r.Int(0)) && n.push(new r.CoinPretty(t, e));
            }
          }
          return n;
        }
        static getBalanceFromCurrency(e, t) {
          const n = i.getBalancesFromCurrencies({ [e.coinMinimalDenom]: e }, t);
          return 1 === n.length
            ? n[0]
            : new r.CoinPretty(e, new r.Int(0)).ready(!1);
        }
      }
      t.StoreUtils = i;
    },
    1687: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1688: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.mergeStores = void 0);
      t.mergeStores = (e, t, ...n) => {
        for (let r = 0; r < n.length; r++) {
          const i = (0, n[r])(e, ...t);
          for (const t of Object.keys(i)) {
            if (e[t]) throw new Error(t + " is already merged");
            e[t] = i[t];
          }
        }
        return e;
      };
    },
    1689: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmwasmAccountImpl =
          t.defaultCosmwasmMsgOpts =
          t.CosmwasmAccount =
            void 0);
      const o = n(29),
        s = n(32),
        a = n(674),
        d = n(2),
        c = i(n(266)),
        u = n(1287),
        l = n(8);
      (t.CosmwasmAccount = {
        use: (e) => (n, r, i) => {
          const o = e.msgOptsCreator ? e.msgOptsCreator(i) : void 0;
          return {
            cosmwasm: new h(
              n,
              r,
              i,
              e.queriesStore,
              c.default(t.defaultCosmwasmMsgOpts, o || {})
            ),
          };
        },
      }),
        (t.defaultCosmwasmMsgOpts = {
          send: { cw20: { gas: 15e4 } },
          executeWasm: { type: "wasm/MsgExecuteContract" },
        });
      class h {
        constructor(e, t, n, r, i) {
          (this.base = e),
            (this.chainGetter = t),
            (this.chainId = n),
            (this.queriesStore = r),
            (this._msgOpts = i),
            this.base.registerMakeSendTokenFn(
              this.processMakeSendTokenTx.bind(this)
            ),
            this.base.registerSendTokenFn(this.processSendToken.bind(this));
        }
        get msgOpts() {
          return this._msgOpts;
        }
        processMakeSendTokenTx(e, t, n) {
          if ("cw20" === new o.DenomHelper(t.coinMinimalDenom).type) {
            const r = (() => {
              let n = new s.Dec(e);
              return (
                (n = n.mul(s.DecUtils.getPrecisionDec(t.coinDecimals))),
                n.truncate().toString()
              );
            })();
            if (!("type" in t) || "cw20" !== t.type)
              throw new Error("Currency is not cw20");
            return (
              l.Bech32Address.validate(
                n,
                this.chainGetter.getChain(this.chainId).bech32Config
                  .bech32PrefixAccAddr
              ),
              this.makeExecuteContractTx(
                "send",
                t.contractAddress,
                { transfer: { recipient: n, amount: r } },
                [],
                (e) => {
                  if (null == e.code || 0 === e.code) {
                    const e = this.queries.queryBalances
                      .getQueryBech32Address(this.base.bech32Address)
                      .balances.find(
                        (e) =>
                          e.currency.coinMinimalDenom === t.coinMinimalDenom
                      );
                    e && e.fetch();
                  }
                }
              )
            );
          }
        }
        processSendToken(e, t, n, i, a, d, c) {
          var l, h;
          return r(this, void 0, void 0, function* () {
            switch (new o.DenomHelper(t.coinMinimalDenom).type) {
              case "cw20":
                const r = (() => {
                  let n = new s.Dec(e);
                  return (
                    (n = n.mul(s.DecUtils.getPrecisionDec(t.coinDecimals))),
                    n.truncate().toString()
                  );
                })();
                if (!("type" in t) || "cw20" !== t.type)
                  throw new Error("Currency is not cw20");
                return (
                  yield this.sendExecuteContractMsg(
                    "send",
                    t.contractAddress,
                    { transfer: { recipient: n, amount: r } },
                    [],
                    i,
                    {
                      amount: null !== (l = a.amount) && void 0 !== l ? l : [],
                      gas:
                        null !== (h = a.gas) && void 0 !== h
                          ? h
                          : this.msgOpts.send.cw20.gas.toString(),
                    },
                    d,
                    u.txEventsWithPreOnFulfill(c, (e) => {
                      if (null == e.code || 0 === e.code) {
                        const e = this.queries.queryBalances
                          .getQueryBech32Address(this.base.bech32Address)
                          .balances.find(
                            (e) =>
                              e.currency.coinMinimalDenom === t.coinMinimalDenom
                          );
                        e && e.fetch();
                      }
                    })
                  ),
                  !0
                );
            }
            return !1;
          });
        }
        makeExecuteContractTx(e = "executeWasm", t, n, r, i) {
          l.Bech32Address.validate(
            t,
            this.chainGetter.getChain(this.chainId).bech32Config
              .bech32PrefixAccAddr
          );
          const o = {
            type: this.msgOpts.executeWasm.type,
            value: {
              sender: this.base.bech32Address,
              contract: t,
              msg: n,
              funds: r,
            },
          };
          return this.base.cosmos.makeTx(
            e,
            {
              aminoMsgs: [o],
              protoMsgs: [
                {
                  typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                  value: a.MsgExecuteContract.encode({
                    sender: o.value.sender,
                    contract: o.value.contract,
                    msg: d.Buffer.from(JSON.stringify(o.value.msg)),
                    funds: o.value.funds,
                  }).finish(),
                },
              ],
            },
            i
          );
        }
        sendExecuteContractMsg(e = "executeWasm", t, n, i, o = "", s, c, u) {
          var l;
          return r(this, void 0, void 0, function* () {
            const r = {
              type: this.msgOpts.executeWasm.type,
              value: {
                sender: this.base.bech32Address,
                contract: t,
                msg: n,
                funds: i,
              },
            };
            yield this.base.cosmos.sendMsgs(
              e,
              {
                aminoMsgs: [r],
                protoMsgs: [
                  {
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: a.MsgExecuteContract.encode({
                      sender: r.value.sender,
                      contract: r.value.contract,
                      msg: d.Buffer.from(JSON.stringify(r.value.msg)),
                      funds: r.value.funds,
                    }).finish(),
                  },
                ],
              },
              o,
              {
                amount: null !== (l = s.amount) && void 0 !== l ? l : [],
                gas: s.gas,
              },
              c,
              u
            );
          });
        }
        get queries() {
          return this.queriesStore.get(this.chainId);
        }
      }
      t.CosmwasmAccountImpl = h;
    },
    1690: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CoinGeckoPriceStore = void 0);
      const s = n(199),
        a = o(n(62)),
        d = n(29),
        c = n(32),
        u = o(n(266)),
        l = n(7);
      class h {
        constructor(e) {
          (this.duration = e),
            (this.fns = []),
            (this.callback = () => {
              if (
                (null != this.timeoutId &&
                  (clearTimeout(this.timeoutId), (this.timeoutId = void 0)),
                this.fns.length > 0)
              ) {
                (0, this.fns[this.fns.length - 1])(), (this.fns = []);
              }
            });
        }
        call(e) {
          this.duration <= 0
            ? e()
            : (this.fns.push(e),
              null != this.timeoutId && clearTimeout(this.timeoutId),
              (this.timeoutId = setTimeout(this.callback, this.duration)));
        }
      }
      class p {
        constructor(e, t, n = 0) {
          if (
            ((this.array = []),
            (this.map = {}),
            (this.restored = {}),
            (this.isRestored = !1),
            (this.storeKey = ""),
            !t)
          )
            throw new Error("Empty store key");
          (this.kvStore = e), (this.storeKey = t), (this.throttler = new h(n));
        }
        has(e) {
          return !0 === this.map[e];
        }
        add(...e) {
          let t = !1,
            n = [];
          for (const r of e)
            this.isRestored &&
              this.restored[r] &&
              ((t = !0), delete this.restored[r]),
              this.has(r) || n.push(r);
          if (0 === n.length)
            return (
              this.isRestored && t && this.throttler.call(() => this.save()), !1
            );
          n = [...new Set(n)];
          for (const e of n) this.map[e] = !0;
          let r = this.array.slice().concat(n);
          return (
            (r = r.sort((e, t) => (e < t ? -1 : 1))),
            (this.array = r),
            this.isRestored && this.throttler.call(() => this.save()),
            !0
          );
        }
        get values() {
          return this.array.slice();
        }
        save() {
          return i(this, void 0, void 0, function* () {
            yield this.kvStore.set(
              this.storeKey,
              this.array.filter((e) => !this.restored[e])
            );
          });
        }
        restore() {
          return i(this, void 0, void 0, function* () {
            const e = yield this.kvStore.get(this.storeKey);
            if (e) {
              for (const t of e) this.restored[t] = !0;
              for (const e of this.array)
                this.restored[e] && delete this.restored[e];
              this.add(...e);
            }
            this.isRestored = !0;
          });
        }
      }
      class f extends s.ObservableQuery {
        constructor(e, t, n, r = {}) {
          var i;
          super(
            e,
            a.default.create({
              baseURL: r.baseURL || "https://api.coingecko.com/api/v3",
            }),
            "/simple/price"
          ),
            (this.isInitialized = !1);
          const o = null !== (i = r.throttleDuration) && void 0 !== i ? i : 250;
          (this._coinIds = new p(e, "__coin_ids", o)),
            (this._vsCurrencies = new p(e, "__vs_currencies", o)),
            (this._defaultVsCurrency = n),
            (this._supportedVsCurrencies = t),
            (this._throttler = new h(o)),
            l.makeObservable(this),
            this.restoreDefaultVsCurrency();
        }
        onStart() {
          return super.onStart(), this.init();
        }
        init() {
          return i(this, void 0, void 0, function* () {
            this.isInitialized ||
              (yield Promise.all([
                this._coinIds.restore(),
                this._vsCurrencies.restore(),
              ]),
              this._coinIds.save(),
              this._vsCurrencies.save(),
              this.updateURL([], [], !0),
              (this.isInitialized = !0));
          });
        }
        get defaultVsCurrency() {
          return this._defaultVsCurrency;
        }
        setDefaultVsCurrency(e) {
          (this._defaultVsCurrency = e), this.saveDefaultVsCurrency();
        }
        *restoreDefaultVsCurrency() {
          const e = yield* d.toGenerator(
            this.kvStore.get("__default_vs_currency")
          );
          e && (this._defaultVsCurrency = e);
        }
        saveDefaultVsCurrency() {
          return i(this, void 0, void 0, function* () {
            yield this.kvStore.set(
              "__default_vs_currency",
              this.defaultVsCurrency
            );
          });
        }
        get supportedVsCurrencies() {
          return this._supportedVsCurrencies;
        }
        getFiatCurrency(e) {
          return this._supportedVsCurrencies[e];
        }
        canFetch() {
          return (
            this._coinIds.values.length > 0 &&
            this._vsCurrencies.values.length > 0
          );
        }
        fetchResponse(e) {
          const t = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse },
          });
          return i(this, void 0, void 0, function* () {
            const { response: n, headers: r } = yield t.fetchResponse.call(
              this,
              e
            );
            return {
              headers: r,
              response: Object.assign(Object.assign({}, n), {
                data: u.default(
                  this.response ? this.response.data : {},
                  n.data
                ),
              }),
            };
          });
        }
        updateURL(e, t, n = !1) {
          const r = this._coinIds.add(...e),
            i = this._vsCurrencies.add(...t);
          if (r || i || n) {
            const e = `/simple/price?ids=${this._coinIds.values.join(
              ","
            )}&vs_currencies=${this._vsCurrencies.values.join(",")}`;
            this.isInitialized
              ? this._throttler.call(() => this.setUrl(e))
              : this.setUrl(e);
          }
        }
        getCacheKey() {
          return `${this.instance.name}-${
            this.instance.defaults.baseURL
          }${this.instance.getUri({ url: "/simple/price" })}`;
        }
        getPrice(e, t) {
          if (
            (t || (t = this.defaultVsCurrency), !this.supportedVsCurrencies[t])
          )
            return;
          if ((this.updateURL([e], [t]), !this.response)) return;
          const n = this.response.data[e];
          return n ? n[t] : void 0;
        }
        calculatePrice(e, t) {
          if (!e.currency.coinGeckoId) return;
          t || (t = this.defaultVsCurrency);
          const n = this.supportedVsCurrencies[t];
          if (!n) return;
          if (e.toDec().isZero()) return new c.PricePretty(n, 0);
          const r = this.getPrice(e.currency.coinGeckoId, t);
          if (void 0 === r) return new c.PricePretty(n, new c.Int(0)).ready(!1);
          const i = e.toDec(),
            o = new c.Dec(r.toString());
          return new c.PricePretty(n, i.mul(o));
        }
      }
      r([l.observable], f.prototype, "_defaultVsCurrency", void 0),
        r([l.action], f.prototype, "setDefaultVsCurrency", null),
        r([l.flow], f.prototype, "restoreDefaultVsCurrency", null),
        (t.CoinGeckoPriceStore = f);
    },
    1691: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1692), t),
        i(n(91), t),
        i(n(924), t),
        i(n(1693), t),
        i(n(1736), t),
        i(n(1740), t),
        i(n(1744), t),
        i(n(1749), t);
    },
    1692: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.QueriesStore = t.createQueriesSetBase = void 0);
      const i = n(7),
        o = n(924),
        s = n(199);
      t.createQueriesSetBase = (e, t, n) => ({
        queryBalances: new o.ObservableQueryBalances(e, t, n),
      });
      class a {
        constructor(e, t, ...n) {
          (this.kvStore = e),
            (this.chainGetter = t),
            (this.queriesMap = new Map()),
            (this.queriesCreators = n),
            i.makeObservable(this);
        }
        get(e) {
          if (!this.queriesMap.has(e)) {
            const n = t.createQueriesSetBase(this.kvStore, e, this.chainGetter);
            i.runInAction(() => {
              const t = s.mergeStores(
                n,
                [this.kvStore, e, this.chainGetter],
                ...this.queriesCreators
              );
              this.queriesMap.set(e, t);
            });
          }
          return this.queriesMap.get(e);
        }
      }
      r([i.observable.shallow], a.prototype, "queriesMap", void 0),
        (t.QueriesStore = a);
    },
    1693: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", {
                  enumerable: !0,
                  value: t,
                });
              }
            : function (e, t) {
                e.default = t;
              }),
        o =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          },
        s =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var n in e)
                "default" !== n &&
                  Object.prototype.hasOwnProperty.call(e, n) &&
                  r(t, e, n);
            return i(t, e), t;
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Balance =
          t.IBC =
          t.Account =
          t.Supply =
          t.Staking =
          t.Governance =
            void 0),
        o(n(1424), t),
        o(n(1428), t),
        o(n(1429), t),
        o(n(1430), t),
        o(n(1431), t),
        o(n(1432), t),
        (t.Governance = s(n(1427))),
        (t.Staking = s(n(1341))),
        (t.Supply = s(n(1715))),
        (t.Account = s(n(1716))),
        (t.IBC = s(n(1717))),
        (t.Balance = s(n(1718))),
        o(n(1719), t);
    },
    1694: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryGovernance = void 0);
      const i = n(91),
        o = n(7),
        s = n(1425),
        a = n(32),
        d = n(252),
        c = n(1426);
      class u extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/cosmos/gov/v1beta1/proposals?pagination.limit=3000"),
            (this._queryPool = r),
            (this.paramDeposit = void 0),
            (this.paramVoting = void 0),
            (this.paramTally = void 0),
            (this.getProposal = d.computedFn((e) =>
              this.proposals.find((t) => t.id === e)
            )),
            o.makeObservable(this);
        }
        getQueryPool() {
          return this._queryPool;
        }
        getQueryParamDeposit() {
          return (
            this.paramDeposit ||
              o.runInAction(() => {
                this.paramDeposit = new s.ObservableQueryGovParamDeposit(
                  this.kvStore,
                  this.chainId,
                  this.chainGetter
                );
              }),
            this.paramDeposit
          );
        }
        getQueryParamVoting() {
          return (
            this.paramVoting ||
              o.runInAction(() => {
                this.paramVoting = new s.ObservableQueryGovParamVoting(
                  this.kvStore,
                  this.chainId,
                  this.chainGetter
                );
              }),
            this.paramVoting
          );
        }
        getQueryParamTally() {
          return (
            this.paramTally ||
              o.runInAction(() => {
                this.paramTally = new s.ObservableQueryGovParamTally(
                  this.kvStore,
                  this.chainId,
                  this.chainGetter
                );
              }),
            this.paramTally
          );
        }
        get quorum() {
          const e = this.getQueryParamTally();
          if (!e.response) return new a.IntPretty(new a.Int(0)).ready(!1);
          let t = new a.Dec(e.response.data.tally_params.quorum);
          return (
            (t = t.mulTruncate(a.DecUtils.getPrecisionDec(2))),
            new a.IntPretty(t)
          );
        }
        get proposals() {
          if (!this.response) return [];
          const e = [];
          for (const t of this.response.data.proposals)
            e.push(
              new c.ObservableQueryProposal(
                this.kvStore,
                this.chainId,
                this.chainGetter,
                t,
                this
              )
            );
          return e.reverse();
        }
      }
      r([o.observable.ref], u.prototype, "paramDeposit", void 0),
        r([o.observable.ref], u.prototype, "paramVoting", void 0),
        r([o.observable.ref], u.prototype, "paramTally", void 0),
        r([o.computed], u.prototype, "quorum", null),
        r([o.computed], u.prototype, "proposals", null),
        (t.ObservableQueryGovernance = u);
    },
    1695: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryProposalVote = t.ObservableQueryProposalVoteInner =
          void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, `/cosmos/gov/v1beta1/proposals/${r}/votes/${i}`),
            (this.proposalId = r),
            (this.bech32Address = i);
        }
        get vote() {
          if (!this.response) return "Unspecified";
          switch (this.response.data.vote.option) {
            case "VOTE_OPTION_YES":
              return "Yes";
            case "VOTE_OPTION_ABSTAIN":
              return "Abstain";
            case "VOTE_OPTION_NO":
              return "No";
            case "VOTE_OPTION_NO_WITH_VETO":
              return "NoWithVeto";
            default:
              return "Unspecified";
          }
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
      }
      t.ObservableQueryProposalVoteInner = i;
      class o extends r.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(e, t, n, (e) => {
            const { proposalId: t, voter: n } = JSON.parse(e);
            return new i(this.kvStore, this.chainId, this.chainGetter, t, n);
          }),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getVote(e, t) {
          const n = JSON.stringify({ proposalId: e, voter: t });
          return this.get(n);
        }
      }
      t.ObservableQueryProposalVote = o;
    },
    1696: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryDelegations = t.ObservableQueryDelegationsInner =
          void 0);
      const i = n(91),
        o = n(32),
        s = n(7),
        a = n(252);
      class d extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            `/cosmos/staking/v1beta1/delegations/${r}?pagination.limit=1000`
          ),
            (this.getDelegationTo = a.computedFn((e) => {
              const t = this.delegations,
                n = this.chainGetter.getChain(this.chainId).stakeCurrency;
              if (!this.response)
                return new o.CoinPretty(n, new o.Int(0)).ready(!1);
              for (const r of t)
                if (r.delegation.validator_address === e)
                  return new o.CoinPretty(n, new o.Int(r.balance.amount));
              return new o.CoinPretty(n, new o.Int(0));
            })),
            s.makeObservable(this),
            (this.bech32Address = r);
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
        get total() {
          const e = this.chainGetter.getChain(this.chainId).stakeCurrency;
          if (!this.response)
            return new o.CoinPretty(e, new o.Int(0)).ready(!1);
          let t = new o.Int(0);
          for (const e of this.response.data.delegation_responses)
            t = t.add(new o.Int(e.balance.amount));
          return new o.CoinPretty(e, t);
        }
        get delegationBalances() {
          if (!this.response) return [];
          const e = this.chainGetter.getChain(this.chainId).stakeCurrency,
            t = [];
          for (const n of this.response.data.delegation_responses)
            t.push({
              validatorAddress: n.delegation.validator_address,
              balance: new o.CoinPretty(e, new o.Int(n.balance.amount)),
            });
          return t;
        }
        get delegations() {
          return this.response ? this.response.data.delegation_responses : [];
        }
      }
      r([s.computed], d.prototype, "total", null),
        r([s.computed], d.prototype, "delegationBalances", null),
        r([s.computed], d.prototype, "delegations", null),
        (t.ObservableQueryDelegationsInner = d);
      class c extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new d(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryDelegations = c;
    },
    1697: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryRewards = t.ObservableQueryRewardsInner = void 0);
      const i = n(91),
        o = n(7),
        s = n(32),
        a = n(199),
        d = n(252);
      class c extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            `/cosmos/distribution/v1beta1/delegators/${r}/rewards`
          ),
            (this.getRewardsOf = d.computedFn((e) => {
              var t, n, r;
              const i = this.chainGetter
                  .getChain(this.chainId)
                  .currencies.reduce(
                    (e, t) => ("type" in t || (e[t.coinMinimalDenom] = t), e),
                    {}
                  ),
                o =
                  null ===
                    (n =
                      null === (t = this.response) || void 0 === t
                        ? void 0
                        : t.data.rewards) || void 0 === n
                    ? void 0
                    : n.find((t) => t.validator_address === e);
              return a.StoreUtils.getBalancesFromCurrencies(
                i,
                null !== (r = null == o ? void 0 : o.reward) && void 0 !== r
                  ? r
                  : []
              );
            })),
            (this.getStakableRewardOf = d.computedFn((e) => {
              var t, n, r;
              const i = this.chainGetter.getChain(this.chainId),
                o =
                  null ===
                    (n =
                      null === (t = this.response) || void 0 === t
                        ? void 0
                        : t.data.rewards) || void 0 === n
                    ? void 0
                    : n.find((t) => t.validator_address === e);
              return a.StoreUtils.getBalanceFromCurrency(
                i.stakeCurrency,
                null !== (r = null == o ? void 0 : o.reward) && void 0 !== r
                  ? r
                  : []
              );
            })),
            (this.getUnstakableRewardsOf = d.computedFn((e) => {
              var t, n, r;
              const i = this.chainGetter.getChain(this.chainId),
                o = i.currencies.reduce(
                  (e, t) => (
                    "type" in t ||
                      t.coinMinimalDenom === i.stakeCurrency.coinMinimalDenom ||
                      (e[t.coinMinimalDenom] = t),
                    e
                  ),
                  {}
                ),
                s =
                  null ===
                    (n =
                      null === (t = this.response) || void 0 === t
                        ? void 0
                        : t.data.rewards) || void 0 === n
                    ? void 0
                    : n.find((t) => t.validator_address === e);
              return a.StoreUtils.getBalancesFromCurrencies(
                o,
                null !== (r = null == s ? void 0 : s.reward) && void 0 !== r
                  ? r
                  : []
              );
            })),
            (this.getDescendingPendingRewardValidatorAddresses = d.computedFn(
              (e) => {
                var t, n;
                if (!this.response) return [];
                const r = this.chainGetter.getChain(this.chainId),
                  i =
                    null !==
                      (n =
                        null === (t = this.response.data.rewards) ||
                        void 0 === t
                          ? void 0
                          : t.slice()) && void 0 !== n
                      ? n
                      : [];
                return (
                  i.sort((e, t) => {
                    var n, i;
                    const o = a.StoreUtils.getBalanceFromCurrency(
                        r.stakeCurrency,
                        null !== (n = e.reward) && void 0 !== n ? n : []
                      ),
                      s = a.StoreUtils.getBalanceFromCurrency(
                        r.stakeCurrency,
                        null !== (i = t.reward) && void 0 !== i ? i : []
                      );
                    return o.toDec().gt(s.toDec()) ? -1 : 1;
                  }),
                  i
                    .filter((e) => {
                      if (e.reward)
                        for (const t of e.reward) {
                          if (new s.Dec(t.amount).truncate().gt(new s.Int(0)))
                            return !0;
                        }
                      return !1;
                    })
                    .slice(0, e)
                    .map((e) => e.validator_address)
                );
              }
            )),
            o.makeObservable(this),
            (this.bech32Address = r);
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
        get rewards() {
          var e, t;
          const n = this.chainGetter
            .getChain(this.chainId)
            .currencies.reduce(
              (e, t) => ("type" in t || (e[t.coinMinimalDenom] = t), e),
              {}
            );
          return a.StoreUtils.getBalancesFromCurrencies(
            n,
            null !==
              (t =
                null === (e = this.response) || void 0 === e
                  ? void 0
                  : e.data.total) && void 0 !== t
              ? t
              : []
          );
        }
        get stakableReward() {
          var e, t;
          const n = this.chainGetter.getChain(this.chainId);
          return a.StoreUtils.getBalanceFromCurrency(
            n.stakeCurrency,
            null !==
              (t =
                null === (e = this.response) || void 0 === e
                  ? void 0
                  : e.data.total) && void 0 !== t
              ? t
              : []
          );
        }
        get unstakableRewards() {
          var e, t;
          const n = this.chainGetter.getChain(this.chainId),
            r = n.currencies.reduce(
              (e, t) => (
                "type" in t ||
                  t.coinMinimalDenom === n.stakeCurrency.coinMinimalDenom ||
                  (e[t.coinMinimalDenom] = t),
                e
              ),
              {}
            );
          return a.StoreUtils.getBalancesFromCurrencies(
            r,
            null !==
              (t =
                null === (e = this.response) || void 0 === e
                  ? void 0
                  : e.data.total) && void 0 !== t
              ? t
              : []
          );
        }
        get pendingRewardValidatorAddresses() {
          var e;
          if (!this.response) return [];
          const t = [];
          for (const n of null !== (e = this.response.data.rewards) &&
          void 0 !== e
            ? e
            : [])
            if (n.reward)
              for (const e of n.reward) {
                if (new s.Dec(e.amount).truncate().gt(new s.Int(0))) {
                  t.push(n.validator_address);
                  break;
                }
              }
          return t;
        }
      }
      r([o.computed], c.prototype, "rewards", null),
        r([o.computed], c.prototype, "stakableReward", null),
        r([o.computed], c.prototype, "unstakableRewards", null),
        r([o.computed], c.prototype, "pendingRewardValidatorAddresses", null),
        (t.ObservableQueryRewardsInner = c);
      class u extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new c(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryRewards = u;
    },
    1698: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryUnbondingDelegations =
          t.ObservableQueryUnbondingDelegationsInner =
            void 0);
      const i = n(91),
        o = n(32),
        s = n(7);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            `/cosmos/staking/v1beta1/delegators/${r}/unbonding_delegations?pagination.limit=1000`
          ),
            s.makeObservable(this),
            (this.bech32Address = r);
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
        get total() {
          const e = this.chainGetter.getChain(this.chainId).stakeCurrency;
          if (!this.response)
            return new o.CoinPretty(e, new o.Int(0)).ready(!1);
          let t = new o.Int(0);
          for (const e of this.response.data.unbonding_responses)
            for (const n of e.entries) t = t.add(new o.Int(n.balance));
          return new o.CoinPretty(e, t);
        }
        get unbondingBalances() {
          const e = this.unbondings,
            t = this.chainGetter.getChain(this.chainId).stakeCurrency,
            n = [];
          for (const r of e) {
            const e = [];
            for (const n of r.entries)
              e.push({
                creationHeight: new o.Int(n.creation_height),
                completionTime: n.completion_time,
                balance: new o.CoinPretty(t, new o.Int(n.balance)),
              });
            n.push({ validatorAddress: r.validator_address, entries: e });
          }
          return n;
        }
        get unbondings() {
          return this.response ? this.response.data.unbonding_responses : [];
        }
      }
      r([s.computed], a.prototype, "total", null),
        r([s.computed], a.prototype, "unbondingBalances", null),
        r([s.computed], a.prototype, "unbondings", null),
        (t.ObservableQueryUnbondingDelegationsInner = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new a(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryUnbondingDelegations = d;
    },
    1699: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryValidators =
          t.ObservableQueryValidatorsInner =
          t.ObservableQueryValidatorThumbnail =
            void 0);
      const s = n(91),
        a = n(1341),
        d = n(7),
        c = n(199),
        u = o(n(62)),
        l = o(n(1700)),
        h = n(32),
        p = n(252);
      class f extends c.ObservableQuery {
        constructor(e, t) {
          super(
            e,
            u.default.create({ baseURL: "https://keybase.io/" }),
            "_/api/1.0/user/lookup.json?fields=pictures&key_suffix=" +
              t.description.identity
          ),
            d.makeObservable(this),
            (this.validator = t);
        }
        canFetch() {
          return "" !== this.validator.description.identity;
        }
        fetchResponse(e) {
          const t = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse },
          });
          return i(this, void 0, void 0, function* () {
            return yield f.fetchingThumbnailQueue.add(() =>
              t.fetchResponse.call(this, e)
            );
          });
        }
        get thumbnail() {
          var e, t, n, r;
          return 0 ===
            (null === (e = this.response) || void 0 === e
              ? void 0
              : e.data.status.code) &&
            this.response.data.them &&
            this.response.data.them.length > 0 &&
            null !==
              (r =
                null ===
                  (n =
                    null === (t = this.response.data.them[0].pictures) ||
                    void 0 === t
                      ? void 0
                      : t.primary) || void 0 === n
                  ? void 0
                  : n.url) &&
            void 0 !== r
            ? r
            : "";
        }
      }
      (f.fetchingThumbnailQueue = new l.default({ concurrency: 3 })),
        r([d.computed], f.prototype, "thumbnail", null),
        (t.ObservableQueryValidatorThumbnail = f);
      class g extends s.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            "/cosmos/staking/v1beta1/validators?pagination.limit=1000&status=" +
              (() => {
                switch (r) {
                  case a.BondStatus.Bonded:
                    return "BOND_STATUS_BONDED";
                  case a.BondStatus.Unbonded:
                    return "BOND_STATUS_UNBONDED";
                  case a.BondStatus.Unbonding:
                    return "BOND_STATUS_UNBONDING";
                  default:
                    return "BOND_STATUS_UNSPECIFIED";
                }
              })()
          ),
            (this.status = r),
            (this.thumbnailMap = new Map()),
            (this.getValidator = p.computedFn((e) =>
              this.validators.find((t) => t.operator_address === e)
            )),
            (this.getValidatorThumbnail = p.computedFn((e) => {
              const t = this.validators.find((t) => t.operator_address === e);
              if (!t) return "";
              if (!t.description.identity) return "";
              const n = t.description.identity;
              return (
                this.thumbnailMap.has(n) ||
                  d.runInAction(() => {
                    this.thumbnailMap.set(n, new f(this.kvStore, t));
                  }),
                this.thumbnailMap.get(n).thumbnail
              );
            })),
            (this.getValidatorShare = p.computedFn((e) => {
              const t = this.validators.find((t) => t.operator_address === e);
              if (!t) return;
              const n = this.chainGetter.getChain(this.chainId).stakeCurrency,
                r = new h.Dec(t.tokens).truncate();
              return new h.CoinPretty(n, r);
            })),
            d.makeObservable(this);
        }
        get validators() {
          return this.response ? this.response.data.validators : [];
        }
        get validatorsSortedByVotingPower() {
          return this.validators.sort((e, t) =>
            new h.Dec(e.tokens).gt(new h.Dec(t.tokens)) ? -1 : 1
          );
        }
      }
      r([d.observable.shallow], g.prototype, "thumbnailMap", void 0),
        r([d.computed], g.prototype, "validators", null),
        r([d.computed], g.prototype, "validatorsSortedByVotingPower", null),
        (t.ObservableQueryValidatorsInner = g);
      class m extends s.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new g(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryStatus(e = a.BondStatus.Bonded) {
          return this.get(e);
        }
      }
      t.ObservableQueryValidators = m;
    },
    1705: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryStakingPool = void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/staking/v1beta1/pool"),
            o.makeObservable(this);
        }
        get notBondedTokens() {
          const e = this.chainGetter.getChain(this.chainId);
          return this.response
            ? new s.CoinPretty(
                e.stakeCurrency,
                this.response.data.pool.not_bonded_tokens
              )
            : new s.CoinPretty(e.stakeCurrency, 0);
        }
        get bondedTokens() {
          const e = this.chainGetter.getChain(this.chainId);
          return this.response
            ? new s.CoinPretty(
                e.stakeCurrency,
                this.response.data.pool.bonded_tokens
              )
            : new s.CoinPretty(e.stakeCurrency, 0);
        }
      }
      r([o.computed], a.prototype, "notBondedTokens", null),
        r([o.computed], a.prototype, "bondedTokens", null),
        (t.ObservableQueryStakingPool = a);
    },
    1706: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryStakingParams = void 0);
      const i = n(91),
        o = n(7);
      class s extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/staking/v1beta1/params"),
            o.makeObservable(this);
        }
        get unbondingTimeSec() {
          return this.response
            ? parseInt(
                this.response.data.params.unbonding_time.replace("s", "")
              )
            : 0;
        }
        get maxValidators() {
          var e, t;
          return null !==
            (t =
              null === (e = this.response) || void 0 === e
                ? void 0
                : e.data.params.max_validators) && void 0 !== t
            ? t
            : 0;
        }
        get maxEntries() {
          var e, t;
          return null !==
            (t =
              null === (e = this.response) || void 0 === e
                ? void 0
                : e.data.params.max_entries) && void 0 !== t
            ? t
            : 0;
        }
        get historicalEntries() {
          var e, t;
          return null !==
            (t =
              null === (e = this.response) || void 0 === e
                ? void 0
                : e.data.params.historical_entries) && void 0 !== t
            ? t
            : 0;
        }
        get bondDenom() {
          var e, t;
          return null !==
            (t =
              null === (e = this.response) || void 0 === e
                ? void 0
                : e.data.params.bond_denom) && void 0 !== t
            ? t
            : "";
        }
      }
      r([o.computed], s.prototype, "unbondingTimeSec", null),
        (t.ObservableQueryStakingParams = s);
    },
    1707: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryInflation = void 0);
      const i = n(32),
        o = n(7);
      class s {
        constructor(e, t, n, r, i, s, a, d, c, u, l, h, p, f) {
          (this.chainId = e),
            (this.chainGetter = t),
            (this._queryMint = n),
            (this._queryPool = r),
            (this._querySupplyTotal = i),
            (this._queryIrisMint = s),
            (this._querySifchainAPY = a),
            (this._queryOsmosisEpochs = d),
            (this._queryOsmosisEpochProvisions = c),
            (this._queryOsmosisMintParams = u),
            (this._queryJunoAnnualProvisions = l),
            (this._queryDistributionParams = h),
            (this._queryStrideEpochProvisions = p),
            (this._queryStrideMintParams = f),
            o.makeObservable(this);
        }
        get error() {
          var e, t;
          return null !==
            (t =
              null !== (e = this._queryMint.error) && void 0 !== e
                ? e
                : this._queryPool.error) && void 0 !== t
            ? t
            : this._querySupplyTotal.getQueryStakeDenom().error;
        }
        get isFetching() {
          return (
            this._queryMint.isFetching ||
            this._queryPool.isFetching ||
            this._querySupplyTotal.getQueryStakeDenom().isFetching
          );
        }
        get inflation() {
          var e, t, n, r;
          try {
            let o;
            const s = this.chainGetter.getChain(this.chainId);
            if (s.chainId.startsWith("irishub"))
              o = new i.Dec(
                null !==
                  (t =
                    null === (e = this._queryIrisMint.response) || void 0 === e
                      ? void 0
                      : e.data.result.inflation) && void 0 !== t
                  ? t
                  : "0"
              ).mul(i.DecUtils.getPrecisionDec(2));
            else {
              if (s.chainId.startsWith("sifchain"))
                return new i.IntPretty(
                  new i.Dec(this._querySifchainAPY.liquidityAPY.toString())
                );
              if (s.chainId.startsWith("osmosis")) {
                const e = this._queryOsmosisMintParams;
                if (e.epochIdentifier) {
                  const t = this._queryOsmosisEpochs.getEpoch(
                    e.epochIdentifier
                  ).duration;
                  if (t) {
                    const n = this._queryOsmosisEpochProvisions.epochProvisions;
                    if (
                      n &&
                      this._querySupplyTotal.getQueryStakeDenom().response
                    ) {
                      const r = new i.Dec(
                          n
                            .toDec()
                            .mul(e.distributionProportions.staking)
                            .truncate()
                            .toString()
                        ).mul(new i.Dec((31536e3 / t).toString())),
                        s = i.DecUtils.getPrecisionDec(8);
                      o = r.quo(s).mul(i.DecUtils.getPrecisionDec(2));
                    }
                  }
                }
              } else if (s.chainId.startsWith("juno")) {
                if (
                  this._queryJunoAnnualProvisions.annualProvisionsRaw &&
                  this._queryPool.response
                ) {
                  const e = new i.Dec(
                      this._queryPool.response.data.pool.bonded_tokens
                    ),
                    t = this._queryJunoAnnualProvisions.annualProvisionsRaw
                      .quo(e)
                      .mul(
                        new i.Dec(1).sub(
                          this._queryDistributionParams.communityTax.toDec()
                        )
                      )
                      .mul(i.DecUtils.getTenExponentN(2));
                  return new i.IntPretty(t);
                }
              } else {
                if (s.chainId.startsWith("stride")) {
                  const e =
                      this._queryStrideEpochProvisions.epochProvisions.mul(
                        new i.Dec(8760)
                      ),
                    t =
                      this._queryStrideMintParams.distributionProportions
                        .staking,
                    n = this._queryPool.bondedTokens;
                  return n.toDec().isZero()
                    ? new i.IntPretty(new i.Dec(0))
                    : new i.IntPretty(
                        t
                          .mul(e.toDec())
                          .quo(n.toDec())
                          .mulTruncate(
                            i.DecUtils.getTenExponentNInPrecisionRange(2)
                          )
                      );
                }
                o = new i.Dec(
                  null !==
                    (r =
                      null === (n = this._queryMint.response) || void 0 === n
                        ? void 0
                        : n.data.inflation) && void 0 !== r
                    ? r
                    : "0"
                ).mul(i.DecUtils.getPrecisionDec(2));
              }
            }
            if (!o || o.equals(new i.Dec(0)))
              return new i.IntPretty(new i.Int(0)).ready(!1);
            if (this._queryPool.response) {
              const e = new i.Dec(
                  this._queryPool.response.data.pool.bonded_tokens
                ),
                t = (() => {
                  if (s.chainId.startsWith("osmosis"))
                    return i.DecUtils.getPrecisionDec(14).toString();
                  if (s.chainId.startsWith("umee")) {
                    const e = this._querySupplyTotal.getQueryDenomByQueryString(
                      s.stakeCurrency.coinMinimalDenom
                    ).response;
                    return e ? e.data.amount.amount : "0";
                  }
                  const e =
                    this._querySupplyTotal.getQueryStakeDenom().response;
                  return e ? e.data.amount.amount : "0";
                })(),
                n = new i.Dec(t);
              if (n.gt(new i.Dec(0))) {
                const t = e.quo(n);
                o = o
                  .mul(
                    new i.Dec(1).sub(
                      this._queryDistributionParams.communityTax.toDec()
                    )
                  )
                  .quo(t);
              }
            }
            return new i.IntPretty(o);
          } catch (e) {
            return console.log(e), new i.IntPretty(new i.Int(0)).ready(!1);
          }
        }
      }
      r([o.computed], s.prototype, "inflation", null),
        (t.ObservableQueryInflation = s);
    },
    1708: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryMintingInfation = void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/mint/v1beta1/inflation");
        }
      }
      t.ObservableQueryMintingInfation = i;
    },
    1709: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySupplyTotal = t.ObservableChainQuerySupplyTotal =
          void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/cosmos/bank/v1beta1/supply/" + r);
        }
      }
      t.ObservableChainQuerySupplyTotal = i;
      class o extends r.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new i(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryDenom(e) {
          return this.get(e);
        }
        getQueryDenomByQueryString(e) {
          return this.get("by_denom?denom=" + e);
        }
        getQueryStakeDenom() {
          const e = this.chainGetter.getChain(this.chainId);
          return this.get(e.stakeCurrency.coinMinimalDenom);
        }
      }
      t.ObservableQuerySupplyTotal = o;
    },
    1710: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryIBCChannel = t.ObservableChainQueryIBCChannel =
          void 0);
      const r = n(91),
        i = n(7);
      class o extends r.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, `/ibc/core/channel/v1beta1/channels/${i}/ports/${r}`),
            (this.portId = r),
            (this.channelId = i);
        }
        onStart() {
          return (
            super.onStart(),
            new Promise((e) => {
              this.disposer = i.autorun(() => {
                const t = this.chainGetter.getChain(this.chainId);
                t.features &&
                  t.features.includes("ibc-go") &&
                  this.setUrl(
                    `/ibc/core/channel/v1/channels/${this.channelId}/ports/${this.portId}`
                  ),
                  e();
              });
            })
          );
        }
        onStop() {
          this.disposer && (this.disposer(), (this.disposer = void 0)),
            super.onStop();
        }
      }
      t.ObservableChainQueryIBCChannel = o;
      class s extends r.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(e, t, n, (e) => {
            const t = JSON.parse(e);
            return new o(
              this.kvStore,
              this.chainId,
              this.chainGetter,
              t.portId,
              t.channelId
            );
          }),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getTransferChannel(e) {
          return this.getChannel("transfer", e);
        }
        getChannel(e, t) {
          const n = JSON.stringify({ portId: e, channelId: t });
          return this.get(n);
        }
      }
      t.ObservableQueryIBCChannel = s;
    },
    1711: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryIBCClientState = t.ObservableChainQueryClientState =
          void 0);
      const i = n(91),
        o = n(7);
      class s extends i.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(
            e,
            t,
            n,
            `/ibc/core/channel/v1beta1/channels/${i}/ports/${r}/client_state`
          ),
            (this.portId = r),
            (this.channelId = i);
        }
        onStart() {
          return (
            super.onStart(),
            new Promise((e) => {
              this.disposer = o.autorun(() => {
                const t = this.chainGetter.getChain(this.chainId);
                t.features &&
                  t.features.includes("ibc-go") &&
                  this.setUrl(
                    `/ibc/core/channel/v1/channels/${this.channelId}/ports/${this.portId}/client_state`
                  ),
                  e();
              });
            })
          );
        }
        onStop() {
          this.disposer && (this.disposer(), (this.disposer = void 0)),
            super.onStop();
        }
        get clientChainId() {
          var e, t;
          if (this.response)
            return null ===
              (t =
                null === (e = this.response.data.identified_client_state) ||
                void 0 === e
                  ? void 0
                  : e.client_state) || void 0 === t
              ? void 0
              : t.chain_id;
        }
      }
      r([o.computed], s.prototype, "clientChainId", null),
        (t.ObservableChainQueryClientState = s);
      class a extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(e, t, n, (e) => {
            const t = JSON.parse(e);
            return new s(
              this.kvStore,
              this.chainId,
              this.chainGetter,
              t.portId,
              t.channelId
            );
          }),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getClientStateOnTransferPort(e) {
          return this.getClientState("transfer", e);
        }
        getClientState(e, t) {
          const n = JSON.stringify({ portId: e, channelId: t });
          return this.get(n);
        }
      }
      t.ObservableQueryIBCClientState = a;
    },
    1712: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryDenomTrace = t.ObservableChainQueryDenomTrace =
          void 0);
      const i = n(91),
        o = n(7);
      class s extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            "/ibc/applications/transfer/v1beta1/denom_traces/" + r
          ),
            (this.hash = r);
        }
        onStart() {
          return (
            super.onStart(),
            new Promise((e) => {
              this.disposer = o.autorun(() => {
                const t = this.chainGetter.getChain(this.chainId);
                t.features &&
                  t.features.includes("ibc-go") &&
                  this.setUrl(
                    "/ibc/apps/transfer/v1/denom_traces/" + this.hash
                  ),
                  e();
              });
            })
          );
        }
        onStop() {
          this.disposer && (this.disposer(), (this.disposer = void 0)),
            super.onStop();
        }
        get paths() {
          if (!this.response) return [];
          const e = this.response.data.denom_trace.path.split("/");
          if (e.length % 2 != 0)
            return console.log("Failed to parse paths", e), [];
          const t = [];
          for (let n = 0; n < e.length; n += 2) t.push(e.slice(n, n + 2));
          return t.map((e) => ({ portId: e[0], channelId: e[1] }));
        }
        get denom() {
          if (this.response) return this.response.data.denom_trace.base_denom;
        }
        get denomTrace() {
          if (this.response && this.denom)
            return { denom: this.denom, paths: this.paths };
        }
      }
      r([o.computed], s.prototype, "paths", null),
        r([o.computed], s.prototype, "denomTrace", null),
        (t.ObservableChainQueryDenomTrace = s);
      class a extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new s(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getDenomTrace(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryDenomTrace = a;
    },
    1713: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryCosmosBalanceRegistry =
          t.ObservableQueryCosmosBalances =
          t.ObservableQueryBalanceNative =
            void 0);
      const i = n(29),
        o = n(7),
        s = n(32),
        a = n(199),
        d = n(924),
        c = n(91);
      class u extends d.ObservableQueryBalanceInner {
        constructor(e, t, n, r, i) {
          super(e, t, n, "", r),
            (this.nativeBalances = i),
            o.makeObservable(this);
        }
        canFetch() {
          return !1;
        }
        get isFetching() {
          return this.nativeBalances.isFetching;
        }
        get error() {
          return this.nativeBalances.error;
        }
        get response() {
          return this.nativeBalances.response;
        }
        *fetch() {
          yield this.nativeBalances.fetch();
        }
        get balance() {
          const e = this.currency;
          return this.nativeBalances.response
            ? a.StoreUtils.getBalanceFromCurrency(
                e,
                this.nativeBalances.response.data.balances
              )
            : new s.CoinPretty(e, new s.Int(0)).ready(!1);
        }
      }
      r([o.override], u.prototype, "fetch", null),
        r([o.computed], u.prototype, "balance", null),
        (t.ObservableQueryBalanceNative = u);
      class l extends c.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(
            e,
            t,
            n,
            `/cosmos/bank/v1beta1/balances/${r}?pagination.limit=1000`
          ),
            (this.duplicatedFetchCheck = !1),
            (this.bech32Address = r),
            o.makeObservable(this);
        }
        canFetch() {
          return this.bech32Address.length > 0;
        }
        *fetch() {
          this.duplicatedFetchCheck ||
            ((this.duplicatedFetchCheck = !0),
            setTimeout(() => {
              this.duplicatedFetchCheck = !1;
            }, 1),
            yield super.fetch());
        }
        setResponse(e) {
          super.setResponse(e);
          const t = this.chainGetter.getChain(this.chainId),
            n = e.data.balances.map((e) => e.denom);
          t.addUnknownCurrencies(...n);
        }
      }
      r([o.override], l.prototype, "fetch", null),
        (t.ObservableQueryCosmosBalances = l);
      t.ObservableQueryCosmosBalanceRegistry = class {
        constructor(e) {
          (this.kvStore = e), (this.nativeBalances = new Map());
        }
        getBalanceInner(e, t, n, r) {
          const o = new i.DenomHelper(r);
          if ("native" !== o.type) return;
          const s = `${e}/${n}`;
          return (
            this.nativeBalances.has(s) ||
              this.nativeBalances.set(s, new l(this.kvStore, e, t, n)),
            new u(this.kvStore, e, t, o, this.nativeBalances.get(s))
          );
        }
      };
    },
    1714: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySpendableBalances =
          t.ObservableChainQuerySpendableBalances =
            void 0);
      const i = n(91),
        o = n(32),
        s = n(7);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/cosmos/bank/v1beta1/spendable_balances/" + r);
        }
        get balances() {
          if (!this.response) return [];
          const e = [],
            t = this.chainGetter.getChain(this.chainId);
          for (const n of this.response.data.balances) {
            const r = t.findCurrency(n.denom);
            r && e.push(new o.CoinPretty(r, n.amount));
          }
          return e;
        }
      }
      r([s.computed], a.prototype, "balances", null),
        (t.ObservableChainQuerySpendableBalances = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new a(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQuerySpendableBalances = d;
    },
    1715: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1716: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1717: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1718: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1719: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmosQueriesImpl = t.CosmosQueries = void 0);
      const r = n(1430),
        i = n(1429),
        o = n(1428),
        s = n(1424),
        a = n(1431),
        d = n(1720),
        c = n(1432),
        u = n(1721),
        l = n(1722),
        h = n(1726),
        p = n(1728),
        f = n(1730),
        g = n(1732);
      t.CosmosQueries = {
        use: () => (e, t, n, r) => ({ cosmos: new m(e, t, n, r) }),
      };
      class m {
        constructor(e, t, n, m) {
          (this.queryRPCStatus = new p.ObservableQueryRPCStatus(t, n, m)),
            (this.querySifchainAPY = new d.ObservableQuerySifchainLiquidityAPY(
              t,
              n
            )),
            e.queryBalances.addBalanceRegistry(
              new c.ObservableQueryCosmosBalanceRegistry(t)
            ),
            (this.queryAccount = new r.ObservableQueryAccount(t, n, m)),
            (this.querySpendableBalances =
              new c.ObservableQuerySpendableBalances(t, n, m)),
            (this.queryMint = new i.ObservableQueryMintingInfation(t, n, m)),
            (this.queryPool = new o.ObservableQueryStakingPool(t, n, m)),
            (this.queryStakingParams = new o.ObservableQueryStakingParams(
              t,
              n,
              m
            )),
            (this.querySupplyTotal = new i.ObservableQuerySupplyTotal(t, n, m));
          const v = new l.ObservableQueryOsmosisMintParmas(t, n, m);
          this.queryDistributionParams =
            new h.ObservableQueryDistributionParams(t, n, m);
          const y = new g.ObservableQueryStrideMintParams(t, n, m);
          (this.queryInflation = new i.ObservableQueryInflation(
            n,
            m,
            this.queryMint,
            this.queryPool,
            this.querySupplyTotal,
            new u.ObservableQueryIrisMintingInfation(t, n, m),
            this.querySifchainAPY,
            new l.ObservableQueryOsmosisEpochs(t, n, m),
            new l.ObservableQueryOsmosisEpochProvisions(t, n, m, v),
            v,
            new f.ObservableQueryJunoAnnualProvisions(t, n, m),
            this.queryDistributionParams,
            new g.ObservableQueryStrideEpochProvisions(t, n, m),
            y
          )),
            (this.queryRewards = new o.ObservableQueryRewards(t, n, m)),
            (this.queryDelegations = new o.ObservableQueryDelegations(t, n, m)),
            (this.queryUnbondingDelegations =
              new o.ObservableQueryUnbondingDelegations(t, n, m)),
            (this.queryValidators = new o.ObservableQueryValidators(t, n, m)),
            (this.queryGovernance = new s.ObservableQueryGovernance(
              t,
              n,
              m,
              this.queryPool
            )),
            (this.queryProposalVote = new s.ObservableQueryProposalVote(
              t,
              n,
              m
            )),
            (this.queryIBCClientState = new a.ObservableQueryIBCClientState(
              t,
              n,
              m
            )),
            (this.queryIBCChannel = new a.ObservableQueryIBCChannel(t, n, m)),
            (this.queryIBCDenomTrace = new a.ObservableQueryDenomTrace(
              t,
              n,
              m
            ));
        }
      }
      t.CosmosQueriesImpl = m;
    },
    1720: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySifchainLiquidityAPY = void 0);
      const o = n(199),
        s = i(n(62)),
        a = n(7);
      class d extends o.ObservableQuery {
        constructor(e, t) {
          super(
            e,
            s.default.create({ baseURL: "https://data.sifchain.finance/" }),
            "beta/validator/stakingRewards"
          ),
            (this.chainId = t),
            a.makeObservable(this);
        }
        canFetch() {
          return this.chainId.startsWith("sifchain");
        }
        get liquidityAPY() {
          return this.response ? 100 * Number(this.response.data.rate) : 0;
        }
      }
      r([a.computed], d.prototype, "liquidityAPY", null),
        (t.ObservableQuerySifchainLiquidityAPY = d);
    },
    1721: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryIrisMintingInfation = void 0);
      const r = n(91);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/mint/params");
        }
      }
      t.ObservableQueryIrisMintingInfation = i;
    },
    1722: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1723), t),
        i(n(1724), t),
        i(n(1725), t);
    },
    1723: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryOsmosisEpochs = t.ObservableQueryOsmosisEpochsInner =
          void 0);
      const i = n(91),
        o = n(7);
      class s {
        constructor(e, t) {
          (this.identifier = e), (this.queryEpochs = t);
        }
        get epoch() {
          var e;
          return null === (e = this.queryEpochs.response) || void 0 === e
            ? void 0
            : e.data.epochs.find((e) => e.identifier === this.identifier);
        }
        get duration() {
          return this.epoch
            ? parseInt(this.epoch.duration.replace("s", ""))
            : 0;
        }
        get startTime() {
          return this.epoch
            ? new Date(this.epoch.current_epoch_start_time)
            : new Date(0);
        }
        get endTime() {
          const e = this.startTime;
          return this.duration
            ? new Date(e.getTime() + 1e3 * this.duration)
            : e;
        }
      }
      r([o.computed], s.prototype, "epoch", null),
        r([o.computed], s.prototype, "duration", null),
        r([o.computed], s.prototype, "startTime", null),
        r([o.computed], s.prototype, "endTime", null),
        (t.ObservableQueryOsmosisEpochsInner = s);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/osmosis/epochs/v1beta1/epochs"),
            (this.map = new Map());
        }
        getEpoch(e) {
          if (!this.map.has(e)) {
            const t = new s(e, this);
            this.map.set(e, t);
          }
          return this.map.get(e);
        }
      }
      r([o.observable.shallow], a.prototype, "map", void 0),
        (t.ObservableQueryOsmosisEpochs = a);
    },
    1724: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryOsmosisEpochProvisions = void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, "/osmosis/mint/v1beta1/epoch_provisions"),
            (this.queryMintParmas = r),
            o.makeObservable(this);
        }
        get epochProvisions() {
          if (!this.response || !this.queryMintParmas.mintDenom) return;
          const e = this.chainGetter
            .getChain(this.chainId)
            .currencies.find(
              (e) => e.coinMinimalDenom === this.queryMintParmas.mintDenom
            );
          if (!e) throw new Error("Unknown currency");
          let t = this.response.data.epoch_provisions;
          return (
            t.includes(".") && (t = t.slice(0, t.indexOf("."))),
            new s.CoinPretty(e, new s.Int(t))
          );
        }
      }
      r([o.computed], a.prototype, "epochProvisions", null),
        (t.ObservableQueryOsmosisEpochProvisions = a);
    },
    1725: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryOsmosisMintParmas = void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/osmosis/mint/v1beta1/params"),
            o.makeObservable(this);
        }
        get mintDenom() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.params.mint_denom;
        }
        get epochIdentifier() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.params.epoch_identifier;
        }
        get distributionProportions() {
          return this.response
            ? {
                staking: new s.Dec(
                  this.response.data.params.distribution_proportions.staking
                ),
                poolIncentives: new s.Dec(
                  this.response.data.params.distribution_proportions.pool_incentives
                ),
                developerRewards: new s.Dec(
                  this.response.data.params.distribution_proportions.developer_rewards
                ),
              }
            : {
                staking: new s.Dec(0),
                poolIncentives: new s.Dec(0),
                developerRewards: new s.Dec(0),
              };
        }
      }
      r([o.computed], a.prototype, "distributionProportions", null),
        (t.ObservableQueryOsmosisMintParmas = a);
    },
    1726: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1727), t);
    },
    1727: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryDistributionParams = void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/distribution/v1beta1/params"),
            o.makeObservable(this);
        }
        get communityTax() {
          return this.response
            ? new s.RatePretty(this.response.data.params.community_tax)
            : new s.RatePretty(0);
        }
      }
      r([o.computed], a.prototype, "communityTax", null),
        (t.ObservableQueryDistributionParams = a);
    },
    1728: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryRPCStatus = void 0);
      const r = n(1729),
        i = n(32);
      class o extends r.ObservableChainQueryRPC {
        constructor(e, t, n) {
          super(e, t, n, "/status");
        }
        get network() {
          if (this.response) return this.response.data.result.node_info.network;
        }
        get latestBlockHeight() {
          if (this.response)
            return new i.Int(
              this.response.data.result.sync_info.latest_block_height
            );
        }
      }
      t.ObservableQueryRPCStatus = o;
    },
    1729: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableChainQueryRPCMap = t.ObservableChainQueryRPC = void 0);
      const o = n(199),
        s = i(n(62)),
        a = n(7),
        d = n(199);
      class c extends o.ObservableQuery {
        constructor(e, t, n, r) {
          const i = n.getChain(t);
          super(
            e,
            s.default.create(Object.assign({ baseURL: i.rpc }, i.rpcConfig)),
            r
          ),
            (this._chainId = t),
            (this.chainGetter = n);
        }
        get instance() {
          const e = this.chainGetter.getChain(this.chainId);
          return s.default.create(
            Object.assign({ baseURL: e.rpc }, e.rpcConfig)
          );
        }
        get chainId() {
          return this._chainId;
        }
      }
      r([a.override], c.prototype, "instance", null),
        (t.ObservableChainQueryRPC = c);
      class u extends d.HasMapStore {
        constructor(e, t, n, r) {
          super(r),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
      }
      t.ObservableChainQueryRPCMap = u;
    },
    1730: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1731), t);
    },
    1731: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryJunoAnnualProvisions = void 0);
      const i = n(91),
        o = n(7),
        s = n(32);
      class a extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/cosmos/mint/v1beta1/annual_provisions"),
            o.makeObservable(this);
        }
        get annualProvisions() {
          if (!this.response) return;
          const e = this.chainGetter.getChain(this.chainId);
          return new s.CoinPretty(
            e.stakeCurrency,
            new s.Dec(this.response.data.annual_provisions)
          );
        }
        get annualProvisionsRaw() {
          if (this.response)
            return new s.Dec(this.response.data.annual_provisions);
        }
      }
      r([o.computed], a.prototype, "annualProvisions", null),
        r([o.computed], a.prototype, "annualProvisionsRaw", null),
        (t.ObservableQueryJunoAnnualProvisions = a);
    },
    1732: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1733), t),
        i(n(1734), t),
        i(n(1735), t);
    },
    1733: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryStrideEpochProvisions = void 0);
      const i = n(32),
        o = n(7),
        s = n(91);
      class a extends s.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/mint/v1beta1/epoch_provisions"),
            o.makeObservable(this);
        }
        get epochProvisions() {
          const e = this.chainGetter.getChain(this.chainId);
          if (!this.response)
            return new i.CoinPretty(e.stakeCurrency, new i.Int(0));
          let t = this.response.data.epoch_provisions;
          return (
            t.includes(".") && (t = t.slice(0, t.indexOf("."))),
            new i.CoinPretty(e.stakeCurrency, new i.Int(t))
          );
        }
      }
      r([o.computed], a.prototype, "epochProvisions", null),
        (t.ObservableQueryStrideEpochProvisions = a);
    },
    1734: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryStrideMintParams = void 0);
      const i = n(32),
        o = n(7),
        s = n(91);
      class a extends s.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/mint/v1beta1/params"), o.makeObservable(this);
        }
        get mintDenom() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.params.mint_denom;
        }
        get distributionProportions() {
          return this.response
            ? {
                staking: new i.Dec(
                  this.response.data.params.distribution_proportions.staking
                ),
                communityPoolGrowth: new i.Dec(
                  this.response.data.params.distribution_proportions.community_pool_growth
                ),
                communityPoolSecurityBudget: new i.Dec(
                  this.response.data.params.distribution_proportions.community_pool_security_budget
                ),
                strategicReserve: new i.Dec(
                  this.response.data.params.distribution_proportions.strategic_reserve
                ),
              }
            : {
                staking: new i.Dec(0),
                communityPoolGrowth: new i.Dec(0),
                communityPoolSecurityBudget: new i.Dec(0),
                strategicReserve: new i.Dec(0),
              };
        }
      }
      r([o.computed], a.prototype, "distributionProportions", null),
        (t.ObservableQueryStrideMintParams = a);
    },
    1735: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1736: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", {
                  enumerable: !0,
                  value: t,
                });
              }
            : function (e, t) {
                e.default = t;
              }),
        o =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          },
        s =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var n in e)
                "default" !== n &&
                  Object.prototype.hasOwnProperty.call(e, n) &&
                  r(t, e, n);
            return i(t, e), t;
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmWasm = void 0),
        o(n(1433), t),
        (t.CosmWasm = s(n(1737))),
        o(n(1738), t);
    },
    1737: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1738: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmwasmQueriesImpl = t.CosmwasmQueries = void 0);
      const r = n(1739),
        i = n(1433);
      t.CosmwasmQueries = {
        use: () => (e, t, n, r) => ({ cosmwasm: new o(e, t, n, r) }),
      };
      class o {
        constructor(e, t, n, o) {
          e.queryBalances.addBalanceRegistry(
            new i.ObservableQueryCw20BalanceRegistry(t)
          ),
            (this.querycw20ContractInfo = new r.ObservableQueryCw20ContractInfo(
              t,
              n,
              o
            ));
        }
      }
      t.CosmwasmQueriesImpl = o;
    },
    1739: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryCw20ContractInfo =
          t.ObservableQueryCw20ContactInfoInner =
            void 0);
      const i = n(91),
        o = n(7),
        s = n(1343);
      class a extends s.ObservableCosmwasmContractChainQuery {
        constructor(e, t, n, r) {
          super(e, t, n, r, { token_info: {} }), (this.contractAddress = r);
        }
        get tokenInfo() {
          if (this.response && this.response.data) return this.response.data;
        }
      }
      r([o.computed], a.prototype, "tokenInfo", null),
        (t.ObservableQueryCw20ContactInfoInner = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(
            e,
            t,
            n,
            (e) => new a(this.kvStore, this.chainId, this.chainGetter, e)
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getQueryContract(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryCw20ContractInfo = d;
    },
    1740: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", {
                  enumerable: !0,
                  value: t,
                });
              }
            : function (e, t) {
                e.default = t;
              }),
        o =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          },
        s =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var n in e)
                "default" !== n &&
                  Object.prototype.hasOwnProperty.call(e, n) &&
                  r(t, e, n);
            return i(t, e), t;
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.SecretWasm = void 0),
        o(n(1434), t),
        o(n(1435), t),
        o(n(1437), t),
        (t.SecretWasm = s(n(1741))),
        o(n(1742), t);
    },
    1741: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1742: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.SecretQueriesImpl = t.SecretQueries = void 0);
      const r = n(1434),
        i = n(1743),
        o = n(1435);
      t.SecretQueries = {
        use: (e) => (t, n, r, i) => ({
          secret: new s(t, n, r, i, e.apiGetter),
        }),
      };
      class s {
        constructor(e, t, n, s, a) {
          (this.querySecretContractCodeHash =
            new r.ObservableQuerySecretContractCodeHash(t, n, s)),
            e.queryBalances.addBalanceRegistry(
              new o.ObservableQuerySecret20BalanceRegistry(
                t,
                a,
                this.querySecretContractCodeHash
              )
            ),
            (this.querySecret20ContractInfo =
              new i.ObservableQuerySecret20ContractInfo(
                t,
                n,
                s,
                a,
                this.querySecretContractCodeHash
              ));
        }
      }
      t.SecretQueriesImpl = s;
    },
    1743: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQuerySecret20ContractInfo =
          t.ObservableQuerySecret20ContactInfoInner =
            void 0);
      const i = n(91),
        o = n(7),
        s = n(1436);
      class a extends s.ObservableSecretContractChainQuery {
        constructor(e, t, n, r, i, s) {
          super(e, t, n, r, i, { token_info: {} }, s),
            (this.apiGetter = r),
            (this.contractAddress = i),
            (this.querySecretContractCodeHash = s),
            o.makeObservable(this);
        }
        get error() {
          return (
            super.error ||
            this.querySecretContractCodeHash.getQueryContract(
              this.contractAddress
            ).error
          );
        }
        get tokenInfo() {
          if (this.response) return this.response.data.token_info;
        }
      }
      r([o.computed], a.prototype, "tokenInfo", null),
        (t.ObservableQuerySecret20ContactInfoInner = a);
      class d extends i.ObservableChainQueryMap {
        constructor(e, t, n, r, i) {
          super(
            e,
            t,
            n,
            (e) =>
              new a(
                this.kvStore,
                this.chainId,
                this.chainGetter,
                this.apiGetter,
                e,
                i
              )
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n),
            (this.apiGetter = r),
            (this.querySecretContractCodeHash = i);
        }
        getQueryContract(e) {
          return this.get(e);
        }
      }
      t.ObservableQuerySecret20ContractInfo = d;
    },
    1744: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", {
                  enumerable: !0,
                  value: t,
                });
              }
            : function (e, t) {
                e.default = t;
              }),
        o =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          },
        s =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var n in e)
                "default" !== n &&
                  Object.prototype.hasOwnProperty.call(e, n) &&
                  r(t, e, n);
            return i(t, e), t;
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.TxFeesBaseDenom =
          t.TxFeesSpotPriceByDenom =
          t.TxFeesFeeTokens =
            void 0),
        o(n(1438), t),
        o(n(1439), t),
        o(n(1440), t),
        (t.TxFeesFeeTokens = s(n(1745))),
        (t.TxFeesSpotPriceByDenom = s(n(1746))),
        (t.TxFeesBaseDenom = s(n(1747))),
        o(n(1748), t);
    },
    1745: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1746: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1747: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1748: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.OsmosisQueriesImpl = t.OsmosisQueries = void 0);
      const r = n(1438),
        i = n(1439),
        o = n(1440);
      t.OsmosisQueries = {
        use: () => (e, t, n, r) => ({ osmosis: new s(e, t, n, r) }),
      };
      class s {
        constructor(e, t, n, s) {
          (this.queryTxFeesFeeTokens = new r.ObservableQueryTxFeesFeeTokens(
            t,
            n,
            s
          )),
            (this.queryTxFeesSpotPriceByDenom =
              new i.ObservableQueryTxFeesSpotPriceByDenom(t, n, s)),
            (this.queryTxFeesBaseDenom = new o.ObservableQueryTxFeesBaseDenom(
              t,
              n,
              s
            ));
        }
      }
      t.OsmosisQueriesImpl = s;
    },
    1749: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", {
                  enumerable: !0,
                  value: t,
                });
              }
            : function (e, t) {
                e.default = t;
              }),
        o =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          },
        s =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var n in e)
                "default" !== n &&
                  Object.prototype.hasOwnProperty.call(e, n) &&
                  r(t, e, n);
            return i(t, e), t;
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ICNS = void 0),
        o(n(1441), t),
        o(n(1750), t),
        (t.ICNS = s(n(1751)));
    },
    1750: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ICNSQueriesImpl = t.ICNSQueries = void 0);
      const r = n(1441);
      t.ICNSQueries = {
        use: () => (e, t, n, r) => ({ icns: new i(e, t, n, r) }),
      };
      class i {
        constructor(e, t, n, i) {
          this.queryICNSNames = new r.ObservableQueryICNSNames(t, n, i);
        }
      }
      t.ICNSQueriesImpl = i;
    },
    1751: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    1752: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ChainStore = t.ChainInfoInner = void 0);
      const i = n(7),
        o = n(8),
        s = n(252);
      class a {
        constructor(e) {
          (this.unknownDenoms = []),
            (this.registeredCurrencies = []),
            (this.currencyRegistrars = []),
            (this._chainInfo = e),
            i.makeObservable(this),
            s.keepAlive(this, "currencyMap");
        }
        getCurrencyFromRegistrars(e) {
          for (let t = 0; t < this.currencyRegistrars.length; t++) {
            const n = (0, this.currencyRegistrars[t])(e);
            if (n) return "coinMinimalDenom" in n ? [n, !0] : n;
          }
        }
        addUnknownCurrencies(...e) {
          for (const t of e) {
            if (this.unknownDenoms.find((e) => e === t)) continue;
            if (this.currencyMap.has(t)) continue;
            this.unknownDenoms.push(t);
            const e = i.autorun(() => {
              const n = this.getCurrencyFromRegistrars(t);
              if (n) {
                const [r, o] = n;
                i.runInAction(() => {
                  if (r) {
                    const e = this.unknownDenoms.findIndex((e) => e === t);
                    e >= 0 && this.unknownDenoms.splice(e, 1),
                      this.addOrReplaceCurrency(r);
                  }
                  o && e();
                });
              } else e();
            });
          }
        }
        registerCurrencyRegistrar(e) {
          this.currencyRegistrars.push(e);
        }
        setChainInfo(e) {
          this._chainInfo = e;
        }
        get raw() {
          return this._chainInfo;
        }
        get chainId() {
          return this._chainInfo.chainId;
        }
        get currencies() {
          return this._chainInfo.currencies.concat(this.registeredCurrencies);
        }
        get currencyMap() {
          const e = new Map();
          for (const t of this.currencies) e.set(t.coinMinimalDenom, t);
          return e;
        }
        addCurrencies(...e) {
          const t = this.currencyMap;
          for (const n of e)
            t.has(n.coinMinimalDenom) || this.registeredCurrencies.push(n);
        }
        removeCurrencies(...e) {
          const t = new Map();
          for (const n of e) t.set(n, !0);
          this.registeredCurrencies = this.registeredCurrencies.filter(
            (e) => !t.get(e.coinMinimalDenom)
          );
        }
        findCurrency(e) {
          return this.currencyMap.has(e)
            ? this.currencyMap.get(e)
            : (this.addUnknownCurrencies(e),
              this.currencyMap.has(e) ? this.currencyMap.get(e) : void 0);
        }
        forceFindCurrency(e) {
          const t = this.findCurrency(e);
          return t || { coinMinimalDenom: e, coinDenom: e, coinDecimals: 0 };
        }
        addOrReplaceCurrency(e) {
          if (this.currencyMap.has(e.coinMinimalDenom)) {
            const t = this.registeredCurrencies.findIndex(
              (t) => t.coinMinimalDenom === e.coinMinimalDenom
            );
            t >= 0 && this.registeredCurrencies.splice(t, 1, e);
          } else this.registeredCurrencies.push(e);
        }
        get stakeCurrency() {
          return this.raw.stakeCurrency;
        }
        get alternativeBIP44s() {
          return this.raw.alternativeBIP44s;
        }
        get bech32Config() {
          return this.raw.bech32Config;
        }
        get beta() {
          return this.raw.beta;
        }
        get bip44() {
          return this.raw.bip44;
        }
        get chainName() {
          return this.raw.chainName;
        }
        get coinType() {
          return this.raw.coinType;
        }
        get features() {
          return this.raw.features;
        }
        get feeCurrencies() {
          return this.raw.feeCurrencies;
        }
        get rest() {
          return this.raw.rest;
        }
        get restConfig() {
          return this.raw.restConfig;
        }
        get rpc() {
          return this.raw.rpc;
        }
        get rpcConfig() {
          return this.raw.rpcConfig;
        }
        get walletUrl() {
          return this.raw.walletUrl;
        }
        get walletUrlForStaking() {
          return this.raw.walletUrlForStaking;
        }
      }
      r([i.observable.ref], a.prototype, "_chainInfo", void 0),
        r([i.observable.shallow], a.prototype, "unknownDenoms", void 0),
        r([i.observable.shallow], a.prototype, "registeredCurrencies", void 0),
        r([i.observable], a.prototype, "currencyRegistrars", void 0),
        r([i.action], a.prototype, "addUnknownCurrencies", null),
        r([i.action], a.prototype, "registerCurrencyRegistrar", null),
        r([i.action], a.prototype, "setChainInfo", null),
        r([i.computed], a.prototype, "currencyMap", null),
        r([i.action], a.prototype, "addCurrencies", null),
        r([i.action], a.prototype, "removeCurrencies", null),
        r([i.action], a.prototype, "addOrReplaceCurrency", null),
        (t.ChainInfoInner = a);
      class d {
        constructor(e) {
          (this.setChainInfoHandlers = []),
            (this._cachedChainInfosMap = new Map()),
            this.setChainInfos(e),
            i.makeObservable(this);
        }
        get chainInfos() {
          return this._chainInfos;
        }
        getChain(e) {
          const t = o.ChainIdHelper.parse(e),
            n = this.chainInfos.find(
              (e) =>
                o.ChainIdHelper.parse(e.chainId).identifier === t.identifier
            );
          if (!n) throw new Error("Unknown chain info: " + e);
          return n;
        }
        hasChain(e) {
          const t = o.ChainIdHelper.parse(e);
          return (
            null !=
            this.chainInfos.find(
              (e) =>
                o.ChainIdHelper.parse(e.chainId).identifier === t.identifier
            )
          );
        }
        addSetChainInfoHandler(e) {
          this.setChainInfoHandlers.push(e);
          for (const t of this.chainInfos) {
            e(this._cachedChainInfosMap.get(t.chainId));
          }
        }
        setChainInfos(e) {
          const t = [];
          for (const n of e)
            if (this._cachedChainInfosMap.has(n.chainId)) {
              const e = this._cachedChainInfosMap.get(n.chainId);
              e.setChainInfo(n), t.push(e);
            } else {
              const e = new a(n);
              this._cachedChainInfosMap.set(n.chainId, e), t.push(e);
              for (const t of this.setChainInfoHandlers) t(e);
            }
          this._chainInfos = t;
        }
      }
      r([i.observable.ref], d.prototype, "_chainInfos", void 0),
        r([i.action], d.prototype, "setChainInfos", null),
        (t.ChainStore = d);
    },
    1753: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1754), t),
        i(n(1762), t),
        i(n(1763), t);
    },
    1754: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1755), t),
        i(n(1756), t),
        i(n(1757), t),
        i(n(1758), t),
        i(n(1759), t),
        i(n(1760), t),
        i(n(1761), t);
    },
    1755: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.InteractionStore = void 0);
      const i = n(4),
        o = n(61),
        s = n(7);
      class a {
        constructor(e, t) {
          (this.router = e),
            (this.msgRequester = t),
            (this.datas = new Map()),
            (this.events = new Map()),
            s.makeObservable(this);
          const n = new o.InteractionForegroundService(this);
          o.interactionForegroundInit(e, n);
        }
        getDatas(e) {
          var t;
          return null !== (t = s.toJS(this.datas.get(e))) && void 0 !== t
            ? t
            : [];
        }
        getEvents(e) {
          var t;
          return null !== (t = s.toJS(this.events.get(e))) && void 0 !== t
            ? t
            : [];
        }
        onInteractionDataReceived(e) {
          this.datas.has(e.type) ||
            this.datas.set(e.type, s.observable.array([], { deep: !1 })),
            this.datas.get(e.type).push(e);
        }
        onEventDataReceived(e) {
          this.events.has(e.type) ||
            this.events.set(e.type, s.observable.array([], { deep: !1 })),
            this.events.get(e.type).push(e);
        }
        *approve(e, t, n) {
          this.removeData(e, t),
            yield this.msgRequester.sendMessage(
              i.BACKGROUND_PORT,
              new o.ApproveInteractionMsg(t, n)
            );
        }
        *approveWithoutRemovingData(e, t) {
          yield this.msgRequester.sendMessage(
            i.BACKGROUND_PORT,
            new o.ApproveInteractionMsg(e, t)
          );
        }
        *reject(e, t) {
          this.removeData(e, t),
            yield this.msgRequester.sendMessage(
              i.BACKGROUND_PORT,
              new o.RejectInteractionMsg(t)
            );
        }
        *rejectAll(e) {
          const t = this.getDatas(e);
          for (const e of t) yield this.reject(e.type, e.id);
        }
        removeData(e, t) {
          if (this.datas.has(e)) {
            const n = this.datas.get(e).find((e) => e.id === t);
            n && this.datas.get(e).remove(n);
          }
        }
        clearEvent(e) {
          this.events.has(e) &&
            this.events.get(e).length > 0 &&
            this.events.set(e, s.observable.array([], { deep: !1 }));
        }
      }
      r([s.observable.shallow], a.prototype, "datas", void 0),
        r([s.observable.shallow], a.prototype, "events", void 0),
        r([s.action], a.prototype, "onInteractionDataReceived", null),
        r([s.action], a.prototype, "onEventDataReceived", null),
        r([s.flow], a.prototype, "approve", null),
        r([s.flow], a.prototype, "approveWithoutRemovingData", null),
        r([s.flow], a.prototype, "reject", null),
        r([s.flow], a.prototype, "rejectAll", null),
        r([s.action], a.prototype, "removeData", null),
        r([s.action], a.prototype, "clearEvent", null),
        (t.InteractionStore = a);
    },
    1756: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.GeneralPermissionStore =
          t.PermissionStore =
          t.BasicAccessPermissionInnerStore =
          t.Secret20ViewingKeyPermissionInnerStore =
            void 0);
      const o = n(61),
        s = n(7),
        a = n(199),
        d = n(4),
        c = n(29);
      class u {
        constructor(e, t, n) {
          (this.chainId = e),
            (this.contractAddress = t),
            (this.requester = n),
            (this._origins = []),
            s.makeObservable(this),
            this.refreshOrigins();
        }
        get origins() {
          return this._origins;
        }
        *removeOrigin(e) {
          yield this.requester.sendMessage(
            d.BACKGROUND_PORT,
            new o.RemovePermissionOrigin(
              this.chainId,
              o.getSecret20ViewingKeyPermissionType(this.contractAddress),
              e
            )
          ),
            yield this.refreshOrigins();
        }
        *refreshOrigins() {
          this._origins = yield* c.toGenerator(
            this.requester.sendMessage(
              d.BACKGROUND_PORT,
              new o.GetPermissionOriginsMsg(
                this.chainId,
                o.getSecret20ViewingKeyPermissionType(this.contractAddress)
              )
            )
          );
        }
      }
      r([s.observable.ref], u.prototype, "_origins", void 0),
        r([s.flow], u.prototype, "removeOrigin", null),
        r([s.flow], u.prototype, "refreshOrigins", null),
        (t.Secret20ViewingKeyPermissionInnerStore = u);
      class l {
        constructor(e, t) {
          (this.chainId = e),
            (this.requester = t),
            (this._origins = []),
            s.makeObservable(this),
            this.refreshOrigins();
        }
        get origins() {
          return this._origins;
        }
        *addOrigin(e) {
          yield this.requester.sendMessage(
            d.BACKGROUND_PORT,
            new o.AddPermissionOrigin(
              this.chainId,
              o.getBasicAccessPermissionType(),
              e
            )
          ),
            yield this.refreshOrigins();
        }
        *removeOrigin(e) {
          yield this.requester.sendMessage(
            d.BACKGROUND_PORT,
            new o.RemovePermissionOrigin(
              this.chainId,
              o.getBasicAccessPermissionType(),
              e
            )
          ),
            yield this.refreshOrigins();
        }
        *refreshOrigins() {
          this._origins = yield* c.toGenerator(
            this.requester.sendMessage(
              d.BACKGROUND_PORT,
              new o.GetPermissionOriginsMsg(
                this.chainId,
                o.getBasicAccessPermissionType()
              )
            )
          );
        }
      }
      r([s.observable.ref], l.prototype, "_origins", void 0),
        r([s.flow], l.prototype, "addOrigin", null),
        r([s.flow], l.prototype, "removeOrigin", null),
        r([s.flow], l.prototype, "refreshOrigins", null),
        (t.BasicAccessPermissionInnerStore = l);
      class h extends a.HasMapStore {
        constructor(e, t) {
          super((e) => {
            const t = JSON.parse(e);
            return "basicAccess" === t.type
              ? new l(t.chainId, this.requester)
              : new u(t.chainId, t.contractAddress, this.requester);
          }),
            (this.interactionStore = e),
            (this.requester = t),
            (this._isLoading = !1),
            s.makeObservable(this);
        }
        getBasicAccessInfo(e) {
          const t = JSON.stringify({
            type: "basicAccess",
            chainId: e,
            contractAddress: "",
          });
          return this.get(t);
        }
        getOriginPermittedChains(e, t) {
          return i(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              d.BACKGROUND_PORT,
              new o.GetOriginPermittedChainsMsg(e, t)
            );
          });
        }
        getSecret20ViewingKeyAccessInfo(e, t) {
          const n = JSON.stringify({
            type: "viewingKey",
            chainId: e,
            contractAddress: t,
          });
          return this.get(n);
        }
        get waitingBasicAccessPermissions() {
          const e = this.waitingDatas,
            t = [];
          for (const n of e)
            o.isBasicAccessPermissionType(n.data.type) &&
              t.push({
                id: n.id,
                data: { chainIds: n.data.chainIds, origins: n.data.origins },
              });
          return t;
        }
        get waitingSecret20ViewingKeyAccessPermissions() {
          const e = this.waitingDatas,
            t = [];
          for (const n of e)
            o.isSecret20ViewingKeyPermissionType(n.data.type) &&
              t.push({
                id: n.id,
                data: {
                  chainIds: n.data.chainIds,
                  contractAddress: o.splitSecret20ViewingKeyPermissionType(
                    n.data.type
                  ),
                  origins: n.data.origins,
                },
              });
          return t;
        }
        get waitingDatas() {
          return this.interactionStore.getDatas(o.INTERACTION_TYPE_PERMISSION);
        }
        *approve(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.approve(
              o.INTERACTION_TYPE_PERMISSION,
              e,
              {}
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *reject(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.reject(
              o.INTERACTION_TYPE_PERMISSION,
              e
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectAll() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll(
              o.INTERACTION_TYPE_PERMISSION
            );
          } finally {
            this._isLoading = !1;
          }
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([s.observable], h.prototype, "_isLoading", void 0),
        r([s.computed], h.prototype, "waitingBasicAccessPermissions", null),
        r(
          [s.computed],
          h.prototype,
          "waitingSecret20ViewingKeyAccessPermissions",
          null
        ),
        r([s.flow], h.prototype, "approve", null),
        r([s.flow], h.prototype, "reject", null),
        r([s.flow], h.prototype, "rejectAll", null),
        (t.PermissionStore = h);
      class p {
        constructor(e, t) {
          (this.interactionStore = e),
            (this.requester = t),
            (this._isLoading = !1),
            s.makeObservable(this);
        }
        getOriginPermittedChains(e, t) {
          return i(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              d.BACKGROUND_PORT,
              new o.GetOriginPermittedChainsMsg(e, t)
            );
          });
        }
        get allWaitingPermissions() {
          return this.interactionStore.getDatas(o.INTERACTION_TYPE_PERMISSION);
        }
        get allWaitingGlobalPermissions() {
          return this.interactionStore.getDatas(
            o.INTERACTION_TYPE_GLOBAL_PERMISSION
          );
        }
        getWaitingGlobalPermissions(e) {
          return this.interactionStore
            .getDatas(o.INTERACTION_TYPE_GLOBAL_PERMISSION)
            .filter((t) => t.data.type === e);
        }
        getWaitingPermissions(e) {
          return this.interactionStore
            .getDatas(o.INTERACTION_TYPE_PERMISSION)
            .filter((t) => t.data.type === e);
        }
        *approvePermission(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.approve(
              o.INTERACTION_TYPE_PERMISSION,
              e,
              {}
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectPermission(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.reject(
              o.INTERACTION_TYPE_PERMISSION,
              e
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectAllPermission() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll(
              o.INTERACTION_TYPE_PERMISSION
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *approveGlobalPermission(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.approve(
              o.INTERACTION_TYPE_GLOBAL_PERMISSION,
              e,
              {}
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectGlobalPermission(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.reject(
              o.INTERACTION_TYPE_GLOBAL_PERMISSION,
              e
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectAllGlobalPermission() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll(
              o.INTERACTION_TYPE_GLOBAL_PERMISSION
            );
          } finally {
            this._isLoading = !1;
          }
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([s.observable], p.prototype, "_isLoading", void 0),
        r([s.flow], p.prototype, "approvePermission", null),
        r([s.flow], p.prototype, "rejectPermission", null),
        r([s.flow], p.prototype, "rejectAllPermission", null),
        r([s.flow], p.prototype, "approveGlobalPermission", null),
        r([s.flow], p.prototype, "rejectGlobalPermission", null),
        r([s.flow], p.prototype, "rejectAllGlobalPermission", null),
        (t.GeneralPermissionStore = p);
    },
    1757: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.SignInteractionStore = void 0);
      const i = n(7),
        o = n(8);
      class s {
        constructor(e) {
          (this.interactionStore = e),
            (this._isLoading = !1),
            i.makeObservable(this),
            i.autorun(() => {
              const e = this.waitingDatas.slice();
              if (e.length > 1)
                for (let t = 1; t < e.length; t++) this.rejectWithId(e[t].id);
            });
        }
        get waitingDatas() {
          return this.interactionStore.getDatas("request-sign");
        }
        get waitingData() {
          const e = this.waitingDatas;
          if (0 === e.length) return;
          const t = e[0],
            n =
              "amino" === t.data.mode
                ? o.SignDocWrapper.fromAminoSignDoc(t.data.signDoc)
                : o.SignDocWrapper.fromDirectSignDocBytes(t.data.signDocBytes);
          return {
            id: t.id,
            type: t.type,
            isInternal: t.isInternal,
            data: {
              chainId: t.data.chainId,
              msgOrigin: t.data.msgOrigin,
              signer: t.data.signer,
              signDocWrapper: n,
              signOptions: t.data.signOptions,
              isADR36WithString:
                "isADR36WithString" in t.data
                  ? t.data.isADR36WithString
                  : void 0,
              ethSignType:
                "ethSignType" in t.data ? t.data.ethSignType : void 0,
            },
          };
        }
        isEnded() {
          return this.interactionStore.getEvents("request-sign-end").length > 0;
        }
        clearEnded() {
          this.interactionStore.clearEvent("request-sign-end");
        }
        waitEnd() {
          return this.isEnded()
            ? Promise.resolve()
            : new Promise((e) => {
                const t = i.autorun(() => {
                  this.isEnded() && (e(), this.clearEnded(), t());
                });
              });
        }
        *approveAndWaitEnd(e) {
          if (0 === this.waitingDatas.length) return;
          this._isLoading = !0;
          const t = this.waitingDatas[0].id;
          try {
            const n =
              "amino" === e.mode ? e.aminoSignDoc : e.protoSignDoc.toBytes();
            yield this.interactionStore.approveWithoutRemovingData(t, n);
          } finally {
            yield this.waitEnd(),
              this.interactionStore.removeData("request-sign", t),
              (this._isLoading = !1);
          }
        }
        *reject() {
          if (0 !== this.waitingDatas.length) {
            this._isLoading = !0;
            try {
              yield this.interactionStore.reject(
                "request-sign",
                this.waitingDatas[0].id
              );
            } finally {
              this._isLoading = !1;
            }
          }
        }
        *rejectAll() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll("request-sign");
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectWithId(e) {
          yield this.interactionStore.reject("request-sign", e);
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([i.observable], s.prototype, "_isLoading", void 0),
        r([i.computed], s.prototype, "waitingData", null),
        r([i.flow], s.prototype, "approveAndWaitEnd", null),
        r([i.flow], s.prototype, "reject", null),
        r([i.flow], s.prototype, "rejectAll", null),
        r([i.flow], s.prototype, "rejectWithId", null),
        (t.SignInteractionStore = s);
    },
    1758: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.LedgerInitStore = void 0);
      const i = n(7),
        o = n(4),
        s = n(61),
        a = n(29);
      class d {
        constructor(e, t) {
          (this.interactionStore = e),
            (this.msgRequester = t),
            (this._isLoading = !1),
            (this._isWebHID = !1),
            i.makeObservable(this),
            this.fetchIsWebHID();
        }
        *fetchIsWebHID() {
          this._isWebHID = yield* a.toGenerator(
            this.msgRequester.sendMessage(
              o.BACKGROUND_PORT,
              new s.LedgerGetWebHIDFlagMsg()
            )
          );
        }
        *setWebHID(e) {
          yield this.msgRequester.sendMessage(
            o.BACKGROUND_PORT,
            new s.LedgerSetWebHIDFlagMsg(e)
          ),
            yield this.fetchIsWebHID();
        }
        get isWebHID() {
          return this._isWebHID;
        }
        get isGetPubKeySucceeded() {
          const e = this.interactionStore.getEvents("ledger-init");
          for (const t of e)
            if ("get-pubkey" === t.data.event && t.data.success) return !0;
          return !1;
        }
        get isSignCompleted() {
          return this.isSignSucceeded || this.isSignRejected;
        }
        get isSignSucceeded() {
          const e = this.interactionStore.getEvents("ledger-init");
          for (const t of e)
            if ("sign" === t.data.event && t.data.success) return !0;
          return !1;
        }
        get isSignRejected() {
          const e = this.interactionStore.getEvents("ledger-init");
          for (const t of e)
            if ("sign" === t.data.event && !t.data.success) return !0;
          return !1;
        }
        get isInitAborted() {
          const e = this.interactionStore.getEvents("ledger-init");
          for (const t of e) if ("init-aborted" === t.data.event) return !0;
          return !1;
        }
        get isInitNeeded() {
          const e = this.interactionStore.getDatas("ledger-init");
          for (const t of e) if ("init-failed" === t.data.event) return !0;
          return !1;
        }
        get requestedLedgerApp() {
          if (!this.isInitNeeded) return;
          const e = this.interactionStore.getDatas("ledger-init");
          for (const t of e)
            if ("init-failed" === t.data.event) return t.data.ledgerApp;
        }
        get cosmosLikeApp() {
          if (!this.isInitNeeded) return;
          const e = this.interactionStore.getDatas("ledger-init");
          for (const t of e)
            if ("init-failed" === t.data.event) return t.data.cosmosLikeApp;
        }
        *resume(...e) {
          this._isLoading = !0;
          try {
            const t = this.interactionStore.getDatas("ledger-init");
            for (const n of t)
              if ("init-failed" === n.data.event) {
                yield this.interactionStore.approve("ledger-init", n.id, {
                  initArgs: e,
                });
                break;
              }
          } finally {
            this._isLoading = !1;
          }
        }
        *resumeAll(...e) {
          this._isLoading = !0;
          try {
            const t = this.interactionStore.getDatas("ledger-init");
            for (const n of t)
              "init-failed" === n.data.event &&
                (yield this.interactionStore.approve("ledger-init", n.id, {
                  initArgs: e,
                }));
          } finally {
            this._isLoading = !1;
          }
        }
        *abort() {
          this._isLoading = !0;
          try {
            const e = this.interactionStore.getDatas("ledger-init");
            for (const t of e)
              if ("init-failed" === t.data.event) {
                yield this.interactionStore.approve("ledger-init", t.id, {
                  abort: !0,
                });
                break;
              }
          } finally {
            this._isLoading = !1;
          }
        }
        *abortAll() {
          this._isLoading = !0;
          try {
            const e = this.interactionStore.getDatas("ledger-init");
            for (const t of e)
              "init-failed" === t.data.event &&
                (yield this.interactionStore.approve("ledger-init", t.id, {
                  abort: !0,
                }));
          } finally {
            this._isLoading = !1;
          }
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([i.observable], d.prototype, "_isLoading", void 0),
        r([i.observable], d.prototype, "_isWebHID", void 0),
        r([i.flow], d.prototype, "fetchIsWebHID", null),
        r([i.flow], d.prototype, "setWebHID", null),
        r([i.computed], d.prototype, "isGetPubKeySucceeded", null),
        r([i.computed], d.prototype, "isSignCompleted", null),
        r([i.computed], d.prototype, "isSignSucceeded", null),
        r([i.computed], d.prototype, "isSignRejected", null),
        r([i.computed], d.prototype, "isInitAborted", null),
        r([i.computed], d.prototype, "isInitNeeded", null),
        r([i.computed], d.prototype, "requestedLedgerApp", null),
        r([i.computed], d.prototype, "cosmosLikeApp", null),
        r([i.flow], d.prototype, "resume", null),
        r([i.flow], d.prototype, "resumeAll", null),
        r([i.flow], d.prototype, "abort", null),
        r([i.flow], d.prototype, "abortAll", null),
        (t.LedgerInitStore = d);
    },
    1759: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.KeystoneStore = void 0);
      const i = n(7),
        o = n(61);
      class s {
        constructor(e) {
          (this.interactionStore = e), i.makeObservable(this);
        }
        *rejectGetPubkey() {
          yield this.interactionStore.rejectAll(o.TYPE_KEYSTONE_GET_PUBKEY);
        }
        *resolveGetPubkey(e) {
          const t = this.interactionStore.getDatas(o.TYPE_KEYSTONE_GET_PUBKEY);
          0 !== t.length &&
            (yield this.interactionStore.approve(
              o.TYPE_KEYSTONE_GET_PUBKEY,
              t[0].id,
              e
            ));
        }
        *rejectSign() {
          yield this.interactionStore.rejectAll(o.TYPE_KEYSTONE_SIGN);
        }
        *resolveSign(e) {
          const t = this.interactionStore.getDatas(o.TYPE_KEYSTONE_SIGN);
          0 !== t.length &&
            (yield this.interactionStore.approve(
              o.TYPE_KEYSTONE_SIGN,
              t[0].id,
              e
            ));
        }
        get signData() {
          const e = this.interactionStore.getDatas(o.TYPE_KEYSTONE_SIGN);
          if (0 !== e.length) return e[0];
        }
      }
      r([i.flow], s.prototype, "rejectGetPubkey", null),
        r([i.flow], s.prototype, "resolveGetPubkey", null),
        r([i.flow], s.prototype, "rejectSign", null),
        r([i.flow], s.prototype, "resolveSign", null),
        r([i.computed], s.prototype, "signData", null),
        (t.KeystoneStore = s);
    },
    1760: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ChainSuggestStore = void 0);
      const o = n(61),
        s = n(7),
        a = n(8),
        d = i(n(62)),
        c = n(29);
      class u {
        constructor(e, t) {
          (this.interactionStore = e),
            (this.communityChainInfoRepo = t),
            (this._isLoading = !1),
            (this.communityChainInfo = new Map()),
            s.makeObservable(this);
        }
        get waitingSuggestedChainInfo() {
          const e = this.interactionStore.getDatas(
            o.SuggestChainInfoMsg.type()
          );
          if (e.length > 0) return e[0];
        }
        get communityChainInfoRepoUrl() {
          return `https://github.com/${this.communityChainInfoRepo.organizationName}/${this.communityChainInfoRepo.repoName}`;
        }
        getCommunityChainInfoUrl(e) {
          const t = a.ChainIdHelper.parse(e);
          return `${this.communityChainInfoRepoUrl}/blob/${this.communityChainInfoRepo.branchName}/cosmos/${t.identifier}.json`;
        }
        getCommunityChainInfo(e) {
          const t = a.ChainIdHelper.parse(e).identifier;
          return (
            this.communityChainInfo.has(t) || this.fetchCommunityChainInfo(e),
            this.communityChainInfo.get(t)
          );
        }
        *fetchCommunityChainInfo(e) {
          const t = a.ChainIdHelper.parse(e).identifier;
          if (!this.communityChainInfo.get(t)) {
            this.communityChainInfo.set(t, {
              isLoading: !0,
              chainInfo: void 0,
            });
            try {
              const e = yield* c.toGenerator(
                d.default.get(`/cosmos/${t}.json`, {
                  baseURL: `https://raw.githubusercontent.com/${this.communityChainInfoRepo.organizationName}/${this.communityChainInfoRepo.repoName}/${this.communityChainInfoRepo.branchName}`,
                })
              );
              if (a.ChainIdHelper.parse(e.data.chainId).identifier !== t)
                throw new Error(
                  `Invalid chain identifier: (expected: ${t}, actual: ${
                    a.ChainIdHelper.parse(e.data.chainId).identifier
                  })`
                );
              this.communityChainInfo.set(t, {
                isLoading: !1,
                chainInfo: e.data,
              });
            } catch (e) {
              console.log(e),
                this.communityChainInfo.set(t, {
                  isLoading: !1,
                  chainInfo: void 0,
                });
            }
          }
        }
        *approve(e) {
          this._isLoading = !0;
          try {
            const t = this.waitingSuggestedChainInfo;
            t && (yield this.interactionStore.approve(t.type, t.id, e));
          } finally {
            this._isLoading = !1;
          }
        }
        *reject() {
          this._isLoading = !0;
          try {
            const e = this.waitingSuggestedChainInfo;
            e && (yield this.interactionStore.reject(e.type, e.id));
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectAll() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll(o.SuggestChainInfoMsg.type());
          } finally {
            this._isLoading = !1;
          }
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([s.observable], u.prototype, "_isLoading", void 0),
        r([s.observable.shallow], u.prototype, "communityChainInfo", void 0),
        r([s.flow], u.prototype, "fetchCommunityChainInfo", null),
        r([s.flow], u.prototype, "approve", null),
        r([s.flow], u.prototype, "reject", null),
        r([s.flow], u.prototype, "rejectAll", null),
        (t.ChainSuggestStore = u);
    },
    1761: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ICNSInteractionStore = void 0);
      const i = n(7),
        o = n(61);
      class s {
        constructor(e) {
          (this.interactionStore = e),
            (this._isLoading = !1),
            i.makeObservable(this);
        }
        get waitingDatas() {
          return this.interactionStore.getDatas(
            o.RequestICNSAdr36SignaturesMsg.type()
          );
        }
        get waitingData() {
          const e = this.waitingDatas;
          if (0 !== e.length) return e[0];
        }
        *approve(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.approve(
              o.RequestICNSAdr36SignaturesMsg.type(),
              e,
              {}
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *reject(e) {
          this._isLoading = !0;
          try {
            yield this.interactionStore.reject(
              o.RequestICNSAdr36SignaturesMsg.type(),
              e
            );
          } finally {
            this._isLoading = !1;
          }
        }
        *rejectAll() {
          this._isLoading = !0;
          try {
            yield this.interactionStore.rejectAll(
              o.RequestICNSAdr36SignaturesMsg.type()
            );
          } finally {
            this._isLoading = !1;
          }
        }
        get isLoading() {
          return this._isLoading;
        }
      }
      r([i.observable], s.prototype, "_isLoading", void 0),
        r([i.computed], s.prototype, "waitingData", null),
        r([i.flow], s.prototype, "approve", null),
        r([i.flow], s.prototype, "reject", null),
        r([i.flow], s.prototype, "rejectAll", null),
        (t.ICNSInteractionStore = s);
    },
    1762: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.KeyRingStore = t.KeyRingSelectablesStore = void 0);
      const o = n(4),
        s = n(61),
        a = n(7),
        d = n(29);
      class c {
        constructor(e, t, n, r) {
          (this.chainGetter = e),
            (this.requester = t),
            (this.chainId = n),
            (this.keyRingStore = r),
            (this.isInitializing = !1),
            (this._isKeyStoreCoinTypeSet = !1),
            (this._selectables = []),
            a.makeObservable(this),
            this.refresh();
        }
        get needSelectCoinType() {
          const e = this.chainGetter.getChain(this.chainId);
          return (
            !(!e.alternativeBIP44s || 0 === e.alternativeBIP44s.length) &&
            !this.isInitializing &&
            !this._isKeyStoreCoinTypeSet
          );
        }
        get selectables() {
          return this._selectables;
        }
        *refresh() {
          var e;
          if ("mnemonic" !== this.keyRingStore.keyRingType)
            return (
              (this.isInitializing = !1),
              (this._isKeyStoreCoinTypeSet = !0),
              void (this._selectables = [])
            );
          this.isInitializing = !0;
          const t = this.chainGetter.getChain(this.chainId),
            n = new s.GetIsKeyStoreCoinTypeSetMsg(this.chainId, [
              t.bip44,
              ...(null !== (e = t.alternativeBIP44s) && void 0 !== e ? e : []),
            ]),
            r = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, n)
            );
          0 === r.length
            ? (this._isKeyStoreCoinTypeSet = !0)
            : 1 === r.length
            ? (yield this.keyRingStore.setKeyStoreCoinType(
                this.chainId,
                r[0].path.coinType
              ),
              (this._isKeyStoreCoinTypeSet = !0))
            : ((this._selectables = r), (this._isKeyStoreCoinTypeSet = !1)),
            (this.isInitializing = !1);
        }
      }
      r([a.observable], c.prototype, "isInitializing", void 0),
        r([a.observable], c.prototype, "_isKeyStoreCoinTypeSet", void 0),
        r([a.observable.ref], c.prototype, "_selectables", void 0),
        r([a.computed], c.prototype, "needSelectCoinType", null),
        r([a.flow], c.prototype, "refresh", null),
        (t.KeyRingSelectablesStore = c);
      class u {
        constructor(e, t, n, r, i) {
          (this.eventDispatcher = e),
            (this.defaultKdf = t),
            (this.chainGetter = n),
            (this.requester = r),
            (this.interactionStore = i),
            (this.status = s.KeyRingStatus.NOTLOADED),
            (this.multiKeyStoreInfo = []),
            (this.selectablesMap = new Map()),
            (this.keyStoreChangedListeners = []),
            a.makeObservable(this),
            this.restore();
        }
        get waitingNameData() {
          const e = this.interactionStore.getDatas("change-keyring-name");
          if (e.length > 0) return e[0];
        }
        get keyRingType() {
          const e = this.multiKeyStoreInfo.find((e) => e.selected);
          return e ? s.KeyRing.getTypeOfKeyStore(e) : "none";
        }
        *approveChangeName(e) {
          const t = this.interactionStore.getDatas("change-keyring-name")[0];
          yield this.interactionStore.approve("change-keyring-name", t.id, e),
            this.dispatchKeyStoreChangeEvent(),
            this.selectablesMap.forEach((e) => e.refresh());
        }
        *createMnemonicKey(e, t, n, r, i = this.defaultKdf) {
          const a = new s.CreateMnemonicKeyMsg(i, e, t, n, r),
            c = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, a)
            );
          (this.status = c.status),
            (this.multiKeyStoreInfo = c.multiKeyStoreInfo);
        }
        *createPrivateKey(e, t, n, r = this.defaultKdf) {
          const i = new s.CreatePrivateKeyMsg(r, e, t, n),
            a = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, i)
            );
          (this.status = a.status),
            (this.multiKeyStoreInfo = a.multiKeyStoreInfo);
        }
        *createKeystoneKey(e, t, n, r = this.defaultKdf) {
          const i = new s.CreateKeystoneKeyMsg(r, e, t, n),
            a = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, i)
            );
          (this.status = a.status),
            (this.multiKeyStoreInfo = a.multiKeyStoreInfo);
        }
        *createLedgerKey(e, t, n, r, i = this.defaultKdf) {
          const a = new s.CreateLedgerKeyMsg(i, e, t, n, r),
            c = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, a)
            );
          (this.status = c.status),
            (this.multiKeyStoreInfo = c.multiKeyStoreInfo);
        }
        *addMnemonicKey(e, t, n, r = this.defaultKdf) {
          const i = new s.AddMnemonicKeyMsg(r, e, t, n);
          this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(o.BACKGROUND_PORT, i)
          )).multiKeyStoreInfo;
        }
        *addPrivateKey(e, t, n = this.defaultKdf) {
          const r = new s.AddPrivateKeyMsg(n, e, t);
          this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(o.BACKGROUND_PORT, r)
          )).multiKeyStoreInfo;
        }
        *addKeystoneKey(e, t, n = this.defaultKdf) {
          const r = new s.AddKeystoneKeyMsg(n, e, t);
          this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(o.BACKGROUND_PORT, r)
          )).multiKeyStoreInfo;
        }
        *addLedgerKey(e, t, n, r = this.defaultKdf) {
          const i = new s.AddLedgerKeyMsg(r, e, t, n);
          this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(o.BACKGROUND_PORT, i)
          )).multiKeyStoreInfo;
        }
        *changeKeyRing(e) {
          const t = new s.ChangeKeyRingMsg(e);
          (this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(o.BACKGROUND_PORT, t)
          )).multiKeyStoreInfo),
            this.dispatchKeyStoreChangeEvent(),
            this.selectablesMap.forEach((e) => e.refresh());
        }
        *lock() {
          const e = new s.LockKeyRingMsg(),
            t = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, e)
            );
          this.status = t.status;
        }
        *unlock(e) {
          const t = new s.UnlockKeyRingMsg(e),
            n = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, t)
            );
          this.status = n.status;
          for (const e of this.interactionStore.getDatas("unlock"))
            yield this.interactionStore.approve("unlock", e.id, {});
          this.dispatchKeyStoreChangeEvent(),
            this.selectablesMap.forEach((e) => e.refresh());
        }
        *rejectAll() {
          yield this.interactionStore.rejectAll("unlock");
        }
        *restore() {
          const e = new s.RestoreKeyRingMsg(),
            t = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, e)
            );
          (this.status = t.status),
            (this.multiKeyStoreInfo = t.multiKeyStoreInfo);
        }
        showKeyRing(e, t) {
          return i(this, void 0, void 0, function* () {
            const n = new s.ShowKeyRingMsg(e, t);
            return yield this.requester.sendMessage(o.BACKGROUND_PORT, n);
          });
        }
        *deleteKeyRing(e, t) {
          const n = this.multiKeyStoreInfo.findIndex((e) => e.selected),
            r = new s.DeleteKeyRingMsg(e, t),
            i = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, r)
            );
          (this.status = i.status),
            (this.multiKeyStoreInfo = i.multiKeyStoreInfo),
            n === e &&
              (this.dispatchKeyStoreChangeEvent(),
              this.selectablesMap.forEach((e) => e.refresh()));
        }
        *updateNameKeyRing(e, t) {
          const n = new s.UpdateNameKeyRingMsg(e, t),
            r = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, n)
            );
          this.multiKeyStoreInfo = r.multiKeyStoreInfo;
          this.multiKeyStoreInfo.findIndex((e) => e.selected) === e &&
            this.dispatchKeyStoreChangeEvent();
        }
        checkPassword(e) {
          return i(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.CheckPasswordMsg(e)
            );
          });
        }
        getKeyStoreSelectables(e) {
          return (
            this.selectablesMap.has(e) ||
              a.runInAction(() => {
                this.selectablesMap.set(
                  e,
                  new c(this.chainGetter, this.requester, e, this)
                );
              }),
            this.selectablesMap.get(e)
          );
        }
        *setKeyStoreCoinType(e, t) {
          const n = yield* d.toGenerator(
            this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.SetKeyStoreCoinTypeMsg(e, t)
            )
          );
          (this.multiKeyStoreInfo = (yield* d.toGenerator(
            this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.GetMultiKeyStoreInfoMsg()
            )
          )).multiKeyStoreInfo),
            (this.status = n),
            this.dispatchKeyStoreChangeEvent(),
            this.selectablesMap.forEach((e) => e.refresh());
        }
        exportKeyRingDatas(e) {
          return i(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(
              o.BACKGROUND_PORT,
              new s.ExportKeyRingDatasMsg(e)
            );
          });
        }
        dispatchKeyStoreChangeEvent() {
          this.eventDispatcher.dispatchEvent("keplr_keystorechange");
          for (const e of this.keyStoreChangedListeners) e();
        }
        addKeyStoreChangedListener(e) {
          this.keyStoreChangedListeners.push(e);
        }
        removeKeyStoreChangedListener(e) {
          const t = this.keyStoreChangedListeners.indexOf(e);
          t >= 0 && this.keyStoreChangedListeners.splice(t, 1);
        }
      }
      r([a.observable], u.prototype, "status", void 0),
        r([a.observable], u.prototype, "multiKeyStoreInfo", void 0),
        r([a.observable.shallow], u.prototype, "selectablesMap", void 0),
        r([a.computed], u.prototype, "keyRingType", null),
        r([a.flow], u.prototype, "approveChangeName", null),
        r([a.flow], u.prototype, "createMnemonicKey", null),
        r([a.flow], u.prototype, "createPrivateKey", null),
        r([a.flow], u.prototype, "createKeystoneKey", null),
        r([a.flow], u.prototype, "createLedgerKey", null),
        r([a.flow], u.prototype, "addMnemonicKey", null),
        r([a.flow], u.prototype, "addPrivateKey", null),
        r([a.flow], u.prototype, "addKeystoneKey", null),
        r([a.flow], u.prototype, "addLedgerKey", null),
        r([a.flow], u.prototype, "changeKeyRing", null),
        r([a.flow], u.prototype, "lock", null),
        r([a.flow], u.prototype, "unlock", null),
        r([a.flow], u.prototype, "rejectAll", null),
        r([a.flow], u.prototype, "restore", null),
        r([a.flow], u.prototype, "deleteKeyRing", null),
        r([a.flow], u.prototype, "updateNameKeyRing", null),
        r([a.flow], u.prototype, "setKeyStoreCoinType", null),
        (t.KeyRingStore = u);
    },
    1763: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.TokensStore = t.TokensStoreInner = void 0);
      const i = n(199),
        o = n(4),
        s = n(61),
        a = n(7),
        d = n(29),
        c = n(8);
      class u {
        constructor(e, t, n, r) {
          (this.eventListener = e),
            (this.chainStore = t),
            (this.chainId = n),
            (this.requester = r),
            (this._tokens = []),
            a.makeObservable(this),
            this.refreshTokens(),
            this.eventListener.addEventListener("keplr_keystoreunlock", () => {
              this.refreshTokens();
            }),
            this.eventListener.addEventListener("keplr_keystorechange", () => {
              this.refreshTokens();
            });
        }
        get tokens() {
          return this._tokens;
        }
        *refreshTokens() {
          const e = this.chainStore.getChain(this.chainId);
          if (
            e.features &&
            (e.features.includes("secretwasm") ||
              e.features.includes("cosmwasm"))
          ) {
            const e = new s.GetTokensMsg(this.chainId);
            this._tokens = yield* d.toGenerator(
              this.requester.sendMessage(o.BACKGROUND_PORT, e)
            );
          } else this._tokens = [];
        }
        *addToken(e) {
          const t = new s.AddTokenMsg(this.chainId, e);
          yield this.requester.sendMessage(o.BACKGROUND_PORT, t),
            yield this.refreshTokens();
        }
        *removeToken(e) {
          const t = new s.RemoveTokenMsg(this.chainId, e);
          yield this.requester.sendMessage(o.BACKGROUND_PORT, t),
            yield this.refreshTokens();
        }
      }
      r([a.observable.ref], u.prototype, "_tokens", void 0),
        r([a.flow], u.prototype, "refreshTokens", null),
        r([a.flow], u.prototype, "addToken", null),
        r([a.flow], u.prototype, "removeToken", null),
        (t.TokensStoreInner = u);
      class l extends i.HasMapStore {
        constructor(e, t, n, r) {
          super(
            (e) => new u(this.eventListener, this.chainStore, e, this.requester)
          ),
            (this.eventListener = e),
            (this.chainStore = t),
            (this.requester = n),
            (this.interactionStore = r),
            (this.prevTokens = new Map()),
            a.makeObservable(this),
            this.chainStore.addSetChainInfoHandler((e) => {
              a.autorun(() => {
                var t;
                const n = c.ChainIdHelper.parse(e.chainId),
                  r =
                    null !== (t = this.prevTokens.get(n.identifier)) &&
                    void 0 !== t
                      ? t
                      : [];
                e.removeCurrencies(...r.map((e) => e.coinMinimalDenom));
                const i = this.getTokensOf(e.chainId);
                e.addCurrencies(...i.tokens),
                  this.prevTokens.set(n.identifier, i.tokens);
              });
            });
        }
        getTokensOf(e) {
          return this.get(e);
        }
        get waitingSuggestedToken() {
          const e = this.interactionStore.getDatas(s.SuggestTokenMsg.type());
          if (e.length > 0) return e[0];
        }
        *approveSuggestedToken(e) {
          const t = this.waitingSuggestedToken;
          t &&
            (yield this.interactionStore.approve(
              s.SuggestTokenMsg.type(),
              t.id,
              e
            ),
            yield this.getTokensOf(t.data.chainId).refreshTokens());
        }
        *rejectSuggestedToken() {
          const e = this.waitingSuggestedToken;
          e &&
            (yield this.interactionStore.reject(
              s.SuggestTokenMsg.type(),
              e.id
            ));
        }
        *rejectAllSuggestedTokens() {
          yield this.interactionStore.rejectAll(s.SuggestTokenMsg.type());
        }
      }
      r([a.flow], l.prototype, "approveSuggestedToken", null),
        r([a.flow], l.prototype, "rejectSuggestedToken", null),
        r([a.flow], l.prototype, "rejectAllSuggestedTokens", null),
        (t.TokensStore = l);
    },
    1764: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1765), t),
        i(n(1766), t);
    },
    1765: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__awaiter) ||
          function (e, t, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function s(e) {
                try {
                  d(r.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  d(r.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, a);
              }
              d((r = r.apply(e, t || [])).next());
            });
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.IBCChannelStore = t.IBCChannelStoreInner = void 0);
      const o = n(29),
        s = n(7),
        a = n(252),
        d = n(199),
        c = n(8);
      class u {
        constructor(e, t) {
          (this.kvStore = e),
            (this.chainId = t),
            (this.channelMap = new Map()),
            (this.getChannelsToPort = a.computedFn((e) => {
              this.channelMap.has(e) ||
                s.runInAction(() => {
                  this.channelMap.set(e, s.observable.map({}, { deep: !1 }));
                });
              const t = this.channelMap.get(e),
                n = [];
              for (const e of t.values()) n.push(e);
              return n;
            })),
            (this.getChannel = a.computedFn((e, t) => {
              var n;
              return null === (n = this.channelMap.get(e)) || void 0 === n
                ? void 0
                : n.get(t);
            })),
            s.makeObservable(this),
            this.loadChannels();
        }
        getTransferChannels() {
          return this.getChannelsToPort("transfer");
        }
        *addChannel(e) {
          this.channelMap.has(e.portId) ||
            this.channelMap.set(e.portId, s.observable.map({}, { deep: !1 })),
            this.channelMap.get(e.portId).set(e.channelId, e),
            yield this.saveChannels();
        }
        *loadChannels() {
          const e = yield* o.toGenerator(
            this.kvStore.get(
              c.ChainIdHelper.parse(this.chainId).identifier + "-channels"
            )
          );
          if (e)
            for (const t of Object.keys(e)) {
              const n = e[t];
              for (const e of Object.keys(n)) {
                this.channelMap.has(t) ||
                  this.channelMap.set(t, s.observable.map({}, { deep: !1 }));
                this.channelMap.get(t).set(e, n[e]);
              }
            }
        }
        saveChannels() {
          return i(this, void 0, void 0, function* () {
            const e = {};
            this.channelMap.forEach((t, n) => {
              e[n] = (() => {
                const e = {};
                return (
                  t.forEach((t, n) => {
                    e[n] = t;
                  }),
                  e
                );
              })();
            }),
              yield this.kvStore.set(
                c.ChainIdHelper.parse(this.chainId).identifier + "-channels",
                e
              );
          });
        }
      }
      r([s.observable.shallow], u.prototype, "channelMap", void 0),
        r([s.flow], u.prototype, "addChannel", null),
        r([s.flow], u.prototype, "loadChannels", null),
        (t.IBCChannelStoreInner = u);
      class l extends d.HasMapStore {
        constructor(e) {
          super((t) => new u(e, t)), (this.kvStore = e);
        }
        get(e) {
          return super.get(e);
        }
      }
      t.IBCChannelStore = l;
    },
    1766: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.IBCCurrencyRegsitrar = t.IBCCurrencyRegsitrarInner = void 0);
      const i = n(7),
        o = n(29);
      class s {
        constructor(e, t, n, r, o, s, a, d) {
          (this.kvStore = e),
            (this.cacheDuration = t),
            (this.chainInfoInner = n),
            (this.chainStore = r),
            (this.accountStore = o),
            (this.queriesStore = s),
            (this.cosmwasmQueriesStore = a),
            (this.coinDenomGenerator = d),
            (this.isInitialized = !1),
            (this.isInitializing = !1),
            (this.cacheDenomTracePaths = new Map()),
            i.makeObservable(this);
        }
        *restoreCache() {
          this.isInitializing = !0;
          const e =
              "cache-ibc-denom-trace-paths/" + this.chainInfoInner.chainId,
            t = yield* o.toGenerator(this.kvStore.get(e));
          if (t)
            for (const e of Object.keys(t))
              this.cacheDenomTracePaths.set(e, t[e]);
          (this.isInitialized = !0), (this.isInitializing = !1);
        }
        getCacheIBCDenomData(e) {
          const t = this.cacheDenomTracePaths.get(e);
          if (t && t.timestamp + this.cacheDuration > Date.now()) return t;
        }
        *setCacheIBCDenomData(e, t) {
          this.cacheDenomTracePaths.set(
            e,
            Object.assign(Object.assign({}, t), { timestamp: Date.now() })
          );
          const n = {};
          this.cacheDenomTracePaths.forEach((e, t) => {
            n[t] = e;
          });
          const r =
            "cache-ibc-denom-trace-paths/" + this.chainInfoInner.chainId;
          yield this.kvStore.set(r, n);
        }
        registerUnknownCurrencies(e) {
          const t = new o.DenomHelper(e);
          if ("native" !== t.type || !t.denom.startsWith("ibc/")) return;
          if ((this.isInitialized || this.restoreCache(), this.isInitializing))
            return [void 0, !1];
          const n = this.queriesStore.get(this.chainInfoInner.chainId),
            r = t.denom.replace("ibc/", ""),
            i = this.getCacheIBCDenomData(r);
          let s, a, d;
          if (i)
            (d = i.denomTrace),
              i.originChainId &&
                this.chainStore.hasChain(i.originChainId) &&
                (a = this.chainStore.getChain(i.originChainId)),
              i.counterpartyChainId &&
                this.chainStore.hasChain(i.counterpartyChainId) &&
                (s = this.chainStore.getChain(i.counterpartyChainId));
          else {
            const e = n.cosmos.queryIBCDenomTrace.getDenomTrace(r);
            if (((d = e.denomTrace), d)) {
              const e = d.paths;
              let t = this.chainInfoInner.chainId;
              for (const n of e) {
                const e = this.queriesStore
                  .get(t)
                  .cosmos.queryIBCClientState.getClientState(
                    n.portId,
                    n.channelId
                  );
                if (
                  !e.clientChainId ||
                  !this.chainStore.hasChain(e.clientChainId)
                ) {
                  a = void 0;
                  break;
                }
                (t = e.clientChainId),
                  (a = this.chainStore.getChain(e.clientChainId)),
                  s || (s = this.chainStore.getChain(e.clientChainId));
              }
              a &&
                this.setCacheIBCDenomData(r, {
                  counterpartyChainId: null == s ? void 0 : s.chainId,
                  denomTrace: d,
                  originChainId: a.chainId,
                });
            }
          }
          if (a && d) {
            if (4 === d.denom.split(/^(cw20):(\w+)$/).length) {
              let e = a.currencies.find(
                (e) => d && e.coinMinimalDenom.startsWith(d.denom)
              );
              if (!e && this.cosmwasmQueriesStore) {
                const t = this.cosmwasmQueriesStore.get(a.chainId),
                  n = d.denom.replace("cw20:", ""),
                  r = t.cosmwasm.querycw20ContractInfo.getQueryContract(n);
                r.response &&
                  ((e = {
                    type: "cw20",
                    contractAddress: n,
                    coinDecimals: r.response.data.decimals,
                    coinDenom: r.response.data.symbol,
                    coinMinimalDenom: `cw20:${n}:${r.response.data.name}`,
                  }),
                  a.addCurrencies(e));
              }
              if (e)
                return [
                  {
                    coinDecimals: e.coinDecimals,
                    coinGeckoId: e.coinGeckoId,
                    coinImageUrl: e.coinImageUrl,
                    coinMinimalDenom: t.denom,
                    coinDenom: this.coinDenomGenerator(d, a, s, e),
                    paths: d.paths,
                    originChainId: a.chainId,
                    originCurrency: e,
                  },
                  !0,
                ];
            } else {
              const e = a.findCurrency(d.denom);
              if (e && !("paths" in e))
                return [
                  {
                    coinDecimals: e.coinDecimals,
                    coinGeckoId: e.coinGeckoId,
                    coinImageUrl: e.coinImageUrl,
                    coinMinimalDenom: t.denom,
                    coinDenom: this.coinDenomGenerator(d, a, s, e),
                    paths: d.paths,
                    originChainId: a.chainId,
                    originCurrency: e,
                  },
                  !0,
                ];
            }
            return [
              {
                coinDecimals: 0,
                coinMinimalDenom: t.denom,
                coinDenom: this.coinDenomGenerator(d, a, s, void 0),
                paths: d.paths,
                originChainId: void 0,
                originCurrency: void 0,
              },
              !1,
            ];
          }
          return [void 0, !1];
        }
      }
      r([i.observable], s.prototype, "isInitialized", void 0),
        r([i.observable], s.prototype, "isInitializing", void 0),
        r([i.observable.shallow], s.prototype, "cacheDenomTracePaths", void 0),
        r([i.flow], s.prototype, "restoreCache", null),
        r([i.flow], s.prototype, "setCacheIBCDenomData", null),
        (t.IBCCurrencyRegsitrarInner = s);
      class a {
        constructor(e, t = 864e5, n, r, i, o, s = a.defaultCoinDenomGenerator) {
          (this.kvStore = e),
            (this.cacheDuration = t),
            (this.chainStore = n),
            (this.accountStore = r),
            (this.queriesStore = i),
            (this.cosmwasmQueriesStore = o),
            (this.coinDenomGenerator = s),
            (this.map = new Map()),
            this.chainStore.addSetChainInfoHandler((e) =>
              this.setChainInfoHandler(e)
            );
        }
        static defaultCoinDenomGenerator(e, t, n, r) {
          return r
            ? `${r.coinDenom} (${n ? n.chainName : "Unknown"}/${
                e.paths[0].channelId
              })`
            : `${e.denom} (${n ? n.chainName : "Unknown"}/${
                e.paths[0].channelId
              })`;
        }
        setChainInfoHandler(e) {
          const t = this.get(e);
          e.registerCurrencyRegistrar((e) => t.registerUnknownCurrencies(e));
        }
        get(e) {
          return (
            this.map.has(e.chainId) ||
              i.runInAction(() => {
                this.map.set(
                  e.chainId,
                  new s(
                    this.kvStore,
                    this.cacheDuration,
                    e,
                    this.chainStore,
                    this.accountStore,
                    this.queriesStore,
                    this.cosmwasmQueriesStore,
                    this.coinDenomGenerator
                  )
                );
              }),
            this.map.get(e.chainId)
          );
        }
      }
      r([i.observable.shallow], a.prototype, "map", void 0),
        (t.IBCCurrencyRegsitrar = a);
    },
    179: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.DecUtils = void 0);
      const r = n(156),
        i = n(155);
      class o {
        static trim(e) {
          let t = "string" == typeof e ? e : e.toString();
          if (t.indexOf(".") < 0) return t;
          for (let e = t.length - 1; e >= 0 && "0" === t[e]; e--)
            t = t.slice(0, e);
          return (
            t.length > 0 &&
              "." === t[t.length - 1] &&
              (t = t.slice(0, t.length - 1)),
            t
          );
        }
        static getTenExponentN(e) {
          if (e < -r.Dec.precision) throw new Error("Too little precision");
          if (o.tenExponentNs[e.toString()])
            return o.tenExponentNs[e.toString()];
          const t = new r.Dec(10).pow(new i.Int(e));
          return (o.tenExponentNs[e.toString()] = t), t;
        }
        static getTenExponentNInPrecisionRange(e) {
          if (e > r.Dec.precision) throw new Error("Too much precision");
          return o.getTenExponentN(e);
        }
        static getPrecisionDec(e) {
          return o.getTenExponentNInPrecisionRange(e);
        }
      }
      (t.DecUtils = o), (o.tenExponentNs = {});
    },
    1836: function (e, t) {},
    1839: function (e, t) {},
    1841: function (e, t) {},
    1846: function (e, t) {},
    1869: function (e, t) {},
    1871: function (e, t) {},
    192: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.enableScroll =
          t.disableScroll =
          t.fitPopupWindow =
          t.closePopupWindow =
          t.openPopupWindow =
          t.PopupSize =
            void 0),
        (t.PopupSize = { width: 360, height: 580 });
      const i = {};
      (t.openPopupWindow = function (e, n = "default", o = {}) {
        var s;
        return r(this, void 0, void 0, function* () {
          const r = Object.assign(
            {
              width: t.PopupSize.width,
              height: t.PopupSize.height,
              url: e,
              type: "popup",
            },
            o
          );
          if (void 0 !== i[n])
            try {
              const t = yield browser.windows.get(i[n], { populate: !0 });
              if (
                !(null === (s = null == t ? void 0 : t.tabs) || void 0 === s
                  ? void 0
                  : s.length)
              )
                throw new Error("Null window or tabs");
              {
                const n = t.tabs[0];
                if (!(null == n ? void 0 : n.id))
                  throw new Error("Null window or tabs");
                yield browser.tabs.update(n.id, { active: !0, url: e });
              }
            } catch (e) {
              i[n] = (yield browser.windows.create(r)).id;
            }
          else i[n] = (yield browser.windows.create(r)).id;
          if (i[n])
            try {
              yield browser.windows.update(i[n], { focused: !0 });
            } catch (e) {
              console.log("Failed to update window focus: " + e.message);
            }
          return i[n];
        });
      }),
        (t.closePopupWindow = function (e) {
          (() => {
            r(this, void 0, void 0, function* () {
              const t = i[e];
              t && (yield browser.windows.remove(t));
            });
          })();
        }),
        (t.fitPopupWindow = function () {
          const e = window.outerWidth - window.innerWidth,
            n = window.outerHeight - window.innerHeight;
          browser.windows
            ? browser.windows.getCurrent().then((r) => {
                null != (null == r ? void 0 : r.id) &&
                  browser.windows.update(r.id, {
                    width: t.PopupSize.width + e,
                    height: t.PopupSize.height + n,
                  });
              })
            : window.resizeTo(t.PopupSize.width + e, t.PopupSize.height + n);
        }),
        (t.disableScroll = function () {
          document.getElementsByTagName("html")[0].style.overflow = "hidden";
        }),
        (t.enableScroll = function () {
          document.getElementsByTagName("html")[0].style.overflow = "";
        });
    },
    1937: function (e, t) {},
    1939: function (e, t) {},
    1969: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.KeplrETCQueriesImpl = t.KeplrETCQueries = void 0);
      const r = n(1496),
        i = n(1497),
        o = n(1498);
      t.KeplrETCQueries = {
        use: (e) => (t, n, r, i) => ({
          keplrETC: new s(t, n, r, i, e.ethereumURL),
        }),
      };
      class s {
        constructor(e, t, n, s, a) {
          (this.queryERC20Metadata = new r.ObservableQueryERC20Metadata(t, a)),
            (this.queryEVMTokenInfo = new i.ObservableQueryEVMTokenInfo(
              t,
              n,
              s
            )),
            (this.queryTerraClassicTaxRate = new o.ObservableQueryTaxRate(
              t,
              n,
              s
            )),
            (this.queryTerraClassicTaxCaps = new o.ObservableQueryTaxCaps(
              t,
              n,
              s
            ));
        }
      }
      t.KeplrETCQueriesImpl = s;
    },
    1970: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryERC20Metadata =
          t.ObservableQueryERC20MetadataInner =
          t.ObservableQueryERC20MetadataDecimals =
          t.ObservableQueryERC20MetadataSymbol =
          t.ObservableQueryERC20MetadataName =
            void 0);
      const o = n(55),
        s = i(n(62)),
        a = n(2108),
        d = n(7),
        c = new a.Interface([
          {
            constant: !0,
            inputs: [],
            name: "name",
            outputs: [{ name: "", type: "string" }],
            payable: !1,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: !0,
            inputs: [],
            name: "symbol",
            outputs: [{ name: "", type: "string" }],
            payable: !1,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: !0,
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint8" }],
            payable: !1,
            stateMutability: "view",
            type: "function",
          },
        ]);
      class u extends o.ObservableJsonRPCQuery {
        constructor(e, t, n) {
          super(
            e,
            s.default.create(Object.assign({ baseURL: t })),
            "",
            "eth_call",
            [{ to: n, data: c.encodeFunctionData("name") }, "latest"]
          ),
            d.makeObservable(this);
        }
        get name() {
          if (this.response)
            try {
              return c.decodeFunctionResult("name", this.response.data)[0];
            } catch (e) {
              console.log(e);
            }
        }
      }
      r([d.computed], u.prototype, "name", null),
        (t.ObservableQueryERC20MetadataName = u);
      class l extends o.ObservableJsonRPCQuery {
        constructor(e, t, n) {
          super(
            e,
            s.default.create(Object.assign({ baseURL: t })),
            "",
            "eth_call",
            [{ to: n, data: c.encodeFunctionData("symbol") }, "latest"]
          ),
            d.makeObservable(this);
        }
        get symbol() {
          if (this.response)
            try {
              return c.decodeFunctionResult("symbol", this.response.data)[0];
            } catch (e) {
              console.log(e);
            }
        }
      }
      r([d.computed], l.prototype, "symbol", null),
        (t.ObservableQueryERC20MetadataSymbol = l);
      class h extends o.ObservableJsonRPCQuery {
        constructor(e, t, n) {
          super(
            e,
            s.default.create(Object.assign({ baseURL: t })),
            "",
            "eth_call",
            [{ to: n, data: c.encodeFunctionData("decimals") }, "latest"]
          ),
            d.makeObservable(this);
        }
        get decimals() {
          if (this.response)
            try {
              return c.decodeFunctionResult("decimals", this.response.data)[0];
            } catch (e) {
              console.log(e);
            }
        }
      }
      r([d.computed], h.prototype, "decimals", null),
        (t.ObservableQueryERC20MetadataDecimals = h);
      class p {
        constructor(e, t, n) {
          (this._queryName = new u(e, t, n)),
            (this._querySymbol = new l(e, t, n)),
            (this._queryDecimals = new h(e, t, n));
        }
        get queryName() {
          return this._queryName;
        }
        get querySymbol() {
          return this._querySymbol;
        }
        get symbol() {
          return this._querySymbol.symbol;
        }
        get name() {
          return this._queryName.name;
        }
        get decimals() {
          return this._queryDecimals.decimals;
        }
      }
      t.ObservableQueryERC20MetadataInner = p;
      class f extends o.HasMapStore {
        constructor(e, t) {
          super((e) => new p(this.kvStore, this.ethereumURL, e)),
            (this.kvStore = e),
            (this.ethereumURL = t);
        }
        get(e) {
          return super.get(e);
        }
      }
      t.ObservableQueryERC20Metadata = f;
    },
    1971: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.AxelarEVMBridgeCurrencyRegistrar =
          t.AxelarEVMBridgeCurrencyRegistrarInner =
            void 0);
      const i = n(7);
      class o {
        constructor(e, t, n, r, i) {
          (this.kvStore = e),
            (this.chainInfoInner = t),
            (this.chainStore = n),
            (this.queriesStore = r),
            (this.mainChain = i);
        }
        registerUnknownCurrencies(e) {
          const t = this.chainStore.getChain(this.chainInfoInner.chainId);
          if (!t.features || !t.features.includes("axelar-evm-bridge")) return;
          const n = this.queriesStore
            .get(this.chainInfoInner.chainId)
            .keplrETC.queryEVMTokenInfo.getAsset(this.mainChain, e);
          return n.symbol && null != n.decimals && n.isConfirmed
            ? [
                {
                  coinMinimalDenom: e,
                  coinDenom: n.symbol,
                  coinDecimals: n.decimals,
                },
                !n.isFetching,
              ]
            : n.isFetching
            ? [void 0, !1]
            : void 0;
        }
      }
      t.AxelarEVMBridgeCurrencyRegistrarInner = o;
      class s {
        constructor(e, t, n, r) {
          (this.kvStore = e),
            (this.chainStore = t),
            (this.queriesStore = n),
            (this.mainChain = r),
            (this.map = new Map()),
            this.chainStore.addSetChainInfoHandler((e) =>
              this.setChainInfoHandler(e)
            );
        }
        setChainInfoHandler(e) {
          const t = this.get(e);
          e.registerCurrencyRegistrar((e) => t.registerUnknownCurrencies(e));
        }
        get(e) {
          return (
            this.map.has(e.chainId) ||
              i.runInAction(() => {
                this.map.set(
                  e.chainId,
                  new o(
                    this.kvStore,
                    e,
                    this.chainStore,
                    this.queriesStore,
                    this.mainChain
                  )
                );
              }),
            this.map.get(e.chainId)
          );
        }
      }
      r([i.observable.shallow], s.prototype, "map", void 0),
        (t.AxelarEVMBridgeCurrencyRegistrar = s);
    },
    1972: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryEVMTokenInfo = t.ObservableQueryEVMTokenInfoInner =
          void 0);
      const r = n(55);
      class i extends r.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, `/axelar/evm/v1beta1/token_info/${r}?asset=${i}`),
            (this._chain = r),
            (this._denom = i);
        }
        get chain() {
          return this._chain;
        }
        get denom() {
          return this._denom;
        }
        get tokenName() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.details.token_name;
        }
        get symbol() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.details.symbol;
        }
        get decimals() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.details.decimals;
        }
        get isConfirmed() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.confirmed;
        }
        get isExternal() {
          var e;
          return null === (e = this.response) || void 0 === e
            ? void 0
            : e.data.is_external;
        }
      }
      t.ObservableQueryEVMTokenInfoInner = i;
      class o extends r.ObservableChainQueryMap {
        constructor(e, t, n) {
          super(e, t, n, (e) => {
            const t = e.indexOf("/"),
              n = e.slice(0, t),
              r = e.slice(t + 1);
            return new i(this.kvStore, this.chainId, this.chainGetter, n, r);
          }),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
        getAsset(e, t) {
          return this.get(`${e}/${t}`);
        }
      }
      t.ObservableQueryEVMTokenInfo = o;
    },
    1973: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryTaxRate = t.ObservableQueryTaxCaps = void 0);
      const i = n(55),
        o = n(7),
        s = n(32),
        a = n(252);
      class d extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/terra/treasury/v1beta1/tax_caps"),
            (this.getTaxCaps = a.computedFn((e) => {
              if (!this.response || !this.response.data.tax_caps) return;
              const t = this.response.data.tax_caps.find((t) => t.denom === e);
              return t ? new s.Int(t.tax_cap) : void 0;
            })),
            o.makeObservable(this);
        }
      }
      t.ObservableQueryTaxCaps = d;
      class c extends i.ObservableChainQuery {
        constructor(e, t, n) {
          super(e, t, n, "/terra/treasury/v1beta1/tax_rate"),
            o.makeObservable(this);
        }
        get taxRate() {
          if (this.response)
            return new s.RatePretty(this.response.data.tax_rate);
        }
      }
      r([o.computed], c.prototype, "taxRate", null),
        (t.ObservableQueryTaxRate = c);
    },
    1974: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(1975), t);
    },
    1975: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.GravityBridgeCurrencyRegsitrar =
          t.GravityBridgeCurrencyRegsitrarInner =
            void 0);
      const i = n(7),
        o = n(29);
      class s {
        constructor(e, t, n, r) {
          (this.kvStore = e),
            (this.chainInfoInner = t),
            (this.chainStore = n),
            (this.queriesStore = r);
        }
        registerUnknownCurrencies(e) {
          const t = new o.DenomHelper(e);
          if ("native" !== t.type || !t.denom.startsWith("gravity0x")) return;
          const n = this.queriesStore.get(this.chainInfoInner.chainId),
            r = t.denom.replace("gravity", ""),
            i = n.keplrETC.queryERC20Metadata.get(r);
          return i.symbol && null != i.decimals
            ? [
                {
                  coinMinimalDenom: t.denom,
                  coinDenom: i.symbol,
                  coinDecimals: i.decimals,
                },
                !0,
              ]
            : [void 0, !1];
        }
      }
      t.GravityBridgeCurrencyRegsitrarInner = s;
      class a {
        constructor(e, t, n) {
          (this.kvStore = e),
            (this.chainStore = t),
            (this.queriesStore = n),
            (this.map = new Map()),
            this.chainStore.addSetChainInfoHandler((e) =>
              this.setChainInfoHandler(e)
            );
        }
        setChainInfoHandler(e) {
          const t = this.get(e);
          e.registerCurrencyRegistrar((e) => t.registerUnknownCurrencies(e));
        }
        get(e) {
          return (
            this.map.has(e.chainId) ||
              i.runInAction(() => {
                this.map.set(
                  e.chainId,
                  new s(this.kvStore, e, this.chainStore, this.queriesStore)
                );
              }),
            this.map.get(e.chainId)
          );
        }
      }
      r([i.observable.shallow], a.prototype, "map", void 0),
        (t.GravityBridgeCurrencyRegsitrar = a);
    },
    199: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1342), t),
        i(n(1422), t),
        i(n(1686), t),
        i(n(1687), t),
        i(n(1688), t);
    },
    207: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.getKeplrExtensionRouterId = void 0),
        (t.getKeplrExtensionRouterId = function () {
          return (
            null == window.keplrExtensionRouterId &&
              (window.keplrExtensionRouterId = Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER
              )),
            window.keplrExtensionRouterId
          );
        });
    },
    2073: function (e, t) {},
    211: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.IntPretty = void 0);
      const r = n(155),
        i = n(156),
        o = n(179),
        s = n(283);
      class a {
        constructor(e) {
          if (
            ((this.floatingDecimalPointRight = 0),
            (this._options = {
              maxDecimals: 0,
              trim: !1,
              shrink: !1,
              ready: !0,
              locale: !0,
              inequalitySymbol: !1,
              inequalitySymbolSeparator: " ",
            }),
            "object" == typeof e && "toDec" in e
              ? (e = e.toDec())
              : e instanceof i.Dec || (e = new i.Dec(e)),
            e.isZero())
          )
            return void (this.dec = e);
          let t = e,
            n = 0;
          for (
            let e = 0;
            e < 18 &&
            (t.truncate().equals(new r.Int(0)) ||
              !t.equals(new i.Dec(t.truncate())));
            e++
          )
            (t = t.mul(new i.Dec(10))), n++;
          (this.dec = e), (this._options.maxDecimals = n);
        }
        get options() {
          return this._options;
        }
        moveDecimalPointLeft(e) {
          const t = this.clone();
          return (t.floatingDecimalPointRight += -e), t;
        }
        moveDecimalPointRight(e) {
          const t = this.clone();
          return (t.floatingDecimalPointRight += e), t;
        }
        increasePrecision(e) {
          return this.moveDecimalPointLeft(e);
        }
        decreasePrecision(e) {
          return this.moveDecimalPointRight(e);
        }
        maxDecimals(e) {
          const t = this.clone();
          return (t._options.maxDecimals = e), t;
        }
        inequalitySymbol(e) {
          const t = this.clone();
          return (t._options.inequalitySymbol = e), t;
        }
        inequalitySymbolSeparator(e) {
          const t = this.clone();
          return (t._options.inequalitySymbolSeparator = e), t;
        }
        trim(e) {
          const t = this.clone();
          return (t._options.trim = e), t;
        }
        shrink(e) {
          const t = this.clone();
          return (t._options.shrink = e), t;
        }
        locale(e) {
          const t = this.clone();
          return (t._options.locale = e), t;
        }
        ready(e) {
          const t = this.clone();
          return (t._options.ready = e), t;
        }
        get isReady() {
          return this._options.ready;
        }
        add(e) {
          e instanceof i.Dec || (e = e.toDec());
          const t = new a(this.toDec().add(e));
          return (t._options = Object.assign({}, this._options)), t;
        }
        sub(e) {
          e instanceof i.Dec || (e = e.toDec());
          const t = new a(this.toDec().sub(e));
          return (t._options = Object.assign({}, this._options)), t;
        }
        mul(e) {
          e instanceof i.Dec || (e = e.toDec());
          const t = new a(this.toDec().mul(e));
          return (t._options = Object.assign({}, this._options)), t;
        }
        quo(e) {
          e instanceof i.Dec || (e = e.toDec());
          const t = new a(this.toDec().quo(e));
          return (t._options = Object.assign({}, this._options)), t;
        }
        toDec() {
          if (0 === this.floatingDecimalPointRight) return this.dec;
          if (this.floatingDecimalPointRight > 0)
            return this.dec.mulTruncate(
              o.DecUtils.getTenExponentN(this.floatingDecimalPointRight)
            );
          {
            let e = -this.floatingDecimalPointRight,
              t = this.dec;
            for (; e > 0; ) {
              if (!(e >= i.Dec.precision)) {
                t = t.mulTruncate(
                  o.DecUtils.getTenExponentN(-e % i.Dec.precision)
                );
                break;
              }
              (t = t.mulTruncate(o.DecUtils.getTenExponentN(-i.Dec.precision))),
                (e -= i.Dec.precision);
            }
            return t;
          }
        }
        toString() {
          return this.toStringWithSymbols("", "");
        }
        toStringWithSymbols(e, t) {
          const n = this.toDec();
          if (
            this._options.inequalitySymbol &&
            !n.isZero() &&
            n.abs().lt(o.DecUtils.getTenExponentN(-this._options.maxDecimals))
          ) {
            const r = n.isNegative();
            return `${r ? ">" : "<"}${this._options.inequalitySymbolSeparator}${
              r ? "-" : ""
            }${e}${o.DecUtils.getTenExponentN(
              -this._options.maxDecimals
            ).toString(this._options.maxDecimals, this._options.locale)}${t}`;
          }
          let r;
          (r = this._options.shrink
            ? s.CoinUtils.shrinkDecimals(
                n,
                0,
                this._options.maxDecimals,
                this._options.locale
              )
            : n.toString(this._options.maxDecimals, this._options.locale)),
            this._options.trim && (r = o.DecUtils.trim(r));
          const i = "-" === r.charAt(0);
          return i && (r = r.slice(1)), `${i ? "-" : ""}${e}${r}${t}`;
        }
        clone() {
          const e = new a(this.dec);
          return (
            (e.dec = this.dec),
            (e.floatingDecimalPointRight = this.floatingDecimalPointRight),
            (e._options = Object.assign({}, this._options)),
            e
          );
        }
      }
      t.IntPretty = a;
    },
    221: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MessageRegistry = void 0);
      t.MessageRegistry = class {
        constructor() {
          this.registeredMsgType = new Map();
        }
        registerMessage(e) {
          if (this.registeredMsgType.has(e.type()))
            throw new Error("Already registered type " + e.type());
          this.registeredMsgType.set(e.type(), e);
        }
        parseMessage(e) {
          if (!e.type) throw new Error("Null type");
          const t = this.registeredMsgType.get(e.type);
          if (!t) throw new Error("Unregistered msg type " + e.type);
          return Object.setPrototypeOf(e.msg, t.prototype);
        }
      };
    },
    222: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.JSONUint8Array = void 0);
      const r = n(396);
      class i {
        static parse(e) {
          return JSON.parse(e, (e, t) => {
            if ("__proto__" === e) throw new Error("__proto__ is disallowed");
            return t && "string" == typeof t && t.startsWith("__uint8array__")
              ? r.fromHex(t.replace("__uint8array__", ""))
              : t;
          });
        }
        static stringify(e) {
          return JSON.stringify(e, (e, t) => {
            if ("__proto__" === e) throw new Error("__proto__ is disallowed");
            if (
              t &&
              (t instanceof Uint8Array ||
                ("object" == typeof t &&
                  "type" in t &&
                  "data" in t &&
                  "Buffer" === t.type &&
                  Array.isArray(t.data)))
            ) {
              const e = t instanceof Uint8Array ? t : new Uint8Array(t.data);
              return "__uint8array__" + r.toHex(e);
            }
            return t;
          });
        }
        static wrap(e) {
          if (void 0 !== e) return JSON.parse(i.stringify(e));
        }
        static unwrap(e) {
          if (void 0 !== e) return i.parse(JSON.stringify(e));
        }
      }
      t.JSONUint8Array = i;
    },
    283: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CoinUtils = void 0);
      const r = n(421),
        i = n(155),
        o = n(156),
        s = n(179);
      class a {
        static createCoinsFromPrimitives(e) {
          return e.map((e) => new r.Coin(e.denom, e.amount));
        }
        static amountOf(e, t) {
          const n = e.find((e) => e.denom === t);
          return n ? n.amount : new i.Int(0);
        }
        static exclude(e, t) {
          return e.filter((e) => 0 === t.indexOf(e.denom));
        }
        static concat(...e) {
          if (0 === e.length) return [];
          return e.slice().reduce((e, t) => {
            const n = e.find((e) => e.denom === t.denom);
            if (n) {
              const i = new r.Coin(n.denom, n.amount.add(t.amount));
              e.push(i);
            } else {
              const n = new r.Coin(t.denom, t.amount);
              e.push(n);
            }
            return e;
          }, []);
        }
        static getCoinFromDecimals(e, t, n) {
          const i = e.find((e) => e.coinDenom === n);
          if (!i) throw new Error("Invalid currency");
          let s = new o.Dec(1);
          for (let e = 0; e < i.coinDecimals; e++) s = s.mul(new o.Dec(10));
          let a = new o.Dec(t);
          if (((a = a.mul(s)), !new o.Dec(a.truncate()).equals(a)))
            throw new Error("Can't divide anymore");
          return new r.Coin(i.coinMinimalDenom, a.truncate());
        }
        static parseDecAndDenomFromCoin(e, t) {
          let n = e.find((e) => e.coinMinimalDenom === t.denom);
          n ||
            (n = {
              coinDecimals: 0,
              coinDenom: t.denom,
              coinMinimalDenom: t.denom,
            });
          let r = new o.Dec(1);
          for (let e = 0; e < n.coinDecimals; e++) r = r.mul(new o.Dec(10));
          return {
            amount: new o.Dec(t.amount).quoTruncate(r).toString(n.coinDecimals),
            denom: n.coinDenom,
          };
        }
        static shrinkDecimals(e, t, n, r = !1) {
          if (e.equals(new o.Dec(0))) return "0";
          const i = e.isNegative(),
            s = e.abs().truncate(),
            d = e.abs().sub(new o.Dec(s)),
            c = Math.max(n - s.toString().length + 1, t),
            u = 0 === c ? "" : d.toString(c).replace("0.", "");
          return (
            (i ? "-" : "") +
            (r ? a.integerStringToUSLocaleString(s.toString()) : s.toString()) +
            (u.length > 0 ? "." : "") +
            u
          );
        }
        static integerStringToUSLocaleString(e) {
          if (e.indexOf(".") >= 0) throw new Error(e + " is not integer");
          if ("undefined" != typeof BigInt)
            return BigInt(e).toLocaleString("en-US");
          const t = e,
            n = [];
          for (let e = t.length; e > 0; e -= 3)
            n.push(t.slice(Math.max(0, e - 3), e));
          return n.reverse().join(",");
        }
        static coinToTrimmedString(e, t, n = " ") {
          const r = new o.Dec(e.amount).quoTruncate(
            s.DecUtils.getPrecisionDec(t.coinDecimals)
          );
          return `${s.DecUtils.trim(r)}${n}${t.coinDenom}`;
        }
      }
      t.CoinUtils = a;
    },
    32: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(211), t),
        i(n(719), t),
        i(n(421), t),
        i(n(155), t),
        i(n(156), t),
        i(n(283), t),
        i(n(179), t),
        i(n(720), t),
        i(n(721), t);
    },
    366: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(633), t),
        i(n(634), t);
    },
    367: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.KeplrEnigmaUtils = void 0);
      t.KeplrEnigmaUtils = class {
        constructor(e, t) {
          (this.chainId = e), (this.keplr = t);
        }
        getPubkey() {
          return r(this, void 0, void 0, function* () {
            return yield this.keplr.getEnigmaPubKey(this.chainId);
          });
        }
        getTxEncryptionKey(e) {
          return r(this, void 0, void 0, function* () {
            return yield this.keplr.getEnigmaTxEncryptionKey(this.chainId, e);
          });
        }
        encrypt(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.keplr.enigmaEncrypt(this.chainId, e, t);
          });
        }
        decrypt(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.keplr.enigmaDecrypt(this.chainId, e, t);
          });
        }
      };
    },
    368: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CosmJSOfflineSigner = t.CosmJSOfflineSignerOnlyAmino = void 0);
      class i {
        constructor(e, t) {
          (this.chainId = e), (this.keplr = t);
        }
        getAccounts() {
          return r(this, void 0, void 0, function* () {
            const e = yield this.keplr.getKey(this.chainId);
            return [
              { address: e.bech32Address, algo: "secp256k1", pubkey: e.pubKey },
            ];
          });
        }
        signAmino(e, t) {
          return r(this, void 0, void 0, function* () {
            if (this.chainId !== t.chain_id)
              throw new Error("Unmatched chain id with the offline signer");
            if ((yield this.keplr.getKey(t.chain_id)).bech32Address !== e)
              throw new Error("Unknown signer address");
            return yield this.keplr.signAmino(this.chainId, e, t);
          });
        }
        sign(e, t) {
          return r(this, void 0, void 0, function* () {
            return yield this.signAmino(e, t);
          });
        }
      }
      t.CosmJSOfflineSignerOnlyAmino = i;
      t.CosmJSOfflineSigner = class extends i {
        constructor(e, t) {
          super(e, t), (this.chainId = e), (this.keplr = t);
        }
        signDirect(e, t) {
          return r(this, void 0, void 0, function* () {
            if (this.chainId !== t.chainId)
              throw new Error("Unmatched chain id with the offline signer");
            if ((yield this.keplr.getKey(t.chainId)).bech32Address !== e)
              throw new Error("Unknown signer address");
            return yield this.keplr.signDirect(this.chainId, e, t);
          });
        }
      };
    },
    371: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1247), t),
        i(n(368), t),
        i(n(367), t),
        i(n(1250), t);
    },
    395: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Router = void 0);
      const i = n(221),
        o = n(222);
      t.Router = class {
        constructor(e) {
          (this.envProducer = e),
            (this.msgRegistry = new i.MessageRegistry()),
            (this.registeredHandler = new Map()),
            (this.guards = []),
            (this.port = "");
        }
        registerMessage(e) {
          this.msgRegistry.registerMessage(e);
        }
        addHandler(e, t) {
          if (this.registeredHandler.has(e))
            throw new Error("Already registered type " + e);
          this.registeredHandler.set(e, t);
        }
        addGuard(e) {
          this.guards.push(e);
        }
        handleMessage(e, t) {
          var n;
          return r(this, void 0, void 0, function* () {
            const r = this.msgRegistry.parseMessage(o.JSONUint8Array.unwrap(e)),
              i = this.envProducer(
                t,
                null !== (n = r.routerMeta) && void 0 !== n ? n : {}
              );
            for (const e of this.guards) yield e(i, r, t);
            r.validateBasic();
            const s = r.route();
            if (!s) throw new Error("Null router");
            const a = this.registeredHandler.get(s);
            if (!a) throw new Error("Can't get handler");
            return o.JSONUint8Array.wrap(yield a(i, r));
          });
        }
      };
    },
    396: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.fromHex = t.toHex = void 0),
        (t.toHex = function (e) {
          let t = "";
          for (const n of e) t += ("0" + n.toString(16)).slice(-2);
          return t;
        }),
        (t.fromHex = function (e) {
          if (e.length % 2 != 0)
            throw new Error("hex string length must be a multiple of 2");
          const t = [];
          for (let n = 0; n < e.length; n += 2) {
            const r = e.substr(n, 2);
            if (!r.match(/[0-9a-f]{2}/i))
              throw new Error("hex string contains invalid characters");
            t.push(parseInt(r, 16));
          }
          return new Uint8Array(t);
        });
    },
    397: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    398: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    399: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    4: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(395), t),
        i(n(397), t),
        i(n(398), t),
        i(n(399), t),
        i(n(400), t),
        i(n(401), t),
        i(n(402), t),
        i(n(221), t),
        i(n(222), t);
    },
    400: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.KeplrError = void 0);
      class r extends Error {
        constructor(e, t, n) {
          super(n),
            (this.module = e),
            (this.code = t),
            Object.setPrototypeOf(this, r.prototype);
        }
      }
      t.KeplrError = r;
    },
    401: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Message = void 0);
      t.Message = class {
        approveExternal(e, t) {
          return !1;
        }
      };
    },
    402: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.WEBPAGE_PORT = t.APP_PORT = t.BACKGROUND_PORT = void 0),
        (t.BACKGROUND_PORT = "background"),
        (t.APP_PORT = "popup"),
        (t.WEBPAGE_PORT = "webpage");
    },
    421: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.Coin = void 0);
      const r = n(155);
      class i {
        constructor(e, t) {
          (this.denom = e),
            (this.amount = t instanceof r.Int ? t : new r.Int(t));
        }
        static parse(e) {
          const t = new RegExp("([0-9]+)[ ]*([a-zA-Z]+)$").exec(e);
          if (!t || 3 !== t.length) throw new Error("Invalid coin str");
          const n = t[2],
            r = t[1];
          return new i(n, r);
        }
        toString() {
          return `${this.amount.toString()}${this.denom}`;
        }
      }
      t.Coin = i;
    },
    422: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.exponentDecStringToDecString =
          t.isExponentDecString =
          t.isValidDecimalString =
          t.isValidIntegerString =
            void 0);
      const r = /^-?\d+$/,
        i = /^-?\d+.?\d*$/,
        o = /^(-?)([\d.]+)e([-+])([\d]+)$/;
      function s(e) {
        let t = "";
        for (let n = 0; n < e; n++) t += "0";
        return t;
      }
      (t.isValidIntegerString = function (e) {
        return r.test(e);
      }),
        (t.isValidDecimalString = function (e) {
          return i.test(e);
        }),
        (t.isExponentDecString = function (e) {
          return o.test(e);
        }),
        (t.exponentDecStringToDecString = function (e) {
          const t = e.split(o);
          if (6 !== t.length) return e;
          const n = "-" === t[1];
          let r = t[2];
          const i = r.indexOf("."),
            a = t[4];
          let d = parseInt(a) * ("-" === t[3] ? -1 : 1);
          if (i >= 0) {
            (d -= r.length - i - 1),
              (r = (function (e) {
                for (; e.length > 0 && "0" === e[0]; ) e = e.slice(1);
                return 0 === e.length || "." === e[0] ? "0" + e : e;
              })(r.replace(".", "")));
          }
          const c = n ? "-" : "";
          if (d < 0) {
            if (r.length > -d) {
              const e = r.length + d;
              return c + (r.slice(0, e) + ".") + r.slice(e);
            }
            return c + "0." + s(-(r.length + d)) + r;
          }
          return c + r + s(d);
        });
    },
    428: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Duration = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28));
      function s(e) {
        return null != e;
      }
      (t.protobufPackage = "google.protobuf"),
        (t.Duration = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.seconds && t.uint32(8).int64(e.seconds),
            0 !== e.nanos && t.uint32(16).int32(e.nanos),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { seconds: "0", nanos: 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.seconds = n.int64().toString();
                  break;
                case 2:
                  i.nanos = n.int32();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            seconds: s(e.seconds) ? String(e.seconds) : "0",
            nanos: s(e.nanos) ? Number(e.nanos) : 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.seconds && (t.seconds = e.seconds),
              void 0 !== e.nanos && (t.nanos = Math.round(e.nanos)),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { seconds: "0", nanos: 0 };
            return (
              (r.seconds = null !== (t = e.seconds) && void 0 !== t ? t : "0"),
              (r.nanos = null !== (n = e.nanos) && void 0 !== n ? n : 0),
              r
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    431: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.CompactBitArray = t.MultiSignature = t.protobufPackage = void 0);
        const i = r(n(25)),
          o = r(n(28));
        function s() {
          return { extraBitsStored: 0, elems: new Uint8Array() };
        }
        (t.protobufPackage = "cosmos.crypto.multisig.v1beta1"),
          (t.MultiSignature = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.signatures) t.uint32(10).bytes(n);
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { signatures: [] };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.signatures.push(n.bytes());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) => c(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                e.signatures
                  ? (t.signatures = e.signatures.map((e) =>
                      l(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (t.signatures = []),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = { signatures: [] };
              return (
                (n.signatures =
                  (null === (t = e.signatures) || void 0 === t
                    ? void 0
                    : t.map((e) => e)) || []),
                n
              );
            },
          }),
          (t.CompactBitArray = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.extraBitsStored && t.uint32(8).uint32(e.extraBitsStored),
              0 !== e.elems.length && t.uint32(18).bytes(e.elems),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = s();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.extraBitsStored = n.uint32();
                    break;
                  case 2:
                    i.elems = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              extraBitsStored: h(e.extraBitsStored)
                ? Number(e.extraBitsStored)
                : 0,
              elems: h(e.elems) ? c(e.elems) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.extraBitsStored &&
                  (t.extraBitsStored = Math.round(e.extraBitsStored)),
                void 0 !== e.elems &&
                  (t.elems = l(
                    void 0 !== e.elems ? e.elems : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = s();
              return (
                (r.extraBitsStored =
                  null !== (t = e.extraBitsStored) && void 0 !== t ? t : 0),
                (r.elems =
                  null !== (n = e.elems) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                r
              );
            },
          });
        var a = (() => {
          if (void 0 !== a) return a;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const d =
          a.atob || ((e) => a.Buffer.from(e, "base64").toString("binary"));
        function c(e) {
          const t = d(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const u =
          a.btoa || ((e) => a.Buffer.from(e, "binary").toString("base64"));
        function l(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return u(t.join(""));
        }
        function h(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    55: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(1675), t),
        i(n(199), t),
        i(n(1690), t),
        i(n(1691), t),
        i(n(1752), t),
        i(n(1753), t),
        i(n(1764), t);
    },
    621: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.StakeAuthorization_Validators =
          t.StakeAuthorization =
          t.authorizationTypeToJSON =
          t.authorizationTypeFromJSON =
          t.AuthorizationType =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93);
      var a;
      function d(e) {
        switch (e) {
          case 0:
          case "AUTHORIZATION_TYPE_UNSPECIFIED":
            return a.AUTHORIZATION_TYPE_UNSPECIFIED;
          case 1:
          case "AUTHORIZATION_TYPE_DELEGATE":
            return a.AUTHORIZATION_TYPE_DELEGATE;
          case 2:
          case "AUTHORIZATION_TYPE_UNDELEGATE":
            return a.AUTHORIZATION_TYPE_UNDELEGATE;
          case 3:
          case "AUTHORIZATION_TYPE_REDELEGATE":
            return a.AUTHORIZATION_TYPE_REDELEGATE;
          case -1:
          case "UNRECOGNIZED":
          default:
            return a.UNRECOGNIZED;
        }
      }
      function c(e) {
        switch (e) {
          case a.AUTHORIZATION_TYPE_UNSPECIFIED:
            return "AUTHORIZATION_TYPE_UNSPECIFIED";
          case a.AUTHORIZATION_TYPE_DELEGATE:
            return "AUTHORIZATION_TYPE_DELEGATE";
          case a.AUTHORIZATION_TYPE_UNDELEGATE:
            return "AUTHORIZATION_TYPE_UNDELEGATE";
          case a.AUTHORIZATION_TYPE_REDELEGATE:
            return "AUTHORIZATION_TYPE_REDELEGATE";
          default:
            return "UNKNOWN";
        }
      }
      function u(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.staking.v1beta1"),
        (function (e) {
          (e[(e.AUTHORIZATION_TYPE_UNSPECIFIED = 0)] =
            "AUTHORIZATION_TYPE_UNSPECIFIED"),
            (e[(e.AUTHORIZATION_TYPE_DELEGATE = 1)] =
              "AUTHORIZATION_TYPE_DELEGATE"),
            (e[(e.AUTHORIZATION_TYPE_UNDELEGATE = 2)] =
              "AUTHORIZATION_TYPE_UNDELEGATE"),
            (e[(e.AUTHORIZATION_TYPE_REDELEGATE = 3)] =
              "AUTHORIZATION_TYPE_REDELEGATE"),
            (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
        })((a = t.AuthorizationType || (t.AuthorizationType = {}))),
        (t.authorizationTypeFromJSON = d),
        (t.authorizationTypeToJSON = c),
        (t.StakeAuthorization = {
          encode: (e, n = o.default.Writer.create()) => (
            void 0 !== e.maxTokens &&
              s.Coin.encode(e.maxTokens, n.uint32(10).fork()).ldelim(),
            void 0 !== e.allowList &&
              t.StakeAuthorization_Validators.encode(
                e.allowList,
                n.uint32(18).fork()
              ).ldelim(),
            void 0 !== e.denyList &&
              t.StakeAuthorization_Validators.encode(
                e.denyList,
                n.uint32(26).fork()
              ).ldelim(),
            0 !== e.authorizationType &&
              n.uint32(32).int32(e.authorizationType),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const a = {
              maxTokens: void 0,
              allowList: void 0,
              denyList: void 0,
              authorizationType: 0,
            };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  a.maxTokens = s.Coin.decode(r, r.uint32());
                  break;
                case 2:
                  a.allowList = t.StakeAuthorization_Validators.decode(
                    r,
                    r.uint32()
                  );
                  break;
                case 3:
                  a.denyList = t.StakeAuthorization_Validators.decode(
                    r,
                    r.uint32()
                  );
                  break;
                case 4:
                  a.authorizationType = r.int32();
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return a;
          },
          fromJSON: (e) => ({
            maxTokens: u(e.maxTokens) ? s.Coin.fromJSON(e.maxTokens) : void 0,
            allowList: u(e.allowList)
              ? t.StakeAuthorization_Validators.fromJSON(e.allowList)
              : void 0,
            denyList: u(e.denyList)
              ? t.StakeAuthorization_Validators.fromJSON(e.denyList)
              : void 0,
            authorizationType: u(e.authorizationType)
              ? d(e.authorizationType)
              : 0,
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.maxTokens &&
                (n.maxTokens = e.maxTokens
                  ? s.Coin.toJSON(e.maxTokens)
                  : void 0),
              void 0 !== e.allowList &&
                (n.allowList = e.allowList
                  ? t.StakeAuthorization_Validators.toJSON(e.allowList)
                  : void 0),
              void 0 !== e.denyList &&
                (n.denyList = e.denyList
                  ? t.StakeAuthorization_Validators.toJSON(e.denyList)
                  : void 0),
              void 0 !== e.authorizationType &&
                (n.authorizationType = c(e.authorizationType)),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = {
              maxTokens: void 0,
              allowList: void 0,
              denyList: void 0,
              authorizationType: 0,
            };
            return (
              (r.maxTokens =
                void 0 !== e.maxTokens && null !== e.maxTokens
                  ? s.Coin.fromPartial(e.maxTokens)
                  : void 0),
              (r.allowList =
                void 0 !== e.allowList && null !== e.allowList
                  ? t.StakeAuthorization_Validators.fromPartial(e.allowList)
                  : void 0),
              (r.denyList =
                void 0 !== e.denyList && null !== e.denyList
                  ? t.StakeAuthorization_Validators.fromPartial(e.denyList)
                  : void 0),
              (r.authorizationType =
                null !== (n = e.authorizationType) && void 0 !== n ? n : 0),
              r
            );
          },
        }),
        (t.StakeAuthorization_Validators = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.address) t.uint32(10).string(n);
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { address: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.address.push(n.string());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            address: Array.isArray(null == e ? void 0 : e.address)
              ? e.address.map((e) => String(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.address
                ? (t.address = e.address.map((e) => e))
                : (t.address = []),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { address: [] };
            return (
              (n.address =
                (null === (t = e.address) || void 0 === t
                  ? void 0
                  : t.map((e) => e)) || []),
              n
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    631: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(632), t);
    },
    632: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ExtensionRouter = void 0);
      const i = n(4),
        o = n(207);
      class s extends i.Router {
        constructor(e) {
          super(e),
            (this.onMessage = (e, t) => {
              var n, r;
              if (
                e.port === this.port &&
                (!(null ===
                  (r =
                    null === (n = e.msg) || void 0 === n
                      ? void 0
                      : n.routerMeta) || void 0 === r
                  ? void 0
                  : r.receiverRouterId) ||
                  e.msg.routerMeta.receiverRouterId ===
                    o.getKeplrExtensionRouterId())
              )
                return this.onMessageHandler(e, t);
            });
        }
        listen(e) {
          if (!e) throw new Error("Empty port");
          (this.port = e),
            browser.runtime.onMessage.addListener(this.onMessage);
        }
        unlisten() {
          (this.port = ""),
            browser.runtime.onMessage.removeListener(this.onMessage);
        }
        onMessageHandler(e, t) {
          return r(this, void 0, void 0, function* () {
            try {
              return { return: yield this.handleMessage(e, t) };
            } catch (t) {
              return (
                console.log(
                  `Failed to process msg ${e.type}: ${
                    (null == t ? void 0 : t.message) ||
                    (null == t ? void 0 : t.toString())
                  }`
                ),
                t instanceof i.KeplrError
                  ? Promise.resolve({
                      error: {
                        code: t.code,
                        module: t.module,
                        message: t.message || t.toString(),
                      },
                    })
                  : t
                  ? Promise.resolve({ error: t.message || t.toString() })
                  : Promise.resolve({
                      error: "Unknown error, and error is null",
                    })
              );
            }
          });
        }
      }
      t.ExtensionRouter = s;
    },
    633: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.InExtensionMessageRequester = void 0);
      const i = n(4),
        o = n(207);
      t.InExtensionMessageRequester = class {
        sendMessage(e, t) {
          return r(this, void 0, void 0, function* () {
            t.validateBasic(),
              (t.origin = window.location.origin),
              (t.routerMeta = Object.assign(Object.assign({}, t.routerMeta), {
                routerId: o.getKeplrExtensionRouterId(),
              }));
            const n = i.JSONUint8Array.unwrap(
              yield browser.runtime.sendMessage({
                port: e,
                type: t.type(),
                msg: i.JSONUint8Array.wrap(t),
              })
            );
            if (!n) throw new Error("Null result");
            if (n.error)
              throw "string" == typeof n.error
                ? new Error(n.error)
                : new i.KeplrError(
                    n.error.module,
                    n.error.code,
                    n.error.message
                  );
            return n.return;
          });
        }
        static sendMessageToTab(e, t, n) {
          return r(this, void 0, void 0, function* () {
            n.validateBasic(),
              (n.origin = window.location.origin),
              (n.routerMeta = Object.assign(Object.assign({}, n.routerMeta), {
                routerId: o.getKeplrExtensionRouterId(),
              }));
            const r = i.JSONUint8Array.unwrap(
              yield browser.tabs.sendMessage(e, {
                port: t,
                type: n.type(),
                msg: i.JSONUint8Array.wrap(n),
              })
            );
            if (!r) throw new Error("Null result");
            if (r.error)
              throw "string" == typeof r.error
                ? new Error(r.error)
                : new i.KeplrError(
                    r.error.module,
                    r.error.code,
                    r.error.message
                  );
            return r.return;
          });
        }
      };
    },
    634: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ContentScriptMessageRequester = void 0);
      const i = n(4),
        o = n(207);
      t.ContentScriptMessageRequester = class {
        sendMessage(e, t) {
          return r(this, void 0, void 0, function* () {
            t.validateBasic(),
              (t.origin = window.location.origin),
              (t.routerMeta = Object.assign(Object.assign({}, t.routerMeta), {
                routerId: o.getKeplrExtensionRouterId(),
              }));
            const n = i.JSONUint8Array.wrap(t),
              r = yield browser.tabs.query({
                discarded: !1,
                status: "complete",
              });
            for (let i = 0; i < r.length; i++) {
              const o = r[i].id;
              if (o)
                try {
                  yield browser.tabs.sendMessage(o, {
                    port: e,
                    type: t.type(),
                    msg: n,
                  });
                } catch (e) {}
            }
          });
        }
      };
    },
    635: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(636), t),
        i(n(637), t);
    },
    636: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ExtensionGuards = void 0);
      class r {}
      (t.ExtensionGuards = r),
        (r.checkOriginIsValid = (e, t, n) => {
          if (!n.url) throw new Error("url is empty");
          if (!t.origin) throw new Error("origin is empty");
          if (new URL(n.url).origin !== t.origin)
            throw new Error("Invalid origin");
          return Promise.resolve();
        }),
        (r.checkMessageIsInternal = (e, t, n) => {
          if (!e.isInternalMsg && !t.approveExternal(e, n))
            throw new Error("Permission rejected");
          return Promise.resolve();
        });
    },
    637: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ContentScriptGuards = void 0);
      class r {}
      (t.ContentScriptGuards = r),
        (r.checkMessageIsInternal = (e, t, n) => {
          if (!e.isInternalMsg || t.approveExternal(e, n))
            throw new Error(
              "Content script can't handle the message that is able to be sent from external"
            );
          return Promise.resolve();
        });
    },
    638: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(639), t),
        i(n(640), t);
    },
    639: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, o) {
            function s(e) {
              try {
                d(r.next(e));
              } catch (e) {
                o(e);
              }
            }
            function a(e) {
              try {
                d(r.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function d(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(s, a);
            }
            d((r = r.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ExtensionEnv = void 0);
      const i = n(4),
        o = n(192),
        s = n(366);
      const a = new (class {
        constructor() {
          (this.workingOnPromise = !1), (this.queue = []);
        }
        enqueue(e) {
          return new Promise((t, n) => {
            this.queue.push({ fn: e, resolve: t, reject: n }), this.dequeue();
          });
        }
        dequeue() {
          if (this.workingOnPromise) return;
          const e = this.queue.shift();
          e &&
            ((this.workingOnPromise = !0),
            e
              .fn()
              .then((t) => {
                e.resolve(t);
              })
              .catch((t) => {
                e.reject(t);
              })
              .finally(() => {
                (this.workingOnPromise = !1), this.dequeue();
              }));
        }
      })();
      class d {}
      (t.ExtensionEnv = d),
        (d.produceEnv = (e, t) => {
          const n = d.checkIsInternalMessage(
              e,
              browser.runtime.id,
              browser.runtime.getURL("/")
            ),
            c = "interaction=true&interactionInternal=" + n,
            u = (e, t, n) =>
              r(void 0, void 0, void 0, function* () {
                e.startsWith("/") && (e = e.slice(1)),
                  (e = browser.runtime.getURL("/popup.html#/" + e)).includes(
                    "?"
                  )
                    ? (e += "&" + c)
                    : (e += "?" + c);
                const d = yield (function (e, t = "default") {
                    return r(this, void 0, void 0, function* () {
                      return yield a.enqueue(() => o.openPopupWindow(e, t));
                    });
                  })(e, null == n ? void 0 : n.channel),
                  u = (yield browser.windows.get(d, { populate: !0 })).tabs[0]
                    .id;
                return (
                  yield r(void 0, void 0, void 0, function* () {
                    if ("complete" !== (yield browser.tabs.get(u)).status)
                      return new Promise((e) => {
                        browser.tabs.onUpdated.addListener((t, n) => {
                          u === t && "complete" === n.status && e();
                        });
                      });
                  }),
                  yield s.InExtensionMessageRequester.sendMessageToTab(
                    u,
                    i.APP_PORT,
                    t
                  )
                );
              });
          if (n) {
            return {
              isInternalMsg: n,
              requestInteraction: (n, o, a) =>
                r(void 0, void 0, void 0, function* () {
                  var r;
                  if (null == a ? void 0 : a.forceOpenWindow)
                    return yield u(n, o, a);
                  n.startsWith("/") && (n = n.slice(1)),
                    (n = browser.runtime.getURL("/popup.html#/" + n)).includes(
                      "?"
                    )
                      ? (n += "&" + c)
                      : (n += "?" + c);
                  const d = yield browser.runtime.getBackgroundPage(),
                    l = browser.extension
                      .getViews({
                        tabId:
                          null === (r = e.tab) || void 0 === r ? void 0 : r.id,
                      })
                      .filter(
                        (e) =>
                          e.location.href !== d.location.href &&
                          (null == t.routerId ||
                            t.routerId === e.keplrExtensionRouterId)
                      );
                  if (l.length > 0) for (const e of l) e.location.href = n;
                  return (
                    (o.routerMeta = Object.assign(
                      Object.assign({}, o.routerMeta),
                      { receiverRouterId: t.routerId }
                    )),
                    yield new s.InExtensionMessageRequester().sendMessage(
                      i.APP_PORT,
                      o
                    )
                  );
                }),
            };
          }
          return { isInternalMsg: n, requestInteraction: u };
        }),
        (d.checkIsInternalMessage = (e, t, n) => {
          if (!e.url) throw new Error("Empty sender url");
          const r = new URL(e.url);
          if (!r.origin || "null" === r.origin)
            throw new Error("Invalid sender url");
          const i = new URL(n);
          if (!i.origin || "null" === i.origin)
            throw new Error("Invalid browser url");
          return r.origin === i.origin && e.id === t;
        });
    },
    640: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ContentScriptEnv = void 0);
      class r {}
      (t.ContentScriptEnv = r),
        (r.produceEnv = (e) => ({
          isInternalMsg: e.id === browser.runtime.id,
          requestInteraction: () => {
            throw new Error(
              "ContentScriptEnv doesn't support `requestInteraction`"
            );
          },
        }));
    },
    643: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Grant = t.GenericAuthorization = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(157),
        a = n(94);
      function d(e) {
        let t = 1e3 * Number(e.seconds);
        return (t += e.nanos / 1e6), new Date(t);
      }
      function c(e) {
        return e instanceof Date
          ? e
          : "string" == typeof e
          ? new Date(e)
          : d(s.Timestamp.fromJSON(e));
      }
      function u(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.authz.v1beta1"),
        (t.GenericAuthorization = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.msg && t.uint32(10).string(e.msg), t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { msg: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.msg = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({ msg: u(e.msg) ? String(e.msg) : "" }),
          toJSON(e) {
            const t = {};
            return void 0 !== e.msg && (t.msg = e.msg), t;
          },
          fromPartial(e) {
            var t;
            const n = { msg: "" };
            return (n.msg = null !== (t = e.msg) && void 0 !== t ? t : ""), n;
          },
        }),
        (t.Grant = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.authorization &&
              a.Any.encode(e.authorization, t.uint32(10).fork()).ldelim(),
            void 0 !== e.expiration &&
              s.Timestamp.encode(
                (function (e) {
                  const t = Math.trunc(e.getTime() / 1e3).toString(),
                    n = (e.getTime() % 1e3) * 1e6;
                  return { seconds: t, nanos: n };
                })(e.expiration),
                t.uint32(18).fork()
              ).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { authorization: void 0, expiration: void 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.authorization = a.Any.decode(n, n.uint32());
                  break;
                case 2:
                  i.expiration = d(s.Timestamp.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            authorization: u(e.authorization)
              ? a.Any.fromJSON(e.authorization)
              : void 0,
            expiration: u(e.expiration) ? c(e.expiration) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.authorization &&
                (t.authorization = e.authorization
                  ? a.Any.toJSON(e.authorization)
                  : void 0),
              void 0 !== e.expiration &&
                (t.expiration = e.expiration.toISOString()),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { authorization: void 0, expiration: void 0 };
            return (
              (n.authorization =
                void 0 !== e.authorization && null !== e.authorization
                  ? a.Any.fromPartial(e.authorization)
                  : void 0),
              (n.expiration =
                null !== (t = e.expiration) && void 0 !== t ? t : void 0),
              n
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    669: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MsgMultiSendResponse =
          t.MsgMultiSend =
          t.MsgSendResponse =
          t.MsgSend =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93),
        a = n(743);
      function d(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.bank.v1beta1"),
        (t.MsgSend = {
          encode(e, t = o.default.Writer.create()) {
            "" !== e.fromAddress && t.uint32(10).string(e.fromAddress),
              "" !== e.toAddress && t.uint32(18).string(e.toAddress);
            for (const n of e.amount)
              s.Coin.encode(n, t.uint32(26).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { fromAddress: "", toAddress: "", amount: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.fromAddress = n.string();
                  break;
                case 2:
                  i.toAddress = n.string();
                  break;
                case 3:
                  i.amount.push(s.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            fromAddress: d(e.fromAddress) ? String(e.fromAddress) : "",
            toAddress: d(e.toAddress) ? String(e.toAddress) : "",
            amount: Array.isArray(null == e ? void 0 : e.amount)
              ? e.amount.map((e) => s.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.fromAddress && (t.fromAddress = e.fromAddress),
              void 0 !== e.toAddress && (t.toAddress = e.toAddress),
              e.amount
                ? (t.amount = e.amount.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.amount = []),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { fromAddress: "", toAddress: "", amount: [] };
            return (
              (i.fromAddress =
                null !== (t = e.fromAddress) && void 0 !== t ? t : ""),
              (i.toAddress =
                null !== (n = e.toAddress) && void 0 !== n ? n : ""),
              (i.amount =
                (null === (r = e.amount) || void 0 === r
                  ? void 0
                  : r.map((e) => s.Coin.fromPartial(e))) || []),
              i
            );
          },
        }),
        (t.MsgSendResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgMultiSend = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.inputs)
              a.Input.encode(n, t.uint32(10).fork()).ldelim();
            for (const n of e.outputs)
              a.Output.encode(n, t.uint32(18).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { inputs: [], outputs: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.inputs.push(a.Input.decode(n, n.uint32()));
                  break;
                case 2:
                  i.outputs.push(a.Output.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            inputs: Array.isArray(null == e ? void 0 : e.inputs)
              ? e.inputs.map((e) => a.Input.fromJSON(e))
              : [],
            outputs: Array.isArray(null == e ? void 0 : e.outputs)
              ? e.outputs.map((e) => a.Output.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.inputs
                ? (t.inputs = e.inputs.map((e) =>
                    e ? a.Input.toJSON(e) : void 0
                  ))
                : (t.inputs = []),
              e.outputs
                ? (t.outputs = e.outputs.map((e) =>
                    e ? a.Output.toJSON(e) : void 0
                  ))
                : (t.outputs = []),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { inputs: [], outputs: [] };
            return (
              (r.inputs =
                (null === (t = e.inputs) || void 0 === t
                  ? void 0
                  : t.map((e) => a.Input.fromPartial(e))) || []),
              (r.outputs =
                (null === (n = e.outputs) || void 0 === n
                  ? void 0
                  : n.map((e) => a.Output.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.MsgMultiSendResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    670: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MsgUndelegateResponse =
          t.MsgUndelegate =
          t.MsgBeginRedelegateResponse =
          t.MsgBeginRedelegate =
          t.MsgDelegateResponse =
          t.MsgDelegate =
          t.MsgEditValidatorResponse =
          t.MsgEditValidator =
          t.MsgCreateValidatorResponse =
          t.MsgCreateValidator =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(157),
        a = n(744),
        d = n(94),
        c = n(93);
      function u(e) {
        return {
          seconds: Math.trunc(e.getTime() / 1e3).toString(),
          nanos: (e.getTime() % 1e3) * 1e6,
        };
      }
      function l(e) {
        let t = 1e3 * Number(e.seconds);
        return (t += e.nanos / 1e6), new Date(t);
      }
      function h(e) {
        return e instanceof Date
          ? e
          : "string" == typeof e
          ? new Date(e)
          : l(s.Timestamp.fromJSON(e));
      }
      function p(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.staking.v1beta1"),
        (t.MsgCreateValidator = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.description &&
              a.Description.encode(e.description, t.uint32(10).fork()).ldelim(),
            void 0 !== e.commission &&
              a.CommissionRates.encode(
                e.commission,
                t.uint32(18).fork()
              ).ldelim(),
            "" !== e.minSelfDelegation &&
              t.uint32(26).string(e.minSelfDelegation),
            "" !== e.delegatorAddress &&
              t.uint32(34).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(42).string(e.validatorAddress),
            void 0 !== e.pubkey &&
              d.Any.encode(e.pubkey, t.uint32(50).fork()).ldelim(),
            void 0 !== e.value &&
              c.Coin.encode(e.value, t.uint32(58).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              description: void 0,
              commission: void 0,
              minSelfDelegation: "",
              delegatorAddress: "",
              validatorAddress: "",
              pubkey: void 0,
              value: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.description = a.Description.decode(n, n.uint32());
                  break;
                case 2:
                  i.commission = a.CommissionRates.decode(n, n.uint32());
                  break;
                case 3:
                  i.minSelfDelegation = n.string();
                  break;
                case 4:
                  i.delegatorAddress = n.string();
                  break;
                case 5:
                  i.validatorAddress = n.string();
                  break;
                case 6:
                  i.pubkey = d.Any.decode(n, n.uint32());
                  break;
                case 7:
                  i.value = c.Coin.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            description: p(e.description)
              ? a.Description.fromJSON(e.description)
              : void 0,
            commission: p(e.commission)
              ? a.CommissionRates.fromJSON(e.commission)
              : void 0,
            minSelfDelegation: p(e.minSelfDelegation)
              ? String(e.minSelfDelegation)
              : "",
            delegatorAddress: p(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: p(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            pubkey: p(e.pubkey) ? d.Any.fromJSON(e.pubkey) : void 0,
            value: p(e.value) ? c.Coin.fromJSON(e.value) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.description &&
                (t.description = e.description
                  ? a.Description.toJSON(e.description)
                  : void 0),
              void 0 !== e.commission &&
                (t.commission = e.commission
                  ? a.CommissionRates.toJSON(e.commission)
                  : void 0),
              void 0 !== e.minSelfDelegation &&
                (t.minSelfDelegation = e.minSelfDelegation),
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              void 0 !== e.pubkey &&
                (t.pubkey = e.pubkey ? d.Any.toJSON(e.pubkey) : void 0),
              void 0 !== e.value &&
                (t.value = e.value ? c.Coin.toJSON(e.value) : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = {
              description: void 0,
              commission: void 0,
              minSelfDelegation: "",
              delegatorAddress: "",
              validatorAddress: "",
              pubkey: void 0,
              value: void 0,
            };
            return (
              (i.description =
                void 0 !== e.description && null !== e.description
                  ? a.Description.fromPartial(e.description)
                  : void 0),
              (i.commission =
                void 0 !== e.commission && null !== e.commission
                  ? a.CommissionRates.fromPartial(e.commission)
                  : void 0),
              (i.minSelfDelegation =
                null !== (t = e.minSelfDelegation) && void 0 !== t ? t : ""),
              (i.delegatorAddress =
                null !== (n = e.delegatorAddress) && void 0 !== n ? n : ""),
              (i.validatorAddress =
                null !== (r = e.validatorAddress) && void 0 !== r ? r : ""),
              (i.pubkey =
                void 0 !== e.pubkey && null !== e.pubkey
                  ? d.Any.fromPartial(e.pubkey)
                  : void 0),
              (i.value =
                void 0 !== e.value && null !== e.value
                  ? c.Coin.fromPartial(e.value)
                  : void 0),
              i
            );
          },
        }),
        (t.MsgCreateValidatorResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgEditValidator = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.description &&
              a.Description.encode(e.description, t.uint32(10).fork()).ldelim(),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            "" !== e.commissionRate && t.uint32(26).string(e.commissionRate),
            "" !== e.minSelfDelegation &&
              t.uint32(34).string(e.minSelfDelegation),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              description: void 0,
              validatorAddress: "",
              commissionRate: "",
              minSelfDelegation: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.description = a.Description.decode(n, n.uint32());
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                case 3:
                  i.commissionRate = n.string();
                  break;
                case 4:
                  i.minSelfDelegation = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            description: p(e.description)
              ? a.Description.fromJSON(e.description)
              : void 0,
            validatorAddress: p(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            commissionRate: p(e.commissionRate) ? String(e.commissionRate) : "",
            minSelfDelegation: p(e.minSelfDelegation)
              ? String(e.minSelfDelegation)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.description &&
                (t.description = e.description
                  ? a.Description.toJSON(e.description)
                  : void 0),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              void 0 !== e.commissionRate &&
                (t.commissionRate = e.commissionRate),
              void 0 !== e.minSelfDelegation &&
                (t.minSelfDelegation = e.minSelfDelegation),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = {
              description: void 0,
              validatorAddress: "",
              commissionRate: "",
              minSelfDelegation: "",
            };
            return (
              (i.description =
                void 0 !== e.description && null !== e.description
                  ? a.Description.fromPartial(e.description)
                  : void 0),
              (i.validatorAddress =
                null !== (t = e.validatorAddress) && void 0 !== t ? t : ""),
              (i.commissionRate =
                null !== (n = e.commissionRate) && void 0 !== n ? n : ""),
              (i.minSelfDelegation =
                null !== (r = e.minSelfDelegation) && void 0 !== r ? r : ""),
              i
            );
          },
        }),
        (t.MsgEditValidatorResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgDelegate = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            void 0 !== e.amount &&
              c.Coin.encode(e.amount, t.uint32(26).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              delegatorAddress: "",
              validatorAddress: "",
              amount: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                case 3:
                  i.amount = c.Coin.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: p(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: p(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            amount: p(e.amount) ? c.Coin.fromJSON(e.amount) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              void 0 !== e.amount &&
                (t.amount = e.amount ? c.Coin.toJSON(e.amount) : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = {
              delegatorAddress: "",
              validatorAddress: "",
              amount: void 0,
            };
            return (
              (r.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (r.validatorAddress =
                null !== (n = e.validatorAddress) && void 0 !== n ? n : ""),
              (r.amount =
                void 0 !== e.amount && null !== e.amount
                  ? c.Coin.fromPartial(e.amount)
                  : void 0),
              r
            );
          },
        }),
        (t.MsgDelegateResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgBeginRedelegate = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorSrcAddress &&
              t.uint32(18).string(e.validatorSrcAddress),
            "" !== e.validatorDstAddress &&
              t.uint32(26).string(e.validatorDstAddress),
            void 0 !== e.amount &&
              c.Coin.encode(e.amount, t.uint32(34).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
              amount: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorSrcAddress = n.string();
                  break;
                case 3:
                  i.validatorDstAddress = n.string();
                  break;
                case 4:
                  i.amount = c.Coin.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: p(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorSrcAddress: p(e.validatorSrcAddress)
              ? String(e.validatorSrcAddress)
              : "",
            validatorDstAddress: p(e.validatorDstAddress)
              ? String(e.validatorDstAddress)
              : "",
            amount: p(e.amount) ? c.Coin.fromJSON(e.amount) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorSrcAddress &&
                (t.validatorSrcAddress = e.validatorSrcAddress),
              void 0 !== e.validatorDstAddress &&
                (t.validatorDstAddress = e.validatorDstAddress),
              void 0 !== e.amount &&
                (t.amount = e.amount ? c.Coin.toJSON(e.amount) : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
              amount: void 0,
            };
            return (
              (i.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (i.validatorSrcAddress =
                null !== (n = e.validatorSrcAddress) && void 0 !== n ? n : ""),
              (i.validatorDstAddress =
                null !== (r = e.validatorDstAddress) && void 0 !== r ? r : ""),
              (i.amount =
                void 0 !== e.amount && null !== e.amount
                  ? c.Coin.fromPartial(e.amount)
                  : void 0),
              i
            );
          },
        }),
        (t.MsgBeginRedelegateResponse = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.completionTime &&
              s.Timestamp.encode(
                u(e.completionTime),
                t.uint32(10).fork()
              ).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { completionTime: void 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.completionTime = l(s.Timestamp.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            completionTime: p(e.completionTime) ? h(e.completionTime) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.completionTime &&
                (t.completionTime = e.completionTime.toISOString()),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { completionTime: void 0 };
            return (
              (n.completionTime =
                null !== (t = e.completionTime) && void 0 !== t ? t : void 0),
              n
            );
          },
        }),
        (t.MsgUndelegate = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            void 0 !== e.amount &&
              c.Coin.encode(e.amount, t.uint32(26).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              delegatorAddress: "",
              validatorAddress: "",
              amount: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                case 3:
                  i.amount = c.Coin.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: p(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: p(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            amount: p(e.amount) ? c.Coin.fromJSON(e.amount) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              void 0 !== e.amount &&
                (t.amount = e.amount ? c.Coin.toJSON(e.amount) : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = {
              delegatorAddress: "",
              validatorAddress: "",
              amount: void 0,
            };
            return (
              (r.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (r.validatorAddress =
                null !== (n = e.validatorAddress) && void 0 !== n ? n : ""),
              (r.amount =
                void 0 !== e.amount && null !== e.amount
                  ? c.Coin.fromPartial(e.amount)
                  : void 0),
              r
            );
          },
        }),
        (t.MsgUndelegateResponse = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.completionTime &&
              s.Timestamp.encode(
                u(e.completionTime),
                t.uint32(10).fork()
              ).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { completionTime: void 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.completionTime = l(s.Timestamp.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            completionTime: p(e.completionTime) ? h(e.completionTime) : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.completionTime &&
                (t.completionTime = e.completionTime.toISOString()),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { completionTime: void 0 };
            return (
              (n.completionTime =
                null !== (t = e.completionTime) && void 0 !== t ? t : void 0),
              n
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    671: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MsgDepositResponse =
          t.MsgDeposit =
          t.MsgVoteWeightedResponse =
          t.MsgVoteWeighted =
          t.MsgVoteResponse =
          t.MsgVote =
          t.MsgSubmitProposalResponse =
          t.MsgSubmitProposal =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(672),
        a = n(94),
        d = n(93);
      function c(e) {
        return e.toString();
      }
      function u(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.gov.v1beta1"),
        (t.MsgSubmitProposal = {
          encode(e, t = o.default.Writer.create()) {
            void 0 !== e.content &&
              a.Any.encode(e.content, t.uint32(10).fork()).ldelim();
            for (const n of e.initialDeposit)
              d.Coin.encode(n, t.uint32(18).fork()).ldelim();
            return "" !== e.proposer && t.uint32(26).string(e.proposer), t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { content: void 0, initialDeposit: [], proposer: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.content = a.Any.decode(n, n.uint32());
                  break;
                case 2:
                  i.initialDeposit.push(d.Coin.decode(n, n.uint32()));
                  break;
                case 3:
                  i.proposer = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            content: u(e.content) ? a.Any.fromJSON(e.content) : void 0,
            initialDeposit: Array.isArray(null == e ? void 0 : e.initialDeposit)
              ? e.initialDeposit.map((e) => d.Coin.fromJSON(e))
              : [],
            proposer: u(e.proposer) ? String(e.proposer) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.content &&
                (t.content = e.content ? a.Any.toJSON(e.content) : void 0),
              e.initialDeposit
                ? (t.initialDeposit = e.initialDeposit.map((e) =>
                    e ? d.Coin.toJSON(e) : void 0
                  ))
                : (t.initialDeposit = []),
              void 0 !== e.proposer && (t.proposer = e.proposer),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { content: void 0, initialDeposit: [], proposer: "" };
            return (
              (r.content =
                void 0 !== e.content && null !== e.content
                  ? a.Any.fromPartial(e.content)
                  : void 0),
              (r.initialDeposit =
                (null === (t = e.initialDeposit) || void 0 === t
                  ? void 0
                  : t.map((e) => d.Coin.fromPartial(e))) || []),
              (r.proposer = null !== (n = e.proposer) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.MsgSubmitProposalResponse = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.proposalId && t.uint32(8).uint64(e.proposalId), t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { proposalId: "0" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.proposalId = c(n.uint64());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            proposalId: u(e.proposalId) ? String(e.proposalId) : "0",
          }),
          toJSON(e) {
            const t = {};
            return void 0 !== e.proposalId && (t.proposalId = e.proposalId), t;
          },
          fromPartial(e) {
            var t;
            const n = { proposalId: "0" };
            return (
              (n.proposalId =
                null !== (t = e.proposalId) && void 0 !== t ? t : "0"),
              n
            );
          },
        }),
        (t.MsgVote = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.proposalId && t.uint32(8).uint64(e.proposalId),
            "" !== e.voter && t.uint32(18).string(e.voter),
            0 !== e.option && t.uint32(24).int32(e.option),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { proposalId: "0", voter: "", option: 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.proposalId = c(n.uint64());
                  break;
                case 2:
                  i.voter = n.string();
                  break;
                case 3:
                  i.option = n.int32();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            proposalId: u(e.proposalId) ? String(e.proposalId) : "0",
            voter: u(e.voter) ? String(e.voter) : "",
            option: u(e.option) ? s.voteOptionFromJSON(e.option) : 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.proposalId && (t.proposalId = e.proposalId),
              void 0 !== e.voter && (t.voter = e.voter),
              void 0 !== e.option && (t.option = s.voteOptionToJSON(e.option)),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { proposalId: "0", voter: "", option: 0 };
            return (
              (i.proposalId =
                null !== (t = e.proposalId) && void 0 !== t ? t : "0"),
              (i.voter = null !== (n = e.voter) && void 0 !== n ? n : ""),
              (i.option = null !== (r = e.option) && void 0 !== r ? r : 0),
              i
            );
          },
        }),
        (t.MsgVoteResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgVoteWeighted = {
          encode(e, t = o.default.Writer.create()) {
            "0" !== e.proposalId && t.uint32(8).uint64(e.proposalId),
              "" !== e.voter && t.uint32(18).string(e.voter);
            for (const n of e.options)
              s.WeightedVoteOption.encode(n, t.uint32(26).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { proposalId: "0", voter: "", options: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.proposalId = c(n.uint64());
                  break;
                case 2:
                  i.voter = n.string();
                  break;
                case 3:
                  i.options.push(s.WeightedVoteOption.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            proposalId: u(e.proposalId) ? String(e.proposalId) : "0",
            voter: u(e.voter) ? String(e.voter) : "",
            options: Array.isArray(null == e ? void 0 : e.options)
              ? e.options.map((e) => s.WeightedVoteOption.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.proposalId && (t.proposalId = e.proposalId),
              void 0 !== e.voter && (t.voter = e.voter),
              e.options
                ? (t.options = e.options.map((e) =>
                    e ? s.WeightedVoteOption.toJSON(e) : void 0
                  ))
                : (t.options = []),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { proposalId: "0", voter: "", options: [] };
            return (
              (i.proposalId =
                null !== (t = e.proposalId) && void 0 !== t ? t : "0"),
              (i.voter = null !== (n = e.voter) && void 0 !== n ? n : ""),
              (i.options =
                (null === (r = e.options) || void 0 === r
                  ? void 0
                  : r.map((e) => s.WeightedVoteOption.fromPartial(e))) || []),
              i
            );
          },
        }),
        (t.MsgVoteWeightedResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgDeposit = {
          encode(e, t = o.default.Writer.create()) {
            "0" !== e.proposalId && t.uint32(8).uint64(e.proposalId),
              "" !== e.depositor && t.uint32(18).string(e.depositor);
            for (const n of e.amount)
              d.Coin.encode(n, t.uint32(26).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { proposalId: "0", depositor: "", amount: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.proposalId = c(n.uint64());
                  break;
                case 2:
                  i.depositor = n.string();
                  break;
                case 3:
                  i.amount.push(d.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            proposalId: u(e.proposalId) ? String(e.proposalId) : "0",
            depositor: u(e.depositor) ? String(e.depositor) : "",
            amount: Array.isArray(null == e ? void 0 : e.amount)
              ? e.amount.map((e) => d.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.proposalId && (t.proposalId = e.proposalId),
              void 0 !== e.depositor && (t.depositor = e.depositor),
              e.amount
                ? (t.amount = e.amount.map((e) =>
                    e ? d.Coin.toJSON(e) : void 0
                  ))
                : (t.amount = []),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { proposalId: "0", depositor: "", amount: [] };
            return (
              (i.proposalId =
                null !== (t = e.proposalId) && void 0 !== t ? t : "0"),
              (i.depositor =
                null !== (n = e.depositor) && void 0 !== n ? n : ""),
              (i.amount =
                (null === (r = e.amount) || void 0 === r
                  ? void 0
                  : r.map((e) => d.Coin.fromPartial(e))) || []),
              i
            );
          },
        }),
        (t.MsgDepositResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    672: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.TallyParams =
            t.VotingParams =
            t.DepositParams =
            t.Vote =
            t.TallyResult =
            t.Proposal =
            t.Deposit =
            t.TextProposal =
            t.WeightedVoteOption =
            t.proposalStatusToJSON =
            t.proposalStatusFromJSON =
            t.ProposalStatus =
            t.voteOptionToJSON =
            t.voteOptionFromJSON =
            t.VoteOption =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(157),
          a = n(93),
          d = n(94),
          c = n(428);
        var u, l;
        function h(e) {
          switch (e) {
            case 0:
            case "VOTE_OPTION_UNSPECIFIED":
              return u.VOTE_OPTION_UNSPECIFIED;
            case 1:
            case "VOTE_OPTION_YES":
              return u.VOTE_OPTION_YES;
            case 2:
            case "VOTE_OPTION_ABSTAIN":
              return u.VOTE_OPTION_ABSTAIN;
            case 3:
            case "VOTE_OPTION_NO":
              return u.VOTE_OPTION_NO;
            case 4:
            case "VOTE_OPTION_NO_WITH_VETO":
              return u.VOTE_OPTION_NO_WITH_VETO;
            case -1:
            case "UNRECOGNIZED":
            default:
              return u.UNRECOGNIZED;
          }
        }
        function p(e) {
          switch (e) {
            case u.VOTE_OPTION_UNSPECIFIED:
              return "VOTE_OPTION_UNSPECIFIED";
            case u.VOTE_OPTION_YES:
              return "VOTE_OPTION_YES";
            case u.VOTE_OPTION_ABSTAIN:
              return "VOTE_OPTION_ABSTAIN";
            case u.VOTE_OPTION_NO:
              return "VOTE_OPTION_NO";
            case u.VOTE_OPTION_NO_WITH_VETO:
              return "VOTE_OPTION_NO_WITH_VETO";
            default:
              return "UNKNOWN";
          }
        }
        function f(e) {
          switch (e) {
            case 0:
            case "PROPOSAL_STATUS_UNSPECIFIED":
              return l.PROPOSAL_STATUS_UNSPECIFIED;
            case 1:
            case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
              return l.PROPOSAL_STATUS_DEPOSIT_PERIOD;
            case 2:
            case "PROPOSAL_STATUS_VOTING_PERIOD":
              return l.PROPOSAL_STATUS_VOTING_PERIOD;
            case 3:
            case "PROPOSAL_STATUS_PASSED":
              return l.PROPOSAL_STATUS_PASSED;
            case 4:
            case "PROPOSAL_STATUS_REJECTED":
              return l.PROPOSAL_STATUS_REJECTED;
            case 5:
            case "PROPOSAL_STATUS_FAILED":
              return l.PROPOSAL_STATUS_FAILED;
            case -1:
            case "UNRECOGNIZED":
            default:
              return l.UNRECOGNIZED;
          }
        }
        function g(e) {
          switch (e) {
            case l.PROPOSAL_STATUS_UNSPECIFIED:
              return "PROPOSAL_STATUS_UNSPECIFIED";
            case l.PROPOSAL_STATUS_DEPOSIT_PERIOD:
              return "PROPOSAL_STATUS_DEPOSIT_PERIOD";
            case l.PROPOSAL_STATUS_VOTING_PERIOD:
              return "PROPOSAL_STATUS_VOTING_PERIOD";
            case l.PROPOSAL_STATUS_PASSED:
              return "PROPOSAL_STATUS_PASSED";
            case l.PROPOSAL_STATUS_REJECTED:
              return "PROPOSAL_STATUS_REJECTED";
            case l.PROPOSAL_STATUS_FAILED:
              return "PROPOSAL_STATUS_FAILED";
            default:
              return "UNKNOWN";
          }
        }
        function m() {
          return {
            quorum: new Uint8Array(),
            threshold: new Uint8Array(),
            vetoThreshold: new Uint8Array(),
          };
        }
        (t.protobufPackage = "cosmos.gov.v1beta1"),
          (function (e) {
            (e[(e.VOTE_OPTION_UNSPECIFIED = 0)] = "VOTE_OPTION_UNSPECIFIED"),
              (e[(e.VOTE_OPTION_YES = 1)] = "VOTE_OPTION_YES"),
              (e[(e.VOTE_OPTION_ABSTAIN = 2)] = "VOTE_OPTION_ABSTAIN"),
              (e[(e.VOTE_OPTION_NO = 3)] = "VOTE_OPTION_NO"),
              (e[(e.VOTE_OPTION_NO_WITH_VETO = 4)] =
                "VOTE_OPTION_NO_WITH_VETO"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((u = t.VoteOption || (t.VoteOption = {}))),
          (t.voteOptionFromJSON = h),
          (t.voteOptionToJSON = p),
          (function (e) {
            (e[(e.PROPOSAL_STATUS_UNSPECIFIED = 0)] =
              "PROPOSAL_STATUS_UNSPECIFIED"),
              (e[(e.PROPOSAL_STATUS_DEPOSIT_PERIOD = 1)] =
                "PROPOSAL_STATUS_DEPOSIT_PERIOD"),
              (e[(e.PROPOSAL_STATUS_VOTING_PERIOD = 2)] =
                "PROPOSAL_STATUS_VOTING_PERIOD"),
              (e[(e.PROPOSAL_STATUS_PASSED = 3)] = "PROPOSAL_STATUS_PASSED"),
              (e[(e.PROPOSAL_STATUS_REJECTED = 4)] =
                "PROPOSAL_STATUS_REJECTED"),
              (e[(e.PROPOSAL_STATUS_FAILED = 5)] = "PROPOSAL_STATUS_FAILED"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((l = t.ProposalStatus || (t.ProposalStatus = {}))),
          (t.proposalStatusFromJSON = f),
          (t.proposalStatusToJSON = g),
          (t.WeightedVoteOption = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.option && t.uint32(8).int32(e.option),
              "" !== e.weight && t.uint32(18).string(e.weight),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { option: 0, weight: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.option = n.int32();
                    break;
                  case 2:
                    i.weight = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              option: A(e.option) ? h(e.option) : 0,
              weight: A(e.weight) ? String(e.weight) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.option && (t.option = p(e.option)),
                void 0 !== e.weight && (t.weight = e.weight),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { option: 0, weight: "" };
              return (
                (r.option = null !== (t = e.option) && void 0 !== t ? t : 0),
                (r.weight = null !== (n = e.weight) && void 0 !== n ? n : ""),
                r
              );
            },
          }),
          (t.TextProposal = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.title && t.uint32(10).string(e.title),
              "" !== e.description && t.uint32(18).string(e.description),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { title: "", description: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.title = n.string();
                    break;
                  case 2:
                    i.description = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              title: A(e.title) ? String(e.title) : "",
              description: A(e.description) ? String(e.description) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.title && (t.title = e.title),
                void 0 !== e.description && (t.description = e.description),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { title: "", description: "" };
              return (
                (r.title = null !== (t = e.title) && void 0 !== t ? t : ""),
                (r.description =
                  null !== (n = e.description) && void 0 !== n ? n : ""),
                r
              );
            },
          }),
          (t.Deposit = {
            encode(e, t = o.default.Writer.create()) {
              "0" !== e.proposalId && t.uint32(8).uint64(e.proposalId),
                "" !== e.depositor && t.uint32(18).string(e.depositor);
              for (const n of e.amount)
                a.Coin.encode(n, t.uint32(26).fork()).ldelim();
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { proposalId: "0", depositor: "", amount: [] };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.proposalId = I(n.uint64());
                    break;
                  case 2:
                    i.depositor = n.string();
                    break;
                  case 3:
                    i.amount.push(a.Coin.decode(n, n.uint32()));
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              proposalId: A(e.proposalId) ? String(e.proposalId) : "0",
              depositor: A(e.depositor) ? String(e.depositor) : "",
              amount: Array.isArray(null == e ? void 0 : e.amount)
                ? e.amount.map((e) => a.Coin.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.proposalId && (t.proposalId = e.proposalId),
                void 0 !== e.depositor && (t.depositor = e.depositor),
                e.amount
                  ? (t.amount = e.amount.map((e) =>
                      e ? a.Coin.toJSON(e) : void 0
                    ))
                  : (t.amount = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = { proposalId: "0", depositor: "", amount: [] };
              return (
                (i.proposalId =
                  null !== (t = e.proposalId) && void 0 !== t ? t : "0"),
                (i.depositor =
                  null !== (n = e.depositor) && void 0 !== n ? n : ""),
                (i.amount =
                  (null === (r = e.amount) || void 0 === r
                    ? void 0
                    : r.map((e) => a.Coin.fromPartial(e))) || []),
                i
              );
            },
          }),
          (t.Proposal = {
            encode(e, n = o.default.Writer.create()) {
              "0" !== e.proposalId && n.uint32(8).uint64(e.proposalId),
                void 0 !== e.content &&
                  d.Any.encode(e.content, n.uint32(18).fork()).ldelim(),
                0 !== e.status && n.uint32(24).int32(e.status),
                void 0 !== e.finalTallyResult &&
                  t.TallyResult.encode(
                    e.finalTallyResult,
                    n.uint32(34).fork()
                  ).ldelim(),
                void 0 !== e.submitTime &&
                  s.Timestamp.encode(
                    _(e.submitTime),
                    n.uint32(42).fork()
                  ).ldelim(),
                void 0 !== e.depositEndTime &&
                  s.Timestamp.encode(
                    _(e.depositEndTime),
                    n.uint32(50).fork()
                  ).ldelim();
              for (const t of e.totalDeposit)
                a.Coin.encode(t, n.uint32(58).fork()).ldelim();
              return (
                void 0 !== e.votingStartTime &&
                  s.Timestamp.encode(
                    _(e.votingStartTime),
                    n.uint32(66).fork()
                  ).ldelim(),
                void 0 !== e.votingEndTime &&
                  s.Timestamp.encode(
                    _(e.votingEndTime),
                    n.uint32(74).fork()
                  ).ldelim(),
                n
              );
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const c = {
                proposalId: "0",
                content: void 0,
                status: 0,
                finalTallyResult: void 0,
                submitTime: void 0,
                depositEndTime: void 0,
                totalDeposit: [],
                votingStartTime: void 0,
                votingEndTime: void 0,
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    c.proposalId = I(r.uint64());
                    break;
                  case 2:
                    c.content = d.Any.decode(r, r.uint32());
                    break;
                  case 3:
                    c.status = r.int32();
                    break;
                  case 4:
                    c.finalTallyResult = t.TallyResult.decode(r, r.uint32());
                    break;
                  case 5:
                    c.submitTime = w(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 6:
                    c.depositEndTime = w(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 7:
                    c.totalDeposit.push(a.Coin.decode(r, r.uint32()));
                    break;
                  case 8:
                    c.votingStartTime = w(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 9:
                    c.votingEndTime = w(s.Timestamp.decode(r, r.uint32()));
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return c;
            },
            fromJSON: (e) => ({
              proposalId: A(e.proposalId) ? String(e.proposalId) : "0",
              content: A(e.content) ? d.Any.fromJSON(e.content) : void 0,
              status: A(e.status) ? f(e.status) : 0,
              finalTallyResult: A(e.finalTallyResult)
                ? t.TallyResult.fromJSON(e.finalTallyResult)
                : void 0,
              submitTime: A(e.submitTime) ? P(e.submitTime) : void 0,
              depositEndTime: A(e.depositEndTime)
                ? P(e.depositEndTime)
                : void 0,
              totalDeposit: Array.isArray(null == e ? void 0 : e.totalDeposit)
                ? e.totalDeposit.map((e) => a.Coin.fromJSON(e))
                : [],
              votingStartTime: A(e.votingStartTime)
                ? P(e.votingStartTime)
                : void 0,
              votingEndTime: A(e.votingEndTime) ? P(e.votingEndTime) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.proposalId && (n.proposalId = e.proposalId),
                void 0 !== e.content &&
                  (n.content = e.content ? d.Any.toJSON(e.content) : void 0),
                void 0 !== e.status && (n.status = g(e.status)),
                void 0 !== e.finalTallyResult &&
                  (n.finalTallyResult = e.finalTallyResult
                    ? t.TallyResult.toJSON(e.finalTallyResult)
                    : void 0),
                void 0 !== e.submitTime &&
                  (n.submitTime = e.submitTime.toISOString()),
                void 0 !== e.depositEndTime &&
                  (n.depositEndTime = e.depositEndTime.toISOString()),
                e.totalDeposit
                  ? (n.totalDeposit = e.totalDeposit.map((e) =>
                      e ? a.Coin.toJSON(e) : void 0
                    ))
                  : (n.totalDeposit = []),
                void 0 !== e.votingStartTime &&
                  (n.votingStartTime = e.votingStartTime.toISOString()),
                void 0 !== e.votingEndTime &&
                  (n.votingEndTime = e.votingEndTime.toISOString()),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o, s, c, u;
              const l = {
                proposalId: "0",
                content: void 0,
                status: 0,
                finalTallyResult: void 0,
                submitTime: void 0,
                depositEndTime: void 0,
                totalDeposit: [],
                votingStartTime: void 0,
                votingEndTime: void 0,
              };
              return (
                (l.proposalId =
                  null !== (n = e.proposalId) && void 0 !== n ? n : "0"),
                (l.content =
                  void 0 !== e.content && null !== e.content
                    ? d.Any.fromPartial(e.content)
                    : void 0),
                (l.status = null !== (r = e.status) && void 0 !== r ? r : 0),
                (l.finalTallyResult =
                  void 0 !== e.finalTallyResult && null !== e.finalTallyResult
                    ? t.TallyResult.fromPartial(e.finalTallyResult)
                    : void 0),
                (l.submitTime =
                  null !== (i = e.submitTime) && void 0 !== i ? i : void 0),
                (l.depositEndTime =
                  null !== (o = e.depositEndTime) && void 0 !== o ? o : void 0),
                (l.totalDeposit =
                  (null === (s = e.totalDeposit) || void 0 === s
                    ? void 0
                    : s.map((e) => a.Coin.fromPartial(e))) || []),
                (l.votingStartTime =
                  null !== (c = e.votingStartTime) && void 0 !== c
                    ? c
                    : void 0),
                (l.votingEndTime =
                  null !== (u = e.votingEndTime) && void 0 !== u ? u : void 0),
                l
              );
            },
          }),
          (t.TallyResult = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.yes && t.uint32(10).string(e.yes),
              "" !== e.abstain && t.uint32(18).string(e.abstain),
              "" !== e.no && t.uint32(26).string(e.no),
              "" !== e.noWithVeto && t.uint32(34).string(e.noWithVeto),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { yes: "", abstain: "", no: "", noWithVeto: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.yes = n.string();
                    break;
                  case 2:
                    i.abstain = n.string();
                    break;
                  case 3:
                    i.no = n.string();
                    break;
                  case 4:
                    i.noWithVeto = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              yes: A(e.yes) ? String(e.yes) : "",
              abstain: A(e.abstain) ? String(e.abstain) : "",
              no: A(e.no) ? String(e.no) : "",
              noWithVeto: A(e.noWithVeto) ? String(e.noWithVeto) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.yes && (t.yes = e.yes),
                void 0 !== e.abstain && (t.abstain = e.abstain),
                void 0 !== e.no && (t.no = e.no),
                void 0 !== e.noWithVeto && (t.noWithVeto = e.noWithVeto),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = { yes: "", abstain: "", no: "", noWithVeto: "" };
              return (
                (o.yes = null !== (t = e.yes) && void 0 !== t ? t : ""),
                (o.abstain = null !== (n = e.abstain) && void 0 !== n ? n : ""),
                (o.no = null !== (r = e.no) && void 0 !== r ? r : ""),
                (o.noWithVeto =
                  null !== (i = e.noWithVeto) && void 0 !== i ? i : ""),
                o
              );
            },
          }),
          (t.Vote = {
            encode(e, n = o.default.Writer.create()) {
              "0" !== e.proposalId && n.uint32(8).uint64(e.proposalId),
                "" !== e.voter && n.uint32(18).string(e.voter),
                0 !== e.option && n.uint32(24).int32(e.option);
              for (const r of e.options)
                t.WeightedVoteOption.encode(r, n.uint32(34).fork()).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { proposalId: "0", voter: "", option: 0, options: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.proposalId = I(r.uint64());
                    break;
                  case 2:
                    s.voter = r.string();
                    break;
                  case 3:
                    s.option = r.int32();
                    break;
                  case 4:
                    s.options.push(t.WeightedVoteOption.decode(r, r.uint32()));
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              proposalId: A(e.proposalId) ? String(e.proposalId) : "0",
              voter: A(e.voter) ? String(e.voter) : "",
              option: A(e.option) ? h(e.option) : 0,
              options: Array.isArray(null == e ? void 0 : e.options)
                ? e.options.map((e) => t.WeightedVoteOption.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.proposalId && (n.proposalId = e.proposalId),
                void 0 !== e.voter && (n.voter = e.voter),
                void 0 !== e.option && (n.option = p(e.option)),
                e.options
                  ? (n.options = e.options.map((e) =>
                      e ? t.WeightedVoteOption.toJSON(e) : void 0
                    ))
                  : (n.options = []),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o;
              const s = { proposalId: "0", voter: "", option: 0, options: [] };
              return (
                (s.proposalId =
                  null !== (n = e.proposalId) && void 0 !== n ? n : "0"),
                (s.voter = null !== (r = e.voter) && void 0 !== r ? r : ""),
                (s.option = null !== (i = e.option) && void 0 !== i ? i : 0),
                (s.options =
                  (null === (o = e.options) || void 0 === o
                    ? void 0
                    : o.map((e) => t.WeightedVoteOption.fromPartial(e))) || []),
                s
              );
            },
          }),
          (t.DepositParams = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.minDeposit)
                a.Coin.encode(n, t.uint32(10).fork()).ldelim();
              return (
                void 0 !== e.maxDepositPeriod &&
                  c.Duration.encode(
                    e.maxDepositPeriod,
                    t.uint32(18).fork()
                  ).ldelim(),
                t
              );
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { minDeposit: [], maxDepositPeriod: void 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.minDeposit.push(a.Coin.decode(n, n.uint32()));
                    break;
                  case 2:
                    i.maxDepositPeriod = c.Duration.decode(n, n.uint32());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              minDeposit: Array.isArray(null == e ? void 0 : e.minDeposit)
                ? e.minDeposit.map((e) => a.Coin.fromJSON(e))
                : [],
              maxDepositPeriod: A(e.maxDepositPeriod)
                ? c.Duration.fromJSON(e.maxDepositPeriod)
                : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                e.minDeposit
                  ? (t.minDeposit = e.minDeposit.map((e) =>
                      e ? a.Coin.toJSON(e) : void 0
                    ))
                  : (t.minDeposit = []),
                void 0 !== e.maxDepositPeriod &&
                  (t.maxDepositPeriod = e.maxDepositPeriod
                    ? c.Duration.toJSON(e.maxDepositPeriod)
                    : void 0),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = { minDeposit: [], maxDepositPeriod: void 0 };
              return (
                (n.minDeposit =
                  (null === (t = e.minDeposit) || void 0 === t
                    ? void 0
                    : t.map((e) => a.Coin.fromPartial(e))) || []),
                (n.maxDepositPeriod =
                  void 0 !== e.maxDepositPeriod && null !== e.maxDepositPeriod
                    ? c.Duration.fromPartial(e.maxDepositPeriod)
                    : void 0),
                n
              );
            },
          }),
          (t.VotingParams = {
            encode: (e, t = o.default.Writer.create()) => (
              void 0 !== e.votingPeriod &&
                c.Duration.encode(e.votingPeriod, t.uint32(10).fork()).ldelim(),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { votingPeriod: void 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.votingPeriod = c.Duration.decode(n, n.uint32());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              votingPeriod: A(e.votingPeriod)
                ? c.Duration.fromJSON(e.votingPeriod)
                : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.votingPeriod &&
                  (t.votingPeriod = e.votingPeriod
                    ? c.Duration.toJSON(e.votingPeriod)
                    : void 0),
                t
              );
            },
            fromPartial(e) {
              const t = { votingPeriod: void 0 };
              return (
                (t.votingPeriod =
                  void 0 !== e.votingPeriod && null !== e.votingPeriod
                    ? c.Duration.fromPartial(e.votingPeriod)
                    : void 0),
                t
              );
            },
          }),
          (t.TallyParams = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.quorum.length && t.uint32(10).bytes(e.quorum),
              0 !== e.threshold.length && t.uint32(18).bytes(e.threshold),
              0 !== e.vetoThreshold.length &&
                t.uint32(26).bytes(e.vetoThreshold),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = m();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.quorum = n.bytes();
                    break;
                  case 2:
                    i.threshold = n.bytes();
                    break;
                  case 3:
                    i.vetoThreshold = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              quorum: A(e.quorum) ? b(e.quorum) : new Uint8Array(),
              threshold: A(e.threshold) ? b(e.threshold) : new Uint8Array(),
              vetoThreshold: A(e.vetoThreshold)
                ? b(e.vetoThreshold)
                : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.quorum &&
                  (t.quorum = O(
                    void 0 !== e.quorum ? e.quorum : new Uint8Array()
                  )),
                void 0 !== e.threshold &&
                  (t.threshold = O(
                    void 0 !== e.threshold ? e.threshold : new Uint8Array()
                  )),
                void 0 !== e.vetoThreshold &&
                  (t.vetoThreshold = O(
                    void 0 !== e.vetoThreshold
                      ? e.vetoThreshold
                      : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = m();
              return (
                (i.quorum =
                  null !== (t = e.quorum) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (i.threshold =
                  null !== (n = e.threshold) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (i.vetoThreshold =
                  null !== (r = e.vetoThreshold) && void 0 !== r
                    ? r
                    : new Uint8Array()),
                i
              );
            },
          });
        var v = (() => {
          if (void 0 !== v) return v;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const y =
          v.atob || ((e) => v.Buffer.from(e, "base64").toString("binary"));
        function b(e) {
          const t = y(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const S =
          v.btoa || ((e) => v.Buffer.from(e, "binary").toString("base64"));
        function O(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return S(t.join(""));
        }
        function _(e) {
          return {
            seconds: Math.trunc(e.getTime() / 1e3).toString(),
            nanos: (e.getTime() % 1e3) * 1e6,
          };
        }
        function w(e) {
          let t = 1e3 * Number(e.seconds);
          return (t += e.nanos / 1e6), new Date(t);
        }
        function P(e) {
          return e instanceof Date
            ? e
            : "string" == typeof e
            ? new Date(e)
            : w(s.Timestamp.fromJSON(e));
        }
        function I(e) {
          return e.toString();
        }
        function A(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    673: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MsgFundCommunityPoolResponse =
          t.MsgFundCommunityPool =
          t.MsgWithdrawValidatorCommissionResponse =
          t.MsgWithdrawValidatorCommission =
          t.MsgWithdrawDelegatorRewardResponse =
          t.MsgWithdrawDelegatorReward =
          t.MsgSetWithdrawAddressResponse =
          t.MsgSetWithdrawAddress =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93);
      function a(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.distribution.v1beta1"),
        (t.MsgSetWithdrawAddress = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.withdrawAddress && t.uint32(18).string(e.withdrawAddress),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { delegatorAddress: "", withdrawAddress: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.withdrawAddress = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: a(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            withdrawAddress: a(e.withdrawAddress)
              ? String(e.withdrawAddress)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.withdrawAddress &&
                (t.withdrawAddress = e.withdrawAddress),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { delegatorAddress: "", withdrawAddress: "" };
            return (
              (r.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (r.withdrawAddress =
                null !== (n = e.withdrawAddress) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.MsgSetWithdrawAddressResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgWithdrawDelegatorReward = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { delegatorAddress: "", validatorAddress: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: a(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: a(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { delegatorAddress: "", validatorAddress: "" };
            return (
              (r.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (r.validatorAddress =
                null !== (n = e.validatorAddress) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.MsgWithdrawDelegatorRewardResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgWithdrawValidatorCommission = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.validatorAddress &&
              t.uint32(10).string(e.validatorAddress),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { validatorAddress: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.validatorAddress = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            validatorAddress: a(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { validatorAddress: "" };
            return (
              (n.validatorAddress =
                null !== (t = e.validatorAddress) && void 0 !== t ? t : ""),
              n
            );
          },
        }),
        (t.MsgWithdrawValidatorCommissionResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        (t.MsgFundCommunityPool = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.amount)
              s.Coin.encode(n, t.uint32(10).fork()).ldelim();
            return "" !== e.depositor && t.uint32(18).string(e.depositor), t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { amount: [], depositor: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.amount.push(s.Coin.decode(n, n.uint32()));
                  break;
                case 2:
                  i.depositor = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            amount: Array.isArray(null == e ? void 0 : e.amount)
              ? e.amount.map((e) => s.Coin.fromJSON(e))
              : [],
            depositor: a(e.depositor) ? String(e.depositor) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              e.amount
                ? (t.amount = e.amount.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.amount = []),
              void 0 !== e.depositor && (t.depositor = e.depositor),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { amount: [], depositor: "" };
            return (
              (r.amount =
                (null === (t = e.amount) || void 0 === t
                  ? void 0
                  : t.map((e) => s.Coin.fromPartial(e))) || []),
              (r.depositor =
                null !== (n = e.depositor) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.MsgFundCommunityPoolResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    674: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MsgClearAdminResponse =
            t.MsgClearAdmin =
            t.MsgUpdateAdminResponse =
            t.MsgUpdateAdmin =
            t.MsgMigrateContractResponse =
            t.MsgMigrateContract =
            t.MsgExecuteContractResponse =
            t.MsgExecuteContract =
            t.MsgInstantiateContractResponse =
            t.MsgInstantiateContract =
            t.MsgStoreCodeResponse =
            t.MsgStoreCode =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(751),
          a = n(93);
        function d() {
          return {
            sender: "",
            wasmByteCode: new Uint8Array(),
            instantiatePermission: void 0,
          };
        }
        function c() {
          return {
            sender: "",
            admin: "",
            codeId: "0",
            label: "",
            msg: new Uint8Array(),
            funds: [],
          };
        }
        function u() {
          return { address: "", data: new Uint8Array() };
        }
        function l() {
          return { sender: "", contract: "", msg: new Uint8Array(), funds: [] };
        }
        function h() {
          return { data: new Uint8Array() };
        }
        function p() {
          return {
            sender: "",
            contract: "",
            codeId: "0",
            msg: new Uint8Array(),
          };
        }
        function f() {
          return { data: new Uint8Array() };
        }
        (t.protobufPackage = "cosmwasm.wasm.v1"),
          (t.MsgStoreCode = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.sender && t.uint32(10).string(e.sender),
              0 !== e.wasmByteCode.length && t.uint32(18).bytes(e.wasmByteCode),
              void 0 !== e.instantiatePermission &&
                s.AccessConfig.encode(
                  e.instantiatePermission,
                  t.uint32(42).fork()
                ).ldelim(),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = d();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 2:
                    i.wasmByteCode = n.bytes();
                    break;
                  case 5:
                    i.instantiatePermission = s.AccessConfig.decode(
                      n,
                      n.uint32()
                    );
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              wasmByteCode: O(e.wasmByteCode)
                ? v(e.wasmByteCode)
                : new Uint8Array(),
              instantiatePermission: O(e.instantiatePermission)
                ? s.AccessConfig.fromJSON(e.instantiatePermission)
                : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.wasmByteCode &&
                  (t.wasmByteCode = b(
                    void 0 !== e.wasmByteCode
                      ? e.wasmByteCode
                      : new Uint8Array()
                  )),
                void 0 !== e.instantiatePermission &&
                  (t.instantiatePermission = e.instantiatePermission
                    ? s.AccessConfig.toJSON(e.instantiatePermission)
                    : void 0),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = d();
              return (
                (r.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (r.wasmByteCode =
                  null !== (n = e.wasmByteCode) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (r.instantiatePermission =
                  void 0 !== e.instantiatePermission &&
                  null !== e.instantiatePermission
                    ? s.AccessConfig.fromPartial(e.instantiatePermission)
                    : void 0),
                r
              );
            },
          }),
          (t.MsgStoreCodeResponse = {
            encode: (e, t = o.default.Writer.create()) => (
              "0" !== e.codeId && t.uint32(8).uint64(e.codeId), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { codeId: "0" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.codeId = S(n.uint64());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({ codeId: O(e.codeId) ? String(e.codeId) : "0" }),
            toJSON(e) {
              const t = {};
              return void 0 !== e.codeId && (t.codeId = e.codeId), t;
            },
            fromPartial(e) {
              var t;
              const n = { codeId: "0" };
              return (
                (n.codeId = null !== (t = e.codeId) && void 0 !== t ? t : "0"),
                n
              );
            },
          }),
          (t.MsgInstantiateContract = {
            encode(e, t = o.default.Writer.create()) {
              "" !== e.sender && t.uint32(10).string(e.sender),
                "" !== e.admin && t.uint32(18).string(e.admin),
                "0" !== e.codeId && t.uint32(24).uint64(e.codeId),
                "" !== e.label && t.uint32(34).string(e.label),
                0 !== e.msg.length && t.uint32(42).bytes(e.msg);
              for (const n of e.funds)
                a.Coin.encode(n, t.uint32(50).fork()).ldelim();
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = c();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 2:
                    i.admin = n.string();
                    break;
                  case 3:
                    i.codeId = S(n.uint64());
                    break;
                  case 4:
                    i.label = n.string();
                    break;
                  case 5:
                    i.msg = n.bytes();
                    break;
                  case 6:
                    i.funds.push(a.Coin.decode(n, n.uint32()));
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              admin: O(e.admin) ? String(e.admin) : "",
              codeId: O(e.codeId) ? String(e.codeId) : "0",
              label: O(e.label) ? String(e.label) : "",
              msg: O(e.msg) ? v(e.msg) : new Uint8Array(),
              funds: Array.isArray(null == e ? void 0 : e.funds)
                ? e.funds.map((e) => a.Coin.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.admin && (t.admin = e.admin),
                void 0 !== e.codeId && (t.codeId = e.codeId),
                void 0 !== e.label && (t.label = e.label),
                void 0 !== e.msg &&
                  (t.msg = b(void 0 !== e.msg ? e.msg : new Uint8Array())),
                e.funds
                  ? (t.funds = e.funds.map((e) =>
                      e ? a.Coin.toJSON(e) : void 0
                    ))
                  : (t.funds = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i, o, s;
              const d = c();
              return (
                (d.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (d.admin = null !== (n = e.admin) && void 0 !== n ? n : ""),
                (d.codeId = null !== (r = e.codeId) && void 0 !== r ? r : "0"),
                (d.label = null !== (i = e.label) && void 0 !== i ? i : ""),
                (d.msg =
                  null !== (o = e.msg) && void 0 !== o ? o : new Uint8Array()),
                (d.funds =
                  (null === (s = e.funds) || void 0 === s
                    ? void 0
                    : s.map((e) => a.Coin.fromPartial(e))) || []),
                d
              );
            },
          }),
          (t.MsgInstantiateContractResponse = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.address && t.uint32(10).string(e.address),
              0 !== e.data.length && t.uint32(18).bytes(e.data),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = u();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.address = n.string();
                    break;
                  case 2:
                    i.data = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              address: O(e.address) ? String(e.address) : "",
              data: O(e.data) ? v(e.data) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.address && (t.address = e.address),
                void 0 !== e.data &&
                  (t.data = b(void 0 !== e.data ? e.data : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = u();
              return (
                (r.address = null !== (t = e.address) && void 0 !== t ? t : ""),
                (r.data =
                  null !== (n = e.data) && void 0 !== n ? n : new Uint8Array()),
                r
              );
            },
          }),
          (t.MsgExecuteContract = {
            encode(e, t = o.default.Writer.create()) {
              "" !== e.sender && t.uint32(10).string(e.sender),
                "" !== e.contract && t.uint32(18).string(e.contract),
                0 !== e.msg.length && t.uint32(26).bytes(e.msg);
              for (const n of e.funds)
                a.Coin.encode(n, t.uint32(42).fork()).ldelim();
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = l();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 2:
                    i.contract = n.string();
                    break;
                  case 3:
                    i.msg = n.bytes();
                    break;
                  case 5:
                    i.funds.push(a.Coin.decode(n, n.uint32()));
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              contract: O(e.contract) ? String(e.contract) : "",
              msg: O(e.msg) ? v(e.msg) : new Uint8Array(),
              funds: Array.isArray(null == e ? void 0 : e.funds)
                ? e.funds.map((e) => a.Coin.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.contract && (t.contract = e.contract),
                void 0 !== e.msg &&
                  (t.msg = b(void 0 !== e.msg ? e.msg : new Uint8Array())),
                e.funds
                  ? (t.funds = e.funds.map((e) =>
                      e ? a.Coin.toJSON(e) : void 0
                    ))
                  : (t.funds = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = l();
              return (
                (o.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (o.contract =
                  null !== (n = e.contract) && void 0 !== n ? n : ""),
                (o.msg =
                  null !== (r = e.msg) && void 0 !== r ? r : new Uint8Array()),
                (o.funds =
                  (null === (i = e.funds) || void 0 === i
                    ? void 0
                    : i.map((e) => a.Coin.fromPartial(e))) || []),
                o
              );
            },
          }),
          (t.MsgExecuteContractResponse = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.data.length && t.uint32(10).bytes(e.data), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = h();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.data = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              data: O(e.data) ? v(e.data) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.data &&
                  (t.data = b(void 0 !== e.data ? e.data : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = h();
              return (
                (n.data =
                  null !== (t = e.data) && void 0 !== t ? t : new Uint8Array()),
                n
              );
            },
          }),
          (t.MsgMigrateContract = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.sender && t.uint32(10).string(e.sender),
              "" !== e.contract && t.uint32(18).string(e.contract),
              "0" !== e.codeId && t.uint32(24).uint64(e.codeId),
              0 !== e.msg.length && t.uint32(34).bytes(e.msg),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = p();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 2:
                    i.contract = n.string();
                    break;
                  case 3:
                    i.codeId = S(n.uint64());
                    break;
                  case 4:
                    i.msg = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              contract: O(e.contract) ? String(e.contract) : "",
              codeId: O(e.codeId) ? String(e.codeId) : "0",
              msg: O(e.msg) ? v(e.msg) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.contract && (t.contract = e.contract),
                void 0 !== e.codeId && (t.codeId = e.codeId),
                void 0 !== e.msg &&
                  (t.msg = b(void 0 !== e.msg ? e.msg : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = p();
              return (
                (o.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (o.contract =
                  null !== (n = e.contract) && void 0 !== n ? n : ""),
                (o.codeId = null !== (r = e.codeId) && void 0 !== r ? r : "0"),
                (o.msg =
                  null !== (i = e.msg) && void 0 !== i ? i : new Uint8Array()),
                o
              );
            },
          }),
          (t.MsgMigrateContractResponse = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.data.length && t.uint32(10).bytes(e.data), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = f();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.data = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              data: O(e.data) ? v(e.data) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.data &&
                  (t.data = b(void 0 !== e.data ? e.data : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = f();
              return (
                (n.data =
                  null !== (t = e.data) && void 0 !== t ? t : new Uint8Array()),
                n
              );
            },
          }),
          (t.MsgUpdateAdmin = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.sender && t.uint32(10).string(e.sender),
              "" !== e.newAdmin && t.uint32(18).string(e.newAdmin),
              "" !== e.contract && t.uint32(26).string(e.contract),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { sender: "", newAdmin: "", contract: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 2:
                    i.newAdmin = n.string();
                    break;
                  case 3:
                    i.contract = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              newAdmin: O(e.newAdmin) ? String(e.newAdmin) : "",
              contract: O(e.contract) ? String(e.contract) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.newAdmin && (t.newAdmin = e.newAdmin),
                void 0 !== e.contract && (t.contract = e.contract),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = { sender: "", newAdmin: "", contract: "" };
              return (
                (i.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (i.newAdmin =
                  null !== (n = e.newAdmin) && void 0 !== n ? n : ""),
                (i.contract =
                  null !== (r = e.contract) && void 0 !== r ? r : ""),
                i
              );
            },
          }),
          (t.MsgUpdateAdminResponse = {
            encode: (e, t = o.default.Writer.create()) => t,
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = {};
              for (; n.pos < r; ) {
                const e = n.uint32();
                n.skipType(7 & e);
              }
              return i;
            },
            fromJSON: (e) => ({}),
            toJSON: (e) => ({}),
            fromPartial: (e) => ({}),
          }),
          (t.MsgClearAdmin = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.sender && t.uint32(10).string(e.sender),
              "" !== e.contract && t.uint32(26).string(e.contract),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { sender: "", contract: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.sender = n.string();
                    break;
                  case 3:
                    i.contract = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              sender: O(e.sender) ? String(e.sender) : "",
              contract: O(e.contract) ? String(e.contract) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.sender && (t.sender = e.sender),
                void 0 !== e.contract && (t.contract = e.contract),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { sender: "", contract: "" };
              return (
                (r.sender = null !== (t = e.sender) && void 0 !== t ? t : ""),
                (r.contract =
                  null !== (n = e.contract) && void 0 !== n ? n : ""),
                r
              );
            },
          }),
          (t.MsgClearAdminResponse = {
            encode: (e, t = o.default.Writer.create()) => t,
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = {};
              for (; n.pos < r; ) {
                const e = n.uint32();
                n.skipType(7 & e);
              }
              return i;
            },
            fromJSON: (e) => ({}),
            toJSON: (e) => ({}),
            fromPartial: (e) => ({}),
          });
        var g = (() => {
          if (void 0 !== g) return g;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const m =
          g.atob || ((e) => g.Buffer.from(e, "base64").toString("binary"));
        function v(e) {
          const t = m(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const y =
          g.btoa || ((e) => g.Buffer.from(e, "binary").toString("base64"));
        function b(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return y(t.join(""));
        }
        function S(e) {
          return e.toString();
        }
        function O(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    675: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.MsgTransferResponse = t.MsgTransfer = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93),
        a = n(752);
      function d(e) {
        return null != e;
      }
      (t.protobufPackage = "ibc.applications.transfer.v1"),
        (t.MsgTransfer = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.sourcePort && t.uint32(10).string(e.sourcePort),
            "" !== e.sourceChannel && t.uint32(18).string(e.sourceChannel),
            void 0 !== e.token &&
              s.Coin.encode(e.token, t.uint32(26).fork()).ldelim(),
            "" !== e.sender && t.uint32(34).string(e.sender),
            "" !== e.receiver && t.uint32(42).string(e.receiver),
            void 0 !== e.timeoutHeight &&
              a.Height.encode(e.timeoutHeight, t.uint32(50).fork()).ldelim(),
            "0" !== e.timeoutTimestamp &&
              t.uint32(56).uint64(e.timeoutTimestamp),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              sourcePort: "",
              sourceChannel: "",
              token: void 0,
              sender: "",
              receiver: "",
              timeoutHeight: void 0,
              timeoutTimestamp: "0",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.sourcePort = n.string();
                  break;
                case 2:
                  i.sourceChannel = n.string();
                  break;
                case 3:
                  i.token = s.Coin.decode(n, n.uint32());
                  break;
                case 4:
                  i.sender = n.string();
                  break;
                case 5:
                  i.receiver = n.string();
                  break;
                case 6:
                  i.timeoutHeight = a.Height.decode(n, n.uint32());
                  break;
                case 7:
                  i.timeoutTimestamp = n.uint64().toString();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            sourcePort: d(e.sourcePort) ? String(e.sourcePort) : "",
            sourceChannel: d(e.sourceChannel) ? String(e.sourceChannel) : "",
            token: d(e.token) ? s.Coin.fromJSON(e.token) : void 0,
            sender: d(e.sender) ? String(e.sender) : "",
            receiver: d(e.receiver) ? String(e.receiver) : "",
            timeoutHeight: d(e.timeoutHeight)
              ? a.Height.fromJSON(e.timeoutHeight)
              : void 0,
            timeoutTimestamp: d(e.timeoutTimestamp)
              ? String(e.timeoutTimestamp)
              : "0",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.sourcePort && (t.sourcePort = e.sourcePort),
              void 0 !== e.sourceChannel && (t.sourceChannel = e.sourceChannel),
              void 0 !== e.token &&
                (t.token = e.token ? s.Coin.toJSON(e.token) : void 0),
              void 0 !== e.sender && (t.sender = e.sender),
              void 0 !== e.receiver && (t.receiver = e.receiver),
              void 0 !== e.timeoutHeight &&
                (t.timeoutHeight = e.timeoutHeight
                  ? a.Height.toJSON(e.timeoutHeight)
                  : void 0),
              void 0 !== e.timeoutTimestamp &&
                (t.timeoutTimestamp = e.timeoutTimestamp),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i, o;
            const d = {
              sourcePort: "",
              sourceChannel: "",
              token: void 0,
              sender: "",
              receiver: "",
              timeoutHeight: void 0,
              timeoutTimestamp: "0",
            };
            return (
              (d.sourcePort =
                null !== (t = e.sourcePort) && void 0 !== t ? t : ""),
              (d.sourceChannel =
                null !== (n = e.sourceChannel) && void 0 !== n ? n : ""),
              (d.token =
                void 0 !== e.token && null !== e.token
                  ? s.Coin.fromPartial(e.token)
                  : void 0),
              (d.sender = null !== (r = e.sender) && void 0 !== r ? r : ""),
              (d.receiver = null !== (i = e.receiver) && void 0 !== i ? i : ""),
              (d.timeoutHeight =
                void 0 !== e.timeoutHeight && null !== e.timeoutHeight
                  ? a.Height.fromPartial(e.timeoutHeight)
                  : void 0),
              (d.timeoutTimestamp =
                null !== (o = e.timeoutTimestamp) && void 0 !== o ? o : "0"),
              d
            );
          },
        }),
        (t.MsgTransferResponse = {
          encode: (e, t = o.default.Writer.create()) => t,
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {};
            for (; n.pos < r; ) {
              const e = n.uint32();
              n.skipType(7 & e);
            }
            return i;
          },
          fromJSON: (e) => ({}),
          toJSON: (e) => ({}),
          fromPartial: (e) => ({}),
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    676: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.SignatureDescriptor_Data_Multi =
            t.SignatureDescriptor_Data_Single =
            t.SignatureDescriptor_Data =
            t.SignatureDescriptor =
            t.SignatureDescriptors =
            t.signModeToJSON =
            t.signModeFromJSON =
            t.SignMode =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(94),
          a = n(431);
        var d;
        function c(e) {
          switch (e) {
            case 0:
            case "SIGN_MODE_UNSPECIFIED":
              return d.SIGN_MODE_UNSPECIFIED;
            case 1:
            case "SIGN_MODE_DIRECT":
              return d.SIGN_MODE_DIRECT;
            case 2:
            case "SIGN_MODE_TEXTUAL":
              return d.SIGN_MODE_TEXTUAL;
            case 127:
            case "SIGN_MODE_LEGACY_AMINO_JSON":
              return d.SIGN_MODE_LEGACY_AMINO_JSON;
            case -1:
            case "UNRECOGNIZED":
            default:
              return d.UNRECOGNIZED;
          }
        }
        function u(e) {
          switch (e) {
            case d.SIGN_MODE_UNSPECIFIED:
              return "SIGN_MODE_UNSPECIFIED";
            case d.SIGN_MODE_DIRECT:
              return "SIGN_MODE_DIRECT";
            case d.SIGN_MODE_TEXTUAL:
              return "SIGN_MODE_TEXTUAL";
            case d.SIGN_MODE_LEGACY_AMINO_JSON:
              return "SIGN_MODE_LEGACY_AMINO_JSON";
            default:
              return "UNKNOWN";
          }
        }
        function l() {
          return { mode: 0, signature: new Uint8Array() };
        }
        (t.protobufPackage = "cosmos.tx.signing.v1beta1"),
          (function (e) {
            (e[(e.SIGN_MODE_UNSPECIFIED = 0)] = "SIGN_MODE_UNSPECIFIED"),
              (e[(e.SIGN_MODE_DIRECT = 1)] = "SIGN_MODE_DIRECT"),
              (e[(e.SIGN_MODE_TEXTUAL = 2)] = "SIGN_MODE_TEXTUAL"),
              (e[(e.SIGN_MODE_LEGACY_AMINO_JSON = 127)] =
                "SIGN_MODE_LEGACY_AMINO_JSON"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((d = t.SignMode || (t.SignMode = {}))),
          (t.signModeFromJSON = c),
          (t.signModeToJSON = u),
          (t.SignatureDescriptors = {
            encode(e, n = o.default.Writer.create()) {
              for (const r of e.signatures)
                t.SignatureDescriptor.encode(r, n.uint32(10).fork()).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { signatures: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.signatures.push(
                      t.SignatureDescriptor.decode(r, r.uint32())
                    );
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) => t.SignatureDescriptor.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                e.signatures
                  ? (n.signatures = e.signatures.map((e) =>
                      e ? t.SignatureDescriptor.toJSON(e) : void 0
                    ))
                  : (n.signatures = []),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { signatures: [] };
              return (
                (r.signatures =
                  (null === (n = e.signatures) || void 0 === n
                    ? void 0
                    : n.map((e) => t.SignatureDescriptor.fromPartial(e))) ||
                  []),
                r
              );
            },
          }),
          (t.SignatureDescriptor = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.publicKey &&
                s.Any.encode(e.publicKey, n.uint32(10).fork()).ldelim(),
              void 0 !== e.data &&
                t.SignatureDescriptor_Data.encode(
                  e.data,
                  n.uint32(18).fork()
                ).ldelim(),
              "0" !== e.sequence && n.uint32(24).uint64(e.sequence),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const a = { publicKey: void 0, data: void 0, sequence: "0" };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    a.publicKey = s.Any.decode(r, r.uint32());
                    break;
                  case 2:
                    a.data = t.SignatureDescriptor_Data.decode(r, r.uint32());
                    break;
                  case 3:
                    a.sequence = r.uint64().toString();
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return a;
            },
            fromJSON: (e) => ({
              publicKey: m(e.publicKey) ? s.Any.fromJSON(e.publicKey) : void 0,
              data: m(e.data)
                ? t.SignatureDescriptor_Data.fromJSON(e.data)
                : void 0,
              sequence: m(e.sequence) ? String(e.sequence) : "0",
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.publicKey &&
                  (n.publicKey = e.publicKey
                    ? s.Any.toJSON(e.publicKey)
                    : void 0),
                void 0 !== e.data &&
                  (n.data = e.data
                    ? t.SignatureDescriptor_Data.toJSON(e.data)
                    : void 0),
                void 0 !== e.sequence && (n.sequence = e.sequence),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { publicKey: void 0, data: void 0, sequence: "0" };
              return (
                (r.publicKey =
                  void 0 !== e.publicKey && null !== e.publicKey
                    ? s.Any.fromPartial(e.publicKey)
                    : void 0),
                (r.data =
                  void 0 !== e.data && null !== e.data
                    ? t.SignatureDescriptor_Data.fromPartial(e.data)
                    : void 0),
                (r.sequence =
                  null !== (n = e.sequence) && void 0 !== n ? n : "0"),
                r
              );
            },
          }),
          (t.SignatureDescriptor_Data = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.single &&
                t.SignatureDescriptor_Data_Single.encode(
                  e.single,
                  n.uint32(10).fork()
                ).ldelim(),
              void 0 !== e.multi &&
                t.SignatureDescriptor_Data_Multi.encode(
                  e.multi,
                  n.uint32(18).fork()
                ).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { single: void 0, multi: void 0 };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.single = t.SignatureDescriptor_Data_Single.decode(
                      r,
                      r.uint32()
                    );
                    break;
                  case 2:
                    s.multi = t.SignatureDescriptor_Data_Multi.decode(
                      r,
                      r.uint32()
                    );
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              single: m(e.single)
                ? t.SignatureDescriptor_Data_Single.fromJSON(e.single)
                : void 0,
              multi: m(e.multi)
                ? t.SignatureDescriptor_Data_Multi.fromJSON(e.multi)
                : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.single &&
                  (n.single = e.single
                    ? t.SignatureDescriptor_Data_Single.toJSON(e.single)
                    : void 0),
                void 0 !== e.multi &&
                  (n.multi = e.multi
                    ? t.SignatureDescriptor_Data_Multi.toJSON(e.multi)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              const n = { single: void 0, multi: void 0 };
              return (
                (n.single =
                  void 0 !== e.single && null !== e.single
                    ? t.SignatureDescriptor_Data_Single.fromPartial(e.single)
                    : void 0),
                (n.multi =
                  void 0 !== e.multi && null !== e.multi
                    ? t.SignatureDescriptor_Data_Multi.fromPartial(e.multi)
                    : void 0),
                n
              );
            },
          }),
          (t.SignatureDescriptor_Data_Single = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.mode && t.uint32(8).int32(e.mode),
              0 !== e.signature.length && t.uint32(18).bytes(e.signature),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = l();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.mode = n.int32();
                    break;
                  case 2:
                    i.signature = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              mode: m(e.mode) ? c(e.mode) : 0,
              signature: m(e.signature) ? f(e.signature) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.mode && (t.mode = u(e.mode)),
                void 0 !== e.signature &&
                  (t.signature = (function (e) {
                    const t = [];
                    for (const n of e) t.push(String.fromCharCode(n));
                    return g(t.join(""));
                  })(void 0 !== e.signature ? e.signature : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = l();
              return (
                (r.mode = null !== (t = e.mode) && void 0 !== t ? t : 0),
                (r.signature =
                  null !== (n = e.signature) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                r
              );
            },
          }),
          (t.SignatureDescriptor_Data_Multi = {
            encode(e, n = o.default.Writer.create()) {
              void 0 !== e.bitarray &&
                a.CompactBitArray.encode(
                  e.bitarray,
                  n.uint32(10).fork()
                ).ldelim();
              for (const r of e.signatures)
                t.SignatureDescriptor_Data.encode(
                  r,
                  n.uint32(18).fork()
                ).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { bitarray: void 0, signatures: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.bitarray = a.CompactBitArray.decode(r, r.uint32());
                    break;
                  case 2:
                    s.signatures.push(
                      t.SignatureDescriptor_Data.decode(r, r.uint32())
                    );
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              bitarray: m(e.bitarray)
                ? a.CompactBitArray.fromJSON(e.bitarray)
                : void 0,
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) =>
                    t.SignatureDescriptor_Data.fromJSON(e)
                  )
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.bitarray &&
                  (n.bitarray = e.bitarray
                    ? a.CompactBitArray.toJSON(e.bitarray)
                    : void 0),
                e.signatures
                  ? (n.signatures = e.signatures.map((e) =>
                      e ? t.SignatureDescriptor_Data.toJSON(e) : void 0
                    ))
                  : (n.signatures = []),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { bitarray: void 0, signatures: [] };
              return (
                (r.bitarray =
                  void 0 !== e.bitarray && null !== e.bitarray
                    ? a.CompactBitArray.fromPartial(e.bitarray)
                    : void 0),
                (r.signatures =
                  (null === (n = e.signatures) || void 0 === n
                    ? void 0
                    : n.map((e) =>
                        t.SignatureDescriptor_Data.fromPartial(e)
                      )) || []),
                r
              );
            },
          });
        var h = (() => {
          if (void 0 !== h) return h;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const p =
          h.atob || ((e) => h.Buffer.from(e, "base64").toString("binary"));
        function f(e) {
          const t = p(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const g =
          h.btoa || ((e) => h.Buffer.from(e, "binary").toString("base64"));
        function m(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    719: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CoinPretty = void 0);
      const r = n(211),
        i = n(156),
        o = n(179);
      class s {
        constructor(e, t) {
          (this._currency = e),
            (this.amount = t),
            (this._options = {
              separator: " ",
              upperCase: !1,
              lowerCase: !1,
              hideDenom: !1,
              hideIBCMetadata: !1,
            }),
            "object" == typeof this.amount && "toDec" in this.amount
              ? (this.amount = this.amount.toDec())
              : this.amount instanceof i.Dec ||
                (this.amount = new i.Dec(this.amount)),
            (this.intPretty = new r.IntPretty(
              this.amount.quoTruncate(
                o.DecUtils.getTenExponentNInPrecisionRange(e.coinDecimals)
              )
            ).maxDecimals(e.coinDecimals));
        }
        get options() {
          return Object.assign(
            Object.assign({}, this._options),
            this.intPretty.options
          );
        }
        get denom() {
          return this.currency.coinDenom;
        }
        get currency() {
          return this._currency;
        }
        setCurrency(e) {
          const t = this.clone();
          return (
            (t.intPretty = this.intPretty.moveDecimalPointRight(
              this._currency.coinDecimals - e.coinDecimals
            )),
            (t._currency = e),
            t
          );
        }
        separator(e) {
          const t = this.clone();
          return (t._options.separator = e), t;
        }
        upperCase(e) {
          const t = this.clone();
          return (t._options.upperCase = e), (t._options.lowerCase = !e), t;
        }
        lowerCase(e) {
          const t = this.clone();
          return (t._options.lowerCase = e), (t._options.upperCase = !e), t;
        }
        hideDenom(e) {
          const t = this.clone();
          return (t._options.hideDenom = e), t;
        }
        hideIBCMetadata(e) {
          const t = this.clone();
          return (t._options.hideIBCMetadata = e), t;
        }
        moveDecimalPointLeft(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointLeft(e)), t;
        }
        moveDecimalPointRight(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointRight(e)), t;
        }
        increasePrecision(e) {
          return this.moveDecimalPointLeft(e);
        }
        decreasePrecision(e) {
          return this.moveDecimalPointRight(e);
        }
        maxDecimals(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.maxDecimals(e)), t;
        }
        inequalitySymbol(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbol(e)), t;
        }
        inequalitySymbolSeparator(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbolSeparator(e)), t;
        }
        trim(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.trim(e)), t;
        }
        shrink(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.shrink(e)), t;
        }
        locale(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.locale(e)), t;
        }
        ready(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.ready(e)), t;
        }
        get isReady() {
          return this.intPretty.isReady;
        }
        add(e) {
          const t = e instanceof s;
          if (
            t &&
            "currency" in e &&
            this.currency.coinMinimalDenom !== e.currency.coinMinimalDenom
          )
            return this.clone();
          "toDec" in e && (e = e.toDec());
          const n = this.clone();
          return (
            (n.intPretty = n.intPretty.add(
              t
                ? e
                : e.mul(
                    o.DecUtils.getTenExponentNInPrecisionRange(
                      -this._currency.coinDecimals
                    )
                  )
            )),
            n
          );
        }
        sub(e) {
          const t = e instanceof s;
          if (
            t &&
            "currency" in e &&
            this.currency.coinMinimalDenom !== e.currency.coinMinimalDenom
          )
            return this.clone();
          "toDec" in e && (e = e.toDec());
          const n = this.clone();
          return (
            (n.intPretty = n.intPretty.sub(
              t
                ? e
                : e.mul(
                    o.DecUtils.getTenExponentNInPrecisionRange(
                      -this._currency.coinDecimals
                    )
                  )
            )),
            n
          );
        }
        mul(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.mul(e)), t;
        }
        quo(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.quo(e)), t;
        }
        toDec() {
          return this.intPretty.toDec();
        }
        toCoin() {
          const e = this.toDec()
            .mulTruncate(
              o.DecUtils.getTenExponentNInPrecisionRange(
                this.currency.coinDecimals
              )
            )
            .truncate();
          return {
            denom: this.currency.coinMinimalDenom,
            amount: e.toString(),
          };
        }
        toString() {
          let e = this.denom;
          this._options.hideIBCMetadata &&
            "originCurrency" in this.currency &&
            this.currency.originCurrency &&
            (e = this.currency.originCurrency.coinDenom),
            this._options.upperCase && (e = e.toUpperCase()),
            this._options.lowerCase && (e = e.toLowerCase());
          let t = this._options.separator;
          return (
            this._options.hideDenom && ((e = ""), (t = "")),
            this.intPretty.toStringWithSymbols("", `${t}${e}`)
          );
        }
        clone() {
          const e = new s(this._currency, this.amount);
          return (
            (e._options = Object.assign({}, this._options)),
            (e.intPretty = this.intPretty.clone()),
            e
          );
        }
      }
      t.CoinPretty = s;
    },
    720: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.PricePretty = void 0);
      const r = n(211),
        i = n(179);
      class o {
        constructor(e, t) {
          (this._fiatCurrency = e),
            (this.amount = t),
            (this._options = {
              separator: "",
              upperCase: !1,
              lowerCase: !1,
              locale: "en-US",
            }),
            (this.intPretty = new r.IntPretty(t)
              .maxDecimals(e.maxDecimals)
              .shrink(!0)
              .trim(!0)
              .locale(!1)
              .inequalitySymbol(!0)),
            (this._options.locale = e.locale);
        }
        get options() {
          return Object.assign(
            Object.assign({}, this.intPretty.options),
            this._options
          );
        }
        get symbol() {
          return this._fiatCurrency.symbol;
        }
        get fiatCurrency() {
          return this._fiatCurrency;
        }
        separator(e) {
          const t = this.clone();
          return (t._options.separator = e), t;
        }
        upperCase(e) {
          const t = this.clone();
          return (t._options.upperCase = e), (t._options.lowerCase = !e), t;
        }
        lowerCase(e) {
          const t = this.clone();
          return (t._options.lowerCase = e), (t._options.upperCase = !e), t;
        }
        moveDecimalPointLeft(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointLeft(e)), t;
        }
        moveDecimalPointRight(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointRight(e)), t;
        }
        increasePrecision(e) {
          return this.moveDecimalPointLeft(e);
        }
        decreasePrecision(e) {
          return this.moveDecimalPointRight(e);
        }
        maxDecimals(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.maxDecimals(e)), t;
        }
        inequalitySymbol(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbol(e)), t;
        }
        inequalitySymbolSeparator(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbolSeparator(e)), t;
        }
        trim(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.trim(e)), t;
        }
        shrink(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.shrink(e)), t;
        }
        locale(e) {
          const t = this.clone();
          return (t._options.locale = e), t;
        }
        ready(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.ready(e)), t;
        }
        get isReady() {
          return this.intPretty.isReady;
        }
        add(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.add(e)), t;
        }
        sub(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.sub(e)), t;
        }
        mul(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.mul(e)), t;
        }
        quo(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.quo(e)), t;
        }
        toDec() {
          return this.intPretty.toDec();
        }
        toString() {
          let e = this.symbol;
          this._options.upperCase && (e = e.toUpperCase()),
            this._options.lowerCase && (e = e.toLowerCase());
          const t = this.toDec(),
            n = this.options;
          if (
            n.inequalitySymbol &&
            !t.isZero() &&
            t.abs().lt(i.DecUtils.getTenExponentN(-n.maxDecimals))
          )
            return this.intPretty.toStringWithSymbols(
              `${e}${this._options.separator}`,
              ""
            );
          let r = parseFloat(this.intPretty.toString()).toLocaleString(
            n.locale,
            { maximumFractionDigits: n.maxDecimals }
          );
          const o = "-" === r.charAt(0);
          return (
            o && (r = r.slice(1)),
            `${o ? "-" : ""}${e}${this._options.separator}${r}`
          );
        }
        clone() {
          const e = new o(this._fiatCurrency, this.amount);
          return (
            (e._options = Object.assign({}, this._options)),
            (e.intPretty = this.intPretty.clone()),
            e
          );
        }
      }
      t.PricePretty = o;
    },
    721: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.RatePretty = void 0);
      const r = n(211);
      class i {
        constructor(e) {
          (this.amount = e),
            (this._options = { separator: "", symbol: "%" }),
            (this.intPretty = new r.IntPretty(e)),
            (this.intPretty = this.intPretty
              .maxDecimals(3)
              .shrink(!1)
              .trim(!0)
              .locale(!0)
              .inequalitySymbol(!0));
        }
        get options() {
          return Object.assign(
            Object.assign({}, this.intPretty.options),
            this._options
          );
        }
        separator(e) {
          const t = this.clone();
          return (t._options.separator = e), t;
        }
        symbol(e) {
          const t = this.clone();
          return (t._options.symbol = e), t;
        }
        moveDecimalPointLeft(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointLeft(e)), t;
        }
        moveDecimalPointRight(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.moveDecimalPointRight(e)), t;
        }
        maxDecimals(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.maxDecimals(e)), t;
        }
        inequalitySymbol(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbol(e)), t;
        }
        inequalitySymbolSeparator(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.inequalitySymbolSeparator(e)), t;
        }
        trim(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.trim(e)), t;
        }
        shrink(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.shrink(e)), t;
        }
        locale(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.locale(e)), t;
        }
        ready(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.ready(e)), t;
        }
        get isReady() {
          return this.intPretty.isReady;
        }
        add(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.add(e)), t;
        }
        sub(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.sub(e)), t;
        }
        mul(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.mul(e)), t;
        }
        quo(e) {
          const t = this.clone();
          return (t.intPretty = t.intPretty.quo(e)), t;
        }
        toDec() {
          return this.intPretty.toDec();
        }
        toString() {
          return this.intPretty
            .moveDecimalPointRight(2)
            .toStringWithSymbols(
              "",
              `${this._options.separator}${this._options.symbol}`
            );
        }
        clone() {
          const e = new i(this.amount);
          return (
            (e._options = Object.assign({}, this._options)),
            (e.intPretty = this.intPretty.clone()),
            e
          );
        }
      }
      t.RatePretty = i;
    },
    723: function (e, t) {},
    743: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Metadata =
          t.DenomUnit =
          t.Supply =
          t.Output =
          t.Input =
          t.SendEnabled =
          t.Params =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(93);
      function a(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.bank.v1beta1"),
        (t.Params = {
          encode(e, n = o.default.Writer.create()) {
            for (const r of e.sendEnabled)
              t.SendEnabled.encode(r, n.uint32(10).fork()).ldelim();
            return (
              !0 === e.defaultSendEnabled &&
                n.uint32(16).bool(e.defaultSendEnabled),
              n
            );
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { sendEnabled: [], defaultSendEnabled: !1 };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.sendEnabled.push(t.SendEnabled.decode(r, r.uint32()));
                  break;
                case 2:
                  s.defaultSendEnabled = r.bool();
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            sendEnabled: Array.isArray(null == e ? void 0 : e.sendEnabled)
              ? e.sendEnabled.map((e) => t.SendEnabled.fromJSON(e))
              : [],
            defaultSendEnabled:
              !!a(e.defaultSendEnabled) && Boolean(e.defaultSendEnabled),
          }),
          toJSON(e) {
            const n = {};
            return (
              e.sendEnabled
                ? (n.sendEnabled = e.sendEnabled.map((e) =>
                    e ? t.SendEnabled.toJSON(e) : void 0
                  ))
                : (n.sendEnabled = []),
              void 0 !== e.defaultSendEnabled &&
                (n.defaultSendEnabled = e.defaultSendEnabled),
              n
            );
          },
          fromPartial(e) {
            var n, r;
            const i = { sendEnabled: [], defaultSendEnabled: !1 };
            return (
              (i.sendEnabled =
                (null === (n = e.sendEnabled) || void 0 === n
                  ? void 0
                  : n.map((e) => t.SendEnabled.fromPartial(e))) || []),
              (i.defaultSendEnabled =
                null !== (r = e.defaultSendEnabled) && void 0 !== r && r),
              i
            );
          },
        }),
        (t.SendEnabled = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.denom && t.uint32(10).string(e.denom),
            !0 === e.enabled && t.uint32(16).bool(e.enabled),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { denom: "", enabled: !1 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.denom = n.string();
                  break;
                case 2:
                  i.enabled = n.bool();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            denom: a(e.denom) ? String(e.denom) : "",
            enabled: !!a(e.enabled) && Boolean(e.enabled),
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.denom && (t.denom = e.denom),
              void 0 !== e.enabled && (t.enabled = e.enabled),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { denom: "", enabled: !1 };
            return (
              (r.denom = null !== (t = e.denom) && void 0 !== t ? t : ""),
              (r.enabled = null !== (n = e.enabled) && void 0 !== n && n),
              r
            );
          },
        }),
        (t.Input = {
          encode(e, t = o.default.Writer.create()) {
            "" !== e.address && t.uint32(10).string(e.address);
            for (const n of e.coins)
              s.Coin.encode(n, t.uint32(18).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { address: "", coins: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.address = n.string();
                  break;
                case 2:
                  i.coins.push(s.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            address: a(e.address) ? String(e.address) : "",
            coins: Array.isArray(null == e ? void 0 : e.coins)
              ? e.coins.map((e) => s.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.address && (t.address = e.address),
              e.coins
                ? (t.coins = e.coins.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.coins = []),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { address: "", coins: [] };
            return (
              (r.address = null !== (t = e.address) && void 0 !== t ? t : ""),
              (r.coins =
                (null === (n = e.coins) || void 0 === n
                  ? void 0
                  : n.map((e) => s.Coin.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.Output = {
          encode(e, t = o.default.Writer.create()) {
            "" !== e.address && t.uint32(10).string(e.address);
            for (const n of e.coins)
              s.Coin.encode(n, t.uint32(18).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { address: "", coins: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.address = n.string();
                  break;
                case 2:
                  i.coins.push(s.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            address: a(e.address) ? String(e.address) : "",
            coins: Array.isArray(null == e ? void 0 : e.coins)
              ? e.coins.map((e) => s.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.address && (t.address = e.address),
              e.coins
                ? (t.coins = e.coins.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.coins = []),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { address: "", coins: [] };
            return (
              (r.address = null !== (t = e.address) && void 0 !== t ? t : ""),
              (r.coins =
                (null === (n = e.coins) || void 0 === n
                  ? void 0
                  : n.map((e) => s.Coin.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.Supply = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.total)
              s.Coin.encode(n, t.uint32(10).fork()).ldelim();
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { total: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.total.push(s.Coin.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            total: Array.isArray(null == e ? void 0 : e.total)
              ? e.total.map((e) => s.Coin.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.total
                ? (t.total = e.total.map((e) =>
                    e ? s.Coin.toJSON(e) : void 0
                  ))
                : (t.total = []),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { total: [] };
            return (
              (n.total =
                (null === (t = e.total) || void 0 === t
                  ? void 0
                  : t.map((e) => s.Coin.fromPartial(e))) || []),
              n
            );
          },
        }),
        (t.DenomUnit = {
          encode(e, t = o.default.Writer.create()) {
            "" !== e.denom && t.uint32(10).string(e.denom),
              0 !== e.exponent && t.uint32(16).uint32(e.exponent);
            for (const n of e.aliases) t.uint32(26).string(n);
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { denom: "", exponent: 0, aliases: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.denom = n.string();
                  break;
                case 2:
                  i.exponent = n.uint32();
                  break;
                case 3:
                  i.aliases.push(n.string());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            denom: a(e.denom) ? String(e.denom) : "",
            exponent: a(e.exponent) ? Number(e.exponent) : 0,
            aliases: Array.isArray(null == e ? void 0 : e.aliases)
              ? e.aliases.map((e) => String(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.denom && (t.denom = e.denom),
              void 0 !== e.exponent && (t.exponent = Math.round(e.exponent)),
              e.aliases
                ? (t.aliases = e.aliases.map((e) => e))
                : (t.aliases = []),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { denom: "", exponent: 0, aliases: [] };
            return (
              (i.denom = null !== (t = e.denom) && void 0 !== t ? t : ""),
              (i.exponent = null !== (n = e.exponent) && void 0 !== n ? n : 0),
              (i.aliases =
                (null === (r = e.aliases) || void 0 === r
                  ? void 0
                  : r.map((e) => e)) || []),
              i
            );
          },
        }),
        (t.Metadata = {
          encode(e, n = o.default.Writer.create()) {
            "" !== e.description && n.uint32(10).string(e.description);
            for (const r of e.denomUnits)
              t.DenomUnit.encode(r, n.uint32(18).fork()).ldelim();
            return (
              "" !== e.base && n.uint32(26).string(e.base),
              "" !== e.display && n.uint32(34).string(e.display),
              "" !== e.name && n.uint32(42).string(e.name),
              "" !== e.symbol && n.uint32(50).string(e.symbol),
              n
            );
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = {
              description: "",
              denomUnits: [],
              base: "",
              display: "",
              name: "",
              symbol: "",
            };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.description = r.string();
                  break;
                case 2:
                  s.denomUnits.push(t.DenomUnit.decode(r, r.uint32()));
                  break;
                case 3:
                  s.base = r.string();
                  break;
                case 4:
                  s.display = r.string();
                  break;
                case 5:
                  s.name = r.string();
                  break;
                case 6:
                  s.symbol = r.string();
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            description: a(e.description) ? String(e.description) : "",
            denomUnits: Array.isArray(null == e ? void 0 : e.denomUnits)
              ? e.denomUnits.map((e) => t.DenomUnit.fromJSON(e))
              : [],
            base: a(e.base) ? String(e.base) : "",
            display: a(e.display) ? String(e.display) : "",
            name: a(e.name) ? String(e.name) : "",
            symbol: a(e.symbol) ? String(e.symbol) : "",
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.description && (n.description = e.description),
              e.denomUnits
                ? (n.denomUnits = e.denomUnits.map((e) =>
                    e ? t.DenomUnit.toJSON(e) : void 0
                  ))
                : (n.denomUnits = []),
              void 0 !== e.base && (n.base = e.base),
              void 0 !== e.display && (n.display = e.display),
              void 0 !== e.name && (n.name = e.name),
              void 0 !== e.symbol && (n.symbol = e.symbol),
              n
            );
          },
          fromPartial(e) {
            var n, r, i, o, s, a;
            const d = {
              description: "",
              denomUnits: [],
              base: "",
              display: "",
              name: "",
              symbol: "",
            };
            return (
              (d.description =
                null !== (n = e.description) && void 0 !== n ? n : ""),
              (d.denomUnits =
                (null === (r = e.denomUnits) || void 0 === r
                  ? void 0
                  : r.map((e) => t.DenomUnit.fromPartial(e))) || []),
              (d.base = null !== (i = e.base) && void 0 !== i ? i : ""),
              (d.display = null !== (o = e.display) && void 0 !== o ? o : ""),
              (d.name = null !== (s = e.name) && void 0 !== s ? s : ""),
              (d.symbol = null !== (a = e.symbol) && void 0 !== a ? a : ""),
              d
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    744: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Pool =
          t.RedelegationResponse =
          t.RedelegationEntryResponse =
          t.DelegationResponse =
          t.Params =
          t.Redelegation =
          t.RedelegationEntry =
          t.UnbondingDelegationEntry =
          t.UnbondingDelegation =
          t.Delegation =
          t.DVVTriplets =
          t.DVVTriplet =
          t.DVPairs =
          t.DVPair =
          t.ValAddresses =
          t.Validator =
          t.Description =
          t.Commission =
          t.CommissionRates =
          t.HistoricalInfo =
          t.bondStatusToJSON =
          t.bondStatusFromJSON =
          t.BondStatus =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(157),
        a = n(745),
        d = n(94),
        c = n(428),
        u = n(93);
      var l;
      function h(e) {
        switch (e) {
          case 0:
          case "BOND_STATUS_UNSPECIFIED":
            return l.BOND_STATUS_UNSPECIFIED;
          case 1:
          case "BOND_STATUS_UNBONDED":
            return l.BOND_STATUS_UNBONDED;
          case 2:
          case "BOND_STATUS_UNBONDING":
            return l.BOND_STATUS_UNBONDING;
          case 3:
          case "BOND_STATUS_BONDED":
            return l.BOND_STATUS_BONDED;
          case -1:
          case "UNRECOGNIZED":
          default:
            return l.UNRECOGNIZED;
        }
      }
      function p(e) {
        switch (e) {
          case l.BOND_STATUS_UNSPECIFIED:
            return "BOND_STATUS_UNSPECIFIED";
          case l.BOND_STATUS_UNBONDED:
            return "BOND_STATUS_UNBONDED";
          case l.BOND_STATUS_UNBONDING:
            return "BOND_STATUS_UNBONDING";
          case l.BOND_STATUS_BONDED:
            return "BOND_STATUS_BONDED";
          default:
            return "UNKNOWN";
        }
      }
      function f(e) {
        return {
          seconds: Math.trunc(e.getTime() / 1e3).toString(),
          nanos: (e.getTime() % 1e3) * 1e6,
        };
      }
      function g(e) {
        let t = 1e3 * Number(e.seconds);
        return (t += e.nanos / 1e6), new Date(t);
      }
      function m(e) {
        return e instanceof Date
          ? e
          : "string" == typeof e
          ? new Date(e)
          : g(s.Timestamp.fromJSON(e));
      }
      function v(e) {
        return e.toString();
      }
      function y(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.staking.v1beta1"),
        (function (e) {
          (e[(e.BOND_STATUS_UNSPECIFIED = 0)] = "BOND_STATUS_UNSPECIFIED"),
            (e[(e.BOND_STATUS_UNBONDED = 1)] = "BOND_STATUS_UNBONDED"),
            (e[(e.BOND_STATUS_UNBONDING = 2)] = "BOND_STATUS_UNBONDING"),
            (e[(e.BOND_STATUS_BONDED = 3)] = "BOND_STATUS_BONDED"),
            (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
        })((l = t.BondStatus || (t.BondStatus = {}))),
        (t.bondStatusFromJSON = h),
        (t.bondStatusToJSON = p),
        (t.HistoricalInfo = {
          encode(e, n = o.default.Writer.create()) {
            void 0 !== e.header &&
              a.Header.encode(e.header, n.uint32(10).fork()).ldelim();
            for (const r of e.valset)
              t.Validator.encode(r, n.uint32(18).fork()).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { header: void 0, valset: [] };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.header = a.Header.decode(r, r.uint32());
                  break;
                case 2:
                  s.valset.push(t.Validator.decode(r, r.uint32()));
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            header: y(e.header) ? a.Header.fromJSON(e.header) : void 0,
            valset: Array.isArray(null == e ? void 0 : e.valset)
              ? e.valset.map((e) => t.Validator.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.header &&
                (n.header = e.header ? a.Header.toJSON(e.header) : void 0),
              e.valset
                ? (n.valset = e.valset.map((e) =>
                    e ? t.Validator.toJSON(e) : void 0
                  ))
                : (n.valset = []),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { header: void 0, valset: [] };
            return (
              (r.header =
                void 0 !== e.header && null !== e.header
                  ? a.Header.fromPartial(e.header)
                  : void 0),
              (r.valset =
                (null === (n = e.valset) || void 0 === n
                  ? void 0
                  : n.map((e) => t.Validator.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.CommissionRates = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.rate && t.uint32(10).string(e.rate),
            "" !== e.maxRate && t.uint32(18).string(e.maxRate),
            "" !== e.maxChangeRate && t.uint32(26).string(e.maxChangeRate),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { rate: "", maxRate: "", maxChangeRate: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.rate = n.string();
                  break;
                case 2:
                  i.maxRate = n.string();
                  break;
                case 3:
                  i.maxChangeRate = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            rate: y(e.rate) ? String(e.rate) : "",
            maxRate: y(e.maxRate) ? String(e.maxRate) : "",
            maxChangeRate: y(e.maxChangeRate) ? String(e.maxChangeRate) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.rate && (t.rate = e.rate),
              void 0 !== e.maxRate && (t.maxRate = e.maxRate),
              void 0 !== e.maxChangeRate && (t.maxChangeRate = e.maxChangeRate),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = { rate: "", maxRate: "", maxChangeRate: "" };
            return (
              (i.rate = null !== (t = e.rate) && void 0 !== t ? t : ""),
              (i.maxRate = null !== (n = e.maxRate) && void 0 !== n ? n : ""),
              (i.maxChangeRate =
                null !== (r = e.maxChangeRate) && void 0 !== r ? r : ""),
              i
            );
          },
        }),
        (t.Commission = {
          encode: (e, n = o.default.Writer.create()) => (
            void 0 !== e.commissionRates &&
              t.CommissionRates.encode(
                e.commissionRates,
                n.uint32(10).fork()
              ).ldelim(),
            void 0 !== e.updateTime &&
              s.Timestamp.encode(f(e.updateTime), n.uint32(18).fork()).ldelim(),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const a = { commissionRates: void 0, updateTime: void 0 };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  a.commissionRates = t.CommissionRates.decode(r, r.uint32());
                  break;
                case 2:
                  a.updateTime = g(s.Timestamp.decode(r, r.uint32()));
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return a;
          },
          fromJSON: (e) => ({
            commissionRates: y(e.commissionRates)
              ? t.CommissionRates.fromJSON(e.commissionRates)
              : void 0,
            updateTime: y(e.updateTime) ? m(e.updateTime) : void 0,
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.commissionRates &&
                (n.commissionRates = e.commissionRates
                  ? t.CommissionRates.toJSON(e.commissionRates)
                  : void 0),
              void 0 !== e.updateTime &&
                (n.updateTime = e.updateTime.toISOString()),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { commissionRates: void 0, updateTime: void 0 };
            return (
              (r.commissionRates =
                void 0 !== e.commissionRates && null !== e.commissionRates
                  ? t.CommissionRates.fromPartial(e.commissionRates)
                  : void 0),
              (r.updateTime =
                null !== (n = e.updateTime) && void 0 !== n ? n : void 0),
              r
            );
          },
        }),
        (t.Description = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.moniker && t.uint32(10).string(e.moniker),
            "" !== e.identity && t.uint32(18).string(e.identity),
            "" !== e.website && t.uint32(26).string(e.website),
            "" !== e.securityContact && t.uint32(34).string(e.securityContact),
            "" !== e.details && t.uint32(42).string(e.details),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              moniker: "",
              identity: "",
              website: "",
              securityContact: "",
              details: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.moniker = n.string();
                  break;
                case 2:
                  i.identity = n.string();
                  break;
                case 3:
                  i.website = n.string();
                  break;
                case 4:
                  i.securityContact = n.string();
                  break;
                case 5:
                  i.details = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            moniker: y(e.moniker) ? String(e.moniker) : "",
            identity: y(e.identity) ? String(e.identity) : "",
            website: y(e.website) ? String(e.website) : "",
            securityContact: y(e.securityContact)
              ? String(e.securityContact)
              : "",
            details: y(e.details) ? String(e.details) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.moniker && (t.moniker = e.moniker),
              void 0 !== e.identity && (t.identity = e.identity),
              void 0 !== e.website && (t.website = e.website),
              void 0 !== e.securityContact &&
                (t.securityContact = e.securityContact),
              void 0 !== e.details && (t.details = e.details),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i, o;
            const s = {
              moniker: "",
              identity: "",
              website: "",
              securityContact: "",
              details: "",
            };
            return (
              (s.moniker = null !== (t = e.moniker) && void 0 !== t ? t : ""),
              (s.identity = null !== (n = e.identity) && void 0 !== n ? n : ""),
              (s.website = null !== (r = e.website) && void 0 !== r ? r : ""),
              (s.securityContact =
                null !== (i = e.securityContact) && void 0 !== i ? i : ""),
              (s.details = null !== (o = e.details) && void 0 !== o ? o : ""),
              s
            );
          },
        }),
        (t.Validator = {
          encode: (e, n = o.default.Writer.create()) => (
            "" !== e.operatorAddress && n.uint32(10).string(e.operatorAddress),
            void 0 !== e.consensusPubkey &&
              d.Any.encode(e.consensusPubkey, n.uint32(18).fork()).ldelim(),
            !0 === e.jailed && n.uint32(24).bool(e.jailed),
            0 !== e.status && n.uint32(32).int32(e.status),
            "" !== e.tokens && n.uint32(42).string(e.tokens),
            "" !== e.delegatorShares && n.uint32(50).string(e.delegatorShares),
            void 0 !== e.description &&
              t.Description.encode(e.description, n.uint32(58).fork()).ldelim(),
            "0" !== e.unbondingHeight && n.uint32(64).int64(e.unbondingHeight),
            void 0 !== e.unbondingTime &&
              s.Timestamp.encode(
                f(e.unbondingTime),
                n.uint32(74).fork()
              ).ldelim(),
            void 0 !== e.commission &&
              t.Commission.encode(e.commission, n.uint32(82).fork()).ldelim(),
            "" !== e.minSelfDelegation &&
              n.uint32(90).string(e.minSelfDelegation),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const a = {
              operatorAddress: "",
              consensusPubkey: void 0,
              jailed: !1,
              status: 0,
              tokens: "",
              delegatorShares: "",
              description: void 0,
              unbondingHeight: "0",
              unbondingTime: void 0,
              commission: void 0,
              minSelfDelegation: "",
            };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  a.operatorAddress = r.string();
                  break;
                case 2:
                  a.consensusPubkey = d.Any.decode(r, r.uint32());
                  break;
                case 3:
                  a.jailed = r.bool();
                  break;
                case 4:
                  a.status = r.int32();
                  break;
                case 5:
                  a.tokens = r.string();
                  break;
                case 6:
                  a.delegatorShares = r.string();
                  break;
                case 7:
                  a.description = t.Description.decode(r, r.uint32());
                  break;
                case 8:
                  a.unbondingHeight = v(r.int64());
                  break;
                case 9:
                  a.unbondingTime = g(s.Timestamp.decode(r, r.uint32()));
                  break;
                case 10:
                  a.commission = t.Commission.decode(r, r.uint32());
                  break;
                case 11:
                  a.minSelfDelegation = r.string();
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return a;
          },
          fromJSON: (e) => ({
            operatorAddress: y(e.operatorAddress)
              ? String(e.operatorAddress)
              : "",
            consensusPubkey: y(e.consensusPubkey)
              ? d.Any.fromJSON(e.consensusPubkey)
              : void 0,
            jailed: !!y(e.jailed) && Boolean(e.jailed),
            status: y(e.status) ? h(e.status) : 0,
            tokens: y(e.tokens) ? String(e.tokens) : "",
            delegatorShares: y(e.delegatorShares)
              ? String(e.delegatorShares)
              : "",
            description: y(e.description)
              ? t.Description.fromJSON(e.description)
              : void 0,
            unbondingHeight: y(e.unbondingHeight)
              ? String(e.unbondingHeight)
              : "0",
            unbondingTime: y(e.unbondingTime) ? m(e.unbondingTime) : void 0,
            commission: y(e.commission)
              ? t.Commission.fromJSON(e.commission)
              : void 0,
            minSelfDelegation: y(e.minSelfDelegation)
              ? String(e.minSelfDelegation)
              : "",
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.operatorAddress &&
                (n.operatorAddress = e.operatorAddress),
              void 0 !== e.consensusPubkey &&
                (n.consensusPubkey = e.consensusPubkey
                  ? d.Any.toJSON(e.consensusPubkey)
                  : void 0),
              void 0 !== e.jailed && (n.jailed = e.jailed),
              void 0 !== e.status && (n.status = p(e.status)),
              void 0 !== e.tokens && (n.tokens = e.tokens),
              void 0 !== e.delegatorShares &&
                (n.delegatorShares = e.delegatorShares),
              void 0 !== e.description &&
                (n.description = e.description
                  ? t.Description.toJSON(e.description)
                  : void 0),
              void 0 !== e.unbondingHeight &&
                (n.unbondingHeight = e.unbondingHeight),
              void 0 !== e.unbondingTime &&
                (n.unbondingTime = e.unbondingTime.toISOString()),
              void 0 !== e.commission &&
                (n.commission = e.commission
                  ? t.Commission.toJSON(e.commission)
                  : void 0),
              void 0 !== e.minSelfDelegation &&
                (n.minSelfDelegation = e.minSelfDelegation),
              n
            );
          },
          fromPartial(e) {
            var n, r, i, o, s, a, c, u;
            const l = {
              operatorAddress: "",
              consensusPubkey: void 0,
              jailed: !1,
              status: 0,
              tokens: "",
              delegatorShares: "",
              description: void 0,
              unbondingHeight: "0",
              unbondingTime: void 0,
              commission: void 0,
              minSelfDelegation: "",
            };
            return (
              (l.operatorAddress =
                null !== (n = e.operatorAddress) && void 0 !== n ? n : ""),
              (l.consensusPubkey =
                void 0 !== e.consensusPubkey && null !== e.consensusPubkey
                  ? d.Any.fromPartial(e.consensusPubkey)
                  : void 0),
              (l.jailed = null !== (r = e.jailed) && void 0 !== r && r),
              (l.status = null !== (i = e.status) && void 0 !== i ? i : 0),
              (l.tokens = null !== (o = e.tokens) && void 0 !== o ? o : ""),
              (l.delegatorShares =
                null !== (s = e.delegatorShares) && void 0 !== s ? s : ""),
              (l.description =
                void 0 !== e.description && null !== e.description
                  ? t.Description.fromPartial(e.description)
                  : void 0),
              (l.unbondingHeight =
                null !== (a = e.unbondingHeight) && void 0 !== a ? a : "0"),
              (l.unbondingTime =
                null !== (c = e.unbondingTime) && void 0 !== c ? c : void 0),
              (l.commission =
                void 0 !== e.commission && null !== e.commission
                  ? t.Commission.fromPartial(e.commission)
                  : void 0),
              (l.minSelfDelegation =
                null !== (u = e.minSelfDelegation) && void 0 !== u ? u : ""),
              l
            );
          },
        }),
        (t.ValAddresses = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.addresses) t.uint32(10).string(n);
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { addresses: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.addresses.push(n.string());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            addresses: Array.isArray(null == e ? void 0 : e.addresses)
              ? e.addresses.map((e) => String(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.addresses
                ? (t.addresses = e.addresses.map((e) => e))
                : (t.addresses = []),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { addresses: [] };
            return (
              (n.addresses =
                (null === (t = e.addresses) || void 0 === t
                  ? void 0
                  : t.map((e) => e)) || []),
              n
            );
          },
        }),
        (t.DVPair = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { delegatorAddress: "", validatorAddress: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: y(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: y(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { delegatorAddress: "", validatorAddress: "" };
            return (
              (r.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (r.validatorAddress =
                null !== (n = e.validatorAddress) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.DVPairs = {
          encode(e, n = o.default.Writer.create()) {
            for (const r of e.pairs)
              t.DVPair.encode(r, n.uint32(10).fork()).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { pairs: [] };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.pairs.push(t.DVPair.decode(r, r.uint32()));
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            pairs: Array.isArray(null == e ? void 0 : e.pairs)
              ? e.pairs.map((e) => t.DVPair.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              e.pairs
                ? (n.pairs = e.pairs.map((e) =>
                    e ? t.DVPair.toJSON(e) : void 0
                  ))
                : (n.pairs = []),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { pairs: [] };
            return (
              (r.pairs =
                (null === (n = e.pairs) || void 0 === n
                  ? void 0
                  : n.map((e) => t.DVPair.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.DVVTriplet = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorSrcAddress &&
              t.uint32(18).string(e.validatorSrcAddress),
            "" !== e.validatorDstAddress &&
              t.uint32(26).string(e.validatorDstAddress),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorSrcAddress = n.string();
                  break;
                case 3:
                  i.validatorDstAddress = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: y(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorSrcAddress: y(e.validatorSrcAddress)
              ? String(e.validatorSrcAddress)
              : "",
            validatorDstAddress: y(e.validatorDstAddress)
              ? String(e.validatorDstAddress)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorSrcAddress &&
                (t.validatorSrcAddress = e.validatorSrcAddress),
              void 0 !== e.validatorDstAddress &&
                (t.validatorDstAddress = e.validatorDstAddress),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
            };
            return (
              (i.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (i.validatorSrcAddress =
                null !== (n = e.validatorSrcAddress) && void 0 !== n ? n : ""),
              (i.validatorDstAddress =
                null !== (r = e.validatorDstAddress) && void 0 !== r ? r : ""),
              i
            );
          },
        }),
        (t.DVVTriplets = {
          encode(e, n = o.default.Writer.create()) {
            for (const r of e.triplets)
              t.DVVTriplet.encode(r, n.uint32(10).fork()).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { triplets: [] };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.triplets.push(t.DVVTriplet.decode(r, r.uint32()));
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            triplets: Array.isArray(null == e ? void 0 : e.triplets)
              ? e.triplets.map((e) => t.DVVTriplet.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              e.triplets
                ? (n.triplets = e.triplets.map((e) =>
                    e ? t.DVVTriplet.toJSON(e) : void 0
                  ))
                : (n.triplets = []),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { triplets: [] };
            return (
              (r.triplets =
                (null === (n = e.triplets) || void 0 === n
                  ? void 0
                  : n.map((e) => t.DVVTriplet.fromPartial(e))) || []),
              r
            );
          },
        }),
        (t.Delegation = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.delegatorAddress &&
              t.uint32(10).string(e.delegatorAddress),
            "" !== e.validatorAddress &&
              t.uint32(18).string(e.validatorAddress),
            "" !== e.shares && t.uint32(26).string(e.shares),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              delegatorAddress: "",
              validatorAddress: "",
              shares: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.delegatorAddress = n.string();
                  break;
                case 2:
                  i.validatorAddress = n.string();
                  break;
                case 3:
                  i.shares = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            delegatorAddress: y(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: y(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            shares: y(e.shares) ? String(e.shares) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.delegatorAddress &&
                (t.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (t.validatorAddress = e.validatorAddress),
              void 0 !== e.shares && (t.shares = e.shares),
              t
            );
          },
          fromPartial(e) {
            var t, n, r;
            const i = {
              delegatorAddress: "",
              validatorAddress: "",
              shares: "",
            };
            return (
              (i.delegatorAddress =
                null !== (t = e.delegatorAddress) && void 0 !== t ? t : ""),
              (i.validatorAddress =
                null !== (n = e.validatorAddress) && void 0 !== n ? n : ""),
              (i.shares = null !== (r = e.shares) && void 0 !== r ? r : ""),
              i
            );
          },
        }),
        (t.UnbondingDelegation = {
          encode(e, n = o.default.Writer.create()) {
            "" !== e.delegatorAddress &&
              n.uint32(10).string(e.delegatorAddress),
              "" !== e.validatorAddress &&
                n.uint32(18).string(e.validatorAddress);
            for (const r of e.entries)
              t.UnbondingDelegationEntry.encode(
                r,
                n.uint32(26).fork()
              ).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = {
              delegatorAddress: "",
              validatorAddress: "",
              entries: [],
            };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.delegatorAddress = r.string();
                  break;
                case 2:
                  s.validatorAddress = r.string();
                  break;
                case 3:
                  s.entries.push(
                    t.UnbondingDelegationEntry.decode(r, r.uint32())
                  );
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            delegatorAddress: y(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorAddress: y(e.validatorAddress)
              ? String(e.validatorAddress)
              : "",
            entries: Array.isArray(null == e ? void 0 : e.entries)
              ? e.entries.map((e) => t.UnbondingDelegationEntry.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.delegatorAddress &&
                (n.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorAddress &&
                (n.validatorAddress = e.validatorAddress),
              e.entries
                ? (n.entries = e.entries.map((e) =>
                    e ? t.UnbondingDelegationEntry.toJSON(e) : void 0
                  ))
                : (n.entries = []),
              n
            );
          },
          fromPartial(e) {
            var n, r, i;
            const o = {
              delegatorAddress: "",
              validatorAddress: "",
              entries: [],
            };
            return (
              (o.delegatorAddress =
                null !== (n = e.delegatorAddress) && void 0 !== n ? n : ""),
              (o.validatorAddress =
                null !== (r = e.validatorAddress) && void 0 !== r ? r : ""),
              (o.entries =
                (null === (i = e.entries) || void 0 === i
                  ? void 0
                  : i.map((e) => t.UnbondingDelegationEntry.fromPartial(e))) ||
                []),
              o
            );
          },
        }),
        (t.UnbondingDelegationEntry = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.creationHeight && t.uint32(8).int64(e.creationHeight),
            void 0 !== e.completionTime &&
              s.Timestamp.encode(
                f(e.completionTime),
                t.uint32(18).fork()
              ).ldelim(),
            "" !== e.initialBalance && t.uint32(26).string(e.initialBalance),
            "" !== e.balance && t.uint32(34).string(e.balance),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              creationHeight: "0",
              completionTime: void 0,
              initialBalance: "",
              balance: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.creationHeight = v(n.int64());
                  break;
                case 2:
                  i.completionTime = g(s.Timestamp.decode(n, n.uint32()));
                  break;
                case 3:
                  i.initialBalance = n.string();
                  break;
                case 4:
                  i.balance = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            creationHeight: y(e.creationHeight)
              ? String(e.creationHeight)
              : "0",
            completionTime: y(e.completionTime) ? m(e.completionTime) : void 0,
            initialBalance: y(e.initialBalance) ? String(e.initialBalance) : "",
            balance: y(e.balance) ? String(e.balance) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.creationHeight &&
                (t.creationHeight = e.creationHeight),
              void 0 !== e.completionTime &&
                (t.completionTime = e.completionTime.toISOString()),
              void 0 !== e.initialBalance &&
                (t.initialBalance = e.initialBalance),
              void 0 !== e.balance && (t.balance = e.balance),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i;
            const o = {
              creationHeight: "0",
              completionTime: void 0,
              initialBalance: "",
              balance: "",
            };
            return (
              (o.creationHeight =
                null !== (t = e.creationHeight) && void 0 !== t ? t : "0"),
              (o.completionTime =
                null !== (n = e.completionTime) && void 0 !== n ? n : void 0),
              (o.initialBalance =
                null !== (r = e.initialBalance) && void 0 !== r ? r : ""),
              (o.balance = null !== (i = e.balance) && void 0 !== i ? i : ""),
              o
            );
          },
        }),
        (t.RedelegationEntry = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.creationHeight && t.uint32(8).int64(e.creationHeight),
            void 0 !== e.completionTime &&
              s.Timestamp.encode(
                f(e.completionTime),
                t.uint32(18).fork()
              ).ldelim(),
            "" !== e.initialBalance && t.uint32(26).string(e.initialBalance),
            "" !== e.sharesDst && t.uint32(34).string(e.sharesDst),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              creationHeight: "0",
              completionTime: void 0,
              initialBalance: "",
              sharesDst: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.creationHeight = v(n.int64());
                  break;
                case 2:
                  i.completionTime = g(s.Timestamp.decode(n, n.uint32()));
                  break;
                case 3:
                  i.initialBalance = n.string();
                  break;
                case 4:
                  i.sharesDst = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            creationHeight: y(e.creationHeight)
              ? String(e.creationHeight)
              : "0",
            completionTime: y(e.completionTime) ? m(e.completionTime) : void 0,
            initialBalance: y(e.initialBalance) ? String(e.initialBalance) : "",
            sharesDst: y(e.sharesDst) ? String(e.sharesDst) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.creationHeight &&
                (t.creationHeight = e.creationHeight),
              void 0 !== e.completionTime &&
                (t.completionTime = e.completionTime.toISOString()),
              void 0 !== e.initialBalance &&
                (t.initialBalance = e.initialBalance),
              void 0 !== e.sharesDst && (t.sharesDst = e.sharesDst),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i;
            const o = {
              creationHeight: "0",
              completionTime: void 0,
              initialBalance: "",
              sharesDst: "",
            };
            return (
              (o.creationHeight =
                null !== (t = e.creationHeight) && void 0 !== t ? t : "0"),
              (o.completionTime =
                null !== (n = e.completionTime) && void 0 !== n ? n : void 0),
              (o.initialBalance =
                null !== (r = e.initialBalance) && void 0 !== r ? r : ""),
              (o.sharesDst =
                null !== (i = e.sharesDst) && void 0 !== i ? i : ""),
              o
            );
          },
        }),
        (t.Redelegation = {
          encode(e, n = o.default.Writer.create()) {
            "" !== e.delegatorAddress &&
              n.uint32(10).string(e.delegatorAddress),
              "" !== e.validatorSrcAddress &&
                n.uint32(18).string(e.validatorSrcAddress),
              "" !== e.validatorDstAddress &&
                n.uint32(26).string(e.validatorDstAddress);
            for (const r of e.entries)
              t.RedelegationEntry.encode(r, n.uint32(34).fork()).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
              entries: [],
            };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.delegatorAddress = r.string();
                  break;
                case 2:
                  s.validatorSrcAddress = r.string();
                  break;
                case 3:
                  s.validatorDstAddress = r.string();
                  break;
                case 4:
                  s.entries.push(t.RedelegationEntry.decode(r, r.uint32()));
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            delegatorAddress: y(e.delegatorAddress)
              ? String(e.delegatorAddress)
              : "",
            validatorSrcAddress: y(e.validatorSrcAddress)
              ? String(e.validatorSrcAddress)
              : "",
            validatorDstAddress: y(e.validatorDstAddress)
              ? String(e.validatorDstAddress)
              : "",
            entries: Array.isArray(null == e ? void 0 : e.entries)
              ? e.entries.map((e) => t.RedelegationEntry.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.delegatorAddress &&
                (n.delegatorAddress = e.delegatorAddress),
              void 0 !== e.validatorSrcAddress &&
                (n.validatorSrcAddress = e.validatorSrcAddress),
              void 0 !== e.validatorDstAddress &&
                (n.validatorDstAddress = e.validatorDstAddress),
              e.entries
                ? (n.entries = e.entries.map((e) =>
                    e ? t.RedelegationEntry.toJSON(e) : void 0
                  ))
                : (n.entries = []),
              n
            );
          },
          fromPartial(e) {
            var n, r, i, o;
            const s = {
              delegatorAddress: "",
              validatorSrcAddress: "",
              validatorDstAddress: "",
              entries: [],
            };
            return (
              (s.delegatorAddress =
                null !== (n = e.delegatorAddress) && void 0 !== n ? n : ""),
              (s.validatorSrcAddress =
                null !== (r = e.validatorSrcAddress) && void 0 !== r ? r : ""),
              (s.validatorDstAddress =
                null !== (i = e.validatorDstAddress) && void 0 !== i ? i : ""),
              (s.entries =
                (null === (o = e.entries) || void 0 === o
                  ? void 0
                  : o.map((e) => t.RedelegationEntry.fromPartial(e))) || []),
              s
            );
          },
        }),
        (t.Params = {
          encode: (e, t = o.default.Writer.create()) => (
            void 0 !== e.unbondingTime &&
              c.Duration.encode(e.unbondingTime, t.uint32(10).fork()).ldelim(),
            0 !== e.maxValidators && t.uint32(16).uint32(e.maxValidators),
            0 !== e.maxEntries && t.uint32(24).uint32(e.maxEntries),
            0 !== e.historicalEntries &&
              t.uint32(32).uint32(e.historicalEntries),
            "" !== e.bondDenom && t.uint32(42).string(e.bondDenom),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              unbondingTime: void 0,
              maxValidators: 0,
              maxEntries: 0,
              historicalEntries: 0,
              bondDenom: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.unbondingTime = c.Duration.decode(n, n.uint32());
                  break;
                case 2:
                  i.maxValidators = n.uint32();
                  break;
                case 3:
                  i.maxEntries = n.uint32();
                  break;
                case 4:
                  i.historicalEntries = n.uint32();
                  break;
                case 5:
                  i.bondDenom = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            unbondingTime: y(e.unbondingTime)
              ? c.Duration.fromJSON(e.unbondingTime)
              : void 0,
            maxValidators: y(e.maxValidators) ? Number(e.maxValidators) : 0,
            maxEntries: y(e.maxEntries) ? Number(e.maxEntries) : 0,
            historicalEntries: y(e.historicalEntries)
              ? Number(e.historicalEntries)
              : 0,
            bondDenom: y(e.bondDenom) ? String(e.bondDenom) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.unbondingTime &&
                (t.unbondingTime = e.unbondingTime
                  ? c.Duration.toJSON(e.unbondingTime)
                  : void 0),
              void 0 !== e.maxValidators &&
                (t.maxValidators = Math.round(e.maxValidators)),
              void 0 !== e.maxEntries &&
                (t.maxEntries = Math.round(e.maxEntries)),
              void 0 !== e.historicalEntries &&
                (t.historicalEntries = Math.round(e.historicalEntries)),
              void 0 !== e.bondDenom && (t.bondDenom = e.bondDenom),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i;
            const o = {
              unbondingTime: void 0,
              maxValidators: 0,
              maxEntries: 0,
              historicalEntries: 0,
              bondDenom: "",
            };
            return (
              (o.unbondingTime =
                void 0 !== e.unbondingTime && null !== e.unbondingTime
                  ? c.Duration.fromPartial(e.unbondingTime)
                  : void 0),
              (o.maxValidators =
                null !== (t = e.maxValidators) && void 0 !== t ? t : 0),
              (o.maxEntries =
                null !== (n = e.maxEntries) && void 0 !== n ? n : 0),
              (o.historicalEntries =
                null !== (r = e.historicalEntries) && void 0 !== r ? r : 0),
              (o.bondDenom =
                null !== (i = e.bondDenom) && void 0 !== i ? i : ""),
              o
            );
          },
        }),
        (t.DelegationResponse = {
          encode: (e, n = o.default.Writer.create()) => (
            void 0 !== e.delegation &&
              t.Delegation.encode(e.delegation, n.uint32(10).fork()).ldelim(),
            void 0 !== e.balance &&
              u.Coin.encode(e.balance, n.uint32(18).fork()).ldelim(),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { delegation: void 0, balance: void 0 };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.delegation = t.Delegation.decode(r, r.uint32());
                  break;
                case 2:
                  s.balance = u.Coin.decode(r, r.uint32());
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            delegation: y(e.delegation)
              ? t.Delegation.fromJSON(e.delegation)
              : void 0,
            balance: y(e.balance) ? u.Coin.fromJSON(e.balance) : void 0,
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.delegation &&
                (n.delegation = e.delegation
                  ? t.Delegation.toJSON(e.delegation)
                  : void 0),
              void 0 !== e.balance &&
                (n.balance = e.balance ? u.Coin.toJSON(e.balance) : void 0),
              n
            );
          },
          fromPartial(e) {
            const n = { delegation: void 0, balance: void 0 };
            return (
              (n.delegation =
                void 0 !== e.delegation && null !== e.delegation
                  ? t.Delegation.fromPartial(e.delegation)
                  : void 0),
              (n.balance =
                void 0 !== e.balance && null !== e.balance
                  ? u.Coin.fromPartial(e.balance)
                  : void 0),
              n
            );
          },
        }),
        (t.RedelegationEntryResponse = {
          encode: (e, n = o.default.Writer.create()) => (
            void 0 !== e.redelegationEntry &&
              t.RedelegationEntry.encode(
                e.redelegationEntry,
                n.uint32(10).fork()
              ).ldelim(),
            "" !== e.balance && n.uint32(34).string(e.balance),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { redelegationEntry: void 0, balance: "" };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.redelegationEntry = t.RedelegationEntry.decode(
                    r,
                    r.uint32()
                  );
                  break;
                case 4:
                  s.balance = r.string();
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            redelegationEntry: y(e.redelegationEntry)
              ? t.RedelegationEntry.fromJSON(e.redelegationEntry)
              : void 0,
            balance: y(e.balance) ? String(e.balance) : "",
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.redelegationEntry &&
                (n.redelegationEntry = e.redelegationEntry
                  ? t.RedelegationEntry.toJSON(e.redelegationEntry)
                  : void 0),
              void 0 !== e.balance && (n.balance = e.balance),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { redelegationEntry: void 0, balance: "" };
            return (
              (r.redelegationEntry =
                void 0 !== e.redelegationEntry && null !== e.redelegationEntry
                  ? t.RedelegationEntry.fromPartial(e.redelegationEntry)
                  : void 0),
              (r.balance = null !== (n = e.balance) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.RedelegationResponse = {
          encode(e, n = o.default.Writer.create()) {
            void 0 !== e.redelegation &&
              t.Redelegation.encode(
                e.redelegation,
                n.uint32(10).fork()
              ).ldelim();
            for (const r of e.entries)
              t.RedelegationEntryResponse.encode(
                r,
                n.uint32(18).fork()
              ).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { redelegation: void 0, entries: [] };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.redelegation = t.Redelegation.decode(r, r.uint32());
                  break;
                case 2:
                  s.entries.push(
                    t.RedelegationEntryResponse.decode(r, r.uint32())
                  );
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            redelegation: y(e.redelegation)
              ? t.Redelegation.fromJSON(e.redelegation)
              : void 0,
            entries: Array.isArray(null == e ? void 0 : e.entries)
              ? e.entries.map((e) => t.RedelegationEntryResponse.fromJSON(e))
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.redelegation &&
                (n.redelegation = e.redelegation
                  ? t.Redelegation.toJSON(e.redelegation)
                  : void 0),
              e.entries
                ? (n.entries = e.entries.map((e) =>
                    e ? t.RedelegationEntryResponse.toJSON(e) : void 0
                  ))
                : (n.entries = []),
              n
            );
          },
          fromPartial(e) {
            var n;
            const r = { redelegation: void 0, entries: [] };
            return (
              (r.redelegation =
                void 0 !== e.redelegation && null !== e.redelegation
                  ? t.Redelegation.fromPartial(e.redelegation)
                  : void 0),
              (r.entries =
                (null === (n = e.entries) || void 0 === n
                  ? void 0
                  : n.map((e) => t.RedelegationEntryResponse.fromPartial(e))) ||
                []),
              r
            );
          },
        }),
        (t.Pool = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.notBondedTokens && t.uint32(10).string(e.notBondedTokens),
            "" !== e.bondedTokens && t.uint32(18).string(e.bondedTokens),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { notBondedTokens: "", bondedTokens: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.notBondedTokens = n.string();
                  break;
                case 2:
                  i.bondedTokens = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            notBondedTokens: y(e.notBondedTokens)
              ? String(e.notBondedTokens)
              : "",
            bondedTokens: y(e.bondedTokens) ? String(e.bondedTokens) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.notBondedTokens &&
                (t.notBondedTokens = e.notBondedTokens),
              void 0 !== e.bondedTokens && (t.bondedTokens = e.bondedTokens),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { notBondedTokens: "", bondedTokens: "" };
            return (
              (r.notBondedTokens =
                null !== (t = e.notBondedTokens) && void 0 !== t ? t : ""),
              (r.bondedTokens =
                null !== (n = e.bondedTokens) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    745: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.TxProof =
            t.BlockMeta =
            t.LightBlock =
            t.SignedHeader =
            t.Proposal =
            t.CommitSig =
            t.Commit =
            t.Vote =
            t.Data =
            t.Header =
            t.BlockID =
            t.Part =
            t.PartSetHeader =
            t.signedMsgTypeToJSON =
            t.signedMsgTypeFromJSON =
            t.SignedMsgType =
            t.blockIDFlagToJSON =
            t.blockIDFlagFromJSON =
            t.BlockIDFlag =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(157),
          a = n(746),
          d = n(747),
          c = n(748);
        var u, l;
        function h(e) {
          switch (e) {
            case 0:
            case "BLOCK_ID_FLAG_UNKNOWN":
              return u.BLOCK_ID_FLAG_UNKNOWN;
            case 1:
            case "BLOCK_ID_FLAG_ABSENT":
              return u.BLOCK_ID_FLAG_ABSENT;
            case 2:
            case "BLOCK_ID_FLAG_COMMIT":
              return u.BLOCK_ID_FLAG_COMMIT;
            case 3:
            case "BLOCK_ID_FLAG_NIL":
              return u.BLOCK_ID_FLAG_NIL;
            case -1:
            case "UNRECOGNIZED":
            default:
              return u.UNRECOGNIZED;
          }
        }
        function p(e) {
          switch (e) {
            case u.BLOCK_ID_FLAG_UNKNOWN:
              return "BLOCK_ID_FLAG_UNKNOWN";
            case u.BLOCK_ID_FLAG_ABSENT:
              return "BLOCK_ID_FLAG_ABSENT";
            case u.BLOCK_ID_FLAG_COMMIT:
              return "BLOCK_ID_FLAG_COMMIT";
            case u.BLOCK_ID_FLAG_NIL:
              return "BLOCK_ID_FLAG_NIL";
            default:
              return "UNKNOWN";
          }
        }
        function f(e) {
          switch (e) {
            case 0:
            case "SIGNED_MSG_TYPE_UNKNOWN":
              return l.SIGNED_MSG_TYPE_UNKNOWN;
            case 1:
            case "SIGNED_MSG_TYPE_PREVOTE":
              return l.SIGNED_MSG_TYPE_PREVOTE;
            case 2:
            case "SIGNED_MSG_TYPE_PRECOMMIT":
              return l.SIGNED_MSG_TYPE_PRECOMMIT;
            case 32:
            case "SIGNED_MSG_TYPE_PROPOSAL":
              return l.SIGNED_MSG_TYPE_PROPOSAL;
            case -1:
            case "UNRECOGNIZED":
            default:
              return l.UNRECOGNIZED;
          }
        }
        function g(e) {
          switch (e) {
            case l.SIGNED_MSG_TYPE_UNKNOWN:
              return "SIGNED_MSG_TYPE_UNKNOWN";
            case l.SIGNED_MSG_TYPE_PREVOTE:
              return "SIGNED_MSG_TYPE_PREVOTE";
            case l.SIGNED_MSG_TYPE_PRECOMMIT:
              return "SIGNED_MSG_TYPE_PRECOMMIT";
            case l.SIGNED_MSG_TYPE_PROPOSAL:
              return "SIGNED_MSG_TYPE_PROPOSAL";
            default:
              return "UNKNOWN";
          }
        }
        function m() {
          return { total: 0, hash: new Uint8Array() };
        }
        function v() {
          return { index: 0, bytes: new Uint8Array(), proof: void 0 };
        }
        function y() {
          return { hash: new Uint8Array(), partSetHeader: void 0 };
        }
        function b() {
          return {
            version: void 0,
            chainId: "",
            height: "0",
            time: void 0,
            lastBlockId: void 0,
            lastCommitHash: new Uint8Array(),
            dataHash: new Uint8Array(),
            validatorsHash: new Uint8Array(),
            nextValidatorsHash: new Uint8Array(),
            consensusHash: new Uint8Array(),
            appHash: new Uint8Array(),
            lastResultsHash: new Uint8Array(),
            evidenceHash: new Uint8Array(),
            proposerAddress: new Uint8Array(),
          };
        }
        function S() {
          return {
            type: 0,
            height: "0",
            round: 0,
            blockId: void 0,
            timestamp: void 0,
            validatorAddress: new Uint8Array(),
            validatorIndex: 0,
            signature: new Uint8Array(),
          };
        }
        function O() {
          return {
            blockIdFlag: 0,
            validatorAddress: new Uint8Array(),
            timestamp: void 0,
            signature: new Uint8Array(),
          };
        }
        function _() {
          return {
            type: 0,
            height: "0",
            round: 0,
            polRound: 0,
            blockId: void 0,
            timestamp: void 0,
            signature: new Uint8Array(),
          };
        }
        function w() {
          return {
            rootHash: new Uint8Array(),
            data: new Uint8Array(),
            proof: void 0,
          };
        }
        (t.protobufPackage = "tendermint.types"),
          (function (e) {
            (e[(e.BLOCK_ID_FLAG_UNKNOWN = 0)] = "BLOCK_ID_FLAG_UNKNOWN"),
              (e[(e.BLOCK_ID_FLAG_ABSENT = 1)] = "BLOCK_ID_FLAG_ABSENT"),
              (e[(e.BLOCK_ID_FLAG_COMMIT = 2)] = "BLOCK_ID_FLAG_COMMIT"),
              (e[(e.BLOCK_ID_FLAG_NIL = 3)] = "BLOCK_ID_FLAG_NIL"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((u = t.BlockIDFlag || (t.BlockIDFlag = {}))),
          (t.blockIDFlagFromJSON = h),
          (t.blockIDFlagToJSON = p),
          (function (e) {
            (e[(e.SIGNED_MSG_TYPE_UNKNOWN = 0)] = "SIGNED_MSG_TYPE_UNKNOWN"),
              (e[(e.SIGNED_MSG_TYPE_PREVOTE = 1)] = "SIGNED_MSG_TYPE_PREVOTE"),
              (e[(e.SIGNED_MSG_TYPE_PRECOMMIT = 2)] =
                "SIGNED_MSG_TYPE_PRECOMMIT"),
              (e[(e.SIGNED_MSG_TYPE_PROPOSAL = 32)] =
                "SIGNED_MSG_TYPE_PROPOSAL"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((l = t.SignedMsgType || (t.SignedMsgType = {}))),
          (t.signedMsgTypeFromJSON = f),
          (t.signedMsgTypeToJSON = g),
          (t.PartSetHeader = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.total && t.uint32(8).uint32(e.total),
              0 !== e.hash.length && t.uint32(18).bytes(e.hash),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = m();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.total = n.uint32();
                    break;
                  case 2:
                    i.hash = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              total: E(e.total) ? Number(e.total) : 0,
              hash: E(e.hash) ? A(e.hash) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.total && (t.total = Math.round(e.total)),
                void 0 !== e.hash &&
                  (t.hash = k(void 0 !== e.hash ? e.hash : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = m();
              return (
                (r.total = null !== (t = e.total) && void 0 !== t ? t : 0),
                (r.hash =
                  null !== (n = e.hash) && void 0 !== n ? n : new Uint8Array()),
                r
              );
            },
          }),
          (t.Part = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.index && t.uint32(8).uint32(e.index),
              0 !== e.bytes.length && t.uint32(18).bytes(e.bytes),
              void 0 !== e.proof &&
                a.Proof.encode(e.proof, t.uint32(26).fork()).ldelim(),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = v();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.index = n.uint32();
                    break;
                  case 2:
                    i.bytes = n.bytes();
                    break;
                  case 3:
                    i.proof = a.Proof.decode(n, n.uint32());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              index: E(e.index) ? Number(e.index) : 0,
              bytes: E(e.bytes) ? A(e.bytes) : new Uint8Array(),
              proof: E(e.proof) ? a.Proof.fromJSON(e.proof) : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.index && (t.index = Math.round(e.index)),
                void 0 !== e.bytes &&
                  (t.bytes = k(
                    void 0 !== e.bytes ? e.bytes : new Uint8Array()
                  )),
                void 0 !== e.proof &&
                  (t.proof = e.proof ? a.Proof.toJSON(e.proof) : void 0),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = v();
              return (
                (r.index = null !== (t = e.index) && void 0 !== t ? t : 0),
                (r.bytes =
                  null !== (n = e.bytes) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (r.proof =
                  void 0 !== e.proof && null !== e.proof
                    ? a.Proof.fromPartial(e.proof)
                    : void 0),
                r
              );
            },
          }),
          (t.BlockID = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.hash.length && n.uint32(10).bytes(e.hash),
              void 0 !== e.partSetHeader &&
                t.PartSetHeader.encode(
                  e.partSetHeader,
                  n.uint32(18).fork()
                ).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = y();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.hash = r.bytes();
                    break;
                  case 2:
                    s.partSetHeader = t.PartSetHeader.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              hash: E(e.hash) ? A(e.hash) : new Uint8Array(),
              partSetHeader: E(e.partSetHeader)
                ? t.PartSetHeader.fromJSON(e.partSetHeader)
                : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.hash &&
                  (n.hash = k(void 0 !== e.hash ? e.hash : new Uint8Array())),
                void 0 !== e.partSetHeader &&
                  (n.partSetHeader = e.partSetHeader
                    ? t.PartSetHeader.toJSON(e.partSetHeader)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = y();
              return (
                (r.hash =
                  null !== (n = e.hash) && void 0 !== n ? n : new Uint8Array()),
                (r.partSetHeader =
                  void 0 !== e.partSetHeader && null !== e.partSetHeader
                    ? t.PartSetHeader.fromPartial(e.partSetHeader)
                    : void 0),
                r
              );
            },
          }),
          (t.Header = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.version &&
                d.Consensus.encode(e.version, n.uint32(10).fork()).ldelim(),
              "" !== e.chainId && n.uint32(18).string(e.chainId),
              "0" !== e.height && n.uint32(24).int64(e.height),
              void 0 !== e.time &&
                s.Timestamp.encode(T(e.time), n.uint32(34).fork()).ldelim(),
              void 0 !== e.lastBlockId &&
                t.BlockID.encode(e.lastBlockId, n.uint32(42).fork()).ldelim(),
              0 !== e.lastCommitHash.length &&
                n.uint32(50).bytes(e.lastCommitHash),
              0 !== e.dataHash.length && n.uint32(58).bytes(e.dataHash),
              0 !== e.validatorsHash.length &&
                n.uint32(66).bytes(e.validatorsHash),
              0 !== e.nextValidatorsHash.length &&
                n.uint32(74).bytes(e.nextValidatorsHash),
              0 !== e.consensusHash.length &&
                n.uint32(82).bytes(e.consensusHash),
              0 !== e.appHash.length && n.uint32(90).bytes(e.appHash),
              0 !== e.lastResultsHash.length &&
                n.uint32(98).bytes(e.lastResultsHash),
              0 !== e.evidenceHash.length &&
                n.uint32(106).bytes(e.evidenceHash),
              0 !== e.proposerAddress.length &&
                n.uint32(114).bytes(e.proposerAddress),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const a = b();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    a.version = d.Consensus.decode(r, r.uint32());
                    break;
                  case 2:
                    a.chainId = r.string();
                    break;
                  case 3:
                    a.height = N(r.int64());
                    break;
                  case 4:
                    a.time = D(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 5:
                    a.lastBlockId = t.BlockID.decode(r, r.uint32());
                    break;
                  case 6:
                    a.lastCommitHash = r.bytes();
                    break;
                  case 7:
                    a.dataHash = r.bytes();
                    break;
                  case 8:
                    a.validatorsHash = r.bytes();
                    break;
                  case 9:
                    a.nextValidatorsHash = r.bytes();
                    break;
                  case 10:
                    a.consensusHash = r.bytes();
                    break;
                  case 11:
                    a.appHash = r.bytes();
                    break;
                  case 12:
                    a.lastResultsHash = r.bytes();
                    break;
                  case 13:
                    a.evidenceHash = r.bytes();
                    break;
                  case 14:
                    a.proposerAddress = r.bytes();
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return a;
            },
            fromJSON: (e) => ({
              version: E(e.version) ? d.Consensus.fromJSON(e.version) : void 0,
              chainId: E(e.chainId) ? String(e.chainId) : "",
              height: E(e.height) ? String(e.height) : "0",
              time: E(e.time) ? R(e.time) : void 0,
              lastBlockId: E(e.lastBlockId)
                ? t.BlockID.fromJSON(e.lastBlockId)
                : void 0,
              lastCommitHash: E(e.lastCommitHash)
                ? A(e.lastCommitHash)
                : new Uint8Array(),
              dataHash: E(e.dataHash) ? A(e.dataHash) : new Uint8Array(),
              validatorsHash: E(e.validatorsHash)
                ? A(e.validatorsHash)
                : new Uint8Array(),
              nextValidatorsHash: E(e.nextValidatorsHash)
                ? A(e.nextValidatorsHash)
                : new Uint8Array(),
              consensusHash: E(e.consensusHash)
                ? A(e.consensusHash)
                : new Uint8Array(),
              appHash: E(e.appHash) ? A(e.appHash) : new Uint8Array(),
              lastResultsHash: E(e.lastResultsHash)
                ? A(e.lastResultsHash)
                : new Uint8Array(),
              evidenceHash: E(e.evidenceHash)
                ? A(e.evidenceHash)
                : new Uint8Array(),
              proposerAddress: E(e.proposerAddress)
                ? A(e.proposerAddress)
                : new Uint8Array(),
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.version &&
                  (n.version = e.version
                    ? d.Consensus.toJSON(e.version)
                    : void 0),
                void 0 !== e.chainId && (n.chainId = e.chainId),
                void 0 !== e.height && (n.height = e.height),
                void 0 !== e.time && (n.time = e.time.toISOString()),
                void 0 !== e.lastBlockId &&
                  (n.lastBlockId = e.lastBlockId
                    ? t.BlockID.toJSON(e.lastBlockId)
                    : void 0),
                void 0 !== e.lastCommitHash &&
                  (n.lastCommitHash = k(
                    void 0 !== e.lastCommitHash
                      ? e.lastCommitHash
                      : new Uint8Array()
                  )),
                void 0 !== e.dataHash &&
                  (n.dataHash = k(
                    void 0 !== e.dataHash ? e.dataHash : new Uint8Array()
                  )),
                void 0 !== e.validatorsHash &&
                  (n.validatorsHash = k(
                    void 0 !== e.validatorsHash
                      ? e.validatorsHash
                      : new Uint8Array()
                  )),
                void 0 !== e.nextValidatorsHash &&
                  (n.nextValidatorsHash = k(
                    void 0 !== e.nextValidatorsHash
                      ? e.nextValidatorsHash
                      : new Uint8Array()
                  )),
                void 0 !== e.consensusHash &&
                  (n.consensusHash = k(
                    void 0 !== e.consensusHash
                      ? e.consensusHash
                      : new Uint8Array()
                  )),
                void 0 !== e.appHash &&
                  (n.appHash = k(
                    void 0 !== e.appHash ? e.appHash : new Uint8Array()
                  )),
                void 0 !== e.lastResultsHash &&
                  (n.lastResultsHash = k(
                    void 0 !== e.lastResultsHash
                      ? e.lastResultsHash
                      : new Uint8Array()
                  )),
                void 0 !== e.evidenceHash &&
                  (n.evidenceHash = k(
                    void 0 !== e.evidenceHash
                      ? e.evidenceHash
                      : new Uint8Array()
                  )),
                void 0 !== e.proposerAddress &&
                  (n.proposerAddress = k(
                    void 0 !== e.proposerAddress
                      ? e.proposerAddress
                      : new Uint8Array()
                  )),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o, s, a, c, u, l, h, p, f;
              const g = b();
              return (
                (g.version =
                  void 0 !== e.version && null !== e.version
                    ? d.Consensus.fromPartial(e.version)
                    : void 0),
                (g.chainId = null !== (n = e.chainId) && void 0 !== n ? n : ""),
                (g.height = null !== (r = e.height) && void 0 !== r ? r : "0"),
                (g.time = null !== (i = e.time) && void 0 !== i ? i : void 0),
                (g.lastBlockId =
                  void 0 !== e.lastBlockId && null !== e.lastBlockId
                    ? t.BlockID.fromPartial(e.lastBlockId)
                    : void 0),
                (g.lastCommitHash =
                  null !== (o = e.lastCommitHash) && void 0 !== o
                    ? o
                    : new Uint8Array()),
                (g.dataHash =
                  null !== (s = e.dataHash) && void 0 !== s
                    ? s
                    : new Uint8Array()),
                (g.validatorsHash =
                  null !== (a = e.validatorsHash) && void 0 !== a
                    ? a
                    : new Uint8Array()),
                (g.nextValidatorsHash =
                  null !== (c = e.nextValidatorsHash) && void 0 !== c
                    ? c
                    : new Uint8Array()),
                (g.consensusHash =
                  null !== (u = e.consensusHash) && void 0 !== u
                    ? u
                    : new Uint8Array()),
                (g.appHash =
                  null !== (l = e.appHash) && void 0 !== l
                    ? l
                    : new Uint8Array()),
                (g.lastResultsHash =
                  null !== (h = e.lastResultsHash) && void 0 !== h
                    ? h
                    : new Uint8Array()),
                (g.evidenceHash =
                  null !== (p = e.evidenceHash) && void 0 !== p
                    ? p
                    : new Uint8Array()),
                (g.proposerAddress =
                  null !== (f = e.proposerAddress) && void 0 !== f
                    ? f
                    : new Uint8Array()),
                g
              );
            },
          }),
          (t.Data = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.txs) t.uint32(10).bytes(n);
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { txs: [] };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.txs.push(n.bytes());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              txs: Array.isArray(null == e ? void 0 : e.txs)
                ? e.txs.map((e) => A(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                e.txs
                  ? (t.txs = e.txs.map((e) =>
                      k(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (t.txs = []),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = { txs: [] };
              return (
                (n.txs =
                  (null === (t = e.txs) || void 0 === t
                    ? void 0
                    : t.map((e) => e)) || []),
                n
              );
            },
          }),
          (t.Vote = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.type && n.uint32(8).int32(e.type),
              "0" !== e.height && n.uint32(16).int64(e.height),
              0 !== e.round && n.uint32(24).int32(e.round),
              void 0 !== e.blockId &&
                t.BlockID.encode(e.blockId, n.uint32(34).fork()).ldelim(),
              void 0 !== e.timestamp &&
                s.Timestamp.encode(
                  T(e.timestamp),
                  n.uint32(42).fork()
                ).ldelim(),
              0 !== e.validatorAddress.length &&
                n.uint32(50).bytes(e.validatorAddress),
              0 !== e.validatorIndex && n.uint32(56).int32(e.validatorIndex),
              0 !== e.signature.length && n.uint32(66).bytes(e.signature),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const a = S();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    a.type = r.int32();
                    break;
                  case 2:
                    a.height = N(r.int64());
                    break;
                  case 3:
                    a.round = r.int32();
                    break;
                  case 4:
                    a.blockId = t.BlockID.decode(r, r.uint32());
                    break;
                  case 5:
                    a.timestamp = D(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 6:
                    a.validatorAddress = r.bytes();
                    break;
                  case 7:
                    a.validatorIndex = r.int32();
                    break;
                  case 8:
                    a.signature = r.bytes();
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return a;
            },
            fromJSON: (e) => ({
              type: E(e.type) ? f(e.type) : 0,
              height: E(e.height) ? String(e.height) : "0",
              round: E(e.round) ? Number(e.round) : 0,
              blockId: E(e.blockId) ? t.BlockID.fromJSON(e.blockId) : void 0,
              timestamp: E(e.timestamp) ? R(e.timestamp) : void 0,
              validatorAddress: E(e.validatorAddress)
                ? A(e.validatorAddress)
                : new Uint8Array(),
              validatorIndex: E(e.validatorIndex)
                ? Number(e.validatorIndex)
                : 0,
              signature: E(e.signature) ? A(e.signature) : new Uint8Array(),
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.type && (n.type = g(e.type)),
                void 0 !== e.height && (n.height = e.height),
                void 0 !== e.round && (n.round = Math.round(e.round)),
                void 0 !== e.blockId &&
                  (n.blockId = e.blockId
                    ? t.BlockID.toJSON(e.blockId)
                    : void 0),
                void 0 !== e.timestamp &&
                  (n.timestamp = e.timestamp.toISOString()),
                void 0 !== e.validatorAddress &&
                  (n.validatorAddress = k(
                    void 0 !== e.validatorAddress
                      ? e.validatorAddress
                      : new Uint8Array()
                  )),
                void 0 !== e.validatorIndex &&
                  (n.validatorIndex = Math.round(e.validatorIndex)),
                void 0 !== e.signature &&
                  (n.signature = k(
                    void 0 !== e.signature ? e.signature : new Uint8Array()
                  )),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o, s, a, d;
              const c = S();
              return (
                (c.type = null !== (n = e.type) && void 0 !== n ? n : 0),
                (c.height = null !== (r = e.height) && void 0 !== r ? r : "0"),
                (c.round = null !== (i = e.round) && void 0 !== i ? i : 0),
                (c.blockId =
                  void 0 !== e.blockId && null !== e.blockId
                    ? t.BlockID.fromPartial(e.blockId)
                    : void 0),
                (c.timestamp =
                  null !== (o = e.timestamp) && void 0 !== o ? o : void 0),
                (c.validatorAddress =
                  null !== (s = e.validatorAddress) && void 0 !== s
                    ? s
                    : new Uint8Array()),
                (c.validatorIndex =
                  null !== (a = e.validatorIndex) && void 0 !== a ? a : 0),
                (c.signature =
                  null !== (d = e.signature) && void 0 !== d
                    ? d
                    : new Uint8Array()),
                c
              );
            },
          }),
          (t.Commit = {
            encode(e, n = o.default.Writer.create()) {
              "0" !== e.height && n.uint32(8).int64(e.height),
                0 !== e.round && n.uint32(16).int32(e.round),
                void 0 !== e.blockId &&
                  t.BlockID.encode(e.blockId, n.uint32(26).fork()).ldelim();
              for (const r of e.signatures)
                t.CommitSig.encode(r, n.uint32(34).fork()).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = {
                height: "0",
                round: 0,
                blockId: void 0,
                signatures: [],
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.height = N(r.int64());
                    break;
                  case 2:
                    s.round = r.int32();
                    break;
                  case 3:
                    s.blockId = t.BlockID.decode(r, r.uint32());
                    break;
                  case 4:
                    s.signatures.push(t.CommitSig.decode(r, r.uint32()));
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              height: E(e.height) ? String(e.height) : "0",
              round: E(e.round) ? Number(e.round) : 0,
              blockId: E(e.blockId) ? t.BlockID.fromJSON(e.blockId) : void 0,
              signatures: Array.isArray(null == e ? void 0 : e.signatures)
                ? e.signatures.map((e) => t.CommitSig.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.height && (n.height = e.height),
                void 0 !== e.round && (n.round = Math.round(e.round)),
                void 0 !== e.blockId &&
                  (n.blockId = e.blockId
                    ? t.BlockID.toJSON(e.blockId)
                    : void 0),
                e.signatures
                  ? (n.signatures = e.signatures.map((e) =>
                      e ? t.CommitSig.toJSON(e) : void 0
                    ))
                  : (n.signatures = []),
                n
              );
            },
            fromPartial(e) {
              var n, r, i;
              const o = {
                height: "0",
                round: 0,
                blockId: void 0,
                signatures: [],
              };
              return (
                (o.height = null !== (n = e.height) && void 0 !== n ? n : "0"),
                (o.round = null !== (r = e.round) && void 0 !== r ? r : 0),
                (o.blockId =
                  void 0 !== e.blockId && null !== e.blockId
                    ? t.BlockID.fromPartial(e.blockId)
                    : void 0),
                (o.signatures =
                  (null === (i = e.signatures) || void 0 === i
                    ? void 0
                    : i.map((e) => t.CommitSig.fromPartial(e))) || []),
                o
              );
            },
          }),
          (t.CommitSig = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.blockIdFlag && t.uint32(8).int32(e.blockIdFlag),
              0 !== e.validatorAddress.length &&
                t.uint32(18).bytes(e.validatorAddress),
              void 0 !== e.timestamp &&
                s.Timestamp.encode(
                  T(e.timestamp),
                  t.uint32(26).fork()
                ).ldelim(),
              0 !== e.signature.length && t.uint32(34).bytes(e.signature),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = O();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.blockIdFlag = n.int32();
                    break;
                  case 2:
                    i.validatorAddress = n.bytes();
                    break;
                  case 3:
                    i.timestamp = D(s.Timestamp.decode(n, n.uint32()));
                    break;
                  case 4:
                    i.signature = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              blockIdFlag: E(e.blockIdFlag) ? h(e.blockIdFlag) : 0,
              validatorAddress: E(e.validatorAddress)
                ? A(e.validatorAddress)
                : new Uint8Array(),
              timestamp: E(e.timestamp) ? R(e.timestamp) : void 0,
              signature: E(e.signature) ? A(e.signature) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.blockIdFlag && (t.blockIdFlag = p(e.blockIdFlag)),
                void 0 !== e.validatorAddress &&
                  (t.validatorAddress = k(
                    void 0 !== e.validatorAddress
                      ? e.validatorAddress
                      : new Uint8Array()
                  )),
                void 0 !== e.timestamp &&
                  (t.timestamp = e.timestamp.toISOString()),
                void 0 !== e.signature &&
                  (t.signature = k(
                    void 0 !== e.signature ? e.signature : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = O();
              return (
                (o.blockIdFlag =
                  null !== (t = e.blockIdFlag) && void 0 !== t ? t : 0),
                (o.validatorAddress =
                  null !== (n = e.validatorAddress) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (o.timestamp =
                  null !== (r = e.timestamp) && void 0 !== r ? r : void 0),
                (o.signature =
                  null !== (i = e.signature) && void 0 !== i
                    ? i
                    : new Uint8Array()),
                o
              );
            },
          }),
          (t.Proposal = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.type && n.uint32(8).int32(e.type),
              "0" !== e.height && n.uint32(16).int64(e.height),
              0 !== e.round && n.uint32(24).int32(e.round),
              0 !== e.polRound && n.uint32(32).int32(e.polRound),
              void 0 !== e.blockId &&
                t.BlockID.encode(e.blockId, n.uint32(42).fork()).ldelim(),
              void 0 !== e.timestamp &&
                s.Timestamp.encode(
                  T(e.timestamp),
                  n.uint32(50).fork()
                ).ldelim(),
              0 !== e.signature.length && n.uint32(58).bytes(e.signature),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const a = _();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    a.type = r.int32();
                    break;
                  case 2:
                    a.height = N(r.int64());
                    break;
                  case 3:
                    a.round = r.int32();
                    break;
                  case 4:
                    a.polRound = r.int32();
                    break;
                  case 5:
                    a.blockId = t.BlockID.decode(r, r.uint32());
                    break;
                  case 6:
                    a.timestamp = D(s.Timestamp.decode(r, r.uint32()));
                    break;
                  case 7:
                    a.signature = r.bytes();
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return a;
            },
            fromJSON: (e) => ({
              type: E(e.type) ? f(e.type) : 0,
              height: E(e.height) ? String(e.height) : "0",
              round: E(e.round) ? Number(e.round) : 0,
              polRound: E(e.polRound) ? Number(e.polRound) : 0,
              blockId: E(e.blockId) ? t.BlockID.fromJSON(e.blockId) : void 0,
              timestamp: E(e.timestamp) ? R(e.timestamp) : void 0,
              signature: E(e.signature) ? A(e.signature) : new Uint8Array(),
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.type && (n.type = g(e.type)),
                void 0 !== e.height && (n.height = e.height),
                void 0 !== e.round && (n.round = Math.round(e.round)),
                void 0 !== e.polRound && (n.polRound = Math.round(e.polRound)),
                void 0 !== e.blockId &&
                  (n.blockId = e.blockId
                    ? t.BlockID.toJSON(e.blockId)
                    : void 0),
                void 0 !== e.timestamp &&
                  (n.timestamp = e.timestamp.toISOString()),
                void 0 !== e.signature &&
                  (n.signature = k(
                    void 0 !== e.signature ? e.signature : new Uint8Array()
                  )),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o, s, a;
              const d = _();
              return (
                (d.type = null !== (n = e.type) && void 0 !== n ? n : 0),
                (d.height = null !== (r = e.height) && void 0 !== r ? r : "0"),
                (d.round = null !== (i = e.round) && void 0 !== i ? i : 0),
                (d.polRound =
                  null !== (o = e.polRound) && void 0 !== o ? o : 0),
                (d.blockId =
                  void 0 !== e.blockId && null !== e.blockId
                    ? t.BlockID.fromPartial(e.blockId)
                    : void 0),
                (d.timestamp =
                  null !== (s = e.timestamp) && void 0 !== s ? s : void 0),
                (d.signature =
                  null !== (a = e.signature) && void 0 !== a
                    ? a
                    : new Uint8Array()),
                d
              );
            },
          }),
          (t.SignedHeader = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.header &&
                t.Header.encode(e.header, n.uint32(10).fork()).ldelim(),
              void 0 !== e.commit &&
                t.Commit.encode(e.commit, n.uint32(18).fork()).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { header: void 0, commit: void 0 };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.header = t.Header.decode(r, r.uint32());
                    break;
                  case 2:
                    s.commit = t.Commit.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              header: E(e.header) ? t.Header.fromJSON(e.header) : void 0,
              commit: E(e.commit) ? t.Commit.fromJSON(e.commit) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.header &&
                  (n.header = e.header ? t.Header.toJSON(e.header) : void 0),
                void 0 !== e.commit &&
                  (n.commit = e.commit ? t.Commit.toJSON(e.commit) : void 0),
                n
              );
            },
            fromPartial(e) {
              const n = { header: void 0, commit: void 0 };
              return (
                (n.header =
                  void 0 !== e.header && null !== e.header
                    ? t.Header.fromPartial(e.header)
                    : void 0),
                (n.commit =
                  void 0 !== e.commit && null !== e.commit
                    ? t.Commit.fromPartial(e.commit)
                    : void 0),
                n
              );
            },
          }),
          (t.LightBlock = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.signedHeader &&
                t.SignedHeader.encode(
                  e.signedHeader,
                  n.uint32(10).fork()
                ).ldelim(),
              void 0 !== e.validatorSet &&
                c.ValidatorSet.encode(
                  e.validatorSet,
                  n.uint32(18).fork()
                ).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { signedHeader: void 0, validatorSet: void 0 };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.signedHeader = t.SignedHeader.decode(r, r.uint32());
                    break;
                  case 2:
                    s.validatorSet = c.ValidatorSet.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              signedHeader: E(e.signedHeader)
                ? t.SignedHeader.fromJSON(e.signedHeader)
                : void 0,
              validatorSet: E(e.validatorSet)
                ? c.ValidatorSet.fromJSON(e.validatorSet)
                : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.signedHeader &&
                  (n.signedHeader = e.signedHeader
                    ? t.SignedHeader.toJSON(e.signedHeader)
                    : void 0),
                void 0 !== e.validatorSet &&
                  (n.validatorSet = e.validatorSet
                    ? c.ValidatorSet.toJSON(e.validatorSet)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              const n = { signedHeader: void 0, validatorSet: void 0 };
              return (
                (n.signedHeader =
                  void 0 !== e.signedHeader && null !== e.signedHeader
                    ? t.SignedHeader.fromPartial(e.signedHeader)
                    : void 0),
                (n.validatorSet =
                  void 0 !== e.validatorSet && null !== e.validatorSet
                    ? c.ValidatorSet.fromPartial(e.validatorSet)
                    : void 0),
                n
              );
            },
          }),
          (t.BlockMeta = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.blockId &&
                t.BlockID.encode(e.blockId, n.uint32(10).fork()).ldelim(),
              "0" !== e.blockSize && n.uint32(16).int64(e.blockSize),
              void 0 !== e.header &&
                t.Header.encode(e.header, n.uint32(26).fork()).ldelim(),
              "0" !== e.numTxs && n.uint32(32).int64(e.numTxs),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = {
                blockId: void 0,
                blockSize: "0",
                header: void 0,
                numTxs: "0",
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.blockId = t.BlockID.decode(r, r.uint32());
                    break;
                  case 2:
                    s.blockSize = N(r.int64());
                    break;
                  case 3:
                    s.header = t.Header.decode(r, r.uint32());
                    break;
                  case 4:
                    s.numTxs = N(r.int64());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              blockId: E(e.blockId) ? t.BlockID.fromJSON(e.blockId) : void 0,
              blockSize: E(e.blockSize) ? String(e.blockSize) : "0",
              header: E(e.header) ? t.Header.fromJSON(e.header) : void 0,
              numTxs: E(e.numTxs) ? String(e.numTxs) : "0",
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.blockId &&
                  (n.blockId = e.blockId
                    ? t.BlockID.toJSON(e.blockId)
                    : void 0),
                void 0 !== e.blockSize && (n.blockSize = e.blockSize),
                void 0 !== e.header &&
                  (n.header = e.header ? t.Header.toJSON(e.header) : void 0),
                void 0 !== e.numTxs && (n.numTxs = e.numTxs),
                n
              );
            },
            fromPartial(e) {
              var n, r;
              const i = {
                blockId: void 0,
                blockSize: "0",
                header: void 0,
                numTxs: "0",
              };
              return (
                (i.blockId =
                  void 0 !== e.blockId && null !== e.blockId
                    ? t.BlockID.fromPartial(e.blockId)
                    : void 0),
                (i.blockSize =
                  null !== (n = e.blockSize) && void 0 !== n ? n : "0"),
                (i.header =
                  void 0 !== e.header && null !== e.header
                    ? t.Header.fromPartial(e.header)
                    : void 0),
                (i.numTxs = null !== (r = e.numTxs) && void 0 !== r ? r : "0"),
                i
              );
            },
          }),
          (t.TxProof = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.rootHash.length && t.uint32(10).bytes(e.rootHash),
              0 !== e.data.length && t.uint32(18).bytes(e.data),
              void 0 !== e.proof &&
                a.Proof.encode(e.proof, t.uint32(26).fork()).ldelim(),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = w();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.rootHash = n.bytes();
                    break;
                  case 2:
                    i.data = n.bytes();
                    break;
                  case 3:
                    i.proof = a.Proof.decode(n, n.uint32());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              rootHash: E(e.rootHash) ? A(e.rootHash) : new Uint8Array(),
              data: E(e.data) ? A(e.data) : new Uint8Array(),
              proof: E(e.proof) ? a.Proof.fromJSON(e.proof) : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.rootHash &&
                  (t.rootHash = k(
                    void 0 !== e.rootHash ? e.rootHash : new Uint8Array()
                  )),
                void 0 !== e.data &&
                  (t.data = k(void 0 !== e.data ? e.data : new Uint8Array())),
                void 0 !== e.proof &&
                  (t.proof = e.proof ? a.Proof.toJSON(e.proof) : void 0),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = w();
              return (
                (r.rootHash =
                  null !== (t = e.rootHash) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (r.data =
                  null !== (n = e.data) && void 0 !== n ? n : new Uint8Array()),
                (r.proof =
                  void 0 !== e.proof && null !== e.proof
                    ? a.Proof.fromPartial(e.proof)
                    : void 0),
                r
              );
            },
          });
        var P = (() => {
          if (void 0 !== P) return P;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const I =
          P.atob || ((e) => P.Buffer.from(e, "base64").toString("binary"));
        function A(e) {
          const t = I(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const C =
          P.btoa || ((e) => P.Buffer.from(e, "binary").toString("base64"));
        function k(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return C(t.join(""));
        }
        function T(e) {
          return {
            seconds: Math.trunc(e.getTime() / 1e3).toString(),
            nanos: (e.getTime() % 1e3) * 1e6,
          };
        }
        function D(e) {
          let t = 1e3 * Number(e.seconds);
          return (t += e.nanos / 1e6), new Date(t);
        }
        function R(e) {
          return e instanceof Date
            ? e
            : "string" == typeof e
            ? new Date(e)
            : D(s.Timestamp.fromJSON(e));
        }
        function N(e) {
          return e.toString();
        }
        function E(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    746: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.ProofOps =
            t.ProofOp =
            t.DominoOp =
            t.ValueOp =
            t.Proof =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28));
        function s() {
          return {
            total: "0",
            index: "0",
            leafHash: new Uint8Array(),
            aunts: [],
          };
        }
        function a() {
          return { key: new Uint8Array(), proof: void 0 };
        }
        function d() {
          return { type: "", key: new Uint8Array(), data: new Uint8Array() };
        }
        (t.protobufPackage = "tendermint.crypto"),
          (t.Proof = {
            encode(e, t = o.default.Writer.create()) {
              "0" !== e.total && t.uint32(8).int64(e.total),
                "0" !== e.index && t.uint32(16).int64(e.index),
                0 !== e.leafHash.length && t.uint32(26).bytes(e.leafHash);
              for (const n of e.aunts) t.uint32(34).bytes(n);
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = s();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.total = f(n.int64());
                    break;
                  case 2:
                    i.index = f(n.int64());
                    break;
                  case 3:
                    i.leafHash = n.bytes();
                    break;
                  case 4:
                    i.aunts.push(n.bytes());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              total: g(e.total) ? String(e.total) : "0",
              index: g(e.index) ? String(e.index) : "0",
              leafHash: g(e.leafHash) ? l(e.leafHash) : new Uint8Array(),
              aunts: Array.isArray(null == e ? void 0 : e.aunts)
                ? e.aunts.map((e) => l(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.total && (t.total = e.total),
                void 0 !== e.index && (t.index = e.index),
                void 0 !== e.leafHash &&
                  (t.leafHash = p(
                    void 0 !== e.leafHash ? e.leafHash : new Uint8Array()
                  )),
                e.aunts
                  ? (t.aunts = e.aunts.map((e) =>
                      p(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (t.aunts = []),
                t
              );
            },
            fromPartial(e) {
              var t, n, r, i;
              const o = s();
              return (
                (o.total = null !== (t = e.total) && void 0 !== t ? t : "0"),
                (o.index = null !== (n = e.index) && void 0 !== n ? n : "0"),
                (o.leafHash =
                  null !== (r = e.leafHash) && void 0 !== r
                    ? r
                    : new Uint8Array()),
                (o.aunts =
                  (null === (i = e.aunts) || void 0 === i
                    ? void 0
                    : i.map((e) => e)) || []),
                o
              );
            },
          }),
          (t.ValueOp = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.key.length && n.uint32(10).bytes(e.key),
              void 0 !== e.proof &&
                t.Proof.encode(e.proof, n.uint32(18).fork()).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = a();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.key = r.bytes();
                    break;
                  case 2:
                    s.proof = t.Proof.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              key: g(e.key) ? l(e.key) : new Uint8Array(),
              proof: g(e.proof) ? t.Proof.fromJSON(e.proof) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.key &&
                  (n.key = p(void 0 !== e.key ? e.key : new Uint8Array())),
                void 0 !== e.proof &&
                  (n.proof = e.proof ? t.Proof.toJSON(e.proof) : void 0),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = a();
              return (
                (r.key =
                  null !== (n = e.key) && void 0 !== n ? n : new Uint8Array()),
                (r.proof =
                  void 0 !== e.proof && null !== e.proof
                    ? t.Proof.fromPartial(e.proof)
                    : void 0),
                r
              );
            },
          }),
          (t.DominoOp = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.key && t.uint32(10).string(e.key),
              "" !== e.input && t.uint32(18).string(e.input),
              "" !== e.output && t.uint32(26).string(e.output),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { key: "", input: "", output: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.key = n.string();
                    break;
                  case 2:
                    i.input = n.string();
                    break;
                  case 3:
                    i.output = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              key: g(e.key) ? String(e.key) : "",
              input: g(e.input) ? String(e.input) : "",
              output: g(e.output) ? String(e.output) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.key && (t.key = e.key),
                void 0 !== e.input && (t.input = e.input),
                void 0 !== e.output && (t.output = e.output),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = { key: "", input: "", output: "" };
              return (
                (i.key = null !== (t = e.key) && void 0 !== t ? t : ""),
                (i.input = null !== (n = e.input) && void 0 !== n ? n : ""),
                (i.output = null !== (r = e.output) && void 0 !== r ? r : ""),
                i
              );
            },
          }),
          (t.ProofOp = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.type && t.uint32(10).string(e.type),
              0 !== e.key.length && t.uint32(18).bytes(e.key),
              0 !== e.data.length && t.uint32(26).bytes(e.data),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = d();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.type = n.string();
                    break;
                  case 2:
                    i.key = n.bytes();
                    break;
                  case 3:
                    i.data = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              type: g(e.type) ? String(e.type) : "",
              key: g(e.key) ? l(e.key) : new Uint8Array(),
              data: g(e.data) ? l(e.data) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.type && (t.type = e.type),
                void 0 !== e.key &&
                  (t.key = p(void 0 !== e.key ? e.key : new Uint8Array())),
                void 0 !== e.data &&
                  (t.data = p(void 0 !== e.data ? e.data : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = d();
              return (
                (i.type = null !== (t = e.type) && void 0 !== t ? t : ""),
                (i.key =
                  null !== (n = e.key) && void 0 !== n ? n : new Uint8Array()),
                (i.data =
                  null !== (r = e.data) && void 0 !== r ? r : new Uint8Array()),
                i
              );
            },
          }),
          (t.ProofOps = {
            encode(e, n = o.default.Writer.create()) {
              for (const r of e.ops)
                t.ProofOp.encode(r, n.uint32(10).fork()).ldelim();
              return n;
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = { ops: [] };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.ops.push(t.ProofOp.decode(r, r.uint32()));
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              ops: Array.isArray(null == e ? void 0 : e.ops)
                ? e.ops.map((e) => t.ProofOp.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const n = {};
              return (
                e.ops
                  ? (n.ops = e.ops.map((e) =>
                      e ? t.ProofOp.toJSON(e) : void 0
                    ))
                  : (n.ops = []),
                n
              );
            },
            fromPartial(e) {
              var n;
              const r = { ops: [] };
              return (
                (r.ops =
                  (null === (n = e.ops) || void 0 === n
                    ? void 0
                    : n.map((e) => t.ProofOp.fromPartial(e))) || []),
                r
              );
            },
          });
        var c = (() => {
          if (void 0 !== c) return c;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const u =
          c.atob || ((e) => c.Buffer.from(e, "base64").toString("binary"));
        function l(e) {
          const t = u(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const h =
          c.btoa || ((e) => c.Buffer.from(e, "binary").toString("base64"));
        function p(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return h(t.join(""));
        }
        function f(e) {
          return e.toString();
        }
        function g(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    747: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Consensus = t.App = t.protobufPackage = void 0);
      const i = r(n(25)),
        o = r(n(28));
      function s(e) {
        return e.toString();
      }
      function a(e) {
        return null != e;
      }
      (t.protobufPackage = "tendermint.version"),
        (t.App = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.protocol && t.uint32(8).uint64(e.protocol),
            "" !== e.software && t.uint32(18).string(e.software),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { protocol: "0", software: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.protocol = s(n.uint64());
                  break;
                case 2:
                  i.software = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            protocol: a(e.protocol) ? String(e.protocol) : "0",
            software: a(e.software) ? String(e.software) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.protocol && (t.protocol = e.protocol),
              void 0 !== e.software && (t.software = e.software),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { protocol: "0", software: "" };
            return (
              (r.protocol =
                null !== (t = e.protocol) && void 0 !== t ? t : "0"),
              (r.software = null !== (n = e.software) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.Consensus = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.block && t.uint32(8).uint64(e.block),
            "0" !== e.app && t.uint32(16).uint64(e.app),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { block: "0", app: "0" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.block = s(n.uint64());
                  break;
                case 2:
                  i.app = s(n.uint64());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            block: a(e.block) ? String(e.block) : "0",
            app: a(e.app) ? String(e.app) : "0",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.block && (t.block = e.block),
              void 0 !== e.app && (t.app = e.app),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { block: "0", app: "0" };
            return (
              (r.block = null !== (t = e.block) && void 0 !== t ? t : "0"),
              (r.app = null !== (n = e.app) && void 0 !== n ? n : "0"),
              r
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    748: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.SimpleValidator =
            t.Validator =
            t.ValidatorSet =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(749);
        function a() {
          return {
            address: new Uint8Array(),
            pubKey: void 0,
            votingPower: "0",
            proposerPriority: "0",
          };
        }
        (t.protobufPackage = "tendermint.types"),
          (t.ValidatorSet = {
            encode(e, n = o.default.Writer.create()) {
              for (const r of e.validators)
                t.Validator.encode(r, n.uint32(10).fork()).ldelim();
              return (
                void 0 !== e.proposer &&
                  t.Validator.encode(e.proposer, n.uint32(18).fork()).ldelim(),
                "0" !== e.totalVotingPower &&
                  n.uint32(24).int64(e.totalVotingPower),
                n
              );
            },
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = {
                validators: [],
                proposer: void 0,
                totalVotingPower: "0",
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.validators.push(t.Validator.decode(r, r.uint32()));
                    break;
                  case 2:
                    s.proposer = t.Validator.decode(r, r.uint32());
                    break;
                  case 3:
                    s.totalVotingPower = h(r.int64());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              validators: Array.isArray(null == e ? void 0 : e.validators)
                ? e.validators.map((e) => t.Validator.fromJSON(e))
                : [],
              proposer: p(e.proposer)
                ? t.Validator.fromJSON(e.proposer)
                : void 0,
              totalVotingPower: p(e.totalVotingPower)
                ? String(e.totalVotingPower)
                : "0",
            }),
            toJSON(e) {
              const n = {};
              return (
                e.validators
                  ? (n.validators = e.validators.map((e) =>
                      e ? t.Validator.toJSON(e) : void 0
                    ))
                  : (n.validators = []),
                void 0 !== e.proposer &&
                  (n.proposer = e.proposer
                    ? t.Validator.toJSON(e.proposer)
                    : void 0),
                void 0 !== e.totalVotingPower &&
                  (n.totalVotingPower = e.totalVotingPower),
                n
              );
            },
            fromPartial(e) {
              var n, r;
              const i = {
                validators: [],
                proposer: void 0,
                totalVotingPower: "0",
              };
              return (
                (i.validators =
                  (null === (n = e.validators) || void 0 === n
                    ? void 0
                    : n.map((e) => t.Validator.fromPartial(e))) || []),
                (i.proposer =
                  void 0 !== e.proposer && null !== e.proposer
                    ? t.Validator.fromPartial(e.proposer)
                    : void 0),
                (i.totalVotingPower =
                  null !== (r = e.totalVotingPower) && void 0 !== r ? r : "0"),
                i
              );
            },
          }),
          (t.Validator = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.address.length && t.uint32(10).bytes(e.address),
              void 0 !== e.pubKey &&
                s.PublicKey.encode(e.pubKey, t.uint32(18).fork()).ldelim(),
              "0" !== e.votingPower && t.uint32(24).int64(e.votingPower),
              "0" !== e.proposerPriority &&
                t.uint32(32).int64(e.proposerPriority),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = a();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.address = n.bytes();
                    break;
                  case 2:
                    i.pubKey = s.PublicKey.decode(n, n.uint32());
                    break;
                  case 3:
                    i.votingPower = h(n.int64());
                    break;
                  case 4:
                    i.proposerPriority = h(n.int64());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              address: p(e.address) ? u(e.address) : new Uint8Array(),
              pubKey: p(e.pubKey) ? s.PublicKey.fromJSON(e.pubKey) : void 0,
              votingPower: p(e.votingPower) ? String(e.votingPower) : "0",
              proposerPriority: p(e.proposerPriority)
                ? String(e.proposerPriority)
                : "0",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.address &&
                  (t.address = (function (e) {
                    const t = [];
                    for (const n of e) t.push(String.fromCharCode(n));
                    return l(t.join(""));
                  })(void 0 !== e.address ? e.address : new Uint8Array())),
                void 0 !== e.pubKey &&
                  (t.pubKey = e.pubKey ? s.PublicKey.toJSON(e.pubKey) : void 0),
                void 0 !== e.votingPower && (t.votingPower = e.votingPower),
                void 0 !== e.proposerPriority &&
                  (t.proposerPriority = e.proposerPriority),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = a();
              return (
                (i.address =
                  null !== (t = e.address) && void 0 !== t
                    ? t
                    : new Uint8Array()),
                (i.pubKey =
                  void 0 !== e.pubKey && null !== e.pubKey
                    ? s.PublicKey.fromPartial(e.pubKey)
                    : void 0),
                (i.votingPower =
                  null !== (n = e.votingPower) && void 0 !== n ? n : "0"),
                (i.proposerPriority =
                  null !== (r = e.proposerPriority) && void 0 !== r ? r : "0"),
                i
              );
            },
          }),
          (t.SimpleValidator = {
            encode: (e, t = o.default.Writer.create()) => (
              void 0 !== e.pubKey &&
                s.PublicKey.encode(e.pubKey, t.uint32(10).fork()).ldelim(),
              "0" !== e.votingPower && t.uint32(16).int64(e.votingPower),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { pubKey: void 0, votingPower: "0" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.pubKey = s.PublicKey.decode(n, n.uint32());
                    break;
                  case 2:
                    i.votingPower = h(n.int64());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              pubKey: p(e.pubKey) ? s.PublicKey.fromJSON(e.pubKey) : void 0,
              votingPower: p(e.votingPower) ? String(e.votingPower) : "0",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.pubKey &&
                  (t.pubKey = e.pubKey ? s.PublicKey.toJSON(e.pubKey) : void 0),
                void 0 !== e.votingPower && (t.votingPower = e.votingPower),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = { pubKey: void 0, votingPower: "0" };
              return (
                (n.pubKey =
                  void 0 !== e.pubKey && null !== e.pubKey
                    ? s.PublicKey.fromPartial(e.pubKey)
                    : void 0),
                (n.votingPower =
                  null !== (t = e.votingPower) && void 0 !== t ? t : "0"),
                n
              );
            },
          });
        var d = (() => {
          if (void 0 !== d) return d;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const c =
          d.atob || ((e) => d.Buffer.from(e, "base64").toString("binary"));
        function u(e) {
          const t = c(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const l =
          d.btoa || ((e) => d.Buffer.from(e, "binary").toString("base64"));
        function h(e) {
          return e.toString();
        }
        function p(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    749: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PublicKey = t.protobufPackage = void 0);
        const i = r(n(25)),
          o = r(n(28));
        (t.protobufPackage = "tendermint.crypto"),
          (t.PublicKey = {
            encode: (e, t = o.default.Writer.create()) => (
              void 0 !== e.ed25519 && t.uint32(10).bytes(e.ed25519),
              void 0 !== e.secp256k1 && t.uint32(18).bytes(e.secp256k1),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { ed25519: void 0, secp256k1: void 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.ed25519 = n.bytes();
                    break;
                  case 2:
                    i.secp256k1 = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              ed25519: l(e.ed25519) ? d(e.ed25519) : void 0,
              secp256k1: l(e.secp256k1) ? d(e.secp256k1) : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.ed25519 &&
                  (t.ed25519 = void 0 !== e.ed25519 ? u(e.ed25519) : void 0),
                void 0 !== e.secp256k1 &&
                  (t.secp256k1 =
                    void 0 !== e.secp256k1 ? u(e.secp256k1) : void 0),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { ed25519: void 0, secp256k1: void 0 };
              return (
                (r.ed25519 =
                  null !== (t = e.ed25519) && void 0 !== t ? t : void 0),
                (r.secp256k1 =
                  null !== (n = e.secp256k1) && void 0 !== n ? n : void 0),
                r
              );
            },
          });
        var s = (() => {
          if (void 0 !== s) return s;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const a =
          s.atob || ((e) => s.Buffer.from(e, "base64").toString("binary"));
        function d(e) {
          const t = a(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const c =
          s.btoa || ((e) => s.Buffer.from(e, "binary").toString("base64"));
        function u(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return c(t.join(""));
        }
        function l(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    750: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MsgRevokeResponse =
            t.MsgRevoke =
            t.MsgGrantResponse =
            t.MsgExec =
            t.MsgExecResponse =
            t.MsgGrant =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(643),
          a = n(94);
        (t.protobufPackage = "cosmos.authz.v1beta1"),
          (t.MsgGrant = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.granter && t.uint32(10).string(e.granter),
              "" !== e.grantee && t.uint32(18).string(e.grantee),
              void 0 !== e.grant &&
                s.Grant.encode(e.grant, t.uint32(26).fork()).ldelim(),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { granter: "", grantee: "", grant: void 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.granter = n.string();
                    break;
                  case 2:
                    i.grantee = n.string();
                    break;
                  case 3:
                    i.grant = s.Grant.decode(n, n.uint32());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              granter: l(e.granter) ? String(e.granter) : "",
              grantee: l(e.grantee) ? String(e.grantee) : "",
              grant: l(e.grant) ? s.Grant.fromJSON(e.grant) : void 0,
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.granter && (t.granter = e.granter),
                void 0 !== e.grantee && (t.grantee = e.grantee),
                void 0 !== e.grant &&
                  (t.grant = e.grant ? s.Grant.toJSON(e.grant) : void 0),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { granter: "", grantee: "", grant: void 0 };
              return (
                (r.granter = null !== (t = e.granter) && void 0 !== t ? t : ""),
                (r.grantee = null !== (n = e.grantee) && void 0 !== n ? n : ""),
                (r.grant =
                  void 0 !== e.grant && null !== e.grant
                    ? s.Grant.fromPartial(e.grant)
                    : void 0),
                r
              );
            },
          }),
          (t.MsgExecResponse = {
            encode(e, t = o.default.Writer.create()) {
              for (const n of e.results) t.uint32(10).bytes(n);
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { results: [] };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.results.push(n.bytes());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              results: Array.isArray(null == e ? void 0 : e.results)
                ? e.results.map((e) =>
                    (function (e) {
                      const t = c(e),
                        n = new Uint8Array(t.length);
                      for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
                      return n;
                    })(e)
                  )
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                e.results
                  ? (t.results = e.results.map((e) =>
                      (function (e) {
                        const t = [];
                        for (const n of e) t.push(String.fromCharCode(n));
                        return u(t.join(""));
                      })(void 0 !== e ? e : new Uint8Array())
                    ))
                  : (t.results = []),
                t
              );
            },
            fromPartial(e) {
              var t;
              const n = { results: [] };
              return (
                (n.results =
                  (null === (t = e.results) || void 0 === t
                    ? void 0
                    : t.map((e) => e)) || []),
                n
              );
            },
          }),
          (t.MsgExec = {
            encode(e, t = o.default.Writer.create()) {
              "" !== e.grantee && t.uint32(10).string(e.grantee);
              for (const n of e.msgs)
                a.Any.encode(n, t.uint32(18).fork()).ldelim();
              return t;
            },
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { grantee: "", msgs: [] };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.grantee = n.string();
                    break;
                  case 2:
                    i.msgs.push(a.Any.decode(n, n.uint32()));
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              grantee: l(e.grantee) ? String(e.grantee) : "",
              msgs: Array.isArray(null == e ? void 0 : e.msgs)
                ? e.msgs.map((e) => a.Any.fromJSON(e))
                : [],
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.grantee && (t.grantee = e.grantee),
                e.msgs
                  ? (t.msgs = e.msgs.map((e) => (e ? a.Any.toJSON(e) : void 0)))
                  : (t.msgs = []),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { grantee: "", msgs: [] };
              return (
                (r.grantee = null !== (t = e.grantee) && void 0 !== t ? t : ""),
                (r.msgs =
                  (null === (n = e.msgs) || void 0 === n
                    ? void 0
                    : n.map((e) => a.Any.fromPartial(e))) || []),
                r
              );
            },
          }),
          (t.MsgGrantResponse = {
            encode: (e, t = o.default.Writer.create()) => t,
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = {};
              for (; n.pos < r; ) {
                const e = n.uint32();
                n.skipType(7 & e);
              }
              return i;
            },
            fromJSON: (e) => ({}),
            toJSON: (e) => ({}),
            fromPartial: (e) => ({}),
          }),
          (t.MsgRevoke = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.granter && t.uint32(10).string(e.granter),
              "" !== e.grantee && t.uint32(18).string(e.grantee),
              "" !== e.msgTypeUrl && t.uint32(26).string(e.msgTypeUrl),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { granter: "", grantee: "", msgTypeUrl: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.granter = n.string();
                    break;
                  case 2:
                    i.grantee = n.string();
                    break;
                  case 3:
                    i.msgTypeUrl = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              granter: l(e.granter) ? String(e.granter) : "",
              grantee: l(e.grantee) ? String(e.grantee) : "",
              msgTypeUrl: l(e.msgTypeUrl) ? String(e.msgTypeUrl) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.granter && (t.granter = e.granter),
                void 0 !== e.grantee && (t.grantee = e.grantee),
                void 0 !== e.msgTypeUrl && (t.msgTypeUrl = e.msgTypeUrl),
                t
              );
            },
            fromPartial(e) {
              var t, n, r;
              const i = { granter: "", grantee: "", msgTypeUrl: "" };
              return (
                (i.granter = null !== (t = e.granter) && void 0 !== t ? t : ""),
                (i.grantee = null !== (n = e.grantee) && void 0 !== n ? n : ""),
                (i.msgTypeUrl =
                  null !== (r = e.msgTypeUrl) && void 0 !== r ? r : ""),
                i
              );
            },
          }),
          (t.MsgRevokeResponse = {
            encode: (e, t = o.default.Writer.create()) => t,
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = {};
              for (; n.pos < r; ) {
                const e = n.uint32();
                n.skipType(7 & e);
              }
              return i;
            },
            fromJSON: (e) => ({}),
            toJSON: (e) => ({}),
            fromPartial: (e) => ({}),
          });
        var d = (() => {
          if (void 0 !== d) return d;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const c =
          d.atob || ((e) => d.Buffer.from(e, "base64").toString("binary"));
        const u =
          d.btoa || ((e) => d.Buffer.from(e, "binary").toString("base64"));
        function l(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    751: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Model =
            t.AbsoluteTxPosition =
            t.ContractCodeHistoryEntry =
            t.ContractInfo =
            t.CodeInfo =
            t.Params =
            t.AccessConfig =
            t.AccessTypeParam =
            t.contractCodeHistoryOperationTypeToJSON =
            t.contractCodeHistoryOperationTypeFromJSON =
            t.ContractCodeHistoryOperationType =
            t.accessTypeToJSON =
            t.accessTypeFromJSON =
            t.AccessType =
            t.protobufPackage =
              void 0);
        const i = r(n(25)),
          o = r(n(28)),
          s = n(94);
        var a, d;
        function c(e) {
          switch (e) {
            case 0:
            case "ACCESS_TYPE_UNSPECIFIED":
              return a.ACCESS_TYPE_UNSPECIFIED;
            case 1:
            case "ACCESS_TYPE_NOBODY":
              return a.ACCESS_TYPE_NOBODY;
            case 2:
            case "ACCESS_TYPE_ONLY_ADDRESS":
              return a.ACCESS_TYPE_ONLY_ADDRESS;
            case 3:
            case "ACCESS_TYPE_EVERYBODY":
              return a.ACCESS_TYPE_EVERYBODY;
            case -1:
            case "UNRECOGNIZED":
            default:
              return a.UNRECOGNIZED;
          }
        }
        function u(e) {
          switch (e) {
            case a.ACCESS_TYPE_UNSPECIFIED:
              return "ACCESS_TYPE_UNSPECIFIED";
            case a.ACCESS_TYPE_NOBODY:
              return "ACCESS_TYPE_NOBODY";
            case a.ACCESS_TYPE_ONLY_ADDRESS:
              return "ACCESS_TYPE_ONLY_ADDRESS";
            case a.ACCESS_TYPE_EVERYBODY:
              return "ACCESS_TYPE_EVERYBODY";
            default:
              return "UNKNOWN";
          }
        }
        function l(e) {
          switch (e) {
            case 0:
            case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED":
              return d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED;
            case 1:
            case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT":
              return d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT;
            case 2:
            case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE":
              return d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE;
            case 3:
            case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS":
              return d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS;
            case -1:
            case "UNRECOGNIZED":
            default:
              return d.UNRECOGNIZED;
          }
        }
        function h(e) {
          switch (e) {
            case d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED:
              return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
            case d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
              return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
            case d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
              return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
            case d.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
              return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
            default:
              return "UNKNOWN";
          }
        }
        function p() {
          return {
            codeHash: new Uint8Array(),
            creator: "",
            instantiateConfig: void 0,
          };
        }
        function f() {
          return {
            operation: 0,
            codeId: "0",
            updated: void 0,
            msg: new Uint8Array(),
          };
        }
        function g() {
          return { key: new Uint8Array(), value: new Uint8Array() };
        }
        (t.protobufPackage = "cosmwasm.wasm.v1"),
          (function (e) {
            (e[(e.ACCESS_TYPE_UNSPECIFIED = 0)] = "ACCESS_TYPE_UNSPECIFIED"),
              (e[(e.ACCESS_TYPE_NOBODY = 1)] = "ACCESS_TYPE_NOBODY"),
              (e[(e.ACCESS_TYPE_ONLY_ADDRESS = 2)] =
                "ACCESS_TYPE_ONLY_ADDRESS"),
              (e[(e.ACCESS_TYPE_EVERYBODY = 3)] = "ACCESS_TYPE_EVERYBODY"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })((a = t.AccessType || (t.AccessType = {}))),
          (t.accessTypeFromJSON = c),
          (t.accessTypeToJSON = u),
          (function (e) {
            (e[(e.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED = 0)] =
              "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED"),
              (e[(e.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = 1)] =
                "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT"),
              (e[(e.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = 2)] =
                "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE"),
              (e[(e.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = 3)] =
                "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED");
          })(
            (d =
              t.ContractCodeHistoryOperationType ||
              (t.ContractCodeHistoryOperationType = {}))
          ),
          (t.contractCodeHistoryOperationTypeFromJSON = l),
          (t.contractCodeHistoryOperationTypeToJSON = h),
          (t.AccessTypeParam = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.value && t.uint32(8).int32(e.value), t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { value: 0 };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.value = n.int32();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({ value: _(e.value) ? c(e.value) : 0 }),
            toJSON(e) {
              const t = {};
              return void 0 !== e.value && (t.value = u(e.value)), t;
            },
            fromPartial(e) {
              var t;
              const n = { value: 0 };
              return (
                (n.value = null !== (t = e.value) && void 0 !== t ? t : 0), n
              );
            },
          }),
          (t.AccessConfig = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.permission && t.uint32(8).int32(e.permission),
              "" !== e.address && t.uint32(18).string(e.address),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { permission: 0, address: "" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.permission = n.int32();
                    break;
                  case 2:
                    i.address = n.string();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              permission: _(e.permission) ? c(e.permission) : 0,
              address: _(e.address) ? String(e.address) : "",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.permission && (t.permission = u(e.permission)),
                void 0 !== e.address && (t.address = e.address),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { permission: 0, address: "" };
              return (
                (r.permission =
                  null !== (t = e.permission) && void 0 !== t ? t : 0),
                (r.address = null !== (n = e.address) && void 0 !== n ? n : ""),
                r
              );
            },
          }),
          (t.Params = {
            encode: (e, n = o.default.Writer.create()) => (
              void 0 !== e.codeUploadAccess &&
                t.AccessConfig.encode(
                  e.codeUploadAccess,
                  n.uint32(10).fork()
                ).ldelim(),
              0 !== e.instantiateDefaultPermission &&
                n.uint32(16).int32(e.instantiateDefaultPermission),
              "0" !== e.maxWasmCodeSize &&
                n.uint32(24).uint64(e.maxWasmCodeSize),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = {
                codeUploadAccess: void 0,
                instantiateDefaultPermission: 0,
                maxWasmCodeSize: "0",
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.codeUploadAccess = t.AccessConfig.decode(r, r.uint32());
                    break;
                  case 2:
                    s.instantiateDefaultPermission = r.int32();
                    break;
                  case 3:
                    s.maxWasmCodeSize = O(r.uint64());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              codeUploadAccess: _(e.codeUploadAccess)
                ? t.AccessConfig.fromJSON(e.codeUploadAccess)
                : void 0,
              instantiateDefaultPermission: _(e.instantiateDefaultPermission)
                ? c(e.instantiateDefaultPermission)
                : 0,
              maxWasmCodeSize: _(e.maxWasmCodeSize)
                ? String(e.maxWasmCodeSize)
                : "0",
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.codeUploadAccess &&
                  (n.codeUploadAccess = e.codeUploadAccess
                    ? t.AccessConfig.toJSON(e.codeUploadAccess)
                    : void 0),
                void 0 !== e.instantiateDefaultPermission &&
                  (n.instantiateDefaultPermission = u(
                    e.instantiateDefaultPermission
                  )),
                void 0 !== e.maxWasmCodeSize &&
                  (n.maxWasmCodeSize = e.maxWasmCodeSize),
                n
              );
            },
            fromPartial(e) {
              var n, r;
              const i = {
                codeUploadAccess: void 0,
                instantiateDefaultPermission: 0,
                maxWasmCodeSize: "0",
              };
              return (
                (i.codeUploadAccess =
                  void 0 !== e.codeUploadAccess && null !== e.codeUploadAccess
                    ? t.AccessConfig.fromPartial(e.codeUploadAccess)
                    : void 0),
                (i.instantiateDefaultPermission =
                  null !== (n = e.instantiateDefaultPermission) && void 0 !== n
                    ? n
                    : 0),
                (i.maxWasmCodeSize =
                  null !== (r = e.maxWasmCodeSize) && void 0 !== r ? r : "0"),
                i
              );
            },
          }),
          (t.CodeInfo = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.codeHash.length && n.uint32(10).bytes(e.codeHash),
              "" !== e.creator && n.uint32(18).string(e.creator),
              void 0 !== e.instantiateConfig &&
                t.AccessConfig.encode(
                  e.instantiateConfig,
                  n.uint32(42).fork()
                ).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = p();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.codeHash = r.bytes();
                    break;
                  case 2:
                    s.creator = r.string();
                    break;
                  case 5:
                    s.instantiateConfig = t.AccessConfig.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              codeHash: _(e.codeHash) ? y(e.codeHash) : new Uint8Array(),
              creator: _(e.creator) ? String(e.creator) : "",
              instantiateConfig: _(e.instantiateConfig)
                ? t.AccessConfig.fromJSON(e.instantiateConfig)
                : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.codeHash &&
                  (n.codeHash = S(
                    void 0 !== e.codeHash ? e.codeHash : new Uint8Array()
                  )),
                void 0 !== e.creator && (n.creator = e.creator),
                void 0 !== e.instantiateConfig &&
                  (n.instantiateConfig = e.instantiateConfig
                    ? t.AccessConfig.toJSON(e.instantiateConfig)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              var n, r;
              const i = p();
              return (
                (i.codeHash =
                  null !== (n = e.codeHash) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                (i.creator = null !== (r = e.creator) && void 0 !== r ? r : ""),
                (i.instantiateConfig =
                  void 0 !== e.instantiateConfig && null !== e.instantiateConfig
                    ? t.AccessConfig.fromPartial(e.instantiateConfig)
                    : void 0),
                i
              );
            },
          }),
          (t.ContractInfo = {
            encode: (e, n = o.default.Writer.create()) => (
              "0" !== e.codeId && n.uint32(8).uint64(e.codeId),
              "" !== e.creator && n.uint32(18).string(e.creator),
              "" !== e.admin && n.uint32(26).string(e.admin),
              "" !== e.label && n.uint32(34).string(e.label),
              void 0 !== e.created &&
                t.AbsoluteTxPosition.encode(
                  e.created,
                  n.uint32(42).fork()
                ).ldelim(),
              "" !== e.ibcPortId && n.uint32(50).string(e.ibcPortId),
              void 0 !== e.extension &&
                s.Any.encode(e.extension, n.uint32(58).fork()).ldelim(),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const a = {
                codeId: "0",
                creator: "",
                admin: "",
                label: "",
                created: void 0,
                ibcPortId: "",
                extension: void 0,
              };
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    a.codeId = O(r.uint64());
                    break;
                  case 2:
                    a.creator = r.string();
                    break;
                  case 3:
                    a.admin = r.string();
                    break;
                  case 4:
                    a.label = r.string();
                    break;
                  case 5:
                    a.created = t.AbsoluteTxPosition.decode(r, r.uint32());
                    break;
                  case 6:
                    a.ibcPortId = r.string();
                    break;
                  case 7:
                    a.extension = s.Any.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return a;
            },
            fromJSON: (e) => ({
              codeId: _(e.codeId) ? String(e.codeId) : "0",
              creator: _(e.creator) ? String(e.creator) : "",
              admin: _(e.admin) ? String(e.admin) : "",
              label: _(e.label) ? String(e.label) : "",
              created: _(e.created)
                ? t.AbsoluteTxPosition.fromJSON(e.created)
                : void 0,
              ibcPortId: _(e.ibcPortId) ? String(e.ibcPortId) : "",
              extension: _(e.extension) ? s.Any.fromJSON(e.extension) : void 0,
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.codeId && (n.codeId = e.codeId),
                void 0 !== e.creator && (n.creator = e.creator),
                void 0 !== e.admin && (n.admin = e.admin),
                void 0 !== e.label && (n.label = e.label),
                void 0 !== e.created &&
                  (n.created = e.created
                    ? t.AbsoluteTxPosition.toJSON(e.created)
                    : void 0),
                void 0 !== e.ibcPortId && (n.ibcPortId = e.ibcPortId),
                void 0 !== e.extension &&
                  (n.extension = e.extension
                    ? s.Any.toJSON(e.extension)
                    : void 0),
                n
              );
            },
            fromPartial(e) {
              var n, r, i, o, a;
              const d = {
                codeId: "0",
                creator: "",
                admin: "",
                label: "",
                created: void 0,
                ibcPortId: "",
                extension: void 0,
              };
              return (
                (d.codeId = null !== (n = e.codeId) && void 0 !== n ? n : "0"),
                (d.creator = null !== (r = e.creator) && void 0 !== r ? r : ""),
                (d.admin = null !== (i = e.admin) && void 0 !== i ? i : ""),
                (d.label = null !== (o = e.label) && void 0 !== o ? o : ""),
                (d.created =
                  void 0 !== e.created && null !== e.created
                    ? t.AbsoluteTxPosition.fromPartial(e.created)
                    : void 0),
                (d.ibcPortId =
                  null !== (a = e.ibcPortId) && void 0 !== a ? a : ""),
                (d.extension =
                  void 0 !== e.extension && null !== e.extension
                    ? s.Any.fromPartial(e.extension)
                    : void 0),
                d
              );
            },
          }),
          (t.ContractCodeHistoryEntry = {
            encode: (e, n = o.default.Writer.create()) => (
              0 !== e.operation && n.uint32(8).int32(e.operation),
              "0" !== e.codeId && n.uint32(16).uint64(e.codeId),
              void 0 !== e.updated &&
                t.AbsoluteTxPosition.encode(
                  e.updated,
                  n.uint32(26).fork()
                ).ldelim(),
              0 !== e.msg.length && n.uint32(34).bytes(e.msg),
              n
            ),
            decode(e, n) {
              const r =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let i = void 0 === n ? r.len : r.pos + n;
              const s = f();
              for (; r.pos < i; ) {
                const e = r.uint32();
                switch (e >>> 3) {
                  case 1:
                    s.operation = r.int32();
                    break;
                  case 2:
                    s.codeId = O(r.uint64());
                    break;
                  case 3:
                    s.updated = t.AbsoluteTxPosition.decode(r, r.uint32());
                    break;
                  case 4:
                    s.msg = r.bytes();
                    break;
                  default:
                    r.skipType(7 & e);
                }
              }
              return s;
            },
            fromJSON: (e) => ({
              operation: _(e.operation) ? l(e.operation) : 0,
              codeId: _(e.codeId) ? String(e.codeId) : "0",
              updated: _(e.updated)
                ? t.AbsoluteTxPosition.fromJSON(e.updated)
                : void 0,
              msg: _(e.msg) ? y(e.msg) : new Uint8Array(),
            }),
            toJSON(e) {
              const n = {};
              return (
                void 0 !== e.operation && (n.operation = h(e.operation)),
                void 0 !== e.codeId && (n.codeId = e.codeId),
                void 0 !== e.updated &&
                  (n.updated = e.updated
                    ? t.AbsoluteTxPosition.toJSON(e.updated)
                    : void 0),
                void 0 !== e.msg &&
                  (n.msg = S(void 0 !== e.msg ? e.msg : new Uint8Array())),
                n
              );
            },
            fromPartial(e) {
              var n, r, i;
              const o = f();
              return (
                (o.operation =
                  null !== (n = e.operation) && void 0 !== n ? n : 0),
                (o.codeId = null !== (r = e.codeId) && void 0 !== r ? r : "0"),
                (o.updated =
                  void 0 !== e.updated && null !== e.updated
                    ? t.AbsoluteTxPosition.fromPartial(e.updated)
                    : void 0),
                (o.msg =
                  null !== (i = e.msg) && void 0 !== i ? i : new Uint8Array()),
                o
              );
            },
          }),
          (t.AbsoluteTxPosition = {
            encode: (e, t = o.default.Writer.create()) => (
              "0" !== e.blockHeight && t.uint32(8).uint64(e.blockHeight),
              "0" !== e.txIndex && t.uint32(16).uint64(e.txIndex),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = { blockHeight: "0", txIndex: "0" };
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.blockHeight = O(n.uint64());
                    break;
                  case 2:
                    i.txIndex = O(n.uint64());
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              blockHeight: _(e.blockHeight) ? String(e.blockHeight) : "0",
              txIndex: _(e.txIndex) ? String(e.txIndex) : "0",
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.blockHeight && (t.blockHeight = e.blockHeight),
                void 0 !== e.txIndex && (t.txIndex = e.txIndex),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = { blockHeight: "0", txIndex: "0" };
              return (
                (r.blockHeight =
                  null !== (t = e.blockHeight) && void 0 !== t ? t : "0"),
                (r.txIndex =
                  null !== (n = e.txIndex) && void 0 !== n ? n : "0"),
                r
              );
            },
          }),
          (t.Model = {
            encode: (e, t = o.default.Writer.create()) => (
              0 !== e.key.length && t.uint32(10).bytes(e.key),
              0 !== e.value.length && t.uint32(18).bytes(e.value),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = g();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.key = n.bytes();
                    break;
                  case 2:
                    i.value = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              key: _(e.key) ? y(e.key) : new Uint8Array(),
              value: _(e.value) ? y(e.value) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.key &&
                  (t.key = S(void 0 !== e.key ? e.key : new Uint8Array())),
                void 0 !== e.value &&
                  (t.value = S(
                    void 0 !== e.value ? e.value : new Uint8Array()
                  )),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = g();
              return (
                (r.key =
                  null !== (t = e.key) && void 0 !== t ? t : new Uint8Array()),
                (r.value =
                  null !== (n = e.value) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                r
              );
            },
          });
        var m = (() => {
          if (void 0 !== m) return m;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const v =
          m.atob || ((e) => m.Buffer.from(e, "base64").toString("binary"));
        function y(e) {
          const t = v(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const b =
          m.btoa || ((e) => m.Buffer.from(e, "binary").toString("base64"));
        function S(e) {
          const t = [];
          for (const n of e) t.push(String.fromCharCode(n));
          return b(t.join(""));
        }
        function O(e) {
          return e.toString();
        }
        function _(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    752: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Params =
          t.Height =
          t.UpgradeProposal =
          t.ClientUpdateProposal =
          t.ClientConsensusStates =
          t.ConsensusStateWithHeight =
          t.IdentifiedClientState =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(94),
        a = n(753);
      function d(e) {
        return e.toString();
      }
      function c(e) {
        return null != e;
      }
      (t.protobufPackage = "ibc.core.client.v1"),
        (t.IdentifiedClientState = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.clientId && t.uint32(10).string(e.clientId),
            void 0 !== e.clientState &&
              s.Any.encode(e.clientState, t.uint32(18).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { clientId: "", clientState: void 0 };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.clientId = n.string();
                  break;
                case 2:
                  i.clientState = s.Any.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            clientId: c(e.clientId) ? String(e.clientId) : "",
            clientState: c(e.clientState)
              ? s.Any.fromJSON(e.clientState)
              : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.clientId && (t.clientId = e.clientId),
              void 0 !== e.clientState &&
                (t.clientState = e.clientState
                  ? s.Any.toJSON(e.clientState)
                  : void 0),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { clientId: "", clientState: void 0 };
            return (
              (n.clientId = null !== (t = e.clientId) && void 0 !== t ? t : ""),
              (n.clientState =
                void 0 !== e.clientState && null !== e.clientState
                  ? s.Any.fromPartial(e.clientState)
                  : void 0),
              n
            );
          },
        }),
        (t.ConsensusStateWithHeight = {
          encode: (e, n = o.default.Writer.create()) => (
            void 0 !== e.height &&
              t.Height.encode(e.height, n.uint32(10).fork()).ldelim(),
            void 0 !== e.consensusState &&
              s.Any.encode(e.consensusState, n.uint32(18).fork()).ldelim(),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const a = { height: void 0, consensusState: void 0 };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  a.height = t.Height.decode(r, r.uint32());
                  break;
                case 2:
                  a.consensusState = s.Any.decode(r, r.uint32());
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return a;
          },
          fromJSON: (e) => ({
            height: c(e.height) ? t.Height.fromJSON(e.height) : void 0,
            consensusState: c(e.consensusState)
              ? s.Any.fromJSON(e.consensusState)
              : void 0,
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.height &&
                (n.height = e.height ? t.Height.toJSON(e.height) : void 0),
              void 0 !== e.consensusState &&
                (n.consensusState = e.consensusState
                  ? s.Any.toJSON(e.consensusState)
                  : void 0),
              n
            );
          },
          fromPartial(e) {
            const n = { height: void 0, consensusState: void 0 };
            return (
              (n.height =
                void 0 !== e.height && null !== e.height
                  ? t.Height.fromPartial(e.height)
                  : void 0),
              (n.consensusState =
                void 0 !== e.consensusState && null !== e.consensusState
                  ? s.Any.fromPartial(e.consensusState)
                  : void 0),
              n
            );
          },
        }),
        (t.ClientConsensusStates = {
          encode(e, n = o.default.Writer.create()) {
            "" !== e.clientId && n.uint32(10).string(e.clientId);
            for (const r of e.consensusStates)
              t.ConsensusStateWithHeight.encode(
                r,
                n.uint32(18).fork()
              ).ldelim();
            return n;
          },
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { clientId: "", consensusStates: [] };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.clientId = r.string();
                  break;
                case 2:
                  s.consensusStates.push(
                    t.ConsensusStateWithHeight.decode(r, r.uint32())
                  );
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            clientId: c(e.clientId) ? String(e.clientId) : "",
            consensusStates: Array.isArray(
              null == e ? void 0 : e.consensusStates
            )
              ? e.consensusStates.map((e) =>
                  t.ConsensusStateWithHeight.fromJSON(e)
                )
              : [],
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.clientId && (n.clientId = e.clientId),
              e.consensusStates
                ? (n.consensusStates = e.consensusStates.map((e) =>
                    e ? t.ConsensusStateWithHeight.toJSON(e) : void 0
                  ))
                : (n.consensusStates = []),
              n
            );
          },
          fromPartial(e) {
            var n, r;
            const i = { clientId: "", consensusStates: [] };
            return (
              (i.clientId = null !== (n = e.clientId) && void 0 !== n ? n : ""),
              (i.consensusStates =
                (null === (r = e.consensusStates) || void 0 === r
                  ? void 0
                  : r.map((e) => t.ConsensusStateWithHeight.fromPartial(e))) ||
                []),
              i
            );
          },
        }),
        (t.ClientUpdateProposal = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.title && t.uint32(10).string(e.title),
            "" !== e.description && t.uint32(18).string(e.description),
            "" !== e.subjectClientId && t.uint32(26).string(e.subjectClientId),
            "" !== e.substituteClientId &&
              t.uint32(34).string(e.substituteClientId),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              title: "",
              description: "",
              subjectClientId: "",
              substituteClientId: "",
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.title = n.string();
                  break;
                case 2:
                  i.description = n.string();
                  break;
                case 3:
                  i.subjectClientId = n.string();
                  break;
                case 4:
                  i.substituteClientId = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            title: c(e.title) ? String(e.title) : "",
            description: c(e.description) ? String(e.description) : "",
            subjectClientId: c(e.subjectClientId)
              ? String(e.subjectClientId)
              : "",
            substituteClientId: c(e.substituteClientId)
              ? String(e.substituteClientId)
              : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.title && (t.title = e.title),
              void 0 !== e.description && (t.description = e.description),
              void 0 !== e.subjectClientId &&
                (t.subjectClientId = e.subjectClientId),
              void 0 !== e.substituteClientId &&
                (t.substituteClientId = e.substituteClientId),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i;
            const o = {
              title: "",
              description: "",
              subjectClientId: "",
              substituteClientId: "",
            };
            return (
              (o.title = null !== (t = e.title) && void 0 !== t ? t : ""),
              (o.description =
                null !== (n = e.description) && void 0 !== n ? n : ""),
              (o.subjectClientId =
                null !== (r = e.subjectClientId) && void 0 !== r ? r : ""),
              (o.substituteClientId =
                null !== (i = e.substituteClientId) && void 0 !== i ? i : ""),
              o
            );
          },
        }),
        (t.UpgradeProposal = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.title && t.uint32(10).string(e.title),
            "" !== e.description && t.uint32(18).string(e.description),
            void 0 !== e.plan &&
              a.Plan.encode(e.plan, t.uint32(26).fork()).ldelim(),
            void 0 !== e.upgradedClientState &&
              s.Any.encode(e.upgradedClientState, t.uint32(34).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              title: "",
              description: "",
              plan: void 0,
              upgradedClientState: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.title = n.string();
                  break;
                case 2:
                  i.description = n.string();
                  break;
                case 3:
                  i.plan = a.Plan.decode(n, n.uint32());
                  break;
                case 4:
                  i.upgradedClientState = s.Any.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            title: c(e.title) ? String(e.title) : "",
            description: c(e.description) ? String(e.description) : "",
            plan: c(e.plan) ? a.Plan.fromJSON(e.plan) : void 0,
            upgradedClientState: c(e.upgradedClientState)
              ? s.Any.fromJSON(e.upgradedClientState)
              : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.title && (t.title = e.title),
              void 0 !== e.description && (t.description = e.description),
              void 0 !== e.plan &&
                (t.plan = e.plan ? a.Plan.toJSON(e.plan) : void 0),
              void 0 !== e.upgradedClientState &&
                (t.upgradedClientState = e.upgradedClientState
                  ? s.Any.toJSON(e.upgradedClientState)
                  : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = {
              title: "",
              description: "",
              plan: void 0,
              upgradedClientState: void 0,
            };
            return (
              (r.title = null !== (t = e.title) && void 0 !== t ? t : ""),
              (r.description =
                null !== (n = e.description) && void 0 !== n ? n : ""),
              (r.plan =
                void 0 !== e.plan && null !== e.plan
                  ? a.Plan.fromPartial(e.plan)
                  : void 0),
              (r.upgradedClientState =
                void 0 !== e.upgradedClientState &&
                null !== e.upgradedClientState
                  ? s.Any.fromPartial(e.upgradedClientState)
                  : void 0),
              r
            );
          },
        }),
        (t.Height = {
          encode: (e, t = o.default.Writer.create()) => (
            "0" !== e.revisionNumber && t.uint32(8).uint64(e.revisionNumber),
            "0" !== e.revisionHeight && t.uint32(16).uint64(e.revisionHeight),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { revisionNumber: "0", revisionHeight: "0" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.revisionNumber = d(n.uint64());
                  break;
                case 2:
                  i.revisionHeight = d(n.uint64());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            revisionNumber: c(e.revisionNumber)
              ? String(e.revisionNumber)
              : "0",
            revisionHeight: c(e.revisionHeight)
              ? String(e.revisionHeight)
              : "0",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.revisionNumber &&
                (t.revisionNumber = e.revisionNumber),
              void 0 !== e.revisionHeight &&
                (t.revisionHeight = e.revisionHeight),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { revisionNumber: "0", revisionHeight: "0" };
            return (
              (r.revisionNumber =
                null !== (t = e.revisionNumber) && void 0 !== t ? t : "0"),
              (r.revisionHeight =
                null !== (n = e.revisionHeight) && void 0 !== n ? n : "0"),
              r
            );
          },
        }),
        (t.Params = {
          encode(e, t = o.default.Writer.create()) {
            for (const n of e.allowedClients) t.uint32(10).string(n);
            return t;
          },
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { allowedClients: [] };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.allowedClients.push(n.string());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            allowedClients: Array.isArray(null == e ? void 0 : e.allowedClients)
              ? e.allowedClients.map((e) => String(e))
              : [],
          }),
          toJSON(e) {
            const t = {};
            return (
              e.allowedClients
                ? (t.allowedClients = e.allowedClients.map((e) => e))
                : (t.allowedClients = []),
              t
            );
          },
          fromPartial(e) {
            var t;
            const n = { allowedClients: [] };
            return (
              (n.allowedClients =
                (null === (t = e.allowedClients) || void 0 === t
                  ? void 0
                  : t.map((e) => e)) || []),
              n
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    753: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ModuleVersion =
          t.CancelSoftwareUpgradeProposal =
          t.SoftwareUpgradeProposal =
          t.Plan =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28)),
        s = n(157),
        a = n(94);
      function d(e) {
        let t = 1e3 * Number(e.seconds);
        return (t += e.nanos / 1e6), new Date(t);
      }
      function c(e) {
        return e instanceof Date
          ? e
          : "string" == typeof e
          ? new Date(e)
          : d(s.Timestamp.fromJSON(e));
      }
      function u(e) {
        return e.toString();
      }
      function l(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.upgrade.v1beta1"),
        (t.Plan = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.name && t.uint32(10).string(e.name),
            void 0 !== e.time &&
              s.Timestamp.encode(
                (function (e) {
                  const t = Math.trunc(e.getTime() / 1e3).toString(),
                    n = (e.getTime() % 1e3) * 1e6;
                  return { seconds: t, nanos: n };
                })(e.time),
                t.uint32(18).fork()
              ).ldelim(),
            "0" !== e.height && t.uint32(24).int64(e.height),
            "" !== e.info && t.uint32(34).string(e.info),
            void 0 !== e.upgradedClientState &&
              a.Any.encode(e.upgradedClientState, t.uint32(42).fork()).ldelim(),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = {
              name: "",
              time: void 0,
              height: "0",
              info: "",
              upgradedClientState: void 0,
            };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.name = n.string();
                  break;
                case 2:
                  i.time = d(s.Timestamp.decode(n, n.uint32()));
                  break;
                case 3:
                  i.height = u(n.int64());
                  break;
                case 4:
                  i.info = n.string();
                  break;
                case 5:
                  i.upgradedClientState = a.Any.decode(n, n.uint32());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            name: l(e.name) ? String(e.name) : "",
            time: l(e.time) ? c(e.time) : void 0,
            height: l(e.height) ? String(e.height) : "0",
            info: l(e.info) ? String(e.info) : "",
            upgradedClientState: l(e.upgradedClientState)
              ? a.Any.fromJSON(e.upgradedClientState)
              : void 0,
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.name && (t.name = e.name),
              void 0 !== e.time && (t.time = e.time.toISOString()),
              void 0 !== e.height && (t.height = e.height),
              void 0 !== e.info && (t.info = e.info),
              void 0 !== e.upgradedClientState &&
                (t.upgradedClientState = e.upgradedClientState
                  ? a.Any.toJSON(e.upgradedClientState)
                  : void 0),
              t
            );
          },
          fromPartial(e) {
            var t, n, r, i;
            const o = {
              name: "",
              time: void 0,
              height: "0",
              info: "",
              upgradedClientState: void 0,
            };
            return (
              (o.name = null !== (t = e.name) && void 0 !== t ? t : ""),
              (o.time = null !== (n = e.time) && void 0 !== n ? n : void 0),
              (o.height = null !== (r = e.height) && void 0 !== r ? r : "0"),
              (o.info = null !== (i = e.info) && void 0 !== i ? i : ""),
              (o.upgradedClientState =
                void 0 !== e.upgradedClientState &&
                null !== e.upgradedClientState
                  ? a.Any.fromPartial(e.upgradedClientState)
                  : void 0),
              o
            );
          },
        }),
        (t.SoftwareUpgradeProposal = {
          encode: (e, n = o.default.Writer.create()) => (
            "" !== e.title && n.uint32(10).string(e.title),
            "" !== e.description && n.uint32(18).string(e.description),
            void 0 !== e.plan &&
              t.Plan.encode(e.plan, n.uint32(26).fork()).ldelim(),
            n
          ),
          decode(e, n) {
            const r =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let i = void 0 === n ? r.len : r.pos + n;
            const s = { title: "", description: "", plan: void 0 };
            for (; r.pos < i; ) {
              const e = r.uint32();
              switch (e >>> 3) {
                case 1:
                  s.title = r.string();
                  break;
                case 2:
                  s.description = r.string();
                  break;
                case 3:
                  s.plan = t.Plan.decode(r, r.uint32());
                  break;
                default:
                  r.skipType(7 & e);
              }
            }
            return s;
          },
          fromJSON: (e) => ({
            title: l(e.title) ? String(e.title) : "",
            description: l(e.description) ? String(e.description) : "",
            plan: l(e.plan) ? t.Plan.fromJSON(e.plan) : void 0,
          }),
          toJSON(e) {
            const n = {};
            return (
              void 0 !== e.title && (n.title = e.title),
              void 0 !== e.description && (n.description = e.description),
              void 0 !== e.plan &&
                (n.plan = e.plan ? t.Plan.toJSON(e.plan) : void 0),
              n
            );
          },
          fromPartial(e) {
            var n, r;
            const i = { title: "", description: "", plan: void 0 };
            return (
              (i.title = null !== (n = e.title) && void 0 !== n ? n : ""),
              (i.description =
                null !== (r = e.description) && void 0 !== r ? r : ""),
              (i.plan =
                void 0 !== e.plan && null !== e.plan
                  ? t.Plan.fromPartial(e.plan)
                  : void 0),
              i
            );
          },
        }),
        (t.CancelSoftwareUpgradeProposal = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.title && t.uint32(10).string(e.title),
            "" !== e.description && t.uint32(18).string(e.description),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { title: "", description: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.title = n.string();
                  break;
                case 2:
                  i.description = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            title: l(e.title) ? String(e.title) : "",
            description: l(e.description) ? String(e.description) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.title && (t.title = e.title),
              void 0 !== e.description && (t.description = e.description),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { title: "", description: "" };
            return (
              (r.title = null !== (t = e.title) && void 0 !== t ? t : ""),
              (r.description =
                null !== (n = e.description) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.ModuleVersion = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.name && t.uint32(10).string(e.name),
            "0" !== e.version && t.uint32(16).uint64(e.version),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { name: "", version: "0" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.name = n.string();
                  break;
                case 2:
                  i.version = u(n.uint64());
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            name: l(e.name) ? String(e.name) : "",
            version: l(e.version) ? String(e.version) : "0",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.name && (t.name = e.name),
              void 0 !== e.version && (t.version = e.version),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { name: "", version: "0" };
            return (
              (r.name = null !== (t = e.name) && void 0 !== t ? t : ""),
              (r.version = null !== (n = e.version) && void 0 !== n ? n : "0"),
              r
            );
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    766: function (e, t) {},
    768: function (e, t) {},
    77: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(631), t),
        i(n(366), t),
        i(n(635), t),
        i(n(638), t);
    },
    778: function (e, t) {},
    780: function (e, t) {},
    806: function (e, t) {},
    850: function (e, t) {},
    852: function (e, t) {},
    859: function (e, t) {},
    860: function (e, t) {},
    91: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__decorate) ||
          function (e, t, n, r) {
            var i,
              o = arguments.length,
              s =
                o < 3
                  ? t
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
            if (
              "object" == typeof Reflect &&
              "function" == typeof Reflect.decorate
            )
              s = Reflect.decorate(e, t, n, r);
            else
              for (var a = e.length - 1; a >= 0; a--)
                (i = e[a]) &&
                  (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
            return o > 3 && s && Object.defineProperty(t, n, s), s;
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableChainQueryMap = t.ObservableChainQuery = void 0);
      const o = n(199),
        s = i(n(62)),
        a = n(7),
        d = n(199);
      class c extends o.ObservableQuery {
        constructor(e, t, n, r) {
          const i = n.getChain(t);
          super(
            e,
            s.default.create(Object.assign({ baseURL: i.rest }, i.restConfig)),
            r
          ),
            (this._chainId = t),
            (this.chainGetter = n);
        }
        get instance() {
          const e = this.chainGetter.getChain(this.chainId);
          return s.default.create(
            Object.assign({ baseURL: e.rest }, e.restConfig)
          );
        }
        get chainId() {
          return this._chainId;
        }
      }
      r([a.override], c.prototype, "instance", null),
        (t.ObservableChainQuery = c);
      class u extends d.HasMapStore {
        constructor(e, t, n, r) {
          super(r),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n);
        }
      }
      t.ObservableChainQueryMap = u;
    },
    924: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__decorate) ||
        function (e, t, n, r) {
          var i,
            o = arguments.length,
            s =
              o < 3
                ? t
                : null === r
                ? (r = Object.getOwnPropertyDescriptor(t, n))
                : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            s = Reflect.decorate(e, t, n, r);
          else
            for (var a = e.length - 1; a >= 0; a--)
              (i = e[a]) &&
                (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
          return o > 3 && s && Object.defineProperty(t, n, s), s;
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ObservableQueryBalances =
          t.ObservableQueryBalancesInner =
          t.ObservableQueryBalanceInner =
            void 0);
      const i = n(91),
        o = n(29),
        s = n(7),
        a = n(32),
        d = n(199),
        c = n(252);
      class u extends i.ObservableChainQuery {
        constructor(e, t, n, r, i) {
          super(e, t, n, r), (this.denomHelper = i), s.makeObservable(this);
        }
        get currency() {
          const e = this.denomHelper.denom,
            t = this.chainGetter.getChain(this.chainId).findCurrency(e);
          if (!t) throw new Error("Unknown currency: " + e);
          return t;
        }
      }
      r([s.computed], u.prototype, "currency", null),
        (t.ObservableQueryBalanceInner = u);
      class l {
        constructor(e, t, n, r, i) {
          (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n),
            (this.balanceRegistries = r),
            (this.balanceMap = new Map()),
            (this.getBalanceFromCurrency = c.computedFn((e) => {
              const t = this.balances.find(
                (t) => t.currency.coinMinimalDenom === e.coinMinimalDenom
              );
              return t ? t.balance : new a.CoinPretty(e, new a.Int(0));
            })),
            s.makeObservable(this),
            (this.bech32Address = i);
        }
        fetch() {
          this.balanceMap.forEach((e) => e.fetch());
        }
        getBalanceInner(e) {
          let t = e.coinMinimalDenom;
          return (
            "type" in e &&
              "secret20" === e.type &&
              (t = e.coinMinimalDenom + "/" + e.viewingKey),
            this.balanceMap.has(t) ||
              s.runInAction(() => {
                let n;
                for (const t of this.balanceRegistries)
                  if (
                    ((n = t.getBalanceInner(
                      this.chainId,
                      this.chainGetter,
                      this.bech32Address,
                      e.coinMinimalDenom
                    )),
                    n)
                  )
                    break;
                if (!n)
                  throw new Error(
                    "Failed to get and parse the balance for " + t
                  );
                this.balanceMap.set(t, n);
              }),
            this.balanceMap.get(t)
          );
        }
        get stakable() {
          const e = this.chainGetter.getChain(this.chainId);
          return this.getBalanceInner(e.stakeCurrency);
        }
        get balances() {
          const e = this.chainGetter.getChain(this.chainId),
            t = [];
          for (let n = 0; n < e.currencies.length; n++) {
            const r = e.currencies[n];
            t.push(this.getBalanceInner(r));
          }
          return t;
        }
        get positiveBalances() {
          return this.balances.filter((e) =>
            e.balance.toDec().gt(new a.Dec(0))
          );
        }
        get nonNativeBalances() {
          return this.balances.filter(
            (e) =>
              "native" !== new o.DenomHelper(e.currency.coinMinimalDenom).type
          );
        }
        get positiveNativeUnstakables() {
          const e = this.chainGetter.getChain(this.chainId);
          return this.balances.filter(
            (t) =>
              "native" ===
                new o.DenomHelper(t.currency.coinMinimalDenom).type &&
              t.balance.toDec().gt(new a.Dec(0)) &&
              t.currency.coinMinimalDenom !== e.stakeCurrency.coinMinimalDenom
          );
        }
        get unstakables() {
          const e = this.chainGetter.getChain(this.chainId),
            t = e.currencies.filter(
              (t) => t.coinMinimalDenom !== e.stakeCurrency.coinMinimalDenom
            ),
            n = [];
          for (let e = 0; e < t.length; e++) {
            const r = t[e];
            n.push(this.getBalanceInner(r));
          }
          return n;
        }
      }
      r([s.observable.shallow], l.prototype, "balanceMap", void 0),
        r([s.computed], l.prototype, "stakable", null),
        r([s.computed], l.prototype, "balances", null),
        r([s.computed], l.prototype, "positiveBalances", null),
        r([s.computed], l.prototype, "nonNativeBalances", null),
        r([s.computed], l.prototype, "positiveNativeUnstakables", null),
        r([s.computed], l.prototype, "unstakables", null),
        (t.ObservableQueryBalancesInner = l);
      class h extends d.HasMapStore {
        constructor(e, t, n) {
          super(
            (e) =>
              new l(
                this.kvStore,
                this.chainId,
                this.chainGetter,
                this.balanceRegistries,
                e
              )
          ),
            (this.kvStore = e),
            (this.chainId = t),
            (this.chainGetter = n),
            (this.balanceRegistries = []);
        }
        addBalanceRegistry(e) {
          this.balanceRegistries.push(e);
        }
        getQueryBech32Address(e) {
          return this.get(e);
        }
      }
      t.ObservableQueryBalances = h;
    },
    93: function (e, t, n) {
      "use strict";
      var r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.DecProto =
          t.IntProto =
          t.DecCoin =
          t.Coin =
          t.protobufPackage =
            void 0);
      const i = r(n(25)),
        o = r(n(28));
      function s(e) {
        return null != e;
      }
      (t.protobufPackage = "cosmos.base.v1beta1"),
        (t.Coin = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.denom && t.uint32(10).string(e.denom),
            "" !== e.amount && t.uint32(18).string(e.amount),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { denom: "", amount: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.denom = n.string();
                  break;
                case 2:
                  i.amount = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            denom: s(e.denom) ? String(e.denom) : "",
            amount: s(e.amount) ? String(e.amount) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.denom && (t.denom = e.denom),
              void 0 !== e.amount && (t.amount = e.amount),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { denom: "", amount: "" };
            return (
              (r.denom = null !== (t = e.denom) && void 0 !== t ? t : ""),
              (r.amount = null !== (n = e.amount) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.DecCoin = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.denom && t.uint32(10).string(e.denom),
            "" !== e.amount && t.uint32(18).string(e.amount),
            t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { denom: "", amount: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.denom = n.string();
                  break;
                case 2:
                  i.amount = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({
            denom: s(e.denom) ? String(e.denom) : "",
            amount: s(e.amount) ? String(e.amount) : "",
          }),
          toJSON(e) {
            const t = {};
            return (
              void 0 !== e.denom && (t.denom = e.denom),
              void 0 !== e.amount && (t.amount = e.amount),
              t
            );
          },
          fromPartial(e) {
            var t, n;
            const r = { denom: "", amount: "" };
            return (
              (r.denom = null !== (t = e.denom) && void 0 !== t ? t : ""),
              (r.amount = null !== (n = e.amount) && void 0 !== n ? n : ""),
              r
            );
          },
        }),
        (t.IntProto = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.int && t.uint32(10).string(e.int), t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { int: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.int = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({ int: s(e.int) ? String(e.int) : "" }),
          toJSON(e) {
            const t = {};
            return void 0 !== e.int && (t.int = e.int), t;
          },
          fromPartial(e) {
            var t;
            const n = { int: "" };
            return (n.int = null !== (t = e.int) && void 0 !== t ? t : ""), n;
          },
        }),
        (t.DecProto = {
          encode: (e, t = o.default.Writer.create()) => (
            "" !== e.dec && t.uint32(10).string(e.dec), t
          ),
          decode(e, t) {
            const n =
              e instanceof o.default.Reader ? e : new o.default.Reader(e);
            let r = void 0 === t ? n.len : n.pos + t;
            const i = { dec: "" };
            for (; n.pos < r; ) {
              const e = n.uint32();
              switch (e >>> 3) {
                case 1:
                  i.dec = n.string();
                  break;
                default:
                  n.skipType(7 & e);
              }
            }
            return i;
          },
          fromJSON: (e) => ({ dec: s(e.dec) ? String(e.dec) : "" }),
          toJSON(e) {
            const t = {};
            return void 0 !== e.dec && (t.dec = e.dec), t;
          },
          fromPartial(e) {
            var t;
            const n = { dec: "" };
            return (n.dec = null !== (t = e.dec) && void 0 !== t ? t : ""), n;
          },
        }),
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
    },
    94: function (e, t, n) {
      "use strict";
      (function (e) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Any = t.protobufPackage = void 0);
        const i = r(n(25)),
          o = r(n(28));
        function s() {
          return { typeUrl: "", value: new Uint8Array() };
        }
        (t.protobufPackage = "google.protobuf"),
          (t.Any = {
            encode: (e, t = o.default.Writer.create()) => (
              "" !== e.typeUrl && t.uint32(10).string(e.typeUrl),
              0 !== e.value.length && t.uint32(18).bytes(e.value),
              t
            ),
            decode(e, t) {
              const n =
                e instanceof o.default.Reader ? e : new o.default.Reader(e);
              let r = void 0 === t ? n.len : n.pos + t;
              const i = s();
              for (; n.pos < r; ) {
                const e = n.uint32();
                switch (e >>> 3) {
                  case 1:
                    i.typeUrl = n.string();
                    break;
                  case 2:
                    i.value = n.bytes();
                    break;
                  default:
                    n.skipType(7 & e);
                }
              }
              return i;
            },
            fromJSON: (e) => ({
              typeUrl: l(e.typeUrl) ? String(e.typeUrl) : "",
              value: l(e.value) ? c(e.value) : new Uint8Array(),
            }),
            toJSON(e) {
              const t = {};
              return (
                void 0 !== e.typeUrl && (t.typeUrl = e.typeUrl),
                void 0 !== e.value &&
                  (t.value = (function (e) {
                    const t = [];
                    for (const n of e) t.push(String.fromCharCode(n));
                    return u(t.join(""));
                  })(void 0 !== e.value ? e.value : new Uint8Array())),
                t
              );
            },
            fromPartial(e) {
              var t, n;
              const r = s();
              return (
                (r.typeUrl = null !== (t = e.typeUrl) && void 0 !== t ? t : ""),
                (r.value =
                  null !== (n = e.value) && void 0 !== n
                    ? n
                    : new Uint8Array()),
                r
              );
            },
          });
        var a = (() => {
          if (void 0 !== a) return a;
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw "Unable to locate global object";
        })();
        const d =
          a.atob || ((e) => a.Buffer.from(e, "base64").toString("binary"));
        function c(e) {
          const t = d(e),
            n = new Uint8Array(t.length);
          for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
          return n;
        }
        const u =
          a.btoa || ((e) => a.Buffer.from(e, "binary").toString("base64"));
        function l(e) {
          return null != e;
        }
        o.default.util.Long !== i.default &&
          ((o.default.util.Long = i.default), o.default.configure());
      }.call(this, n(17)));
    },
    962: function (e, t) {},
    963: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    964: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    965: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    966: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    967: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }), i(n(968), t);
    },
    968: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    969: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    970: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.EthSignType = void 0),
        (function (e) {
          (e.MESSAGE = "message"),
            (e.TRANSACTION = "transaction"),
            (e.EIP712 = "eip-712");
        })(t.EthSignType || (t.EthSignType = {}));
    },
    971: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    972: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
    },
    975: function (e, t) {},
    98: function (e, t, n) {
      "use strict";
      var r =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, n, r) {
                void 0 === r && (r = n),
                  Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: function () {
                      return t[n];
                    },
                  });
              }
            : function (e, t, n, r) {
                void 0 === r && (r = n), (e[r] = t[n]);
              }),
        i =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var n in e)
              "default" === n ||
                Object.prototype.hasOwnProperty.call(t, n) ||
                r(t, e, n);
          };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        i(n(963), t),
        i(n(964), t),
        i(n(965), t),
        i(n(966), t),
        i(n(967), t),
        i(n(969), t),
        i(n(970), t),
        i(n(971), t),
        i(n(972), t);
    },
  },
]);
