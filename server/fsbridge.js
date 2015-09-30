$(function() {

var a = $("<a>").css({display: "none"}).appendTo('body');
$('.jade').each(function() {
	var button = $('<span class="jade-module-tool jade-tool-enabled"><span class="fa fa-fw fa-lg fa-cloud-download"></span></span>');
	var id = $(this).data('id');
	var jade = this.jade;

	$(this).find('#module-tools').append(button);

	button.click(function() {
		var data = JSON.stringify(jade.get_state());

		var blob = new Blob([data], {type: 'application/json'});
		var url = URL.createObjectURL(blob);

		a.attr({
			href: url,
			download: 'jade-'+id+'.json'
		});
		a[0].click();

		URL.revokeObjectURL(url);
	});

	$(this).on('dragenter', function() {
		return false;
	});
	$(this).on('dragover', function() {
		return false;
	});
	$(this).on('drop', function(e) {
		var files = e.originalEvent.dataTransfer.files;
		if(files.length != 1) alert("Expected exactly one file to be dropped");
		if(files[0].name.slice(-5) != '.json') alert("Expected a json file");

		var fr = new FileReader();
		fr.onload = function() {
			if(confirm('discard the current workspace and replace with uploaded file?')) {
				var data = JSON.parse(fr.result);

				var modules = jade.jade.model.get_modules();
				for(k in modules)
					if(modules.hasOwnProperty(k) && !modules[k].shared)
						delete modules[k];

				jade.initialize(data);
			}
		};
		fr.readAsText(files[0]);
		return false;
	});
});

});