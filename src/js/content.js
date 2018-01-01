import $ from 'jquery';
import handlers from './modules/handlers';
import msg from './modules/msg';

console.log('Automatic Content filtering...'); // eslint-disable-line no-console
console.log('jQuery version:', $().jquery); // eslint-disable-line no-console

var message = msg.init('ct', handlers.create('ct'));

function realReplace(sel, idx, html) {
    $(sel).each(function (index) {
        if (idx === index) {
            // Debug
            //$(this).css({ outline: '0px dashed red' });



            if ($(this).attr('data-replaced')){
                $(this).attr('data-replaced', $(this).attr('data-replaced')+1);
            } else {
                $(this).attr('data-replaced', 1);
            }
            
            //$(this).css({ outline: '3px dashed green' });
            $(this).fadeOut("quick", function(){
                $(this).html(html).fadeIn("quick");
            });

        }
    });
}


function replaceElement(element, selector) {

    // Unbind all events from the node and its children
    element.unbind();
    element.find('*').unbind();



    element.each(function (index) {

        var h = $(this).height();
        var w = $(this).width();

        if (!$(this).attr('data-replaced') || $(this).attr('data-replaced') <= 0) {
            message.bg('doReplace', selector, index, w, h, function (html) {
                realReplace(selector, index, html);
            });
        }

    });

}

function periodicCheck(selectors) {
    console.info("Checking selectors..."); // eslint-disable-line no-console

    var elements = selectors.split(',');

    for (var index = 0; index < elements.length; ++index) {
        if (elements[index] && elements[index].length > 0 && $(elements[index])) {
            replaceElement($(elements[index]), elements[index]);
        }
    }

    setTimeout(function () {
        periodicCheck(selectors);
    }, 5000);

}

$(document).ready(function(){

    setTimeout(function () {
        message.bg('doFilter', window.location.host, function (selectors) {
            //$(selectors).css({ outline: '3px dashed orange' });
            periodicCheck(selectors);
        });
    }, 500);

});
