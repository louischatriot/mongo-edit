Mongo Edit
=========

Dead simple Graphical User Interface for MongoDB.
This is NOT a complete admin UI, just a way to edit documents manually with a user-friendly interface, as well as create and delete documents and collections It's a perfect fit for people working with an ODM (for example <a href="https://github.com/LearnBoost/mongoose" target="_blank">Mongoose</a>) which is in charge of the administration.

We use it in production at <a href="http://tldr.io/" target="_blank">tldr.io</a>

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

## Install, configure and run
Prerequisite: <a href="https://github.com/joyent/node" target="_blank"><b>Node.js</b></a> should be installed  

### Preferred method: clone the repo and use an external config file
**1)** Install with a simple `git clone git@github.com:tldrio/mongo-edit.git` and then `npm install` in the created directory.  
**2)** Create a config file in the `config` directory (there is a `sampleConfig.js` that explains the parameters and shows an example).  
**3)** Run with `node server.js config/yourConfigFile.js`  
**4)** Whenever you want to update Mongo Edit, a simple `git pull` will do the trick. The config directory is gitignored (except the example file) so your config will be preserved

### Alternatively, you can use npm
**1)** Install Mongo Edit in one command: `npm install mongo-edit`  
**2)** Modify one of the default configurations in the file `lib/config.js` (which also explains all parameters)  
**3)** Run with `NODE_ENV=yourEnv node server.js` to run with default config `yourEnv` or simply `node server.js` to run with the default environment (called 'development')  

You can't update easily with this method though, you would need to `npm install` Mongo Edit somewhere else and copy paste your modified `lib/config.js` to restore your config

### Config parameters
Everything is explain in `lib/config.js`, here is a summary:  
* `db.host`, `db.port`, `db.name`: what database to connect to. It is assumed that you run in a trusted environment and don't need password to access the database (this should be the case for all developpement machines and most production machines with a restrictive firewall).
* `db.username` and `db.password`: these are optional. If they are set, Mongo Edit will authentify itself as the given user and throw an error if the credentials are invalid.
* `svPort`: the port on which the webserver will run.
* `trustProxy`: needs to be set to `true` if Mongo Edit is run behind a reverse proxy such as Nginx. If you run Mongo Edit in production and it is accessible from the outside, **this should be the case**. Obviously, it should be protected by a BasicAuth over SSL.
* `pagination`: the parameters for the pagination when showing the contents of a collection. The defaults should be fine.

## Running Mongo Edit in production
If you run Mongo Edit in production, be aware that it doesn't provide you with any security and will accept connections from anyone. Make sure to **run it behind your reverse proxy, and protected with a Basic Auth over SSL**.


## Feature requests and bugfixes
We want Mongo Edit to remain super simple, there are already plenty complete admin UIs out there. Still, if you think something is missing don't hesitate to drop us an issue or a PR. And of course please do so if you find a bug :)

## Contributors
    project: mongo-edit
    commits: 135
    active : 23 days
    files  : 121
    authors: 
    129  Louis Chatriot          95.6%
      4  Raymond Feng            3.0%
      1  HeroicYang              0.7%
      1  Stanislas Marion        0.7%


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
