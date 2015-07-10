---
title: Modules & Dependency Injection
---

## Dependency Injection

Because we code in ES6/Typescript and make heavy use of the `class` syntax, we can not use automated annotations tools, such as `ng-annotate`^[[https://github.com/olov/ng-annotate](https://github.com/olov/ng-annotate)]. Instead we create a static `$inject` property on the class to load dependencies.

The injected entities can then be used in the class constructor. In order to have the correct type definition for Angular services, we use the "official" [TSD](https://github.com/borisyankov/DefinitelyTyped/blob/master/angularjs/angular.d.ts). Loading additional definition files may be necessary.

``` typescript
export class SomeController {
	public static $inject = [
		'$scope',
		'$location'
	]
	
    constructor(
    	private $scope: ITodoScope,
    	private $location: ng.ILocationService
    ) {
        // Code goes here
    }
}
```

A more complex example for using Typescript and Angular 1.X dependency injection, can be found [here](https://github.com/angular-class/NG6-starter).



## Module Definition

Angular 1.X uses its own syntax (`angular.module`) to create modules. In order to make the most out of ES6 and Typescript we define those modules in a separate file, like:

``` typescript
import angular from 'angular';
import Home from './home/home';
import About from './about/about'; 

let componentModule = angular.module('app.components', [
	Home.name,
	About.name
]);

export default componentModule;
```

Where `./home/home` and `./about/about` are are exported `angular.module`  similar to this:

``` typescript
import angular from 'angular';
import anotherDependency from 'dependency';
import someComponent from './some.component'; 

let homeModule = angular.module('home', [
	anotherDependency
])
.directive('some', someComponent);

export default homeModule;
```

