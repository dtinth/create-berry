# create-berry

Easily upgrade your Node.js project to Yarn v3.

```sh
# In an existing project, run:
npm init berry
```

This will perform the following actions:

- Runs `yarn set version berry && yarn set version stable` to upgrade your project to the latest stable version of Yarn.
- Adds `nodeLinker: node-modules` to your `.yarnrc.yml`
- Creates a default `.editorconfig` file, if one does not exist.
- Adds [the recommended `.gitignore` entries](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored) into your `.gitignore` file, if your `.gitignore` file does not already mention `.yarn/`.
