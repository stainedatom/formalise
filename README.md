# Formalise

Build paginated forms with declarative syntax.

## Using this example

Run the following command:

```sh
npm install @panhaboth/formalise
```

## Quick API Docs

## Components

- `Form`: a container that renders out a context provider that is used internally
- `FormPage`: a container that, when it is a child of `Form`, is rendered one at a time with other sibling `FormPage` components.
- `Input`: an HTML `input` element. Custom components can be rendered using its `as` prop.
- `Select`: an HTML `select` element. Custom components can be rendered using its `as` prop.
- `TextArea`: an HTML `textarea` element. Custom components can be rendered using its `as` prop.
- `Button`: an HTML `button` element. Custom components can be rendered using its `as` prop.

In order for custom components to work, they must accept standard properties corresponding to the base HTML element, and then pass those props on to it.