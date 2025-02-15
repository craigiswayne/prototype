# Prototype

### Testing pipeline
make changes
```shell
$VERSION="v0.0.21"
git fetch --all --prune --prune-tags
git commit -am "Testing pipeline: $VERSION"
git tag -a $VERSION -m "Release $VERSION"
git push
git push --tags
echo 'Done :)'
```

```shell
docker build -t prototype .
docker build -t prototype:latest .
docker run -p 8080: 80 prototype
```
