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

## Functions
- `NextPage`: `void`. If returned from an `onClick` caller, the next page is rendered in place of the current.
- `PrevPage`: `void`. If returned from an `onClick` caller, the previous page is rendered in place of the current.

In order for custom components to work, they must accept standard properties corresponding to the base HTML element, and then pass those props on to it.

### Form - props
- `initialValues`: *required* an object consisting key-value pairs where the key is the name of the field to attach to, and the value is the field's initial value.
- `children`: *required* the content of the form. For paginated forms, the children are `FormPage` elements.
- `style`: the CSS properties to pass on to the form.
- `className`: the className property to pass on to the form.
- `onSubmit`: a function that will be called once the form submits, on the form data and the form event. So, for a function `(data, e) => {}`, the form data is accessible in the function body through the parameter `data`.

### FormPage - props
- `children`: *required* the content of the page. For paginated forms, the children are the `Input`, `Select`, `TextArea` and `Button` elements.
- `style`: the CSS properties to pass on to the form page.
- `className`: the className property to pass on to the form page.

### Input - props
Exclusively one of the following two sets:
- Native HTML `input` props but `name` and `type` are required.
- {
  name: `string`,
  type: `string`,
  as: `ReactElement`
}

### Select - props
Exclusively one of the following two sets:
- Native HTML `select` props but `name` is required.
- {
  name: `string`,
  as: `ReactElement`
}

### TextArea - props
Exclusively one of the following two sets:
- Native HTML `textarea` props but `name` is required.
- {
  name: `string`,
  as: `ReactElement`
}

### Button - props
Exclusively one of the following two sets:
- Native HTML `button` props
- as: `ReactElement`

If `as` is provided, it will serve as the rendered component.

`onChange` callers can be provided to fields to provide your form with custom logic. These `onChange` callers will not affect the internal functionality of the correct listening of values. This is useful for constructing what is akin to the native HTML `output` element.