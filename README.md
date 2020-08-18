# ckeditor5-button

Button plugin for ckeditor5.

## Quick start

First, install the build from npm:

```bash
yarn add ckeditor5-button
```

Use it in your application:

```js
import Button from 'ckeditor5-button';
```

Add to the array

```js
ClassicEditor.builtinPlugins = [
  .
  .
  .
  Button
];
```


Finally add to the toolbar items array

```js
toolbar: {
  items: [
    .
    .
    .
    'button'
  ]
}
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
