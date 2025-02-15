# Prototype

### Testing pipeline
make changes
```shell
VERSION="v0.0.22"
git fetch --all --prune --prune-tags
git commit -am "Testing pipeline: $VERSION"
git tag -a $VERSION -m "Release $VERSION"
git push
git push --tags
echo 'Done :)'
```
