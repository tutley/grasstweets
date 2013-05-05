/**
 * Client side JS for the /tweet sending page
 */

function sendTweet() {
   // The below code is just an example of sending arrays via javascript
   // I need to udpate this to send the actual twitter information
   var dataToSend = { 
      page: location.href, 
      data: []
   };
   var dataindex = 0;
   jQuery(".myclass").each(function(){
      var temp = unique_selector(jQuery(this), "");
      dataToSend.data[dataindex++] = {
         selector: temp,
         contents: jQuery(temp).html()
      };
   });
   jQuery.ajax({
      type: 'POST',
      url: "/main/save.php",
      data: JSON.stringify(dataToSend),
      dataType: "json",
      success: function(data){ alert(data); }
   });   
}
