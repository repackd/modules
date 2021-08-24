## modules

### lerna

#### links

- https://github.com/lerna/lerna/

#### creating packages

```sh
# Creating a new package
mkdir ./packages/new-package
cd ./packages/new-package
yarn init
yarn add mime-types
cd ../../
npx lerna add @joshxyzhimself/existing-package --scope=@joshxyzhimself/new-package --dev --peer
npx lerna bootstrap
```

#### testing packages

```sh
# bootstrap
npx lerna bootstrap --no-ci


# testing
npx lerna run test
```

#### publishing packages (with gpr)

```sh
# create your GitHub Personal Access Token
# https://github.com/settings/tokens


# login with npm cli
# username: YOUR_GITHUB_USERNAME
# password: YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
# email: YOUR_EMAIL
npm login --scope=@joshxyzhimself --registry=https://npm.pkg.github.com


# create a .npmrc
# --- .npmrc
# //npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
# @joshxyzhimself:registry=https://npm.pkg.github.com
# --- EOF


# publish
npx lerna publish


# "Current HEAD is already released, skipping change detection."
npx lerna publish from-package
```

#### consuming packages (with gpr)

```sh
# create a .npmrc
# --- .npmrc
# @joshxyzhimself:registry=https://npm.pkg.github.com
# --- EOF


# add
yarn add @joshxyzhimself/assert
```

#### publishing packages (with npm)

```sh
# "Authentication error. Use `npm whoami` to troubleshoot."
npm adduser


# "You must sign up for private packages"
npm config set access public
```

#### updating packages

```sh
npx lerna exec --concurrency 1 --no-bail "pwd && yarn"
npx lerna exec --concurrency 1 --no-bail "pwd && yarn outdated"
npx lerna exec --concurrency 1 --no-bail "pwd && yarn upgrade --latest"
```

### license

```
MIT License

Copyright (c) 2021 joshxyzhimself

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```