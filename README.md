Mongo Edit
=========

Dead simple Graphical User Interface for MongoDB.
Useful for editing documents manually with a user-friendly interface.

## What does it do?
* Urls of the type `/:collection` show the contents of a collection
* Urls of the type `/:collection/:id/edit` show a web-based editor (<a href="https://github.com/ajaxorg/ace" target="_blank">Ace</a>) so that you can change a document's contents. The document is shown as a Javascript object that will replace the current one in the DB when you save it. The editor features syntax highlighting and checking. An image being worth a thousands words, here is a screenshot:  

<img src="https://raw.github.com/tldrio/mongo-gui/master/assets/mongoEdit.png" alt="mongo edit screenshot>
