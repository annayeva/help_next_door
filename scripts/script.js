
/********************SAVING TO LOCAL STORAGE****************************************/
var aHelpRequests = [];
var aUsersData = [];
var nearMeCounter = 0;
var requestedData = -1;
var processedData = 0;

//console.log(nearMeCounter);

if (localStorage.sRequestsData) {
    //console.log ("THERE IS DATA IN LS");
    aHelpRequests = JSON.parse(localStorage.sRequestsData);
}



function getUserData() {
    $.ajax({
        "url": "api-get-users.php",
        "method": "GET",
        "dataType": "JSON",
        "cache": false
    }).done(function(sUsersData) {
        localStorage.setItem('sUsersData', JSON.stringify(sUsersData));
        aUsersData = JSON.parse(localStorage.sUsersData);
    });
}

/********************GOOGLE MAPS FUNCTIONS****************************************/

var map;
initMap();

function initMap() {
    if ($("html").attr("id").length > 0) {
        map = new google.maps.Map(document.getElementById('map-canvas'), {

            center: {
                lat: 55.701058,
                lng: 12.537260
            },

            zoom: 1

        });


        getDataFromJson();
    }
}

function setMarker(lat, lng) {



    var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';


    marker = new google.maps.Marker({

        position: new google.maps.LatLng(lat, lng),

        map: map,

        icon: image

    });

}


function setUserMarker(lat, lng) {

    var image = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';


    marker = new google.maps.Marker({

        position: new google.maps.LatLng(lat, lng),

        map: map,

        icon: image


    });

    centerMap(lat, lng);

}



function centerMap(la, ln) {

    map.setZoom(13);
    map.panTo({
        lat: la,
        lng: ln
    });

}


function addressToGeoloc(url, func) {

    var finalUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + url + '&region=dk&key=AIzaSyACjYUZ9-ukx_x6qxkdGEIlANjFjIrVfFA';

    $.getJSON(finalUrl, function(jData) {
        if (jData.status == "OK") {
            //console.log(jData.results);
            var lat = jData.results[0].geometry.location.lat;
            var lng = jData.results[0].geometry.location.lng;

            if (func !== null) {
                func(lat, lng);
            }
        } else console.log("error");
    });
}



function searchForAddress() {
    var zipcodeSearch = $("#input-address-search").val();

    var url = zipcodeSearch;

    //console.log(url);

    addressToGeoloc(url, centerMap);

}

var myflag = false;

function checkNotification() {
    if (requestedData === processedData) {
        //console.log("nearMeCounter" + nearMeCounter);

        nearMeNotif(nearMeCounter);
    }
}



/*  -------------GET ALL HELP REQUESTS from JSON----------------------------------------*/

function getDataFromJson() {
    //console.log("ssta");
    $("#wdw-help-requests .row").empty(); // emptying the window 
    //fetching the json data with AJAX

    //console.log ("here");
    $.ajax({
        "url": "api-get-requests.php",
        "method": "GET",
        "dataType": "JSON",
        "cache": false
    }).done(function(jRequestsData) {
        //  console.log ("here");
        // console.log (jData);
        localStorage.setItem('sRequestsData', JSON.stringify(jRequestsData));

        requestedData = jRequestsData.length;
        // looping through each json object in the received array 
        jRequestsData.forEach(function(jRequest) {

            //appending info to the window

            console.log(jRequest);
            var requestAddress = jRequest.address;
            var requestZip = jRequest.zip;

            var sessionid = $('html').attr('id');
            // console.log("sessionid " + sessionid);
            if (sessionid == jRequest.userId) {

                //nearMeCounter = nearMeCounter +1;



                $("#wdw-my-requests .row").append('<div class="col-sm-6 col-md-4"><div class=" request-box thumbnail"><img src="' + jRequest.pic + '" alt="..."><div class="caption"><h3>' + jRequest.title + '</h3><h5> ZIP:' + jRequest.zip + '</h5><p>' + jRequest.description + '</p><p> <a href="#" class="btn btn-default" role="button">Delete</a></p></div></div></div>');
            } else {
                $("#wdw-help-requests .row").append('<div id="' + jRequest.id + '" class="col-sm-6 col-md-4"><div class=" request-box thumbnail"><img src="' + jRequest.pic + '" alt="..."><div class="caption"><h3>' + jRequest.title + '</h3><h5> ZIP:' + jRequest.zip + '</h5><p>' + jRequest.description + '</p><p><a class="btn btn-success" href="mailto:' + jRequest.userEmail + '?subject=Help%20Next%20Door%20-%20%22' + jRequest.title + '%22&amp;body=Hello%20' + jRequest.userName + '!%20I%60m%20your%20neighbor%2C%20I%20would%20like%20to%20offer%20you%20help%2C%20let%20me%20know%20if%20you%20still%20need%20it.">Offer help</a> <a href="#" class="btn btn-default btn-find-tag" role="button">Find</a></p></div></div></div>');
            }


            var sApiLink = "api-get-user.php?user_id=" + sessionid;
            //console.log(sApiLink);

            $.getJSON(sApiLink, function(jUserData) {

                // console.log("requestAddress: " + requestAddress);
                // console.log("mainUserAddress: " + jUserData.userAddress);

                var mainUserAddress = jUserData.userAddress;
                if (mainUserAddress == requestAddress) {

                    addressToGeoloc(mainUserAddress, setUserMarker);

                } else {
                    addressToGeoloc(requestAddress, setMarker);

                    if (requestZip == jUserData.userZip) {
                        nearMeCounter = nearMeCounter + 1;


                        //console.log("NEAR YOU");

                        $("#wdw-near-me .row").append('<div id="' + jRequest.id + '" class="col-sm-6 col-md-4"><div class=" request-box thumbnail"><img src="' + jRequest.pic + '" alt="..."><div class="caption"><h3>' + jRequest.title + '</h3><h5> ZIP:' + jRequest.zip + '</h5><p>' + jRequest.description + '</p><p><a class="btn btn-success" href="mailto:' + jRequest.userEmail + '?subject=Help%20Next%20Door%20-%20%22' + jRequest.title + '%22&amp;body=Hello%20' + jRequest.userName + '!%20I%60m%20your%20neighbor%2C%20I%20would%20like%20to%20offer%20you%20help%2C%20let%20me%20know%20if%20you%20still%20need%20it.">Offer help</a> <a href="#" class="btn btn-default btn-find-tag" role="button">Find</a></p></div></div></div>');
                    }
                }
                //console.log("nearMetempcount " + nearMeCounter);
                processedData++;
                //console.log("processedData " + processedData);


                checkNotification();
            });
        });

    });
}

//console.log (aHelpRequests);


/***********************EVENTS*************************************/




$("#btn-search-zip").click(function() {
    //console.log("x");
    searchForAddress();
});


$("#btnSignup").click(function() {
    hideWindowsAndShowOneWindow("wdw-signup");
});


$("#btn-my-requests").click(function() {
    //console.log("x");
    showMyRequests();
});


$("#btn-home").click(function() {
    //console.log("x");
    showHome();
});


$("#btn-near-me").click(function() {
    //console.log("x");
    showNearMe();
});

$(document).on("click", ".btn-find-tag", function() {
    // console.log("x");
    //document.getElementById('notify-sound').play();


    var idForFind = $(this).parent().parent().parent().parent().attr('id');
    //console.log ( "HEREEE", idForFind);
    for (i in aHelpRequests) {

        var requestId = aHelpRequests[i].id;
        //console.log(idForFind);

        if (idForFind == requestId) {
            //console.log(aHelpRequests[i].address);

            requestAddress = aHelpRequests[i].address;

            addressToGeoloc(requestAddress, centerMap);



        };


    }

});

/***********************FUNCTIONS*************************************
          
         
         /***********************HIDE/SHOW FUNCTIONS*************************************/



function showMyRequests() {
    $("#wdw-my-requests").show();
    $("#wdw-help-requests").hide();
    $("#wdw-near-me").hide();

}

function showHome() {

    $("#wdw-help-requests").show();
    $("#wdw-my-requests").hide();
    $("#wdw-near-me").hide();

}

function showNearMe() {

    $("#wdw-near-me").show();
    $("#wdw-my-requests").hide();
    $("#wdw-help-requests").hide();

}


function hideWindowsAndShowOneWindow(sWindowId) {
    $(".wdw").hide();
    $("#" + sWindowId).show();
}


function hideWindowsAndShowOneWindow(sWindowId) {
    $(".wdw").hide();
    $("#" + sWindowId).show();
}

/***********************NOTIFICATIONS*************************************/

function notificationSound() {

    // console.log ("x");
    //$.playSound('http://www.noiseaddicts.com/samples_1w72b820/3724');
    document.getElementById('notify-sound').play();


}

function nearMeNotif(quantity) {
    //console.log("NEAR ME:",quantity);
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }


    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        if (quantity == 1) {
            var notification = new Notification('There is ' + quantity + ' help request near you. Check "Near me page" for more info.');
            notificationSound();
        }
        if (quantity > 1) {
            var notifications = new Notification('There are ' + quantity + ' help requests near you. Check "Near me page" for more info.');
            notificationSound();
        }

    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                if (quantity == 1) {
                    var notification = new Notification('There is ' + quantity + ' help request near you. Check "Near me page" for more info.');
                    notificationSound();
                }
                if (quantity > 1) {
                    var notifications = new Notification('There are ' + quantity + ' help requests near you. Check "Near me page" for more info.');
                    notificationSound();
                }

            }
        });
    }

}
/*********************LOG IN***************************************/

$("#btnLogin").click(function() {

    //console.log ( "A");

    var sLoginUserName = $("#txtUserName").val();
    var sLoginUserPass = $("#txtUserPassword").val();
    var sApiLogin = "api-login.php?username=" + sLoginUserName + "&pass=" + sLoginUserPass;
    console.log(sApiLogin);

    $.getJSON(sApiLogin, function(jData) {

        //console.log ( jData);
        if (jData.status == "ok") {
            getUserData();
            $(".wdw").hide();
            $("#wdw-logout").text("Welcome " + jData.user);
            //console.log("ss");
            $("html").attr("id", jData.user_id);
            initMap();
            // google.maps.event.trigger(map, 'resize');
            $("#wdw-welcome").show();

            console.log("OKAY!");
            //  console.log (nearMeCounter);


            // nearMeNotif (nearMeCounter);
            //$("#wdw-logout").text(jData.user);      
        } else {

            $(".wdw").hide();
            $("#wdw-login").show();
            $("#lblLoginError").show();
            console.log("ERROR!");
        }
    });
});

/********************CHECK IF LOGGED IN****************************************/


var sApiIsLoggedIn = "api-is-logged-in.php";
$.getJSON(sApiIsLoggedIn, function(jData) {
    if (jData.status == "ok") {
        $(".wdw").hide();
        $("#wdw-welcome").show();
    } else {
        $(".wdw").hide();
        $("#wdw-login").show();
    }
});


/***************LOG OUT*********************************************/
$("#btnLogout").click(function() {

    localStorage.clear();
    var sApiLogout = "api-logout.php";
    $.get(sApiLogout, function() {
        $(".wdw").hide();
        $("#wdw-login").show();
    });
});


/*************LOGIN FORM ANIMATION***********************************************/

$('.message a').click(function() {
    $('form').animate({
        height: "toggle",
        opacity: "toggle"
    }, "slow");
});

/************************************************************/