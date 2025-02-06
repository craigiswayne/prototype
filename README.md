# Prototype

### Testing pipeline
make changes
```shell
$VERSION="v0.0.18"
git commit -am "Testing pipeline: $VERSION"
git tag -a $VERSION -m "Release $VERSION"
git push
git push --tags
echo 'Done :)'
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
