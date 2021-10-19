# IoT LED Mid Project

## About
- Deployable using Docker or manual deploy.
- Not Serverless.

## Structure
```bash
  |-.github/workflows # CI/CD
  |-embedded/** # Codebase for ESP8266 using Platform.IO
  |-server # ExpressJs Server
    |-db # Store SQLite here
    |-** # The rest of the code
```

## TODO
- [ ] Setup env pas build docker
- [ ] Scheduler
- [ ] Schedule API
- [ ] Test TypeORM migration build automation
- [ ] Unit Testing

## Getting Started
- Too many CLI command (just read the package.json)