/* Eudirok Jewellery — site scripts (no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---- Background videos ------------------------------------------------ */
  // Each video picks the wide or tall file, fades in once playing, pauses when
  // off screen, and obeys one shared pause control and reduced-motion settings.
  var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-wide]"));
  if (videos.length) {
    var tall = window.matchMedia("(max-width: 700px)").matches;
    var userPaused = reduceMotion;
    var vtoggle = document.getElementById("vtoggle");

    var play = function (v) {
      if (userPaused || !v.src) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    var setLabel = function () {
      if (!vtoggle) return;
      vtoggle.textContent = userPaused ? "Play video" : "Pause video";
      vtoggle.setAttribute("aria-pressed", userPaused ? "true" : "false");
    };

    videos.forEach(function (v) {
      v.addEventListener("playing", function () {
        v.classList.add("on");
        if (vtoggle) vtoggle.hidden = false;
      });
      // If a browser cannot play the files, the poster photos stay and the pause control is hidden.
      v.addEventListener("error", function () {
        var started = videos.filter(function (x) { return x.getAttribute("src"); });
        if (vtoggle && started.every(function (x) { return x.error; })) vtoggle.hidden = true;
      });
    });

    var loadVideo = function (v) {
      if (v.src) return;
      v.src = tall ? v.getAttribute("data-tall") : v.getAttribute("data-wide");
    };

    if (hasIO) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { loadVideo(en.target); play(en.target); }
          else en.target.pause();
        });
      }, { threshold: 0.15 });
      videos.forEach(function (v) { vio.observe(v); });
    } else {
      loadVideo(videos[0]);
      play(videos[0]);
    }

    if (vtoggle) {
      vtoggle.addEventListener("click", function () {
        userPaused = !userPaused;
        setLabel();
        videos.forEach(function (v) {
          if (userPaused) { v.pause(); return; }
          var r = v.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) { loadVideo(v); play(v); }
        });
      });
      setLabel();
    }
  }

  /* ---- Faceted diamond -------------------------------------------------- */
  var host = document.getElementById("gem");
  if (host) {
    var NS = "http://www.w3.org/2000/svg";
    var R = 100;
    var rad = function (a) { return (a * Math.PI) / 180; };
    var pt = function (r, a) { return [Math.cos(rad(a)) * r * R, Math.sin(rad(a)) * r * R]; };
    var range = function (n) { var o = []; for (var i = 0; i < n; i++) o.push(i); return o; };

    // Round brilliant, viewed from above: table, 8 star, 8 kite and 16 half facets.
    var T = range(8).map(function (i) { return pt(0.5, 22.5 + 45 * i); });
    var S = range(8).map(function (i) { return pt(0.74, 45 * (i + 1)); });
    var G = range(16).map(function (j) { return pt(1, 22.5 * j); });

    var facets = [{ pts: T, tilt: 0, ring: 0 }];
    range(8).forEach(function (i) {
      var n = (i + 1) % 8;
      var prev = (i + 7) % 8;
      facets.push({ pts: [T[i], T[n], S[i]], tilt: 0.45, ring: 1 });
      facets.push({ pts: [T[i], S[i], G[(2 * i + 1) % 16], S[prev]], tilt: 0.85, ring: 2 });
      facets.push({ pts: [S[i], G[(2 * i + 1) % 16], G[(2 * i + 2) % 16]], tilt: 0.6, ring: 3 });
      facets.push({ pts: [S[i], G[(2 * i + 2) % 16], G[(2 * i + 3) % 16]], tilt: 0.6, ring: 3 });
    });

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-112 -112 224 224");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var defs = document.createElementNS(NS, "defs");
    defs.innerHTML =
      '<radialGradient id="gem-glow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="55%" stop-color="#b99a5b" stop-opacity="0.22"/>' +
      '<stop offset="100%" stop-color="#b99a5b" stop-opacity="0"/>' +
      "</radialGradient>";
    svg.appendChild(defs);

    var glow = document.createElementNS(NS, "circle");
    glow.setAttribute("r", "112");
    glow.setAttribute("fill", "url(#gem-glow)");
    svg.appendChild(glow);

    // Deterministic per-facet variation so every cut looks a little different.
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    facets.forEach(function (f) {
      var cx = 0, cy = 0;
      f.pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
      cx /= f.pts.length;
      cy /= f.pts.length;
      f.theta = Math.atan2(cy, cx);
      f.jitter = (rnd() - 0.5) * 0.3;
      f.phase = rnd() * Math.PI * 2;

      var poly = document.createElementNS(NS, "polygon");
      poly.setAttribute("points", f.pts.map(function (p) { return p[0].toFixed(2) + "," + p[1].toFixed(2); }).join(" "));
      poly.style.animationDelay = (0.1 + f.ring * 0.16 + rnd() * 0.12).toFixed(2) + "s";
      f.el = poly;
      svg.appendChild(poly);
    });
    host.appendChild(svg);

    var shade = function (light) {
      facets.forEach(function (f) {
        var l;
        if (f.tilt === 0) {
          l = 0.42 + 0.3 * Math.sin(light * 2 + 0.6);
        } else {
          var facing = Math.cos(f.theta - light);
          l = (1 - f.tilt) * 0.38 + f.tilt * (0.15 + 0.85 * Math.max(0, facing));
          l += f.jitter + 0.14 * Math.sin(f.theta * 3 + f.phase + light * 2);
        }
        l = Math.min(1, Math.max(0, l));
        var lightness = 14 + 78 * Math.pow(l, 1.05);
        var hue = 160;
        var sat = 16;
        if (l > 0.8) { hue = 42; sat = 34; } // warm specular highlights
        f.el.setAttribute("fill", "hsl(" + hue + "," + sat + "%," + lightness.toFixed(1) + "%)");
      });
    };

    var light = -0.8;
    shade(light);

    var visible = false;
    var lit = false;
    var lightUp = function () {
      if (!lit) { lit = true; host.classList.add("is-lit"); }
    };

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) lightUp();
      }, { threshold: 0.25 }).observe(host);
    } else {
      visible = true;
      lightUp();
    }

    if (!reduceMotion) {
      var target = null;
      var lastMove = 0;

      window.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        target = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
        lastMove = performance.now();
      }, { passive: true });

      var tick = function (now) {
        if (visible && !document.hidden) {
          if (target !== null && now - lastMove < 3000) {
            var d = Math.atan2(Math.sin(target - light), Math.cos(target - light));
            light += d * 0.08;
          } else {
            light += 0.0035;
          }
          shade(light);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---- Weight converter ------------------------------------------------- */
  var val = document.getElementById("w-val");
  var unit = document.getElementById("w-unit");
  var out = document.getElementById("w-out");
  if (val && unit && out) {
    var units = [["Kilograms", 1000], ["Grams", 1], ["Troy ounces", 31.1034768], ["Tolas", 11.6638038], ["Carats", 0.2]];
    var fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });
    var renderWeights = function () {
      var v = parseFloat(val.value);
      out.textContent = "";
      if (!isFinite(v) || v < 0) {
        var p = document.createElement("div");
        p.textContent = "Enter a weight to convert.";
        out.appendChild(p);
        return;
      }
      var grams = v * parseFloat(unit.value);
      units.forEach(function (u) {
        var row = document.createElement("div");
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = u[0];
        dd.textContent = fmt.format(grams / u[1]);
        row.appendChild(dt);
        row.appendChild(dd);
        out.appendChild(row);
      });
    };
    val.addEventListener("input", renderWeights);
    unit.addEventListener("change", renderWeights);
    renderWeights();
  }

  /* ---- Enquiry ---------------------------------------------------------- */
  // Send the contact enquiry through Formspree, with an accessible inline status.
  var form = document.querySelector("[data-enquiry]");
  if (form) {
    var status = document.getElementById("f-status");
    var submit = form.querySelector('[type="submit"]');
    var field = function (id) { return document.getElementById(id).value.trim(); };
    var emailOk = function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); };

    ["f-name", "f-mail", "f-msg"].forEach(function (id) {
      document.getElementById(id).addEventListener("input", function () {
        this.removeAttribute("aria-invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var problems = [];
      var firstBad = null;
      var check = function (id, ok, message) {
        var el = document.getElementById(id);
        if (ok) { el.removeAttribute("aria-invalid"); return; }
        el.setAttribute("aria-invalid", "true");
        problems.push(message);
        if (!firstBad) firstBad = el;
      };
      check("f-name", !!field("f-name"), "Enter your name.");
      check("f-mail", emailOk(field("f-mail")), field("f-mail") ? "Enter a valid email address, such as name@company.com." : "Enter your email address.");
      check("f-msg", !!field("f-msg"), "Write a short message so we know how to help.");
      if (problems.length) {
        status.classList.add("is-error");
        status.textContent = problems.join(" ");
        firstBad.focus({ preventScroll: true });
        firstBad.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }

      status.classList.remove("is-error");
      status.textContent = "Sending your enquiry…";
      submit.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (!response.ok) {
          return response.json().catch(function () { return {}; }).then(function (data) {
            var detail = data.errors && data.errors.length ? " " + data.errors.map(function (item) { return item.message; }).join(" ") : "";
            throw new Error(detail || "Please try again, or email info@eudirok.com.");
          });
        }
        form.reset();
        status.textContent = "Thank you. Your enquiry has been sent to Eudirok.";
      }).catch(function (error) {
        status.classList.add("is-error");
        status.textContent = "We couldn't send your enquiry." + (error.message ? " " + error.message : " Please email info@eudirok.com.");
      }).then(function () {
        submit.disabled = false;
      });
    });
  }

  /* ---- Scroll reveal, header state, mobile action bar ------------------- */
  (function () {
    var root = document.documentElement;
    if (hasIO && !reduceMotion) {
      root.classList.add("js-reveal");
      var targets = document.querySelectorAll(".section-head, .split > *, .index li, .metal, .register > div, .stone-rows li, .about-grid > *, .storage-grid > *, .stones-grid > *, .steps > *, .cta .wrap > *");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      targets.forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.setProperty("--d", (i % 4) * 70 + "ms");
        io.observe(el);
      });
    }

    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var tel = document.querySelector('.site-footer a[href^="tel:"]');
    var quote = document.querySelector(".head-cta");
    var onContacts = /\/contacts\/?$/.test(location.pathname);
    if (tel && quote && !onContacts && !document.querySelector(".mbar")) {
      var bar = document.createElement("div");
      bar.className = "mbar";
      var a = document.createElement("a");
      a.className = "btn btn-quiet"; a.href = tel.getAttribute("href"); a.textContent = "Call us";
      var b = document.createElement("a");
      b.className = "btn btn-primary"; b.href = quote.getAttribute("href"); b.textContent = "Request a quote";
      bar.appendChild(a); bar.appendChild(b);
      document.body.appendChild(bar);
      document.body.classList.add("has-mbar");
    }
  })();
})();
