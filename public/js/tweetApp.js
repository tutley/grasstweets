/**
 * Client side JS for the /tweet sending page
 */


/**
 * function sendTweet(callback)
 *
 * This function sends the post information to the server to send the tweets
 * then executes the callback function sending the parameters back to the
 * click() function
 *
 * @param  {Array}    tReps      the target representatives
 * @param  {String}   msg        the message to be sent
 * @param  {Function} callback [description]
 */
function sendTweet(tReps, msg, callback) {
   $.ajax({
      type: 'POST',
      url: '/tweet',
      dataType: 'json',
      data: {
         message: msg,
         reps: tReps
      }
   }).done(function(data){
      callback(true, data.tweetURL);
   }).fail(function(data) {
      var response = JSON.parse(data.responseText);
      callback(false, response);
   });
}

/**
 * function getShort(url) {
 * @param  {String} url The input url, pre-shortened
 */
function getShort(url, callback) {
   var apiKey = 'AIzaSyAT1kM2nM7-hmqrb5A4uoJrjoWY1zTsah0';
   gapi.client.setApiKey(apiKey);
   var longurl = url;

   gapi.client.load('urlshortener', 'v1', function() {
       var request = gapi.client.urlshortener.url.insert({
           'resource': {
               'longUrl': longurl
           }
       });
       var resp = request.execute(function(resp) {
           if (resp.error) {
               console.log(resp.error.message);
               callback(url, url);
           } else {
               callback(url, resp.id);
           }
       });
   });
}

function calculateChars(initial) {
   var longest = 0;
   var countReps = 0;
   $("button.repBtn.active").each(function(){
      countReps++;
      var unameLength = parseInt($(this).attr('data-nameLength'), 10);
      if (longest < unameLength) {
         longest = unameLength;
      }
   });
   var newMax = initial-longest;
   var allowedChars = newMax - $('#message').val().length;
   $('#charsCounter').text(allowedChars);
   $('#repsCounter').text(countReps);
   return newMax;
}

// when page loads, do this
$(document).ready(function(){
   var startingMax = parseInt($('#charsCounter').text(), 10);
   var maxChars = calculateChars(startingMax);

   // watch the category checkboxes for clicks

   $('.categories').click(function(){
      var thisCat = $(this).val();
      if (!$(this).hasClass('active')) {
         // show the category and select each representative by default
         $('#'+thisCat).show();
         $('#'+thisCat).find('.repBtn').each(function(){
            $(this).addClass('active');
         });
         maxChars = calculateChars(startingMax);
      } else {
         // hide the category and deselect all representatives
         $('#'+thisCat).hide();
         $('#'+thisCat).find('.repBtn').each(function(){
            $(this).removeClass('active');
         });
         maxChars = calculateChars(startingMax);
      }

   });

   // watch the party checkboxes for clicks
   $('.parties').click(function(){
      var thisParty = $(this).val();
      if ($(this).is(':checked')) {
         // select all unselected members of that party in categories that are shown
         $('div.repCategory:visible').find('.'+thisParty).each(function(){
            $(this).addClass('active');
         });
         maxChars = calculateChars(startingMax);
      } else {
         // deselect all members of that party
         $('.'+thisParty).each(function(){
            $(this).removeClass('active');
         });
         maxChars = calculateChars(startingMax);
      }
   });

   //$('.repBtn').css( 'cursor', 'pointer' );

   // watch each repBtn for clicks
   $('.repBtn').click(function(){
      var btn = $(this);
      btn.button('toggle');

      // also change the chars available based on the length of the rep twittername
      maxChars = calculateChars(startingMax);
   });

   // watch the category selectors for clicks

   // watch the message box and adjust the chars left as needed
   $('#message').keyup(function(){
      maxChars = calculateChars(startingMax);
      var allowedChars = maxChars - $('#message').val().length;
      if (allowedChars < 0) {
         if(/((http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/.test($('#message').val())) {
            $('#shorten').click();
         } else {
            $('#message').val($('#message').val().substring(0, maxChars));
            $('#charsCounter').text('0');
         }
      } else {
         $('#charsCounter').text(allowedChars);
      }
   });

   // watch the shorten urls button
   $('#shorten').click(function() {
      var message = $('#message').val();
      var exp = /((http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/gi,
         match, matches = [],
         decode = function(s) {
            getShort(s, function(input, output) {
               $('#message').val($('#message').val().replace(input, output));
            });
         };
      while (match = exp.exec(message)) {
         decode(match[1]);
      }
   });

   // watch the tweetBtn
   var tReps = Array();
   $('#tweetBtn').click(function() {
      var msgLen = $('#message').val().length;
      var selReps = parseInt($('#repsCounter').text(), 10);
      if (msgLen > 0 && selReps > 0) {
         tReps.length=0;
         var count = 0;
         $("button.repBtn.active").each(function(){
            count++;
            tReps.push($(this).attr('data-repId'));
         });
         var confMessage = 'You are about to send <strong>' + count + '</strong> tweets, one to each representative you have selected.';
         $('#modalMessage').html(confMessage);
         $('#confirmModal').modal('show');
      }
});

   // watch for the confirmed button (to send the tweet)
   $('#confirmed').click(function(){
      var message = $('#message').val();
      var progressBar = '<div class="span1">&nbsp;</div>';
      progressBar += '<div class="progress progress-striped active span6">';
      progressBar += '<div class="bar" style="width: 50%;"></div>';
      progressBar += '</div>';


         /*
Need to look at this fr a better progress bar:
$(function () {
    var total    = 5,
        current  = 1,
        response = [];
    function do_ajax() {
        $.ajax({
            url : '/tweet/status?tid=' + result
            success : function (serverResponse) {
                response[response.length] = serverResponse;
                $('#progress-bar').text(current + ' of ' + total + ' are done');
                current++;
                if (current <= total) {
                    do_ajax();
                }
            }
        });
    }
});

Of course this means I'll have to re-do the server side as well
 */


      $('#tweetForm').html(progressBar);
      $('#confirmModal').modal('hide');

      sendTweet(tReps, message, function(itWorked, result) {
         if (itWorked) {
            var yay = '<div><h2>Bingo!</h2><p>Looks like your tweet has been sent. How exciting!</p>';
            yay += '<p>Now go and check out the <a href="' + result;
            yay += '">tweet summary</a>!</p></div>';
            $('#tweetForm').html(yay);
         } else {
            var ohNo = '<div><h2>Oh No!</h2><p>Looks like something has gone terribly wrong.</p>';
            ohNo += '<p>Here is the response we got back from the server:</p>';
            ohNo += '<pre>' + result.error.message + '</pre></div>';
            $('#tweetForm').html(ohNo);
         }
      });

   });
});


