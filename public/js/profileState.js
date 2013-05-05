/**
 * Client side JS for the /profile/state page
 */

$(document).ready(function(){
   // grap the form
   var stateForm = $('#stateForm');
   $('#confirmed').click(function(){
      stateForm.submit();
   });

   // grab the currently selected state if it exists
   var currentState = 'US-' + $('#state').val();
   // This sets up the map to be used for selecting the state
   var map;   
   AmCharts.ready(function() {
       map = new AmCharts.AmMap();
       map.pathToImages = '/img/ammap/';
       map.balloon.color = '#ffffff';
   
       var dataProvider = {
           mapVar: AmCharts.maps.usaLow,
           getAreasFromMap:true                
       };
   
      if (currentState != '') {
         dataProvider.areas = [{ id: currentState, color:'#013435'}];
      }
       map.dataProvider = dataProvider;
   
       map.areasSettings = {
           autoZoom: true,
           selectedColor: '#013435',
           color: '#028d79'
       };

       map.addListener("clickMapObject", function(stateClicked){
         var selState = stateClicked.mapObject.id.replace(/US-/, '');
         $('#state').val(selState);
         $('#modalMessage').html('You selected <b>' + stateClicked.mapObject.title + '</b>');
         $('#confirmModal').modal('show');
         $('#confirmModal').on('hide', function() {
            map.zoomTo(1,0,0);
         });
       });
       map.write("mapdiv");
   });
});