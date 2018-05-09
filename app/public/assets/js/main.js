
$('#login-btn').on('click', function(){
    $('.collapsible').collapsible('open', 1);
});

$('#signin-btn').on('click', function(){
    $('.collapsible').collapsible('open', 2);
});


var card = 'start';

$('.next-btn').on('click', function(){
    if (card == 'start'){

        var startPoint = $("input:radio[name ='group1']:checked").val();

        switch (startPoint) {
            case 'seq-init':
                nextQ('init');

                card = 'init';
                break;
            case 'customize':

                break;
            default:
                // alert("Select an option before moving on");
                break;
        }
    }
    else if (card == 'init'){
        $('.card-panel').removeClass('showing');
        $('#css-card').addClass('showing');

        card = 'css';
    }
    else if (card == 'css'){
        $('.card-panel').removeClass('showing');
        $('#start-card').addClass('showing');

        card = 'start';
    }
        
});

function nextQ(x) {
    var foo = "#" + x + "-card";


    $('.card-panel').addClass('hide');
    $('#init-card').removeClass('hide');
}

