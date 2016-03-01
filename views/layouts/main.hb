<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Vandelay Industries</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="Vandelay Industries"/>
  <meta property="og:description" content="Post gifs from Seinfeld to Slack."/>
  <meta property="og:site_name" content="Vandelay Industries"/>
  <meta property="og:image" content="https://vandelayindustries.online/img/vandelay.gif"/>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

	<link href="/css/cover.css" rel="stylesheet">

</head>
<body {{#if complete}}class="complete"{{/if}}>
<div class="site-wrapper">

  <div class="site-wrapper-inner">

    <div class="cover-container">
	{{{body}}}

	<div class="mastfoot">
	<div class="inner">
	  <p>Created by <a href="https://twitter.com/bertrandom">@bertrandom</a>. <a href="https://medium.com/@bertrandom/unfundable-slack-bots-9369a75fdd">Obligatory Medium post</a>.</p>
	</div>
	</div>

    </div>

  </div>

</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-74398007-1', 'auto');
  ga('send', 'pageview');

</script>
</body>
</html>