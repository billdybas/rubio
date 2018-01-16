# rubio

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## About

Rubio defines conventions, structure, and an intuitive interface for building web APIs. It is a tool that manages tools.

While it's awesome that Node encourages small well-defined packages for libraries and tools, when you actually need to build an API for a product, it can feel like you're spending more time curating packages that fit your needs and setting them up to integrate with your codebase than actually writing business logic. On top of that, you have to manage those dependencies and keep them up to date, making sure nothing breaks when you do. Additionally, especially for beginners, it may be unclear how to structure one's folders and files.

Rubio aims to solve this.

We curate a handful of API-related Node packages that the community has decided do a great job at what they do. These are packages that are well-known, well-tested, and well-maintained. We define a consistent interface on top of these packages, so they can be swapped out at any time without you having to change any of your application code, and we define an optional, yet recommended folder structure.

We realize that no two packages are alike and often diverge in feature-sets, and trying to provide a consistent interface usually means catering to the lowest common denominator. That's why we try to keep our API slim, focusing on the core essence of the problems these packages are trying to solve, and we provide a reference to the underlying tool so you can use its more advanced features if you need to. Keep in mind, though, this couples you to the tool.

Rubio also defines conventions around building API modules which can be shared and reused between projects. These modules are self-contained Node packages which contain all the routes, controllers, models, database tables/schemas, etc. that you need to incorporate the API feature the module provides. For example, one could create a "blog" module which contains everything necessary to run a blog (Posts, Users, Comments, and CRUD operations) – you could add the module as a dependency, register it in Rubio, and then build on top of it with new features. You can imagine similar modules for file uploads, url shorteners, and more.

Rubio is not a framework like [express](https://expressjs.com/), [koa](http://koajs.com/), [hapi](https://hapijs.com/), or [micro](https://github.com/zeit/micro). In fact, you must actually use one of them with Rubio. These frameworks are effective at understanding how to accept and route web requests (ie. HTTP), parse headers and bodies, apply middleware, and send responses, but everything else one may want in delivering a featureful service is left up to you like integrating with a database or authenticating with other services. Rubio gives you these extras and lets you use them with the existing framework you're most comfortable with.

## Motivation

There is a significant trend of web frontends being decoupled from their backends, especially with Single-page App ecosystems like React, Vue, and Angular and mobile application platforms like iOS and Android. As a result, the concerns of many current Node MVC-style frameworks no longer meet the demands for today's business requirements and are often inflexible for writing APIs, as they often use conventions which don't match the API paradigm (eg. sessions, view-engines).

We need tools that are first-class citizens for APIs. We need tools that make developing a backend in Node simpler and less of a chore. We need tools which emphasize getting started quickly, deferring detailed configuration until later, when a project's requirements are more well-known. We need tools that are simple to understand, so beginners can learn what choices go into architecting a web API.

That's why Rubio exists.

## Getting Started

Coming Soon.

## Development & Testing

We use [Lerna](https://lernajs.io/) to manage multiple packages. See each package for more detailed instructions.

## Contributing

Thank you for your interest in contributing. We're just getting started designing and laying the foundation for Rubio, and will let you know when your help is needed. Follow us on [Twitter](https://twitter.com/billdybas) for news and updates.

## License

Rubio is released under the MIT License. See `LICENSE.md`.
