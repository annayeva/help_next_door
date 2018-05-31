<?php
   session_start();
   
   ?>
<!DOCTYPE html>
<html id="<?php 
   if (isset($_SESSION['user_id'])) {
    echo $_SESSION['user_id'];
   }
   ?>">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <meta http-equiv="content-type" content="text/html; charset=UTF-8">
      <title>Help Next Door</title>

       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
      <link rel="stylesheet" href="css/style.css">

      <script
         src="https://code.jquery.com/jquery-3.1.1.js"
         integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA="
         crossorigin="anonymous"></script>
      <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
      <!-- Optional theme -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
      <!-- Latest compiled and minified JavaScript -->
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
   </head>
   <body>
  
<audio id="notify-sound" src="sounds/notification.mp3" preload="auto"></audio>
   
      <!-- WELCOME -->
      <div id="wdw-welcome" class="wdw">
         <!-- navbar -->
         <div class="navbar navbar-custom navbar-fixed-top">
            <div class="navbar-header">
               <!-- LOGOUT -->
               <p class="navbar-brand" id="wdw-logout">
                  Welcome
                  <?php 
                     if (isset($_SESSION['user_email'])) {
                      echo $_SESSION['user_email'];
                     }
                     ?> 
                  ! 
               </p>
               <button class=" all-buttons btn btn-default navbar-btn" id="btnLogout">Log out</button>
               <!-- END LOGOUT -->
               <a class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
               </a>
            </div>
            <div class="navbar-collapse collapse">
               <ul class="nav navbar-nav">
                  <li class="active" id="btn-home"><a href="#">Home</a></li>
                  <li><a id="btn-my-requests" href="#">My requests</a></li>
                  <li><a id="btn-near-me" href="#">Near me</a></li>
                  <li>&nbsp;</li>
               </ul>
               <form class="navbar-form">
                  <div class="form-group" style="display:inline;">
                     <input id="input-address-search" type="text" class="form-control" placeholder="Search by ZIP code">
                     <button type="button" id="btn-search-zip" class="all-buttons btn btn-default"> Search</button>
                  </div>
               </form>
            </div>
         </div>
         <div id="map-canvas"></div>
         <div class="container-fluid" id="main">
            <!-- beginning help requests -->
            <div class="row">
               <div class="col-xs-8" id="left">
                  <h2></h2>
                  <!-- all help requests -->
                  <div id="wdw-help-requests">
                     <div class="row">
                     </div>
                  </div>
                   <!-- my requests -->
                     <div id="wdw-my-requests">
                       <div class="row">
                       </div>
                    </div>
                     <!-- help requests near me -->
                  <div id="wdw-near-me">
                     <div class="row">
                     </div>
                  </div>
               </div>
               <!-- end help requests -->
               <div class="col-xs-4">
                  <!--map-canvas will be postioned here-->
               </div>
            </div>
         </div>
         <!-- END WELCOME  -->
      </div>
      <!-- LOGIN -->
      <div id="wdw-login" class="wdw">
         <div class="login-page">
            <div class="form">
               <form class="register-form">
                  <input id="txtNewName" type="text" placeholder="name"/>
                  <input id="txtNewLastName" type="text" placeholder="last name"/>
                  <input id="txtNewAddress" type="text" placeholder="address"/>
                  <input id="txtNewEmail" type="text" placeholder="email"/>
                  <input id="txtNewPassword" type="password" placeholder="password"/>
                  <button>create</button>
                  <p class="message">Already registered? <a href="#">Sign In</a></p>
               </form>
               <form class="login-form">
                  <input id="txtUserName" type="text" placeholder="e-mail"/>
                  <input id="txtUserPassword" type="password" placeholder="password"/>
                  <div id="lblLoginError">Error logging in, please try again.</div>
                  <button id="btnLogin">login</button>
                  <p class="message">Not registered? <a href="#">Create an account</a></p>
               </form>
            </div>
         </div>
      </div>
      <!-- END LOGIN -->
   
   
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANqp5FvSLbrumLyBpohjcl1RHOUQwLyzE"
         ></script>
      <script>

          /*********************LOG IN***************************************/
          
          $("#btnLogin").click(function(){
          
           //console.log ( "A");
          
           var sLoginUserName = $("#txtUserName").val();
           var sLoginUserPass = $("#txtUserPassword").val();
           var sApiLogin = "api-login.php?username="+sLoginUserName+"&pass="+sLoginUserPass;
           console.log ( sApiLogin);
           
           $.getJSON(sApiLogin, function(jData){
         
             //console.log ( jData);
             if( jData.status == "ok" ){
                getUserData();
               $(".wdw").hide();
               $("#wdw-logout").text("Welcome " + jData.user);
               //console.log("ss");
               $("html").attr("id",jData.user_id);
               initMap();
               // google.maps.event.trigger(map, 'resize');
               $("#wdw-welcome").show();
               //console.log ( "OKAY!");
     
             }
          
             else {
          
               $(".wdw").hide();
               $("#wdw-login").show();
               $("#lblLoginError").show();
               console.log ( "ERROR!");  
             }
           });
          });

      </script>
      <!-- script references -->
      <script type = "text/javascript" language = "javascript" src="scripts/script.js"></script>
   </body>
</html>

