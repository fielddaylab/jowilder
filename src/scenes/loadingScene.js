var LoadingScene = function(game, stage)
{
  var self = this;

  var canv;
  var canvas;
  var ctx;
  self.resize = function(s)
  {
    stage = s;
    canv = stage.canv;
    canvas = canv.canvas;
    ctx = canv.context;

    ctx.font = text_font;
  }
  self.resize(stage);

  var pad;
  var barw;

  var loading_percent_loaded;
  var ticks_since_loading_ready;
  var percent_loaded;
  var chase_percent_loaded;
  var lerp_percent_loaded;
  var lerp_chase_percent_loaded;
  var ticks_since_ready;
  var post_load_countdown;

  var n_loading_imgs_loaded;
  var loading_img_srcs;
  var loading_imgs;
  var n_imgs_loaded;
  var img_srcs;
  var imgs;
  var n_fonts_loaded;
  var font_srcs;
  var font_loaded;
  var font_wrongdata;
  var font_canv;
  var font_canv_s;
  var n_audios_loaded;
  var audio_srcs;
  var audios;

  var loadingImageLoaded = function()
  {
    n_loading_imgs_loaded++;
  };
  var imageLoaded = function()
  {
    n_imgs_loaded++;
  };
  var fontLoaded = function()
  {
    n_fonts_loaded++;
  };
  var audioLoaded = function()
  {
    n_audios_loaded++;
  };

  self.resize = function(stage)
  {
    canv = stage.canv;
    canvas = canv.canvas;
    ctx = canv.context;
  }

  var tryfont = function()
  {
    font_canv.context.fillStyle = "#FFFFFF";
    font_canv.context.fillRect(0,0,font_canv_s,font_canv_s);
    font_canv.context.fillStyle = "#000000";
    font_canv.context.fillText("a",12,22);
  }

  self.ready = function()
  {
    pad = 20;
    barw = (canv.width/4);

    loading_percent_loaded = 0;
    ticks_since_loading_ready = 0;
    percent_loaded = 0;
    chase_percent_loaded = 0;
    lerp_percent_loaded = 0;
    lerp_chase_percent_loaded = 0;
    ticks_since_ready = 0;
    post_load_countdown = 1;

    n_loading_imgs_loaded = 0;
    loading_img_srcs = [];
    loading_imgs = [];
    n_imgs_loaded = 0;
    img_srcs = [];
    imgs = [];
    n_fonts_loaded = 0;
    font_srcs = [];
    font_loaded = [];
    n_audios_loaded = 0;
    audio_srcs = [];
    audios = [];

    //put asset paths in loading_img_srcs (for assets used on loading screen itself)
    loading_img_srcs.push("assets/logo_fd.png");
    loading_img_srcs.push("assets/logo_pbswi.png");
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      loading_imgs[i] = new Image();
      loading_imgs[i].onload = loadingImageLoaded;
      loading_imgs[i].src = loading_img_srcs[i];
    }
    loadingImageLoaded(); //call once to prevent 0/0 != 100% bug

    //put asset paths in img_srcs
    img_srcs.push("assets/poster.jpg");
    img_srcs.push("assets/logo.png");
    img_srcs.push("assets/check.png");
    img_srcs.push("assets/uncheck.png");
    img_srcs.push("assets/play.png");
    for(var i = 0; i < img_srcs.length; i++)
    {
      imgs[i] = new Image();
      imgs[i].onload = imageLoaded;
      imgs[i].src = img_srcs[i];
    }
    imageLoaded(); //call once to prevent 0/0 != 100% bug

    //put font paths in font_srcs
    //font_srcs.push("FontName"); //NEEDS DEFINITION IN index.html CSS!!
    font_srcs.push("Patrick");
    font_srcs.push("Boogaloo");
    font_canv_s = 25;
    font_canv = GenIcon(font_canv_s,font_canv_s);
    // uncomment below for preview
    //font_canv.style.position="absolute";
    //font_canv.style.left="-"+font_canv_s+"px";
    //document.getElementById("content").appendChild(font_canv);
    font_canv.context.font = "20px THISFONTDOESNTEXIST";
    tryfont();
    font_wrongdata = font_canv.context.getImageData(0,0,font_canv_s,font_canv_s);
    for(var i = 0; i < font_srcs.length; i++)
    {
      font_loaded[i] = 0;
    }
    fontLoaded(); //call once to prevent 0/0 != 100% bug

    //put asset paths in audio_srcs
    audio_srcs.push("assets/music_menu.mp3");
    for(var i = 0; i < audio_srcs.length; i++)
    {
      audios[i] = new Audio();
      audios[i].addEventListener('canplaythrough', audioLoaded, false);
      audios[i].src = audio_srcs[i];
      audios[i].load();
    }
    audioLoaded(); //call once to prevent 0/0 != 100% bug
  };

  self.tick = function()
  {
    //font main-thread loaded test
    for(var i = 0; i < font_srcs.length; i++)
    {
      var font_data;
      if(!font_loaded[i])
      {
        font_canv.context.font = "20px "+font_srcs[i];
        tryfont();
        font_data = font_canv.context.getImageData(0,0,font_canv_s,font_canv_s);
        var j;
        for(j = 0; font_data.data[j] == font_wrongdata.data[j] && j < font_data.data.length; j++) ;
        if(j < font_wrongdata.data.length)
        {
          fontLoaded();
          ctx.font = "20px "+font_srcs[i];
          ctx.fillText(".",0,0);
          font_loaded[i] = 1;
        }
      }
    }

    //note- assets used on loading screen itself NOT included in wait
    loading_percent_loaded = n_loading_imgs_loaded/(loading_img_srcs.length+1);
    if(loading_percent_loaded >= 1.0) ticks_since_loading_ready++;
    percent_loaded = (n_imgs_loaded+n_fonts_loaded+n_audios_loaded)/((img_srcs.length+1)+(font_srcs.length+1)+(audio_srcs.length+1));
    if(chase_percent_loaded <= percent_loaded) chase_percent_loaded += 0.01;
    lerp_percent_loaded = lerp(lerp_percent_loaded,percent_loaded,0.1);
    lerp_chase_percent_loaded = lerp(lerp_chase_percent_loaded,chase_percent_loaded,0.1);
    if(percent_loaded >= 1.0) ticks_since_ready++;
    if(ticks_since_ready >= post_load_countdown)
    {
      if(ticks_since_loading_ready > 550) game.nextScene();
      //game.nextScene();
    }
  };

  self.draw = function()
  {
    if(chase_percent_loaded < 1)
    {
      ctx.fillStyle = "#888888";
      ctx.strokeStyle = "#888888";
      ctx.fillRect(pad,canv.height-pad,chase_percent_loaded*barw,1);
      ctx.strokeRect(pad-1,canv.height-pad-1,barw+2,3);
    }

    if(loading_percent_loaded >= 1)
    {
      //do any special drawing here
      if(ticks_since_loading_ready < 50)
      {
        ctx.globalAlpha = ticks_since_loading_ready/50;
        drawImageHeightCentered(loading_imgs[0],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 200)
      {
        drawImageHeightCentered(loading_imgs[0],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 250)
      {
        ctx.globalAlpha = 1-((ticks_since_loading_ready-200)/50);
        drawImageHeightCentered(loading_imgs[0],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 300)
      {
        ctx.globalAlpha = (ticks_since_loading_ready-250)/50;
        drawImageHeightCentered(loading_imgs[1],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 450)
      {
        drawImageHeightCentered(loading_imgs[1],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 500)
      {
        ctx.globalAlpha = 1-((ticks_since_loading_ready-450)/50);
        drawImageHeightCentered(loading_imgs[1],canv.width/2,canv.height/2,100,ctx);
      }
      else if(ticks_since_loading_ready < 550)
      {
        ctx.globalAlpha = (ticks_since_loading_ready-500)/50;
        ctx.fillStyle = black;
        ctx.fillRect(0,0,canv.width,canv.height);
      }
      else
      {
        ctx.fillStyle = black;
        ctx.fillRect(0,0,canv.width,canv.height);
      }
      ctx.globalAlpha = 1;
    }

/*
    ctx.fillStyle = blue;
    var x = 10;
    var y = 30;
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      ctx.fillText(loading_img_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_loading_imgs_loaded,x,y);
    y += 20;
    for(var i = 0; i < img_srcs.length; i++)
    {
      ctx.fillText(img_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_imgs_loaded,x,y);
    y += 20;
    for(var i = 0; i < font_srcs.length; i++)
    {
      ctx.fillText(font_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_fonts_loaded,x,y);
    y += 20;
    for(var i = 0; i < audio_srcs.length; i++)
    {
      ctx.fillText(audio_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_audios_loaded,x,y);
    y += 20;
*/
  };

  self.cleanup = function()
  {
    audios = [];//just used them to cache assets in browser; let garbage collector handle 'em.
    imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
    loading_imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
  };
};

