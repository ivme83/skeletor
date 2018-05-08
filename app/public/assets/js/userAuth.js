const btnSeq        = $("#btnSeq");
const dwnldBtn      = $("#dwnldBtn");

dwnldBtn.click(e => {
    e.preventDefault();  //stop the browser from following

    window.location.href = '/get-file';
});

btnSeq.click(e => {
    let cmdStr = "sequelize init";

    if ($('#check1').is(":checked"))
    {
        cmdStr += " init:config";
    }

    if ($('#check2').is(":checked"))
    {
        cmdStr += " init:models";
    }

    if ($('#check3').is(":checked"))
    {
        cmdStr += " init:migrations";
    }

    if ($('#check4').is(":checked"))
    {
        cmdStr += " init:seeders";
    }

    // console.log(cmdStr); 
    let command = {
        cmdStr:cmdStr
    };

    $.ajax("/api/runCmd", {
    type: "POST",
    data: command
    }).then(
    function(data) {
        console.log("Success");
        console.log("RETURNED DATA " + data);
        window.location = data.redirect;
    }
    );

});