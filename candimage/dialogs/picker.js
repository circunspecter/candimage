CKEDITOR.dialog.add('candimagePickerDialog', function (editor)
{
	var dialog,
		container
		plugin = editor.plugins.candimage;

	return {
		title: editor.lang.candimage.dlgPickerTitle,
		width: plugin.picker.width,
		height: plugin.picker.height,
		minWidth: plugin.picker.minWidth,
		minHeight: plugin.picker.minHeight,
		resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
		onLoad: function()
		{
			dialog = this;
			container = this.getContentElement('imagePicker', plugin.picker.cls).getElement();

			$(container.$)
			.on('click', '.' + plugin.picker.clsImage, function() {
				plugin.pickerImgClick(editor, container, this);
			})
			.on('dblclick', '.' + plugin.picker.clsImage, function() {
				plugin.pickerImgDblClick(editor, container, this, dialog._.buttons);
			})
			.on('click', '.' + plugin.picker.clsDelete, function() {

				// Get image object
				var $img = $(this).closest('.' + plugin.picker.clsItem).find('.' + plugin.picker.clsImage);

				// Get image name
				var imgName = $img.attr('src').replace(/^.*[\\\/]/, '');

				// Confirm action
				if ($img.length)
				{
					plugin.deleteImgConfirm(editor, container, $img, imgName)
				}
			});

			// Resize handler
			dialog.on('resize', function(e) {

				$(container.$).css('max-height', e.data.height);

				plugin.pickerOnResize(editor, dialog, container, e);
			});

			plugin.pickerOnLoad(editor, dialog, container);
		},
		onShow: function()
		{
			plugin.pickerOnShow(editor, dialog, container);
		},
		onOk: function()
		{
			plugin.pickerOnOk(editor, dialog, container);
		},
		contents: [
			{
				id: 'imagePicker',
				label: editor.lang.candimage.dlgPickerTitle,
				title: editor.lang.candimage.dlgPickerTitle,
				elements: [
					{
						id: plugin.picker.cls,
						type: 'html',
						className: plugin.picker.cls,
						html: '<div>' + plugin.picker.defaultContent + '</div>'
					}
				]
			}
		]
	};
});