---
title: Design Pattern
template: page.hbt
---

We want to keep our code modular and as reusable as possible. To achieve this we use the *container component* pattern, coined by [React](https://facebook.github.io/react/). The idea behind a container is can be summarized as:

> A container does data fetching and then renders its corresponding sub-component. That’s it.

What this basically means is that we separate our **data-fetching** and **rendering** concerns. This also benefits **reusability** of components. Because if we do not separate fetching data from rendering markup, we only could use the component under that exact circumstance (same API bindings and settings).

Instead the container component should pass data to its child components. Data should be passed via **attribute bindings** to the children and since these children should only be concerned with rendering, we'll call them *markup components*.

To summarize and clarify:

- **Container Components** are only concerned with fetching data. They do not provide any visual user interface elements. Data is usually received by using one or more services.
- **Markup Components** are only concerned with rendering your interface. They know nothing about their surroundings. Instead all information they need is received via their attribute bindings.


An example of this approach is shown below (ES6 only):

``` typescript
angular.module('myModule', [])

    // Container Component
    .directive('userDataContainer', () => ({
		template: '<user-data user="vm.user"></user-data>',
        controller: class {
            constructor(userService) {
                this.userService = userService

                // User service to fetch data
                this.userService.get()
                    .then((user) => this.user = user)
            }
        },
        controller: 'vm',
        bindToController: true
    }))


    // Markup Component
    .directive('userData', () => ({
        template: `
            <strong>{{ user.name }}</strong>
            <div>{{ user.email }}</div>
        `,
        scope: {
            user: '='
        }
    }))
```

