/**
 * Created by Jérémy Pouillot on 04/02/2016.
 */

/* Script created to calculate best way to reach destination
 * Take 2 points : Starting point a[Xa,Ya,Za], endingPoint B[Xb,Yb,Zb]
 * Distance between this 2 points is : sqrt[(Xb - Xa)² + (Yb - Ya)² + (Zb - Za)²]
 * Middle distance is : i[((Xa + Xb)/2), ((Ya + Yb)/2, ((Za + Zb)/2)]
 * Max distance is lets say ... delta
 */

var items = [];

var origin = [],
    target = [],
    a, b,
    bigI = [0, 0, 0],
    delta = 1000; //max distance in ly

var stopThatFukingLoop = 3;

var distanceAb;

var result, results = [], systems = [];

var found = false;

$(document).ready(function(){
    $('button').click(function() {
        a = origin = [parseInt($('#originXCoord').val()), parseInt($('#originYCoord').val()), parseInt($('#originZCoord').val())];
        b = target = [parseInt($('#targetXCoord').val()), parseInt($('#targetYCoord').val()), parseInt($('#targetZCoord').val())];

        distanceAb = Math.sqrt( Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2) + Math.pow((b[2] - a[2]), 2) );

        getSystemsNameAndDoSearch();
    })
});

function search(a, b, bigI) {
    while (found == false) {
        var lastI = bigI;
        // Calculate bigI (middle)
        bigI = [((a[0] + b[0]) / 2), ((a[1] + b[1]) / 2), ((a[2] + b[2]) / 2)];

        if (arrayCompare(lastI, bigI)) {
            // if middle array found is similar to last middle array then decrease count
            stopThatFukingLoop--;

            if (stopThatFukingLoop == 0) {
                // Then extract results
                result = [Math.round(bigI[0]), Math.round(bigI[1]), Math.round(bigI[2])];

                results.push(result);

                if (arrayCompare(target, result)) {
                    displayResults(results, systems);
                    found = true;
                }
                searchSystem(result);

                stopThatFukingLoop = 3;

                origin = result;

                search(result, target, [0, 0, 0]);
            }
        }

        // then solve distance last origin to bigI (start to middle)
        var abigI = Math.sqrt(Math.pow((bigI[0] - origin[0]), 2) + Math.pow((bigI[1] - origin[1]), 2) + Math.pow((bigI[2] - origin[2]), 2));
        // if distance abigI is > delta (max distance)
        if (abigI > delta) {
            // bigI should now be our b point (originA doesn't change)
            b = bigI;

            // recall search function, a point doesn't change, b is same as i, reset i, ab is now ai
            search(a, b, bigI);

        } else if (abigI < delta) {
            a = bigI;

            search(a, b, bigI);

        } else if (abigI == delta) {
            console.log('find !', bigI);
        }
    }
}

function searchSystem(result) {
    // Search for nearest system, if there is one (based on data.json)
    for (var i = 0; i < items.length; i++) {
        if ((items[i].x <= result[0] + 5 && items[i].x >= result[0] - 5)
            && (items[i].y <= result[1] + 5 && items[i].y >= result[1] - 5 )
            && (items[i].z <= result[2] + 5 && items[i].z >= result[2] - 5)) {

            systems.push('<b>' + items[i].name + '</b> system has been found near this point');
            i = 0;
            break;
        }
    }

    if (systems.length !== results.length) {
        systems.push('no system found near this point');
    }
}

function displayResults(results, systems) {
    // displays results
    var htmlResult = [];
    console.log(results,systems);
    for (var i = 0; i < results.length; i++) {

        console.log(i,results[i],systems[i]);
        htmlResult.push('<li>Coordinates found : X = ' + results[i][0] + ', Y = ' + results[i][1] + ', Z = ' + results[i][2] + ' <span>' + systems[i] + '</span></li>');
    }

    $('#result_display ul').html(htmlResult);
}

function arrayCompare(array1, array2) {
    return (array1.length == array2.length) && array1.every(function (element, index) {
        return Math.round(element) === Math.round(array2[index]);
    });
}

function getSystemsNameAndDoSearch() {
    $.getJSON('json/data.json', function (data) {
        $.each(data, function (key, value) {
            items.push({
                name: value.name,
                x: Math.round(value.coords.x),
                y: Math.round(value.coords.y),
                z: Math.round(value.coords.z)
            });
        });
        search(a, b, bigI);
    }).fail(function () {
        alert('It\'s seems that there is a problem to get systems names');
    });
}
