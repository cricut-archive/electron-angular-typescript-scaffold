# electron-scaffold


CodeShip | Travis | AppVeyor | Codecov
--- | --- | --- | ---
[ ![Codeship Status for cschear/electron-angular-typescript-scaffold](https://app.codeship.com/projects/29b8a030-c178-0135-0e80-2a7d302f47bf/status?branch=feature/initial-release)](https://app.codeship.com/projects/260343) | [![Build Status](https://travis-ci.org/cschear/electron-angular-typescript-scaffold.svg?branch=feature%2Finitial-release)](https://travis-ci.org/cschear/electron-angular-typescript-scaffold) | [![Build status](https://ci.appveyor.com/api/projects/status/7cb45j0xjdov0v8r/branch/feature/initial-release?svg=true)](https://ci.appveyor.com/project/cschear/electron-angular-typescript-scaffold/branch/feature/initial-release) | [![codecov](https://codecov.io/gh/cschear/electron-angular-typescript-scaffold/branch/feature%2Finitial-release/graph/badge.svg)](https://codecov.io/gh/cschear/electron-angular-typescript-scaffold)

### Todo

 - Karma / Mocha tests with coverage.
 - Electron app running with node dependencies allowed, but set to null in browser.
 - Codeship or Travis CI
 - Codecov CI
 - Less / Sass Styles
 - Static Assets
 

### Done
- Webpack 3 build for Typescript
  - TSLint
  - [ForkTsChecker](https://github.com/Realytics/fork-ts-checker-webpack-plugin) for faster TS builds
- Basic AngularJS framework added
 - Vendor modules split from build using [Webpack DllPlugin](https://webpack.js.org/plugins/dll-plugin/)
 - Build results profiling ([Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) / [Analyzer Site](https://webpack.github.io/analyse/))
- Split logic into multiple self contained modules.