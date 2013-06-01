// when page loads, do this
$(document).ready(function(){
   $('#fSelect').change(function(){
      var field = $(this).val();
      var target = $('#dynamic');
      var newInput;
      switch (field) {
         case 'address':
            newInput = $('#iAddress');
            break;
         case 'party':
            newInput = $('#iParty');
            break;
         case 'body':
            newInput = $('#iBody');
            break;
         case 'state':
            newInput = $('#iState');
            break;
         default:
            newInput = $('#iText');
            break;
      }
      // now take that new input element and add the name='value'
      newInput.attr('name', 'value');

      // now replace the contents of target with the new input element
      target.html(newInput);
   });
});