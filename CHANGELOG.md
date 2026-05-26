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
