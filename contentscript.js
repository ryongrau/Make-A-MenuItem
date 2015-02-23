jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

$( document ).ready(function() {
    console.log( "M-A-MI at the ready:");
	console.log( "M-A-MI referring URL:" + document.referrer );
	for (var valuePair in $.url().param()){
		try {
			console.log('M-A-MI:'+valuePair + ' : ' + $.url().param(valuePair));
			switch(valuePair) {
				case 'mamititle':
					$('#edit-link-title').val($.url().param(valuePair));
				break;
				
				case 'mamipath':
					$('#edit-link-path').val($.url().param(valuePair));
				break;
				
				case 'mamienabled':
					if($.url().param(valuePair)==='TRUE'){
						$('#edit-enabled').prop('checked',true);}
					else {	$('#edit-enabled').prop('checked',false);}
				break;

				case 'mamiparent':
					$('#edit-parent option[value="' + $.url().param(valuePair) + '"]').prop('selected',true);
				break;
				
				
				
			}
		} catch(err) {
			console.log(err);
		}
	}
	if($.url(document.referrer).param("dnkffautopublish") ==='true' && document.referrer != ''){
		$(':regex(href,workflow)').first().each(function(){
			console.log('link:' + $(this).attr('href'));
			window.location.replace('https://cms.doe.gov' + $(this).attr('href') + '?dnkffautopublish=workflow1')
		});
	} 
	if($.url(document.referrer).param("dnkffautopublish") ==='workflow2' && document.referrer != ''){

		chrome.runtime.sendMessage('close me',function(response){
			console.log('dnkffautopublish sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
		
	} 

});

//I *think this is chaff now..
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                request.greeting);
	populateFields(request.greeting)
	
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });

  
  
function populateFields(greeting){
	console.log('populateFields:' + greeting);
	var reqs=greeting.split('\t');
	var myTime = reqs[0];
	var myTitle = reqs[1];
	var mySummary = reqs[2];
	$('#edit-field-primary-location-und-0-value').val('none');
	$('#edit-title').val(myTitle);
	$('#edit-body-und-0-summary').val(mySummary);
	$('#cke_contents_edit-body-und-0-value body').html(mySummary);
	$('iframe').contents().find('body').html(mySummary);
	$('#edit-publish-date-datepicker-popup-0').val(myTime);
	
	$('html, body').animate({ 
		scrollTop: $(document).height()-$(window).height()}, 
		000
	);
	var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;">' + $.url().param('dnkffURL') + '</div>';
	$('body').append(htmlstr);
	$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 

}






