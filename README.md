# Prototype

![docker badge](http://dockeri.co/image/craigiswayne/prototype)

### Testing pipeline
make changes
```shell
VERSION="2.0.1"
git fetch --all --prune --prune-tags
git commit -am "Testing pipeline: $VERSION"
git tag -a $VERSION -m "Release $VERSION"
git push
git push --tags
echo 'Done :)'
```
