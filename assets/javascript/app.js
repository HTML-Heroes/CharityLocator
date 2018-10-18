const APPID = "00fded8e";
const APIKEY = "6c3a70e3044ae190334c8287342f5f18";
//this is the app.js file
// 
// firebase storage 
//api information
//response
$(document).ready(function () {

    function searchOrganizations() {
        var settings = {
            "url": "https://api.data.charitynavigator.org/v2/Organizations?app_id=" + APPID + "&app_key=" + APIKEY,
            "method": "GET"
        }

        $.ajax(settings).then(function (response) {
            console.log("response from api" + response);
            updatePage(response)
        });
    }

    function updatePage(response) {
        //limit the number of responses?  (default or user selection)
        // console.log(response);
        var numberOrgs = response.length;

        for (var i = 0; i < numberOrgs; i++) {
            // charity name and ein
            var charityName = response[i].charityName;
            var ein = response[i].ein;
            console.log("Charity Name" + charityName + "--- EIN" + ein)
            createCharityBtns(charityName, ein);
        }
    };

    function createCharityBtns(charityName, ein) {
        // create the button with the charity name
        var charityBtn = $('<button>');
        var p = $('<p>').text(charityName);
        //id should be the ein 
        charityBtn.addClass("charity");
        charityBtn.attr("id", ein);
        charityBtn.append(p);
        $("#infoOne").prepend(charityBtn);
    };

    function getOrganization(ein, APPID, APIKEY) {
        var queryURL = "https://api.data.charitynavigator.org/v2/Organizations/" + ein + "?app_id=" + APPID + "&app_key=" + APIKEY;

        // Performing an AJAX request with the queryURL
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // After data comes back from the request
            .then(function (response) {
                console.log(response);
// WIP getting vars from api ////
                var charName = response.charityName;
                var tagLine = response.tagLine;
                var mission = response.mission;
                // var category = response.category.categoryName;
                var street = response.streetAddress1;
                var city = response.city;
                var state = response.state;
                var zip = response.zip;
                var phone = response.phoneNumber;
                var email = response.generalEmail;
                var website = response.websiteURL;

                console.log (charName,tagLine,mission,category,street,city,state,zip,phone,email,website);
            })
    };


    /////////////////////////////Event Handlers/////////////////////////////////
    // click charityBtn 
    // get button id = ein
    // list out the charity specific details
    // second api call with ein
    //////////////////
    $("#search").on("click", function (event) {
        event.preventDefault();
       searchOrganizations();
        // console.log("dataResponse" + dataResponse);
        // updatePage(dataResponse);
    });


    // var ein = "463867129";
    $(document).on("click", ".charity", function () {
        var ein = $(this).attr("id");
       
        getOrganization(ein, APPID, APIKEY);
    });
    /////////////////////////////////////Function Calls////////////////////////////////
    // searchOrganizations();

    //Transfer from api to html
    //$("#city").
    //$("#state").
    //$(#zip).
    //address
});