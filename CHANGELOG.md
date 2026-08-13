## [1.0.2](https://github.com/wyre-technology/node-kaseya-quote-manager/compare/v1.0.1...v1.0.2) (2026-08-13)


### Bug Fixes

* **deps:** re-pin typescript to ^6.0.3, main is broken on 7.0.2 (again) ([#10](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/10)) ([904cb4f](https://github.com/wyre-technology/node-kaseya-quote-manager/commit/904cb4f9ad3d3f866d98b4f1b04dec0b20e3c324)), closes [#9](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/9) [#7](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/7) [#7](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/7) [#9](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/9)

## [1.0.1](https://github.com/wyre-technology/node-kaseya-quote-manager/compare/v1.0.0...v1.0.1) (2026-07-22)


### Bug Fixes

* **deps:** re-pin typescript to ^6.0.3 + ignoreDeprecations for TS7 DTS build breakage ([#7](https://github.com/wyre-technology/node-kaseya-quote-manager/issues/7)) ([459f6a8](https://github.com/wyre-technology/node-kaseya-quote-manager/commit/459f6a829f772d7fb325d49e6a4de378cb78b2c4)), closes [blackpoint-mcp#44](https://github.com/blackpoint-mcp/issues/44)

# 1.0.0 (2026-05-26)


### Features

* initial Kaseya Quote Manager (Datto Commerce) API client ([af27057](https://github.com/wyre-technology/node-kaseya-quote-manager/commit/af27057779fb5d8c185d3511bd6df34229842208))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of the Kaseya Quote Manager (Datto Commerce) API client.
- Read-only `list` + `get` coverage for all 20 resources: quotes, quote sections,
  quote lines, sales orders, sales order lines, sales order payments, purchase orders,
  purchase order lines, purchase order costs, suppliers, product suppliers, products,
  product images, categories, brands, customers, customer addresses, contacts,
  employees, and warehouses.
- `apiKey` header authentication.
- Client-side rate limiter (60 req/min default) and automatic retry on 429/5xx.
- Typed error hierarchy rooted at `KaseyaQuoteManagerError`.
