chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('index.html',{id:"prototype",state:"maximized"},function(){});
});


/*
chrome.fileSystem.chooseEntry({type:'saveFile'},function(writableFileEntry){
  writableFileEntry.createWriter(function(writer){
    writer.onerror = errorHandler;
    writer.onwriteend = function(e){
      console.log('write complete');
    };
    writer.write(new Blob(['1234567890'],{type:'text/plain'}));
  },errorHandler)
});*/

function errorHandler(e){
  console.error(e);
}

function displayPath(fileEntry){
  chrome.fileSystem.getDisplayPath(fileEntry,function(path){
    console.debug(path);
  });
}
