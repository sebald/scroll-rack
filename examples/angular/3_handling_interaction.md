---
title: Handling User Interactions
---

The above design pattern not only helps use to create reusable components. It also provides use with a clean way to let data flow through our application.

Some interactions with the UI affect model data. A common example is submitting a form or simply changing the value of an input field that updates another part of the UI. Since the only visible element to users (*markup components*) are not allowed to interact with data services, components can accept callbacks. The callbacks will be invoked when certain events occur.

In Angular, this can be done with the `&` binding of an isolated scope. To enforce a unidirectional data flow all callbacks should be defined by a parent *container component* and have the form `handleAction`, where as action described the action to handle.

An component that lets users update their name and email could look like this:

``` javascript
angular.module('myModule', [])

    .directive('editUser', () => ({
        template: `
            <form name="EditUserForm" ng-submit="vm.handleSubmit(vm.userData)">
                <input type="text" ng-model="vm.userData.name">
                <input type"email" ng-model="vm.userData.email">

                <button type="submit">Save</button>
                <button type="button" ng-click="vm.reset()">Cancel</button>
            </form>
        `,
        scope: {
            user: '=',
            handleSubmit: '&'
        },
        controller: class {
            constructor () {          
            	this.userData = Object.assign({}, this.user)
			}

			reset () {
            	this.userData = this.user
            }
        },
        controllerAs: 'vm',
        bindToController: true
    }))
```

Rather than directly expose the passed `user` variable, a local `userData` variable is created. When the user wants to save his changes the `handleSubmit()` is called, which defined via the attribute binding `&`. To complete this small app, there has to be a a container that provides the `<edit-user>` component with the user data and a submit handler.

``` javascript
angular.module('myModule', [])

    .directive('editUserContainer', () => ({
        template: `
            <edit-user
                user="vm.user"
                handle-submit="vm.updateUser(user)"
            ></edit-user>
        `,
        scope: {},
        controller: class {
            constructor (userService) {
                this.userService = userService
                this.userService.get()
                    .then((user) => this.user = user)
            }

            updateUser ( user ) {
                this.userService.update(user)
                    .then((user) => this.user = user)
            }
        },
        controllerAs: 'vm',
        bindToController: true
    }))
```

