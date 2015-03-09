CKEditor plugin that allows upload and browse images.

Features:
- Image uploader
- Image browser
- Customizable

Requirements:
- [CKEditor](http://ckeditor.com) (with [Image](http://ckeditor.com/addon/image)" plugin)
- [jQuery](http://jquery.com/)

## Installation

1. Copy the plugin to the `/plugins` folder.
2. Enable the plugin:
```js
config.extraPlugins = 'candimage';
```
3. Toolbar:
    - Group: `candimage`
    - Buttons:
        - `candimageProps` Open the image properties dialog.
        - `candimageUpload` Upload image.
        - `candimagePick` Open the image browser dialog.

[[Installing plugins](http://docs.ckeditor.com/#!/guide/dev_plugins)]
[[Toolbar customization](http://docs.ckeditor.com/#!/guide/dev_toolbar)]

## Configuration

Required:

```js
config.candimage = {

    // Requests.
    getUrl: '/get',
    postUrl: '/upload',
    deletetUrl: '/delete',
};
```

- The `get` request must return a JSON array of items containing, at least, the fields specified in `tplReplacements`.
- The `post` request must return a JSON object with, at least, the fields specified in `tplReplacements`.
- `deletetUrl` may contain the `{file}` parameter, which will be replaced by the name of the image.
    - `/images/{file}` becomes `/images/my-image-filename`.

Optional:

```js
config.candimage = {

    // Image browser theme.
    theme: 'grid',

    // Show/hide advanced tab on Image dialog.
    advancedTabHidden: true,

    // CSS prefix.
    cssClsPrefix: 'candimage',

    // Fields to replace on the image template used by the browser.
    // Default: specified by the theme.
    tplReplacements: [],

    // Requests.
    deleteMethod: 'DELETE',

    // Browser dialog properties.
    picker: {
        width: 600,
        height: 400,
        minWidth: 300,
        minHeight: 200,
        defaultContent: '...',
    },

    // One click upload using FormData interface.
    // Override the method to use another system.
    upload: function(editor) {},

    // Upload callbacks.
    uploadAlways: function(editor, result, textStatus, jqXHR, context) {},
    uploadDone: function(editor, result, textStatus, jqXHR, context) {},
    uploadFail: function(editor, jqXHR, textStatus, errorThrown, context) {},

    // Browser callbacks.
    pickerOnLoad: function(editor, dialog, container) {},
    pickerOnShow: function(editor, dialog, container) {},
    pickerOnResize: function(editor, dialog, container, e) {},
    pickerImgClick: function(editor, container, img) {},
    pickerImgDblClick: function(editor, container, img, buttons) {},
    pickerOnOk: function(editor, dialog, container) {},

    // Get images callbacks.
    getImgsAlways: function(editor, result, textStatus, jqXHR, context) {},
    getImgsDone: function(editor, result, textStatus, jqXHR, context) {},
    getImgsFail: function(editor, jqXHR, textStatus, errorThrown, context) {},

    // Render browser's image template.
    applyTemplate: function(tpl) {},

    // Confirm image deletion.
    deleteImgConfirm: function(editor, container, $img, imgName) {},

    // Delete image method.
    deleteImg: function(editor, container, $img, imgName) {},

    // Deletion callbacks.
    deleteImgAlways: function(editor, $img, result, textStatus, jqXHR, context) {},
    deleteImgDone: function(editor, $img, result, textStatus, jqXHR, context) {},
    deleteImgFail: function(editor, $img, jqXHR, textStatus, errorThrown, context) {},    
};
```

- When overwriting a function is advisable to check the original code.

## Themes

The themes define the appearance of the images browser. By default **Candimage** includes two themes: `grid` and `list`.

A theme consists of three files:

- **`style.css`** Styles used by the images browser.
- **`config.json`** Set properties like `tplReplacements` or `picker.*`.
- **`tpl-img.html`** Browser's image template.

Themes location: `/plugins/candimage/themes`.