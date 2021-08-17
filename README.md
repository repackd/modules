## modules

### lerna

- https://github.com/lerna/lerna/

```sh
# Creating a new package
mkdir ./packages/new-package
cd ./packages/new-package
yarn init
yarn add mime-types
cd ../../
npx lerna add @joshxyzhimself/existing-package --scope=new-package
npx lerna bootstrap


# "Authentication error. Use `npm whoami` to troubleshoot."
npm adduser


# "You must sign up for private packages"
npm config set access public


# "Current HEAD is already released, skipping change detection."
npx lerna publish from-package


# publish
npx lerna publish


# creating a .npmrc
# https://github.com/settings/tokens
# https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
--- .npmrc
//npm.pkg.github.com/:_authToken=TOKEN
--- EOF
```