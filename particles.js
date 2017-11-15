

/* ---- /1iD5ZQJMNXu43w1qLB8sfdHVKppVMduGz/js/Particles.coffee ---- */


(function() {
  var Particles, init,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Particles = (function() {
    function Particles() {
      this.resize = bind(this.resize, this);
      this.update = bind(this.update, this);
      this.renderer = PIXI.autoDetectRenderer(1024, 768, {
        backgroundColor: 0x3F51B5,
        antialias: true,
        failIfMajorPerformanceCaveat: true
      });
      this.renderer.view.className = "particles";
      this.renderer.autoResize = true;
      this.renderer.view.style["transform"] = "translatez(0)";
      PIXI.ticker.shared.stop();
      this.renderer.plugins.interaction.destroy();
      document.body.appendChild(this.renderer.view);
      this.sprites = new PIXI.ParticleContainer(500, {
        scale: true,
        position: true,
        rotation: false,
        uvs: false,
        alpha: false
      });
      this.container = new PIXI.Container();
      this.stage = new PIXI.Container();
      this.bg = null;
      this.running = true;
      if (navigator.userAgent.indexOf("Android") > 0) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.speed = 1;
      this.fps_timer = null;
      this.fps = 0;

      /*
      		@bg = new PIXI.Graphics()
      		@bg.beginFill(0x150A45, 1)
      		@bg.lineStyle(1, 0x150A45, 0.5)
      		@bg.drawCircle(10,10,20,20)
      		@bg.endFill()
      		@bg.cacheAsBitmap = true
      		@bg.scale.x = 10
      		@bg.scale.y = 10
       */
      this.container.addChild(this.sprites);
      this.stage.addChild(this.container);
    }

    Particles.prototype.createBlur = function() {
      var blur_x, blur_y, canvas, ctx, i, j, mask;
      this.blured = new PIXI.Container();
      this.render_texture = new PIXI.RenderTexture(this.renderer, this.width, this.height);
      this.output_sprite = new PIXI.Sprite(this.render_texture);
      canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 400;
      ctx = canvas.getContext('2d');
      ctx.lineJoin = "round";
      ctx.lineWidth = 60;
      ctx.shadowBlur = 40;
      ctx.shadowColor = ctx.fillStyle = ctx.strokeStyle = "#FFF";
      for (i = j = 0; j <= 5; i = ++j) {
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100, 350);
        ctx.lineTo(600, 350);
        ctx.lineTo(600, 100);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
      this.bg = new PIXI.Graphics();
      this.bg.beginFill(0x3F51B5, 1);
      this.bg.drawRect(0, 0, 700, 400);
      this.bg.endFill();
      mask = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
      this.bg.scale.y = 1;
      this.bg.scale.x = 1;
      this.bg.mask = mask;
      this.bg.addChild(mask);
      this.bg.position.x = this.width / 2 - (this.bg.width / 2);
      this.bg.position.y = this.height / 2 - (this.bg.height / 2) - 10;
      this.blured.addChild(this.bg);
      this.blured.addChild(this.output_sprite);
      blur_x = new PIXI.filters.BlurFilter();
      blur_y = new PIXI.filters.BlurYFilter();
      blur_x.blur = blur_y.blur = 3;
      blur_x.passes = blur_y.passes = 2;
      this.output_sprite.filters = [blur_x, blur_y];
      return this.stage.addChild(this.blured);
    };

    Particles.prototype.addPeers = function() {
      var c, g, i, j, num, peer, ref, texture;
      this.peers = [];
      c = new PIXI.Circle(0, 0, 3);
      g = new PIXI.Graphics();
      g.beginFill(0xFFFFFF, 1);
      g.drawShape(c);
      g.endFill();
      texture = g.generateTexture();
      if (window.innerWidth < 1000) {
        num = 50;
      } else {
        num = 100;
      }
      for (i = j = 1, ref = num; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        peer = new PIXI.Sprite(texture);
        peer.position.x = Math.random() * this.width;
        peer.position.y = Math.random() * this.height;
        peer.speed = {
          x: 0.5 - Math.random(),
          y: 0.5 - Math.random(),
          scale: (Math.random()) / 50
        };
        peer.anchor.set(0.5);
        this.sprites.addChild(peer);
        this.peers.push(peer);
      }
      this.lines = new PIXI.Graphics();
      return this.container.addChild(this.lines);
    };

    Particles.prototype.update = function() {
      var distance, j, k, len, len1, lines, other, peer, peer_x, peer_y, ref, ref1;
      this.fps += 1;
      lines = this.lines;
      lines.clear();
      ref = this.peers;
      for (j = 0, len = ref.length; j < len; j++) {
        peer = ref[j];
        peer.position.x += peer.speed.x * this.speed;
        peer.position.y += peer.speed.y * this.speed;
        peer_x = peer.position.x;
        peer_y = peer.position.y;
        if (Math.random() > 0.9) {
          peer.scale.x += peer.speed.scale;
          peer.scale.y = peer.scale.x;
          if (peer.scale.x > 1 || peer.scale.x < 0.3) {
            peer.speed.scale = 0 - peer.speed.scale;
          }
        }
        if (peer_x > this.width + 100 || peer_x < -100) {
          if (peer.speed.x > 0) {
            peer.position.x = -100;
          } else {
            peer.position.x = this.width + 100;
          }
          peer.position.y = Math.random() * this.height;
        }
        if (peer_y > this.height + 100 || peer_y < -100) {
          peer.position.x = Math.random() * this.width;
          if (peer.speed.y > 0) {
            peer.position.y = -100;
          } else {
            peer.position.y = this.height + 100;
          }
        }
        ref1 = this.peers;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          other = ref1[k];
          distance = Math.max(Math.abs(peer_x - other.position.x), Math.abs(peer_y - other.position.y));
          if (distance < 100) {
            lines.lineStyle(1, 0xFFFFFF, 1 - distance / 100);
            lines.moveTo(peer_x, peer_y);
            lines.lineTo(other.position.x, other.position.y);
          }
        }
      }
      this.render_texture.render(this.container, null, true);
      this.renderer.render(this.stage);
      if (!this.running) {
        this.speed -= 0.01;
      } else if (this.speed < 1) {
        this.speed = Math.min(1, this.speed + 0.01);
      }
      if (this.speed > 0.01) {
        return requestAnimationFrame(this.update);
      }
    };

    Particles.prototype.resize = function() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.resize(this.width, this.height);
      if (this.bg) {
        this.bg.position.x = this.width / 2 - (this.bg.width / 2);
        return this.bg.position.y = this.height / 2 - (this.bg.height / 2);
      }
    };

    Particles.prototype.start = function() {
      if (this.disabled) {
        return false;
      }
      this.running = true;
      this.speed = Math.max(0.02, this.speed);
      clearInterval(this.fps_timer);
      console.log("Start");
      this.fps_timer = setInterval(((function(_this) {
        return function() {
          if (_this.fps < 25 * 3 && _this.fps > 0) {
            _this.disabled = true;
            _this.speed = 0;
            _this.stop();
            console.log("Low FPS: " + (_this.fps / 3) + ", Disabling animation...");
          }
          return _this.fps = 0;
        };
      })(this)), 3000);
      return this.update();
    };

    Particles.prototype.stop = function() {
      clearInterval(this.fps_timer);
      return this.running = false;
    };

    return Particles;

  })();

  init = function() {
    window.particles = new Particles();
    particles.resize();
    particles.createBlur();
    particles.addPeers();
    if (particles.disabled) {
      particles.running = true;
      particles.speed = 0;
      particles.update();
    } else {
      particles.start();
    }
    $(".particles").css("opacity", 1);
    return $(window).on("resize", particles.resize);
  };

  if (window.innerHeight > 200) {
    setTimeout(init, 20);
  } else {
    setTimeout(init, 100);
  }

  setInterval((function() {
    var focus;
    focus = document.hasFocus();
    if (focus && particles.running === false) {
      particles.start();
    }
    if (!focus && particles.running === true) {
      return particles.stop();
    }
  }), 2000);

}).call(this);