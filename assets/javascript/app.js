//this is the app.js file
// 

//api information
//response
function searchOrganizations() {
    var settings = {
        "url": "https://api.data.charitynavigator.org/v2/Organizations?app_id=00fded8e&app_key=6c3a70e3044ae190334c8287342f5f18",
        "method": "GET"
    }

    $.ajax(settings).then(function (response) {
        console.log(response);
        updatePage(response);

    });

    function updatePage(response) {
        //limit the number of responses?  (default or user selection)
        
        var numberOrgs = response.length;

        for (var i = 0; i < numberOrgs; i++) {
            // charity name and ein
            var charityName = response[i].charityName;
            var ein = response[i].ein;
            console.log("Charity Name" + charityName+ "--- EIN" + ein)
            createCharityBtns(charityName);
        }
    }

    function createCharityBtns(charityName){
        // create the button with the charity name
        var charityDiv = $("<div>");

        var charityBtn = $('<button>');
        var p = $('<p>').text(charityName);
        //id should be the ein 
        


    }
}
// $("#search").on("click", function(event) {
//     event.preventDefault();
//     searchOrganizations();
// }

/////////////////////////////////////Function Calls////////////////////////////////
searchOrganizations();


//return ein for more detailed

//Transfer from api to html
//$("#city").
//$("#state").
//$(#zip).
//address