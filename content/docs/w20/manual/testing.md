---
title: "Testing"
type: "home"
zones:
    - "W20"
sections:
    - "W20Manual"
menu:
    W20Manual:
        weight: 70
---

As your application grows it becomes harder to assert that all your features are still working correctly. 
Whether you are doing some refactoring, upgrading a library version or adding new features, you want 
a mechanism to assert that thing are working correctly and protect yourself from regression. 

# Testing

## Unit tests

The web framework does not enforce a particular runner or test suite for unit testing but we found that 
a good combination is [Karma](http://karma-runner.github.io/0.13/index.html) as the runner and 
[Jasmine](http://jasmine.github.io/2.0/introduction.html) as the test suite language. This is probably the most
popular combination for running tests and the one that the AngularJS team uses. Recommended lecture are:

* [Karma documentation](http://karma-runner.github.io/0.13/index.html)
* [Jasmine documentation](http://jasmine.github.io/2.0/introduction.html)
* [AngularJS guide on unit testing](https://docs.angularjs.org/guide/unit-testing)

### Installation and configuration

If you used the generator-w20, required packages will already be installed  in your node_modules folder. 
If you want to start from scratch, first install [NodeJS](https://nodejs.org/en/), create a directory for your app 
if you do not already have one, cd into it and use the following command:

```
$ npm install karma karma-cli karma-jasmine karma-phantomjs-launcher karma-requirejs
```

You will need to configure a `karma.conf.js` file at your project root to instruct Karma. You can use the following [guide](http://karma-runner.github.io/0.12/intro/configuration.html)
to configure every options in cli mode. Please have a look at the [Karma documentation](http://karma-runner.github.io/0.12/intro/configuration.html)
for a complete description of the options. The end result should look something like this:

```
module.exports = function(config) {
    'use strict';

    config.set({
        frameworks: [ 'jasmine', 'requirejs' ],
        files: [
            'test-main.js',
            { pattern: 'fragment/**/*.js', included: false },
            { pattern: 'bower_components/**/*', included: false }
        ],
        port: 9876,
        colors: true,
        logLevel: 'INFO',
        browsers: [ 'PhantomJS' ]
    });
};
};
```

This file instruct Karma about the file patterns to be served when running the tests. 
As you can see we will served the business modules of the fragment located in the "fragment" folder, along
with the web dependencies of the "bower_components". 

{{% callout info %}}
The PhantomJS browser will be used for loading the application. PhantomJS is
a headless browser. It can run the application without rendering the HTML pages which we do not need since we are only interested in
testing the application logic. This is useful for executing tests in an environment which does not support graphical interface such as a
CI server for instance. 
{{% /callout %}}

Since we are using RequireJS, we will need a main module for the tests. This module will be declared in a `test-main.js` file.
 
```
var tests = [];

for (var file in window.__karma__.files) {
    if (/.spec\.js$/.test(file)) {
        tests.push(file);
    }
}

window.w20 = {
    configuration: {
        '/base/bower_components/w20/w20-core.w20.json': {
            modules: {
                application: {
                    id: 'w20-test',
                    home: '/test'
                }
            },
            vars: {
                'components-path': '/base/bower_components'
            }
        }
    },
    deps: tests,
    callback: window.__karma__.start
};

requirejs.config({
    paths: {
        '{angular-mocks}': '/base/bower_components/angular-mocks',
        '{fragment}': '/base/fragment'
    },
    shim: {
        '{angular-mocks}/angular-mocks': [ '{angular}/angular' ]
    }
});

requirejs([ '/base/bower_components/w20/modules/w20.js' ]);
```

There is a lot going on in the `test-main.js` file and we will explain what this configuration does. This module is the
main entry point to the application under test. 

1. Loaded files are listed in the global variable `window._karma_.files`.
We add all the `.spec.js` files in a list, those files corresponding to the unit test modules (we will write one soon). 

2. We configure the application programmatically by editing the `w20` global variable `configuration` property. Normally, the loader will create this configuration 
by reading and parsing an application manifest but we can edit it directly for the need of bootstrapping a test environment. We declare the core fragment and configure 
the application module. Because Karma will serve files from `/base` we need to specify the path to our web components (by default the components path is mapped to 
`bower_components` but here we need to remap it to `/base/bower_components`. This is possible using the `vars` property. We add the unit test modules to the dependencies 
by using the `deps` property and allow the start of Karma once the configuration has been processed using the `callback` property. 

3. Some additional RequireJS configuration are necessary to remap the `angular-mocks` module and the business fragment alias to suit Karma base path. 

4. Finally we start the application by requiring explicitely the `w20` module.

### Writing unit tests

We are ready to start unit testing a module. We will take the example of a simple AngularJS controller defined in `fragment/modules/module-to-test.js`.

```
define([
    '{angular}/angular'
], function(angular) {
    'use strict';

	 var module = angular.module('moduleToTest', []);

     module.controller('ControllerToTest', ['$scope', function ($scope) {
        $scope.greeting = 'Hello World!';
    }]);

	return {
		angularModules : [ 'moduleToTest' ]
	};
});

```

This module does not do anything fancy. We declare an AngularJS module `moduleToTest` and a controller with
a scope property.

The 'spec' (unit test module) for this module will be located in `fragment/specs/module-to-test.spec.js`.

```
define([
    '{angular}/angular',
    '{angular-mocks}/angular-mocks',
    '{fragment}/modules/module-to-test'  
    ], function (angular) {
        'use strict';

        describe('The module to test', function() {
        
            var scope;

            beforeEach(angular.mock.module('moduleToTest'));

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                $controller('ControllerToTest', {
                    $scope: scope
                });
            }));

            it('says hello world!', function () {
                expect(scope.greeting).toEqual('Hello World!');
            });

});
```
1. A test suite begins with a call to the global Jasmine function `describe` with two parameters: a string and a function. 
The string is the title of the suite - usually what is under test. The function body implements the suite.

2. The `beforeEach` function executes before each unit test. Here we register a mocked version of the module `moduleToTest`. This will allow us later to request
the controller declared on this module without having to worry about the dependency of this module.

3. We also request that before each test, the `scope` variable be initialized with a new scope. The `$controller` service allow us to retrieve our controller and provide
it its dependency. Our newly created scope (with `$rootScope.$new()`) will be passed to the constructor through dependency injection.
 
4. Finally the unit test can be written. A unit test in Jasmine takes the form of `it` statement which reads like a sentence describing the expected result of the test.
