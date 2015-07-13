---
title: API Specification
---

In order to have a certain consistency across API (JSON) objects, we make use of Typescript's interfaces. Not only will we have all information about API objects on development time, we also get a specification for our RESTful API.

``` typescript
interface Person {
	name: string,
	age: number,
	pets?: array<Pet> 
}
```

> TODO: A task that creates a static document with alle interface definitions would be awesome!