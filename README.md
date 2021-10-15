## repackd/modules

The packages we use and abuse.

#### Creating

```sh
mkdir ./packages/example
cd ./packages/example
npm init
npx lerna add @repackd/assert --scope=@repackd/example
npx lerna add @repackd/assert --scope=@repackd/example --dev
npx lerna add @repackd/assert --scope=@repackd/example --dev --peer
npx lerna bootstrap
```


#### Testing

```sh
npx lerna bootstrap
npx lerna run test
```

#### Publishing

```sh
npx lerna publish --force-publish
```


#### Consuming

```sh
npm install @repackd/assertion
```


#### Troubleshooting

```sh
# "Authentication error. Use `npm whoami` to troubleshoot."
npm login

# "You must sign up for private packages"
npm config set access public

# "Current HEAD is already released, skipping change detection."
npx lerna publish from-package
```

#### License

```
MIT License

Copyright (c) 2021 repackd

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