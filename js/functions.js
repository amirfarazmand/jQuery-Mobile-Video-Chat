 var contactSelectedCheck = true;
 
 function addContactPars() {
        if (confirm("Do you want to save "+document.getElementById("addContact").value+"?") == true) {
                      var query = new Parse.Query("allContacts");
                        query.equalTo("objectId", userObjectId);
                        query.first({
                            success: function (Contact) {
                                Contact.save(null, {
                                    success: function (contact) {
                                        contact.set("con"+(jsConNum+1), document.getElementById("addContact").value);
                                        contact.set("conNum", (jsConNum+1));
                                        contact.save();
                                        alert("Contact Added!");
                                        listContacts(document.getElementById("addContact").value);
                                        location.reload();
                                    }
                                });

                            }
                        });

        } else {
               }

 }
 function updateParseCallerId(valueFromPeer) {
              var query = new Parse.Query("callReadyId");
              query.equalTo("createdBy", Parse.User.current());
              query.find({
                success: function(results) {
                  if (results == ""){
                    // Create Object if null
                  GameScore = Parse.Object.extend("callReadyId");
                  var gameScore = new GameScore();
                  gameScore.set("userid", currentUser.getUsername("username"));
                  gameScore.set("callid", valueFromPeer);
                    var postACL = new Parse.ACL(Parse.User.current());
                    postACL.setPublicReadAccess(true);
                  gameScore.setACL(postACL);
                  gameScore.set("createdBy", Parse.User.current());
                  gameScore.save(null, {
                  success: function(gameScore) {
                       //alert('New object created with objectId: ' + gameScore.id);
                    },
                    error: function(gameScore, error) {
                      // alert('Failed to create new object, with error code: ' + error.message);
                    }
                  });  
                  // Update id
                  }
                  var object = results[0];
                   callReadyIdObjectId = object.id;
                        var query = new Parse.Query("callReadyId");
                        query.equalTo("objectId", callReadyIdObjectId);
                        query.first({
                            success: function (Contact) {
                                Contact.save(null, {
                                    success: function (contact) {
                                        contact.set("callid", valueFromPeer);
                                        contact.save();
                                    }
                                });

                            }
                        });
                },
                error: function(error) {
                  }
              });
 }

  function listContacts(xx) {
        //Creat View
        var x ='<ul data-role="listview" data-filter="true" data-input="#myFilter" data-inset="true")"><li id='+xx+'><a href="#chatWindow">'+xx+'</a></li></ul>';
        $("#contactList").append(x).enhanceWithin();
          //bind click
        document.getElementById(xx).addEventListener('click', function() {
            //document.getElementById("callBut").innerHTML="Click on me to call "+this.id;
           $('#my-id').text(this.id);
           recentTemp = this.id;
           contactSelectedCheck=false;
             callName = this.id;
         });
            //bind Double Click
        document.getElementById(xx).addEventListener('dblclick', function() {
          var deleteTemp =this.id;
                    if (confirm("Do you want to delete "+this.id+"?") == true) {
                      this.remove();
                      var query = new Parse.Query("allContacts");
                        query.equalTo("objectId", userObjectId);
                        query.first({
                            success: function (Contact) {
                                Contact.save(null, {
                                    success: function (contact) {
                                        contact.set("con"+( contactNum[deleteTemp]), "");
                                        contact.save();
                                        alert("Contact deleted!");
                                       // location.reload();
                                    }
                                });

                            }
                        });

        } else {
               }
         });
  }

   //<!-- CHat functions-->
    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    var peer = new Peer({ key: 'uuseqefts8vbzkt9', debug: 3});

    peer.on('open', function(){
      //$('#my-id').text(peer.id);
      updateParseCallerId(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      $(document).ready(function() {
        audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'answer.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        //audioElement.load()
        $.get();
            audioElement.play();
       });

            //$("#chatWindow").popup("open");
            call.answer(window.localStream);
            step3(call);
            audioElement.pause();
  
    });
    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });

    // Click handlers setup
    $(function(){
      $('#make-call').click(function(){
        // Initiate a call!
        //var call = peer.call($('#callto-id').val(), window.localStream);
                   // Query friend id
         if (contactSelectedCheck) { alert("Please first click on a contact!"); return false;}
             var GameScore1 = Parse.Object.extend("callReadyId");
             var query = new Parse.Query(GameScore1);
              query.equalTo("userid", callName);
              query.find({
                success: function(results) {
                   var object = results[0];
                   friendCallId = object.get("callid");
                  //alert("Successfully retrieved " + friendCallId);
                  var call = peer.call(friendCallId, window.localStream);
                  step3(call);
                  updateRecent(recentTemp);
                },
               error: function(error) {
                  alert("Error: " + error.code + " " + error.message);
               }
             });
      });

      $('#end-call').click(function(){
        window.existingCall.close();
        step2();
      });

      // Retry if getUserMedia fails
      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });

      // Get things started
      step1();
    });

    function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }

  var currentNumber = ""
  function showAlert(x) {
    document.getElementById("callNumber").innerHTML = currentNumber+x;
    currentNumber=currentNumber+x
  }
  function deleteNumber() {
   currentNumber=currentNumber.slice(0,-1);
    document.getElementById("callNumber").innerHTML = currentNumber;
  }

  Parse.$ = jQuery;
  Parse.initialize("F4gq6E66pzlx5RZ0dLY8JRHVP1X1PWE3oa101bsx",  //"applicationId":
                   "3ut2wlqBhGVQxbZz2vI0Sg7e19PBsfbsa0F7bikx");  //JavaScript Key

  function SignFunc() {
     //Parse.User.logOut();
     currentUser = Parse.User.current();

      if (currentUser) {
        //alert(currentUser.getUsername("username"));
       document.getElementById("signInUp").style.display = "none";
       document.getElementById("signInUpBut").innerHTML="Logged in as "+ currentUser.getUsername("username");

              var query = new Parse.Query("allContacts");
              query.find({
                success: function(results) {
                   if (results == ""){
                    // Create Object if null
                   var GameScore2 = Parse.Object.extend("allContacts");
                   var gameScore = new GameScore2();
                    gameScore.set("conNum", 0);
                    var postACL = new Parse.ACL(Parse.User.current());
                      //postACL.setPublicReadAccess(true);
                    gameScore.setACL(postACL);
                    //gameScore.set("createdBy", Parse.User.current());
                      gameScore.save(null, {
                       success: function(gameScore) {
                          alert("Press contact and add a few to call!");
                        },
                        error: function(gameScore, error) {
                        // alert('Failed to create new object, with error code: ' + error.message);
                        }
                      });  
                    }

                    // Get Object otherwise
                    contactNum={};
                  var object = results[0];
                   jsConNum = object.get("conNum"); if (jsConNum==null){jsConNum=0;}
                   userObjectId = object.id;
                    //alert(userObjectId);
                  for (var i = 1; i < object.get("conNum")+1; i++) {
                    var tempCon = object.get('con'+i);
                     if (tempCon !==""){ 
                       listContacts(tempCon);
                       contactNum[tempCon]=i;
                      }
                  }
                },
                error: function(error) {
                  // error is an instance of Parse.Error.
                  }
              });

       } else {
        document.getElementById("signInUp").style.display = "block";
         //alert("Not logged in. Press Button on top right hand.");
        }
  }
  function signInUpButFunction(){
    if (currentUser) {
      if (confirm("Do you want to log out?") == true) {
          Parse.User.logOut();
          document.getElementById("signInUpBut").innerHTML="Login";
         SignFunc();
      } else {
                                                      }
    }
  }
  function signToPars(){
     Parse.User.logIn(document.getElementById("userId").value, document.getElementById("password").value, {
              success: function(user) {
                currentUser = Parse.User.current();
                 //alert("logged as" + currentUser.getUsername("username"))
                document.getElementById("signInUp").style.display = "none";
                document.getElementById("signInUpBut").innerHTML="Logged in as "+ currentUser.getUsername("username");
                location.reload();
                                      },
              error: function(user, error) {
                  alert("Wrong username or password");
                        if (confirm("Do you want to sign up? We use same details you just enetered. Please press 'Cancel' and enter new userId and password again if you want to change them.") == true) {
                          var user = new Parse.User();
                           user.set("username", document.getElementById("userId").value);
                           user.set("password", document.getElementById("password").value);
                           user.signUp(null, {
                            success: function(user) {
                             alert("You are registered.");
                             location.reload();
                            },
                            error: function(user, error) {
                              alert("Error: " + error.code + " " + error.message);
                            }
                           });
                         } else {  }
              }
     });
  }

   SignFunc();
   function updateRecent(x) {
         for(var i=5;i>1;i--){
            var temp1 = localStorage.getItem(i-1);
           localStorage.setItem(i, temp1);
         }
      localStorage.setItem(1, x);
       var x ='<ul  data-role="listview" data-input="#myFilter" data-inset="true"><li id='+x+'><a href="#">'+x+'</a></li></ul>';
     $("#recentList").append(x).enhanceWithin();
   }
   function populateRecent() {
    for(var i=1;i<6;i++){
           var temp2 = localStorage.getItem(i);
          if (temp2===null){}else{
            var x ='<ul  data-role="listview" data-input="#myFilter" data-inset="true"><li id='+temp2+'><a href="#">'+temp2+'</a></li></ul>';
              $("#recentList").append(x).enhanceWithin();
                        //bind click
             document.getElementById(temp2).addEventListener('click', function() {
              $('#my-id').text(this.id);
               contactSelectedCheck=false;
                callName = this.id;
              });
          }
    }
   }
   populateRecent();
