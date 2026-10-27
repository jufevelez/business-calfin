# Business Calfin

> **Source update 0.2.0 (staged development).** Optional user-funded AI and dated reports are described in [AI.md](docs/AI.md). The latest downloadable installer is still 0.1.0, unsigned, and does not include these additions. No new installer is published until code signing is verified. Logos, dashboard layout customization and up to three report signatories remain the next stage.

**Pricing and financial clarity for entrepreneurs. Local-first. MIT.**

Business Calfin helps small businesses, brands and tech founders understand what they sell, what each sale contributes, what the operation earns and how much cash remains. The interface and practical guide are in Spanish.

## Download / Descargar

- [Windows x64 installer and verification files](https://github.com/jufevelez/business-calfin/releases/latest)
- [Build and test runs](https://github.com/jufevelez/business-calfin/actions)
- [Guía para no financieros](docs/GUIA.md)
- [Integrating the calculation engine](docs/INTEGRATION.md)

**Target:** Windows 10/11, 64-bit. An installer is released only after the Windows build and automated checks pass. Until the first successful release, the download link has no installer. Releases include SHA-256 checksums and verification results. The executable is **unsigned**: Windows may show an unknown-publisher warning. Do not disable security software; verify the source and checksum before choosing to install.

## What it does

- Separate workspaces for up to 30 businesses: name, currency and brand color.
- Custom products, services and subscriptions; up to 100 offers per company.
- Unit economics, variable/fixed costs, commission scenarios, break-even mix and capacity.
- Technical price thresholds distinguished from value and willingness to pay.
- **Declared actual monthly results** separate from projections and scenario prices.
- Cash reconciliation: sales are not collections; financing is not operating profit.
- Configurable contract commissions, collection conditions, refunds and overpayments.
- Explicit monthly sales and cash scenarios, up to 36 months.
- Local save, previous-save backup, validated import/export, CSV and printable results.
- A reusable financial engine with no UI, storage or network dependencies.

## Start in three steps

1. Create a business and choose its currency. Currency changes do not convert amounts.
2. Record a real month, or explore a clearly labeled synthetic example.
3. Complete fixed costs and offers, then test prices, units and commission rules.

**No private business data is included.** The software starts empty. All sample businesses and financial figures are fictional.

## Important boundaries

This is a decision-support tool, not accounting software, a bank connector or tax advice. It does not execute payments or publish commercial prices. It does not automatically manage inventory valuation, subscription cohorts, annual prepayments, depreciation, multi-currency consolidation or loan amortization.

A record labeled **“Declarado conciliado”** reflects the operator's declaration and evidence references, not an independent audit. Missing inputs remain unknown; they are not silently converted to zero. A technical price threshold does not prove market acceptance.

The desktop file is local and **not encrypted**. Protect the device and exported backups. There is no telemetry or remote financial-data upload.

## Development

Node.js 22+, npm and Python 3 are used for development. The completed Windows installer requires none of them.

```bash
npm ci
npm run prepare:assets
npm test
python3 tests/check_decimal.py
npx playwright install chromium
npm run test:browser
npm start
```

On Windows, use `python tests/check_decimal.py` if `python3` is not available. Before the first successful release, use `npm install` if the dependency lock is not present. The initial Windows build resolves the pinned direct dependencies, verifies the application and commits the generated lock only after checks pass; later builds use `npm ci`.

Build on Windows:

```powershell
npm run dist:win
npm run checksums
```

The Electron renderer uses sandboxing, context isolation and no Node integration. The preload exposes a small set of validated file operations, not a general filesystem API. Production integrations must supply their own authentication, permissions and audit history.

## Verification

Financial tests, an independent Python Decimal oracle, browser tests and Windows desktop/installer smoke tests run before a release. Read the release's `verification.json` for checks actually completed. A Windows Server CI smoke test is not a manual test on every Windows 10/11 device.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Preserve the distinction between actuals, estimates and simulations. Financial changes need independent expected results and regression tests. Never attach private company data to a public issue.

## License

[MIT](LICENSE), copyright 2026 jufevelez. Third-party Electron and build dependencies retain their own licenses. No warranty of financial, legal or commercial outcomes.
