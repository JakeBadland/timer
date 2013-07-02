var timer = {
    prefix : '[timer.js] message: ',
    errors : 0,
    start : function(config)
    {
        $.getScript('js/jquery.timers.js', function(){
            if (config['upperColor'] && config['bottomColor'])
                timer.setGradient($('.digit.static'),config['upperColor'],config['bottomColor']);

            if (config['fontColor'])
                $('.digit').css('color', timer.ColorToHex(config['fontColor']));

            if (config['fontSize'])
                //$('.countdownHolder').css('font-size', config['fontSize']+'/1.5');
                var font = config['fontSize']+"px/1.5  'Open Sans Condensed',sans-serif";
                console.log(font);
                $('.countdownHolder').css('font', font);

            if (typeof config['from'] == 'undefined')
            {
                console.log(timer.prefix +'Field "from" required! Exiting...');
                timer.errors += 1;
                return;
            }
            else
            {
                if (navigator.appName != 'Microsoft Internet Explorer')
                {
                    config['from'] = timer.convertDate(config['from']);
                }
            }

            if (typeof config['to'] == 'undefined')
            {
                console.log(timer.prefix +'Field "to" required! Exiting...');
                timer.errors += 1;
                return;
            }
            else
            {
                if (navigator.appName != 'Microsoft Internet Explorer')
                {
                    config['to'] = timer.convertDate(config['to']);
                }
            }

            if (timer.errors == 0)
            {
                console.log(config['to'] + ' ' +config['from']);
                if (config['type'] == 'dynamic')
                {
                    var to_static = new Date(config['to']);
                    //var to_static = new Date("2013,01,01, 12:00:00");
                    var from_static = new Date(config['from']);
                    //var from_static = new Date("2012,01,01, 12:00:00");
                }
                if (config['type'] == 'static')
                {
                    var to = new Date(config['to']);
                    //var to = new Date("2013/01/01T12:00:00");
                    var from = new Date(config['from']);
                    //var from = new Date("2013,04,01, 12:00:00");
                }

                $("body").everyTime(1000, function(i) {
                    var now = new Date();
                    var data;
                    if (config['type'] == 'static')
                    {
                        from_static.setSeconds(to_static.getSeconds() - i);
                        to_static.setSeconds(to_static.getSeconds() + i);
                        data = timer.getTime(from_static,to_static);
                    }

                    if (config['type'] == 'dynamic')
                    {
                        data = timer.getTime(now,to);
                    }

                    timer.updateDuo(0, 1, data['days']);
                    timer.updateDuo(2, 3, data['hours']);
                    timer.updateDuo(4, 5, data['minutes']);
                    timer.updateDuo(6, 7, data['seconds']);

                    //$('#dinamic-up').html(getTime(now,to));
                    //$('#static-down').html(getTime(from,to_static));
                    //$('#static-up').html(getTime(to,from_static));
                    //var $container = $("#countdown").find('.position');
                });
            }
        });
    },
    ColorToHex : function(color){
        return "#"+$.map(color.match(/\b(\d+)\b/g),function(digit){
            return ('0' + parseInt(digit).toString(16)).slice(-2)
        }).join('');
    },
    getTime : function (dateFrom, DateTo){
        var result = [];
        now = dateFrom;
        y2k = DateTo;
        days = (y2k - now) / 1000 / 60 / 60 / 24;
        daysRound = Math.floor(days);
        hours = (y2k - now) / 1000 / 60 / 60 - (24 * daysRound);
        hoursRound = Math.floor(hours);
        minutes = (y2k - now) / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
        minutesRound = Math.floor(minutes);
        seconds = (y2k - now) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        secondsRound = Math.round(seconds);
        if (daysRound<0) daysRound*=-1;

        result['days']=daysRound;
        result['hours']=hoursRound;
        result['minutes']=minutesRound;
        result['seconds']=secondsRound;

        return result;
    },
    switchDigit : function (position,number){
        var digit = position.find('.digit')

        if(digit.is(':animated')){
            return false;
        }

        if(position.data('digit') == number){
            // Мы уже вывели данную цифру
            return false;
        }

        position.data('digit', number);
        var replacement = $('<span>',{
            'class':'digit',
            css:{
                top:'-2.1em',
                opacity:0
            },
            html:number
        });
        digit
            .before(replacement)
            .removeClass('static')
            .animate({top:'2.5em',opacity:0},'fast',function(){
                digit.remove();
            })

        replacement
            .delay(100)
            .animate({top:0,opacity:1},'fast',function(){
                replacement.addClass('static');
            });
    },
    updateDuo: function (minor,major,value){
        var positions = $("#countdown").find('.position');
        timer.switchDigit(positions.eq(minor),Math.floor(value/10)%10);
        timer.switchDigit(positions.eq(major),value%10);
    },
    setGradient: function (selector,from,to){
        //background-image: -webkit-linear-gradient(bottom, #3A3A3A 50%, #444444 50%);
        selector.css({background: "-moz-linear-gradient(center bottom , "+timer.ColorToHex(from)+" 50%, "+timer.ColorToHex(to)+" 50%)"});
        selector.css({background: "-ms-linear-gradient(bottom, rgb("+from+") 50%, rgb("+to+") 50%)"});
        selector.css({background: "-webkit-gradient(linear,left bottom,left top,color-stop(0.5, "+timer.ColorToHex(from)+"),color-stop(0.5, "+timer.ColorToHex(to)+"))"});
        selector.css({background: "-webkit-linear-gradient(bottom, "+timer.ColorToHex(from)+" 50%, "+timer.ColorToHex(to)+" 50%)"});
    },
    convertDate: function (date)
    {
        date = date.replace('T', ' ');
        date = date.replace('/', ',');
        date = date.replace('/', ',');
        return date;
    }

}