<!DOCTYPE html>
<html>
<head>
	<title>6004 enhancement setup</title>
</head>
<body>
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script type="text/javascript">$.get('fsbridge.js').then(function(js) {
		js = 'javascript:'+ js.replace(/\n/g, ' ');
		$('<a>').attr('href', js).text('6004 import/export').appendTo($('#target').empty());
	});
	</script>
	<h1>Drag the following link to your bookmarks bar</h1>
	<div id="target">loading...</div>
	<p>You can then click this link while looking at a lab page, and it will upgrade the editor</p>
</body>
</html>