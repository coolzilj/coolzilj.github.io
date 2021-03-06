function ParticleSlider(t) {
  var e = this;
  if (e.sliderId = "particle-slider",
  e.color = "#fff",
  e.hoverColor = "#88f",
  e.width = 0,
  e.height = 0,
  e.ptlGap = 0,
  e.ptlSize = 1,
  e.slideDelay = 10,
  e.arrowPadding = 10,
  e.showArrowControls = !0,
  e.onNextSlide = null ,
  e.onWidthChange = null ,
  e.onHeightChange = null ,
  e.onSizeChange = null ,
  e.monochrome = !1,
  e.mouseForce = 1e4,
  e.restless = !0,
  e.imgs = [],
  t)
    for (var r = ["color", "hoverColor", "width", "height", "ptlGap", "ptlSize", "slideDelay", "arrowPadding", "sliderId", "showArrowControls", "onNextSlide", "monochrome", "mouseForce", "restless", "imgs", "onSizeChange", "onWidthChange", "onHeightChange"], n = 0, o = r.length; o > n; n++)
      t[r[n]] && (e[r[n]] = t[r[n]]);
  if (e.$container = e.$("#" + e.sliderId),
  e.$$children = e.$container.childNodes,
  e.$controlsContainer = e.$(".controls"),
  e.$$slides = e.$(".slide", e.$(".slides").childNodes, !0),
  e.$controlLeft = null ,
  e.$controlRight = null ,
  e.$canv = e.$(".draw"),
  e.$srcCanv = document.createElement("canvas"),
  e.$srcCanv.style.display = "none",
  e.$container.appendChild(e.$srcCanv),
  e.$prevCanv = document.createElement("canvas"),
  e.$prevCanv.style.display = "none",
  e.$container.appendChild(e.$prevCanv),
  e.$nextCanv = document.createElement("canvas"),
  e.$nextCanv.style.display = "none",
  e.$container.appendChild(e.$nextCanv),
  e.$overlay = document.createElement("p"),
  e.$container.appendChild(e.$overlay),
  e.imgControlPrev = null ,
  e.imgControlNext = null ,
  e.$$slides.length <= 1 && (e.showArrowControls = !1),
  e.$controlsContainer && e.$controlsContainer.childNodes && 1 == e.showArrowControls ? (e.$controlLeft = e.$(".left", e.$controlsContainer.childNodes),
  e.$controlRight = e.$(".right", e.$controlsContainer.childNodes),
  e.imgControlPrev = new Image,
  e.imgControlNext = new Image,
  e.imgControlPrev.onload = function() {
    e.$prevCanv.height = this.height,
    e.$prevCanv.width = this.width,
    e.loadingStep()
  }
  ,
  e.imgControlNext.onload = function() {
    e.$nextCanv.height = this.height,
    e.$nextCanv.width = this.width,
    e.loadingStep()
  }
  ,
  e.imgControlPrev.src = e.$controlLeft.getAttribute("data-src"),
  e.imgControlNext.src = e.$controlRight.getAttribute("data-src")) : e.showArrowControls = !1,
  e.width <= 0 && (e.width = e.$container.clientWidth),
  e.height <= 0 && (e.height = e.$container.clientHeight),
  e.mouseDownRegion = 0,
  e.colorArr = e.parseColor(e.color),
  e.hoverColorArr = e.parseColor(e.hoverColor),
  e.mx = -1,
  e.my = -1,
  e.swipeOffset = 0,
  e.cw = e.getCw(),
  e.ch = e.getCh(),
  e.frame = 0,
  e.nextSlideTimer = !1,
  e.currImg = 0,
  e.lastImg = 0,
  e.imagesLoaded = 0,
  e.pxlBuffer = {
    first: null
  },
  e.recycleBuffer = {
    first: null
  },
  e.ctx = e.$canv.getContext("2d"),
  e.srcCtx = e.$srcCanv.getContext("2d"),
  e.prevCtx = e.$prevCanv.getContext("2d"),
  e.nextCtx = e.$nextCanv.getContext("2d"),
  e.$canv.width = e.cw,
  e.$canv.height = e.ch,
  e.shuffle = function() {
    for (var t, e, r = 0, n = this.length; n > r; r++)
      e = Math.floor(Math.random() * n),
      t = this[r],
      this[r] = this[e],
      this[e] = t
  }
  ,
  Array.prototype.shuffle = e.shuffle,
  e.$canv.onmouseout = function() {
    e.mx = -1,
    e.my = -1,
    e.mouseDownRegion = 0
  }
  ,
  e.$canv.onmousemove = function(t) {
    function r(t) {
      var r = 0
        , n = 0
        , o = "string" == typeof t ? e.$(t) : t;
      if (o) {
        r = o.offsetLeft,
        n = o.offsetTop;
        for (var i = document.getElementsByTagName("body")[0]; o.offsetParent && o != i; )
          r += o.offsetParent.offsetLeft,
          n += o.offsetParent.offsetTop,
          o = o.offsetParent
      }
      this.x = r,
      this.y = n
    }
    var n = new r(e.$container);
    e.mx = t.clientX - n.x + document.body.scrollLeft + document.documentElement.scrollLeft,
    e.my = t.clientY - n.y + document.body.scrollTop + document.documentElement.scrollTop
  }
  ,
  e.$canv.onmousedown = function() {
    if (e.imgs.length > 1) {
      var t = 0;
      e.mx >= 0 && e.mx < 2 * e.arrowPadding + e.$prevCanv.width ? t = -1 : e.mx > 0 && e.mx > e.cw - (2 * e.arrowPadding + e.$nextCanv.width) && (t = 1),
      e.mouseDownRegion = t
    }
  }
  ,
  e.$canv.onmouseup = function() {
    if (e.imgs.length > 1) {
      var t = "";
      e.mx >= 0 && e.mx < 2 * e.arrowPadding + e.$prevCanv.width ? t = -1 : e.mx > 0 && e.mx > e.cw - (2 * e.arrowPadding + e.$nextCanv.width) && (t = 1),
      0 != t && 0 != e.mouseDownRegion && (t != e.mouseDownRegion && (t *= -1),
      e.nextSlideTimer && clearTimeout(e.nextSlideTimer),
      e.nextSlide(t)),
      e.mouseDownRegion = 0
    }
  }
  ,
  0 == e.imgs.length)
    for (var n = 0, o = e.$$slides.length; o > n; n++) {
      var i = new Image;
      e.imgs.push(i),
      i.src = e.$$slides[n].getAttribute("data-src")
    }
  e.imgs.length > 0 && (e.imgs[0].onload = function() {
    e.loadingStep()
  }
  ),
  e.requestAnimationFrame(function() {
    e.nextFrame()
  })
}
var psParticle = function(t) {
  this.ps = t,
  this.ttl = null ,
  this.color = t.colorArr,
  this.next = null ,
  this.prev = null ,
  this.gravityX = 0,
  this.gravityY = 0,
  this.x = Math.random() * t.cw,
  this.y = Math.random() * t.ch,
  this.velocityX = 10 * Math.random() - 5,
  this.velocityY = 10 * Math.random() - 5
}
;
psParticle.prototype.move = function() {
  var t = this.ps
    , e = this;
  if (null  != this.ttl && this.ttl-- <= 0)
    t.swapList(e, t.pxlBuffer, t.recycleBuffer),
    this.ttl = null ;
  else {
    var r = this.gravityX + t.swipeOffset - this.x
      , n = this.gravityY - this.y
      , o = Math.sqrt(Math.pow(r, 2) + Math.pow(n, 2))
      , i = Math.atan2(n, r)
      , a = .01 * o;
    1 == t.restless ? a += .1 * Math.random() - .05 : .01 > a && (this.x = this.gravityX + .25,
    this.y = this.gravityY + .25);
    var l = 0
      , s = 0;
    if (t.mx >= 0 && t.mouseForce) {
      var c = this.x - t.mx
        , h = this.y - t.my;
      l = Math.min(t.mouseForce / (Math.pow(c, 2) + Math.pow(h, 2)), t.mouseForce),
      s = Math.atan2(h, c),
      "function" == typeof this.color && (s += Math.PI,
      l *= .001 + .1 * Math.random() - .05)
    } else
      l = 0,
      s = 0;
    this.velocityX += a * Math.cos(i) + l * Math.cos(s),
    this.velocityY += a * Math.sin(i) + l * Math.sin(s),
    this.velocityX *= .92,
    this.velocityY *= .92,
    this.x += this.velocityX,
    this.y += this.velocityY
  }
}
,
ParticleSlider.prototype.Particle = psParticle,
ParticleSlider.prototype.swapList = function(t, e, r) {
  var n = this;
  null  == t ? t = new n.Particle(n) : e.first == t ? null  != t.next ? (t.next.prev = null ,
  e.first = t.next) : e.first = null  : null  == t.next ? t.prev.next = null  : (t.prev.next = t.next,
  t.next.prev = t.prev),
  null  == r.first ? (r.first = t,
  t.prev = null ,
  t.next = null ) : (t.next = r.first,
  r.first.prev = t,
  r.first = t,
  t.prev = null )
}
,
ParticleSlider.prototype.parseColor = function(t) {
  var e, t = t.replace(" ", "");
  if (e = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(t))
    e = [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)];
  else if (e = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(t))
    e = [17 * parseInt(e[1], 16), 17 * parseInt(e[2], 16), 17 * parseInt(e[3], 16)];
  else if (e = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(t))
    e = [+e[1], +e[2], +e[3], +e[4]];
  else {
    if (!(e = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(t)))
      return null ;
    e = [+e[1], +e[2], +e[3]]
  }
  return isNaN(e[3]) && (e[3] = 1),
  e[3] *= 255,
  e
}
,
ParticleSlider.prototype.loadingStep = function() {
  var t = this;
  t.imagesLoaded++,
  (t.imagesLoaded >= 3 || 0 == t.showArrowControls) && (t.resize(),
  t.slideDelay > 0 && (t.nextSlideTimer = setTimeout(function() {
    t.nextSlide()
  }, 1e3 * t.slideDelay)))
}
,
ParticleSlider.prototype.$ = function(t, e, r) {
  var n = this;
  if ("." == t[0]) {
    var o = t.substr(1);
    e || (e = n.$$children);
    for (var i = [], a = 0, l = e.length; l > a; a++)
      e[a].className && e[a].className == o && i.push(e[a]);
    return 0 == i.length ? null  : 1 != i.length || r ? i : i[0]
  }
  return document.getElementById(t.substr(1))
}
,
ParticleSlider.prototype.nextFrame = function() {
  var t = this;
  1 == t.mouseDownRegion && t.mx < t.cw / 2 || -1 == t.mouseDownRegion && t.mx > t.cw / 2 ? t.swipeOffset = t.mx - t.cw / 2 : t.swipeOffset = 0;
  for (var e = t.pxlBuffer.first, r = null ; null  != e; )
    r = e.next,
    e.move(),
    e = r;
  if (t.drawParticles(),
  t.frame++ % 25 == 0 && (t.cw != t.getCw() || t.ch != t.getCh())) {
    var n = t.getCh()
      , o = t.getCw();
    t.ch != o && "function" == typeof t.onWidthChange && t.onWidthChange(t, o),
    t.ch != n && "function" == typeof t.onHeightChange && t.onHeightChange(t, n),
    "function" == typeof t.onSizeChange && t.onSizeChange(t, o, n),
    t.resize()
  }
  setTimeout(function() {
    t.requestAnimationFrame(function() {
      t.nextFrame()
    })
  }, 15)
}
,
ParticleSlider.prototype.nextSlide = function(t) {
  var e = this;
  null  != e.nextSlideTimer && e.imgs.length > 1 ? (e.currImg = (e.currImg + e.imgs.length + (t ? t : 1)) % e.imgs.length,
  e.resize(),
  e.slideDelay > 0 && (e.nextSlideTimer = setTimeout(function() {
    e.nextSlide()
  }, 1e3 * e.slideDelay))) : e.slideDelay > 0 && (e.nextSlideTimer = setTimeout(function() {
    e.nextSlide()
  }, 1e3 * e.slideDelay)),
  "function" == typeof e.onNextSlide && e.onNextSlide(e.currImg)
}
,
ParticleSlider.prototype.drawParticles = function() {
  for (var t, e, r, n, o, i, a = this, l = a.ctx.createImageData(a.cw, a.ch), s = l.data, c = a.pxlBuffer.first; null  != c; ) {
    for (e = ~~c.x,
    r = ~~c.y,
    n = e; n < e + a.ptlSize && n >= 0 && n < a.cw; n++)
      for (o = r; o < r + a.ptlSize && o >= 0 && o < a.ch; o++)
        t = 4 * (o * l.width + n),
        i = "function" == typeof c.color ? c.color() : c.color,
        s[t + 0] = i[0],
        s[t + 1] = i[1],
        s[t + 2] = i[2],
        s[t + 3] = i[3];
    c = c.next
  }
  l.data = s,
  a.ctx.putImageData(l, 0, 0)
}
,
ParticleSlider.prototype.getPixelFromImageData = function(t, e, r) {
  for (var n = this, o = [], a = 0; a < t.width; a += n.ptlGap + 1)
    for (var l = 0; l < t.height; l += n.ptlGap + 1)
      i = 4 * (l * t.width + a),
      t.data[i + 3] > 0 && o.push({
        x: e + a,
        y: r + l,
        color: 1 == n.monochrome ? [n.colorArr[0], n.colorArr[1], n.colorArr[2], n.colorArr[3]] : [t.data[i], t.data[i + 1], t.data[i + 2], t.data[i + 3]]
      });
  return o
}
,
ParticleSlider.prototype.init = function(t) {
  var e = this;
  if (e.imgs.length > 0) {
    e.$srcCanv.width = e.imgs[e.currImg].width,
    e.$srcCanv.height = e.imgs[e.currImg].height,
    e.srcCtx.clearRect(0, 0, e.$srcCanv.width, e.$srcCanv.height),
    e.srcCtx.drawImage(e.imgs[e.currImg], 0, 0);
    var r = e.getPixelFromImageData(e.srcCtx.getImageData(0, 0, e.$srcCanv.width, e.$srcCanv.height), ~~(e.cw / 2 - e.$srcCanv.width / 2), ~~(e.ch / 2 - e.$srcCanv.height / 2));
    if (1 == e.showArrowControls) {
      e.prevCtx.clearRect(0, 0, e.$prevCanv.width, e.$prevCanv.height),
      e.prevCtx.drawImage(e.imgControlPrev, 0, 0);
      for (var n = e.getPixelFromImageData(e.prevCtx.getImageData(0, 0, e.$prevCanv.width, e.$prevCanv.height), e.arrowPadding, ~~(e.ch / 2 - e.$prevCanv.height / 2)), o = 0, i = n.length; i > o; o++)
        n[o].color = function() {
          return e.mx >= 0 && e.mx < 2 * e.arrowPadding + e.$prevCanv.width ? e.hoverColorArr : e.colorArr
        }
        ,
        r.push(n[o]);
      e.nextCtx.clearRect(0, 0, e.$nextCanv.width, e.$nextCanv.height),
      e.nextCtx.drawImage(e.imgControlNext, 0, 0);
      for (var a = e.getPixelFromImageData(e.nextCtx.getImageData(0, 0, e.$nextCanv.width, e.$nextCanv.height), e.cw - e.arrowPadding - e.$nextCanv.width, ~~(e.ch / 2 - e.$nextCanv.height / 2)), o = 0, i = a.length; i > o; o++)
        a[o].color = function() {
          return e.mx > 0 && e.mx > e.cw - (2 * e.arrowPadding + e.$nextCanv.width) ? e.hoverColorArr : e.colorArr
        }
        ,
        r.push(a[o])
    }
    (e.currImg != e.lastImg || 1 == t) && (r.shuffle(),
    e.lastImg = e.currImg);
    for (var l = e.pxlBuffer.first, o = 0, i = r.length; i > o; o++) {
      var s = null ;
      null  != l ? (s = l,
      l = l.next) : (e.swapList(e.recycleBuffer.first, e.recycleBuffer, e.pxlBuffer),
      s = e.pxlBuffer.first),
      s.gravityX = r[o].x,
      s.gravityY = r[o].y,
      s.color = r[o].color
    }
    for (; null  != l; )
      l.ttl = ~~(10 * Math.random()),
      l.gravityY = ~~(e.ch * Math.random()),
      l.gravityX = ~~(e.cw * Math.random()),
      l = l.next;
    e.$overlay.innerHTML = e.$$slides[e.currImg].innerHTML
  }
}
,
ParticleSlider.prototype.getCw = function() {
  var t = this;
  return Math.min(document.body.clientWidth, t.width, t.$container.clientWidth)
}
,
ParticleSlider.prototype.getCh = function() {
  var t = this;
  return Math.min(document.body.clientHeight, t.height, t.$container.clientHeight)
}
,
ParticleSlider.prototype.resize = function() {
  var t = this;
  t.cw = t.getCw(),
  t.ch = t.getCh(),
  t.$canv.width = t.cw,
  t.$canv.height = t.ch,
  t.init(!0)
}
,
ParticleSlider.prototype.setColor = function(t) {
  var e = this;
  e.colorArr = e.parseColor(t)
}
,
ParticleSlider.prototype.setHoverColor = function(t) {
  var e = this;
  e.hoverColorArr = e.parseColor(t)
}
,
ParticleSlider.prototype.requestAnimationFrame = function(t) {
  var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
    window.setTimeout(t, 1e3 / 60)
  }
  ;
  e(t)
}
,
function(t, e) {
  if ($("#particle-slider").length) {
    new ParticleSlider({
      ptlGap: 5,
      ptlSize: 3,
      width: 1e9,
      height: 1e9,
      mouseForce: 500,
      showArrowControls: !0
    })
  }
}(window, document);

