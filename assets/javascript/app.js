const APPID = "00fded8e";
const APIKEY = "6c3a70e3044ae190334c8287342f5f18";

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function buildSearchQueryURL() {

    var queryURL = "https://api.data.charitynavigator.org/v2/Organizations?";

    var queryParams = {
        "app_id": APPID,
        "app_key": APIKEY
    };

    var searchTerm = $("#charityName")
        .val()
        .trim();

    if (searchTerm) {
        queryParams.search = searchTerm
    };

    queryParams.searchType = "NAME_ONLY";

    var state = $("#state")
        .val()
        .trim();

    if (state) {
        queryParams.state = state
    };

    var city = $("#city")
        .val()
        .trim();

    if (city) {
        queryParams.city = city
    };

    var zip = $("#zipcode")
        .val()
        .trim();

    if (zip) {
        queryParams.zip = zip
    };

    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}


$(document).ready(function () {

    function searchOrganizations() {

        // Empty the button region
        $("#infoOne").empty();

        // Build the query URL for the ajax request to the NYT API
        var queryURL = buildSearchQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            updatePage(response)
        });
    }

    function updatePage(response) {
        var numberOrgs = response.length;

        for (var i = 0; i < numberOrgs; i++) {
            // charity name and ein
            var charityName = response[i].charityName;
            var ein = response[i].ein;
            var state = response[i].mailingAddress.stateOrProvince;
            //console.log("Charity Name" + charityName + "--- EIN" + ein)
            // createCharityBtns(charityName, ein, state);
            createCharityCard(charityName, ein, state);
        }
    };

    function createCharityBtns(charityName, ein, state) {
        // create the button with the charity name
        var charityBtn = $('<button>');
        var p = $('<p>').text(charityName);
        //id should be the ein 
        charityBtn.addClass("charity");
        charityBtn.attr("id", ein);
        charityBtn.append(p);
        $("#infoOne").prepend(charityBtn);
    };

    function createCharityCard(charityName, ein, state) {

        // create the button with the charity name
        // var charityImg = $('<img>);
        console.log("Creating the cards");

        var charityCrd = $('<card>'); //overall card 
        var cSpan = $('<span>');
        var cInfo = $('<div>');
        var cInfoContent = $('<p>');
        var cHREF = $('<a>');
       
        charityCrd.addClass("card charity");
        cSpan.addClass("card-title");
        cSpan.text(charityName);
        
        cInfo.addClass("card-content");
        cInfoContent.text("Location: " +state);

        cSrc=$('<div>').addClass("card-action");
         //id should be the ein 
        cHREF.attr("id", ein);
        cHREF.attr("href", "http://www.cnn.com");
        cHREF.text("More Charity Info");

        cSrc.append(cHREF);
        cInfoContent.append(cSrc);
        cInfo.append(cInfoContent);
        cSpan.append(cInfo);
        charityCrd.append(cSpan);

        $("#infoOne").prepend(charityCrd);


    };

    function getOrganization(ein, APPID, APIKEY) {
        var orgArea = $("#infoTwo").empty();

        var queryURL = "https://api.data.charitynavigator.org/v2/Organizations/" + ein + "?app_id=" + APPID + "&app_key=" + APIKEY;

        // Performing an AJAX request with the queryURL
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // After data comes back from the request
            .then(function (response) {
                //console.log(response);
                var charName = response.charityName;
                var tagLine = response.tagLine;
                var mission = response.mission;

                var deductability = response.irsClassification.deductibility;
                var subsection = response.irsClassification.subsection;
                var classification = response.irsClassification.classification;


                var street = response.mailingAddress.streetAddress1;
                var city = response.mailingAddress.city;
                var state = response.mailingAddress.stateOrProvince;
                var zip = response.mailingAddress.postalCode;
                var website = response.websiteURL;
                console.log(charName, tagLine, mission, deductability, subsection, classification, street, city, state, zip, website);

                var newDiv = $("<div>")
                    .addClass("charityInfo");
                var charityName = $("<p>")
                    .attr("id", "charName")
                    .text(charName)
                    .appendTo(newDiv);

                if (tagLine) {
                    var tagLineText = $("<p>")
                        .attr("id", "tagLine")
                        .text(tagLine)
                        .appendTo(newDiv);
                };
                if (mission) {
                    var missionText = $("<p>")
                        .attr("id", "mission")
                        .text(mission)
                        .appendTo(newDiv);
                };

                if (deductability) {
                    var deductable = $("<p>")
                        .attr("id", "deductability")
                        .text("Deduction Status: " + deductability)
                        .appendTo(newDiv);
                };
                if (subsection) {
                    var subsect = $("<p>")
                        .attr("id", "subsection")
                        .text("Filing Status: " + subsection)
                        .appendTo(newDiv);
                };
                if (classification) {
                    var classify = $("<p>")
                        .attr("id", "classification")
                        .text("Organization Classification: " + classification)
                        .appendTo(newDiv);
                };


                var addressDiv = $("<div>")
                    .addClass("fullAddress");
                if (street) {
                    var address1 = $("<p>")
                        .addClass("address1")
                        .text(titleCase(street))
                        .appendTo(addressDiv);
                };

                if (city && state && zip) {
                    var address2 = $("<p>")
                        .addClass("address2")
                        .text(titleCase(city) + ", " + state + " " + zip)
                        .appendTo(addressDiv);
                } else if (city && state && !zip) {
                    var address2 = $("<p>")
                        .addClass("address2")
                        .text(titleCase(city) + ", " + state)
                        .appendTo(addressDiv);
                } else if (!city && state && zip) {
                    var address2 = $("<p>")
                        .addClass("address2")
                        .text(state + " " + zip)
                        .appendTo(addressDiv);
                } else if (!city && state && !zip) {
                    var address2 = $("<p>")
                        .addClass("address2")
                        .text(state)
                        .appendTo(addressDiv);
                };

                if (state) {
                    addressDiv.append(address2);
                    newDiv.append(addressDiv);
                };

                if (website) {
                    var webURL = $("<p>")
                        .addClass("website")
                        .text(website)
                        .appendTo(newDiv);
                };

                orgArea.append(newDiv);
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

        var searchTerm = $("#charityName").val().trim();
        var state = $("#state").val().trim();
        var city = $("#city").val().trim();
        var zip = $("#zipcode").val().trim();

        if (searchTerm || state || city || zip) {
            searchOrganizations();
            $("form")[0].reset();

        }
    });


    $(document).on("click", ".charity", function () {
        var ein = $(this).attr("id");
        getOrganization(ein, APPID, APIKEY);
    });

});