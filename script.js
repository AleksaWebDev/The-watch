$(document).ready(function() {

  //return diameter of the clock-face
  function getDiaClockFace() {
    return $('#clock-face').outerWidth();
  }
  //add a new dot to the .watch__clock-face
  function addNewDotToClockFace($clockFace, classDot, cssValues) {
    $('<div></div>', {
                        class: 'watch__dot ' + classDot
                     }).css(cssValues).prependTo($clockFace);
  }

  //generates dots for the clock-face
  (function() {
    var $clockFace = $('#clock-face');
    var diaClockFace = getDiaClockFace();
    var radClockFace = diaClockFace / 2;
    var cssValues1quarter = {
      'top': '0',
      'right': '0',
      'transform': 'translateX(50%) translateY(-50%)'
    };
    var cssValues2quarter = {
      'top': '0',
      'left': '0',
      'transform': 'translateX(-50%) translateY(-50%)'
    };
    var cssValues3quarter = {
      'bottom': '0',
      'left': '0',
      'transform': 'translateX(-50%) translateY(50%)'
    };
    var cssValues4quarter = {
      'bottom': '0',
      'right': '0',
      'transform': 'translateX(50%) translateY(50%)'
    };
    var classDot;
    var angle; //degrees
    var angleRad; //radians
    var x, y; //coordinates of the dot of the first quarter relative to the center of the clock face
    var top, right; //coordinates of the dot relative to the block .clock-face

    // 12 o'clock
    addNewDotToClockFace($clockFace, 'watch__dot-big', 
    {
      'top': '0',
      'left': '50%',
      'transform': 'translateX(-50%) translateY(-50%)'
    });

    // 3 o'clock
    addNewDotToClockFace($clockFace, 'watch__dot-big', 
    {
      'top': '50%',
      'right': '0',
      'transform': 'translateY(-50%) translateX(50%)'
    });

    //6 o'clock
    addNewDotToClockFace($clockFace, 'watch__dot-big', 
    {
      'bottom': '0',
      'left': '50%',
      'transform': 'translateY(50%) translateX(-50%)'
    });

    //9 o'clock
    addNewDotToClockFace($clockFace, 'watch__dot-big', 
    {
      'top': '50%',
      'left': '0',
      'transform': 'translateY(-50%) translateX(-50%)'
    });

    //go through the dots of the first quarter
    for (var i = 1; i <= 14; i++) {
      classDot = 'watch__dot-small';
      if (i == 5 || i == 10) {
        classDot = 'watch__dot-big';
      }

      angle = 6 * i;
      angleRad = angle * Math.PI / 180;

      x = radClockFace * Math.sin(angleRad);
      y = radClockFace * Math.cos(angleRad);

      right = radClockFace - x; //pixels
      top = radClockFace - y; //pixels

      right = right * 100 / diaClockFace; // %
      top = top * 100 / diaClockFace; // %

      //I quarter
      cssValues1quarter.top = top + '%';
      cssValues1quarter.right = right + '%';
      addNewDotToClockFace($clockFace, classDot, cssValues1quarter);
      //II quarter
      cssValues2quarter.top = cssValues1quarter.top;
      cssValues2quarter.left = cssValues1quarter.right;
      addNewDotToClockFace($clockFace, classDot, cssValues2quarter);
      //III quarter
      cssValues3quarter.bottom = cssValues1quarter.top;
      cssValues3quarter.left = cssValues1quarter.right;
      addNewDotToClockFace($clockFace, classDot, cssValues3quarter);
      //IV quarter
      cssValues4quarter.bottom = cssValues1quarter.top;
      cssValues4quarter.right = cssValues1quarter.right;
      addNewDotToClockFace($clockFace, classDot, cssValues4quarter);
    } // end for

  })(); // end function

//==============================================================

  //open watch when user clicks on the lid of watch
  $('#watch-lid').on('click', function openTheWatch() {
    var $this = $(this);
    var watch = $('.watch')[0];

    $this.unbind();

    //delete cursor: pointer from the lid
    $this.toggleClass('cursor_default');

    //start animation to open the lid and for appearance of the button
    if (!$(watch).hasClass('watch_open'))
      $(watch).addClass('watch_open');
    else $(watch).toggleClass('watch_closed');
    

    $('.watch__button-close-lid').on('animationend', function() {
      var $this = $(this);

      $this.unbind();
      $this.toggleClass('cursor_default');

      $this.on('click', function closeTheWatch() {
        var $this = $(this);

        $this.unbind();
        $this.toggleClass('cursor_default');
        $(watch).toggleClass('watch_closed');

        $('.watch__lid-loop').on('animationend', function() {
          var $this = $(this);
          var watchLid = $('#watch-lid');

          $this.unbind();
          watchLid.toggleClass('cursor_default');
          watchLid.on('click', openTheWatch);
        }); //end animationend lid

      }); //end closeTheWatch()
    }); //end animationend button

  }); //end openTheWatch()


//==============================================================
  function setDate(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    $('#curr-year').text(d.getFullYear());
    $('#curr-month').text(months[d.getMonth()]);
    $('#day-of-week').text(days[d.getDay()]);
    $('#curr-day').text(d.getDate());
  }

  function updateDate() {
    var d = new Date();

    setDate(d);
  }

  function setArrows(secondArrow, secondAngle, minuteArrow, minuteAngle, hourArrow, hourAngle) {
    $(secondArrow).css('transform', 'translateX(-50%) rotate(' + secondAngle + 'deg)');
    $(minuteArrow).css('transform', 'translateX(-50%) rotate(' + minuteAngle + 'deg)');
    $(hourArrow).css('transform', 'translateX(-50%) rotate(' + hourAngle + 'deg)');
  }

  function startTheWatch() {
    var d = new Date();

    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    var hourAnglePS = 1 / 120; //hour arrow passes degrees per second
    var minuteAnglePS = 0.1; //minute arrow passes degrees per second
    var secondAnglePS = 6; //second arrow passes degrees per second

    var secondArrow = $('.watch__arrow-second')[0];
    var minuteArrow = $('.watch__arrow-minute')[0];
    var hourArrow = $('.watch__arrow-hour')[0];

    var secondAngle, minuteAngle, hourAngle;

    var secondsToUpdateDate = 86400 - hours * 3600 - minutes * 60 - seconds;
    var circlesToRoundHourAngle;

    var audio = new Audio("ticking-watch.mp3");

    secondAngle = seconds * secondAnglePS;
    minuteAngle = minutes * 6 + seconds * minuteAnglePS;
    hourAngle = (hours % 12) * 30 + (minutes * 60 + seconds) / 120;

    setArrows(secondArrow, secondAngle, minuteArrow, minuteAngle, hourArrow, hourAngle);

    if (minutes % 2 == 0) circlesToRoundHourAngle = 2;
    else circlesToRoundHourAngle = 1;

    setTimeout(function updateTheWatch() {
      secondAngle += secondAnglePS;
      minuteAngle += minuteAnglePS;
      hourAngle += hourAnglePS;

      if (secondAngle % 360 == 0) {
        secondAngle = 0;

        minuteAngle = Math.round(minuteAngle);
        if (minuteAngle % 360 == 0) minuteAngle = 0;

        circlesToRoundHourAngle--;
        if (circlesToRoundHourAngle == 0) {
          hourAngle = Math.round(hourAngle);
          circlesToRoundHourAngle = 2;
          if (hourAngle % 360 == 0) hourAngle = 0;
        }
      }

      setArrows(secondArrow, secondAngle, minuteArrow, minuteAngle, hourArrow, hourAngle);

      if ($('#sound').is(':checked')) {
        audio.play();
      }

      secondsToUpdateDate--;
      if (secondsToUpdateDate == 0) {
        updateDate();
        secondsToUpdateDate = 86400;
      }

      setTimeout(updateTheWatch, 1000);
    }, 1000);

    setDate(d);
  }

  function init() {
    startTheWatch();
    
    //delete cursor: pointer from the button
    $('.watch__button-close-lid').toggleClass('cursor_default');

    $('#description').dialog({
      draggable: false,
      resizable: false,
      modal: true,
      show: 'fadeIn',
      hide: 'fadeOut',
      width: 270
    });
  }

  init();
});