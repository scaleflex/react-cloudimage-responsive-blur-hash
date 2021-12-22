# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of changes:
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

> Date format: YYYY-MM-DD

> If we have some "Breaking changes" we can mark it in message by `**BREAKING**` preffix, like:  
> `- **BREAKING**: Some message`

-------------

## TODOs
> Todo list for future

- ...

-------------
## 1.6.3 - 2021-12-22
### Fixed
-  img-src starts with "//"

## 1.6.2 - 2021-11-17
### Fixed
- possibility to remove API versions

## 1.6.1 - 2021-07-27
### Fixed
- domain property in config

## 1.6.0 - 2021-07-23
### Added
- new property: **customDomain**

## 1.5.0 - 2021-07-19

### Deprecated

- Property **ignoreNodeImgSize** is deprecated. Use **imageSizeAttributes: 'ignore'** instead

### Added
- new property: **imageSizeAttributes**
## 1.4.1 - 2020-04-29

### Added
- lazyloading dependency

## 1.4.0 - 2020-04-29

### Added
- missing properties in the documentation (README), fix some mistakes

### Fixed
- problem with not setting ratio on preview load when no image is set

## 1.2.0 - 2020-04-22

### Changed
- improve logic structure / core refactoring

## 1.1.1 - 2020-04-16

### Added
- separate build without polyfills to support Gatsby

## 1.1.0 - 2020-04-02

### Changed
- babel version from 6.x.x to 7.x.x
