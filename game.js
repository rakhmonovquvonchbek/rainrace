(function () {
  "use strict";

  var MUTE_KEY = "rainrace-mute";
  var PB_KEY = "rainrace-pb";
  var HIST_KEY = "rainrace-history";
  var SET_KEY = "rainrace-settings";
  var PENALTY_S = 0.42;
  var ROLL_MS = 2000;
  var MAX_EXTRAS = 14;
  var MAX_HIST = 20;

  var DIFF_COPY = {
    starter: "100 most common English words · easy on-ramp",
    common: "Top 300 English words · a steady night drive",
    steady: "Top 1000 English words · longer stretch of road"
  };

  var RIVALS = [
    { id: "nimbo", name: "Nimbo", color: "#7aa2ff", baseWpm: 36, variance: 5, wobble: 0.55, phase: 0.4 },
    { id: "squall", name: "Squall", color: "#ffb86b", baseWpm: 46, variance: 7, wobble: 0.8, phase: 1.7 },
    { id: "gale", name: "Gale", color: "#ff79c6", baseWpm: 55, variance: 6, wobble: 0.62, phase: 2.9 }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function storeGet(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function storeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function loadJson(key, fallback) {
    try {
      var raw = storeGet(key, "");
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function modeKey(diff, count) {
    return diff + "-" + count;
  }

  function poolFor(diff) {
    var n = (WORD_TIERS && WORD_TIERS[diff]) || 300;
    var src = typeof RAIN_WORDS !== "undefined" ? RAIN_WORDS : ["the", "rain", "night", "drive"];
    return src.slice(0, Math.min(n, src.length));
  }

  function pickWords(diff, count) {
    var pool = poolFor(diff);
    var out = [];
    var last = "";
    var i;
    for (i = 0; i < count; i++) {
      var w = pool[Math.floor(Math.random() * pool.length)];
      var guard = 0;
      while (w === last && pool.length > 1 && guard++ < 8) {
        w = pool[Math.floor(Math.random() * pool.length)];
      }
      out.push(w);
      last = w;
    }
    return out;
  }

  function speedFromWpm(wpm) {
    var capped = clamp(wpm, 0, 60);
    return 0.35 + (capped / 60) * 5;
  }

  function formatTime(ms) {
    var s = ms / 1000;
    if (s < 60) return s.toFixed(2) + "s";
    var m = Math.floor(s / 60);
    var rem = s - m * 60;
    return m + ":" + (rem < 10 ? "0" : "") + rem.toFixed(1);
  }

  function ordinal(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return n + "th";
  }

  /* ---------- audio ---------- */
  function AudioBus() {
    this.ctx = null;
    this.master = null;
    this.ready = false;
    this.muted = storeGet(MUTE_KEY, "0") === "1";
    this.engine = null;
    this.rainNodes = null;
  }

  AudioBus.prototype.unlock = function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      this._startRain();
      this._startEngine();
      this.ready = true;
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  };

  AudioBus.prototype.setMuted = function (muted) {
    this.muted = muted;
    storeSet(MUTE_KEY, muted ? "1" : "0");
    if (this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.55, this.ctx.currentTime, 0.03);
    }
  };

  AudioBus.prototype._noise = function (seconds) {
    var sr = this.ctx.sampleRate;
    var n = Math.floor(sr * seconds);
    var buf = this.ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;
    for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };

  AudioBus.prototype._startRain = function () {
    var ctx = this.ctx;
    var buf = this._noise(3.2);
    function layer(hp, lp, gain, rate) {
      var src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.playbackRate.value = rate;
      var hi = ctx.createBiquadFilter();
      hi.type = "highpass";
      hi.frequency.value = hp;
      var lo = ctx.createBiquadFilter();
      lo.type = "lowpass";
      lo.frequency.value = lp;
      var g = ctx.createGain();
      g.gain.value = gain;
      src.connect(hi);
      hi.connect(lo);
      lo.connect(g);
      g.connect(this.master);
      src.start();
      return { src: src, gain: g, lo: lo };
    }
    this.rainNodes = [
      layer.call(this, 400, 2800, 0.045, 1),
      layer.call(this, 1200, 8000, 0.028, 1.15)
    ];
  };

  AudioBus.prototype._startEngine = function () {
    var ctx = this.ctx;
    var osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 52;
    var osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 78;
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 4;
    var g = ctx.createGain();
    g.gain.value = 0.03;
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    osc.start();
    osc2.start();
    this.engine = { osc: osc, osc2: osc2, filter: filter, gain: g };
  };

  AudioBus.prototype.setSpeed = function (norm) {
    if (!this.engine || !this.ctx) return;
    var t = this.ctx.currentTime;
    var n = clamp(norm, 0, 1);
    this.engine.osc.frequency.setTargetAtTime(48 + n * 150, t, 0.07);
    this.engine.osc2.frequency.setTargetAtTime(72 + n * 210, t, 0.07);
    this.engine.filter.frequency.setTargetAtTime(380 + n * 2200, t, 0.08);
    this.engine.gain.gain.setTargetAtTime(0.018 + n * 0.055, t, 0.08);
  };

  AudioBus.prototype.tick = function () {
    if (!this.ready) return;
    var ctx = this.ctx;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 1800 + Math.random() * 1400;
    var bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 6;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    osc.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.035);
  };

  AudioBus.prototype.skid = function () {
    if (!this.ready) return;
    var ctx = this.ctx;
    var t = ctx.currentTime;
    var thud = ctx.createOscillator();
    thud.type = "sine";
    thud.frequency.setValueAtTime(140, t);
    thud.frequency.exponentialRampToValueAtTime(48, t + 0.16);
    var tg = ctx.createGain();
    tg.gain.setValueAtTime(0.22, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    thud.connect(tg);
    tg.connect(this.master);
    thud.start(t);
    thud.stop(t + 0.22);

    var src = ctx.createBufferSource();
    src.buffer = this._noise(0.28);
    var hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 900;
    var sg = ctx.createGain();
    sg.gain.setValueAtTime(0.16, t);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    src.connect(hp);
    hp.connect(sg);
    sg.connect(this.master);
    src.start(t);
    src.stop(t + 0.25);
  };

  AudioBus.prototype.fanfare = function () {
    if (!this.ready) return;
    var ctx = this.ctx;
    var t = ctx.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    var i;
    for (i = 0; i < notes.length; i++) {
      var osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = notes[i];
      var g = ctx.createGain();
      var t0 = t + i * 0.1;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + 0.45);
    }
  };

  AudioBus.prototype.thunder = function () {
    if (!this.ready) return;
    var ctx = this.ctx;
    var t = ctx.currentTime;
    var src = ctx.createBufferSource();
    src.buffer = this._noise(1.5);
    var lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1400, t);
    lp.frequency.exponentialRampToValueAtTime(70, t + 0.9);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
    src.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + 1.4);

    var rumble = ctx.createOscillator();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(52, t);
    rumble.frequency.exponentialRampToValueAtTime(26, t + 1.1);
    var rg = ctx.createGain();
    rg.gain.setValueAtTime(0.22, t);
    rg.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
    rumble.connect(rg);
    rg.connect(this.master);
    rumble.start(t);
    rumble.stop(t + 1.2);
  };

  /* ---------- rain canvas ---------- */
  function RainField(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.drops = [];
    this.resize();
  }

  RainField.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.floor(this.w / 9);
    this.drops = [];
    var i;
    for (i = 0; i < n; i++) this.drops.push(this._drop(true));
  };

  RainField.prototype._drop = function (anywhere) {
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : -20,
      len: 10 + Math.random() * 16,
      vy: 680 + Math.random() * 720,
      vx: 70 + Math.random() * 90,
      a: 0.1 + Math.random() * 0.22,
      w: Math.random() < 0.18 ? 1.6 : 1
    };
  };

  RainField.prototype.frame = function (dt) {
    var ctx = this.ctx;
    var i, d;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.lineCap = "round";
    for (i = 0; i < this.drops.length; i++) {
      d = this.drops[i];
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.y > this.h + 20 || d.x > this.w + 20) {
        this.drops[i] = this._drop(false);
        continue;
      }
      ctx.strokeStyle = "rgba(180, 210, 230," + d.a + ")";
      ctx.lineWidth = d.w;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.vx * 0.018, d.y - d.len);
      ctx.stroke();
    }
  };

  /* ---------- track ---------- */
  function TrackView(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scroll = 0;
    this.resize();
  }

  TrackView.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  TrackView.prototype.draw = function (game) {
    var ctx = this.ctx;
    var w = this.w;
    var h = this.h;
    var t = game.nowMs * 0.001;
    ctx.clearRect(0, 0, w, h);

    var sky = ctx.createLinearGradient(0, 0, 0, h * 0.42);
    sky.addColorStop(0, "#0a1422");
    sky.addColorStop(1, "#141c28");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.38);

    var road = ctx.createLinearGradient(0, h * 0.32, 0, h);
    road.addColorStop(0, "#1a2230");
    road.addColorStop(0.45, "#121820");
    road.addColorStop(1, "#0b0f16");
    ctx.fillStyle = road;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.34);
    ctx.lineTo(w, h * 0.34);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    var shine = ctx.createLinearGradient(0, h * 0.34, 0, h);
    shine.addColorStop(0, "rgba(80, 140, 160, 0.05)");
    shine.addColorStop(0.35, "rgba(62, 240, 197, 0.035)");
    shine.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, h * 0.34, w, h * 0.66);

    var bandX = ((t * 40) % (w + 160)) - 80;
    var spec = ctx.createLinearGradient(bandX, 0, bandX + 180, 0);
    spec.addColorStop(0, "rgba(255,255,255,0)");
    spec.addColorStop(0.5, "rgba(180, 220, 230, 0.05)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.fillRect(0, h * 0.4, w, h * 0.5);

    var speed = game.player ? game.player.speed : 0.35;
    this.scroll += speed * 42 * game.dt;
    var lanes = 4;
    var roadTop = h * 0.4;
    var roadBot = h * 0.92;
    var laneH = (roadBot - roadTop) / lanes;
    var i;
    ctx.save();
    ctx.strokeStyle = "rgba(220, 230, 240, 0.18)";
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 22]);
    ctx.lineDashOffset = -this.scroll;
    for (i = 1; i < lanes; i++) {
      var y = roadTop + i * laneH;
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(w - 18, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(62, 240, 197, 0.28)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(16, roadTop);
    ctx.lineTo(w - 16, roadTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, roadBot);
    ctx.lineTo(w - 16, roadBot);
    ctx.stroke();

    var startX = 56;
    var finishX = w - 54;
    this._finish(ctx, finishX, roadTop, roadBot);

    var cars = game.carsForDraw();
    for (i = 0; i < cars.length; i++) {
      var c = cars[i];
      var p = clamp(c.progress, 0, 1.02);
      var x = lerp(startX, finishX, p);
      var ly = roadTop + (c.lane + 0.52) * laneH;
      this._car(ctx, x, ly, c.color, c.scale, c.joltX, c.joltY, c.rot, c.label, c.you);
    }
  };

  TrackView.prototype._finish = function (ctx, x, top, bot) {
    var size = 7;
    var y, col;
    ctx.save();
    ctx.globalAlpha = 0.85;
    for (y = top; y < bot; y += size) {
      col = 0;
      for (col = 0; col < 2; col++) {
        ctx.fillStyle = ((Math.floor((y - top) / size) + col) % 2 === 0) ? "#e8eef6" : "#11151c";
        ctx.fillRect(x - size + col * size, y, size, size);
      }
    }
    ctx.restore();
    ctx.fillStyle = "rgba(62, 240, 197, 0.7)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("FINISH", x, top - 8);
  };

  TrackView.prototype._car = function (ctx, x, y, color, scale, jx, jy, rot, label, you) {
    ctx.save();
    ctx.translate(x + jx, y + jy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.ellipse(0, 13, 30, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.shadowColor = color;
    ctx.shadowBlur = you ? 22 : 14;

    ctx.fillStyle = "#0c1016";
    roundRect(ctx, -26, -8, 52, 14, 5);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    roundRect(ctx, -22, -3, 40, 4, 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#1c2430";
    roundRect(ctx, -8, -13, 22, 8, 3);
    ctx.fill();
    ctx.fillStyle = "rgba(180, 230, 255, 0.35)";
    roundRect(ctx, -5, -12, 16, 5, 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0a0c10";
    ctx.beginPath();
    ctx.arc(-16, 7, 5, 0, Math.PI * 2);
    ctx.arc(16, 7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-16, 7, 5, 0, Math.PI * 2);
    ctx.arc(16, 7, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#fff6c8";
    ctx.shadowColor = "#fff6c8";
    ctx.shadowBlur = 10;
    roundRect(ctx, 22, -4, 6, 4, 1);
    ctx.fill();
    ctx.fillStyle = "#ff5b7a";
    ctx.shadowColor = "#ff5b7a";
    roundRect(ctx, -28, -3, 4, 3, 1);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();

    ctx.save();
    ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = you ? "#3ef0c5" : "rgba(197, 205, 219, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText(label, x + jx, y + jy - 22 * scale);
    ctx.restore();
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------- chart ---------- */
  function drawChart(canvas, history, lastIsPb) {
    var dpr = window.devicePixelRatio || 1;
    var cssW = canvas.clientWidth || 640;
    var cssH = canvas.clientHeight || 140;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var pad = { l: 36, r: 12, t: 14, b: 22 };
    var innerW = cssW - pad.l - pad.r;
    var innerH = cssH - pad.t - pad.b;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, pad.t + innerH);
    ctx.lineTo(pad.l + innerW, pad.t + innerH);
    ctx.stroke();

    if (!history.length) {
      ctx.fillStyle = "#5c6578";
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillText("race again to see your trend", pad.l + 8, pad.t + innerH / 2);
      return;
    }

    var wpms = history.map(function (h) { return h.wpm; });
    var min = Math.min.apply(null, wpms);
    var max = Math.max.apply(null, wpms);
    if (max - min < 8) {
      min = Math.max(0, min - 6);
      max = max + 6;
    } else {
      min = Math.max(0, min - (max - min) * 0.12);
      max = max + (max - min) * 0.12;
    }

    ctx.fillStyle = "#5c6578";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText(String(Math.round(max)), pad.l - 6, pad.t + 8);
    ctx.fillText(String(Math.round(min)), pad.l - 6, pad.t + innerH);

    function xy(i, wpm) {
      var x = pad.l + (history.length === 1 ? innerW * 0.5 : (i / (history.length - 1)) * innerW);
      var y = pad.t + innerH - ((wpm - min) / (max - min)) * innerH;
      return { x: x, y: y };
    }

    ctx.strokeStyle = "rgba(62, 240, 197, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    var i, p;
    for (i = 0; i < history.length; i++) {
      p = xy(i, history[i].wpm);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    for (i = 0; i < history.length; i++) {
      p = xy(i, history[i].wpm);
      var last = i === history.length - 1;
      ctx.fillStyle = last && lastIsPb ? "#3ef0c5" : last ? "#eef3f8" : "rgba(62, 240, 197, 0.7)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, last ? 4.2 : 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- game ---------- */
  function Game() {
    this.audio = new AudioBus();
    this.rain = new RainField($("rain-canvas"));
    this.track = new TrackView($("track-canvas"));
    this.diff = "common";
    this.count = 25;
    this.screen = "menu";
    this.nowMs = 0;
    this.dt = 0.016;
    this.lastTs = 0;
    this.focused = true;
    this.caretIdle = 0;
    this.shakeEl = $("app");
    this.loadSettings();
    this.resetIdleCars();
    this.bind();
    this.showMenu();
    this.syncMuteUi();
    var self = this;
    requestAnimationFrame(function loop(ts) {
      self.frame(ts);
      requestAnimationFrame(loop);
    });
  }

  Game.prototype.loadSettings = function () {
    var s = loadJson(SET_KEY, null);
    if (s && (s.diff === "starter" || s.diff === "common" || s.diff === "steady")) this.diff = s.diff;
    if (s && (s.count === 10 || s.count === 25 || s.count === 50 || s.count === 100)) this.count = s.count;
  };

  Game.prototype.saveSettings = function () {
    storeSet(SET_KEY, JSON.stringify({ diff: this.diff, count: this.count }));
  };

  Game.prototype.resetIdleCars = function () {
    this.player = {
      distance: 0,
      speed: 0.35,
      joltX: 0,
      joltY: 0,
      rot: 0,
      vx: 0,
      vy: 0,
      vr: 0
    };
    this.ais = RIVALS.map(function (r) {
      return {
        id: r.id,
        name: r.name,
        color: r.color,
        baseWpm: r.baseWpm,
        variance: r.variance,
        wobble: r.wobble,
        phase: r.phase,
        wpm: r.baseWpm,
        distance: 0
      };
    });
    this.raceLength = 120;
    this.penaltyT = 0;
    this.shakeT = 0;
    this.started = false;
    this.finished = false;
  };

  Game.prototype.carsForDraw = function () {
    var len = Math.max(1, this.raceLength);
    var cars = [];
    var i;
    for (i = 0; i < this.ais.length; i++) {
      cars.push({
        progress: this.ais[i].distance / len,
        color: this.ais[i].color,
        scale: 0.92,
        joltX: 0,
        joltY: 0,
        rot: 0,
        label: this.ais[i].name,
        you: false,
        lane: i === 2 ? 3 : i
      });
    }
    cars.push({
      progress: this.player.distance / len,
      color: "#3ef0c5",
      scale: 1.08,
      joltX: this.player.joltX,
      joltY: this.player.joltY,
      rot: this.player.rot,
      label: "you",
      you: true,
      lane: 2
    });
    return cars;
  };

  Game.prototype.bind = function () {
    var self = this;

    document.querySelectorAll("#diff-pills .pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.setDiff(btn.getAttribute("data-diff"));
        btn.blur();
        $("app").focus();
      });
    });
    document.querySelectorAll("#count-pills .pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.setCount(parseInt(btn.getAttribute("data-count"), 10));
        btn.blur();
        $("app").focus();
      });
    });

    $("start-btn").addEventListener("click", function () {
      self.audio.unlock();
      self.startRace(false);
    });
    $("restart-btn").addEventListener("click", function () {
      self.audio.unlock();
      self.startRace(false);
    });
    $("menu-btn").addEventListener("click", function () {
      self.showMenu();
    });
    $("brand-btn").addEventListener("click", function () {
      self.showMenu();
    });
    $("mute-btn").addEventListener("click", function () {
      self.audio.unlock();
      self.audio.setMuted(!self.audio.muted);
      self.syncMuteUi();
    });

    window.addEventListener("keydown", function (e) { self.onKey(e); });
    window.addEventListener("resize", function () {
      self.rain.resize();
      self.track.resize();
      if (self.screen === "race") self.placeCaret(true);
      if (self.screen === "results") self.redrawChart();
    });
    window.addEventListener("blur", function () {
      self.focused = false;
      self.syncFocusUi();
    });
    window.addEventListener("focus", function () {
      self.focused = true;
      self.syncFocusUi();
    });
    document.addEventListener("pointerdown", function () {
      self.audio.unlock();
      self.focused = true;
      $("app").focus();
      self.syncFocusUi();
    });
    $("words-viewport").addEventListener("click", function () {
      $("app").focus();
    });
  };

  Game.prototype.syncMuteUi = function () {
    var muted = this.audio.muted;
    $("mute-btn").setAttribute("aria-pressed", muted ? "true" : "false");
    $("mute-btn").setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
    $("icon-on").classList.toggle("hidden", muted);
    $("icon-off").classList.toggle("hidden", !muted);
  };

  Game.prototype.syncFocusUi = function () {
    if (this.screen !== "race") {
      $("focus-warning").classList.add("hidden");
      return;
    }
    $("focus-warning").classList.toggle("hidden", this.focused);
  };

  Game.prototype.setDiff = function (diff) {
    this.diff = diff;
    this.saveSettings();
    document.querySelectorAll("#diff-pills .pill").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-diff") === diff);
    });
    $("diff-blurb").textContent = DIFF_COPY[diff] || "";
  };

  Game.prototype.setCount = function (count) {
    this.count = count;
    this.saveSettings();
    document.querySelectorAll("#count-pills .pill").forEach(function (b) {
      b.classList.toggle("active", parseInt(b.getAttribute("data-count"), 10) === count);
    });
  };

  Game.prototype.showMenu = function () {
    this.screen = "menu";
    this.resetIdleCars();
    $("menu").classList.remove("hidden");
    $("race-panel").classList.add("hidden");
    $("results").classList.add("hidden");
    $("hud").classList.add("hidden");
    $("pb-badge").classList.add("hidden");
    this.setDiff(this.diff);
    this.setCount(this.count);
    $("hints").textContent = "enter to race · pick a list and length · mute in the corner";
    this.syncFocusUi();
    $("app").focus();
  };

  Game.prototype.startRace = function (consumeFirst, firstKey) {
    this.audio.unlock();
    this.screen = "race";
    this.resetIdleCars();
    this.words = pickWords(this.diff, this.count);
    this.wordIndex = 0;
    this.charIndex = 0;
    this.correctKeys = 0;
    this.incorrectKeys = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.wordHadError = false;
    this.charLog = [];
    this.startTime = 0;
    this.endTime = 0;
    this.started = false;
    this.finished = false;
    this.caretIdle = 0;
    this.raceLength = this.words.reduce(function (s, w) { return s + w.length; }, 0) + Math.max(0, this.words.length - 1);

    $("menu").classList.add("hidden");
    $("results").classList.add("hidden");
    $("race-panel").classList.remove("hidden");
    $("hud").classList.remove("hidden");
    $("pb-badge").classList.add("hidden");
    $("hints").textContent = "esc menu · tab restart · backspace only in this word";
    this.renderWords();
    this.updateHud();
    this.placeCaret(true);
    this.syncFocusUi();
    $("app").focus();

    if (consumeFirst && firstKey) this.handleType(firstKey);
  };

  Game.prototype.renderWords = function () {
    var root = $("words");
    root.innerHTML = "";
    root.style.transition = "none";
    root.style.transform = "translateY(0px)";
    this.wordEls = [];
    var i, j;
    for (i = 0; i < this.words.length; i++) {
      var div = document.createElement("div");
      div.className = "word" + (i === 0 ? " current" : "");
      var w = this.words[i];
      for (j = 0; j < w.length; j++) {
        var s = document.createElement("span");
        s.className = "letter";
        s.textContent = w[j];
        div.appendChild(s);
      }
      root.appendChild(div);
      this.wordEls.push(div);
    }
    var self = this;
    requestAnimationFrame(function () {
      root.style.transition = "";
      self.placeCaret(true);
    });
  };

  Game.prototype.currentWordEl = function () {
    return this.wordEls[this.wordIndex];
  };

  Game.prototype.letterSpans = function (wordEl) {
    return Array.prototype.filter.call(wordEl.children, function (n) {
      return !n.classList.contains("extra");
    });
  };

  Game.prototype.placeCaret = function (snap) {
    var wordEl = this.currentWordEl();
    var caret = $("caret");
    if (!wordEl || this.screen !== "race") {
      caret.style.opacity = "0";
      return;
    }
    caret.style.opacity = "1";
    var vp = $("words-viewport").getBoundingClientRect();
    var letters = this.letterSpans(wordEl);
    var extras = wordEl.querySelectorAll(".letter.extra");
    var rect;
    if (this.charIndex < letters.length) {
      rect = letters[this.charIndex].getBoundingClientRect();
      caret.style.height = rect.height * 0.78 + "px";
      this._moveCaret(caret, rect.left - vp.left, rect.top - vp.top + rect.height * 0.12, snap);
    } else {
      var last = extras.length ? extras[extras.length - 1] : letters[letters.length - 1];
      rect = last.getBoundingClientRect();
      caret.style.height = rect.height * 0.78 + "px";
      this._moveCaret(caret, rect.right - vp.left, rect.top - vp.top + rect.height * 0.12, snap);
    }
  };

  Game.prototype._moveCaret = function (caret, x, y, snap) {
    if (snap) {
      caret.style.transition = "none";
      caret.style.left = x + "px";
      caret.style.top = y + "px";
      var self = this;
      requestAnimationFrame(function () {
        caret.style.transition = "";
        self.syncWordScroll();
      });
    } else {
      var prevTop = parseFloat(caret.style.top || "0");
      if (Math.abs(prevTop - y) > 12) caret.style.transition = "none";
      caret.style.left = x + "px";
      caret.style.top = y + "px";
      var self2 = this;
      requestAnimationFrame(function () {
        caret.style.transition = "";
        self2.syncWordScroll();
      });
    }
  };

  Game.prototype.syncWordScroll = function () {
    var wordEl = this.currentWordEl();
    if (!wordEl) return;
    var line = wordEl.offsetHeight || 1;
    var top = wordEl.offsetTop;
    var scroll = 0;
    if (top >= line * 0.9) scroll = top - line;
    $("words").style.transform = "translateY(" + -scroll + "px)";
  };

  Game.prototype.markCurrentWord = function () {
    var i;
    for (i = 0; i < this.wordEls.length; i++) {
      this.wordEls[i].classList.toggle("current", i === this.wordIndex);
    }
  };

  Game.prototype.beginIfNeeded = function () {
    if (this.started) return;
    this.started = true;
    this.startTime = performance.now();
  };

  Game.prototype.onKey = function (e) {
    var key = e.key;
    if (key === "Tab") {
      e.preventDefault();
      this.audio.unlock();
      if (this.screen === "race" || this.screen === "results") this.startRace(false);
      return;
    }
    if (key === "Escape") {
      e.preventDefault();
      this.showMenu();
      return;
    }
    if (key === "Enter") {
      e.preventDefault();
      this.audio.unlock();
      if (this.screen === "menu" || this.screen === "results") this.startRace(false);
      return;
    }

    if (this.screen === "menu") {
      if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && key !== " ") {
        e.preventDefault();
        this.audio.unlock();
        this.startRace(true, key);
      }
      return;
    }

    if (this.screen !== "race" || this.finished || !this.focused) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (key === "Backspace") {
      e.preventDefault();
      this.handleBackspace();
      return;
    }
    if (e.repeat) return;
    if (key === " ") {
      e.preventDefault();
      this.handleSpace();
      return;
    }
    if (key.length === 1) {
      e.preventDefault();
      this.handleType(key);
    }
  };

  Game.prototype.handleType = function (ch) {
    this.beginIfNeeded();
    this.caretIdle = 0;
    $("caret").classList.remove("idle");

    var word = this.words[this.wordIndex];
    var wordEl = this.currentWordEl();
    var letters = this.letterSpans(wordEl);

    if (this.charIndex < word.length) {
      var span = letters[this.charIndex];
      if (ch === word[this.charIndex]) {
        span.classList.remove("incorrect", "missed");
        span.classList.add("correct");
        this.correctKeys += 1;
        this.charLog.push({ t: performance.now(), ok: true });
        this.audio.tick();
      } else {
        span.classList.remove("correct");
        span.classList.add("incorrect");
        this.incorrectKeys += 1;
        this.wordHadError = true;
        this.charLog.push({ t: performance.now(), ok: false });
        this.onMistake();
      }
      this.charIndex += 1;
      if (this.wordIndex === this.words.length - 1 && this.charIndex >= word.length) {
        this.advanceWord(true);
        return;
      }
    } else {
      var extras = wordEl.querySelectorAll(".letter.extra");
      if (extras.length >= MAX_EXTRAS) return;
      var extra = document.createElement("span");
      extra.className = "letter extra";
      extra.textContent = ch;
      wordEl.appendChild(extra);
      this.incorrectKeys += 1;
      this.wordHadError = true;
      this.charIndex += 1;
      this.charLog.push({ t: performance.now(), ok: false });
      this.onMistake();
    }
    this.placeCaret(false);
    this.updateHud();
  };

  Game.prototype.handleBackspace = function () {
    if (!this.started || this.charIndex <= 0) return;
    this.caretIdle = 0;
    var wordEl = this.currentWordEl();
    var word = this.words[this.wordIndex];
    var extras = wordEl.querySelectorAll(".letter.extra");
    if (extras.length) {
      wordEl.removeChild(extras[extras.length - 1]);
      this.charIndex -= 1;
    } else if (this.charIndex > 0 && this.charIndex <= word.length) {
      this.charIndex -= 1;
      var letters = this.letterSpans(wordEl);
      letters[this.charIndex].classList.remove("correct", "incorrect", "missed");
    }
    this.placeCaret(false);
    this.updateHud();
  };

  Game.prototype.handleSpace = function () {
    if (this.charIndex === 0) return;
    this.beginIfNeeded();
    this.advanceWord(false);
  };

  Game.prototype.advanceWord = function (fromLastLetter) {
    var word = this.words[this.wordIndex];
    var wordEl = this.currentWordEl();
    var letters = this.letterSpans(wordEl);
    var i;
    if (this.charIndex < word.length) {
      for (i = this.charIndex; i < word.length; i++) {
        letters[i].classList.add("missed");
        this.incorrectKeys += 1;
        this.wordHadError = true;
      }
      this.onMistake();
    }
    var extras = wordEl.querySelectorAll(".letter.extra");
    var clean = !this.wordHadError && extras.length === 0 && this.charIndex >= word.length;
    if (this.charIndex < word.length) clean = false;
    if (clean) {
      this.streak += 1;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.correctKeys += 1;
    } else {
      this.streak = 0;
    }

    this.wordIndex += 1;
    this.charIndex = 0;
    this.wordHadError = false;

    if (this.wordIndex >= this.words.length) {
      this.placeCaret(true);
      this.finishRace();
      return;
    }
    this.markCurrentWord();
    this.placeCaret(fromLastLetter);
    this.updateHud();
  };

  Game.prototype.onMistake = function () {
    this.penaltyT = PENALTY_S;
    this.shakeT = 0.28;
    this.player.vx += 180 + Math.random() * 80;
    this.player.vy += -70 - Math.random() * 40;
    this.player.vr += (Math.random() < 0.5 ? -1 : 1) * (1.8 + Math.random());
    this.shakeEl.classList.remove("shake");
    void this.shakeEl.offsetWidth;
    this.shakeEl.classList.add("shake");
    this.audio.skid();
  };

  Game.prototype.rollingWpm = function () {
    if (!this.started) return 0;
    var now = performance.now();
    var windowMs = Math.min(ROLL_MS, now - this.startTime);
    if (windowMs < 280) return 0;
    var cut = now - windowMs;
    var n = 0;
    var i;
    for (i = this.charLog.length - 1; i >= 0; i--) {
      if (this.charLog[i].t < cut) break;
      if (this.charLog[i].ok) n += 1;
    }
    return (n / 5) * (60000 / windowMs);
  };

  Game.prototype.liveAccuracy = function () {
    var t = this.correctKeys + this.incorrectKeys;
    if (!t) return 100;
    return (this.correctKeys / t) * 100;
  };

  Game.prototype.updateHud = function () {
    var wpm = this.started ? this.rollingWpm() : 0;
    $("hud-wpm").textContent = String(Math.round(wpm));
    $("hud-acc").textContent = Math.round(this.liveAccuracy()) + "%";
    var elapsed = this.started ? (performance.now() - this.startTime) / 1000 : 0;
    $("hud-time").textContent = elapsed.toFixed(1);
    $("hud-words").textContent = Math.min(this.wordIndex, this.count) + "/" + this.count;
  };

  Game.prototype.finishRace = function () {
    if (this.finished) return;
    this.finished = true;
    this.endTime = performance.now();

    var elapsed = Math.max(1, this.endTime - this.startTime);
    var minutes = elapsed / 60000;
    var wpm = this.correctKeys / 5 / minutes;
    var acc = this.liveAccuracy();
    var stats = {
      wpm: Math.round(wpm * 10) / 10,
      acc: Math.round(acc * 10) / 10,
      streak: this.bestStreak,
      time: elapsed,
      ts: Date.now()
    };

    var key = modeKey(this.diff, this.count);
    var pbs = loadJson(PB_KEY, {});
    var prev = pbs[key];
    var isPb = !prev || stats.wpm > prev.wpm + 0.05 || (Math.abs(stats.wpm - prev.wpm) < 0.05 && stats.acc > prev.acc);
    if (isPb) {
      pbs[key] = { wpm: stats.wpm, acc: stats.acc, streak: stats.streak, time: stats.time, ts: stats.ts };
      storeSet(PB_KEY, JSON.stringify(pbs));
    }

    var histAll = loadJson(HIST_KEY, {});
    var hist = histAll[key] || [];
    hist.push(stats);
    if (hist.length > MAX_HIST) hist = hist.slice(hist.length - MAX_HIST);
    histAll[key] = hist;
    storeSet(HIST_KEY, JSON.stringify(histAll));

    this.lastStats = stats;
    this.lastIsPb = isPb && (!prev || stats.wpm >= (prev.wpm || 0));
    if (!prev) this.lastIsPb = true;
    this.lastHistory = hist;
    this.lastPlace = this.computePlace();

    this.audio.fanfare();
    if (this.lastIsPb) {
      this.audio.thunder();
      $("flash").classList.add("on");
      setTimeout(function () { $("flash").classList.remove("on"); }, 180);
    }

    this.showResults();
  };

  Game.prototype.computePlace = function () {
    var len = this.raceLength;
    var rows = [{ name: "you", d: this.player.distance, you: true }];
    var i;
    for (i = 0; i < this.ais.length; i++) {
      rows.push({ name: this.ais[i].name, d: this.ais[i].distance, you: false });
    }
    rows.sort(function (a, b) { return b.d - a.d; });
    var place = 1;
    for (i = 0; i < rows.length; i++) {
      if (rows[i].you) {
        place = i + 1;
        break;
      }
    }
    var winner = rows[0];
    var line;
    if (place === 1) line = "1st · you crossed first in the rain";
    else line = ordinal(place) + " · " + winner.name + " took the line";
    return { place: place, text: line };
  };

  Game.prototype.showResults = function () {
    this.screen = "results";
    $("race-panel").classList.add("hidden");
    $("hud").classList.add("hidden");
    $("menu").classList.add("hidden");
    $("results").classList.remove("hidden");
    $("res-wpm").textContent = statsStr(this.lastStats.wpm);
    $("res-acc").textContent = statsStr(this.lastStats.acc) + "%";
    $("res-streak").textContent = String(this.lastStats.streak);
    $("res-time").textContent = formatTime(this.lastStats.time);
    $("res-place").textContent = this.lastPlace.text;
    $("pb-badge").classList.toggle("hidden", !this.lastIsPb);
    var pb = loadJson(PB_KEY, {})[modeKey(this.diff, this.count)];
    $("res-pb").textContent = pb ? statsStr(pb.wpm) + " wpm" : "—";
    $("chart-caption").textContent = "last " + this.lastHistory.length + " race" + (this.lastHistory.length === 1 ? "" : "s") + " · " + this.diff + " · " + this.count;
    $("hints").textContent = "tab or enter restarts · esc returns to the menu";
    this.redrawChart();
    this.syncFocusUi();
  };

  function statsStr(n) {
    return (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, ".0");
  }

  Game.prototype.redrawChart = function () {
    if (!this.lastHistory) return;
    drawChart($("chart-canvas"), this.lastHistory, this.lastIsPb);
  };

  Game.prototype.frame = function (ts) {
    if (!this.lastTs) this.lastTs = ts;
    this.dt = clamp((ts - this.lastTs) / 1000, 0.001, 0.05);
    this.lastTs = ts;
    this.nowMs = ts;

    this.rain.frame(this.dt);
    this.updatePhysics();
    this.track.draw(this);

    if (this.screen === "race" && !this.finished) {
      this.caretIdle += this.dt;
      $("caret").classList.toggle("idle", this.caretIdle > 0.55);
      if (this.started) this.updateHud();
      this.placeCaret(false);
    }

    var norm = clamp((this.player.speed - 0.35) / 5.0, 0, 1);
    this.audio.setSpeed(this.started || this.screen !== "menu" ? Math.max(0.05, norm) : 0.08);
    this.updateCapsFromEvent();
  };

  Game.prototype.updateCapsFromEvent = function () {
    /* refreshed on keydown via getModifierState in onKey path below by storing flag */
    if (this._capsOn && this.screen === "race") $("caps-warn").classList.remove("hidden");
    else $("caps-warn").classList.add("hidden");
  };

  Game.prototype.updatePhysics = function () {
    var dt = this.dt;
    if (this.penaltyT > 0) this.penaltyT = Math.max(0, this.penaltyT - dt);
    if (this.shakeT > 0) this.shakeT = Math.max(0, this.shakeT - dt);

    var targetWpm = 0;
    if (this.screen === "race" && this.started && !this.finished) targetWpm = this.rollingWpm();
    else if (this.finished) targetWpm = 8;
    var penalized = targetWpm;
    if (this.penaltyT > 0) penalized *= 0.32 + 0.68 * (1 - this.penaltyT / PENALTY_S);
    var targetSpeed = speedFromWpm(penalized);
    if (!this.started) targetSpeed = 0.35;
    this.player.speed = lerp(this.player.speed, targetSpeed, 1 - Math.pow(0.0002, dt));

    if (this.started && !this.finished && this.screen === "race") {
      this.player.distance += this.player.speed * dt;
    } else if (this.finished) {
      this.player.distance = lerp(this.player.distance, this.raceLength, 1 - Math.pow(0.0008, dt));
    }

    var spring = 18;
    var damp = 9;
    this.player.vx += -this.player.joltX * spring * dt;
    this.player.vy += -this.player.joltY * spring * dt;
    this.player.vr += -this.player.rot * spring * dt;
    this.player.vx *= Math.max(0, 1 - damp * dt);
    this.player.vy *= Math.max(0, 1 - damp * dt);
    this.player.vr *= Math.max(0, 1 - damp * dt);
    this.player.joltX += this.player.vx * dt;
    this.player.joltY += this.player.vy * dt;
    this.player.rot += this.player.vr * dt;

    if (this.started && !this.finished && this.screen === "race") {
      var pProg = this.player.distance / this.raceLength;
      var i, ai, wobble, target, lead, spd;
      for (i = 0; i < this.ais.length; i++) {
        ai = this.ais[i];
        wobble = Math.sin(this.nowMs * 0.001 * ai.wobble + ai.phase) * ai.variance;
        target = ai.baseWpm + wobble;
        lead = pProg - ai.distance / this.raceLength;
        target += lead * 16;
        if (pProg < 0.06 && ai.distance / this.raceLength > pProg + 0.05) target *= 0.72;
        target = clamp(target, 16, 76);
        ai.wpm = lerp(ai.wpm, target, 1 - Math.pow(0.04, dt));
        spd = speedFromWpm(ai.wpm);
        ai.distance += spd * dt;
        if (ai.distance > this.raceLength * 1.02) ai.distance = this.raceLength * 1.02;
      }
    }
  };

  /* patch caps detection onto key handler */
  var _onKey = Game.prototype.onKey;
  Game.prototype.onKey = function (e) {
    if (e.getModifierState) this._capsOn = e.getModifierState("CapsLock");
    return _onKey.call(this, e);
  };

  function boot() {
    window.__rainrace = new Game();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
