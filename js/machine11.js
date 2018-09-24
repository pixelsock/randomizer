$(document).ready(function() {
    var count = 0;
    var machine1 = $("#machine1").slotMachine({
        active: 1,
        delay: 500,
        spins: 1, // Number of spins when auto [Number]
        stopHidden: false
    });
    function onComplete(active) {
        switch (this.element[0].id) {
            case 'machine1':
                $("#machine1Result").text("Index: " + this.active);
                results[0] = getMachineResult($('#machine1'), this.active);
				
				if($.inArray( getMachineResult($('#machine1'), this.active), result )==-1){
					result.push(getMachineResult($('#machine1'), this.active));
				}else{
					machine1.shuffle(6,onComplete);
					console.log(result);
				}
                break;
        }
        //console.log(result);
        /*$.each(results, function(idx,val) { 
             if(val) { 
                $(".option:contains("+val+")").each(function(){
                    $(this).text($(this).closest(".selection_div").remove());
                });
            }
        });*/
        result_final.push(results);
        $("#results").text(results.join(", "));
        this.$tiles[this.active].classList.add('selected');
        this.$tiles[this.active].classList.add('selected-hd');
    }
    function getMachineResult(i_jqMachine, i_iActive) {
        return i_jqMachine.find('.selection_div > .option').eq(i_iActive + 1).text();
    }
	
    $(".ranomizeButton3").click(function() {
        results = [];
        $("#results").css('color', 'white').text("");
        setTimeout(function() {
            machine1.shuffle(2, onComplete);
        }, 600);
        $(".ranomizeButton3.spin").css('display', 'none');
        var container = $('div.pp3');
        $(".pp3").css('display', 'block');
        var progressBar = $('<div class="animationStripess"/>');
        container.append(progressBar).queue('example', function() {
            progressBar.animate({
                width: '25%'
            }, 1000, function() {
                container.dequeue('example');
                $('.progress-bar.blue.stripes span').css('width', '30%');
                $(".step0").css('display', 'none');
                $(".step1").css('display', 'block');
                var setinterval = setInterval(function() {
                    $(".step1").css('display', 'none');
                    $(".step2").css('display', 'block');
                    $('.ranomizeButton2').click();
                    $('.progress-bar.blue.stripes span').css('width', '70%');
                    $('.selection_div').removeClass('selected');
                    count = parseInt(count + 1);
					 if (count == 2) {
                        $(".step2").css('display', 'none');
                        $(".step3").css('display', 'block');
                        $('.progress-bar.blue.stripes span').css('width', '100%');
                        $('.selection_div.selected.selected-hd').remove();
                    }
                    machine1.shuffle(3, onComplete);
                    if (count == 3) {
                        clearInterval(setinterval);
                        $(".selectedd").click();
                        $(".pp3").css('display', 'block');
                        $(".ranomizeButton3").css('display', 'none');
                    }
                }, 4000);
            });
        });
        if (!progressBar.prevAll(':animated').length) {
            container.dequeue('example');
        }
    });

    $(".selectedd").click(function() {
        $(".step1").css('display', 'none');
        $(".step2").css('display', 'none');
        $(".map").css('display', 'none');
        $(".step3").css('display', 'none');
        $(".step4").css('display', 'block');
        $(".div-block").addClass("main");
        $(".bg").addClass("main");
        $(".map").css('display', 'none');
        $(".clickmap").css('display', 'block');
        $(".start").css('display', 'block');
        $(".last-page").css('display', 'block');
        var j = 1;
        for (var i = 0; i < result.length; i++) {
            $("#result_" + j).html(result[i]);
            j++;
        }
        maprecenter(result);
    });

    $(".clickmap").click(function() {
        $('.clickmap').addClass('mapdisable');
        $("#map").css('display', 'block');
        $(".map-box").css('display', 'block');
        $(".refreshbtn").css('display', 'block');
    });

    $(".refreshbtn").click(function() {
    });
	
	$(".start").click(function() {
        window.location.reload();
    });
});

function maprecenter(resulthd) {
    var col = [];
    var K = 0
    var n = $("#machine1 .selection_div.selected-hd .option").length;
    $('#machine1 .selection_div.selected-hd .option').each(function(index) {
        item = [];
        item.push($(this).data('name'));
        item.push($(this).data('lat'));
        item.push($(this).data('lng'));
        item.push(parseInt(K + 1));
        col.push(item);
    });

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(35.192217, -80.873595),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < col.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(col[i][1], col[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(col[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}