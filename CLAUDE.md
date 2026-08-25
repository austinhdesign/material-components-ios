# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Material Components for iOS (MDC-iOS) has been in **maintenance mode since July 15, 2021**
(see `README.md`). Releases are best-effort, feature requests are closed, and `.md`
documentation is no longer actively maintained — treat docs (including this file, prior to
your edits) as potentially stale and verify against actual source before relying on it.
Bug fixes are still accepted on a best-effort basis.

## What this repository is

A CocoaPods-distributed collection of ~50 independent Material Design UI component libraries
for iOS, written primarily in Objective-C. Each component under `components/` is meant to be
usable in isolation with minimal cross-component dependencies. The single `MaterialComponents`
pod (defined in `MaterialComponents.podspec`) exposes every component as a subspec, e.g.
`pod 'MaterialComponents/Buttons'`.

Note: this checkout does **not** contain the `catalog/` (MDCCatalog demo app) or `demos/`
directories that many scripts and docs (`scripts/build_all`, `scripts/test_all`,
`contributing/README.md`) reference — they are not tracked in this repo's git history. Workflows
that depend on `catalog/MDCCatalog.xcworkspace` will not work as-is here; component-level
CocoaPods test/example specs (below) are the reliable way to build/test in this checkout.

## Repository layout

- `components/<ComponentName>/` — one directory per public component (`Buttons`, `Cards`,
  `Dialogs`, `Snackbar`, etc.). Each has a consistent internal structure:
  - `src/` — implementation (`.h`/`.m`). Anything under a `src/.../private/` subdirectory is
    a private header and is **not** part of the public API (see Versioning below).
  - `src/<X>Themer/` or `src/Theming/` — "themer" classes/categories that apply a color/typography
    scheme to a component instance (see Theming below). Older GM2-style themers are marked
    `API_DEPRECATED` in favor of the M3C replacements.
  - `examples/` — Swift/Objective-C example view controllers, auto-surfaced in the (absent)
    catalog app via "Catalog by Convention".
  - `tests/unit/` and `tests/snapshot/` — unit tests and golden-image snapshot tests.
  - `docs/` — component-specific markdown docs and screenshots.
  - `README.md` — required for every component; see `contributing/writing_readmes.md` for the
    template (Swift usage sample before Objective-C sample).
- `components/private/` — internal-only support libraries shared across components (e.g.
  `Math`, `Color`, `ThumbTrack`, `KeyboardWatcher`, `Icons`), not exposed as a standalone pod
  subspec for public use in the same way.
- `components/schemes/` — `Color`, `Typography`, `Shape`, `Container`, `Bidirectionality` scheme
  types used to theme components consistently.
- `components/M3CButton/`, `components/M3CTextField/` — newer, actively-developed
  Material 3 ("M3C") component implementations; these are the recommended replacements for the
  older `Buttons`/`TextFields` + `*Themer` GM2 pattern.
- `scripts/` — all build/lint/release tooling (bash + a couple of Python/Ruby helpers). See
  Commands below.
- `contributing/` — contribution policy, code conventions, checklist, and doc-writing guides.
  Read `contributing/code-conventions.md` and `contributing/checklist.md` before adding a
  component or making non-trivial changes.
- `docs/` — general usage docs (installation, build environment, FAQ).
- `snapshot_test_goldens/` — git-lfs-tracked reference PNGs for snapshot tests.
- `MaterialComponents.podspec` — the source of truth for which files belong to which component
  subspec and their inter-component dependencies. **Any new file, resource, or dependency for a
  component must be reflected here.**
- `MaterialComponentsExamples.podspec` — aggregates every component's `examples/` sources (used
  by the catalog).
- `MaterialComponentsSnapshotTests.podspec` — aggregates snapshot test subspecs.
- `MaterialComponentsEarlGreyTests.podspec` — EarlGrey UI test subspec.
- `VERSION` — single source of truth for the current version string; use
  `scripts/print_version` to read it, `scripts/release/bump` to change it (part of the release
  process, not day-to-day development).

## Commands

Prerequisites: Xcode + CocoaPods, and `git-lfs` (required for snapshot test goldens —
`brew install git-lfs && git lfs install && git lfs pull`).

Building/testing a single component (the practical workflow in this checkout, since `catalog/`
isn't present):
```bash
# From a scratch/example directory with a Podfile that references this repo, e.g.:
#   pod 'MaterialComponents/Buttons', :path => '<repo-root>'
pod install
```
Or exercise a component's own test subspecs directly via `xcodebuild`/`pod lib lint` against
the relevant subspec in `MaterialComponents.podspec` (unit tests: `.../tests/unit`; snapshot
tests: `.../tests/snapshot`, require `--allow-warnings` app-host setup per
`contributing/writing_snapshot_tests.md`).

Repo-wide scripts (assume a `catalog/`/`demos/` workspace that isn't checked into this repo, so
treat as reference/CI-only unless you've reconstructed that workspace):
```bash
scripts/prep_all              # pod repo update + pod install across all Podfile dirs
scripts/build_all [--verbose] # xcodebuild every discovered Xcode scheme
scripts/test_all              # xcodebuild test (defaults to MDCCatalog scheme/workspace)
```

Component checklist / structural checks (works without the catalog app):
```bash
scripts/check_components                                   # run all checks on all components
scripts/check_components components/Buttons components/Cards  # specific components
scripts/check_components -c scripts/check/readme            # a specific check only
```
Individual checks live as small scripts in `scripts/check/`.

Formatting and linting:
```bash
# Format staged/diffed Objective-C changes against develop (preferred for a PR):
git clang-format $(git merge-base origin/develop HEAD)

# Format everything (Obj-C via clang-format, Swift via swiftlint autocorrect):
scripts/format_all

# Lint Swift only (catalog, components, demos dirs):
scripts/lint_all
```
clang-format style is defined in `.clang-format` (see `contributing/clang-format.md` for
install instructions). SwiftLint config is `.swiftlint.yml` (100-char line length;
`cyclomatic_complexity`, `force_cast`, `todo`, `type_name` rules disabled).

Other useful scripts:
```bash
scripts/list_components [--public|--private]  # list component directories
scripts/print_version                          # print current VERSION
scripts/generate_readme <component>             # scaffold a component README from the template
```

## Architecture and conventions

### Language rules
- **Objective-C is required** for component implementation (`src/`). Swift is not permitted for
  implementation code.
- **Swift is encouraged** for unit tests, UI tests, and example/demo code, alongside
  Objective-C. When only one example is written, prefer Swift; component READMEs must show the
  Swift snippet before the Objective-C one.
- Style follows [Google's Objective-C style guide](https://google.github.io/styleguide/objcguide.xml)
  (itself layered on the Google C++ style guide). Full details: `contributing/code-conventions.md`.
- Nullability: annotate all public APIs explicitly with `_Nullable`/`_Nonnull` (not
  `__nullable`/`__nonnull`); don't rely on `NS_ASSUME_NONNULL_BEGIN`/`END` for public headers.
- Avoid macros except for platform-version macros; prefer `static inline` C functions.
- `UIView` subclasses must implement both `initWithFrame:` and `initWithCoder:`, both calling a
  shared `commonMDC<ClassName>Init` method.

### Theming pattern
Components expose visual customization through **Themer** classes/categories (e.g.
`MDCButtonColorThemer`, `MDCContainedButtonThemer`, `MDC<X>+MaterialTheming`) that apply a
`MDCContainerScheme` (color/typography/shape scheme from `components/schemes/`) onto a component
instance: `applyColorScheme:toComponent:` / `applyThemeToButton:` conventions. Newer components
(`M3CButton`, `M3CTextField`) largely supersede the older GM2 `*Themer` classes; many GM2 themers
are now marked `API_DEPRECATED` pointing at the M3C equivalents — prefer M3C components/patterns
for new work unless matching existing GM2 usage in the same file/PR.

### Dependency minimization
Components should have as few dependencies on each other as possible — each component should be
addable/removable from a project independently. Avoid growing "utility" components; put genuinely
shared internal code in `components/private/`.

### Component/private split
`src/private/` subdirectories (and the `components/private/` top-level components) are internal
implementation details, not public API — they are excluded from public-header lists in the
podspec and are not covered by semantic-versioning compatibility guarantees.

### Versioning and compatibility
Semantic versioning (`MAJOR.minor.patch`); the public API surface is defined as anything in a
non-private header. Any change that breaks a build against the previous release is a breaking
change requiring a major bump. See `contributing/versions.md`.

### Naming and PR conventions
- Prefix issue/PR titles with `[ComponentName]` (or `[ComponentA|ComponentB]` for the rare
  multi-component change): `[Buttons] Fix dynamic type size for icons`.
- Every source file needs the Apache 2.0 license header attributed to "the Material Components
  for iOS authors" (see `contributing/checklist.md` for the exact stanza).
- Unit test files live in `components/<Name>/tests/unit/`; tests targeting a specific GitHub
  issue are named `ClassNameIssue<N>Tests`.
- New/changed component files, resources, and dependencies must be reflected in
  `MaterialComponents.podspec` (and the relevant test-spec podspec) or they won't ship or be
  tested.
- Designated initializers use `NS_DESIGNATED_INITIALIZER`; unwanted inherited initializers should
  be marked `NS_UNAVAILABLE`.
- Prefer `.leading`/`.trailing` over `.left`/`.right` for RTL support.

### Snapshot tests
Reference images are stored via git-lfs in `snapshot_test_goldens/` and are generated/verified
only against the **iPhone 7, iOS 11.2 simulator** (results differ across devices/OS versions).
To add a new golden, set `self.recordMode = YES` temporarily in the test, run once on that
simulator, then remove `recordMode` before committing. Full walkthrough (including podspec/Podfile
wiring for a component's first snapshot test target):
`contributing/writing_snapshot_tests.md`.

### CI
Continuous integration for external PRs requires a `kokoro:force-run` label from a repo member
with write access (re-added after every new push) unless the author is on the core team or
recognized-collaborators list.
