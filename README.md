# Document Generator Monorepo

## To Run this project:

```
pnpm run dev #which runs all the apps like workers and frontend
```

## To Run a specific app:

```
pnpm run dev --filter=worker #replace app-name with the name of the app you want to run
```

## To Build this project:

```
pnpm run build #which builds all the apps like workers and frontend
```

## To install new packages:

```
pnpm add package-name #replace package-name with the name of the package you want to install
```

if you dont have pnpm installed, you can install it globally using npm:

```
npm install -g pnpm
```

## To install a package in a specific app:

```pnpm add package-name --filter=app-name #replace package-name with the name of the package you want to install and app-name with the name of the app you want to install the package in

```
