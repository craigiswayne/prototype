document.write('<div id="adsense" style="visibility:hidden">ad detection script</div>');
var jqo = null;
if($ != null){
  jqo = $;
}
else if(jQuery != null){
  jqo = jQuery;
}
else if($j != null){
  jqo = $j;
}

if(jqo != null){
  jqo(document).ready(checkAds());

  function checkAds() {
      if (jqo("#adsense").is(":visible")) {

          _gaq.push(['_trackEvent', 'AdBlocking Software False', 'false']);
      } else {

          _gaq.push(['_trackEvent', 'AdBlocking Software True', 'true']);
      }
  }
}
