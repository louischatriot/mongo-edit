Mongo Edit
=========

Dead simple Graphical User Interface for MongoDB.
Useful for editing documents manually with a user-friendly interface.

## What does it do?
* `/` shows the list of all collections
* `/:collection` shows the contents of `collection`
* `/:collection/:id/edit` shows a web-based editor (<a href="https://github.com/ajaxorg/ace" target="_blank">Ace</a>) so that you can change the contents of the `collection`'s document with id `id`. The document is shown as a Javascript object that will replace the current one in the database when you save it. The editor features syntax highlighting and checking. An image being worth a thousands words, here is a screenshot:  

<img src="https://raw.github.com/tldrio/mongo-edit/master/assets/mongoEdit.png" alt="mongo edit screenshot">

## Install






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
