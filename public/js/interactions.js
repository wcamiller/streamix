// INTERACTIONS

$('#searchTerm1').on('keyup', function(e) {
	if (e.keyCode === 13) {
		$('#search1').click();
	}
});

$('#searchTerm2').on('keyup', function(e) {
	if (e.keyCode === 13) {
		$('#search2').click();
	}
});

$("#search1").click(function() {
	var data = "searchTerm=" + $("#searchTerm1").val();
	
	if ($("#source1 option:selected").val() == "YouTube") {
		searchYT(data, 1);
	} else {
		searchSC(data, 1);
	}
});

$("#search2").click(function() {
	var data = "searchTerm=" + $("#searchTerm2").val();
	if ($("#source2 option:selected").val() == "YouTube") {
		searchYT(data, 2);
	} else {
		searchSC(data, 2);
	}
});

$("#source1").change(function () {
	changePlayer("#players1", $("#source1 option:selected").index());
});

$("#source2").change(function () {
	changePlayer("#players2", $("#source2 option:selected").index());
});

$(function() {
	$("#crossfade").slider({
		value: 0,
		orientation: "horizontal",
		max: 200,
		range: "min",
		animate: true,
		slide: function(event, ui) {
			ytplayer1.setVolume(Math.max(Math.min(200 - ui.value, 100), 0));
			ytplayer2.setVolume(Math.max(Math.min(ui.value, 100), 0));
			scplayer1.setVolume(Math.max(Math.min(200 - (2 - ui.value / 200), 100), 0));
			scplayer2.setVolume(Math.max(Math.min(ui.value / 200, 100), 0));

		}
	});
});

// $(function() {
// 	$("#playbackRate").slider({
// 		value: 0,
// 		orientation: "horizontal",
// 		min: 0.25,
// 		max: 2,
// 		step: 0.25,
// 		animate: true,
// 		slide: function(event, ui) {
// 			console.log(ui.value);
// 			ytplayer1.setPlaybackRate(ui.value);
// 		}
// 	});
// });


var iframeElement1 = $("#scplayer1").attr("id");
var scplayer1 = SC.Widget(iframeElement1);
scplayer1.load("https://api.soundcloud.com/tracks/35814027&visual=true&single_active=false&show_comments=false");

var iframeElement2 = $("#scplayer2").attr("id");
var scplayer2 = SC.Widget(iframeElement2);
scplayer2.load("https://api.soundcloud.com/tracks/161968259&visual=true&single_active=false&show_comments=false");

scplayer2.bind(SC.Widget.Events.PLAY, function () {
	if ($("#crossfade").slider("option", "value") === 0) {
		scplayer2.setVolume(0);
	}
});

var ytplayer1;
var ytplayer2;
var ytplayers = new Array();
var scplayers = new Array();

scplayers.push(scplayer1);
scplayers.push(scplayer2);

var audio = new Audio();

audio.controls = true;
audio.src = "https://youtu.be/kO1pV9Zp-Yo";

$("#audio").append(audio);

//  FUNCTIONS

function searchYT(data, column) {
	$.get("/search", data, function (response) {
		var response = JSON.parse(response);
		var items = response.items;
		var results = "#results" + column;
		var videoLink = "videoLink" + column;
		var player = ytplayers[column - 1];

		$(results).empty();
		$.each(items, function (index, value) {
			$(results).append("<a class='" + videoLink + "' id='" + items[index].id.videoId + "'>" + items[index].snippet.title + "</a><br>");
		});
		$("." + videoLink).click(function () {
			player.cueVideoById({
				videoId: $(this).attr("id")
			});
		});
	});
}


function searchSC(data, column) {
	$.get("/searchSC", data, function (response) {
		var results = "#results" + column;
		var videoLink = "videoLink" + column;
		var player = scplayers[column - 1];
		$(results).empty();
		$.each(response, function (i, val) {
			$(results).append("<a class='" + videoLink + "' id='" + val.uri + "'>" + val.title + "</a><br>");
			return i < 4;
		});
		$("." + videoLink).click(function () {
			var url = $(this).attr("id") + "&visual=true&single_active=false&show_comments=false";
			player.load(url);
		});
	})
}


function onYouTubeIframeAPIReady() {
	ytplayer1 = new YT.Player('ytplayer1', {
		height: '300',
		width: '500',
		videoId: 'kO1pV9Zp-Yo',
		events: {
			'onReady': onPlayerReady1
		}
	});
	ytplayers.push(ytplayer1);

	ytplayer2 = new YT.Player('ytplayer2', {
		height: '300',
		width: '500',
		videoId: 'UbBqF8xxh48',
		events: {
			'onReady': onPlayerReady2
		}
	});

	ytplayers.push(ytplayer2);
	console.log(ytplayer1.toSource());

}

function onPlayerReady1(event) {
	event.target.setVolume(100);
}

function onPlayerReady2(event) {
	event.target.setVolume(0);
}

function changePlayer(playerId, playerIndex) {
	var players = $(playerId).children();
	$.each(players, function (index, elem) {
		if ($(elem).is(":visible")) {
			$(elem).hide();
		} 	
	});
	var playerElem = players[playerIndex];
	$(playerElem).attr("style", "visibility:visible");
}








