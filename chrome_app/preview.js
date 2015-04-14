chrome.storage.local.clear();

chrome.storage.onChanged.addListener(function(changes){

  if(changes.css){
    if(changes.css.newValue){
      document.querySelector("#nexus_prototype_styles").innerHTML = changes.css.newValue;
    }
  }

  if(changes.html){
    if(changes.html.newValue){
      document.querySelector("body").innerHTML = changes.html.newValue;
    }
  }

  if(changes.js){
    if(changes.js.newValue){
      document.querySelector("#nexus_prototype_scripts").innerHTML = changes.js.newValue;
      console.debug(changes.js.newValue);
      eval(changes.js.newValue);
    }
  }

});
