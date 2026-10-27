# Contributing

Open an issue describing the business case, expected behavior and synthetic reproduction. Do not publish company records, customer details or credentials.

For changes:

1. Keep the financial engine independent of UI and storage.
2. Preserve null/pending values and distinguish actuals from scenarios.
3. Explain monetary units, rounding and accounting assumptions.
4. Add regression tests and independently calculated expected results.
5. Run the unit suite, Python Decimal oracle and browser tests.
6. Test native Windows changes before proposing a release.
7. Update the guide and limitations. Do not promise tax compliance or optimal prices.

Avoid new dependencies without a clear need. Keep direct versions pinned and update the lock file deliberately. Changes to the persisted structure need explicit migrations, never silent reinterpretation of existing files.

The project uses MIT. Contributions must be compatible with that license; third-party components retain their own terms.
