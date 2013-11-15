#Introduzione
Il seguente progetto si propone di far emergere le peculiarità della piattaforma per lo sviluppo di applicazioni web Node.js. Di seguito saranno trattate tutte le componenti utilizzate per sviluppare l'applicazione di esempio, ovvero un clone di Twitter.

**Purtroppo non sono presenti soluzioni gratuite di hosting per lo stack utilizzato, quindi l'unico modo per provare l'applicazione di esempio è in locale. Sarà sufficiente installare [node.js](http://nodejs.org/), clonare il repository e lanciare i seguenti comandi:**

```
#!bash
npm install -g sails
npm install
sails lift
```

#Node.js
Node.js è una piattaforma per lo sviluppo di applicazioni web basata su un pattern di tipo event-driven e privo di operazioni di IO bloccanti; questi fattori favoriscono quindi:

* la leggerezza ed efficienza delle applicazioni
* la scalabilità delle applicazioni
* la scelta di questa tecnologia per applicazioni di tipo real-time con intensivo uso di dati 

Il linguaggio di riferimento è Javascript e l'interprete utilizzato è il [V8 JavaScript Engine](https://code.google.com/p/v8/) presente in Google Chrome.

JavaScript non rende particolarmente semplice l'utilizzo del paradigma Object-Oriented, quindi in Node.js è possibile utilizzare linguaggi di programmazione che favoriscono questo paradigma e che compilano in JavaScript come, ad esempio, [CoffeeScript](http://coffeescript.org/). In quest'implementazione ad ogni modo è stato utilizzato Javascript.

#Express.js
[Express.js](http://expressjs.com) è un framework per Node.js che svolge le stesse funzioni di [Sinatra](http://www.sinatrarb.com/) per Ruby. Per poter descrivere quali funzioni svolge Express.js, è necessario innanzitutto comprendere la struttura che Node.js mette a disposizione dello sviluppatore.

##Bottom layer: HTTP server

All'interno della piattaforma fornita da Node.js, è presente un modulo HTTP che si propone di astrarre le funzioni per creare un semplice webserver:

```
#!javascript
// Require what we need
var http = require("http");

// Build the server
var app = http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.end("Hello world!\n");
});

app.listen(1337, "localhost");
console.log("Server running at http://localhost:1337/");
```
Nell'esempio di codice sopra riportato alla prima riga troviamo il metodo **require** che è utilizzato per poter utilizzare la componente principale di Node.js, ovvero i moduli. In questo specifico esempio richiediamo l'uso del modulo http per poter creare il webserver che risponderà sempre con *Hello world!* di tipo *text/plain*; per lanciare questo semplice programma è sufficiente digitare da terminale il comando **node app.js** (avendo chiamato app.js il file con il codice sopra descritto).

Nella callback che passiamo come argomento al metodo **createServer** abbiamo a disposizione due parametri:

* request
* response

che rappresentano appunto la richiesta effettuata dal browser e la risposta che gli forniremo. Ad esempio nel parametro **request** avremmo a disposizione membri come **url**, **method**, **headers**, ecc. In questo modo potremmo scrivere una semplice applicazione che restituisce contenuti diversi a seconda dell'url che è stato invocato:

```
#!javascript
var http = require("http");

http.createServer(function(req, res) {

  // Homepage
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the homepage!");
  }

  // About page
  else if (req.url == "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the about page!");
  }

  // 404'd!
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
  }

}).listen(1337, "localhost");
```


##Middle layer: connect
[Connect](http://www.senchalabs.org/connect/) è un modulo che non è incluso nella piattaforma Node.js e si occupa della gestione dei *middleware*. Un *middleware* può essere inteso come una singola componente di una pipeline, infatti solitamente presentano questa firma:

```
#!javascript
function middleware(one, two, three, next) {
	two = one.someMethod();
	...
	next();
}
```
Nell'esempio sopra descritto si può notare come alla fine del proprio lavoro, un *middleware* invoca una callback, che invocherà il successivo metodo nella pipeline.
Un esempio di utilizzo di [Connect](http://www.senchalabs.org/connect/) può essere la possibilità di effettuare un logging di ogni richiesta http, come nel frammento di applicazione sotto riportato:

```
#!javascript
var connect = require("connect");
var http = require("http");
var app = connect();

// Logging middleware
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

// Send "hello world"
app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);
```

## Top layer: Express.js
A questo punto possiamo definere le funzionalità offerte da [Express.js](http://expressjs.com); questo modulo introduce alcune componenti per facilitare la creazione di applicazioni web favorendo quindi una maggior astrazione rispetto all'HTTP server di Node.js e al modulo [Connect](http://www.senchalabs.org/connect/).

###Routing
Il routing è quella componente di un applicazione web che mappa azioni diverse a richieste http diverse, sia in termini di url (ad esempio /home e /about), che in termini di verbo http (GET, POST, PUT, ecc.). Un possibile esempio è il seguente:

```
#!javascript
var express = require("express");
var http = require("http");
var app = express();

app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});

app.get("/", function(request, response) {
  response.end("Welcome to the homepage!");
});

app.get("/about", function(request, response) {
  response.end("Welcome to the about page!");
});

app.get("/hello/:who", function(req, res) {
  res.end("Hello, " + req.params.who + ".");
});

app.get("*", function(request, response) {
  response.end("404!");
});

http.createServer(app).listen(1337);

```

La chiamata al metodo **all** permette di eseguira la callback ad ogni richiesta e si può notare come venga utilizzata la logica dei *middleware* invocando il metodo **next()**.

Le successive righe di codice invocano il metodo **get** che accetta come primo parametro il *path* della richiesta nel browser. Notiamo come al termine non venga invocato il metodo **next()** così da far terminare la progressione nella pipeline dei *middleware*.

La penultima invocazione al metodo **get** illustra come sia possibile ricevere parametri che sono parte integrante dell'url e come possano essere gestiti attraverso il parametro **req** della callback.

###Request handling
La componente di routing potrebbe essere sufficiente, ma Express.js fornisce un'altra componente che si occupa della gestione delle richieste. Per poterla illustrare procediamo con un esempio:

```
#!javascript
response.redirect("/hello/anime");
response.redirect(301, "http://www.anime.org");
response.sendFile("/path/to/anime.mp4");
```
Possiamo notare come siano presenti metodi per gestire il comportamento che dovrà tenere un browser al termine di una richiesta; in quest'esempio viene utilizzato sia il redirect, che la spedizione di un file per il download al browser.

###Views
Fin'ora abbiamo restituita al browser solamente stringhe in plain text, ma sappiamo che il web è stato reso famoso anche per l'HTML ed il CSS che i browser possono interpretare. Per venire incontro a questa necessità, Express.js fornisce un meccanismo per restituire viste HTML al browser:

```
#!javascript
var express = require("express");
var app = express();

// Set the view directory to /views
app.set("views", __dirname + "/views");

// Let's use the Jade templating language
app.set("view engine", "jade");
```

```
#!jade
doctype 5
html
  body
    h1 Hello, world!
    p= message
```

Quest'esempio illustra come sia possibile assegnare un *view engine* ad Express.js (in questo caso [Jade](http://jade-lang.com/)) per poter fornire al browser una risposta HTML. Sarà necessario utilizzare una funzione di questo tipo all'interno di una callback delle funzioni di routing:

```
#!javascript
app.get("/", function(request, response) {
  response.render("index", { message: "I love anime" });
});
```
Notiamo come è possibile passare parametri alle viste (in quest'esempio il parametro *message*).

#Socket.io
[Socket.io](http://socket.io/) è un modulo per Node.js che permette di creare applicazioni real-time attraverso il browser, rendendo quindi asincrona la comunicazione tramite il protocollo HTTP. Per questo motivo utilizza il miglior metodo per la comunicazione real-time sul browser attualmente in uso dall'utente. I possibili metodi sono:

* WebSocket
* Adobe® Flash® Socket
* AJAX long polling
* AJAX multipart streaming
* Forever Iframe
* JSONP Polling

A seconda del browser verrà utilizzato il metodo che risiede più in alto nella lista sopra descritta; ovviamente le prestazioni migliori si avranno utilizzando i WebSocket, che sono un'ampliamento del protocollo HTTP.

Socket.io si compone di una parte che risiede lato server per poter permettere di comunicare direttamente con il browser, senza la necessità che quest'ultimo effettui una richiesta sincrona HTTP. Un esempio di utilizzo lato server è il seguente:

```
#!javascript
var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```
È necessaria inoltre una componente javascript lato client per permettere la ricezione e l'invio dei messaggi al server in maniera asincrona. Un esempio di utilizzo lato client è il seguente:

```
#!javascript
var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
```

Si può notare come le API rese disponibili da Socket.io lato client e lato server sono le medesime, astraendo quindi il metodo con cui i messaggi vengono trasmessi da server a client e viceversa.


#Sails.js
Come Express.js può essere paragonato a Sinatra per Ruby, [Sails.js](http://sailsjs.org/) può essere paragonato a Rails per Ruby. Infatti per completare lo stack di un'applicazione web, mancano ancora lo strato di accesso al database e lo strato di gestione delle richieste; questo è reso disponibile da Sails.js attraverso un pattern di tipo MVC, appoggiandosi alle API di Express.js e Connect.

A differenza di Rails, Sails.js implementa il pattern MVC anche a livello di applicazioni real-time, permettendo quindi di poter utilizzare Socket.io al posto delle richieste HTTP sincorne per comunicare con il server. Ogni controller definito per richieste classiche, restituisce anche una risposta che è interpretabile da Socket.io.

L'utilizzo di questo framework non è consigliabile per un ambiente di produzione in quanto è ancora in versione beta, ma è promettente per l'estensione del pattern MVC in ambienti real-time.

#Backbone.js
[Backbone.js](http://backbonejs.org/) è un'implementazione lato client del pattern MVC, per permettere di organizzare anche il JavaScript lato client allo stesso modo di come si organizza lato server; questo facilità le future implementazioni e la manutenibilità del codice sviluppato.

#Twitter_nodejs
L'applicazione d'esempio implementa un sottoinsieme delle funzioni di Twitter, ed utilizza tutte le componenti che sono state descritte sopra. In particolare tutte le richieste, eccetto l'autenticazione, vengono gestite tramite Socket.io, permettendo di ricevere nuovi tweet senza la necessità di aggiornare la pagina web. Allo stesso modo potremmo essere informati di quando un nuovo utente inizia a seguirici oppure di quando un hash tag ne supera un'altro in popolarità.
Nel dettaglio è possibile osservare come nella cartella */asset/linker/js/app* sia presente il codice javascript che verrà eseguito lato client, strutturato secondo il paradigma imposto da Backbone.js.

All'interno di */api* è invece presente il codice javascript che verrà eseguito lato server da Node.js  utilizzando la struttura imposta da Sails.js.

Purtroppo Backbone.js non fornisce un'interfacciamento al server tramite Socket.io, quindi è stato necessario sovrascrivere la funzione **Backbone.sync**, che è utilizzata per ogni richiesta effettuata da Backbone.js verso il server, in modo tale da sfruttare Socket.io. Il file dovè presenta questa implementazione è */asset/linker/js/lib/backbone.sailsjs.js*.

L'applicazione non è completa in ogni sua parte, in particolare:

* non sono state previste validazioni dei model
* non è stato previsto il link al profilo dell'utente quando è stato menzionato in un tweet.