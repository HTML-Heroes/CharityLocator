//this is the app.js file
// 
// firebase storage 
//api information
//response
function searchOrganizations() {
    var settings = {
        "url": "https://api.data.charitynavigator.org/v2/Organizations?app_id=00fded8e&app_key=6c3a70e3044ae190334c8287342f5f18",
        "method": "GET"
    }

    $.ajax(settings).then(function (response) {
        console.log(response);
        return response;
    });

    function updatePage(response) {
        //limit the number of responses?  (default or user selection)
        var numberOrgs = response.length;

        for (var i = 0; i < numberOrgs; i++) {
            // charity name and ein
            var charityName = response[i].charityName;
            var ein = response[i].ein;
            console.log("Charity Name" + charityName+ "--- EIN" + ein)
            createCharityBtns(charityName,ein);
        }
    };

    function createCharityBtns(charityName,ein){
        // create the button with the charity name
        var charityBtn = $('<button>');
        var p = $('<p>').text(charityName);
        //id should be the ein 
        charityBtn.addClass("charity");
        charityBtn.attr("id",ein);
        charityBtn.append(p);
        $("#infoOne").prepend(charityBtn);
    };
}

/////////////////////////////Event Handlers/////////////////////////////////
// click charityBtn 
// get button id = ein
// list out the charity specific details
// second api call with ein
//////////////////
$("#search").on("click", function(event) {
    event.preventDefault();
    searchOrganizations();
    updatePage(response);
});

/////////////////////////////////////Function Calls////////////////////////////////
// searchOrganizations();




//Transfer from api to html
//$("#city").
//$("#state").
//$(#zip).
//address