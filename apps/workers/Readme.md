# How import works

if you are in a worker, you can import the module from the core package like this:

```ts
import { module } from "@repo/core";
```

packages can be accessed by their name in the root of the package.json refer `packages/core/package.json`.

Same for type defenitions and eslint configs.

you create a openapi defenition in workers folder and a proper docs which will be used in frontend.
