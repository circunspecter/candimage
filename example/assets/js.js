$(function()
{
	var ckEditorSettings = {
		extraPlugins: 'candimage',
		toolbarGroups: [
		    { name: 'candimage' }
		],
		candimage: {
			getUrl: 'app/candimage-get.php',
			postUrl: 'app/candimage-upload.php',
			deletetUrl: 'app/candimage-delete.php',
			deleteMethod: 'POST',
			picker: {
		        defaultContent: 'Waiting for images...',
		    },
	        getImgsDone: function(editor, container, result, textStatus, jqXHR, context) {

	        	var plugin = this;

				$(container.$).waitForImages(function(){
	                $(this).children()
	                .addClass('candimage-picker-item-loaded');
	            },
	            function(loaded, count, success) {
	                $(this).closest('.' + plugin.picker.clsItem)
	                .addClass('candimage-picker-item-loaded');
	            });
	        },
			deleteImgConfirm: function(editor, container, $img, imgName) {

				var plugin = this;

				var msg = plugin._.strReplace(editor.lang.candimage.msgDeleteImg, {img : imgName});

				alertify.confirm(msg, function(e)
				{
					if (e) plugin.deleteImg(editor, container, $img, imgName);
				});
			}
		}
	};

	CKEDITOR.replace('candimageEditor', ckEditorSettings);
});