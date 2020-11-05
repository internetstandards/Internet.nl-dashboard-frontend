function make_progressbar() {
    var percentage = $(".testresults-percentage");
    if (percentage.length) {
        percentage.each(function () {
            var theLength = $(this).data("resultscore");
            var canAnimate = true;
            var theSpeed = 1000;
            var theSpan = $(this).find('.meter span');
            var theScore = $(this).find('.score-container .score');
            if (canAnimate) {
                theSpan.width(0).animate({width: theLength + "%"}, {
                    duration: theSpeed, step: function (now, fx) {
                        $("#testresults-overview p.score").text(parseInt(now) + "%");
                    }
                });
            } else {
                theSpan.width(theLength + "%");
                theScore.text(theLength + "%");
            }
        });
    }
}

function alignResultsOverviewWithAsideBox() {
    setTimeout(doTheAlignment, 300);
}

function doTheAlignment() {
    var maxdiff = 40;
    var overview = $("#testresults-overview")
    var firstBlock = $("#first-aside-block")
    var overviewHeight = overview.innerHeight();
    var firstBlockHeight = firstBlock.innerHeight();
    var maxHeight = Math.max(overviewHeight, firstBlockHeight);
    var diff = 0;
    if (overviewHeight < maxHeight) {
        diff = maxHeight - overviewHeight;
        if (diff < maxdiff) {
            overview.css("min-height", overviewHeight + diff);
        }
    } else {
        diff = maxHeight - firstBlockHeight;
        if (diff < maxdiff) {
            firstBlock.css("min-height", firstBlockHeight + diff);
        }
    }
}

function startCountDownRetestTime() {
    var retestTime = $("#retest-time");
    if (retestTime) {
        var seconds = retestTime.text();
        countDownRetestTime(seconds);
    }
}

function countDownRetestTime(seconds) {
    if (seconds < 1) {
        $(".retest-text").addClass("hidethis").attr("aria-hidden", true);
        $(".retest-link").removeClass("hidethis").attr("aria-hidden", false);
    } else {
        $(".retest-text").removeClass("hidethis").attr("aria-hidden", false);
        $(".retest-link").addClass("hidethis").attr("aria-hidden", true);
        $(".retest-text .retest-time").text(seconds);
        setTimeout(function () {
            countDownRetestTime(seconds - 1);
        }, 1000);
    }
}

function enablePanelButtons() {
    var buttons = $('.panel-button-container button');
    buttons.each(function () {
        var panelButtonShowText = $('#panel-button-show').text();
        $(this).text(panelButtonShowText);
        $(this).removeClass('hidethis').attr('aria-hidden', false);
    });
    buttons.click(function () {
        var testHeader = $(this).parent().parent();
        if ($(this).hasClass('panel-button-show')) {
            $('+.testresults .panel-title > a', testHeader).each(function () {
                if ($(this).attr('aria-expanded') == 'false') {
                    $(this).parents('.accordion').find('[aria-expanded=true]').attr('aria-expanded', false).removeClass('active').parent().next('.panel-content').slideUp(200).attr('aria-hidden', 'true');
                    $(this).attr('aria-expanded', true).addClass('active').parent().next('.panel-content').slideDown(200).attr('aria-hidden', 'false');
                }
                setPanelItemFoldText($('.pre-icon', this), 'close');
            });
            $(this).addClass('panel-button-hide').removeClass('panel-button-show');
            var panelButtonHideText = $('#panel-button-hide').text();
            $(this).text(panelButtonHideText);
        } else {
            $('+.testresults .panel-title > a', testHeader).each(function () {
                if ($(this).attr('aria-expanded') == 'true') {
                    $(this).attr('aria-expanded', false).removeClass('active').parent().next('.panel-content').slideUp(200).attr('aria-hidden', 'true');
                }
                setPanelItemFoldText($('.pre-icon', this), 'open');
            });
            $(this).addClass('panel-button-show').removeClass('panel-button-hide');
            var panelButtonShowText = $('#panel-button-show').text();
            $(this).text(panelButtonShowText);
        }
    });
}

function refreshPanelButtonText(panel_a, action) {
    var testResults = panel_a.parents('.testresults');
    var testHeader = testResults.prev();
    var button = $('.panel-button-container button', testHeader);
    if (action === 'close' && $('.panel-title a', testResults).length === $('.panel-title', testResults).find('a[aria-expanded=false]').length) {
        button.addClass('panel-button-show').removeClass('panel-button-hide');
        var panelButtonShowText = $('#panel-button-show').text();
        button.text(panelButtonShowText);
    } else if (action === 'open' && $('.panel-title a', testResults).length === $('.panel-title', testResults).find('a[aria-expanded=true]').length) {
        button.addClass('panel-button-hide').removeClass('panel-button-show');
        var panelButtonHideText = $('#panel-button-hide').text();
        button.text(panelButtonHideText);
    }
}

function setPanelItemFoldText(panel_preicon, text) {
    if (text === 'open') {
        var openText = $('#panel-item-open').text();
        panel_preicon.text(openText);
    } else if (text === 'close') {
        var closeText = $('#panel-item-close').text();
        panel_preicon.text(closeText);
    }
}

if (window.attachEvent) {
    window.attachEvent('onload', make_progressbar);
    window.attachEvent('onload', startCountDownRetestTime);
    window.attachEvent('onload', enablePanelButtons);
    window.attachEvent('onload', alignResultsOverviewWithAsideBox);
} else if (window.addEventListener) {
    window.addEventListener("load", make_progressbar, false);
    window.addEventListener("load", startCountDownRetestTime, false);
    window.addEventListener("load", enablePanelButtons, false);
    window.addEventListener("load", alignResultsOverviewWithAsideBox, false);
} else {
    window.onload = "ImageCheck();make_progressbar(),startCountDownRetestTime();enablePanelButtons();alignResultsOverviewWithAsideBox();";
}