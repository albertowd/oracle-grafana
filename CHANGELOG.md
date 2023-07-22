# Oracle Grafana Changelog

## 1.0.0 (Unreleased)

Initial release as a Datasource with internal backend support.

### Added
* Github Actions for making releases
* Scripts to make release files and update dev containers
* Support for variables on queries
* Support for Query variables

### Removed
* Dockerfile
* GitLab CI/CD
* NodeJs external service
* Pod for develop
* SonarQube scan (for now)

### Updated
* CHANGELOG file
* Config editor refactor to group information
* Docker compose file to develop
* Examples images
* Grafana framework
* Libraries
* README file
* Query editor refactor with SQL preview

## 0.9.0 (unreleased)

Import from https://github.com/JamesOsgood/mongodb-grafana

### Added
* Simple SELECT queries now works
* Dockerfile for containering
* Entire server rewrite using ES2020
* Examples with images and queries
* GitLab CI/CD
* Lint scan
* Oracle driver
* Winston/Morgan logger
* Pod for develop
* SonarQube scan

### Removed
* MongoDb driver

### Updated
* Lib updates

---
# TODO
* SonarQube scan
* Real tests
