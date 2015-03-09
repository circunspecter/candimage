CKEDITOR.plugins.add('candimage',
{
	version: 1.0,

	requires: ['image'],
	lang: ['es', 'en'],

	theme: 'grid',
	advancedTabHidden: true,
	cssClsPrefix: 'candimage',
	tplReplacements: [],

	getUrl: '/get',
	postUrl: '/upload',
	deletetUrl: '/delete',
	deleteMethod: 'DELETE',

	picker: {
		width: 600,
		height: 400,
		minWidth: 300,
		minHeight: 200,
		defaultContent: '...',
	},

	upload: function(editor) {

		var plugin = this;
		var $frmUpload = $('#candimageFrmUpload');
		var $btnUpload = $(editor.container.$).find('.cke_button__' + editor.ui.get('candimageUpload').name + '_icon');
		
		if ( !$frmUpload.length)
		{
			// Create upload form
			$frmUpload = $('<form id="candimageFrmUpload" method="post" enctype="multipart/form-data"><input type="file" name="image"></form>')
			.css({
				'position': 'absolute',
				'overflow': 'hidden',
				'left':     '-999px',
				'width':    '0px',
				'height':   '0px'
			});

			$('body').append($frmUpload);

			// Listen for file selection
			$('#candimageFrmUpload').on('change.candimageFileInput', 'input[type="file"]', function()
			{
				// Make editor readonly
				editor.setReadOnly(true);
				$btnUpload.css('background-image', 'url(' + editor.plugins.candimage.path + 'icons/loading.gif)');

				// Upload
				// ------

				var requestSettings = {
					url: plugin.postUrl,
					type: "POST",
					data: new FormData($frmUpload[0]),
					contentType: false,
					processData: false
				};

				var context = {
					'$btnUpload': $btnUpload
				};

				plugin._.upload(requestSettings, context);
			});

			// Destroy listener
			editor.on('destroy', function(e)
			{
				$frmUpload.remove(); // method also removes attached event
			});
		}

		// Open browser file selector
		$frmUpload.find('input[type="file"]').get(0).click();
	},
	uploadAlways: function(editor, result, textStatus, jqXHR, context) {

		// Enable editor
		context.$btnUpload.css('background-image', 'url(' + editor.plugins.candimage.path + 'icons/upload.png)');
		editor.setReadOnly(false);
	},
	uploadDone: function(editor, result, textStatus, jqXHR, context) {

		if(result.success === true)
		{
			this._.insertImage(editor, result.imgUrl);
		}
	},
	uploadFail: function(editor, jqXHR, textStatus, errorThrown, context) {},

	getImgsAlways: function(editor, result, textStatus, jqXHR, context) {},
	getImgsDone: function(editor, container, result, textStatus, jqXHR, context) {},
	getImgsFail: function(editor, jqXHR, textStatus, errorThrown, context) {},

	pickerOnLoad: function(editor, dialog, container) {},
	pickerOnShow: function(editor, dialog, container) {

		var requestSettings = {
			url: plugin.getUrl,
			dataType: "json"
		};

		plugin._.getImgs(container, requestSettings);
	},
	pickerOnResize: function(editor, dialog, container, e) {},
	pickerImgClick: function(editor, container, img) {

		$(img).closest('.' + plugin.picker.clsItem).addClass(this.picker.clsSelected)
		.siblings().removeClass(this.picker.clsSelected);
	},
	pickerImgDblClick: function(editor, container, img, buttons) {

		buttons['ok'].click();
	},
	pickerOnOk: function(editor, dialog, container) {

		var imgUrl = $(container.$).find('.' + this.picker.clsSelected + ' .' + plugin.picker.clsImage).attr('src');

		if (typeof imgUrl !== 'undefined')
		{
			plugin._.insertImage(editor, imgUrl);
		}
	},

	applyTemplate: function(tpl) {

		var plugin = this;
		var htmlContent = '';

		var data = {
			clsItem: this.picker.clsItem,
			clsImage: this.picker.clsImage,
			clsDelete: this.picker.clsDelete
		};

		$.each(plugin._.loadedImages(), function(ik, iv) {

			$.each(plugin.tplReplacements, function(rk, rv) {
				data[rv] = iv[rv];
			});

			htmlContent += plugin._.strReplace(tpl, data);
		});

		return htmlContent;
	},

	deleteImgConfirm: function(editor, container, $img, imgName) {

		if (confirm(this._.strReplace(editor.lang.candimage.msgDeleteImg, {img : imgName})))
		{
			this.deleteImg(editor, container, $img, imgName);
		}
	},
	deleteImg: function(editor, container, $img, imgName) {

		var $container = $(container.$);

		// Loading
		$container.parent()
		.css('position', 'relative')
		.append(
			$('<div class="' + plugin.picker.clsLoading + '"></div>')
			.css('background-image', 'url(' + editor.plugins.candimage.path + 'icons/loading.gif)')
		);

		var deleteUrl = plugin.deletetUrl;

		// Set image name on url
		if(deleteUrl.indexOf('{file}') !== -1)
		{
			deleteUrl = deleteUrl.split('{file}').join(imgName);
		}

		// Prepare request settings
		var requestSettings = {
			url: deleteUrl,
			type: plugin.deleteMethod,
			dataType: 'json'
		};

		if (plugin.deleteMethod === 'POST')
		{
			requestSettings.data = { file : imgName };
		}

		var context = {
			'$container': $container
		};

		plugin._.deleteImg(requestSettings, $img, imgName, context);
	},
	deleteImgAlways: function(editor, $img, result, textStatus, jqXHR, context) {

		// /Loading
		context.$container.parent().find('.' + plugin.picker.clsLoading).remove();
	},
	deleteImgDone: function(editor, $img, result, textStatus, jqXHR, context) {

		// Remove img element
		$img.closest('.' + this.picker.clsItem).remove();
	},
	deleteImgFail: function(editor, $img, jqXHR, textStatus, errorThrown, context) {},

	init: function(editor)
	{
		var plugin = this;

		var fExtend = function(config) {
			for (var prop in config)
			{
				if (
					plugin.hasOwnProperty(prop)
					&&
					config[prop] !== null
					&&
					typeof config[prop] === 'object' )
				{
					CKEDITOR.tools.extend(plugin[prop], config[prop], true);
				}
				else
				{
					plugin[prop] = config[prop];
				}
			}
		};

		// Theme config
		// ------------

		plugin.theme = editor.config.candimage.theme || plugin.theme ;

		$.getJSON(plugin.path + 'themes/' + plugin.theme + '/config.json', function(config) {

			fExtend(config);
		});

		// Custom settings
		// ---------------

		fExtend(editor.config.candimage);

		plugin.picker.cls = plugin.cssClsPrefix + '-picker';
		plugin.picker.clsItem = plugin.cssClsPrefix + '-picker-item';
		plugin.picker.clsImage = plugin.cssClsPrefix + '-picker-item-image';
		plugin.picker.clsDelete = plugin.cssClsPrefix + '-picker-item-delete';
		plugin.picker.clsSelected = plugin.cssClsPrefix + '-picker-item-selected';
		plugin.picker.clsLoading = plugin.cssClsPrefix + '-picker-loading';

		// Private
		// -------

		this._ = function(plugin) {

			var	loadImages = true,
				loadedImages = [],
				loadedImagesChanged = false,
				tplImage = '';

			// Get theme template
			$.get(plugin.path + 'themes/' + plugin.theme + '/tpl-img.html', function(data) {
				tplImage = data;
			});

			return {

				upload: function(requestSettings, context) {

					context = context || {};

					$.ajax(requestSettings)
					.always(function(result, textStatus, jqXHR) {
						plugin.uploadAlways(editor, result, textStatus, jqXHR, context);
					})
					.done(function(result, textStatus, jqXHR) {

						// Append uploaded image
						// ---------------------

						var nImg = {};

						$.each(plugin.tplReplacements, function(rk, rv) {
							nImg[rv] = result[rv];
						});

						loadedImages.push(nImg);

						loadedImagesChanged = true;

						plugin.uploadDone(editor, result, textStatus, jqXHR, context);
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						plugin.uploadFail(editor, jqXHR, textStatus, errorThrown, context);
					});
				},
				getImgs: function(container, requestSettings, context, force) {

					context = context || {};
					force = force || false;

					if (true === loadImages || true === force)
					{
						var that = this;

						$.ajax(requestSettings)
						.always(function(result, textStatus, jqXHR) {
							plugin.getImgsAlways(editor, result, textStatus, jqXHR, context);
						})
						.done(function(result, textStatus, jqXHR) {

							loadedImages = [];

							$.each(result, function(key, val) {
								loadedImages.push(val);
							});

							loadImages = false;

							that.setPickerHtml(container);

							plugin.getImgsDone(editor, container, result, textStatus, jqXHR, context);
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							plugin.getImgsFail(editor, jqXHR, textStatus, errorThrown, context);
						});
					}
					else if (true === loadedImagesChanged)
					{
						this.setPickerHtml(container);

						plugin.getImgsDone(editor, container, loadedImages, null, null, context);
					}
				},
				deleteImg: function(requestSettings, $img, imgName, context) {

					context = context || {};

					$.ajax(requestSettings)
					.always(function(result, textStatus, jqXHR) {
						plugin.deleteImgAlways(editor, $img, result, textStatus, jqXHR, context);
					})
					.done(function(result, textStatus, jqXHR) {
						plugin.deleteImgDone(editor, $img, result, textStatus, jqXHR, context);
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						plugin.deleteImgFail(editor, $img, jqXHR, textStatus, errorThrown, context);
					});
				},
				setPickerHtml: function(container) {

					container.setHtml(plugin.applyTemplate(tplImage));

					loadedImagesChanged = false;
				},
				insertImage: function(editor, url) {

					editor.insertHtml('<img class="' + plugin.picker.clsImage + '" src="' + url + '">');
				},
				loadedImages: function() {

					return loadedImages;
				},
				loadedImagesChanged: function() {

					return loadedImagesChanged;
				},
				strReplace: function(str, data) {

					return str.replace(/{([^{}]+)}/g, function(m, key) {
						return data.hasOwnProperty(key) ? data[key] : '' ;
					});
				}
			};
		}(plugin);

		// Include theme style
		// -------------------

		editor.on('instanceReady', function(e)
		{
			CKEDITOR.document.appendStyleSheet(plugin.path + 'themes/' + plugin.theme + '/style.css');
		});

		// Image properties
		// ----------------

		editor.ui.addButton('candimageProps', {
			label: editor.lang.candimage.btnEditTooltip,
			command: 'image',
			toolbar: 'candimage',
			icon: this.path + 'icons/edit.png'
		});

		// Hide advanced tab from "Image properties" dialog
		if (plugin.advancedTabHidden === true)
		{
			CKEDITOR.on('dialogDefinition', function(e)
			{
				if (e.data.name === 'image')
				{
					e.data.definition.getContents('advanced').hidden = true;
				}
			});
		}

		// Image upload
		// ------------

		editor.addCommand('candimageUpload', {
			exec: function(editor) {
				plugin.upload(editor);
			}
		});

		editor.ui.addButton('candimageUpload', {
			label: editor.lang.candimage.btnUploadTooltip,
			command: 'candimageUpload',
			toolbar: 'candimage',
			icon: this.path + 'icons/upload.png'
		});

		// Image picker/browser
		// --------------------

		CKEDITOR.dialog.add('candimagePickerDialog', this.path + 'dialogs/picker.js');

		editor.addCommand('candimagePick', new CKEDITOR.dialogCommand('candimagePickerDialog'));

		editor.ui.addButton('candimagePick', {
			label: editor.lang.candimage.btnPickTooltip,
			command: 'candimagePick',
			toolbar: 'candimage',
			icon: this.path + 'icons/pick.png'
		});
	}
});