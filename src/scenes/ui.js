var bubble_in_a = function(t) { return t; }
var bubble_out_a = function(t) { return 1-t; }
var bubble_in_y = function(t) { return sin(t*twopi*2)*(1-t)*5 }
var bubble_out_y = function(t) { return -t*10; }

var loader = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = canv.width;
  self.h = canv.height;

  self.loading = false;
  self.loading_q = [];

  self.loading_animcycle_inst;

  self.resize = function()
  {

  }
  self.resize();

  self.loaded = function(args)
  {
    for(var i = 0; i < self.loading_q.length; i++)
      if(self.loading_q[i] == args.target) { self.loading_q.splice(i,1); break; }
    if(!self.loading_q.length)
      self.loading = false;
    //console.log(self.loading_q.length+" "+args.target.src);
  }
  self.load_animcycle_inst = function(inst)
  {
    var animcycle = inst.animcycle;
    self.load_animcycle(inst.animcycle);
    if(!inst.img) inst.img = animcycle.frames[inst.frame_i];
  }
  self.load_animcycle = function(animcycle)
  {
    for(var i = 0; i < animcycle.frame_files.length; i++)
    {
      if(!animcycle.frames[i])
      {
        if(LOFI) animcycle.frames[i] = GenImg(animcycle.frame_files[i].replace("animcycles","lofianimcycles"));
        else     animcycle.frames[i] = GenImg(animcycle.frame_files[i]);
      }
      var img = animcycle.frames[i];
      if(!img.complete)
      {
        var found = false;
        img.onload = self.loaded;
        for(var j = 0; j < self.loading_q.length; j++)
          if(self.loading_q[j] == img) return;
        self.loading_q.push(img);
        self.loading = true;
        if(!img.src)
        {
          if(LOFI) img.src = animcycle.frame_files[i].replace("animcycles","lofianimcycles");
          else     img.src = animcycle.frame_files[i];
        }
      }
    }
  }

  self.consume_level = function(level)
  {
    get_audio(level.toolbar_audio_id,level.audios).aud.load();
    get_audio(level.map_audio_id,level.audios).aud.load();
    get_audio(level.notebook_audio_id,level.audios).aud.load();
    get_audio(level.notebook_turn_audio_id,level.audios).aud.load();

    self.load_animcycle(find_animcycle(level.avatar_walk_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.avatar_idle_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.avatar_act_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.familiar_walk_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.familiar_idle_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.familiar_act_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.exit_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.toolbar_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.map_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.notebook_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.notebook_next_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.notebook_prev_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.icon_map_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.icon_notebook_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.ui_hover_animcycle_id,level.animcycles));
    self.load_animcycle(find_animcycle(level.ripple_click_animcycle_id,level.animcycles));
    for(var i = 0; i < level.loading_animcycle_ids.length; i++)
      self.load_animcycle(find_animcycle(level.loading_animcycle_ids[i],level.animcycles));
    for(var i = 0; i < level.deck_animcycle_ids.length; i++)
      self.load_animcycle(find_animcycle(level.deck_animcycle_ids[i],level.animcycles));

    for(var i = 0; i < level.scenes.length; i++)
    {
      self.load_animcycle_inst(level.scenes[i].animcycle_inst);
      self.load_animcycle_inst(level.scenes[i].notice_icon_animcycle_inst);
    }
    for(var i = 0; i < level.entrys.length; i++)
      self.load_animcycle_inst(level.entrys[i].animcycle_inst);
  }

  self.consume_room = function(room)
  {
    self.load_animcycle_inst(room.animcycle_inst);
    var person;
    for(var k = 0; k < room.persons.length; k++)
    {
      person = room.persons[k];
      self.load_animcycle_inst(person.animcycle_inst);
      self.load_animcycle_inst(person.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(person.hover_icon_animcycle_inst);
      self.load_animcycle_inst(person.notice_icon_animcycle_inst);
      for(var i = 0; i < person.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(person.deck_animcycle_ids[i],cur_level.animcycles));
      var speak;
      for(var l = 0; l < person.speaks.length; l++)
      {
        speak = person.speaks[l];
        self.load_animcycle_inst(speak.animcycle_inst);
        for(var i = 0; i < speak.deck_animcycle_ids.length; i++)
          self.load_animcycle(find_animcycle(speak.deck_animcycle_ids[i],cur_level.animcycles));
        var speak_command;
        for(var m = 0; m < speak.commands.length; m++)
        {
          speak_command = speak.commands[m];
          self.load_animcycle(find_animcycle(speak_command.animcycle_id,cur_level.animcycles));
          for(var i = 0; i < speak_command.deck_animcycle_ids.length; i++)
            self.load_animcycle(find_animcycle(speak_command.deck_animcycle_ids[i],cur_level.animcycles));
        }
      }
    }
    var object;
    for(var k = 0; k < room.objects.length; k++)
    {
      object = room.objects[k];
      self.load_animcycle_inst(object.animcycle_inst);
      self.load_animcycle_inst(object.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(object.hover_icon_animcycle_inst);
      self.load_animcycle_inst(object.notice_icon_animcycle_inst);
      self.load_animcycle_inst(object.view_overlay_animcycle_inst);
      for(var i = 0; i < object.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(object.deck_animcycle_ids[i],cur_level.animcycles));
      var view;
      for(var l = 0; l < object.views.length; l++)
      {
        view = object.views[l];
        self.load_animcycle_inst(view.animcycle_inst);
        for(var i = 0; i < view.deck_animcycle_ids.length; i++)
          self.load_animcycle(find_animcycle(view.deck_animcycle_ids[i],cur_level.animcycles));
        var zone;
        for(var m = 0; m < view.zones.length; m++)
        {
          zone = view.zones[m];
          self.load_animcycle_inst(zone.animcycle_inst);
          for(var i = 0; i < zone.deck_animcycle_ids.length; i++)
            self.load_animcycle(find_animcycle(zone.deck_animcycle_ids[i],cur_level.animcycles));
        }
      }
    }
    var observation;
    for(var k = 0; k < room.observations.length; k++)
    {
      observation = room.observations[k];
      self.load_animcycle_inst(observation.animcycle_inst);
      self.load_animcycle_inst(observation.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(observation.hover_icon_animcycle_inst);
      self.load_animcycle_inst(observation.notice_icon_animcycle_inst);
      for(var i = 0; i < observation.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(observation.deck_animcycle_ids[i],cur_level.animcycles));
    }
    var porthole;
    for(var k = 0; k < room.portholes.length; k++)
    {
      porthole = room.portholes[k];
      self.load_animcycle_inst(porthole.animcycle_inst);
      self.load_animcycle_inst(porthole.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(porthole.hover_icon_animcycle_inst);
      self.load_animcycle_inst(porthole.notice_icon_animcycle_inst);
      for(var i = 0; i < porthole.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(porthole.deck_animcycle_ids[i],cur_level.animcycles));
    }
    var wildcard;
    for(var k = 0; k < room.wildcards.length; k++)
    {
      wildcard = room.wildcards[k];
      self.load_animcycle_inst(wildcard.animcycle_inst);
      self.load_animcycle_inst(wildcard.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(wildcard.hover_icon_animcycle_inst);
      self.load_animcycle_inst(wildcard.notice_icon_animcycle_inst);
      for(var i = 0; i < wildcard.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(wildcard.deck_animcycle_ids[i],cur_level.animcycles));
    }
    var cutscene;
    for(var k = 0; k < room.cutscenes.length; k++)
    {
      cutscene = room.cutscenes[k];
      self.load_animcycle_inst(cutscene.animcycle_inst);
      self.load_animcycle_inst(cutscene.hover_cursor_animcycle_inst);
      self.load_animcycle_inst(cutscene.hover_icon_animcycle_inst);
      self.load_animcycle_inst(cutscene.notice_icon_animcycle_inst);
      for(var l = 0; l < cutscene.commands.length; l++)
        if(cutscene.commands[l].animcycle_id && cutscene.commands[l].animcycle_id != "null") self.load_animcycle(find_animcycle(cutscene.commands[l].animcycle_id,cur_level.animcycles));
      for(var i = 0; i < cutscene.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(cutscene.deck_animcycle_ids[i],cur_level.animcycles));
    }
    var inert;
    for(var k = 0; k < room.inerts.length; k++)
    {
      inert = room.inerts[k];
      self.load_animcycle_inst(inert.animcycle_inst);
      for(var i = 0; i < room.deck_animcycle_ids.length; i++)
        self.load_animcycle(find_animcycle(room.deck_animcycle_ids[i],cur_level.animcycles));
    }
  }

  self.unlock_content = function()
  {
    self.loading_animcycle_inst = 0;
    for(var i = cur_level.loading_animcycle_ids.length-1; !self.loading_animcycle_inst && i >= 0; i--)
    {
      if(!cur_level.loading_animcycle_reqs[i] || queryreqs(cur_level, cur_level.loading_animcycle_reqs[i]))
        self.loading_animcycle_inst = gen_animcycle_inst(cur_level.loading_animcycle_ids[i], cur_level.animcycles);
    }
  }

  self.tick = function()
  {
    if(self.loading_animcycle_inst) self.loading_animcycle_inst.tick();
  }

  self.draw = function()
  {
    if(self.loading_animcycle_inst)
      ctx.drawImage(self.loading_animcycle_inst.img,0,0,canv.width,canv.height);
    else
    {
      ctx.fillStyle = black;
      ctx.fillRect(0,0,canv.width,canv.height);
    }
    if(self.loading)
    {
      ctx.fillStyle = white;
      ctx.fillText("loading...",canv.width-100,canv.height-20);
    }
  }
}

var music = function()
{
  var self = this;
  self.t = 0;
  self.t_max = 100;
  self.cur_music = 0;
  self.next_music = 0;

  self.consume_music = function(music)
  {
    if(self.cur_music && self.cur_music.id == music.id) //already playing
    {
      self.next_music = 0;
      return;
    }
    if(self.next_music && self.next_music.id == music.id) return; //already transitioning

    if(self.next_music) //mid transition- pretend next music = cur_music that's been playing for a while
    {
      if(self.cur_music && !self.cur_music.aud.paused) self.cur_music.aud.pause();
      self.cur_music = self.next_music;
      if(self.cur_music.aud.paused && AUDIO) playHandlePromise(self.cur_music.aud,1);
    }
    self.next_music = music;
    self.next_music.aud.loop = true;
    self.t = 0;
  }

  self.tick = function()
  {
    if(self.t >= self.t_max) return;

    if(self.next_music)
    {
      self.t++;
      if(self.t >= self.t_max)
      {
        if(self.cur_music && !self.cur_music.aud.paused) self.cur_music.aud.pause();
        self.cur_music = self.next_music;
        self.next_music = 0;
        self.t = 0;
        if(self.cur_music && self.cur_music.aud.paused && AUDIO) { self.cur_music.aud.volume = 0; playHandlePromise(self.cur_music.aud,1); }
      }
      else if(self.cur_music && !self.cur_music.aud.paused) self.cur_music.aud.volume = 1-(self.t/self.t_max);
    }
    else
    {
      self.t++;
      if(self.t >= self.t_max) self.t = self.t_max;
      if(self.cur_music && !self.cur_music.aud.paused) self.cur_music.aud.volume = self.t/self.t_max;
    }
  }
}

var cursor = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.known_x = 0;
  self.known_y = 0;
  self.mode_prev = CURSOR_NULL;
  self.mode = CURSOR_NULL;
  self.icon_o;
  self.cursor_o;
  self.ripple_wx = 0;
  self.ripple_wy = 0;
  self.ripple_x = 0;
  self.ripple_y = 0;

  self.ui_animcycle_inst;
  self.ripple_animcycle_inst;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
  }
  self.resize();

  self.consume_level = function(level)
  {
    self.ui_animcycle_inst     = gen_animcycle_inst(level.ui_hover_animcycle_id, level.animcycles);
    self.ripple_animcycle_inst = gen_animcycle_inst(level.ripple_click_animcycle_id, level.animcycles);
  }

  self.ripple = function(x,y)
  {
    self.ripple_x = x;
    self.ripple_y = y;
    self.ripple_wx = worldSpaceXpt(my_camera,canv,self.ripple_x);
    self.ripple_wy = worldSpaceYpt(my_camera,canv,self.ripple_y);
    self.ripple_animcycle_inst.frame_i = 0;
    self.ripple_animcycle_inst.frame_t = 2;
  }

  self.hover = function(evt)
  {
    self.known_x = evt.doX;
    self.known_y = evt.doY;
  }
  self.unhover = function(evt)
  {
  }

  self.tick = function()
  {
    if(self.mode != self.mode_prev)
    {
      if(self.mode_prev == CURSOR_NORMAL && !my_keyable.e) canvas.style.cursor = 'none';
      if(self.mode      == CURSOR_NORMAL)                  canvas.style.cursor = 'auto';
      self.mode_prev = self.mode;
    }

         if(self.mode == CURSOR_O && self.cursor_o) self.cursor_o.hover_cursor_animcycle_inst.tick();
    else if(self.mode == CURSOR_UI) self.ui_animcycle_inst.tick();
    if(self.icon_o) self.icon_o.hover_icon_animcycle_inst.tick();

    if(self.ripple_animcycle_inst.frame_i || self.ripple_animcycle_inst.frame_t > 1)
    {
      self.ripple_x = screenSpaceXpt(my_camera,canv,self.ripple_wx);
      self.ripple_y = screenSpaceYpt(my_camera,canv,self.ripple_wy);
      self.ripple_animcycle_inst.tick();
    }
  }

  self.draw = function()
  {
    if(self.ripple_animcycle_inst.frame_i || self.ripple_animcycle_inst.frame_t > 1)
      ctx.drawImage(self.ripple_animcycle_inst.img, self.ripple_x-100, self.ripple_y-100, 200, 200);

    var w;
    var h;
    var hw;
    var hh;
    if(self.mode == CURSOR_O && (!DEBUG || !my_keyable.e))
    {
      w = cur_level.cursor_w;
      h = cur_level.cursor_h;
      hw = cur_level.cursor_w/2;
      hh = cur_level.cursor_h/2;
      ctx.drawImage(self.cursor_o.hover_cursor_animcycle_inst.img, self.known_x-hw,self.known_y-hh,w,h)
    }
    else if(self.mode == CURSOR_UI && (!DEBUG || !my_keyable.e))
    {
      w = cur_level.cursor_w;
      h = cur_level.cursor_h;
      hw = cur_level.cursor_w/2;
      hh = cur_level.cursor_h/2;
      ctx.drawImage(self.ui_animcycle_inst.img, self.known_x-hw,self.known_y-hh,w,h)
    }
    if(self.icon_o && (!DEBUG || !my_keyable.e))
    {
      w = cur_level.hover_w;
      h = cur_level.hover_h;
      hw = cur_level.hover_w/2;
      hh = cur_level.hover_h/2;
      self.icon_o.hover_icon_x =  screenSpaceW(my_camera,canv,self.icon_o.hover_icon_wx);
      self.icon_o.hover_icon_y = -screenSpaceH(my_camera,canv,self.icon_o.hover_icon_wy);
      ctx.drawImage(self.icon_o.hover_icon_animcycle_inst.img, self.icon_o.x+self.icon_o.w/2+self.icon_o.hover_icon_x-hw, self.icon_o.y+self.icon_o.h/2+self.icon_o.hover_icon_y-hh, w, h);
    }
  }
}

var avatar = function()
{
  var self = this;
  self.wx = 0;
  self.wy = 0;
  self.ww = 85;
  self.wh = 200;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.to_wx = self.wx;
  self.to_wy = self.wy;

  self.shade = 0;

  self.state = AVATAR_IDLE;
  self.anim = new animation();
  self.anim.frame_delay = 10;

  self.idle_animcycle = null_animcycle;
  self.walk_animcycle = null_animcycle;
  self.act_animcycle  = null_animcycle;

  self.stack_animcycle_t;
  self.stack_animcycle_inst;

  self.resize = function()
  {

  }
  self.resize();

  self.anim.transition = function()
  {
    switch(self.anim.cur_anim)
    {
      case ANIM_IDLE:
      break;
      case ANIM_WALK:
      break;
      case ANIM_ACT:
      {
        cur_act = my_navigable.selected_act;
        state_from = state_cur;
        state_cur = STATE_TRANSITION;
        my_loader.unlock_content();
        switch(cur_act.act)
        {
          case ACT_PERSON:      state_to = STATE_PERSON;      my_personview.consume_person(cur_act);           if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_OBJECT:      state_to = STATE_OBJECT;      my_objectview.consume_object(cur_act);           if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_OBSERVATION: state_to = STATE_OBSERVATION; my_observationview.consume_observation(cur_act); if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_PORTHOLE:
          {
            if(cur_act.target_room_found)
            {
              state_to = state_stack;
              if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud);
            }
            else //go to map
            {
              my_navigable.selected_act = 0;
              state_to = STATE_MAP;
              my_mapview.unlock_content();
              if(AUDIO) playHandlePromise(get_audio(cur_level.map_audio_id,cur_level.audios).aud);
            }
          }
          break;
          case ACT_WILDCARD: state_to = STATE_WILDCARD; my_wildcardview.consume_wildcard(cur_act); if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_CUTSCENE:
          {
            state_stack = STATE_CUTSCENE;
            state_to = state_stack;
            my_cutsceneview.consume_cutscene(cur_act);
          }
          break;
          case ACT_INERT: /*do nothing*/; break;
        }
        state_t = 0;
        my_navigable.selected_act = 0;
        my_cursor.mode = CURSOR_NORMAL;
        my_cursor.cursor_o = 0;
        my_cursor.icon_o = 0;
      }
      break;
      default:
      break;
    }

    if(self.anim.anim_queue.length) //has queue
    {
      self.anim.cur_anim = self.anim.anim_queue[0];
      self.anim.anim_queue.splice(0,1);
      self.anim.cur_anim_i = 0;
    }
    else //no queue
    {
      switch(self.anim.cur_anim)
      {
        case ANIM_IDLE:
          self.anim.cur_anim_i = 0; //repeat
        break;
        case ANIM_WALK:
          if(self.state != AVATAR_WALK) self.anim.cur_anim = ANIM_IDLE;
          self.anim.cur_anim_i = 0; //idle
        break;
        case ANIM_ACT:
          self.anim.cur_anim = ANIM_IDLE;
          self.anim.cur_anim_i = 0;
        break;
        default:
          self.anim.cur_anim = ANIM_IDLE; //revert
          self.anim.cur_anim_i = 0;
        break;
      }
    }
  }

  self.consume_level = function(level)
  {
    self.ww = level.avatar_ww;
    self.wh = level.avatar_wh;

    self.idle_animcycle = null_animcycle;
    self.walk_animcycle = null_animcycle;
    self.act_animcycle  = null_animcycle;
    for(var i = 0; i < level.animcycles.length; i++)
    {
      if(level.animcycles[i].id == level.avatar_idle_animcycle_id) self.idle_animcycle = level.animcycles[i];
      if(level.animcycles[i].id == level.avatar_walk_animcycle_id) self.walk_animcycle = level.animcycles[i];
      if(level.animcycles[i].id == level.avatar_act_animcycle_id)  self.act_animcycle  = level.animcycles[i];
    }
    self.anim.src = [];
    for(var i = 0; i < self.idle_animcycle.frames.length; i++) self.anim.src.push(self.idle_animcycle.frames[i]);
    for(var i = 0; i < self.walk_animcycle.frames.length; i++) self.anim.src.push(self.walk_animcycle.frames[i]);
    for(var i = 0; i < self.act_animcycle.frames.length; i++)  self.anim.src.push(self.act_animcycle.frames[i]);
    self.anim.animations[ANIM_NULL] = []; self.anim.animations[ANIM_NULL].push(0);
    var j = 0;
    self.anim.animations[ANIM_IDLE] = []; for(var i = j; i < j+self.idle_animcycle.frames.length; i++) self.anim.animations[ANIM_IDLE].push(i);
    j += self.idle_animcycle.frames.length;
    self.anim.animations[ANIM_WALK] = []; for(var i = j; i < j+self.walk_animcycle.frames.length; i++) self.anim.animations[ANIM_WALK].push(i);
    j += self.walk_animcycle.frames.length;
    self.anim.animations[ANIM_ACT]  = []; for(var i = j; i < j+self.act_animcycle.frames.length; i++)  self.anim.animations[ANIM_ACT].push(i);
    j += self.act_animcycle.frames.length;
  }

  self.consume_room = function(room)
  {
    my_navigable.wpt_in_navigable(room.target_start_wx,room.target_start_wy,self);
    self.to_wx = self.wx;
    self.to_wy = self.wy;

    my_real_camera.wx = my_navigable.cam_target_wx(self.wx);
    my_real_camera.wy = my_navigable.cam_target_wy(self.wy);
  }

  self.from_porthole = function(porthole)
  {
    my_navigable.wpt_in_navigable(porthole.target_start_wx,porthole.target_start_wy,self);
    self.to_wx = self.wx;
    self.to_wy = self.wy;

    my_real_camera.wx = my_navigable.cam_target_wx(self.wx);
    my_real_camera.wy = my_navigable.cam_target_wy(self.wy);
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
    self.dragStart = function(evt)
  {
    self.edit_o = self;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;

    cur_level.dirty = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    worldSpace(my_camera,canv,self.edit_o);
    //propagate to level
    cur_level.avatar_ww = self.edit_o.ww;
    cur_level.avatar_wh = self.edit_o.wh;
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.click = function(evt)
  {

  }

  self.tick = function()
  {
    var speed = walk_speed;
    var act_dist = 10;

    var wdx = self.to_wx-self.wx;
    var wdy = self.to_wy-self.wy;
    var wd = wdx*wdx+wdy*wdy;
    if(wdx >  speed) { wdx =  speed; self.anim.flip = 0; }
    if(wdx < -speed) { wdx = -speed; self.anim.flip = 1; }
    if(wdy >  speed) { wdy =  speed;                     }
    if(wdy < -speed) { wdy = -speed;                     }

    if(!DEBUG || !my_keyable.e)
    {
      self.wx += wdx;
      self.wy += wdy;
    }

    switch(self.anim.cur_anim)
    {
      case ANIM_IDLE: self.anim.frame_delay = self.idle_animcycle.frame_t; break;
      case ANIM_WALK: self.anim.frame_delay = self.walk_animcycle.frame_t; break;
      case ANIM_ACT:  self.anim.frame_delay = self.act_animcycle.frame_t;  break;
    }

    if(wd > act_dist)
    {
      if(self.state != AVATAR_WALK)
        self.anim.swapAnim(ANIM_WALK);
      if(self.stack_animcycle_t) self.stack_animcycle_t = 0;
      self.state = AVATAR_WALK;
    }
    else if(wd <= act_dist)
    {
      if(my_navigable.selected_act)
      {
        if(my_avatar.state != AVATAR_ACT)
        {
          my_avatar.state = AVATAR_ACT;
          my_avatar.anim.injectAnim(ANIM_ACT);
          var dir = my_navigable.selected_act.wx - self.wx;
               if(dir >  2) self.anim.flip = 0;
          else if(dir < -2) self.anim.flip = 1;

          if(!my_navigable.selected_act.act_anim) self.anim.transition();
        }
      }
      else
      {
        my_avatar.state = AVATAR_IDLE;
        if(my_avatar.anim.cur_anim != AVATAR_IDLE) my_avatar.anim.injectAnim(ANIM_IDLE);
      }
    }

    self.anim.tick();
    screenSpace(my_camera, canv, self);
  }

  var shading_canv = GenIcon(canv.width,canv.height);
  var done = 0;
  self.draw = function(shading,light_color,shadow_color,ambient_color)
  {
    if(QUALITY && false) //&&false disables lighting- mostly unused
    {
      self.shade = lerp(self.shade,shading,0.02);

      shading_canv.context.globalCompositeOperation = "source-over";
      var b = 10;
      shading_canv.context.clearRect(self.x-b,self.y-b,self.w+2*b,self.h+2*b);

      var img = self.anim.src[self.anim.animations[self.anim.cur_anim][self.anim.cur_anim_i]];
      shading_canv.context.save();
      shading_canv.context.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) shading_canv.context.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        shading_canv.context.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        shading_canv.context.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      shading_canv.context.restore();

      if(self.shade > 0.01)
      {
        shading_canv.context.globalAlpha = self.shade;
        shading_canv.context.fillStyle = light_color;
        shading_canv.context.fillRect(self.x,self.y,self.w,self.h);
        shading_canv.context.globalAlpha = 1-self.shade;
      }
      else if(self.shade < -0.01)
      {
        shading_canv.context.globalAlpha = -self.shade;
        shading_canv.context.fillStyle = shadow_color;
        shading_canv.context.fillRect(self.x,self.y,self.w,self.h);
        shading_canv.context.globalAlpha = 1+self.shade;
      }
      shading_canv.context.fillStyle = ambient_color;
      shading_canv.context.fillRect(self.x,self.y,self.w,self.h);

      shading_canv.context.globalCompositeOperation = "destination-in";
      shading_canv.context.globalAlpha = 1;
      shading_canv.context.save();
      shading_canv.context.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) shading_canv.context.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        shading_canv.context.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        shading_canv.context.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      shading_canv.context.restore();

      ctx.drawImage(shading_canv,self.x,self.y,self.w,self.h,self.x,self.y,self.w,self.h);
    }
    else
    {
      var img = self.anim.src[self.anim.animations[self.anim.cur_anim][self.anim.cur_anim_i]];
      ctx.save();
      ctx.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) ctx.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        ctx.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        ctx.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      ctx.restore();
    }

    if(DEBUG)
    {
      ctx.strokeStyle = black;
      ctx.strokeRect(self.x,self.y,self.w,self.h);
    }
  }
};

var familiar = function()
{
  var self = this;
  self.wx = 0;
  self.wy = 0;
  self.ww = 85;
  self.wh = 200;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.available = 0;
  self.shade = 0;

  self.state = FAMILIAR_IDLE;
  self.anim = new animation();
  self.anim.frame_delay = 10;

  self.idle_animcycle = null_animcycle;
  self.walk_animcycle = null_animcycle;
  self.act_animcycle  = null_animcycle;

  self.stack_animcycle_t;
  self.stack_animcycle_inst;

  self.resize = function()
  {

  }
  self.resize();

  self.anim.transition = function()
  {
    if(self.anim.anim_queue.length) //has queue
    {
      self.anim.cur_anim = self.anim.anim_queue[0];
      self.anim.anim_queue.splice(0,1);
      self.anim.cur_anim_i = 0;
    }
    else //no queue
    {
      switch(self.anim.cur_anim)
      {
        case ANIM_IDLE:
          self.anim.cur_anim_i = 0; //repeat
        break;
        case ANIM_WALK:
          if(self.state != FAMILIAR_WALK) self.anim.cur_anim = ANIM_IDLE;
          self.anim.cur_anim_i = 0; //idle
        break;
        case ANIM_ACT:
          self.anim.cur_anim = ANIM_IDLE;
          self.anim.cur_anim_i = 0;
        break;
        default:
          self.anim.cur_anim = ANIM_IDLE; //revert
          self.anim.cur_anim_i = 0;
        break;
      }
    }
  }

  self.consume_level = function(level)
  {
    self.ww = level.familiar_ww;
    self.wh = level.familiar_wh;

    self.idle_animcycle = null_animcycle;
    self.walk_animcycle = null_animcycle;
    self.act_animcycle  = null_animcycle;
    for(var i = 0; i < level.animcycles.length; i++)
    {
      if(level.animcycles[i].id == level.familiar_idle_animcycle_id) self.idle_animcycle = level.animcycles[i];
      if(level.animcycles[i].id == level.familiar_walk_animcycle_id) self.walk_animcycle = level.animcycles[i];
      if(level.animcycles[i].id == level.familiar_act_animcycle_id)  self.act_animcycle  = level.animcycles[i];
    }
    self.anim.src = [];
    for(var i = 0; i < self.idle_animcycle.frames.length; i++) self.anim.src.push(self.idle_animcycle.frames[i]);
    for(var i = 0; i < self.walk_animcycle.frames.length; i++) self.anim.src.push(self.walk_animcycle.frames[i]);
    for(var i = 0; i < self.act_animcycle.frames.length; i++)  self.anim.src.push(self.act_animcycle.frames[i]);
    self.anim.animations[ANIM_NULL] = []; self.anim.animations[ANIM_NULL].push(0);
    var j = 0;
    self.anim.animations[ANIM_IDLE] = []; for(var i = j; i < j+self.idle_animcycle.frames.length; i++) self.anim.animations[ANIM_IDLE].push(i);
    j += self.idle_animcycle.frames.length;
    self.anim.animations[ANIM_WALK] = []; for(var i = j; i < j+self.walk_animcycle.frames.length; i++) self.anim.animations[ANIM_WALK].push(i);
    j += self.walk_animcycle.frames.length;
    self.anim.animations[ANIM_ACT]  = []; for(var i = j; i < j+self.act_animcycle.frames.length; i++)  self.anim.animations[ANIM_ACT].push(i);
    j += self.act_animcycle.frames.length;
  }

  self.consume_room = function(room)
  {
    my_navigable.wpt_in_navigable(room.target_start_wx,room.target_start_wy,self);
  }

  self.from_porthole = function(porthole)
  {
    my_navigable.wpt_in_navigable(porthole.target_start_wx,porthole.target_start_wy,self);
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
    self.dragStart = function(evt)
  {
    self.edit_o = self;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;

    cur_level.dirty = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    worldSpace(my_camera,canv,self.edit_o);
    //propagate to level
    cur_level.familiar_ww = self.edit_o.ww;
    cur_level.familiar_wh = self.edit_o.wh;
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.click = function(evt)
  {

  }

  self.tick = function()
  {
    var speed = walk_speed/1.5;
    var act_dist = 10;
    var hug_dist = 100;
    var stable_dist = 200;

    var wdx = my_avatar.wx+cur_level.familiar_off_wx-self.wx;
    var wdy = my_avatar.wy+cur_level.familiar_off_wy-self.wy;
    if(self.state == FAMILIAR_WALK)
    {
      var l = sqrt(wdx*wdx+wdy+wdy);
      if(l > hug_dist)
      {
        wdx = wdx/l*hug_dist;
        wdy = wdy/l*hug_dist;
      }
      else
      {
        wdx = 0;
        wdy = 0;
      }
    }
    else
    {
      var l = sqrt(wdx*wdx+wdy+wdy);
      if(l > stable_dist)
      {
        wdx = wdx/l*stable_dist;
        wdy = wdy/l*stable_dist;
      }
      else
      {
        wdx = 0;
        wdy = 0;
      }
    }
    var wd = wdx*wdx+wdy*wdy;
    if(wdx >  speed) wdx =  speed;
    if(wdx < -speed) wdx = -speed;
    if(wdy >  speed) wdy =  speed;
    if(wdy < -speed) wdy = -speed;
    if(wdx > 0) self.anim.flip = 0;
    if(wdx < 0) self.anim.flip = 1;

    if(!DEBUG || !my_keyable.e)
    {
      self.wx += wdx;
      self.wy += wdy;
    }

    switch(self.anim.cur_anim)
    {
      case ANIM_IDLE: self.anim.frame_delay = self.idle_animcycle.frame_t; break;
      case ANIM_WALK: self.anim.frame_delay = self.walk_animcycle.frame_t; break;
      case ANIM_ACT:  self.anim.frame_delay = self.act_animcycle.frame_t;  break;
    }

    if(wd > act_dist)
    {
      if(self.state != FAMILIAR_WALK)
        self.anim.swapAnim(ANIM_WALK);
      self.state = FAMILIAR_WALK;
    }
    else if(wd <= act_dist)
    {
      if(my_navigable.selected_act)
      {
        if(my_familiar.state != FAMILIAR_ACT)
        {
          my_familiar.state = FAMILIAR_ACT;
          my_familiar.anim.injectAnim(ANIM_ACT);
          var dir = my_navigable.selected_act.wx - self.wx;
               if(dir >  2) self.anim.flip = 0;
          else if(dir < -2) self.anim.flip = 1;

          if(!my_navigable.selected_act.act_anim) self.anim.transition();
        }
      }
      else
      {
        my_familiar.state = FAMILIAR_IDLE;
        if(my_familiar.anim.cur_anim != FAMILIAR_IDLE) my_familiar.anim.injectAnim(ANIM_IDLE);
      }
    }

    self.anim.tick();
    screenSpace(my_camera, canv, self);
  }

  var shading_canv = GenIcon(canv.width,canv.height);
  var done = 0;
  self.draw = function(shading,light_color,shadow_color,ambient_color)
  {
    if(QUALITY && false) //&&false disables lighting- mostly unused
    {
      self.shade = lerp(self.shade,shading,0.02);

      shading_canv.context.globalCompositeOperation = "source-over";
      var b = 10;
      shading_canv.context.clearRect(self.x-b,self.y-b,self.w+2*b,self.h+2*b);

      var img = self.anim.src[self.anim.animations[self.anim.cur_anim][self.anim.cur_anim_i]];
      shading_canv.context.save();
      shading_canv.context.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) shading_canv.context.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        shading_canv.context.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        shading_canv.context.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      shading_canv.context.restore();

      if(self.shade > 0.01)
      {
        shading_canv.context.globalAlpha = self.shade;
        shading_canv.context.fillStyle = light_color;
        shading_canv.context.fillRect(self.x,self.y,self.w,self.h);
        shading_canv.context.globalAlpha = 1-self.shade;
      }
      else if(self.shade < -0.01)
      {
        shading_canv.context.globalAlpha = -self.shade;
        shading_canv.context.fillStyle = shadow_color;
        shading_canv.context.fillRect(self.x,self.y,self.w,self.h);
        shading_canv.context.globalAlpha = 1+self.shade;
      }
      shading_canv.context.fillStyle = ambient_color;
      shading_canv.context.fillRect(self.x,self.y,self.w,self.h);

      shading_canv.context.globalCompositeOperation = "destination-in";
      shading_canv.context.globalAlpha = 1;
      shading_canv.context.save();
      shading_canv.context.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) shading_canv.context.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        shading_canv.context.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        shading_canv.context.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      shading_canv.context.restore();

      ctx.drawImage(shading_canv,self.x,self.y,self.w,self.h,self.x,self.y,self.w,self.h);
    }
    else
    {
      var img = self.anim.src[self.anim.animations[self.anim.cur_anim][self.anim.cur_anim_i]];
      ctx.save();
      ctx.translate(self.x+self.w/2,self.y+self.h/2);
      if(self.anim.flip) ctx.scale(-1,1);
      if(self.stack_animcycle_t)
      {
        ctx.drawImage(self.stack_animcycle_inst.img,-self.w/2,-self.h/2,self.w,self.h);
        self.stack_animcycle_t--;
      }
      else
        ctx.drawImage(img,-self.w/2,-self.h/2,self.w,self.h);
      ctx.restore();
    }

    if(DEBUG)
    {
      ctx.strokeStyle = black;
      ctx.strokeRect(self.x,self.y,self.w,self.h);
    }
  }
};

var null_audio;
var get_audio = function(id,audios)
{
  var audio = null_audio;
  for(var i = 0; i < audios.length; i++)
    if(audios[i].id == id) audio = audios[i];
  return audio;
}

var null_animcycle;
var gen_animcycle_inst = function(id,animcycles)
{
  var animcycle = find_animcycle(id,animcycles);
  var inst = new animcycle_inst();
  inst.animcycle = animcycle;
  inst.ready();
  inst.img = animcycle.frames[inst.frame_i];
  return inst;
}

var animcycle_inst = function()
{
  var self = this;
  self.animcycle;
  self.frame_t;
  self.frame_i;
  self.img;
  self.tick = function()
  {
    self.frame_t++;
    while(self.frame_t > self.animcycle.frame_t)
    {
      self.frame_t -= self.animcycle.frame_t;
      if(self.animcycle.loop) self.frame_i = (self.frame_i+1)%self.animcycle.frames.length;
      else                    self.frame_i = min(self.animcycle.frames.length-1,self.frame_i+1);
      self.img = self.animcycle.frames[self.frame_i];
    }
  }
  self.ready = function()
  {
    self.frame_t = self.animcycle.offset_t-1;
    self.frame_i = 0;
    self.tick();
    self.img = self.animcycle.frames[self.frame_i];
  }
}

var navigable = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.room;
  self.selected_act = 0;
  self.last_click = {x:0,y:0,wx:0,wy:0};
  self.nav_click = {x:0,y:0,wx:0,wy:0};
  self.cache_available_persons      = [];
  self.cache_available_objects      = [];
  self.cache_available_observations = [];
  self.cache_available_portholes    = [];
  self.cache_available_wildcards    = [];
  self.cache_available_cutscenes    = [];
  self.cache_available_inerts       = [];
  self.cache_available_drawables    = [];

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
    if(my_real_camera && self.room)
    {
      my_real_camera.wh = self.room.cam_wh;
      my_real_camera.ww = canv.width*self.room.cam_wh/canv.height;
      my_debug_camera.ww = self.room.ww*1.2;
      my_debug_camera.wh = self.room.wh*1.2;
      if(my_debug_camera.ww/my_debug_camera.wh > canv.width/canv.height)
        my_debug_camera.wh = canv.height*my_debug_camera.ww/canv.width;
      else
        my_debug_camera.ww = canv.width*my_debug_camera.wh/canv.height;
    }
  }
  self.resize();

  self.consume_room = function(room)
  {
    self.room = room;
    if(self.room.notifications.length && queryreqs(self.room, self.room.notification_reqs)) my_notificationview.consume_notification(self.room);
    self.room.pre_met = true;
    self.room.met = true;
    self.unlock_content();
    self.selected_act = 0;
    my_real_camera.wx = 0;
    my_real_camera.wy = 0;
    my_real_camera.wh = room.cam_wh;
    my_real_camera.ww = canv.width*room.cam_wh/canv.height;
    my_debug_camera.ww = room.ww*1.2;
    my_debug_camera.wh = room.wh*1.2;
    if(my_debug_camera.ww/my_debug_camera.wh > canv.width/canv.height)
      my_debug_camera.wh = canv.height*my_debug_camera.ww/canv.width;
    else
      my_debug_camera.ww = canv.width*my_debug_camera.wh/canv.height;
    my_music.consume_music(get_audio(self.room.audio_id,cur_level.audios));
    gtag('event', 'room_view', { room: self.room.fqid });
  }

  self.unlock_content = function()
  {
    self.cache_available_persons      = [];
    self.cache_available_objects      = [];
    self.cache_available_observations = [];
    self.cache_available_portholes    = [];
    self.cache_available_wildcards    = [];
    self.cache_available_cutscenes    = [];
    self.cache_available_inerts       = [];

    self.cache_available_drawables    = [];
    self.cache_available_bg_drawables = [];
    self.cache_available_fg_drawables = [];

    var o;
    for(var i = 0; i < self.room.persons.length; i++)
      if(self.room.persons[i].available = queryreqs(self.room.persons[i], self.room.persons[i].reqs))
      {
        o = self.room.persons[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_persons.push(o);
      }
    for(var i = 0; i < self.room.objects.length; i++)
      if(self.room.objects[i].available = queryreqs(self.room.objects[i], self.room.objects[i].reqs))
      {
        o = self.room.objects[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_objects.push(o);
      }
    for(var i = 0; i < self.room.observations.length; i++)
      if(self.room.observations[i].available = queryreqs(self.room.observations[i], self.room.observations[i].reqs))
      {
        o = self.room.observations[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_observations.push(o);
      }
    for(var i = 0; i < self.room.portholes.length; i++)
      if(self.room.portholes[i].available = queryreqs(self.room.portholes[i], self.room.portholes[i].reqs))
      {
        o = self.room.portholes[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_portholes.push(o);
      }
    for(var i = 0; i < self.room.wildcards.length; i++)
      if(self.room.wildcards[i].available = queryreqs(self.room.wildcards[i], self.room.wildcards[i].reqs))
      {
        o = self.room.wildcards[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_wildcards.push(o);
      }
    for(var i = 0; i < self.room.cutscenes.length; i++)
      if(self.room.cutscenes[i].trigger == CUTSCENE_TRIGGER_ACT && (self.room.cutscenes[i].available = queryreqs(self.room.cutscenes[i], self.room.cutscenes[i].reqs)))
      {
        o = self.room.cutscenes[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_cutscenes.push(o);
      }
    for(var i = 0; i < self.room.inerts.length; i++)
      if(self.room.inerts[i].available = queryreqs(self.room.inerts[i], self.room.inerts[i].reqs))
      {
        o = self.room.inerts[i];
        self.cache_available_inerts.push(o);
      }

    //insertion sort on each list
    for(var i = 0; i < self.cache_available_persons.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_persons[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_persons[i]); }
    for(var i = 0; i < self.cache_available_objects.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_objects[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_objects[i]); }
    for(var i = 0; i < self.cache_available_observations.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_observations[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_observations[i]); }
    for(var i = 0; i < self.cache_available_portholes.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_portholes[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_portholes[i]); }
    for(var i = 0; i < self.cache_available_wildcards.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_wildcards[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_wildcards[i]); }
    for(var i = 0; i < self.cache_available_cutscenes.length; i++)
    { var j = 0; while(j < self.cache_available_drawables.length && self.cache_available_cutscenes[i].wz >= self.cache_available_drawables[j].wz) j++; self.cache_available_drawables.splice(j,0,self.cache_available_cutscenes[i]); }
    for(var i = 0; i < self.cache_available_inerts.length; i++)
    {
    if(self.cache_available_inerts[i].g < 0)
    { var j = 0; while(j < self.cache_available_bg_drawables.length && self.cache_available_inerts[i].wz >= self.cache_available_bg_drawables[j].wz) j++; self.cache_available_bg_drawables.splice(j,0,self.cache_available_inerts[i]); }
    else if(self.cache_available_inerts[i].g > 0)
    { var j = 0; while(j < self.cache_available_fg_drawables.length && self.cache_available_inerts[i].wz >= self.cache_available_fg_drawables[j].wz) j++; self.cache_available_fg_drawables.splice(j,0,self.cache_available_inerts[i]); }
    else
    { var j = 0; while(j < self.cache_available_drawables.length    && self.cache_available_inerts[i].wz >= self.cache_available_drawables[j].wz)    j++; self.cache_available_drawables.splice(j,0,self.cache_available_inerts[i]); }
    }

    //familiar
    my_familiar.available = queryreqs(0,cur_level.familiar_reqs);
  }

  self.trigger_cutscenes = function()
  {
    if(state_cur == STATE_NAV || (state_cur == STATE_TRANSITION && state_to == STATE_NAV)) //can only trigger from w/in nav
    {
      for(var i = 0; i < cur_room.cutscenes.length; i++)
      {
        var cutscene = cur_room.cutscenes[i];
        if(!cutscene.pre_met && cutscene.trigger == CUTSCENE_TRIGGER_AUTO && (cutscene.available = queryreqs(cutscene, cutscene.reqs)))
        {
          if(state_cur == STATE_NAV)
          {
            cur_act = cutscene;
            state_from = state_cur;
            state_cur = STATE_TRANSITION;
            my_loader.unlock_content();
            state_stack = STATE_CUTSCENE;
            state_to = state_stack;
            my_cutsceneview.consume_cutscene(cur_act);
            state_t = 0;
          }
          else if(state_cur == STATE_TRANSITION)
          {
            cur_act = cutscene;
            state_cur = STATE_TRANSITION;
            my_loader.unlock_content();
            state_stack = STATE_CUTSCENE;
            state_to = state_stack;
            my_cutsceneview.consume_cutscene(cur_act);
            state_t = 0.5;
          }
        }
      }
    }
  }

  self.wpt_in_navigable = function(wx,wy,obj)
  {
    var try_wx;
    var try_wy;
    var try_dist;
    var dist = 9999999;
    obj.wx = 9999999;
    obj.wy = 9999999;
    if(!self.room.navs.length)
    {
      dist = 0;
      obj.wx = wx;
      obj.wy = wy;
    }
    for(var i = 0; dist > 0 && i < self.room.navs.length; i++)
    {
      try_wx = wx;
      try_wy = wy;
      if(wx < self.room.navs[i].wx-self.room.navs[i].ww/2) try_wx = self.room.navs[i].wx-self.room.navs[i].ww/2;
      if(wx > self.room.navs[i].wx+self.room.navs[i].ww/2) try_wx = self.room.navs[i].wx+self.room.navs[i].ww/2;
      if(wy < self.room.navs[i].wy-self.room.navs[i].wh/2) try_wy = self.room.navs[i].wy-self.room.navs[i].wh/2;
      if(wy > self.room.navs[i].wy+self.room.navs[i].wh/2) try_wy = self.room.navs[i].wy+self.room.navs[i].wh/2;
      var trydist = distsqr(try_wx, try_wy, wx, wy);
      if(trydist < dist)
      {
        obj.wx = try_wx;
        obj.wy = try_wy;
        dist = trydist;
      }
    }
  }

  self.pt_shade = function(wx,wy)
  {
    var shade = 0;
    for(var i = 0; i < self.room.lights.length; i++)
      if(worldPtWithinBox(self.room.lights[i],wx,wy)) shade++;
    for(var i = 0; i < self.room.shadows.length; i++)
      if(worldPtWithinBox(self.room.shadows[i],wx,wy)) shade--;
    if(shade > 0) return 1;
    if(shade < 0) return -1;
    return 0;
  }

  self.cam_target_wx = function(wx)
  {
    var xp = smooth(invlerp(self.room.wx-self.room.ww/2, self.room.wx+self.room.ww/2, wx));
    xp = (xp-0.5)*2;
    if(xp > 0)
    {
      xp = 1-xp;
      //xp = pow(xp,1.5);
      xp = 1-xp;
    }
    if(xp < 0)
    {
      xp *= -1;
      xp = 1-xp;
      //xp = pow(xp,1.5);
      xp = 1-xp;
      xp *= -1;
    }
    xp = (xp/2)+0.5;
    var camwd = self.room.ww-my_real_camera.ww;
    return self.room.wx-camwd/2+xp*camwd;
  }

  self.cam_target_wy = function(wy)
  {
    var yp = smooth(invlerp(self.room.wy-self.room.wh/2, self.room.wy+self.room.wh/2, wy));
    var camwd = self.room.wh-my_real_camera.wh;
    return self.room.wy-camwd/2+yp*camwd;
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.act_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.wz = 999999;
    self.act = 0;
    self.consume_act = function(a)
    {
      self.act = a;
      self.x = self.act.x+self.act.w/2+self.act.act_x-2;
      self.y = self.act.y+self.act.h/2+self.act.act_y-2;
      self.w = 4;
      self.h = 4;
      self.act.dirty = true;
    }
    self.edit = function()
    {
      self.w = 4;
      self.h = 4;
      self.act.act_x = (self.x+self.w/2)-(self.act.x+self.act.w/2);
      self.act.act_y = (self.y+self.h/2)-(self.act.y+self.act.h/2);
      self.act.act_wx =  worldSpaceW(my_camera,canv,self.act.act_x);
      self.act.act_wy = -worldSpaceH(my_camera,canv,self.act.act_y);
    }
  })();
  self.hover_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.wz = 999999;
    self.hover = 0;
    self.consume_hover = function(a)
    {
      self.hover = a;
      self.x = self.hover.x+self.hover.w/2+self.hover.hover_icon_x-2;
      self.y = self.hover.y+self.hover.h/2+self.hover.hover_icon_y-2;
      self.w = 4;
      self.h = 4;
      self.hover.dirty = true;
    }
    self.edit = function()
    {
      self.w = 4;
      self.h = 4;
      self.hover.hover_icon_x = (self.x+self.w/2)-(self.hover.x+self.hover.w/2);
      self.hover.hover_icon_y = (self.y+self.h/2)-(self.hover.y+self.hover.h/2);
      self.hover.hover_icon_wx =  worldSpaceW(my_camera,canv,self.hover.hover_icon_x);
      self.hover.hover_icon_wy = -worldSpaceH(my_camera,canv,self.hover.hover_icon_y);
    }
  })();
  self.target_start_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.wz = 999999;
    self.target_start = 0;
    self.consume_target_start = function(a)
    {
      self.target_start = a;
      self.x = self.target_start.target_start_x-2;
      self.y = self.target_start.target_start_y-2;
      self.w = 4;
      self.h = 4;
      self.target_start.dirty = true;
    }
    self.edit = function()
    {
      self.w = 4;
      self.h = 4;
      self.target_start.target_start_x = self.x+self.w/2;
      self.target_start.target_start_y = self.y+self.h/2;
      self.target_start.target_start_wx = worldSpaceXpt(my_camera,canv,self.target_start.target_start_x);
      self.target_start.target_start_wy = worldSpaceYpt(my_camera,canv,self.target_start.target_start_y);
    }
  })();
  self.camera_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.wz = -99999;
    self.consume_camera = function()
    {
      self.x = my_real_camera.x;
      self.y = my_real_camera.y;
      self.w = my_real_camera.w;
      self.h = my_real_camera.h;
    }
    self.edit = function()
    {
      worldSpace(my_debug_camera,canv,self);
      my_real_camera.wh = self.wh;
      my_real_camera.ww = canv.width*self.wh/canv.height;
      self.ww = my_real_camera.ww;
      my_real_camera.wx = self.wx;
      my_real_camera.wy = self.wy;
      screenSpace(my_debug_camera,canv,self);
      my_real_camera.w = self.w;
      my_real_camera.h = self.h;
      my_real_camera.x = self.x;
      my_real_camera.y = self.y;
      cur_room.cam_wh = my_real_camera.wh;
      cur_room.dirty = true;
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;

    for(var i = 0; !self.edit_o && i < self.room.shadows.length; i++) if(ptWithinBox(self.room.shadows[i],evt.doX,evt.doY)) { self.edit_o = self.room.shadows[i]; self.edit_o.wz = -1; self.room.dirty = true; }
    for(var i = 0; !self.edit_o && i < self.room.lights.length;  i++) if(ptWithinBox(self.room.lights[i], evt.doX,evt.doY)) { self.edit_o = self.room.lights[i];  self.edit_o.wz = -1; self.room.dirty = true; }
    for(var i = 0; !self.edit_o && i < self.room.navs.length;    i++) if(ptWithinBox(self.room.navs[i],   evt.doX,evt.doY)) { self.edit_o = self.room.navs[i];    self.edit_o.wz = -1; self.room.dirty = true; }
    if(!self.edit_o && my_camera == my_debug_camera && ptWithinBox(my_real_camera,evt.doX,evt.doY)) { self.edit_o = self.camera_editor; self.camera_editor.consume_camera(); }
    for(var i = 0; i < self.cache_available_persons.length;      i++) { var o = self.cache_available_persons[i];      if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.cache_available_objects.length;      i++) { var o = self.cache_available_objects[i];      if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.cache_available_observations.length; i++) { var o = self.cache_available_observations[i]; if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.cache_available_portholes.length;    i++) { var o = self.cache_available_portholes[i];    if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.cache_available_wildcards.length;    i++) { var o = self.cache_available_wildcards[i];    if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.cache_available_cutscenes.length;    i++) { var o = self.cache_available_cutscenes[i];    if(ptNear(o.x+o.w/2+o.act_x,o.y+o.h/2+o.act_y,10,evt.doX,evt.doY)) { self.edit_o = self.act_editor; self.act_editor.consume_act(o); } }
    for(var i = 0; i < self.room.entry_portholes_found.length;  i++) { var o = self.room.entry_portholes_found[i];  if(ptNear(o.target_start_x,o.target_start_y,  10,evt.doX,evt.doY)) { self.edit_o = self.target_start_editor; self.target_start_editor.consume_target_start(o); } }
                                                                     { var o = self.room;                           if(ptNear(o.target_start_x,o.target_start_y,  10,evt.doX,evt.doY)) { self.edit_o = self.target_start_editor; self.target_start_editor.consume_target_start(o); } }
    for(var i = 0; i < self.cache_available_persons.length;      i++) { var o = self.cache_available_persons[i];      if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }
    for(var i = 0; i < self.cache_available_objects.length;      i++) { var o = self.cache_available_objects[i];      if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }
    for(var i = 0; i < self.cache_available_observations.length; i++) { var o = self.cache_available_observations[i]; if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }
    for(var i = 0; i < self.cache_available_portholes.length;    i++) { var o = self.cache_available_portholes[i];    if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }
    for(var i = 0; i < self.cache_available_wildcards.length;    i++) { var o = self.cache_available_wildcards[i];    if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }
    for(var i = 0; i < self.cache_available_cutscenes.length;    i++) { var o = self.cache_available_cutscenes[i];    if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }

    for(var i = 0; i < self.cache_available_persons.length; i++)
      if(ptWithinBox(self.cache_available_persons[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_persons[i].wz)) { self.edit_o = self.cache_available_persons[i]; self.cache_available_persons[i].dirty = true; }
    for(var i = 0; i < self.cache_available_objects.length; i++)
      if(ptWithinBox(self.cache_available_objects[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_objects[i].wz)) { self.edit_o = self.cache_available_objects[i]; self.cache_available_objects[i].dirty = true; }
    for(var i = 0; i < self.cache_available_observations.length; i++)
      if(ptWithinBox(self.cache_available_observations[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_observations[i].wz)) { self.edit_o = self.cache_available_observations[i]; self.cache_available_observations[i].dirty = true; }
    for(var i = 0; i < self.cache_available_portholes.length; i++)
      if(ptWithinBox(self.cache_available_portholes[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_portholes[i].wz)) { self.edit_o = self.cache_available_portholes[i]; self.cache_available_portholes[i].dirty = true; }
    for(var i = 0; i < self.cache_available_wildcards.length; i++)
      if(ptWithinBox(self.cache_available_wildcards[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_wildcards[i].wz)) { self.edit_o = self.cache_available_wildcards[i]; self.cache_available_wildcards[i].dirty = true; }
    for(var i = 0; i < self.cache_available_cutscenes.length; i++)
      if(ptWithinBox(self.cache_available_cutscenes[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_cutscenes[i].wz)) { self.edit_o = self.cache_available_cutscenes[i]; self.cache_available_cutscenes[i].dirty = true; }
    for(var i = 0; i < self.cache_available_inerts.length; i++)
      if(ptWithinBox(self.cache_available_inerts[i],evt.doX,evt.doY) && (!self.edit_o || self.edit_o.wz < self.cache_available_inerts[i].wz)) { if(SHOW_GROUNDS || self.cache_available_inerts[i].g == 0) self.edit_o = self.cache_available_inerts[i]; self.cache_available_inerts[i].dirty = true; }

    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

         if(self.edit_o == self.act_editor) self.act_editor.edit();
    else if(self.edit_o == self.hover_editor) self.hover_editor.edit();
    else if(self.edit_o == self.target_start_editor) self.target_start_editor.edit();
    else if(self.edit_o == self.camera_editor) self.camera_editor.edit();
    else worldSpace(my_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END
  self.hover = function(evt)
  {
    //log hover navigate
    my_logger.current_hover_info.o_found = false;
    my_cursor.mode = CURSOR_NORMAL;
    my_cursor.cursor_o = 0;
    my_cursor.icon_o = 0;
    var cursor_z = -9999999999999;
    var icon_z = -9999999999999;
    var o;
    var l;
    for(var i = 0; i < 6; i++)
    {
      //poor-mans 0-alloc array
      switch(i)
      {
        case 0: l = self.cache_available_persons; break;
        case 1: l = self.cache_available_objects; break;
        case 2: l = self.cache_available_observations; break;
        case 3: l = self.cache_available_wildcards; break;
        case 4: l = self.cache_available_cutscenes; break;
        case 5: l = self.cache_available_portholes; break;
      }
      for(var j = 0; j < l.length; j++)
      {
        o = l[j];
        if(ptWithinBox(o,evt.doX,evt.doY))
        {
          my_logger.current_hover_info.o_found = true;
          if(!my_logger.current_hover_info.start_time){
            my_logger.current_hover_info.start_time = Date.now(); //acquisition - navigate_hover
            my_logger.current_hover_info.subtype_data = my_logger.get_navigate_subtype_data();
            my_logger.current_hover_info.fqid = o.fqid; //acquisition
          }
          if(o.wz > cursor_z && o.hover_cursor_animcycle_inst.animcycle != null_animcycle) { my_cursor.cursor_o = o; cursor_z = o.wz; my_cursor.mode = CURSOR_O; }
          if(o.wz > icon_z   && o.hover_icon_animcycle_inst.animcycle   != null_animcycle) { my_cursor.icon_o = o;   icon_z = o.wz; }
        }
      }
    }
    if(my_logger.should_log_hover()){
      if(typeof(my_logger.current_hover_info.fqid) != "string" || my_logger.current_hover_info.fqid.includes(my_navigable.room.fqid)){
        my_logger.send_log_data_hover(LOG_SUBTYPE_NAVIGATE);   
      }
      else {
        my_logger.reset_current_hover_log_info();
      }
    }
  }
  self.unhover = function(evt)
  {

  }

  self.click = function(evt)
  {
    //log navigable
    
    
    if(!(DEBUG && my_keyable.e))
    {
      self.last_click.x = evt.doX;
      self.last_click.y = evt.doY;
      self.last_click.wx = worldSpaceXpt(my_camera,canv,evt.doX);
      self.last_click.wy = worldSpaceYpt(my_camera,canv,evt.doY);
      self.nav_click.x = self.last_click.x;
      self.nav_click.y = self.last_click.y;
      self.nav_click.wx = self.last_click.wx;
      self.nav_click.wy = self.last_click.wy;

      self.selected_act = 0;
      for(var i = 0; i < self.cache_available_persons.length; i++)
        if(ptWithinBox(self.cache_available_persons[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_persons[i].wz))
          self.selected_act = self.cache_available_persons[i];
      for(var i = 0; i < self.cache_available_objects.length; i++)
        if(ptWithinBox(self.cache_available_objects[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_objects[i].wz))
          self.selected_act = self.cache_available_objects[i];
      for(var i = 0; i < self.cache_available_observations.length; i++)
        if(ptWithinBox(self.cache_available_observations[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_observations[i].wz))
          self.selected_act = self.cache_available_observations[i];
      for(var i = 0; i < self.cache_available_portholes.length; i++)
        if(ptWithinBox(self.cache_available_portholes[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_portholes[i].wz))
          self.selected_act = self.cache_available_portholes[i];
      for(var i = 0; i < self.cache_available_wildcards.length; i++)
        if(ptWithinBox(self.cache_available_wildcards[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_wildcards[i].wz))
          self.selected_act = self.cache_available_wildcards[i];
      for(var i = 0; i < self.cache_available_cutscenes.length; i++)
        if(ptWithinBox(self.cache_available_cutscenes[i],self.last_click.x,self.last_click.y) && (!self.selected_act || self.selected_act.wz < self.cache_available_cutscenes[i].wz))
          self.selected_act = self.cache_available_cutscenes[i];
    

      var logfqid = (self.selected_act ? self.selected_act.fqid : 0); // acquisition
      self.log_data = my_logger.get_log_data(
        LOG_TYPE_CLICK,
        my_logger.get_click_type_data(evt), 
        LOG_SUBTYPE_NAVIGATE,
        my_logger.get_navigate_subtype_data,
        logfqid
        );

      if(self.selected_act)
      {
        self.nav_click.wx = self.selected_act.wx+self.selected_act.act_wx;
        self.nav_click.wy = self.selected_act.wy+self.selected_act.act_wy;
      }
      else my_cursor.ripple(self.nav_click.x,self.nav_click.y);
      self.wpt_in_navigable(self.nav_click.wx,self.nav_click.wy,self.nav_click);
      my_avatar.to_wx = self.nav_click.wx;
      my_avatar.to_wy = self.nav_click.wy;
    }
    my_logger.send_log(self.log_data);
    //handle case where hover log data has not been sent before click 
    // Something might be a bit strange here - not sure
    if(my_logger.current_hover_info.start_time){
      my_logger.send_log_data_hover(LOG_SUBTYPE_NAVIGATE);
      
    }
  }

  self.tick = function()
  {
    if(my_camera == my_real_camera && state_stack != STATE_CUTSCENE)
    {
      //move camera
      var target_cam_wx = self.cam_target_wx(window.my_avatar.wx); //NEEDS window. ON SAFARI TO PREVENT NONSENSE OPTIMIZATIONS THAT DUPLICATES MY_AVATAR STATE (?)
      my_real_camera.wx = lerp(my_real_camera.wx,target_cam_wx,cur_level.target_lerp_s);

      var target_cam_wy = self.cam_target_wy(window.my_avatar.wy); //NEEDS window. ON SAFARI TO PREVENT NONSENSE OPTIMIZATIONS THAT DUPLICATES MY_AVATAR STATE (?)
      my_real_camera.wy = lerp(my_real_camera.wy,target_cam_wy,cur_level.target_lerp_s);
    }

    self.room.animcycle_inst.tick();
    screenSpace(my_camera,canv,self.room);
    for(var i = 0; i < self.room.navs.length;    i++) screenSpace(my_camera,canv,self.room.navs[i]);
    for(var i = 0; i < self.room.lights.length;  i++) screenSpace(my_camera,canv,self.room.lights[i]);
    for(var i = 0; i < self.room.shadows.length; i++) screenSpace(my_camera,canv,self.room.shadows[i]);
    for(var i = 0; i < self.cache_available_persons.length;      i++) { self.cache_available_persons[i].animcycle_inst.tick();      screenSpace(my_camera, canv, self.cache_available_persons[i]); }
    for(var i = 0; i < self.cache_available_objects.length;      i++) { self.cache_available_objects[i].animcycle_inst.tick();      screenSpace(my_camera, canv, self.cache_available_objects[i]); }
    for(var i = 0; i < self.cache_available_observations.length; i++) { self.cache_available_observations[i].animcycle_inst.tick(); screenSpace(my_camera, canv, self.cache_available_observations[i]); }
    for(var i = 0; i < self.cache_available_portholes.length;    i++) { self.cache_available_portholes[i].animcycle_inst.tick();    screenSpace(my_camera, canv, self.cache_available_portholes[i]); }
    for(var i = 0; i < self.cache_available_wildcards.length;    i++) { self.cache_available_wildcards[i].animcycle_inst.tick();    screenSpace(my_camera, canv, self.cache_available_wildcards[i]); }
    for(var i = 0; i < self.cache_available_cutscenes.length;    i++) { self.cache_available_cutscenes[i].animcycle_inst.tick();    screenSpace(my_camera, canv, self.cache_available_cutscenes[i]); }
    for(var i = 0; i < self.cache_available_inerts.length;       i++) { self.cache_available_inerts[i].animcycle_inst.tick();       screenSpace(my_camera, canv, self.cache_available_inerts[i]); }

    for(var i = 0; i < self.cache_available_bg_drawables.length;    i++)
    {
      var d = self.cache_available_bg_drawables[i];
      var m = (d.g*d.g)/5;
      d.dw = d.w;
      d.dh = d.h;
      d.dx = d.x + ((my_camera.wx-d.wx)*m)/880*canv.width; //this is a pretty bogus space transition
      d.dy = d.y - ((my_camera.wy-d.wy)*m)/660*canv.height; //this is a pretty bogus space transition
    }
    for(var i = 0; i < self.cache_available_fg_drawables.length;    i++)
    {
      var d = self.cache_available_fg_drawables[i];
      var m = (d.g*d.g);
      d.dw = d.w;
      d.dh = d.h;
      d.dx = d.x - (my_camera.wx-d.wx)*m/880*canv.width; //this is a pretty bogus space transition
      d.dy = d.y + (my_camera.wy-d.wy)*m/660*canv.height; //this is a pretty bogus space transition
    }

    if(DEBUG)
    {
      if(my_camera == my_debug_camera)
        screenSpace(my_debug_camera,canv,my_real_camera);
    }
  }

  var draw_junk = function(d)
  {
    ctx.save();
    ctx.translate(d.x+d.w/2,d.y+d.h/2);
    if(d.flip) ctx.scale(-1,1);
    if(d.stack_animcycle_t)
    {
      ctx.drawImage(d.stack_animcycle_inst.img,-d.w/2,-d.h/2,d.w,d.h);
      d.stack_animcycle_t--;
    }
    else
      ctx.drawImage(d.animcycle_inst.img,-d.w/2,-d.h/2,d.w,d.h);
    ctx.restore();
    if(state_cur == STATE_NAV && d.notice)
    {
      var hw = cur_level.hover_w/2;
      var hh = cur_level.hover_h/2;
      d.hover_icon_x =  screenSpaceW(my_camera,canv,d.hover_icon_wx);
      d.hover_icon_y = -screenSpaceH(my_camera,canv,d.hover_icon_wy);
      ctx.drawImage(d.notice_icon_animcycle_inst.img, d.x+d.w/2+d.hover_icon_x-hw, d.y+d.h/2+d.hover_icon_y-hh, cur_level.hover_w, cur_level.hover_h);
    }
  }
  self.draw = function()
  {
    if(SHOW_GROUNDS && QUALITY) for(var i = 0; i < self.cache_available_bg_drawables.length; i++) { var d = self.cache_available_bg_drawables[i]; drawCanvMaskedImage(d.animcycle_inst.img, d.dx, d.dy, d.dw, d.dh, canv, ctx); }
    if(self.room.id == "secret")
    {
      var fg_img   = self.room.inerts[0].animcycle_inst.img;
      var fuzz_img = self.room.inerts[1].animcycle_inst.img;
      drawCanvMaskedImage(fg_img,self.room.x,self.room.y,self.room.w,self.room.h, canv, ctx);
      ctx.globalCompositeOperation = "destination-in";
      var s = 400;
      ctx.drawImage(fuzz_img,my_cursor.known_x-s/2,my_cursor.known_y-s/2,s,s);
      ctx.globalCompositeOperation = "destination-atop";
    }

    drawCanvMaskedImage(self.room.animcycle_inst.img,self.room.x,self.room.y,self.room.w,self.room.h, canv, ctx);
    ctx.globalCompositeOperation = "source-over";

    var avi_wz = mapVal(self.room.nav_min_wz_wy, self.room.nav_max_wz_wy, self.room.nav_min_wz, self.room.nav_max_wz, my_avatar.wy);
    var i = 0;

    //essentially "switch sort"
    if(my_familiar.available)
    {
      var fami_wz = mapVal(self.room.nav_min_wz_wy, self.room.nav_max_wz_wy, self.room.nav_min_wz, self.room.nav_max_wz, my_familiar.wy)
      if(fami_wz > avi_wz)
      {
        for(; i < self.cache_available_drawables.length && self.cache_available_drawables[i].wz < avi_wz; i++)
          draw_junk(self.cache_available_drawables[i]);
        my_avatar.draw(self.pt_shade(my_avatar.wx,my_avatar.wy),self.room.light_color,self.room.shadow_color,self.room.ambient_color);
        for(; i < self.cache_available_drawables.length && self.cache_available_drawables[i].wz < fami_wz; i++)
          draw_junk(self.cache_available_drawables[i]);
        my_familiar.draw(self.pt_shade(my_familiar.wx,my_familiar.wy),self.room.light_color,self.room.shadow_color,self.room.ambient_color);
        for(; i < self.cache_available_drawables.length; i++)
          draw_junk(self.cache_available_drawables[i]);
      }
      else
      {
        for(; i < self.cache_available_drawables.length && self.cache_available_drawables[i].wz < fami_wz; i++)
          draw_junk(self.cache_available_drawables[i]);
        my_familiar.draw(self.pt_shade(my_familiar.wx,my_familiar.wy),self.room.light_color,self.room.shadow_color,self.room.ambient_color);
        for(; i < self.cache_available_drawables.length && self.cache_available_drawables[i].wz < avi_wz; i++)
          draw_junk(self.cache_available_drawables[i]);
        my_avatar.draw(self.pt_shade(my_avatar.wx,my_avatar.wy),self.room.light_color,self.room.shadow_color,self.room.ambient_color);
        for(; i < self.cache_available_drawables.length; i++)
          draw_junk(self.cache_available_drawables[i]);
      }
    }
    else
    {
      for(; i < self.cache_available_drawables.length && self.cache_available_drawables[i].wz < avi_wz; i++)
        draw_junk(self.cache_available_drawables[i]);
      my_avatar.draw(self.pt_shade(my_avatar.wx,my_avatar.wy),self.room.light_color,self.room.shadow_color,self.room.ambient_color);
      for(; i < self.cache_available_drawables.length; i++)
        draw_junk(self.cache_available_drawables[i]);
    }

    if(SHOW_GROUNDS && QUALITY) for(var i = 0; i < self.cache_available_fg_drawables.length; i++) { var d = self.cache_available_fg_drawables[i]; drawCanvMaskedImage(d.animcycle_inst.img, d.dx, d.dy, d.dw, d.dh, canv, ctx); }

    if(DEBUG)
    {
      ctx.strokeStyle = purple;
      for(var i = 0; i < self.room.shadows.length; i++) ctx.strokeRect(self.room.shadows[i].x,self.room.shadows[i].y,self.room.shadows[i].w,self.room.shadows[i].h);
      ctx.strokeStyle = yellow;
      for(var i = 0; i < self.room.lights.length; i++) ctx.strokeRect(self.room.lights[i].x,self.room.lights[i].y,self.room.lights[i].w,self.room.lights[i].h);
      ctx.strokeStyle = orange;
      for(var i = 0; i < self.room.navs.length; i++) ctx.strokeRect(self.room.navs[i].x,self.room.navs[i].y,self.room.navs[i].w,self.room.navs[i].h);
      ctx.strokeStyle = gray;
      for(var i = 0; i < self.room.entry_portholes_found.length; i++) { var o = self.room.entry_portholes_found[i]; o.target_start_x = screenSpaceXpt(my_camera,canv,o.target_start_wx); o.target_start_y = screenSpaceYpt(my_camera,canv,o.target_start_wy); ctx.strokeRect(o.target_start_x-2,o.target_start_y-2,4,4); }
      ctx.strokeStyle = dark_gray;
                                                                      { var o = self.room;                          o.target_start_x = screenSpaceXpt(my_camera,canv,o.target_start_wx); o.target_start_y = screenSpaceYpt(my_camera,canv,o.target_start_wy); ctx.strokeRect(o.target_start_x-2,o.target_start_y-2,4,4); }

      ctx.strokeStyle = red;     for(var i = 0; i < self.cache_available_persons.length;      i++) strokeBox(self.cache_available_persons[i],ctx);
      ctx.strokeStyle = blue;    for(var i = 0; i < self.cache_available_objects.length;      i++) strokeBox(self.cache_available_objects[i],ctx);
      ctx.strokeStyle = blue;    for(var i = 0; i < self.cache_available_observations.length; i++) strokeBox(self.cache_available_observations[i],ctx);
      ctx.strokeStyle = green;   for(var i = 0; i < self.cache_available_portholes.length;    i++) strokeBox(self.cache_available_portholes[i],ctx);
      ctx.strokeStyle = magenta; for(var i = 0; i < self.cache_available_wildcards.length;    i++) strokeBox(self.cache_available_wildcards[i],ctx);
      ctx.strokeStyle = magenta; for(var i = 0; i < self.cache_available_cutscenes.length;    i++) strokeBox(self.cache_available_cutscenes[i],ctx);
      ctx.strokeStyle = cyan;    for(var i = 0; i < self.cache_available_inerts.length;       i++) strokeBox(self.cache_available_inerts[i],ctx);

      ctx.strokeStyle = cyan;
      for(var i = 0; i < self.cache_available_persons.length;      i++) { var o = self.cache_available_persons[i];      o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      for(var i = 0; i < self.cache_available_objects.length;      i++) { var o = self.cache_available_objects[i];      o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      for(var i = 0; i < self.cache_available_observations.length; i++) { var o = self.cache_available_observations[i]; o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      for(var i = 0; i < self.cache_available_portholes.length;    i++) { var o = self.cache_available_portholes[i];    o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      for(var i = 0; i < self.cache_available_wildcards.length;    i++) { var o = self.cache_available_wildcards[i];    o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      for(var i = 0; i < self.cache_available_cutscenes.length;    i++) { var o = self.cache_available_cutscenes[i];    o.act_x = screenSpaceW(my_camera,canv,o.act_wx); o.act_y = -screenSpaceH(my_camera,canv,o.act_wy); ctx.strokeRect(o.x+o.w/2+o.act_x-2,o.y+o.h/2+o.act_y-2,4,4); }
      ctx.strokeStyle = black;
      for(var i = 0; i < self.cache_available_persons.length;      i++) { var o = self.cache_available_persons[i];      o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      for(var i = 0; i < self.cache_available_objects.length;      i++) { var o = self.cache_available_objects[i];      o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      for(var i = 0; i < self.cache_available_observations.length; i++) { var o = self.cache_available_observations[i]; o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      for(var i = 0; i < self.cache_available_portholes.length;    i++) { var o = self.cache_available_portholes[i];    o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      for(var i = 0; i < self.cache_available_wildcards.length;    i++) { var o = self.cache_available_wildcards[i];    o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      for(var i = 0; i < self.cache_available_cutscenes.length;    i++) { var o = self.cache_available_cutscenes[i];    o.hover_icon_x = screenSpaceW(my_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }

      if(my_camera == my_debug_camera)
      {
        ctx.strokeStyle = black;
        strokeBox(my_real_camera,ctx);
      }

      ctx.fillStyle = black;
      ctx.fillText(self.room.fqid,20,20);
    }
  }
};

var toolbar = function()
{
  var self = this;

  self.x = 0;
  self.w = 100;
  self.h = 100;

  self.toolbar_animcycle_inst;
  self.icon_map_instanimcycle_inst;
  self.icon_notebook_animcycle_inst;
  self.notebook_available = false;
  self.map_available = false;
  self.notebook_bounce = 0;
  self.map_bounce = 0;

  var MAP_ENABLED = 0;

  self.resize = function()
  {
    self.y = canv.height-90;
    self.notebook = {x:20,  y:self.y+15, w:self.h-40, h:self.h-40};
    self.map      = {x:100, y:self.y+15, w:self.h-40, h:self.h-40};
  }
  self.resize();

  self.consume_level = function(level)
  {
    self.toolbar_animcycle_inst       = gen_animcycle_inst(level.toolbar_animcycle_id,level.animcycles);
    self.icon_map_animcycle_inst      = gen_animcycle_inst(level.icon_map_animcycle_id,level.animcycles);
    self.icon_notebook_animcycle_inst = gen_animcycle_inst(level.icon_notebook_animcycle_id,level.animcycles);
    self.notebook_available = false;
    self.map_available = false;
    self.notebook_bounce = 0;
    self.map_bounce = 0;
  }

  self.shouldClick = function(evt)
  {
    if(MAP_ENABLED && self.map_available && ptWithinBox(self.map,evt.doX,evt.doY))
      return true;
    if(self.notebook_available && ptWithinBox(self.notebook,evt.doX,evt.doY))
      return true;
    return false;
  }

  self.click = function(evt)
  {
    //log notebook button
    
    if(MAP_ENABLED && self.map_available && ptWithinBox(self.map,evt.doX,evt.doY))
    {
      my_navigable.selected_act = 0;
      state_from = state_cur;
      state_to = STATE_MAP;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
      my_mapview.unlock_content();
      if(AUDIO) playHandlePromise(get_audio(cur_level.map_audio_id,cur_level.audios).aud);
    }
    if(self.notebook_available && ptWithinBox(self.notebook,evt.doX,evt.doY))
    {
      self.log_data = my_logger.get_log_data(
        LOG_TYPE_CLICK,
        my_logger.get_click_type_data(evt), 
        LOG_SUBTYPE_NOTEBOOK,
        my_logger.get_notebook_subtype_data(LOG_NAME_OPEN, my_notebookview.page),
        0
        );
      my_notebookview.unlock_content();
      my_navigable.selected_act = 0;
      state_from = state_cur;
      state_to = STATE_NOTEBOOK;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
      if(AUDIO) playHandlePromise(get_audio(cur_level.notebook_audio_id,cur_level.audios).aud);
      my_logger.send_log(self.log_data);
    }
    
  }

  self.tick = function()
  {
    self.toolbar_animcycle_inst.tick();
    self.icon_map_animcycle_inst.tick();
    self.icon_notebook_animcycle_inst.tick();
    if(self.notebook_bounce > 0) self.notebook_bounce -= 0.01; else self.notebook_bounce = 0;
    if(self.map_bounce      > 0) self.map_bounce      -= 0.01; else self.map_bounce      = 0;
  }

  self.draw = function(t)
  {
    var yoff = (1-t)*self.h;
    ctx.drawImage(self.toolbar_animcycle_inst.img, self.x, self.y +yoff, self.w, self.h);
    if(self.notebook_available) ctx.drawImage(self.icon_notebook_animcycle_inst.img, self.notebook.x, self.notebook.y+yoff+sin(self.notebook_bounce*20)*10*self.notebook_bounce, self.notebook.w, self.notebook.h);
    if(MAP_ENABLED && self.map_available) ctx.drawImage(self.icon_map_animcycle_inst.img, self.map.x, self.map.y +yoff, self.map.w, self.map.h);

    if(DEBUG)
    {
      ctx.strokeRect(self.x,         self.y         +yoff, self.w,         self.h);
      ctx.strokeRect(self.notebook.x,self.notebook.y+yoff, self.notebook.w,self.notebook.h);
      if(MAP_ENABLED)
      ctx.strokeRect(self.map.x,     self.map.y     +yoff, self.map.w,     self.map.h);
    }
  }

}

var mapview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.level;
  self.selected_scene = 0;
  self.cache_available_scenes = [];

  self.map_animcycle_inst;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height; 
    self.exit_box = {x:canv.width-100, y:10, w:90, h:90};
    self.map = {wx:0,wy:0,ww:880,wh:660};
    screenSpace(my_ui_camera,canv,self.map);
  }
  self.resize();

  self.consume_level = function(level)
  {
    self.level = level;
    self.unlock_content();
    self.selected_scene = 0;
    self.map_animcycle_inst = gen_animcycle_inst(level.map_animcycle_id, level.animcycles);
    self.exit_animcycle_inst = gen_animcycle_inst(level.exit_animcycle_id, level.animcycles);
  }

  self.unlock_content = function()
  {
    self.cache_available_scenes = [];
    for(var i = 0; i < self.level.scenes.length; i++)
      if(self.level.scenes[i].available = queryreqs(self.level.scenes[i], self.level.scenes[i].reqs))
      {
        var o = self.level.scenes[i];
        o.notice = (o.notice_icon_animcycle_id && o.notice_icon_animcycle_id != "null" && queryreqs(o, o.notice_reqs));
        self.cache_available_scenes.push(o);
      }
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.hover_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.wz = 999999;
    self.hover = 0;
    self.consume_hover = function(a)
    {
      self.hover = a;
      self.x = self.hover.x+self.hover.w/2+self.hover.hover_icon_x-2;
      self.y = self.hover.y+self.hover.h/2+self.hover.hover_icon_y-2;
      self.w = 4;
      self.h = 4;
      self.hover.dirty = true;
    }
    self.edit = function()
    {
      self.w = 4;
      self.h = 4;
      self.hover.hover_icon_x = (self.x+self.w/2)-(self.hover.x+self.hover.w/2);
      self.hover.hover_icon_y = (self.y+self.h/2)-(self.hover.y+self.hover.h/2);
      self.hover.hover_icon_wx =  worldSpaceW(my_ui_camera,canv,self.hover.hover_icon_x);
      self.hover.hover_icon_wy = -worldSpaceH(my_ui_camera,canv,self.hover.hover_icon_y);
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;
    for(var i = 0; i < self.cache_available_scenes.length; i++) if(ptWithinBox(self.cache_available_scenes[i],evt.doX,evt.doY)) { self.edit_o = self.cache_available_scenes[i]; self.cache_available_scenes[i].dirty = true; }
    for(var i = 0; i < self.cache_available_scenes.length; i++) { var o = self.cache_available_scenes[i]; if(ptNear(o.x+o.w/2+o.hover_icon_x,o.y+o.h/2+o.hover_icon_y,10,evt.doX,evt.doY)) { self.edit_o = self.hover_editor; self.hover_editor.consume_hover(o); } }

    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_o == self.hover_editor) self.hover_editor.edit();
    else worldSpace(my_ui_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END
  
  self.hover = function(evt)
  {
    //log hover mapview
    my_logger.current_hover_info.o_found = false; //logging parameter
    my_cursor.mode = CURSOR_NORMAL;

    for(var i = 0; i < self.cache_available_scenes.length; i++){
      if(ptWithinBox(self.cache_available_scenes[i],evt.doX,evt.doY)){
        my_cursor.mode = CURSOR_UI;

        //log hover
        my_logger.current_hover_info.o_found = true;
          if(!my_logger.current_hover_info.start_time){
            my_logger.current_hover_info.start_time = Date.now(); //acquisition - map_hover
            my_logger.current_hover_info.subtype_data = my_logger.get_map_subtype_data(LOG_NAME_BASIC);
            my_logger.current_hover_info.fqid = self.cache_available_scenes[i].fqid; //acquisition
          }
        }
      }
    //push hover log
    if(my_logger.should_log_hover()){

      my_logger.send_log_data_hover(LOG_SUBTYPE_MAP);
      
    }
  }
  self.unhover = function(evt)
  {
  }

  self.click = function(evt)
  {
    //log map close selectscene
    var log_event_name = LOG_NAME_BASIC;
    var log_fqid = 0;
    if(ptWithinBox(self.exit_box,evt.doX,evt.doY))
    {
      log_event_name = LOG_NAME_CLOSE; //acquisition - closemap_click
      state_from = state_cur;
      state_to = state_stack;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
    }
    for(var i = 0; i < self.cache_available_scenes.length; i++)
    {
      if(ptWithinBox(self.cache_available_scenes[i],evt.doX,evt.doY))
      {
        self.selected_scene = self.cache_available_scenes[i];

        log_event_name = 'selectScene'; //acquisition - selectmapscene_click
        log_fqid = self.selected_scene.fqid; //acquisition
        self.selected_scene.pre_met = true;
        state_from = state_cur;
        state_to = state_stack;
        state_cur = STATE_TRANSITION;
        my_loader.unlock_content();
        state_t = 0;
      }
    }
    my_logger.send_log(my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt),
      LOG_SUBTYPE_MAP,
      my_logger.get_map_subtype_data(log_event_name),
      log_fqid));
  }

  self.tick = function()
  {
    self.map_animcycle_inst.tick();
    for(var i = 0; i < self.cache_available_scenes.length; i++)
    {
      self.cache_available_scenes[i].animcycle_inst.tick();
      screenSpace(my_ui_camera,canv,self.cache_available_scenes[i]);
    }
  }

  self.draw = function(t)
  {
    var yoff = (1-t)*self.h
    ctx.drawImage(self.map_animcycle_inst.img, self.map.x, self.map.y+yoff, self.map.w, self.map.h);
    for(var i = 0; i < self.cache_available_scenes.length; i++)
    {
      var o = self.cache_available_scenes[i];
      ctx.drawImage(o.animcycle_inst.img, o.x, o.y+yoff, o.w, o.h);
      if(o.notice)
      {
        var hw = cur_level.hover_w/2;
        var hh = cur_level.hover_h/2;
        o.hover_icon_x =  screenSpaceW(my_ui_camera,canv,o.hover_icon_wx);
        o.hover_icon_y = -screenSpaceH(my_ui_camera,canv,o.hover_icon_wy);
        ctx.drawImage(o.notice_icon_animcycle_inst.img, o.x+o.w/2+o.hover_icon_x-hw, o.y+o.h/2+o.hover_icon_y-hh+yoff, cur_level.hover_w, cur_level.hover_h);
      }
    }

    if(!my_notificationview.note.length || my_notificationview.clickthrough)
      ctx.drawImage(self.exit_animcycle_inst.img, self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);

    if(DEBUG)
    {
      ctx.strokeStyle = red;
      ctx.strokeRect(self.x, self.y+yoff, self.w, self.h);
      ctx.strokeRect(self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);
      for(var i = 0; i < self.cache_available_scenes.length; i++) ctx.strokeRect(self.cache_available_scenes[i].x, self.cache_available_scenes[i].y+yoff, self.cache_available_scenes[i].w, self.cache_available_scenes[i].h);
      ctx.strokeStyle = cyan;
      for(var i = 0; i < self.cache_available_scenes.length; i++) { var o = self.cache_available_scenes[i]; o.hover_icon_x = screenSpaceW(my_ui_camera,canv,o.hover_icon_wx); o.hover_icon_y = -screenSpaceH(my_ui_camera,canv,o.hover_icon_wy); ctx.strokeRect(o.x+o.w/2+o.hover_icon_x-2,o.y+o.h/2+o.hover_icon_y-2,4,4); }
      ctx.strokeStyle = black;
      for(var i = 0; i < self.cache_available_scenes.length; i++) ctx.fillText(self.cache_available_scenes[i].fqid, self.cache_available_scenes[i].x+10, self.cache_available_scenes[i].y+yoff+20);
    }
  }
}

var notebookview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.entrys;
  self.notebook_animcycle_inst;
  self.exit_animcycle_inst;
  self.notebook_next_animcycle_inst;
  self.notebook_prev_animcycle_inst;
  self.exit_available = 1;
  self.cache_available_entrys = [];
  self.n_available_entrys = 0;
  self.current_code = "-";

  self.page = 0;
  self.last_page = 0;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;

    self.notebook = {wx:0,wy:0,ww:880,wh:660};
    screenSpace(my_ui_camera,canv,self.notebook);
    self.exit_box = {x:canv.width-100, y:10, w:90, h:90};

    var prev_x_edge = 10;
    var prev_y_edge = canv.height-10;
    var next_x_edge = canv.width-10;
    var next_y_edge = canv.height-10;
    var page_s = 50;
    self.prev_box = {x:prev_x_edge,        y:prev_y_edge-page_s, w:page_s, h:page_s };
    self.next_box = {x:next_x_edge-page_s, y:prev_y_edge-page_s, w:page_s, h:page_s };
  }
  self.resize();

  self.consume_level = function(level)
  {
    self.entrys = level.entrys;
    self.unlock_content();
    self.notebook_animcycle_inst = gen_animcycle_inst(level.notebook_animcycle_id,level.animcycles);
    self.exit_animcycle_inst = gen_animcycle_inst(level.exit_animcycle_id, level.animcycles);
    self.notebook_next_animcycle_inst = gen_animcycle_inst(level.notebook_next_animcycle_id, level.animcycles);
    self.notebook_prev_animcycle_inst = gen_animcycle_inst(level.notebook_prev_animcycle_id, level.animcycles);
    self.n_available_entrys = 0;
  }

  self.unlock_content = function()
  {
    self.cache_available_entrys = [];
    self.last_page = 0;
    for(var i = 0; i < self.entrys.length; i++)
    {
      var l = self.entrys[i].available;
      self.entrys[i].available = queryreqs(self.entrys[i], self.entrys[i].reqs);
      if(!l && self.entrys[i].available) gtag('event', 'capitol_entry_available', { entry: self.entrys[i].fqid, entry_number: self.n_available_entrys+1 });
      if(self.entrys[i].available)
      {
        self.entrys[i].hoverexpand = 0;
        if(self.entrys[i].page > self.last_page) self.last_page = self.entrys[i].page;
        //sort by page->z
        var j = 0;
        for(; j < self.cache_available_entrys.length; j++) if(self.entrys[i].page < self.cache_available_entrys[j].page || (self.entrys[i].page == self.cache_available_entrys[j].page && self.entrys[i].wz < self.cache_available_entrys[j].wz)) break;
        self.cache_available_entrys.splice(j,0,self.entrys[i]);
      }
    }
    if(self.cache_available_entrys.length > self.n_available_entrys)
    {
      my_toolbar.notebook_bounce = 1;
      self.page = self.last_page;
    }
    self.n_available_entrys = self.cache_available_entrys.length;

    self.old_code = self.current_code;
    self.current_code = 0;
    for(var i = 0; !self.current_code && i < save_codes.length; i++)
    {
      if(queryreqs(0, save_table[save_codes[save_codes.length-1-i]].reqs))
        self.current_code = save_codes[save_codes.length-1-i];
    }
    var c = get_save_code();
    if(self.old_code != self.current_code)
      save_modules_str += get_save_code_module();
    setCookie("save", get_save_code(), 10);
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
    self.dragStart = function(evt)
  {
    self.edit_o = 0;
    for(var i = 0; !self.edit_o && i < self.cache_available_entrys.length; i++)
    {
      var entry = self.cache_available_entrys[i];
      if(entry.page == self.page && ptWithinBox(entry,evt.doX,evt.doY)) { self.edit_o = entry; entry.dirty = true; }
    }

    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));
    worldSpace(my_ui_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.hover = function(evt)
  {
  }
  self.unhover = function(evt)
  {
  }

  self.click = function(evt)
  {
    //log notebook view
    var log_page = self.page;
    var log_name = LOG_NAME_BASIC;
    if(self.exit_available && ptWithinBox(self.exit_box,evt.doX,evt.doY))
    {
      log_name = LOG_NAME_CLOSE;
      state_from = state_cur;
      state_to = state_stack;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
    }
    else if(self.page > 0              && ptWithinBox(self.prev_box,evt.doX,evt.doY))
    {
      if(AUDIO) playHandlePromise(get_audio(cur_level.notebook_turn_audio_id,cur_level.audios).aud);
      self.page--;
      log_name = LOG_NAME_PREV;
    }
    else if(self.page < self.last_page && ptWithinBox(self.next_box,evt.doX,evt.doY))
    {
      if(AUDIO) playHandlePromise(get_audio(cur_level.notebook_turn_audio_id,cur_level.audios).aud);
      self.page++;
      log_name = LOG_NAME_NEXT;
    }
    my_logger.send_log(my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt),
      LOG_SUBTYPE_NOTEBOOK,
      my_logger.get_notebook_subtype_data(log_name,log_page),
      0));
  }

  self.tick = function()
  {
    for(var i = 0; i < self.cache_available_entrys.length; i++)
    {
      self.cache_available_entrys[i].animcycle_inst.tick();
      screenSpace(my_ui_camera,canv,self.cache_available_entrys[i]);
    }
    self.notebook_animcycle_inst.tick();
  }

  self.draw = function(t)
  {
    var yoff = (1-t)*self.h;
    ctx.drawImage(self.notebook_animcycle_inst.img, self.notebook.x, self.notebook.y+yoff, self.notebook.w, self.notebook.h);

    var entry;
    for(var i = 0; i < self.cache_available_entrys.length; i++)
    {
      entry = self.cache_available_entrys[i];
      if(entry.page == self.page)
      {
        if(!entry.hoverexpand) entry.hoverexpand = 0;
        if(entry.hovering) entry.hoverexpand = min(1,entry.hoverexpand+0.1);
        else               entry.hoverexpand = max(0,entry.hoverexpand-0.1);
        if(entry.hoverexpand)
          ctx.drawImage(entry.animcycle_inst.img,entry.x-entry.hoverexpand*10,entry.y+yoff-entry.hoverexpand*10,entry.w+entry.hoverexpand*20,entry.h+entry.hoverexpand*20);
        else
          ctx.drawImage(entry.animcycle_inst.img,entry.x,entry.y+yoff,entry.w,entry.h);
      }
    }

    if(self.page < self.last_page)
    ctx.drawImage(self.notebook_next_animcycle_inst.img, self.next_box.x, self.next_box.y+yoff, self.next_box.w, self.next_box.h);
    if(self.page > 0)
    ctx.drawImage(self.notebook_prev_animcycle_inst.img, self.prev_box.x, self.prev_box.y+yoff, self.prev_box.w, self.prev_box.h);

    if((!my_notificationview.note.length || my_notificationview.clickthrough) && self.exit_available)
      ctx.drawImage(self.exit_animcycle_inst.img, self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);

    ctx.fillStyle = black;
    ctx.fillText("Save Code: "+self.current_code,60,30+yoff);

    if(DEBUG)
    {
      ctx.strokeStyle = black;
      var entry;
      for(var i = 0; i < self.cache_available_entrys.length; i++)
      {
        entry = self.cache_available_entrys[i];
        if(entry.page == self.page)
        {
          ctx.strokeRect(entry.x,entry.y+yoff,entry.w,entry.h);
          ctx.fillText(entry.id,entry.x+5,entry.y+25);
        }
      }
      ctx.strokeRect(self.prev_box.x, self.prev_box.y+yoff, self.prev_box.w, self.prev_box.h);
      ctx.strokeRect(self.next_box.x, self.next_box.y+yoff, self.next_box.w, self.next_box.h);
      ctx.strokeRect(self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);
    }
  }
}

var notificationview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.c;
  self.note = [];
  self.note_ws = [];
  self.c_note_i = 0; //for editing
  self.note_i = 0;
  self.clickthrough = 0;

  self.bubble_color = "#242224";
  self.text_color = white;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
  }
  self.resize();

  var ENUM = 0;
  var UI_STATE_NULL    = ENUM; ENUM++;
  var UI_STATE_IN_NOTE = ENUM; ENUM++;
  var UI_STATE_SELECT  = ENUM; ENUM++;
  var UI_STATE_NEXT    = ENUM; ENUM++;
  var UI_STATE_OUT     = ENUM; ENUM++;
  var UI_STATE_COUNT   = ENUM; ENUM++;

  self.ui_state = UI_STATE_NULL;
  self.ui_state_t = 0;
  self.ui_state_t_max = [];
  self.ui_state_t_max[UI_STATE_IN_NOTE] = 30;
  self.ui_state_t_max[UI_STATE_SELECT]  = 0;
  self.ui_state_t_max[UI_STATE_NEXT]    = 1;
  self.ui_state_t_max[UI_STATE_OUT]     = 10;
  self.ui_state_p = 0;

  self.consume_notification = function(c)
  {
    var force_click = self.clickthrough; //new notif enqueued through persistent notif- dismiss
    var note_exists = self.note.length;
    self.c = c;

    for(var i = 0; i < self.c.notifications.length; i++)
    {
      if(self.c.raw_notification_ws && self.c.raw_notification_ws[i])
        self.note_ws[self.note.length+i] = self.c.raw_notification_ws[i];
      else
        self.note_ws[self.note.length+i] = cur_level.notifications_w;
    }
    if(note_exists) { self.c_note_i = self.note_i-self.note.length; self.note = self.note.concat(self.c.notifications); }
    else { self.note = [].concat(self.c.notifications); self.note_i = 0; self.c_note_i = 0; }
    self.clickthrough = (self.c.notifications_persistent && self.note_i == self.note.length-1);
    if(force_click) self.click();
    else if(!note_exists)
    {
      self.ui_state = UI_STATE_IN_NOTE;
      self.ui_state_t = 0;
      self.ui_state_p = 0;
    }
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.nv_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.nv;
    self.consume_nv = function(nv,x,y,w,h)
    {
      self.nv = nv;
      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;
      self.nv.c.dirty = true;
    }
    self.edit = function()
    {
      if(!self.nv.c.raw_notification_ws) self.nv.c.raw_notification_ws = [];
      self.nv.c.raw_notification_ws[self.nv.c_note_i] = self.w;
      self.nv.note_ws[self.nv.note_i] = self.w;
      self.nv.note[self.nv.note_i] = stextToLines(self.nv.c.raw_notifications[self.nv.c_note_i], self.w);
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;

    //copied from draw
    var b = 10;
    var h = cur_level.notifications_h*self.note[self.note_i].length;
    var w = cur_level.notifications_w;
    if(self.c.raw_notification_ws && self.c.raw_notification_ws[self.note_i]) w = self.c.raw_notification_ws[self.note_i];
    var x = self.x+self.w/2-w/2;
    var y = self.y+self.h-30-h;

    if(!self.edit_o && ptWithin(x,y,w,h,evt.doX,evt.doY)) { self.edit_o = self.nv_editor; self.nv_editor.consume_nv(self,x,y,w,h); }
    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_o == self.nv_editor) self.nv_editor.edit();
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.shouldClick = function(evt)
  {
    return !self.clickthrough;
  }
  self.click = function(evt)
  {
    //log notificationview (This is a ...! type notifications. Put an event there just in case)
    if(self.ui_state == UI_STATE_NULL) return;
    self.ui_state_t = self.ui_state_t_max[self.ui_state];
    if(self.ui_state != UI_STATE_OUT)
    {
      self.ui_state_t = 0;
      self.ui_state_p = 0;
      if(self.note_i < self.note.length-1)
        self.ui_state = UI_STATE_NEXT;
      else
        self.ui_state = UI_STATE_OUT;
    }
    if(typeof evt !== 'undefined'){
      my_logger.send_log(my_logger.get_log_data(
        LOG_TYPE_CLICK,
        my_logger.get_click_type_data(evt),
        LOG_SUBTYPE_NOTIFICATION,
        my_logger.get_notification_subtype_data(self.c, self.c.raw_notifications[self.c_note_i]),
        0));
    }
  }

  self.tick = function()
  {
    self.ui_state_t++;
    self.ui_state_p = self.ui_state_t/self.ui_state_t_max[self.ui_state];
    switch(self.ui_state)
    {
      case UI_STATE_IN_NOTE: if(self.ui_state_p >= 1) { self.ui_state = UI_STATE_SELECT; self.ui_state_t = 0; self.ui_state_p = 0; } break;
      case UI_STATE_SELECT: break;
      case UI_STATE_NEXT:
        if(self.ui_state_p >= 1)
        {
          self.note_i++;
          self.c_note_i++;
          self.ui_state = UI_STATE_SELECT;
          self.ui_state_t = 0;
          self.ui_state_p = 0;
          self.clickthrough = (self.c.notifications_persistent && self.note_i == self.note.length-1);
        }
        break;
      case UI_STATE_OUT:
        if(self.ui_state_p >= 1)
        {
          self.note = [];
          self.ui_state = UI_STATE_NULL;
          self.ui_state_t = 0;
          self.ui_state_p = 0;
          self.clickthrough = 0;
        }
        break;
    }
  }

  self.draw = function(t)
  {
    if(self.ui_state == UI_STATE_NULL) return;

    var yoff = 0;

    var a = 1;
    switch(self.ui_state)
    {
      case UI_STATE_IN_NOTE: a = bubble_in_a(self.ui_state_p); yoff = bubble_in_y(self.ui_state_p); break;
      case UI_STATE_SELECT:  break;
      case UI_STATE_NEXT:    break;
      case UI_STATE_OUT:     a = bubble_out_a(self.ui_state_p); yoff = bubble_out_y(self.ui_state_p); break;
    }
    ctx.globalAlpha = a;

    var b = 10;
    var h = cur_level.notifications_h*self.note[self.note_i].length;
    var w = self.note_ws[self.note_i];
    var x = self.x+self.w/2-w/2;
    var y = self.y+self.h-30-h;
    ctx.fillStyle = self.bubble_color;
    fillRRect(x-b-5,y-b+5+yoff,w+b*2+10,h+b*2+5,b,ctx);
    ctx.fillStyle = self.text_color;
    var oyoff = 0;
    for(var i = 0; i < self.note[self.note_i].length; i++)
    {
      ctx.fillText(self.note[self.note_i][i],x,y+yoff+cur_level.notifications_h+oyoff);
      oyoff += cur_level.notifications_h;
    }
    ctx.globalAlpha = 1;

    if(DEBUG)
    {
      ctx.strokeStyle = white;
      ctx.strokeRect(self.x, self.y+yoff, self.w, self.h);
      ctx.strokeRect(x, y+yoff, w, h);
    }
  }

}

var objectview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.object;
  self.cur_view = 0;
  self.show_view_overlay = 0;
  self.view_overlay_t = 0;
  self.exit_available = true;
  self.exit_t = 1;
  self.cache_available_zones = [];

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
    self.obj = {wx:0,wy:0,ww:880,wh:660}; //note hard-coded
    screenSpace(my_ui_camera,canv,self.obj);
    self.exit_box = {x:canv.width-100, y:10, w:90, h:90};
  }
  self.resize();

  self.consume_object = function(object)
  {
    self.object = object;
    if(self.object.notifications.length && queryreqs(self.object, self.object.notification_reqs)) my_notificationview.consume_notification(self.object);
    self.object.pre_met = true;
    self.cur_view = self.object.views[0];
    for(var i = 1; i < self.object.views.length; i++) if(self.object.views[i].primary > self.cur_view.primary) self.cur_view = self.object.views[i];
    self.cur_view.animcycle_inst.ready();
    if(self.cur_view.notifications.length && queryreqs(self.cur_view, self.cur_view.notification_reqs)) my_notificationview.consume_notification(self.cur_view);
    self.cur_view.pre_met = true;
    self.unlock_content();
    self.exit_animcycle_inst = gen_animcycle_inst(cur_level.exit_animcycle_id, cur_level.animcycles);
    self.view_overlay_t = 0;
    if(self.object.audio_id && self.object.audio_id != "null") my_music.consume_music(get_audio(self.object.audio_id,cur_level.audios));
  }

  self.unlock_content = function()
  {
    self.cache_available_zones = [];
    for(var i = 0; i < self.cur_view.zones.length; i++)
      if(self.cur_view.zones[i].available = queryreqs(self.cur_view.zones[i], self.cur_view.zones[i].reqs)) self.cache_available_zones.push(self.cur_view.zones[i]);
    self.exit_available = queryreqs(self.cur_view, self.cur_view.exit_reqs);
    self.show_view_overlay = (self.object.view_overlay_animcycle_id != "null" && queryreqs(self.object, self.object.view_overlay_reqs));
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
    self.dragStart = function(evt)
  {
    self.edit_o = 0;
    var zone;
    for(var i = 0; i < self.cache_available_zones.length; i++)
    {
      zone = self.cache_available_zones[i];
      if(ptWithinBox(zone,evt.doX,evt.doY)) { self.edit_o = zone; zone.dirty = true; }
    }

    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && self.edit_offY > 0.4*self.edit_o.h)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));
    worldSpace(my_ui_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.hover = function(evt)
  {
    //log hover objectview
    my_logger.current_hover_info.o_found = false; //logging parameter
    my_cursor.mode = CURSOR_NORMAL;
    for(var i = 0; i < self.cache_available_zones.length; i++){
      if(ptWithinBox(self.cache_available_zones[i],evt.doX,evt.doY)){
        my_cursor.mode = CURSOR_UI;
        //log hover
        my_logger.current_hover_info.o_found = true;
        if(!my_logger.current_hover_info.start_time){
          my_logger.current_hover_info.start_time = Date.now(); //acquisition - object_hover
          my_logger.current_hover_info.subtype_data = my_logger.get_object_subtype_data();
          my_logger.current_hover_info.fqid = self.cache_available_zones[i].fqid; //acquisition
        }
      }
    }
    // push log to server
    if(my_logger.should_log_hover()){

      my_logger.send_log_data_hover(LOG_SUBTYPE_OBJECT);
      
    }

  }
  self.unhover = function(evt)
  {
  }

  self.click = function(evt)
  {
    let log_name;
    let log_fqid = self.object.fqid
    if(self.exit_available && ptWithinBox(self.exit_box,evt.doX,evt.doY))
    {
      log_name = LOG_NAME_CLOSE;
      self.cur_view.met = true;
      self.object.met = true;
      state_from = state_cur;
      state_to = state_stack;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
      if(my_notificationview.clickthrough) my_notificationview.click();
      my_music.consume_music(get_audio(cur_room.audio_id,cur_level.audios));
    }
    else{
      log_name = LOG_NAME_BASIC;
    }
    var zone;
    for(var i = 0; i < self.cache_available_zones.length; i++)
    {
      zone = self.cache_available_zones[i];
      if(ptWithinBox(zone,evt.doX,evt.doY))
      {
        // self.log_data.name = 'name'; 
        // self.log_data.subtype_data.zone_fqid = zone.fqid;
        if(zone.notifications.length && queryreqs(zone, zone.notification_reqs)) my_notificationview.consume_notification(zone);
        zone.pre_met = true;
        zone.met = true;
        if(AUDIO && zone.audio_id && zone.audio_id != "null") playHandlePromise(get_audio(zone.audio_id,cur_level.audios).aud);
        if(zone.target_view == "null") zone.target_view = old_view.id;
        self.cur_view.met = true;
        var old_view = self.cur_view;
        self.cur_view = find(self.object.fqid+"."+zone.target_view);
        log_fqid = zone.fqid
        if(self.cur_view != old_view) self.cur_view.animcycle_inst.ready();
        if(self.cur_view.notifications.length && queryreqs(self.cur_view, self.cur_view.notification_reqs)) my_notificationview.consume_notification(self.cur_view);
        self.cur_view.pre_met = true;
        self.cur_view.met = true;
        self.unlock_content();
        self.log_data = my_logger.get_log_data(
          LOG_TYPE_CLICK,
          my_logger.get_click_type_data(evt), 
          LOG_SUBTYPE_OBJECT,
          my_logger.get_object_subtype_data(log_name),
          log_fqid
        );
        my_logger.send_log(self.log_data);
        return;
      }
    }
    self.log_data = my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt), 
      LOG_SUBTYPE_OBJECT,
      my_logger.get_object_subtype_data(log_name),
      log_fqid
    );
    my_logger.send_log(self.log_data);
  }

  self.tick = function()
  {
    if((!my_notificationview.note.length || my_notificationview.clickthrough) && self.exit_available) self.exit_t += 0.05;
    else                                                                                              self.exit_t -= 0.05;
    self.exit_t = clamp(0,1,self.exit_t);
    self.cur_view.animcycle_inst.tick();
    for(var i = 0; i < self.cache_available_zones.length; i++)
    {
      self.cache_available_zones[i].animcycle_inst.tick();
      screenSpace(my_ui_camera,canv,self.cache_available_zones[i]);
    }
    if(self.show_view_overlay) self.view_overlay_t += 0.02;
    else                       self.view_overlay_t -= 0.02;
    self.view_overlay_t = clamp(0,1,self.view_overlay_t);
  }

  self.draw = function(t)
  {
    var yoff = (1-t)*self.h;
    var zone;
    ctx.drawImage(self.cur_view.animcycle_inst.img, self.obj.x, self.obj.y+yoff, self.obj.w, self.obj.h);
    for(var i = 0; i < self.cache_available_zones.length; i++)
    {
      zone = self.cache_available_zones[i];
      ctx.strokeStyle = white;
      ctx.drawImage(zone.animcycle_inst.img, zone.x, zone.y+yoff, zone.w, zone.h);
    }
    if(self.cur_view.magnify)
    {
      var fs = 300;
      var frw = self.cur_view.animcycle_inst.img.width/self.obj.w;
      var frh = self.cur_view.animcycle_inst.img.height/self.obj.h;
      var ts = 400;
      ctx.drawImage(self.cur_view.animcycle_inst.img,((my_cursor.known_x-self.obj.x)-fs/2)*frw,((my_cursor.known_y-self.obj.y)-fs/2)*frh,fs*frw,fs*frh,my_cursor.known_x-ts/2,my_cursor.known_y-ts/2+yoff,ts,ts);
    }

    if(self.object.view_overlay_animcycle_id != "null" && self.view_overlay_t)
      ctx.drawImage(self.object.view_overlay_animcycle_inst.img, self.obj.x, self.obj.y+yoff+(1-easeout(self.view_overlay_t))*self.obj.h, self.obj.w, self.obj.h);

    if((!my_notificationview.note.length || my_notificationview.clickthrough) && self.exit_available)
    {
      ctx.globalAlpha = self.exit_t;
      ctx.drawImage(self.exit_animcycle_inst.img, self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);
      ctx.globalAlpha = 1;
    }

    if(DEBUG)
    {
      ctx.strokeStyle = white;
      for(var i = 0; i < self.cache_available_zones.length; i++)
      {
        zone = self.cache_available_zones[i];
        ctx.strokeRect(zone.x, zone.y+yoff, zone.w, zone.h);
      }
      ctx.strokeRect(self.x, self.y+yoff, self.w, self.h);
      ctx.strokeRect(self.exit_box.x, self.exit_box.y+yoff, self.exit_box.w, self.exit_box.h);
    }
  }

}

var observationview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.observation;

  self.bubble_color = "#242224";
  self.text_color = white;

  var ENUM = 0;
  var UI_STATE_NULL           = ENUM; ENUM++;
  var UI_STATE_IN_OBSERVATION = ENUM; ENUM++;
  var UI_STATE_SELECT         = ENUM; ENUM++;
  var UI_STATE_OUT            = ENUM; ENUM++;
  var UI_STATE_COUNT          = ENUM; ENUM++;

  self.ui_state = UI_STATE_NULL;
  self.ui_state_t = 0;
  self.ui_state_t_max = [];
  self.ui_state_t_max[UI_STATE_IN_OBSERVATION] = 40;
  self.ui_state_t_max[UI_STATE_SELECT]         = 0;
  self.ui_state_t_max[UI_STATE_OUT]            = 10;
  self.ui_state_p = 0;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
  }
  self.resize();

  self.consume_observation = function(observation)
  {
    self.observation = observation;
    if(self.observation.notifications.length && queryreqs(self.observation, self.observation.notification_reqs)) my_notificationview.consume_notification(self.observation);
    self.observation.pre_met = true;
    self.ui_state = UI_STATE_IN_OBSERVATION;
    self.ui_state_t = 0;
    self.ui_state_p = 0;
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.blip_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.blip;
    self.consume_blip = function(b)
    {
      self.blip = b;
      self.x = self.blip.blip_x;
      self.y = self.blip.blip_y;
      self.w = self.blip.blip_w;
      self.h = self.blip.blip_h;
      self.blip.blip_wx = worldSpaceXpt(my_camera,canv,self.blip.blip_x);
      self.blip.blip_wy = worldSpaceYpt(my_camera,canv,self.blip.blip_y);
      self.blip.dirty = true;
    }
    self.edit = function()
    {
      self.blip.blip_x = self.x;
      self.blip.blip_y = self.y;
      self.blip.blip_w = self.w;
      self.blip.blip_h = self.h;
      self.blip.blip_wx = worldSpaceXpt(my_camera,canv,self.blip.blip_x);
      self.blip.blip_wy = worldSpaceYpt(my_camera,canv,self.blip.blip_y);

      self.blip.text = stextToLines(self.blip.raw_text, self.blip.blip_w);
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;

    if(!self.edit_o && ptWithin(self.observation.blip_x,self.observation.blip_y,self.observation.blip_w,self.observation.blip_h,evt.doX,evt.doY)) { self.edit_o = self.blip_editor; self.blip_editor.consume_blip(self.observation); }
    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w)
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_o == self.blip_editor) self.blip_editor.edit();
    worldSpace(my_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.hover = function(evt)
  {
  }
  self.unhover = function(evt)
  {
  }

  self.click = function(evt)
  {
    //log observation view
    self.observation.met = true;
    self.ui_state_t = self.ui_state_t_max[self.ui_state];
    if(self.ui_state != UI_STATE_OUT)
    {
      self.ui_state_t = 0;
      self.ui_state_p = 0;
      self.ui_state = UI_STATE_OUT;
    }
    my_logger.send_log(my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt),
      LOG_SUBTYPE_OBSERVATION,
      my_logger.get_observation_subtype_data(self.observation.fqid, self.observation.raw_text),
      self.observation.fqid));
  }

  self.tick = function()
  {
    self.observation.blip_x = screenSpaceXpt(my_camera,canv,self.observation.blip_wx);
    self.observation.blip_y = screenSpaceYpt(my_camera,canv,self.observation.blip_wy);

    self.ui_state_t++;
    self.ui_state_p = self.ui_state_t/self.ui_state_t_max[self.ui_state];
    switch(self.ui_state)
    {
      case UI_STATE_IN_OBSERVATION: if(self.ui_state_p >= 1) { self.ui_state = UI_STATE_SELECT; self.ui_state_t = 0; self.ui_state_p = 0; } break;
      case UI_STATE_SELECT: break;
      case UI_STATE_OUT:
        if(self.ui_state_p >= 1)
        {
          self.ui_state = UI_STATE_NULL;
          self.ui_state_t = 0;
          self.ui_state_p = 0;
          state_from = state_cur;
          state_to = state_stack;
          state_cur = STATE_TRANSITION;
          my_loader.unlock_content();
          state_t = 0;
        }
        break;
    }
  }

  self.draw = function(t)
  {
    if(self.ui_state == UI_STATE_NULL) return;

    var yoff = 0;
    var oyoff = 0;

    var a = 1;
    switch(self.ui_state)
    {
      case UI_STATE_IN_OBSERVATION: a = bubble_in_a(self.ui_state_p); yoff = bubble_in_y(self.ui_state_p); break;
      case UI_STATE_SELECT:         break;
      case UI_STATE_OUT:            a = bubble_out_a(self.ui_state_p); yoff = bubble_out_y(self.ui_state_p); break;
    }
    ctx.globalAlpha = a;

    var b = 10;
    ctx.fillStyle = self.bubble_color;
    fillRRect(self.observation.blip_x-b-5,self.observation.blip_y-b+5+yoff,self.observation.blip_w+b*2+10,self.observation.blip_h*self.observation.text.length+b*2+5,b,ctx);
    ctx.fillStyle = self.text_color;
    for(var j = 0; j < self.observation.text.length; j++)
    {
      ctx.fillText(self.observation.text[j],self.observation.blip_x,self.observation.blip_y+yoff+oyoff+self.observation.blip_h);
      oyoff += self.observation.blip_h;
    }
    ctx.globalAlpha = 1;

    if(DEBUG)
    {
      ctx.strokeRect(self.observation.blip_x,self.observation.blip_y+yoff,self.observation.blip_w,self.observation.blip_h);
    }
  }

}

var personview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.person;
  self.cur_speak = 0;
  self.cur_speak_command_i = 0;
  self.cache_available_speaks = [];
  self.cache_available_options = [];

  self.bubble_color = "#242224";
  self.text_color = white;
  self.hover_color = "#4EBBC5";

  var ENUM = 0;
  var UI_STATE_NULL      = ENUM; ENUM++;
  var UI_STATE_IN_SPEAK  = ENUM; ENUM++;
  var UI_STATE_IN_OPTION = ENUM; ENUM++;
  var UI_STATE_SELECT    = ENUM; ENUM++;
  var UI_STATE_OUT       = ENUM; ENUM++;
  var UI_STATE_COUNT     = ENUM; ENUM++;

  self.inline_option = 0;
  self.hovered_option = 0;
  self.clicked_option = 0;
  self.ui_state = UI_STATE_NULL;
  self.ui_state_t = 0;
  self.ui_state_t_max = [];
  self.ui_state_t_max[UI_STATE_IN_SPEAK]  = 30;
  self.ui_state_t_max[UI_STATE_IN_OPTION] = 30;
  self.ui_state_t_max[UI_STATE_SELECT]    = 0;
  self.ui_state_t_max[UI_STATE_OUT]       = 10;
  self.ui_state_p = 0;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
  }
  self.resize();

  self.consume_person = function(person)
  {
    self.person = person;
    if(self.person.notifications.length && queryreqs(self.person, self.person.notification_reqs)) my_notificationview.consume_notification(self.person);
    self.person.pre_met = true;
    self.unlock_content();
    self.ui_state = UI_STATE_IN_SPEAK;
    self.ui_state_t = 0;
    self.ui_state_p = 0;
  }

  self.dismiss = function()
  {
    if(self.clicked_option === 1 && self.cur_speak_command_i < self.cur_speak.commands.length-1) //next speak_command
    {
      self.ui_state = UI_STATE_IN_SPEAK;
      self.ui_state_t = 0;
      self.ui_state_p = 0;
      self.cur_speak_command_i++;
      var c = self.cur_speak.commands[self.cur_speak_command_i];
      if(c.animcycle_id && c.animcycle_id != "null")
      {
        if(c.speaker == SPEAKER_PERSON)
        {
          self.person.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          self.person.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
        else
        {
          my_avatar.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          my_avatar.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
      }
    }
    else if(
      (self.clicked_option === 1 && self.cur_speak_command_i === self.cur_speak.commands.length-1) || //no options
      !self.clicked_option.target_speak_found //option w/ null target
    )
    {
      self.cur_speak.met = true;
      self.person.met = true;
      self.ui_state = UI_STATE_NULL;
      self.ui_state_t = 0;
      self.ui_state_p = 0;
      self.cur_speak = 0;
      self.cur_speak_command_i = 0;
      my_avatar.stack_animcycle_t = 0;
      state_from = state_cur;
      state_to = state_stack;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      state_t = 0;
    }
    else //option exists w/ valid target
    {
      self.ui_state = UI_STATE_IN_SPEAK;
      self.ui_state_t = 0;
      self.ui_state_p = 0;
      self.cur_speak.met = true;
      self.clicked_option.pre_met = true;
      self.clicked_option.met = true;
      self.cur_speak = self.clicked_option.target_speak_found;
      self.cur_speak_command_i = 0;
      var c = self.cur_speak.commands[self.cur_speak_command_i];
      if(c.animcycle_id && c.animcycle_id != "null")
      {
        if(c.speaker == SPEAKER_PERSON)
        {
          self.person.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          self.person.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
        else
        {
          my_avatar.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          my_avatar.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
      }
      if(self.cur_speak.notifications.length && queryreqs(self.cur_speak, self.cur_speak.notification_reqs)) my_notificationview.consume_notification(self.cur_speak);
      self.cur_speak.pre_met = true;
      self.unlock_content();
    }
    self.clicked_option = 0;
  }

  self.unlock_content = function()
  {
    self.cache_available_speaks = [];
    for(var i = 0; i < self.person.speaks.length; i++)
      if(self.person.speaks[i].available = queryreqs(self.person.speaks[i], self.person.speaks[i].reqs)) self.cache_available_speaks.push(self.person.speaks[i]);

    if(!self.cur_speak)
    {
      self.cur_speak_i = 0;
      self.cur_speak = self.cache_available_speaks[0];
      self.cur_speak_command_i = 0;
      for(var i = 1; i < self.cache_available_speaks.length; i++)
        if(self.cache_available_speaks[i].primary > self.cur_speak.primary)
          self.cur_speak = self.cache_available_speaks[i];
      var c = self.cur_speak.commands[self.cur_speak_command_i];
      if(c.animcycle_id && c.animcycle_id != "null")
      {
        if(c.speaker == SPEAKER_PERSON)
        {
          self.person.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          self.person.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
        else
        {
          my_avatar.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          my_avatar.stack_animcycle_t = cur_level.stack_animcycle_t;
        }
      }
      if(self.cur_speak.notifications.length && queryreqs(self.cur_speak, self.cur_speak.notification_reqs)) my_notificationview.consume_notification(self.cur_speak);
      self.cur_speak.pre_met = true;
    }

    self.unlock_options();
  }
  self.unlock_options = function()
  {
    self.cache_available_options = [];
    for(var i = 0; i < self.cur_speak.options.length; i++)
    {
      if(self.cur_speak.options[i].available = queryreqs(self.cur_speak.options[i], self.cur_speak.options[i].reqs))
        self.cache_available_options.push(self.cur_speak.options[i]);
    }
    //bubble sort on index
    var sorted = false;
    while(!sorted)
    {
      sorted = true;
      for(var i = 0; i < self.cache_available_options.length-1; i++)
      {
        var option = self.cache_available_options[i];
        var noption = self.cache_available_options[i+1];
        if(option.index > noption.index)
        {
          self.cache_available_options[i] = noption;
          self.cache_available_options[i+1] = option;
          sorted = false;
        }
      }
    }

    self.inline_option = 0;
    if(
       !self.cache_available_options.length ||
      (self.cache_available_options.length == 1 && self.cache_available_options[0].raw_qtext == ">")
    )
      self.inline_option = 1;
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.speak_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.cur_speak_command;
    self.src;
    self.consume_speak_command = function(src,s)
    {
      self.cur_speak_command = s;
      self.src = src;
      self.x = self.cur_speak_command.x;
      self.y = self.cur_speak_command.y;
      self.w = self.cur_speak_command.w;
      self.h = self.cur_speak_command.h;
    }
    self.edit = function()
    {
      self.cur_speak_command.x = self.x;
      self.cur_speak_command.y = self.y;
      self.cur_speak_command.w = self.w;
      self.cur_speak_command.h = self.h;

      self.cur_speak_command.atext = stextToLines(self.cur_speak_command.raw_atext, self.cur_speak_command.w);

      var x = self.cur_speak_command.x;
      var y = self.cur_speak_command.y;

      if(self.cur_speak_command.x + self.cur_speak_command.w/2 > self.src.x + self.src.w/2)
        x += tail_w/2;
      else
        x += self.cur_speak_command.w-tail_w/2;
      y += tail_h+self.cur_speak_command.atext.length*self.cur_speak_command.h+bubble_pad;

      self.cur_speak_command.wx = worldSpaceXpt(my_camera,canv,x);
      self.cur_speak_command.wy = worldSpaceYpt(my_camera,canv,y);
    }
  })();
  self.options_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.cur_speak;
    self.src;
    self.e;
    self.consume_speak = function(e,src,s)
    {
      self.cur_speak = s;
      self.src = src;
      self.e = e;
      self.x = self.cur_speak.options_x;
      self.y = self.cur_speak.options_y;
      self.w = self.cur_speak.options_w;
      self.h = self.cur_speak.options_h;
    }
    self.edit = function()
    {
      self.cur_speak.options_x = self.x;
      self.cur_speak.options_y = self.y;
      self.cur_speak.options_w = self.w;
      self.cur_speak.options_h = self.h;

      for(var i = 0; i < self.cur_speak.options.length; i++)
        self.cur_speak.options[i].qtext = stextToLines(self.cur_speak.options[i].raw_qtext, self.cur_speak.options_w);

      var s = self.cur_speak;
      var n_option_lines = 0;
      for(var i = 0; i < self.e.cache_available_options.length; i++)
        n_option_lines += self.e.cache_available_options[i].qtext.length;

      var x = self.cur_speak.options_x;
      var y = self.cur_speak.options_y;

      if(self.cur_speak.options_x + self.cur_speak.options_w/2 > self.src.x + self.src.w/2)
        x += tail_w/2;
      else
        x += self.cur_speak.options_w-tail_w/2;
      y += tail_h+n_option_lines*self.cur_speak.options_h+bubble_pad;

      self.cur_speak.options_wx = worldSpaceXpt(my_camera,canv,x);
      self.cur_speak.options_wy = worldSpaceYpt(my_camera,canv,y);
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;
    var cur_speak_command = self.cur_speak.commands[self.cur_speak_command_i];
    var src;
    if(cur_speak_command.speaker == SPEAKER_PERSON) src = self.person;
    else                                            src = my_avatar;
    if(!self.edit_o && ptWithinBox(cur_speak_command,evt.doX,evt.doY)) { self.edit_o = self.speak_editor; self.speak_editor.consume_speak_command(src,cur_speak_command); self.cur_speak.dirty = true; }
    if(!self.edit_o && ptWithin(self.cur_speak.options_x,self.cur_speak.options_y,self.cur_speak.options_w,self.cur_speak.options_h,evt.doX,evt.doY)) { self.edit_o = self.options_editor; self.options_editor.consume_speak(self,my_avatar,self.cur_speak); self.cur_speak.dirty = true; }

    if(!self.edit_o) return;

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w)//right 10%
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_o == self.options_editor) self.options_editor.edit();
    if(self.edit_o == self.speak_editor)   self.speak_editor.edit();
    else worldSpace(my_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.hover = function(evt)
  {
    //log hover personview
    my_logger.current_hover_info.o_found = false; //logging parameter
    my_cursor.mode = CURSOR_NORMAL;

    var speak = self.cur_speak;
    var speak_command = self.cur_speak.commands[self.cur_speak_command_i];
    var option;
    self.hovered_option = 0;

    if(self.cur_speak_command_i < self.cur_speak.commands.length-1 || self.inline_option)
    {
      var x = speak_command.x;
      var y = speak_command.y+5;
      var w = speak_command.w;
      var h = speak_command.h*speak_command.atext.length;
      if(ptWithin(x,y,w,h,evt.doX,evt.doY))
        my_cursor.mode = CURSOR_UI;
        my_logger.current_hover_info.o_found = true;
        //log hover no options
        if(!my_logger.current_hover_info.start_time){
          my_logger.current_hover_info.start_time = Date.now(); //acquisition - person hover
          my_logger.current_hover_info.subtype_data = my_logger.get_person_subtype_data(self.cur_speak, self.cur_speak.commands[self.cur_speak_command_i].raw_atext);
        }
    }
    else
    {
      var oyoff;
      oyoff = speak.options_y+5;
      for(var i = 0; i < self.cache_available_options.length; i++)
      {
        option = self.cache_available_options[i];
        for(var j = 0; j < option.qtext.length; j++)
        {
          if(ptWithin(speak.options_x,oyoff,speak.options_w,speak.options_h,evt.doX,evt.doY))
          {
            self.hovered_option = option;
            my_cursor.mode = CURSOR_UI;
            //log hover options
            if(!my_logger.current_hover_info.start_time){
              my_logger.current_hover_info.o_found = true;
              my_logger.current_hover_info.start_time = Date.now(); //acquisition - personOptions_hover    
            }
          }
          oyoff += speak.options_h;
        }
      }
    }
    // TODO
    // push log to server
    if(my_logger.should_log_hover()){
      my_logger.send_log_data_hover(LOG_SUBTYPE_PERSON);
    }

  }
  self.unhover = function(evt)
  {
    self.hovered_option = 0;
  }

  self.click = function(evt)
  {
    //log person view
    self.log_data = my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt), 
      LOG_SUBTYPE_PERSON,
      my_logger.get_person_subtype_data(self.cur_speak, self.cur_speak.commands[self.cur_speak_command_i].raw_atext),
      self.person.fqid
    );
    self.ui_state_t = self.ui_state_t_max[self.ui_state];

    var speak = self.cur_speak;
    var option;
    self.clicked_option = 0;

    if(self.cur_speak_command_i == self.cur_speak.commands.length-1)
    {
      if(self.cache_available_options.length > 1) //multiple options- find
      {
        var oyoff;

        oyoff = speak.options_y+5;
        for(var i = 0; i < self.cache_available_options.length; i++)
        {
          option = self.cache_available_options[i];
          for(var j = 0; j < option.qtext.length; j++)
          {
            if(ptWithin(speak.options_x,oyoff,speak.options_w,speak.options_h,evt.doX,evt.doY))
              self.clicked_option = option;
            oyoff += speak.options_h;
          }
        }
      }
      else if(self.cache_available_options.length == 1) self.clicked_option = self.cache_available_options[0]; //1 options- pick it
      else self.clicked_option = 1; //no options- leave
    }
    else self.clicked_option = 1; //still in chain

    if(self.clicked_option)
    {
      if(self.clicked_option !== 1) //1 == next speak command
      {
        if(self.clicked_option.notifications.length && queryreqs(self.clicked_option, self.clicked_option.notification_reqs)) my_notificationview.consume_notification(self.clicked_option);
        self.clicked_option.pre_met = true;
        self.clicked_option.met = true;
      }
      if(self.ui_state != UI_STATE_OUT)
      {
        self.ui_state_t = 0;
        self.ui_state_p = 0;
        self.ui_state = UI_STATE_OUT;
      }
    }
    my_logger.send_log(self.log_data);
  }

  self.tick = function()
  {
    var speak = self.cur_speak;
    var speak_command = self.cur_speak.commands[self.cur_speak_command_i];
    speak.animcycle_inst.tick();

    speak_command.x = screenSpaceXpt(my_camera,canv,speak_command.wx);
    speak_command.y = screenSpaceYpt(my_camera,canv,speak_command.wy);

    var src;
    if(speak_command.speaker == SPEAKER_PERSON) src = self.person;
    else                                        src = my_avatar;
    if(speak_command.wx > src.wx) speak_command.x += -tail_w/2;
    else                          speak_command.x += -speak_command.w+tail_w/2;
    speak_command.y += -tail_h-speak_command.atext.length*speak_command.h-bubble_pad;

    speak.options_x = screenSpaceXpt(my_camera,canv,speak.options_wx);
    speak.options_y = screenSpaceYpt(my_camera,canv,speak.options_wy);

    var n_option_lines = 0;
    for(var i = 0; i < self.cache_available_options.length; i++)
      n_option_lines += option.qtext.length;

    if(speak.options_wx > my_avatar.wx) speak.options_x += -tail_w/2;
    else                                speak.options_x += -speak.options_w+tail_w/2;
    speak.options_y += -tail_h-n_option_lines*speak.options_h-bubble_pad;

    self.ui_state_t++;
    self.ui_state_p = self.ui_state_t/self.ui_state_t_max[self.ui_state];
    switch(self.ui_state)
    {
      case UI_STATE_IN_SPEAK:
        if(self.ui_state_p >= 1) { self.ui_state = UI_STATE_IN_OPTION; self.ui_state_t = 0; self.ui_state_p = 0; } break;
      case UI_STATE_IN_OPTION:
        if(self.inline_option) self.ui_state_p = 1;
        if(self.ui_state_p >= 1) { self.ui_state = UI_STATE_SELECT;    self.ui_state_t = 0; self.ui_state_p = 0; } break;
      case UI_STATE_SELECT:    break;
      case UI_STATE_OUT:
        if(self.ui_state_p >= 1) self.dismiss();
        break;
    }
  }

  self.draw = function(t)
  {
    if(self.ui_state == UI_STATE_NULL) return;

    var yoff = 0;
    var speak = self.cur_speak;
    var speak_command = self.cur_speak.commands[self.cur_speak_command_i];
    var oyoff;

    var a = 1;
    switch(self.ui_state)
    {
      case UI_STATE_IN_SPEAK:  a = bubble_in_a(self.ui_state_p); yoff = bubble_in_y(self.ui_state_p); break;
      case UI_STATE_IN_OPTION: break;
      case UI_STATE_SELECT:    break;
      case UI_STATE_OUT:       a = bubble_out_a(self.ui_state_p); yoff = bubble_out_y(self.ui_state_p); break;
    }
    ctx.globalAlpha = a;

    ctx.fillStyle = self.bubble_color;
    fillRRect(speak_command.x-bubble_pad-5,speak_command.y-bubble_pad+5+yoff,speak_command.w+bubble_pad*2+10,speak_command.h*speak_command.atext.length+bubble_pad*2+5,bubble_pad,ctx);

    //tail
    var y = speak_command.y-bubble_pad+5+yoff+speak_command.h*speak_command.atext.length+bubble_pad*2+5-0.5;
    var x;
    var w = 20;
    var h = 20;
    if(speak_command.speaker == SPEAKER_PERSON)
      x = clamp(speak_command.x, speak_command.x+speak_command.w-w, self.person.x + self.person.w/2-w/2);
    else
      x = clamp(speak_command.x, speak_command.x+speak_command.w-w, my_avatar.x + my_avatar.w/2-w/2);
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+w/2-2,y+h-2);
    ctx.quadraticCurveTo(x+w/2,y+h,x+w/2+2,y+h-2);
    ctx.lineTo(x+w,y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = self.text_color;
    oyoff = 0;
    for(var j = 0; j < speak_command.atext.length; j++)
    {
      ctx.fillText(speak_command.atext[j],speak_command.x,speak_command.y+yoff+oyoff+speak_command.h);
      oyoff += speak_command.h;
    }

    if(!self.inline_option && self.cur_speak_command_i == self.cur_speak.commands.length-1)
    {
      switch(self.ui_state)
      {
        case UI_STATE_IN_SPEAK:  a = 0; yoff = 100000; break;
        case UI_STATE_IN_OPTION: a = bubble_in_a(self.ui_state_p); yoff = bubble_in_y(self.ui_state_p); break;
        case UI_STATE_SELECT:    break;
        case UI_STATE_OUT:       a = bubble_out_a(self.ui_state_p); yoff = bubble_out_y(self.ui_state_p); break;
      }
      ctx.globalAlpha = a;

      var option;

      oyoff = speak.options_y;
      var h = 0;
      for(var i = 0; i < self.cache_available_options.length; i++) h += self.cache_available_options[i].qtext.length*speak.options_h;
      ctx.fillStyle = self.bubble_color;
      fillRRect(speak.options_x-bubble_pad-5,speak.options_y-bubble_pad+5+yoff,speak.options_w+bubble_pad*2+10,h+bubble_pad*2+5,bubble_pad,ctx);

      //tail
      var y = speak.options_y-bubble_pad+5+yoff+h+bubble_pad*2+5-0.5;
      var x = clamp(speak.options_x, speak.options_x+speak.options_w-w, my_avatar.x + my_avatar.w/2-w/2);
      var w = 20;
      var h = 20;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x+w/2-2,y+h-2);
      ctx.quadraticCurveTo(x+w/2,y+h,x+w/2+2,y+h-2);
      ctx.lineTo(x+w,y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = self.text_color;
      for(var i = 0; i < self.cache_available_options.length; i++)
      {
        option = self.cache_available_options[i];
        if(option == self.hovered_option)
        {
          ctx.fillStyle = self.hover_color;
          ctx.fillRect(speak.options_x-5,yoff+oyoff+5,speak.options_w+5,speak.options_h*option.qtext.length);
          ctx.fillStyle = self.text_color;
        }
        for(var j = 0; j < option.qtext.length; j++)
        {
          ctx.fillText(option.qtext[j],speak.options_x,yoff+oyoff+speak.options_h);
          oyoff += speak.options_h;
        }
        if(i+1 < self.cache_available_options.length)
        {
          ctx.strokeStyle = gray;
          drawLine(speak.options_x,yoff+oyoff+5,speak.options_x+speak.options_w,yoff+oyoff+5,ctx);
        }
      }

    }

    ctx.globalAlpha = 1;

    if(DEBUG)
    {
      ctx.strokeStyle = white;

      yoff = 0;
      oyoff = 0;
      for(var j = 0; j < speak_command.atext.length; j++)
      {
        ctx.strokeRect(speak_command.x,speak_command.y+yoff,speak_command.w,speak_command.h);
        oyoff += speak_command.h;
      }

      oyoff = speak.options_y;
      for(var i = 0; i < self.cache_available_options.length; i++)
      {
        option = self.cache_available_options[i];
        for(var j = 0; j < option.qtext.length; j++)
        {
          ctx.strokeRect(speak.options_x,yoff+oyoff,speak.options_w,speak.options_h);
          oyoff += speak.options_h;
        }
      }

      ctx.fillStyle = red;
      ctx.fillRect(screenSpaceXpt(my_camera,canv,speak_command.wx)-2,screenSpaceYpt(my_camera,canv,speak_command.wy)-2,4,4);
      ctx.fillRect(screenSpaceXpt(my_camera,canv,speak.options_wx)-2,screenSpaceYpt(my_camera,canv,speak.options_wy)-2,4,4);
    }
  }
}

var wildcardview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.wildcard;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
    if(self.wildcard) self.wildcard.resize();
  }
  self.resize();

  self.consume_wildcard = function(wildcard)
  {
    self.wildcard = wildcard;
    if(self.wildcard.notifications.length && queryreqs(self.wildcard, self.wildcard.notification_reqs)) my_notificationview.consume_notification(self.wildcard);
    self.wildcard.pre_met = true;
    self.wildcard.met = true; //technically should wait for dismiss, but can't guarantee dismiss by custom code. needs solution.
    self.wildcard.consume_self(self.wildcard);
  }

  //DRAG DEBUG EDIT STUFF
    self.dragStart  = function(evt) { if(self.wildcard.dragStart)  self.wildcard.dragStart(evt); };
    self.drag       = function(evt) { if(self.wildcard.drag)       self.wildcard.drag(evt);      };
    self.dragFinish = function()    { if(self.wildcard.dragFinish) self.wildcard.dragFinish();   };
  //DRAG DEBUG EDIT STUFF END
  self.hover   = function(evt) 
  { if(self.wildcard.hover)
    {
      my_logger.current_hover_info.o_found = false;
      self.wildcard.hover(evt);
      for(var i = 0; i < my_notebookview.cache_available_entrys.length; i++)
      {
        if(my_notebookview.page == my_notebookview.cache_available_entrys[i].page && my_notebookview.cache_available_entrys[i].interactive && ptWithinBox(my_notebookview.cache_available_entrys[i],evt.doX,evt.doY))
        {
          my_logger.current_hover_info.o_found = true;
          if(!my_logger.current_hover_info.start_time)
          {
            my_logger.current_hover_info.start_time = Date.now(); 
            my_logger.current_hover_info.subtype_data = my_logger.get_wildcard_subtype_data(my_notebookview.cache_available_entrys[i].fqid);
            my_logger.current_hover_info.fqid = self.wildcard.fqid;
          }
        }
      }
      if(my_logger.should_log_hover()){

        my_logger.send_log_data_hover(LOG_SUBTYPE_WILDCARD);
        
      }
    }
  }
  self.unhover = function(evt) { if(self.wildcard.unhover) self.wildcard.unhover(evt); };
  //log wildcard view
  self.click   = function(evt) { 
    if(self.wildcard.click) 
    {
      self.wildcard.click(evt);
      let selected_fqid = '';
      for(var i = 0; i < my_notebookview.cache_available_entrys.length; i++)
        {
          if(my_notebookview.page == my_notebookview.cache_available_entrys[i].page && my_notebookview.cache_available_entrys[i].interactive && ptWithinBox(my_notebookview.cache_available_entrys[i],evt.doX,evt.doY))
          {
            selected_fqid = my_notebookview.cache_available_entrys[i].fqid;
          }
        }
      self.log_data = my_logger.get_log_data(
        LOG_TYPE_CLICK,
        my_logger.get_click_type_data(evt), 
        LOG_SUBTYPE_WILDCARD,
        my_logger.get_wildcard_subtype_data(selected_fqid),
        self.wildcard.fqid
      );
      my_logger.send_log(self.log_data);
    }
    
  }
  self.tick    = function()    { if(self.wildcard.tick)    self.wildcard.tick();       };
  self.draw    = function(t)   { if(self.wildcard.draw)    self.wildcard.draw(t);      };
}


var cutscene_entity = function()
{
  var self = this;
  self.id = "null";
  self.wx = 0;
  self.wy = 0;
  self.wz = 0;
  self.ww = 0;
  self.wh = 0;
  self.animcycle_inst;
  self.blur = 0; //canvas
  self.blur_t = 0; //canvas
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
}

var cutsceneview = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;

  self.cutscene;
  self.cutscene_entitys = [];
  self.t = 0;
  self.end = 0;
  self.scene_to = 0;
  self.selected_scene = 0;
  self.waiting = 0;
  self.command_i = 0;
  self.running_commands = [];
  self.frame_commands = [];
  self.editable_frame_commands = [];
  self.use_quiz = 0;
  self.quiz_state = 0;
  self.hackquiz_t = 0;
  self.quiz_bg_img = GenImg("assets/blank_bg.jpg");
  self.contin_img  = GenImg("assets/continue-button.png");
  self.skip_img = GenImg("assets/skip-button.png");
  self.quiz_btn_img = self.skip_img;
  self.quiz_next_text = "SKIP"
  let w = 240;
  let h = 50;
  let x = 20;
  let y = 220;
  let scale = (490*.25)/264;
  // w = scale*490;
  // h = scale*158;
  w = scale*264 + 20;
  h = scale*156 - 10;
  self.quiz_next_button = new ButtonBox(canv.width-20-w,canv.height-20-h,w,h,function(evt){
    self.reset_quiz();
    // log_quiz(self.quiz) deprecated
  });
  self.quiz_next_button.hover = function(evt) { self.quiz_next_button.hovering = 1; }
  self.quiz_next_button.unhover = function(evt) { self.quiz_next_button.hovering = 0; }
  self.reset_quiz = function(){
    self.use_quiz = 0;
    self.waiting = 0;
    console.log('Finished quiz!')
    my_logger.log_quizend(quiz);
    self.quiz_next_text = "SKIP"
  }
  self.watch_quiz = false;
  self.next_start_quiz = false;


  self.bubble_color = "#242224";
  self.text_color = white;

  self.resize = function()
  {
    self.w = canv.width;
    self.h = canv.height;
  }
  self.resize();
  //log checkpoint
  self.finale_reached = false;
  self.consume_cutscene = function(cutscene)
  {
    self.cutscene = cutscene;
    //analytics hack
    switch(self.cutscene.fqid)
    {
      case "tunic.capitol_0.hall.chap1_finale_c":
      case "tunic.capitol_1.hall.chap2_finale_c":
      case "tunic.capitol_2.hall.chap4_finale_c":
      case "tunic.capitol_3.hall.chap5_finale_c":
        gtag('event', 'finale_reached', { cutscene: self.cutscene.fqid });
        checkpoint_log_data = my_logger.get_log_data(
          LOG_TYPE_CHECKPOINT, my_logger.get_checkpoint_type_data(),
          LOG_SUBTYPE_BASIC, my_logger.get_checkpoint_subtype_data(),
          self.cutscene.fqid);
        my_logger.send_log(checkpoint_log_data);
        
        break;
      default:
        break;
    }
    if(self.cutscene.notifications.length && queryreqs(self.cutscene, self.cutscene.notification_reqs)) my_notificationview.consume_notification(self.cutscene);
    self.cutscene.pre_met = true;
    my_navigable.unlock_content();

    self.cutscene_entitys = [];
    self.t = 0;
    self.end = 0;
    self.scene_to = 0;
    self.selected_scene = 0;
    self.command_i = 0;

    self.frame_commands = [];
    self.editable_frame_commands = [];
    self.running_commands = [];

    my_avatar.cutscene_target_command = 0;
    my_familiar.cutscene_target_command = 0;
    my_camera.cutscene_target_command = 0;

    self.tick();
  }

  self.find_cutscene_entity = function(type, id)
  {
    switch(type)
    {
      case CUTSCENE_ENTITY_CAMERA:
        return my_camera;
      case CUTSCENE_ENTITY_AVATAR:
        return my_avatar;
      case CUTSCENE_ENTITY_FAMILIAR:
        return my_familiar;
      case CUTSCENE_ENTITY_SCENE:
        for(var i = 0; i < cur_room.persons.length; i++)
          if(cur_room.persons[i].id == id) return cur_room.persons[i];
        for(var i = 0; i < cur_room.objects.length; i++)
          if(cur_room.objects[i].id == id) return cur_room.objects[i];
        for(var i = 0; i < cur_room.portholes.length; i++)
          if(cur_room.portholes[i].id == id) return cur_room.portholes[i];
        for(var i = 0; i < cur_room.wildcards.length; i++)
          if(cur_room.wildcards[i].id == id) return cur_room.wildcards[i];
        for(var i = 0; i < cur_room.inerts.length; i++)
          if(cur_room.inerts[i].id == id) return cur_room.inerts[i];
        break;
      case CUTSCENE_ENTITY_CUTSCENE:
        for(var i = 0; i < self.cutscene_entitys.length; i++)
          if(self.cutscene_entitys[i].id == id) return self.cutscene_entitys[i];
        break;
    }
  }

  self.execute_next_command = function()
  {
    var c = self.cutscene.commands[self.command_i];
    self.frame_commands.push(c);
    console.log(self.cutscene.fqid, c.command)
    switch(c.command)
    {
      case CUTSCENE_COMMAND_DESTROY:
      case CUTSCENE_COMMAND_ACT:
      case CUTSCENE_COMMAND_WAIT:
      case CUTSCENE_COMMAND_END:
      case CUTSCENE_COMMAND_AUDIO:
        break;
      case CUTSCENE_COMMAND_TWEEN:
      case CUTSCENE_COMMAND_TARGET:
        if(c.cutscene_target_entity_type != CUTSCENE_ENTITY_NULL) break;
      case CUTSCENE_COMMAND_ANIMATE:
      case CUTSCENE_COMMAND_CREATE:
      case CUTSCENE_COMMAND_CREATE_BLUR:
      case CUTSCENE_COMMAND_SPEAK:
        self.editable_frame_commands.push(c);
        break;
    }
    switch(c.command)
    {
      case CUTSCENE_COMMAND_NULL: break;
      case CUTSCENE_COMMAND_CREATE:
        // hijack here for quizzes
        switch(c.cutscene_entity_id)
        {
          // case "chapter1":
          case "chapter2":
          case "chapter3":
          case "chapter4":
          case "chapter5":
            self.watch_quiz = true;
            switch(c.cutscene_entity_id)
            {
              // case "chapter1":
              //   self.quiz = quiz1
              //   break;
              case "chapter2":
                self.quiz = quiz2
                break;
              case "chapter3":
                self.quiz = quiz3
                break;
              case "chapter4":
                self.quiz = quiz4
                break;
              case "chapter5":
                self.quiz = quiz5
                break;
            }
          default:
            var e = new cutscene_entity();
            e.id = c.cutscene_entity_id;
            e.animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
            e.animcycle_inst.frame_t += c.animcycle_offset_t;
            e.wx = c.wx;
            e.wy = c.wy;
            e.ww = c.ww; if(e.ww < 0) { e.flip = 1; e.ww *= -1; } else e.flip = 0;
            e.wh = c.wh;
            e.a = c.a;
            if(c.cutscene_target_entity_type != CUTSCENE_ENTITY_NULL)
            {
              var te = self.find_cutscene_entity(c.cutscene_target_entity_type, c.cutscene_target_entity_id);
              if(te)
              {
                e.wx = te.wx;
                e.wy = te.wy;
              }
            }
            self.cutscene_entitys.push(e);
            break;
        }
        break;
      case CUTSCENE_COMMAND_CREATE_BLUR:
        var e = new cutscene_entity();
        e.id = c.cutscene_entity_id;
        e.wx = c.wx;
        e.wy = c.wy;
        e.ww = c.ww; if(e.ww < 0) { e.flip = 1; e.ww *= -1; } else e.flip = 0;
        e.wh = c.wh;
        e.a = c.a;
        if(c.cutscene_target_entity_type != CUTSCENE_ENTITY_NULL)
        {
          var te = self.find_cutscene_entity(c.cutscene_target_entity_type, c.cutscene_target_entity_id);
          if(te)
          {
            e.wx = te.wx;
            e.wy = te.wy;
          }
        }
        screenSpace(my_camera,canv,e); //to get true width/height
        e.blur = GenIcon(e.w,e.h);
        e.blur_t = 0;
        self.cutscene_entitys.push(e);
        break;
      case CUTSCENE_COMMAND_DESTROY:
        for(var i = 0; i < self.cutscene_entitys.length; i++)
          if(self.cutscene_entitys[i].id == c.cutscene_entity_id) self.cutscene_entitys.splice(i,1);
        break;
      case CUTSCENE_COMMAND_ANIMATE:
        var e = self.find_cutscene_entity(c.cutscene_entity_type, c.cutscene_entity_id);
        e.animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
        if(c.animcycle_offset_t != CUTSCENE_COMMAND_IGNORE) e.animcycle_inst.frame_t += c.animcycle_offset_t;
        break;
      case CUTSCENE_COMMAND_ACT:
        if(c.cutscene_entity_type != CUTSCENE_ENTITY_SCENE) break;
        var e = self.find_cutscene_entity(c.cutscene_entity_type, c.cutscene_entity_id);
        cur_act = e;
        state_from = state_cur;
        state_cur = STATE_TRANSITION;
        my_loader.unlock_content();
        state_t = 0;
        switch(e.act)
        {
          case ACT_PERSON:      state_to = STATE_PERSON;      my_personview.consume_person(cur_act);           if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_OBJECT:      state_to = STATE_OBJECT;      my_objectview.consume_object(cur_act);           if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_OBSERVATION: state_to = STATE_OBSERVATION; my_observationview.consume_observation(cur_act); if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
          case ACT_WILDCARD:    state_to = STATE_WILDCARD;    my_wildcardview.consume_wildcard(cur_act);       if(AUDIO) playHandlePromise(get_audio(cur_act.audio_id,cur_level.audios).aud); break;
        }
        break;
      case CUTSCENE_COMMAND_SPEAK:
        var e = self.find_cutscene_entity(c.cutscene_entity_type, c.cutscene_entity_id);
        c.cutscene_entity = e;
        c.text = stextToLines(c.raw_text, c.w);
        c.command_state = 0;
        c.command_state_t = 0;
        if(c.animcycle_id && c.animcycle_id != CUTSCENE_COMMAND_IGNORE)
        {
          e.stack_animcycle_inst = gen_animcycle_inst(c.animcycle_id,cur_level.animcycles);
          e.stack_animcycle_t = cur_level.stack_animcycle_t;
          if(c.animcycle_offset_t != CUTSCENE_COMMAND_IGNORE) e.stack_animcycle_inst.frame_t += c.animcycle_offset_t;
        }
        self.waiting = 1;
        self.running_commands.push(c);
        break;
      case CUTSCENE_COMMAND_AUDIO:
        break;
      case CUTSCENE_COMMAND_TWEEN:
        var e = self.find_cutscene_entity(c.cutscene_entity_type, c.cutscene_entity_id);
        c.cutscene_entity = e;
        var te = self.find_cutscene_entity(c.cutscene_target_entity_type, c.cutscene_target_entity_id);
        c.cutscene_target_entity = te;
        if(te)
        {
          c.wx = te.wx;
          c.wy = te.wy;
          if(c.cutscene_entity_type == CUTSCENE_ENTITY_CAMERA)
          {
            c.wx = my_navigable.cam_target_wx(te.wx);
            c.wy = my_navigable.cam_target_wy(te.wy);
          }
        }
        c.from_wx = e.wx;
        c.from_wy = e.wy;
        c.from_wz = e.wz;
        c.from_ww = e.ww;
        c.from_wh = e.wh;
        c.from_a = e.a;
        if(c.cutscene_entity_type == CUTSCENE_ENTITY_AVATAR)   { e.to_wx = c.wx; e.to_wy = c.wy; }
        if(c.cutscene_entity_type == CUTSCENE_ENTITY_FAMILIAR) { e.to_wx = c.wx; e.to_wy = c.wy; }
        if(c.t >= c.end_t)
        {
          //perform immediate
          if(c.wx != CUTSCENE_COMMAND_IGNORE) e.wx = c.wx;
          if(c.wy != CUTSCENE_COMMAND_IGNORE) e.wy = c.wy;
          if(c.wz != CUTSCENE_COMMAND_IGNORE) e.wz = c.wz;
          if(c.ww != CUTSCENE_COMMAND_IGNORE) { e.ww = c.ww; if(e.ww < 0) { e.flip = 1; e.ww *= -1; } else e.flip = 0; }
          if(c.wh != CUTSCENE_COMMAND_IGNORE) e.wh = c.wh;
          if(c.a  != CUTSCENE_COMMAND_IGNORE) e.a  = c.a;
        }
        else
          self.running_commands.push(c);
        break;
      case CUTSCENE_COMMAND_TARGET:
        var e = self.find_cutscene_entity(c.cutscene_entity_type, c.cutscene_entity_id);
        var te = self.find_cutscene_entity(c.cutscene_target_entity_type, c.cutscene_target_entity_id);
        if(!te) te = {wx:c.wx,wy:c.wy};
        c.cutscene_target_entity = te;
        e.cutscene_target_command = c;
        if(c.cutscene_entity_type == CUTSCENE_ENTITY_AVATAR)   { e.to_wx = te.wx; e.to_wy = te.wy; }
        break;
      case CUTSCENE_COMMAND_WAIT:
        self.waiting = 1;
        break;
      case CUTSCENE_COMMAND_END:
        self.end = 1;
        break;
      case CUTSCENE_COMMAND_LOAD_SCENE:
        self.scene_to = c.cutscene_entity_id;
        self.end = 1;
        break;
    }
    self.command_i++;
    if(self.command_i >= self.cutscene.commands.length) self.end = 1;
    if(self.watch_quiz && c.command == CUTSCENE_COMMAND_TWEEN && c.cutscene_entity_id == 'black' && QUIZ_GLOBAL_SHOW){
      self.next_start_quiz = true
    }
    if(self.next_start_quiz){
      self.waiting = 1;
      self.use_quiz = 1;
      my_logger.log_quizstart(self.quiz)
      self.quiz_state = 0;
      self.hackquiz_t = 0;
      self.watch_quiz = false;
      self.next_start_quiz = false;
    }
  }

  //DRAG DEBUG EDIT STUFF
  self.edit_cur_dragging = false;
  self.edit_cur_resizing = false;
  self.edit_offX;
  self.edit_offY;
  self.edit_o = 0;
  self.speak_editor = new (function()
  {
    var self = this;
    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;
    self.cur_speak;
    self.consume_speak = function(s)
    {
      self.cur_speak = s;
      self.x = self.cur_speak.x;
      self.y = self.cur_speak.y;
      self.w = self.cur_speak.w;
      self.h = self.cur_speak.h;
    }
    self.edit = function()
    {
      self.cur_speak.x = self.x;
      self.cur_speak.y = self.y;
      self.cur_speak.w = self.w;
      self.cur_speak.h = self.h;
      self.cur_speak.text = stextToLines(self.cur_speak.raw_text, self.w);

      var x = self.cur_speak.x;
      var y = self.cur_speak.y;

      if(self.cur_speak.x + self.cur_speak.w/2 > self.cur_speak.cutscene_entity.x + self.cur_speak.cutscene_entity.w/2)
        x += tail_w/2;
      else
        x += self.cur_speak.w-tail_w/2;
      y += tail_h+self.cur_speak.text.length*self.cur_speak.h+bubble_pad;

      self.cur_speak.wx = worldSpaceXpt(my_camera,canv,x);
      self.cur_speak.wy = worldSpaceYpt(my_camera,canv,y);
    }
  })();
    self.dragStart = function(evt)
  {
    self.edit_o = 0;

    for(var i = 0; i < self.editable_frame_commands.length; i++)
    {
      var c = self.editable_frame_commands[i];
      if(!self.edit_o && ptWithinBox(c,evt.doX,evt.doY))
      {
        if(c.command == CUTSCENE_COMMAND_SPEAK)
        {
          self.edit_o = self.speak_editor;
          self.speak_editor.consume_speak(c);
          self.cutscene.dirty = true;
        }
        else
        {
          self.edit_o = c;
          self.cutscene.dirty = true;
        }
      }
    }

    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_offX > 0.4*self.edit_o.w && (self.edit_o == self.speak_editor || self.edit_offY > 0.4*self.edit_o.h))
      self.edit_cur_resizing = true
    else
      self.edit_cur_dragging = true;
  };
    self.drag = function(evt)
  {
    if(!self.edit_o) return;
    self.deltaX = (evt.doX-(self.edit_o.x+(self.edit_o.w/2)))-self.edit_offX;
    self.deltaY = (evt.doY-(self.edit_o.y+(self.edit_o.h/2)))-self.edit_offY;

    if(self.edit_cur_dragging)
    {
      self.edit_o.x += self.deltaX;
      self.edit_o.y += self.deltaY;
    }
    else if(self.edit_cur_resizing)
    {
      self.edit_o.w += self.deltaX;
      if(self.edit_o != self.speak_editor) self.edit_o.h += self.deltaY;
    }

    self.edit_offX = evt.doX-(self.edit_o.x+(self.edit_o.w/2));
    self.edit_offY = evt.doY-(self.edit_o.y+(self.edit_o.h/2));

    if(self.edit_o == self.speak_editor)   self.speak_editor.edit();
    else worldSpace(my_camera,canv,self.edit_o);
  };
    self.dragFinish = function()
  {
    self.edit_o = 0;
    self.edit_cur_dragging = false;
    self.edit_cur_resizing = false;
  };
  //DRAG DEBUG EDIT STUFF END

  self.click = function(evt)
  {
    self.log_data = my_logger.get_log_data(
      LOG_TYPE_CLICK,
      my_logger.get_click_type_data(evt), 
      LOG_SUBTYPE_CUTSCENE,
      // use command_i-1 below, since the index is for the text about to be displayed
      
      my_logger.get_cutscene_subtype_data(self.cutscene, self.cutscene.commands[self.command_i ? self.command_i - 1 : 0].raw_text),
      self.cutscene.fqid
    );
    if(self.use_quiz){
      if(self.hackquiz_t >= 1) //keep in sync with draw!
      {
        var qh = canv.height/(self.quiz.questions.length+1);
        var y = qh-qh/2;
        for(var i = 0; i <= self.quiz_state && i < self.quiz.questions.length; i++)
        {
          var q = self.quiz.questions[i];
          var aw = canv.width/(q.a.length+1);
          var x = aw;
          for(var j = 0; j < q.a.length; j++)
          {
            let box = {
              x: x-aw/2,
              y: y-text_h/2,
              w: aw,
              h: text_h*2
            }
            if(ptWithinBox(box, evt.doX, evt.doY)){
              q.aclick[j]();
              if(self.quiz.questions[self.quiz.questions.length - 1].response != -1){
                // if answered the last question
                  // self.quiz_next_button.w = 290;
                  self.quiz_btn_img = self.contin_img;
                  self.quiz_next_text = "CONTINUE"
              }
            }
            if (q.response != -1) {
              self.quiz_state = Math.max(self.quiz_state, i+1); // if the question got a response, make sure state points to at least the next question.
            }
            x += aw;
          }
          y += qh;
        }
      }
      if(ptWithinBox(self.quiz_next_button, evt.doX, evt.doY)){
        console.log('continue!');
        self.reset_quiz();
      }
    }
    else{
      self.waiting = 0;
      for(var i = 0; i < self.running_commands.length; i++)
      {
        var c = self.running_commands[i];
        if(c.command == CUTSCENE_COMMAND_SPEAK)
        {
          if(c.command_state != 2)
          {
            c.command_state = 2;
            c.command_t = 0;
          }
        }
      }
    }
    my_logger.send_log(self.log_data);
  }

  self.hover = function(evt)
  {
  }
  self.unhover = function(evt)
  {
  }

  self.tick = function()
  {
    while(!self.end && self.command_i < self.cutscene.commands.length && self.cutscene.commands[self.command_i].t <= self.t && !self.waiting && (self.cutscene.commands[self.command_i].t <= 0 || state_cur == STATE_CUTSCENE))
      self.execute_next_command();
    for(var i = 0; i < self.editable_frame_commands.length; i++)
    {
      var c = self.editable_frame_commands[i];
      if(c.command != CUTSCENE_COMMAND_SPEAK) //SPEAK will get set anyway
        screenSpace(my_camera, canv, c);
    }

    if(my_camera.cutscene_target_command)
    {
      my_camera.wx = lerp(my_camera.wx,my_navigable.cam_target_wx(my_camera.cutscene_target_command.cutscene_target_entity.wx),cur_level.target_lerp_s);
      my_camera.wy = lerp(my_camera.wy,my_navigable.cam_target_wy(my_camera.cutscene_target_command.cutscene_target_entity.wy),cur_level.target_lerp_s);
    }
    if(my_avatar.cutscene_target_command)
    {
      my_avatar.to_wx = my_avatar.cutscene_target_command.cutscene_target_entity.wx;
      my_avatar.to_wy = my_avatar.cutscene_target_command.cutscene_target_entity.wy;
    }
    if(my_familiar.cutscene_target_command)
    {
      my_familiar.to_wx = my_familiar.cutscene_target_command.cutscene_target_entity.wx;
      my_familiar.to_wy = my_familiar.cutscene_target_command.cutscene_target_entity.wy;
    }

    for(var i = 0; !self.end && i < self.running_commands.length; i++)
    {
      var c = self.running_commands[i];
      if(c.command == CUTSCENE_COMMAND_TWEEN)
      {
        var e = c.cutscene_entity;
        var t = min(1,invlerp(c.t,c.end_t,self.t));
        if(c.t >= c.end_t) t = 1;
        if(c.wx != CUTSCENE_COMMAND_IGNORE) e.wx = lerp(c.from_wx,c.wx,t);
        if(c.wy != CUTSCENE_COMMAND_IGNORE) e.wy = lerp(c.from_wy,c.wy,t);
        if(c.wz != CUTSCENE_COMMAND_IGNORE) e.wz = lerp(c.from_wz,c.wz,t);
        if(c.ww != CUTSCENE_COMMAND_IGNORE) { e.ww = lerp(c.from_ww,c.ww,t); if(e.ww < 0) { e.flip = 1; e.ww *= -1; } else e.flip = 0; }
        if(c.wh != CUTSCENE_COMMAND_IGNORE) e.wh = lerp(c.from_wh,c.wh,t);
        if(c.a  != CUTSCENE_COMMAND_IGNORE) e.a  = lerp(c.from_a,c.a,t);
        if(t == 1)
        {
          self.running_commands.splice(i,1);
          i--;
        }
      }
      else if(c.command == CUTSCENE_COMMAND_SPEAK)
      {
        c.x = screenSpaceXpt(my_camera,canv,c.wx);
        c.y = screenSpaceYpt(my_camera,canv,c.wy);

        if(c.wx > c.cutscene_entity.wx) c.x += -tail_w/2;
        else                            c.x += -c.w+tail_w/2;
        c.y += -tail_h-c.text.length*c.h-bubble_pad;

        c.command_t++;
        if(c.command_state != 1 && c.command_t > 30) c.command_state++;
        if(c.command_state == 3)
        {
          self.running_commands.splice(i,1)
          for(var j = 0; j < self.editable_frame_commands.length; j++)
            if(c == self.editable_frame_commands[j])
              self.editable_frame_commands.splice(j,1);
          i--;
        }
      }
    }

    for(var i = 0; i < self.cutscene_entitys.length; i++)
      if(self.cutscene_entitys[i].animcycle_inst) self.cutscene_entitys[i].animcycle_inst.tick();

    if((!DEBUG || CUTSCENE_ADVANCE) && state_cur == STATE_CUTSCENE && !self.waiting)
    {
      self.frame_commands = [];
      self.editable_frame_commands = [];
      self.t++;
    }
    CUTSCENE_ADVANCE = 0;

    if(self.end)
    {
      self.cutscene.met = true;
      self.cutscene_entitys = [];
      self.frame_commands = [];
      self.editable_frame_commands = [];
      self.running_commands = [];

      state_from = state_cur;
      state_stack = STATE_NAV;
      act_stack = 0;
      state_to = state_stack;
      state_cur = STATE_TRANSITION;
      my_loader.unlock_content();
      my_avatar.stack_animcycle_t = 0;
      state_t = 0;

      if(self.scene_to)
      {
        self.selected_scene = find(cur_level.id+"."+self.scene_to);
        self.selected_scene.pre_met = true;
        state_to = STATE_NAV; //force nav- unreliable to use stack. WONKY
        state_t = 0.499999; //skip fadeout, but needs 1 tick < 0.5. WONKY
      }
    }
    if(self.use_quiz)
    {
      self.hackquiz_t += 0.01;
    }
  }

  var mul_table = [
      512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
      454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
      482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
      437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
      497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
      320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
      446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
      329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
      505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
      399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
      324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
      268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
      451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
      385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
      332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
      289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
  var shg_table = [
      9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
      17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];
  function BlurStack()
  {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
  }
  var blur = function(canvas,radius)
  {
    if(radius == 0) return;
    var imageData = canvas.context.getImageData(0,0,canvas.width,canvas.height);
    var pixels = imageData.data;

    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;

    var width = canvas.width;
    var height = canvas.height;
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackIn = null;
    var stackOut = null;
    var stackEnd;
    for(i = 1; i < div; i++)
    {
        stack = stack.next = new BlurStack();
        if(i == radiusPlus1) stackEnd = stack;
    }
    stack.next = stackStart;

    yw = yi = 0;

    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];

    for(y = 0; y < height; y++)
    {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++)
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }

        for (i = 1; i < radiusPlus1; i++)
        {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = (pg = pixels[p+1])) * rbs;
            b_sum += (stack.b = (pb = pixels[p+2])) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;

            stack = stack.next;
        }


        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++)
        {
            pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
            pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;

            p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

            r_in_sum += (stackIn.r = pixels[p]);
            g_in_sum += (stackIn.g = pixels[p+1]);
            b_in_sum += (stackIn.b = pixels[p+2]);

            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;

            stackIn = stackIn.next;

            r_out_sum += (pr = stackOut.r);
            g_out_sum += (pg = stackOut.g);
            b_out_sum += (pb = stackOut.b);

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;

            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }


    for(x = 0; x < width; x++)
    {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++)
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }

        yp = width;

        for (i = 1; i <= radius; i++)
        {
            yi = (yp + x) << 2;

            r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = (pg = pixels[yi+1])) * rbs;
            b_sum += (stack.b = (pb = pixels[yi+2])) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;

            stack = stack.next;

            if(i < heightMinus1)
            {
                yp += width;
            }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++)
        {
            p = yi << 2;
            pixels[p]   = (r_sum * mul_sum) >> shg_sum;
            pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[p+2] = (b_sum * mul_sum) >> shg_sum;

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;

            p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

            r_sum += (r_in_sum += (stackIn.r = pixels[p]));
            g_sum += (g_in_sum += (stackIn.g = pixels[p+1]));
            b_sum += (b_in_sum += (stackIn.b = pixels[p+2]));

            stackIn = stackIn.next;

            r_out_sum += (pr = stackOut.r);
            g_out_sum += (pg = stackOut.g);
            b_out_sum += (pb = stackOut.b);

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;

            stackOut = stackOut.next;

            yi += width;
        }
    }

    canvas.context.putImageData(imageData,0,0);
  }

  self.draw = function(t)
  {
    let drawQuizQuestion = function(q, y) {
      var aw = canv.width/(q.a.length+1);
      var x = aw;
      ctx.fillStyle = white;
      ctx.fillText(q.q,canv.width/2,y-text_h/2);
      for(var j = 0; j < q.a.length; j++)
      {
        if(q.response == j) ctx.fillStyle = gray;
        else                ctx.fillStyle = white;
        ctx.fillText(q.a[j],x,y+text_h);
        //ctx.strokeStyle = green; ctx.strokeRect(x-aw/2,y-text_h/2,aw,text_h*2); //debug hitboxes
        x += aw;
      }
    }
  
    if(self.use_quiz)
    {
      ctx.fillStyle = black;
      ctx.globalAlpha = min(1,self.hackquiz_t);
      // ctx.fillRect(0,0,canv.width,canv.height);
      // ctx.drawImage()
      ctx.drawImage(self.quiz_bg_img,0,0,canv.width,canv.height);
      ctx.globalAlpha = 1;
      if(self.hackquiz_t >= 1)
      {
        ctx.textAlign = "center";
        var qh = canv.height/(self.quiz.questions.length+1);
        var y = qh-qh/2;
        for(var i = 0; i <= self.quiz_state && i < self.quiz.questions.length; i++)
        {
          var q = self.quiz.questions[i];
          drawQuizQuestion(q, y);
          y += qh;
        }
        ctx.fillStyle = white;
        ctx.textAlign = "right";
        // ctx.fillText("Continue",10,canv.height-10);
        // if (self.quiz_state >= quiz.questions.length) {
        // drawImageBox(self.quiz_btn_img,self.quiz_next_button,ctx); // image graphic
        ctx.fillText(self.quiz_next_text, canv.width-20,canv.height-20)
        // }
        //ctx.strokeStyle = green; ctx.strokeRect(10,canv.height-10-text_h,text_h*10,text_h); //debug continue hitbox
        // ctx.fillStyle = black;
        // if(self.hackquiz_t < 2)
        // {
        //   ctx.globalAlpha = 1-(self.hackquiz_t-1);
        //   ctx.fillRect(0,0,canv.width,canv.height);
        //   ctx.globalAlpha = 1;
        // }
        ctx.textAlign = "left";

      }
    }

    else{
      //bubble sort on z
      var sorted = false;
      while(!sorted)
      {
        sorted = true;
        for(var i = 0; i < self.cutscene_entitys.length-1; i++)
        {
          var entity = self.cutscene_entitys[i];
          var nentity = self.cutscene_entitys[i+1];
          if(entity.wz > nentity.wz)
          {
            self.cutscene_entitys[i] = nentity;
            self.cutscene_entitys[i+1] = entity;
            sorted = false;
          }
        }
      }

      for(var i = 0; i < self.cutscene_entitys.length; i++)
      {
        var entity = self.cutscene_entitys[i];
        screenSpace(my_camera,canv,entity);
        if(entity.stack_animcycle_t) entity.stack_animcycle_t--;
        if(entity.a == CUTSCENE_COMMAND_IGNORE || entity.a > 0)
        {
          if(entity.blur)
          {
            if(entity.blur_t == 0)
            {
              entity.blur.context.filter = "blur("+(entity.a*10)+"px)";
              drawCanvMaskedImage(canv.canvas, -entity.x, -entity.y, canv.width, canv.height, entity.blur, entity.blur.context);
              //blur(entity.blur,round(entity.a*5));
            }
            ctx.drawImage(entity.blur,entity.x,entity.y,entity.w,entity.h);
            entity.blur_t = (entity.blur_t+1)%2;
          }
          else
          {
            ctx.save();
            if(entity.a != CUTSCENE_COMMAND_IGNORE) ctx.globalAlpha = entity.a;
            ctx.translate(entity.x+entity.w/2,entity.y+entity.h/2);
            if(entity.flip) ctx.scale(-1,1);
            if(entity.stack_animcycle_t && entity.stack_animcycle_t > 0 && entity.stack_animcycle_inst)
              ctx.drawImage(entity.stack_animcycle_inst.img,-entity.w/2,-entity.h/2,entity.w,entity.h);
            else
              ctx.drawImage(entity.animcycle_inst.img,-entity.w/2,-entity.h/2,entity.w,entity.h);
            ctx.restore();
          }
        }
      }

      for(var i = 0; i < self.running_commands.length; i++)
      {
        var c = self.running_commands[i];
        if(c.command == CUTSCENE_COMMAND_SPEAK)
        {
          var a = 1;
          var yoff = 0;
          if(c.command_state == 0)
          {
            var t = c.command_t/30;
            a = bubble_in_a(t);
            yoff = bubble_in_y(t);
          }
          if(c.command_state == 2)
          {
            var t = c.command_t/30;
            a = bubble_out_a(t);
            yoff = bubble_out_y(t);
          }
          ctx.globalAlpha = a;

          ctx.fillStyle = self.bubble_color;
          fillRRect(c.x-bubble_pad-5,c.y-bubble_pad+5+yoff,c.w+bubble_pad*2+10,c.h*c.text.length+bubble_pad*2+5,bubble_pad,ctx);

          //tail
          var y = c.y-bubble_pad+5+yoff+c.h*c.text.length+bubble_pad*2+5-0.5;
          var x;
          var e = c.cutscene_entity;
          x = clamp(c.x, c.x+c.w-tail_w, e.x + e.w/2-tail_w/2);
          ctx.beginPath();
          ctx.moveTo(x,y);
          ctx.lineTo(x+tail_w/2-2,y+tail_h-2);
          ctx.quadraticCurveTo(x+tail_w/2,y+tail_h,x+tail_w/2+2,y+tail_h-2);
          ctx.lineTo(x+tail_w,y);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = self.text_color;
          var oyoff = 0;
          for(var j = 0; j < c.text.length; j++)
          {
            ctx.fillText(c.text[j],c.x,c.y+yoff+oyoff+c.h);
            oyoff += c.h;
          }

          ctx.globalAlpha = 1;
        }
      }

      if(DEBUG)
      {
        for(var i = 0; i < self.editable_frame_commands.length; i++)
        {
          var c = self.editable_frame_commands[i];
          ctx.strokeStyle = magenta;
          if(c.command != CUTSCENE_COMMAND_SPEAK)
            strokeBox(c,ctx);
          else
          {
            ctx.strokeStyle = white;
            var yoff = 0;
            for(var j = 0; j < c.text.length; j++)
            {
              ctx.strokeRect(c.x,c.y+yoff,c.w,c.h);
              oyoff += c.h;
            }
            ctx.fillStyle = red;
            ctx.fillRect(screenSpaceXpt(my_camera,canv,c.wx)-2,screenSpaceYpt(my_camera,canv,c.wy)-2,4,4);
          }
        }

        ctx.strokeStyle = magenta;
        for(var i = 0; i < self.cutscene_entitys.length; i++)
          strokeBox(self.cutscene_entitys[i],ctx);
      }

    }
  }

  //playback vars
  self.t = 0;
  self.content = [];
}

