# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-03-26

### Breaking Changes
- Upgraded to Fabric.js 7.x (from 6.x)
- Import syntax changed: use named imports (`import { Rect } from 'fabric'`) instead of namespace (`fabric.Rect`)

### Changed
- Updated all Fabric.js imports to use named exports
- Set default object origins to `left`/`top` for intuitive positioning (Fabric.js 7.x defaults to `center`/`center`)
- Updated README examples to reflect new Fabric.js 7.x import syntax
- Improved test coverage and mock implementations

### Fixed
- Selection rectangles and objects now position correctly from top-left corner
- Maintains backward compatibility with existing code expecting top-left positioning

## [1.3.0] - Previous Release

### Added
- Initial stable release with Fabric.js 6.x support
