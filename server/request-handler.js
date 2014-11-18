var fs = require("fs");
var url = require("url");
var comments = JSON.parse(fs.readFileSync("data.json"));
// comments.results = comments.results.reverse();

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler  = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some b2asic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  var body = '';

  if (request.method === 'OPTIONS') {
    body = '';
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.end(body);
  }

  if (request.method === 'GET') {
    var requestUrl = url.parse(request.url);
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    if (requestUrl.pathname === "/classes/messages") {
      statusCode = 200;
      var body = JSON.stringify(comments);
    }
    else if (requestUrl.pathname === "/classes/room1") {
      statusCode = 200;
      var body = JSON.stringify(comments);
    }
    else if (requestUrl.pathname.charAt(0) === "/") {
      console.log(requestUrl.pathname.slice(1));
      var doc = fs.readFileSync("../client" + requestUrl.pathname);
      statusCode = 200;
      headers['Content-Type'] = "text/html";
       // response.write('hello');
      body=doc;
    }
    response.writeHead(statusCode, headers);
    response.end(body);
  }


  if (request.method === 'POST') {
    var obj;
    var createdAt = updatedAt = new Date().toISOString();
    var objectId = Date.now();
    request.on('data', function (chunk) {
      obj = JSON.parse(chunk);
      obj.createdAt = createdAt;
      obj.updatedAt = createdAt;
      obj.objectId =  Date.now().toString(); //objectId.toString();
      comments.results.unshift(obj);
      // console.log(comments.results[0]);
      // var body = JSON.stringify(comments);
    });
    request.on('end', function() {
      response.writeHead(201, defaultCorsHeaders);
      var res = {
        status  : 200,
        success : "Updated Successfully"
      };
      response.end(JSON.stringify(comments));
    });
  }
  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;


