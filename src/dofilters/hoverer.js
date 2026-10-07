var Hoverer = function(init)
{
  var default_init =
  {
    source:document.createElement('div')
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  var evts = [];
  var ENUM = 0;
  var EVT_TYPE_AMBIGUOUS = ENUM; ENUM++;
  var EVT_TYPE_UNHOVER   = ENUM; ENUM++;
  var evt_types = [];
  // Pointer events are reliable in Safari when the canvas is inside the
  // Vault's cross-origin iframe. Keep one input family at a time.
  var pointer_input = typeof window.PointerEvent !== "undefined";
  self.attach = function() //will get auto-called at creation
  {
    if (pointer_input)             self.source.addEventListener('pointermove', hover, false);
    else if(platform == "PC")      self.source.addEventListener('mousemove', hover, false);
    else if(platform == "MOBILE") ; //no hover on mobile, dummy
    if (pointer_input)             window.addEventListener('pointermove', detectOut, false);
    else if(platform == "PC")      window.addEventListener('mousemove', detectOut, false);
  }
  self.detach = function()
  {
    if (pointer_input)             self.source.removeEventListener('pointermove', hover);
    else if(platform == "PC")      self.source.removeEventListener('mousemove', hover);
    if (pointer_input)             window.removeEventListener('pointermove', detectOut, false);
    else if(platform == "PC")      window.removeEventListener('mousemove', detectOut, false);
  }

  function hover(evt)
  {
    var r = self.source.getBoundingClientRect();

    doSetPosOnEvent(evt);
    evts.push(evt);
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
      evt_types.push(EVT_TYPE_UNHOVER);
    else
      evt_types.push(EVT_TYPE_AMBIGUOUS);
  }
  function detectOut(evt)
  {
    var r = self.source.getBoundingClientRect();
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
    {
      doSetPosOnEvent(evt);
      evts.push(evt);
      evt_types.push(EVT_TYPE_UNHOVER);
    }
  }

  self.filter = function(hoverable)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      switch(evt_types[i])
      {
        case EVT_TYPE_UNHOVER:
        {
          if(hoverable.hovering)
          {
            if((hoverable.shouldHover && !hoverable.shouldHover(evt)) || (!hoverable.shouldHover && !doEvtWithinBB(evt,hoverable)))
            {
              hoverable.hovering = false;
              hoverable.unhover(evt);
            }
          }
        }
        break;
        case EVT_TYPE_AMBIGUOUS:
        {
          if(hoverable.hovering)
          {
            if((hoverable.shouldHover && !hoverable.shouldHover(evt)) || (!hoverable.shouldHover && !doEvtWithinBB(evt,hoverable)))
            {
              hoverable.hovering = false;
              hoverable.unhover(evt);
            }
          }
          else if(!hoverable.hovering)
          {
            if((hoverable.shouldHover && hoverable.shouldHover(evt)) || (!hoverable.shouldHover && doEvtWithinBB(evt,hoverable)))
            {
              hoverable.hovering = true;
              hoverable.hover(evt);
              hit = true;
            }
          }
        }
        break;
      }
    }
    return hit;
  }
  self.flush = function()
  {
    evts = [];
    evt_types = [];
  }

  self.attach();
}

//example hoverable- just needs x,y,w,h, hover and unhover callback
var Hoverable = function(args)
{
  var self = this;

  self.x = args.x ? args.x : 0;
  self.y = args.y ? args.y : 0;
  self.w = args.w ? args.w : 0;
  self.h = args.h ? args.h : 0;
  self.shouldHover = args.shouldHover ? args.shouldHover : function(evt) //optional
  {
    return doEvtWithinBB(evt, self);
  }
  self.hover = args.hover ? args.hover : function(){};
  self.unhover = args.unhover ? args.unhover : function(){};

  //nice for debugging purposes
  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#00FF00";
    canv.context.strokeRect(self.x,self.y,self.w,self.h);
  }
}

