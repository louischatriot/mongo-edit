/*
 * Wrapper around Hogan to be used with Express and enjoying support for partials
 * (c) 2012 tldrio <meta@tldr.io>, MIT Licence
 * Project homepage: https://github.com/tldrio/h4e
 */


var hogan = require('hogan.js')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , compiledTemplates = {}
  , extension, templatesDir, targets
  ;


/**
 * Compile all templates in templatesDir/root and put the result in compiledTemplates
 * Only used at setup.
 * @param {String} root directory from which to recursively compile all templates
 * @param {Function} callback to be called after execution. Will be called even if there is an error, since that only means some files were not processed
 */
function readAndCompileTemplates (root) {
  var dir = path.resolve(templatesDir, root)
    , files;

  files = fs.readdirSync(dir);

  _.each(files
    , function (file) {
        var extname = path.extname(file)
          , basename = path.basename(file, extname)
          , fullname = path.resolve(dir, file)
          , stats, str
          ;

         stats = fs.statSync(fullname);


          if (stats.isDirectory()) {
            readAndCompileTemplates(path.join(root, basename));
          }

          if (stats.isFile() && extname === '.' + extension) {
            str = fs.readFileSync(fullname, 'utf8');
              compiledTemplates[path.join(root, basename)] = hogan.compile(str);
          }
      });
}


/**
 * Actually render the template. The signature is imposed by Express
 * This can only be called once all necessary templates have been compiled, otherwise the usual error will be thrown by Express
 * @param {String} template Path to reach the template from the baseDir, without the extension
 * @param {Object} options Hogan options. The two most important are options.values and options.partials (names are explicit)
 * @param {Function} fn Optional. Callback supplied by Express once rendering is done.
 *                                No callback should be supplied if render is not called by Express. In that case, render simply returns the result of the rendering.
 */
function render (template, options, fn) {
  var basename = path.basename(template, path.extname(template))
    , relative = fn ? path.relative(templatesDir, template) : template
    , dirname = path.dirname(relative)
    , keyname = path.join(dirname, basename)
    , templateToRender = compiledTemplates[keyname] || hogan.compile(template)   // If template is not a precompiled template, it must be a string template
    , result = templateToRender.render(options.values, _.extend(_.clone(compiledTemplates), options.partials))
    ;

  if (fn) {   // render was called by Express
    try {
      fn(null, result);
    } catch (err) {
      fn(err);
    }
  }

  // Render was called directly
  return result;
}



/**
 * Compile the templates and set up express to use this as its rendering engine
 * @param {Object} options Set up options, which are:
 *        {Object} app            Optional. Express app for which we will set up the rendering engine.
 *                                          If none provided we just compile all templates and the user can use the render function
 *        {String} extension      Optional. Only the templates with this extension will be compiled. Defaults to 'mustache'
 *        {String} baseDir        Optional. The base directory where all templates are, not to be repeated in all partials names. Defaults to 'templates'
 *        {Array} toCompileDirs   Optional. All subdirs containing the templates, part of the partials names. Default to ['.']
 * @return {Function} The rendering function that complies to Express' signature (can be given to the engine function or used directly)
 */
function setup (options) {
  extension = options.extension || 'mustache';
  templatesDir = options.baseDir || 'templates';
  targets = options.toCompileDirs || ['.'];

  _.each(targets, function (target) { readAndCompileTemplates(target); });

  // If an Express app was passed in the options, set up its rendering engine to be h4e
  if (options.app) {
    options.app.engine(extension, render);
    options.app.set('view engine', extension);
    options.app.set('views', templatesDir);
  }

  return render;
}


// API
module.exports = { setup: setup, render: render };
