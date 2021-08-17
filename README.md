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
npx lerna add @joshxyzhimself/existing-package --scope=new-package
npx lerna bootstrap
```

#### publishing packages (with gpr)

```
# create a .npmrc
# https://github.com/settings/tokens
# https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
--- .npmrc
//npm.pkg.github.com/:_authToken=TOKEN
--- EOF

# publish
npx lerna publish
```

#### consuming packages (with gpr)

```
# create a .npmrc
# https://github.com/settings/tokens
# https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
--- .npmrc
//npm.pkg.github.com/:_authToken=TOKEN
@joshxyzhimself:registry=https://npm.pkg.github.com
--- EOF

# proceed
yarn add @joshxyzhimself/assert
```

#### publishing packages (with npm)

```
# "Authentication error. Use `npm whoami` to troubleshoot."
npm adduser


# "You must sign up for private packages"
npm config set access public


# "Current HEAD is already released, skipping change detection."
npx lerna publish from-package
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