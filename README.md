# Scroll Rack

A small collection of [Metalsmith](http://www.metalsmith.io/) plugins and custom modules intended to generate guidlines and documentation for your company, in form of a static web page. It is ready for use and requires almost not configuration or other setup. Just `require` it and specify a source and destination directory.

**Features:**

- Parse Markdown files with [markdown-it](https://markdown-it.github.io)
- Enabled footnotes via [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
- Code highlighting with [highlight.js](https://highlightjs.org/)
- Genernate table of contents & navigation
- Provide local server + livereload (for development and writing)

## Installation

```bash
$ npm install --save scroll-rack
```

## How Stuff gets parsed

*Scroll Rack* will read all contents inside a directory, specified via the `files` option. The structore of the contents will be persisted. A navigation is automatically generated based on the folder structure. Sub-directories will be treated as content sections and every Markdown file will be parsed to HTML and made availble as a child page of its section. All generated content is put inside a `dest`.

**Example:**

If you specified `docs` as your root and have the following folder structure:

```
docs/
 ├── javascript/
 │     ├── types.md
 │     ├── references.md
 │     ├── arrays.md
 │     └── objects.md
 │
 └── coding_styleguide/
       ├── modules.md
       ├── services.md
       └── testing.md
```

The generated navigation/table of contents will look like this (where the displayed name of page is its `title` attribute):

```
1. JavaScrip
  1.1 Types
  1.2 References
  1.3 Arrays
  1.4 Objects

2. Coding Styleguide
  2.1 Modules
  2.2 Services
  2.3 Testing
```

Metalsmith allows the usage of YAML front-matters. A `title` is required and will not be read from the Markdown.

## Usage

### Simple

```javascript
var scrollRack = require('scroll-rack');

scrollRack({
    files: 'docs',
    dest: '__build'
});
```

### With Options

```javascript
var scrollRack = require('scroll-rack');

// Full options list with defaults
scrollRack({

  // Required
  files: undefined,                       // Documentation files root dir
  dest: undefined,                        // Destination for generated files

  // Optional
  assets: undefined,                      // Assets folder, copied to /assets

  ignore: ['*.js', '*.ts', '.DS_Store'],  // Patterns that should not be copied to dest,
                                          // will be used in "metalsmith.ignore"

  redirect: true,                         // Create redirects to prevent navigation
                                          // to "empty pages", redirect to first
                                          // available page in a section instead

  code_theme: 'zenburn',                  // See https://highlightjs.org/static/demo/
                                          // for a full list of available themes
  nav: {
    order: [],                            // Custom ordering of content sections,
                                          // default is alphabetically

    sort: function                        // Custom sorting function for sub-sections,
                                          // will user "oder" if specified
  },

  port: 8080                              // Port for local server
});
```

### Asset links

Sometimes using the correct path to an asset can be frustrating, esspecially if you have to specify a relative path because you host the generate files in a sub-directory or something similar. *Scroll Rack* supports you by automatically parsing all assets paths to relative paths.

For example: Writing `![Image](/assets/my-image.png)` in a file named `section/some-page.md` would be parsed to `../../assets/my-image.png` because the file will get the following permalink `section/some-page/index.html`.

### Local Server with Livereload

Running your script with `--serve` will start the local server with livereload.

## Backlog

- Parse source code to generate additional documentation via `@` comments
 - Documentation for TypeScript Interfaces
 - Documentation for custom HTML/Web Components and their API


## Release History

* 0.4.0 Add [markdown-it-smartarrows](https://github.com/adam-p/markdown-it-smartarrows) and [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) ([#1](https://github.com/sebald/scroll-rack/issues/1))
* 0.3.0 Make linking to assets easier ([#2](https://github.com/sebald/scroll-rack/issues/2))
* 0.2.0 Add option to specify an assets folder
* 0.1.0 Initial release
