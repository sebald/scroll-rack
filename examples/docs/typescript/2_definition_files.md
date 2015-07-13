---
title: Definition Files
---

We need a task (Gulp, npm, ...) that automatically updates a file called `all.ts` . The `all.ts` contains references to all definition (`*.d.ts`) and source (`*.ts`) files.

Example contents:

``` javascript
/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TodoItem.ts' />
/// <reference path='interfaces/ITodoScope.ts' />
/// <reference path='interfaces/ITodoStorage.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='services/TodoStorage.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='Application.ts' />
```

*Source: https://github.com/tastejs/todomvc/blob/gh-pages/examples/typescript-angular/js/_all.ts* 

The generated `all.ts` file will help the editor/IDE to give the developer context-aware code completion and show error on development time (IntelliSense).

> TODO: Create a task that creates the `all.ts` file ...
