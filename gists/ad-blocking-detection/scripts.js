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
  function checkAds(){
    if (jqo("#adsense").is(":visible")){
      jqo("body").addClass("ads_visible");
      //document.write("<script>_gaq.push(['_trackEvent', 'Adblock', 'Unblocked', 'false',,true]);</sc" + "ript>");
    }else{
      jqo("body").addClass("ad_blocking");
      //document.write("<script>_gaq.push(['_trackEvent', 'Adblock', 'Blocked', 'true',,true]);</sc" + "ript>");
    }
  }
}
