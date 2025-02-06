# Prototype

### Testing pipeline
make changes
```shell
$VERSION="v0.0.11"
git add -p
git commit -m 'Your message'
git tag -a $VERSION -m 'Release $VERSION'
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
