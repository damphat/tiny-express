## tiny-express
This is a tiny web framework.
I tried to remake `expressjs` from scratch with some objectives:
- no dependencies (only devDependencies)
- finish this project **in < 1 day**. 
- KISS principle applied!

## Features
- support http methods: `app.get()`, `app.post()`
- support middleware: `app.use(middlewares)`
- multiple handlers: `app.METHOD(path, handler1, handler2, ...)`
- support parameters: `app.get("/user/:id")`
- more ...

## Demo
/examples/helloworld.js

```
npm install
npm run demo
```

## For fun. Don't use this in production
