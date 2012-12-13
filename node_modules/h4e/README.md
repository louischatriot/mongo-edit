h4e
===

Hogan for Express 3.x (should work with Express 2.x too but I haven't tested it yet), with support for partials and layouts.

## Installation

```bash
$ npm install h4e      # Install locally
$ npm install -g h4e   # Install globally
```

You can also add it to your `package.json`, the latest version is `0.3.0`. Here is the <a target="_blank" href="https://npmjs.org/package/h4e">npm page</a>.

## Testing

Install the dev dependencies, then `make test`. Uses <a target="_blank" href="http://visionmedia.github.com/mocha/">Mocha</a>.


## Usage
### Within Express

If you have the typical setup with your main module in `.`, your Mustache templates for the website in `./templates/website` 
and maybe those for a forum in `./templates/forum`, you have a choice:  
* **The super easy install** where h4e sets itself up to be Express' rendering engine (see first block in code below)
* **The easy install** where h4e compiles the templates and lets you link to Express as you're used to (second block)

```javascript
// #1: SUPER EASY INSTALL
// h4e takes care of all the configuration
var h4e = require('h4e')
  , express = require('express')
  , app = express();

h4e.setup({ app: app   // Give it your Express app so that it handles all the configuration

          , extension: 'mustache'   // Tell h4e all your templates end in '.mustache'
                                    // and you don't want to type it everytime

          , baseDir: 'templates'    // All your templates are in this directory or its descendants
                                    // Say it here and never type it again, h4e will know where to look

          , toCompile: ['website', 'forum'] });   // The subdirectories of baseDir where your templates
                                                  // really are. Tell h4e to compile them so you
                                                  // can use them
// Your're done!


// #2 EASY INSTALL
// Important, make sure that the extension and baseDir parameters
// match, or Express will not find your templates
var h4e = require('h4e')
  , express = require('express')
  , app = express()
  , h4eRender;

h4eRender = h4e.setup({ extension: 'mustache'
                      , baseDir: 'templates'
                      , toCompile: ['website', 'forum'] });

app.engine('mustache', h4eRender);
app.set('view engine', 'mustache');
app.set('views', 'templates');

// You're done
```

Partial support is a breeze, you can just reference the file holding the partial, like this:

* `./templates/website/hello.mustache` contains `Hello {{planet}} ! {{>website/description}}`
* The partial `./templates/website/description.mustache` contains `You are {{color}}`

Your request handler will be:

```javascript
app.get('/test', function (req, res, next) {
  var values = { planet: 'World', color: 'blue' };

  // Renders 'Hello World ! You are blue'
  res.render( 'website/hello', { values: values } );
});

```

### That's not enough, I want layouts!
Of course, who doesn't? So now you cannot directly reference the partial filename, but you can do something like this:

* `./templates/website/layout.mustache` contains `Header <b>{{>content}}</b> Footer`
* `./templates/website/pages/index.mustache` contains `Yo {{animal}}, this is the homepage`
* `./templates/website/pages/h4e.mustache` contains `This is {{adjective}} !`

Then your request handlers need to be:

```javascript
app.get('/index', function (req, res, next) {
  var values = { animal: 'dawg' }
    , partials = { content: '{{>website/pages/index}}' }   // Partial content is directly replaced
                                                           // by a reference to the partial holding
                                                          // the page contents: website/pages/index
    ;

  // Renders 'Header <b>Yo dawg, this is the homepage</b> Footer'
  res.render( 'website/layout', { values: values, partials: partials } );
});

app.get('/whatish4e', function (req, res, next) {
  var values = { adjective: 'awesome' }
    , partials = { content: '{{>website/pages/h4e}}' }
    ;

  // Renders 'Header <b>This is awesome !</b> Footer'
  res.render( 'website/layout', { values: values, partials: partials } );
});
```

### I want to use it directly, without Express!
You sure want lots of different things, but that's OK. Set it up without passing a reference to Express, like this:

```javascript
var h4e = require('h4e');

h4e.setup({ extension: 'mustache'
          , baseDir: 'templates'
          , toCompile: ['emails', 'messages'] });
// Rest of Express code here
```

So now you want to send a welcome email. Let's assume:
* `./templates/emails/welcome.mustache` contains `Hello {{username}} ! Welcome to our service !`

```javascript
var values = { username: 'Grafitti' }
  , emailBody = h4e.render('emails/welcome', { values: values });

// emailBody is 'Hello Grafitti ! Welcome to our service !'
```

As you can see, very similar to Express' `res.render`, you can use partials and layouts too.


### I want to directly render strings!
Allright allright, you can do that too.

```javascript
var values = { username: 'Grafitti', species: 'cat' }
  , emailBody = h4e.render('Hello {{username}} ! You are a {{species}}', { values: values });

// emailBody is 'Hello Grafitti ! You are a cat !'
```

### Anything else?
I think that's pretty much everything you need. You can always talk to us through issues, pull requests or email at hello@tldr.io.
Speaking of which, you should check our website, where we use h4e in production. It is [http://tldr.io](http://tldr.io)



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