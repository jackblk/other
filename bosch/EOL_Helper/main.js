//Global vars
var mapObj = {
    "REQ_StartSession_ExtendedSession": "Extended Session",
    "REQ_SecurityAccess_RequestSeed_Level1": "Security Level 1",
    "REQ_ReadDatabyID_CustPrtNbr": "Read Cust Part Num",
    "REQ_WriteDatabyID_VIN": "Write VIN",
    "REQ_ReadDatabyID_CustSWVer": "Read Cust Software Ver",
    "REQ_ReadDatabyID_CustHWVer": "Read Cust Hardware Ver",
    "REQ_ReadDatabyID_ManuFactoryMode": "Read ManuFactory Mode",
    "REQ_ReadDatabyID_ECUCalibrationSWID": "Read ECU Calib SWID",
    "REQ_WriteDatabyID_DateVehProd": "Write Date Veh Prod (Installation)",
    "REQ_WriteDatabyID_WriteEOLConfiguration": "Write EOL (ECU) Config",
    "REQ_WriteDatabyID_WriteMTOC": "Write MTOC",
    "REQ_ECUReset_SoftReset": "Soft reset",
    "REQ_ReadDatabyID_ECUConfig": "Read ECU Config",
    "REQ_ReadDTC_reportDTCByStatusMask": "Read DTC by StatusMask",
    "REQ_RoutineControl_StartRoutine": "Start Routine",
    "REQ_RoutineControl_RequestRoutine": "Request Routine",
    "REQ_RoutineControl_StopRoutine": "Stop Routine",
    "REQ_WriteDatabyID_CustWriteIMUCalibrationState": "Write IMU Calib State",
    "REQ_WriteDatabyID_CustWriteECUCustomerMode": "Write ECU Cust Mode",
    "REQ_ClearDTC_ClearDTCAll": "Clear all DTC",
    "REQ_ReadDatabyID_CustWriteECUCustomerMode": "Read ECU Cust Mode",
    "REQ_ReadDatabyID_SystemName": "Read System Name",
    "REQ_ReadDatabyID_ProgramDate": "Read Program Date",
    "WaitTime_1000": "Wait 1s",
    "WaitTime_2000": "Wait 2s",
    "WaitTime_4000": "Wait 4s",
    "WaitTime_5000": "Wait 5s",
    "WaitTime_6000": "Wait 6s",
    "WaitTime_8000": "Wait 8s",
    "WaitTime_12000": "Wait 12s",
    "LC_ECU_Off": "Power OFF",
    "LC_ECU_On": "Power ON",
};

// Init
document.getElementById("inputForm").innerHTML = document.getElementById("defaultValue").innerHTML;
var sortable1 = Sortable.create(supportedSteps, {
    group: {
        name: 'shared',
        pull: 'clone',
        put: 'false',
    },
    sort: false,
});
var sortable2 = Sortable.create(finalSteps, {
    group: {
        name: 'shared',
    },
    onChange: function () {
        autoNumbering()
    },
    sort: true,
});
var sortable3 = Sortable.create(stepNumber, {
    sort: false,
});

$(window).load(function () {
    generateList();
});


// ================================Functions================================

function addSortableOutsideDrop(sortableInstance, callback) {
    var enableDragover = function (evt) {
        evt.preventDefault();
    };
    document.documentElement.addEventListener("dragover", enableDragover);

    var setToInsideDrop = function () {
        sortableInstance._isOutsideDrop = false;
    };
    // Set to inside drop if dropping inside the sortable element
    sortableInstance.el.addEventListener("drop", setToInsideDrop);
    // Set to inside drop if moving items across sortable lists
    Sortable.utils.on(sortableInstance.el, "add", setToInsideDrop);
    Sortable.utils.on(sortableInstance.el, "remove", setToInsideDrop);

    // On start, initialize to be outside drop
    Sortable.utils.on(sortableInstance.el, "start", function (evt) {
        sortableInstance._isOutsideDrop = true;
    });
    // Check if is still outside drop, and if it is, do callback
    Sortable.utils.on(sortableInstance.el, "end", function (evt) {
        if (sortableInstance._isOutsideDrop || typeof (sortableInstance._isOutsideDrop) == 'undefined')
            callback(evt);
    });
}


addSortableOutsideDrop(sortable2, function (evt) {
    var el = evt.item;
    el.parentNode.removeChild(el);
    // Update numbering
    autoNumbering();
});

function addItem(num, text) {
    $("#supportedSteps").append('<div id="' + num + '" class="list-group-item tinted">' + num + " => " + "<b>" + text + "</b>" + '</div>');
}

function autoNumbering() {
    $('#stepNumber').empty();
    $('#stepNumber').text('Step no.');
    var numbFinalSteps = document.getElementById("finalSteps").childElementCount;
    for (var i = 1; i < numbFinalSteps + 1; i++) {
        $("#stepNumber").append('<div id="' + i + '" class="list-group-item tinted">' + "<b>" + i + "</b>" + '</div>');
    }

}

function generateList() {
    $('#supportedSteps').empty();
    $('#supportedSteps').text('Predefined steps');
    var inputText = document.getElementById("inputForm").value;
    var parsedInput_Array = inputText.match(/'(\d+)' => '([^']+)'/gi);

    for (var i = 0; i < parsedInput_Array.length; i++) {
        var parsedStep_Array = parsedInput_Array[i].match(/'(\d+)' => '([^']+)'/);
        parsedStep_Array[2] = replaceAll(parsedStep_Array[2], mapObj);
        addItem(parsedStep_Array[1], parsedStep_Array[2]);
    }
}

function clearList() {
    $('#finalSteps').empty();
    $('#finalSteps').text('EOL steps');
    autoNumbering();
}

// Replace function
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, mapObj) {
    for (var key in mapObj) {
        str = str.replaceAll(key, mapObj[key]);
    }
    return str;
}


function exportMapping() {
    var result = "";
    $('#finalSteps > div').map(function () {
        result = result + "'" + this.id + "',";
    });
    result = "[" + result.substring(0, result.length - 1) + "]";
    prompt("Mapping for EOL procedure:", result);
}