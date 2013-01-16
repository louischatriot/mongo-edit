Mongo Edit
=========

Dead simple Graphical User Interface for MongoDB.
This is NOT a complete admin UI, just a way to edit documents manually with a user-friendly interface, as well as create and delete documents and collections It's a perfect fit for people working with an ODM (for example <a href="https://github.com/LearnBoost/mongoose" target="_blank">Mongoose</a>) which is in charge of the administration.

We use it in production at <a href="http://tldr.io/" target="_blank">tldr.io</a>.

## What does it do?
It allows you to create, edit and delete documents, as well as create and delete collections. Here are the URLs used in the GUI, to which you can link within your application to directly perform the corresponding operations:  
* `/` shows the list of all collections
* `/:collection` shows the contents of `collection` (in reverse chronological order, earliest on top)
* `/:collection/new` creates a new collection with name `:collection`
* `/:collection/newDocument` creates a new document in collection `:collection`. All indexed/unique fields are pre-populated with a random string so that it can be saved right away
* `/:collection/:id/edit` shows a web-based editor (<a href="https://github.com/ajaxorg/ace" target="_blank">Ace</a>) so that you can change the contents of the `collection`'s document with id `id`. The document is shown as a Javascript object that will replace the current one in the database when you save it. The editor features syntax highlighting and checking. An image being worth a thousands words, here is a screenshot:  

<img src="https://raw.github.com/tldrio/mongo-edit/master/assets/mongoEdit.png" alt="mongo edit screenshot">

* `/:collection/delete`: delete `:collection`. Beware, it won't ask for confirmation if the URL is called directly. It will only ask if you click the "Delete collection" button when on page `/:collection`.
* `/:collection/:id/delete`: delete document with _id `:id` in `:collection`. As for the above route, the GUI will ask for confirmation if you click the "Delete" button in the "edit a document" view but not if you call the URL directly.

## Install and configure
Prerequisite: <a href="https://github.com/joyent/node" target="_blank"><b>Node.js</b></a> should be installed  
Install Mongo Edit in one command: `npm install mongo-edit`  

The config file, `/lib/config.js` needs to be modified to fit your situation. The parameters are:  
* `db.host`, `db.port`, `db.name`: what database to connect to. It is assumed that you run in a trusted environment and don't need password to access the database (this should be the case for all developpement machines and most production machines with a restrictive firewall).
* `svPort`: the port on which the webserver will run.
* `trustProxy`: needs to be set to `true` if Mongo Edit is run behind a reverse proxy such as Nginx. If you run Mongo Edit in production and it is accessible from the outside, **this should be the case**. Obviously, it should be protected by a BasicAuth over SSL.
* `pagination`: the parameters for the pagination when showing the contents of a collection. The defaults should be fine.

You can define different environments (the original config file has 'development' and 'production'). By default, the development environment is used, to user another run `NODE_ENV=the_environment node server.js`.

## Run
Run with `node server.js`, or `NODE_ENV=env node server.js` if you don't want to use the default environment. It will then run on the port defined in the config (e.g. with the original config and on my development machine, it runs on `localhost:2762`).  

If you run Mongo Edit in production, **run it behind your reverse proxy, and protected with a Basic Auth on SSL**.


## Feature requests
We want Mongo Edit to remain super simple, there are already plenty complete admin UIs out there. Still, if you think something is missing don't hesitate to drop us an issue or a PR.

## Contributors
    project: mongo-edit
    commits: 78
    active : 10 days
    files  : 114
    authors: 
    78  Louis Chatriot          100.0%


## License 

(The MIT License)

Copyright (c) 2012 tldr.io &lt;hello@tldr.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
