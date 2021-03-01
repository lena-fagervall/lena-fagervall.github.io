(function($) {
  var local = '127.0.0.1' === document.location.hostname;
  var apiRoot = local ? 'http://localhost:7071/api' : 'https://henrikbeckerapi.azurewebsites.net/api';
	$.get(apiRoot + '/ip')
	  .done(function (ip) {
	  	$(".contact-form").each(function(){
			var that = $(this);
			that.submit(function (e) {
				e.preventDefault();
				$(".status", that).html("");
				$.ajax({
          type: 'POST',
          url: apiRoot + '/contact',
          dataType: 'json',
          contentType: 'application/json',
					data: JSON.stringify({
            subject: 'Contact Form',
            from: $("#from", that).val(),
            name: $("#from", that).val(),
					  address: ip,
					  message: $("#message", that).val()
          }),
          success: function() {
            $("#from, #message", that).val("");
            $(".btn", that).html("Skickat!").show();
            $(".status", that).html("");
            window.setTimeout(function () { 
              $(".btn", that).html("Kontakta mig!");
            }, 10000);
          },
          error: function (a, b, c) {
            $(".status", that).html(c).show();
          }
				});
				return false;
			});		
		});
	});

  var keepApiAlive = function () {
    var ping = function () {
      console.log('Ping');
      fetch(apiRoot + '/ping')
        .then(function (response) { return response.text(); })
        .then(function (response) { console.log(response); });
    };
    ping();
    var handle = window.setInterval(ping, local ? 600000 : 60000);
    window.addEventListener('unload', function () { window.clearInterval(handle); });
  }
  keepApiAlive();
})(jQuery);

