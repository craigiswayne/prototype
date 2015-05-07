chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('index.html',{id:"prototype",state:"maximized"},function(app_window){
  	
	//link chrome app styles specifically
	var chrome_app_styles_link = document.createElement("link");
	chrome_app_styles_link.rel = "stylesheet";
	chrome_app_styles_link.href= "nexus_prototype_chrome_app.css";
	  
	  console.debug(app_window.contentWindow);
	  console.debug(app_window.contentWindow.document);
	  app_window.contentWindow.document.write("bitches");
	  //app_window.contentWindow.document.appendChild(chrome_app_styles_link);
  
  });
});