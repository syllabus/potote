const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const CircularJSON = require('circular-json');
const escape = require('escape-html');

const app = express()
const port = 8888

var messages=['msg 1', 'msg 2', 'msg 3']

app.use(bodyParser.urlencoded({ extended: false }));  

app.get('/potote.html', (req, res) => {
	res.set('content-type', 'text/json');
	res.send(fs.readFileSync('potote.js').toString());
});

app.get('/potote', (req, res) => {
	var pototePage=
		'<!DOCTYPE html>'+
		'<html>'+
		'<title>potote speak</title>'+
		'<body>'+
		'<h1>bienvenue les amies</h1>'+
		'<p>vous etes sur potote speak le remplacant de fesse de bouc'+
		'</p>'+
		'<form action="/potote" method="POST">'+
		'  tapez votre message:<br>'+
		'  <input type="text" name="msg">'+
		'  <br>'+
		'  <br>'+
		'  <input type="submit" value="envoyer">'+
		'  <ul>';
		
	messages.slice().reverse().forEach(msg => 
	{
		pototePage+='	<li>'+msg+'</li>'
	});
		
	pototePage+=
		'  </ul>'+
		'</form>'+ 
		'</body>'+
		'</html>'
	res.set('X-XSS-Protection', '0')
	res.send(pototePage);
})

app.get('/admin', (req, res) => {
	var pototePage=
		'<!DOCTYPE html>'+
		'<html>'+
		'<title>potote speak admin</title>'+
		'<body>'+
		'<h1>anti-hacker page</h1>'+
		'  <ul>';

	for (var i = messages.length-1; i >=0; i--) {
		var msg = messages[i];
		pototePage+='	<li>'+escape(msg)+' <a href="/delete?idx='+i+'">DELETE</a></li>'
	}
		
	pototePage+=
		'  </ul>'+
		'</form>'+ 
		'</body>'+
		'</html>'
	res.send(pototePage);
})

app.post('/potote', (req, res) => {
	//messages.push(CircularJSON.stringify(req))
	messages.push(req.body.msg)
	
	res.redirect('/potote');
})

app.get('/delete', (req, res) => {
	messages.splice(req.query.idx, 1)
	
	res.redirect('/admin');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//hacks:
//</li></ul><script>document.location.href='http://google.com'</script><ul><li>
//</li></ul><script>document.body.style = 'background: red;'</script><ul><li>
//</li></ul><a href="https://www.youtube.com/watch?v=XgK9Fd8ikxk">clique ici</a><ul><li>
//</li></ul><iframe width="420" height="315"src="https://www.youtube.com/embed/XgK9Fd8ikxk"></iframe><ul><li>
