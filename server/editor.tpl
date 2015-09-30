% import json
<html>
<head>
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="jade.js"></script>
<link type="text/css" href="jade.css" rel="Stylesheet" />
<style>
html, body {
	margin:0;
	padding: 0;
}
#wrapper {

	overflow: hidden;
	padding-bottom: 25px;
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
}
</style>
<script>
$(function() {
	var jdiv = $('.jade')[0];
	var jade = jdiv.jade

	var defconfig = {
		"hierarchical": "true",
		"parts": ["/gates/.*","/lab3/.*","/lab5/.*","/project/.*","memory","/user/.*"],
		"tools": ["check","timing"],
		"editors": ["schematic","icon","test"],
		"edit": "/project/test"
	};
	var config = {{! json.dumps(data) }};

	$.extend(defconfig, config)

	jade.initialize(defconfig);
	jade.jade.save_to_server = function(d, h) {
		console.log(d)

		var save_data = {
            tests: jade.configuration.tests,
            "required-tests": jade.configuration["required-tests"],
            state: jade.jade.model.json_modules().json
        };

		$.ajax({type: 'POST',
			url: '/json',
			data : JSON.stringify(save_data),
			contentType : 'application/json'
		}).then(h);
	};
})
</script>
</head>

<body>
	<div id="wrapper">
		<div class="jade"></div>
	</div>
</body>
<script src="fsbridge.js"></script>
</html>