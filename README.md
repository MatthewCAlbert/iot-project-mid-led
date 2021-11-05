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
- [x] Seperate service from controller (unlock unit test)
- [x] Docker Image Ready
- [x] Frontend Endpoint
- [x] Frontend
- [x] Scheduler
- [x] Schedule API
- [x] Actually tested with device
- [ ] TypeORM migration deployment automation (optional)
- [x] Mini Unit Test
- [x] Endpoint Testing

## Getting Started
- Too many CLI command (just read the package.json)