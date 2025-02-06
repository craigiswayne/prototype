# Prototype

### Testing pipeline
make changes
```shell
git add -p
git commit -m 'Your message'
git tag -a v0.0.7 -m 'Release v0.0.7'
git push
git push --tags
```

### Docker
```shell
docker build -t prototype .
docker run -p 4201:4200 prototype
```

```shell
docker build -t prototype .
docker run -p 8080: 80 prototype
```
