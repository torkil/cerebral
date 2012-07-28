
var page = new WebPage();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

function waitFor( test, then ) {
  var intervall
  intervall = setInterval(function() {
    var data
    data = test()
    if( data ) {
      clearInterval( intervall )
      then( data )
    }
  }, 100)
}

page.open(phantom.args[0], function(status){
  if (status !== "success") {
    console.log("Unable to access network");
    phantom.exit();
  } else {
    
    waitFor(function() {
      return page.evaluate(function(){
        var stats = window.TESTSTATS
        if( stats && stats.error )
          return { error: stats.error }
        if( stats && stats.finnished )
          return stats.data
        else
          return null
      });
    }, function( data ) {

      if( data.error ) {
        if(data.error.originalError && data.error.originalError.srcElement ) {
          console.log('requirejs error, could not find: ' + data.error.originalError.srcElement.src )
        }
        phantom.exit( 1 )
      }

      console.log('\n\n');
      console.log('passes: ', data.passes.length);
      console.log('\n');
      console.log('failures: ', data.failures.length);

      if(data.failures.length) {
        phantom.exit( 1 )
      } else {
        phantom.exit( 0 )
      }

    })

  }
});