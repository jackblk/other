// ==UserScript==
// @name         DOORS Auto
// @namespace    http://ranhchim.ml/
// @version      0.2
// @description  auto login citrix for you
// @author       Tong & Trung
// @match        https://abt-ism-xd.de.bosch.com/Citrix/ismXenWeb/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// ==/UserScript==

//Constants
const waitAfterLogin = 2000;
const waitRetry = 3000;

// Variables
var $ = window.jQuery;
var loginBtn_elem_id = 'loginBtn';
var username_elem_id = 'username';
var password_elem_id = 'password';
var doorsBtn_elem_id = 'storeapp-details-link'
var timer;

//Config init
GM_config.init({
    'id': 'doorConfig', // The id used for this instance of GM_config
    'title': 'DOORS Auto Settings', // Panel Title
    'fields': // Fields object
    {
        'autoClick': // This is the id of the field
        {
            'label': 'Auto click all buttons?', // Appears next to field
            'section': ['Config option', 'Auto click all buttons will auto click login button after auto filling, and will open DOORS when you are logged in.'],
            'type': 'checkbox', // Makes this setting a text field
            'default': 'true' // Default value if user doesn't change it
        },
        'user': // This is the id of the field
        {
            'label': 'Username', // Appears next to field
            'type': 'text', // Makes this setting a text field
            'default': 'apac\\', // Default value if user doesn't change it
            'section': ['Account', 'Enter your account credentials']
        },
        'password': // This is the id of the field
        {
            'label': 'Password', // Appears next to field
            'type': 'text', // Makes this setting a text field
            'default': '' // Default value if user doesn't change it
        }
    },
    'css': '#doorConfig_field_password {-webkit-text-security: disc;}'
});
var username = GM_config.get('user');
var password = GM_config.get('password');
var auto_click = GM_config.get('autoClick');;
$('body').append('<input type="button" value="Settings" id="CP">')
$("#CP").css("position", "fixed").css("top", 0).css("left", 0).css("background", "goldenrod").css("padding", "10px 30px");
$('#CP').click(function() {
    GM_config.open();
});


// Main function
$(document).ready(function() {
    'use strict';
    if (password == '') {
        GM_config.open();
    } else {
        fill_doors_form();
    }
})


// Functions
function open_doors(retry = true) {
    console.log("Open doors", retry);
    if (document.getElementsByClassName(doorsBtn_elem_id).length != 0) {
        auto_click ? document.getElementsByClassName(doorsBtn_elem_id)[0].click() : console.log("auto click disabled");
        //setTimeout(window.close, 1000);
        console.log("done, stop all timer");
        clearTimeout(timer);
    } else {
        retry ? setTimeout(open_doors, waitRetry) : console.log("retry disabled");
    }
}

function fill_doors_form() {
    console.log("finding username elem");
    if (document.getElementById(username_elem_id)) {
        document.getElementById(username_elem_id).value = username;
        document.getElementById(password_elem_id).value = password;
        timer = setTimeout(open_doors, waitAfterLogin);
        auto_click ? document.getElementById(loginBtn_elem_id).click() : console.log("auto click disabled");
    } else {
        timer = setTimeout(fill_doors_form, waitRetry);
        open_doors(false);
    }

}
