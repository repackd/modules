## modules

### lerna notes

```
mkdir ./packages/uwu
cd ./packages/uwu
yarn init
yarn add mime-types
npx lerna add @joshxyzhimself/assert --scope=uwu
npx lerna bootstrap

# if you are getting "Authentication error. Use `npm whoami` to troubleshoot."
npm adduser

# if you are getting "You must sign up for private packages"
npm config set access public

# to publish on npm
npx lerna publish

# if you are getting "Current HEAD is already released, skipping change detection."
npx lerna publish from-package
```

### lerna links

- https://github.com/lerna/lerna/
- https://github.com/lerna/lerna/tree/main/commands/add