# Integrating Calfin

The calculation engine is independent of Electron, persistence and UI. It uses built-in JavaScript only. Include `src/data.js` and `src/engine.js` together.

```js
const Calfin = require('./src/engine.js');
const Data = require('./src/data.js');
const workspace = Data.workspace();
const issues = Calfin.validate(workspace);
if (issues.length) throw new Error(issues.join('; '));
const result = Calfin.calculate(workspace);
```

Browser scripts expose `window.CalfinData` and `window.Calfin`. Frameworks can wrap `calculate` in their state updates. The functions do not mutate their inputs or make network requests.

## Data contract v1

A workspace contains `schemaVersion: 1`, `selectedId`, and `companies`. Factories produce complete empty templates. Null is a pending numeric value, not zero or infinity. Rates are fractions: `0.15` is 15%. Amounts use the company currency, not mixed currencies.

Each company contains identity, `fixed`, `offers`, `reports`, `contracts`, `settings` and a `forecast` with 36 explicit monthly rows. Offer IDs are stable and monthly `units` maps refer to them. Removing an offer must remove those references. Reports have unique months and contracts have unique IDs within a company.

`calculate` validates the workspace structure, then returns the selected company's results. A module with missing business inputs returns `ok: false` and `issues`. A structurally invalid workspace throws `InputError`. Actual monthly results have separate `operating`, `cash`, `evidence`, and `confirmed` outputs. Never replace pending modules with plausible zero results.

`analyze`, `economics`, `breakEven`, `technical`, `actualReport`, `commissionRecord` and `forecast` are available for trusted application code. Validate untrusted payloads with `validate`/`calculate` first. Client-side declarations of reconciliation are not server authorization.

## Production responsibilities

1. Authenticate and authorize access by business/tenant.
2. Validate payload sizes (desktop limit: 5 MB), shapes and business constraints.
3. Read approved policies and verified transaction records on the server; recalculate there.
4. Version snapshots, policy IDs, authors, dates and supporting evidence.
5. Preserve historical contracts when scenario/catalog prices change.
6. Keep calculation, approval, payment scheduling and payment execution separate.
7. Provide concurrency protection, encrypted backups and audited access where required.
8. Reconcile taxes, refunds, rounding, inventory and debt schedules with the actual accounting system.

The desktop application is single-user/local-file software. It does not provide enterprise authentication, encrypted storage, immutable audit trails or automatic bank reconciliation. Do not expose its internal data as a public dashboard.

## Desktop boundary

Renderer: sandboxed, context-isolated, no Node integration, strict local Content Security Policy, no remote requests. Preload exposes only load/save/import/export operations. Main checks sender identity and URL, validates files and writes the fixed internal workspace path atomically. Arbitrary file export/import paths require a native user dialog.

The smoke test validates loading, renderer isolation, bridge presence and a save/load round trip in an isolated directory. Windows CI also tests installing and starting the packaged application. These are not comprehensive security audits.
