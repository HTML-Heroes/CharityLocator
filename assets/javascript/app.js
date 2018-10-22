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
        .val().toUpperCase()
        .trim();

    if (state) {
        queryParams.state = state
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
            createCharityCards(charityName, ein, state);
        }
    };

    // Replaced createCharityBtns method with 
    // function createCharityBtns(charityName, ein, state) {
    //     // create the button with the charity name
    //     var charityBtn = $('<button>');
    //     var p = $('<p>').text(charityName);
    //     //id should be the ein 
    //     charityBtn.addClass("charity");
    //     charityBtn.attr("id", ein);
    //     charityBtn.append(p);
    //     $("#infoOne").prepend(charityBtn);
    // };

    function createCharityCards(charityName, ein, state) {

        console.log("Creating the cards");

        var cColDiv = $('<div>').addClass("col s12 m6");
        var charityCrd = $('<div>'); //overall div 
        var cSpan = $('<span>');
        var cInfo = $('<div>');
        var cInfoContent = $('<p>');
        var cHREF = $('<a>').addClass("moreInfoLink");

        charityCrd.addClass("card charity lighten-5 z-depth-3");
        cSpan.addClass("card-title");
        cSpan.text(charityName);

        cInfo.addClass("card-content");
        cInfoContent.text("Location: " + state + "📍");

        cSrc = $('<div>').addClass("card-action");
        //id should be the ein 
        cHREF.attr("id", ein);
        // cHREF.attr("href","more.html");
        cHREF.text("More Charity Info →");

        cSrc.append(cHREF);
        cInfoContent.append(cSrc);
        cInfo.append(cInfoContent);
        cSpan.append(cInfo);
        charityCrd.append(cSpan);
        cColDiv.append(charityCrd);

        $("#infoOne").prepend(cColDiv);
    };

    function showArticles(response) {
        $("#pictureTwo").empty();

        var articles = response.articles;

        var numArticles = articles.length;

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        for (var i = 0; i < numArticles; i++) {
            // Get specific article info for current index
            var article = articles[i];
            // Increase the articleCount (track article # - starting at 1)
            var articleCount = i + 1;

            // If the article has a headline, log and append to $articleList
            var headline = article.title;
            var $articleListItem = $("<li class='list-group-item articleHeadline'>");

            if (headline) {
                console.log(headline);
                $articleListItem.append(
                    "<span class='label label-primary'>" +
                    articleCount +
                    "</span>" +
                    "<strong> " +
                    headline +
                    "</strong>"
                );
            }
            var source = article.source.name;
            if (source) {
                console.log(source);
                $articleListItem.append("<h5>Source: " + source + "</h5>");
            }

            // If the article has a byline, log and append to $articleList
            var byline = article.author;
            if (byline) {
                console.log(byline);
                $articleListItem.append("<h5>By: "+ byline + "</h5>");
            }

            // Log published date, and append to document if exists
            var publishedDate = article.publishedAt;
            var pubDate = new Date(publishedDate).toDateString();

            console.log(pubDate);
            if (pubDate) {
                $articleListItem.append("<h5>Published Date: " + pubDate + "</h5>");
            }

            // Log description, and append to document if exists
            var articleDescription = article.description;
            console.log(articleDescription);
            if (articleDescription) {
                $articleListItem.append("<h5>Description: " + articleDescription + "</h5>");
            }

            // Append and log url
            $articleListItem.append("<a href='" + article.url + "' target=_blank'>" + article.url + "</a>");
            console.log(article.url);

            // Append the article
            $articleList.append($articleListItem);
        }
        // Add the newly created element to the DOM
        $("#pictureTwo").append($articleList);
        
    }

    function createArticleKeyword(charityName) {
        var newName = charityName.split(" ").map(function (word) {
            return "+" + word;
        }).join('');
        return newName;
    }


    function relatedArticles(charName) {

        var charityName = createArticleKeyword(charName);
        console.log(charityName);

        var queryURL = "https://newsapi.org/v2/everything?"

        var queryParams = {
            "q": encodeURI(charityName),
            "apiKey": "9c723903ae814ccdb40ee406f122e2ef",
            "sortBy": "relevancy",
            "pageSize": "10"
        };

        queryArticleURL = queryURL + $.param(queryParams);
        console.log("Article URL call" + queryArticleURL);

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryArticleURL,
            method: "GET"
        })
            // After data comes back from the request
            .then(function (response) {
                // console.log(response);
                showArticles(response);
            });
    }

    function getOrganization(ein, APPID, APIKEY) {
        //location.href="more.html";

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
                console.log(charName, tagLine, mission, deductability, subsection, classification, street, state, website);

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
                    var webURL = $("<a>")
                        .addClass("website")
                        .attr("href",website)
                        .attr("target","_blank")
                        .text(website)
                        .appendTo(newDiv);
                };
                orgArea.append(newDiv);

                relatedArticles(charName);
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

        if (searchTerm || state) {
            searchOrganizations();
            //$("form")[0].reset();
            $("#charityName").val('');
            $("#state").val('');
        }
    });


    $(document).on("click", ".moreInfoLink", function () {
        var ein = $(this).attr("id");
        getOrganization(ein, APPID, APIKEY);
    });

});