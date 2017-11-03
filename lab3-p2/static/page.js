/*global $*/
/* global fetch */
/* global Headers */

//function to make async call get the last 20 messages for a specified course number. 
//if the last 20 messages are the same as the 20 currently in the DOM, nothing changes
//otherwise the DOM is updated to show the new messages and not the old ones
function getLatest20(courseNum){
    
    //make async GET /api/entries?code={{courseNum}}
    //c9 requires session cookie as auth so we use the creds to make sure itc gets it
    fetch('/api/entries?code='+courseNum, {credentials:'same-origin'})
    .then((resp) => resp.json())//turn the result into JSON so we can use it
    .then(function(data){
        //build the response JSON object into some html messages
        let x = '';
        for(var i = 0; i < data.length; i++){
            if(data[i].text){
                x = x + '<div class="panel panel-primary"><div class="panel-heading">' + data[i].text + '</div></div>';
            }
            else{
                x = x + '<div class="panel panel-primary"><div class="panel-heading">No message available</div></div>';
            }
        }
        //check if the new messages are the same as the ones currently displayed and if not then update the DOM
        if(x != $("#messageboard"+courseNum).html()){
            $("#messageboard"+courseNum).html(x);
        }
    })
    .catch(function(err){
        //err handler
        console.log(err);
    });
}


//function to POST a message to the server 
//gets invoked when the user hits the send button
function sendmessage(courseCode){
    var msg = $("#user_message"+courseCode).val();//grab the message from the DOM
    if(msg == ''){
        return;//emtpy messages not allowed
    }
    
    //exchange dangerous '<' and '>' with the HTML symbols for them so that they wont be rendered as HTML
    msg = msg.replace(/</g, '&lt;');
    msg = msg.replace(/>/g, '&gt;');
    
    //build a message object that the server is looking for
    var msgBody = {
        code: courseCode,
        text: msg
    };
    msgBody = JSON.stringify(msgBody);//convert message to JSON
    var myheaders = new Headers();//create request headers
    myheaders.append("content-type", "application/json");//explicitly make the content type JSON
    
    //make the request to the server to POST /api/entries/
    fetch("/api/entries", {method: "POST", accept:"*/*", headers: myheaders, body: msgBody, credentials:"same-origin"})
    .then((resp)=>resp.json())//convert the response to JSON
    .then(function(data){
        //doesnt really matter what we do here, the response from the server is useless
    })
    .catch(function(err) {
        //err handler
        console.log(err);
    });
}

$(document).ready(function(event){
        //call the functions to populate the messages when the page loads
        getLatest20(1);
        getLatest20(2);
        
        //set the function to run on a fixed interval (1000ms) to look for new messages
        window.setInterval(getLatest20, 1000, 1);
        window.setInterval(getLatest20, 1000, 2);
});


//if either of the send buttons are clicked then invoke the sendmessage function with appropriate parameters
$("#mbsend1").click(function(event){
    sendmessage(1);
    $("#user_message1").val("");//clear the message textbox
});

$("#mbsend2").click(function(event){
    sendmessage(2);
    $("#user_message2").val("");//clear the message textbox
});

