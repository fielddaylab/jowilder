function remove_vault_dropdown() {
  const vaultDropdown =
    window.parent.document.querySelector("floating-dropdown");
  // console.log("Debug [JSPlugin > DisableVaultButton]");
  if (vaultDropdown) {
    vaultDropdown.remove();
  } else {
    console.warn(
      "[Vault Plugin] Failed attempt to remove element <floating-dropdown>"
    );
  }
}

var MenuScene = function (game, stage) {
  var self = this;

  var clicker;
  var hoverer;
  var blurer;
  var audio;

  var canv;
  var canvas;
  var ctx;
  self.resize = function (st) {
    stage = st;
    if (code_txt && code_txt.box_on) code_txt.blur();
    canv = stage.canv;
    if (code_txt) code_txt.canv = canv;
    canvas = canv.canvas;
    ctx = canv.context;

    var minw = 440;
    var maxw = 680;
    text_h = floor(mapVal(minw, maxw, 18, 24, clamp(minw, maxw, canv.width)));
    text_font = text_h + "px Patrick";
    ctx.font = text_font;
    if (clicker) {
      clicker.detach();
      clicker = new Clicker({ source: canvas });
    }
    if (hoverer) {
      hoverer.detach();
      hoverer = new Hoverer({ source: canvas });
    }
    if (blurer) {
      blurer.detach();
      blurer = new Blurer({ source: canvas });
    }
    if (realtime_click_registered_to) {
      realtime_click_registered_to.removeEventListener("click", realtime_click);
      canv.canvas.addEventListener("click", realtime_click);
      realtime_click_registered_to = canv.canvas;
    }

    var y = canv.height - 100;
    if (audio_toggle) audio_toggle.y = y;
    if (hq_toggle) hq_toggle.y = y;
    if (fullscreen_toggle) fullscreen_toggle.y = y;

    ctx.font = text_font;
  };
  self.resize(stage);

  var new_button;
  var continue_button;
  var code_button;
  var code_txt;
  var quiz_cont_button;

  var audio_toggle;
  var hq_toggle;
  var fullscreen_toggle;

  var continuable;
  var code_valid;

  var next = 0;
  var next_t = 0;
  var use_quiz = 0;
  var quiz_state = 0;
  var hackquiz_t = 0;

  var poster_img;
  var logo_img;
  var check_img;
  var uncheck_img;
  var play_img;
  var go_img;
  var quiz_bg_img;
  var contin_img;

  var realtime_click = function (evt) {
    doSetPosOnEvent(evt);
    if (fullscreen_toggle && doEvtWithinBB(evt, fullscreen_toggle))
      fullscreen_toggle.toggle();
  };
  var realtime_click_registered_to = 0;

  self.ready = function () {
    if (!clicker) clicker = new Clicker({ source: canvas });
    if (!hoverer) hoverer = new Hoverer({ source: canvas });
    if (!blurer) blurer = new Blurer({ source: canvas });
    if (!audio) audio = GenAudio("assets/music_menu.mp3");
    audio.loop = true;

    poster_img = GenImg("assets/poster.jpg");
    logo_img = GenImg("assets/logo.png");
    check_img = GenImg("assets/check.png");
    uncheck_img = GenImg("assets/uncheck.png");
    play_img = GenImg("assets/play.png");
    go_img = GenImg("assets/go.png");
    quiz_bg_img = GenImg("assets/blank_bg.jpg");
    contin_img = GenImg("assets/continue-button.png");
    quiz_next_text = "SKIP";

    var w = 240;
    var h = 50;
    var x = 20;
    var y = 220;
    continue_button = new ButtonBox(x, y, w, h, function (evt) {
      if (!continuable) return;
      next = 1;
    });
    y += h + 10;
    new_button = new ButtonBox(x, y, w, h, function (evt) {
      save_code = 0;
      setCookie("save", 0, 0);
      if (QUIZ_GLOBAL_SHOW) {
        use_quiz = 1; // toggle quiz
        next = 0; // toggle quiz
        reset_quiz(quiz);
      }
      // next=0;
      let scale = 0.25;
      w = scale * 490;
      h = scale * 158;
      quiz_cont_button = new ButtonBox(
        canv.width - 20 - w,
        canv.height - 20 - h,
        w,
        h,
        function (evt) {
          next = 1;
          use_quiz = 0;
        }
      );
      quiz_cont_button.hover = function (evt) {
        quiz_cont_button.hovering = 1;
      };
      quiz_cont_button.unhover = function (evt) {
        quiz_cont_button.hovering = 0;
      };
    });
    y += h + 10;

    y += h + 50;
    code_txt = new DomTextBox(x, y, w, h, canv, "", function (txt) {
      if (txt == "") {
        code_txt.bg_color = "rgba(255,255,255,0.1)";
        code_valid = 0;
        return;
      }
      if (save_table[txt.toLowerCase()]) {
        code_txt.bg_color = "rgba(0,255,0,0.1)";
        code_valid = 1;
      } else {
        code_txt.bg_color = "rgba(255,0,0,0.1)";
        code_valid = 0;
      }
    });
    x += w + 10;
    code_button = new ButtonBox(x, y, 70, h, function (evt) {
      if (save_table[code_txt.txt.toLowerCase()]) {
        save_table_code = code_txt.txt.toLowerCase();
        gtag('event', 'save_code_used', { save_code: save_table_code });
        save_code = save_table[save_table_code].code;
        next = 1;
      }
    });

    continue_button.hover = function (evt) {
      continue_button.hovering = 1;
    };
    continue_button.unhover = function (evt) {
      continue_button.hovering = 0;
    };
    new_button.hover = function (evt) {
      new_button.hovering = 1;
    };
    new_button.unhover = function (evt) {
      new_button.hovering = 0;
    };

    w = 30;
    h = 30;
    x = 100;
    y = canv.height - 100;
    audio_toggle = new ToggleBox(x, y, w, h, AUDIO, function (o) {
      audio.pause();
      AUDIO = o;
      if (!o && !audio.paused) audio.pause();
      if (o && audio.paused) playHandlePromise(audio, 1);
    });
    x += 200;
    hq_toggle = new ToggleBox(x, y, w, h, !LOFI, function (o) {
      LOFI = !o;
      QUALITY = !LOFI;

      if (QUALITY) {
        stage = new Stage({
          width: stage.width,
          height: stage.height,
          container: stage.container,
        });
        g.resize({ stage: stage });
      } else {
        stage = new Stage({
          width: stage.width,
          height: stage.height,
          container: stage.container,
          bspr: 2,
        });
        g.resize({ stage: stage });
      }
    });
    x += 200;
    fullscreen_toggle = new ToggleBox(x, y, w, h, 0, function (o) {
      /*hijack me from realtime!*/ if (o) fullscreen();
      else unfullscreen();
    });
    x += 200;

    //THIS IS RIDICULOUS (the only way I could figure out how to ensure keyboard focus through iframe)
    code_txt.focus();
    code_txt.blur();

    next = 0;
    next_t = 0;
    use_quiz = 0;
    hackquiz_t = 0;
    continuable = save_code;
    code_valid = 0;

    if (realtime_click_registered_to)
      realtime_click_registered_to.removeEventListener("click", realtime_click);
    canv.canvas.addEventListener("click", realtime_click);
    realtime_click_registered_to = canv.canvas;
  };

  self.tick = function () {
    if (AUDIO && audio && game_first_audio_played && audio.paused)
      playHandlePromise(audio, 1);

    if (use_quiz) {
      hackquiz_t += 0.01;
      if (hackquiz_t >= 1) {
        //keep in sync with draw!
        var qh = canv.height / (quiz.questions.length + 1);
        var y = qh - qh / 2;
        for (var i = 0; i <= quiz_state && i < quiz.questions.length; i++) {
          var q = quiz.questions[i];
          var aw = canv.width / (q.a.length + 1);
          var x = aw;
          for (var j = 0; j < q.a.length; j++) {
            clicker.consumeif(
              x - aw / 2,
              y - text_h / 2,
              aw,
              text_h * 2,
              q.aclick[j]
            );
            if (q.response != -1) {
              quiz_state = Math.max(quiz_state, i + 1); // if the question got a response, make sure state points to at least the next question.
            }
            x += aw;
          }
          y += qh;
        }
        if (quiz.questions[quiz.questions.length - 1].response != -1) {
          // if answered the last question
          quiz_next_text = "CONTINUE";
        }
        // clicker.consumeif(10,canv.height-10-text_h,text_h*10,text_h,quizcontinue);
      }
    }
    if (next) {
      next_t += 0.01;
      if (next_t >= 1) {
        //ADDLOG - wrote data func
        var gamestart_data = {
          save_code: save_table_code,
          fullscreen: fullscreen_toggle.on,
          music: audio_toggle.on,
          hq: hq_toggle.on ? 1 : 0,
        };

        // Log the quiz data
        // log_quiz(quiz);

        // Log the gamestart data
        log_gamestart_type_data = my_logger.get_startgame_type_data(
          gamestart_data.save_code,
          gamestart_data.fullscreen,
          gamestart_data.music,
          gamestart_data.hq
        );
        log_gamestart_subtype_data = my_logger.get_startgame_subtype_data();
        log_data = my_logger.get_log_data(
          LOG_TYPE_STARTGAME,
          log_gamestart_type_data,
          LOG_SUBTYPE_BASIC,
          log_gamestart_subtype_data
        );
        my_logger.send_log(log_data);

        remove_vault_dropdown();
        game.nextScene();
        return;
        /*avoid flush*/
      }
    } else {
      if (use_quiz) {
        hoverer.filter(quiz_cont_button);
        if (!clicker.filter(quiz_cont_button));
      } else {
        blurer.filter(code_txt);
        hoverer.filter(continue_button);
        hoverer.filter(new_button);
        if (
          !clicker.filter(continue_button) &&
          !clicker.filter(new_button) &&
          !clicker.filter(code_txt) &&
          !clicker.filter(code_button) &&
          !clicker.filter(audio_toggle) &&
          !clicker.filter(hq_toggle) &&
          //!clicker.filter(fullscreen_toggle) && //must hijack from realtime listener!
          false
        );
      }
    }
    clicker.flush();
    hoverer.flush();
    blurer.flush();
  };

  self.draw = function () {
    ctx.drawImage(poster_img, 0, 0, canv.width, canv.height);

    var w = 300;
    var h = 150;
    ctx.drawImage(logo_img, 30, 30, w, h);

    ctx.font = floor(text_h * 1.3) + "px Boogaloo";
    ctx.textAlign = "left";
    /*
    if(continuable) continue_button.draw(canv);
    new_button.draw(canv);
    code_button.draw(canv);
    */
    ctx.fillStyle = white;
    if (!continuable) ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillText(
      "CONTINUE",
      continue_button.x + 15,
      continue_button.y + continue_button.h - 10
    );
    if (continue_button.hovering)
      ctx.fillRect(
        continue_button.x + 10,
        continue_button.y + continue_button.h,
        continue_button.w - 110,
        3
      );
    ctx.fillStyle = white;
    ctx.fillText(
      "NEW GAME",
      new_button.x + 15,
      new_button.y + new_button.h - 10
    );
    if (new_button.hovering)
      ctx.fillRect(
        new_button.x + 10,
        new_button.y + new_button.h,
        new_button.w - 105,
        3
      );
    code_txt.draw(canv);
    ctx.fillText("ENTER SAVE CODE:", code_txt.x + 15, code_txt.y - 20);
    if (!code_valid) ctx.globalAlpha = 0.1;
    ctx.drawImage(
      go_img,
      code_button.x,
      code_button.y,
      code_button.w,
      code_button.h
    );
    ctx.globalAlpha = 1;

    /*
    audio_toggle.draw(canv);
    hq_toggle.draw(canv);
    fullscreen_toggle.draw(canv);
    */
    if (audio_toggle.on) drawImageBox(check_img, audio_toggle, ctx);
    else drawImageBox(uncheck_img, audio_toggle, ctx);
    if (hq_toggle.on) drawImageBox(check_img, hq_toggle, ctx);
    else drawImageBox(uncheck_img, hq_toggle, ctx);
    if (fullscreen_toggle.on) drawImageBox(check_img, fullscreen_toggle, ctx);
    else drawImageBox(uncheck_img, fullscreen_toggle, ctx);
    ctx.font = text_h + "px Boogaloo";
    ctx.fillText(
      "MUSIC FX",
      audio_toggle.x + audio_toggle.w + 5,
      audio_toggle.y + audio_toggle.h - 5
    );
    ctx.fillText(
      "HQ GRAPHICS",
      hq_toggle.x + hq_toggle.w + 5,
      hq_toggle.y + hq_toggle.h - 5
    );
    ctx.fillText(
      "FULLSCREEN",
      fullscreen_toggle.x + fullscreen_toggle.w + 5,
      fullscreen_toggle.y + fullscreen_toggle.h - 5
    );

    let drawQuizQuestion = function (q, y) {
      var aw = canv.width / (q.a.length + 1);
      var x = aw;
      ctx.fillStyle = white;
      ctx.fillText(q.q, canv.width / 2, y - text_h / 2);
      for (var j = 0; j < q.a.length; j++) {
        if (q.response == j) ctx.fillStyle = gray;
        else ctx.fillStyle = white;
        ctx.fillText(q.a[j], x, y + text_h);
        //ctx.strokeStyle = green; ctx.strokeRect(x-aw/2,y-text_h/2,aw,text_h*2); //debug hitboxes
        x += aw;
      }
    };

    if (use_quiz) {
      ctx.fillStyle = black;
      ctx.globalAlpha = min(1, hackquiz_t);
      // ctx.fillRect(0,0,canv.width,canv.height);
      // ctx.drawImage()
      ctx.drawImage(quiz_bg_img, 0, 0, canv.width, canv.height);
      ctx.globalAlpha = 1;
      if (hackquiz_t >= 1) {
        ctx.textAlign = "center";
        var qh = canv.height / (quiz.questions.length + 1);
        var y = qh - qh / 2;
        for (var i = 0; i <= quiz_state && i < quiz.questions.length; i++) {
          var q = quiz.questions[i];
          drawQuizQuestion(q, y);
          y += qh;
        }
        ctx.fillStyle = white;
        ctx.textAlign = "right";
        // ctx.fillText("Continue",10,canv.height-10);
        // if (quiz_state >= quiz.questions.length) {
        // drawImageBox(contin_img,quiz_cont_button,ctx);
        ctx.fillText(quiz_next_text, canv.width - 20, canv.height - 20);
        // }
        //ctx.strokeStyle = green; ctx.strokeRect(10,canv.height-10-text_h,text_h*10,text_h); //debug continue hitbox
        ctx.fillStyle = black;
        if (hackquiz_t < 2) {
          ctx.globalAlpha = 1 - (hackquiz_t - 1);
          ctx.fillRect(0, 0, canv.width, canv.height);
          ctx.globalAlpha = 1;
        }
      }
    }
    if (next) {
      ctx.fillStyle = black;
      ctx.globalAlpha = next_t;
      ctx.fillRect(0, 0, canv.width, canv.height);
      ctx.globalAlpha = 1;
    }
  };

  self.cleanup = function () {
    clicker.detach();
    clicker = null;
    hoverer.detach();
    hoverer = null;
    blurer.detach();
    blurer = null;
    audio.pause();
    audio = null;
    break_unplayed_audio();
    if (realtime_click_registered_to)
      realtime_click_registered_to.removeEventListener("click", realtime_click);
    realtime_click_registered_to = 0;
  };
};
