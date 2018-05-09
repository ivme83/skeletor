const btnSeq        = $("#btnSeq");
const dwnldBtn      = $("#dwnldBtn");

dwnldBtn.click(e => {
    e.preventDefault();  //stop the browser from following

    window.location.href = '/get-file';
});

btnSeq.click(e => {

    let configArr = [];

    if ($('#check1').is(":checked"))
    {
        configArr.push(true);
    } else {
        configArr.push(false);
    }

    if ($('#check2').is(":checked"))
    {
        configArr.push(true);
    } else {
        configArr.push(false);
    }

    if ($('#check3').is(":checked"))
    {
        configArr.push(true);
    } else {
        configArr.push(false);
    }

    if ($('#check4').is(":checked"))
    {
        configArr.push(true);
    } else {
        configArr.push(false);
    }

    let arr = {
        configArr:configArr
    };


    $.ajax("/api/runCmd", {
    type: "POST",
    data: arr
    }).then(
    function(data) {
        console.log("Success");
        console.log("RETURNED DATA " + data);
        window.location = data.redirect;
    }
    );

});