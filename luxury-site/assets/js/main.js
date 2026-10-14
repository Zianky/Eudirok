/* Eudirok Jewellery — site scripts (no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
        toggle.focus();
      }
    });
  }

  /* ---- Faceted diamond (hero) ------------------------------------------- */
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
      '<stop offset="55%" stop-color="#b99a5b" stop-opacity="0.16"/>' +
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

    facets.forEach(function (f, idx) {
      var cx = 0, cy = 0;
      f.pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
      cx /= f.pts.length;
      cy /= f.pts.length;
      f.theta = Math.atan2(cy, cx);
      f.jitter = (rnd() - 0.5) * 0.3;
      f.phase = rnd() * Math.PI * 2;

      var poly = document.createElementNS(NS, "polygon");
      poly.setAttribute("points", f.pts.map(function (p) { return p[0].toFixed(2) + "," + p[1].toFixed(2); }).join(" "));
      poly.style.animationDelay = (0.25 + f.ring * 0.16 + rnd() * 0.12).toFixed(2) + "s";
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

    if (!reduceMotion) {
      var target = null;
      var lastMove = 0;
      var visible = true;

      window.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        target = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
        lastMove = performance.now();
      }, { passive: true });

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }).observe(host);
      }

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

  /* ---- Enquiry form ----------------------------------------------------- */
  var form = document.querySelector("[data-enquiry]");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var to = form.getAttribute("data-to");
      var subject = "Enquiry from " + data.get("name");
      var body = data.get("message") + "\n\n" + data.get("name") + "\n" + data.get("email");
      window.location.href =
        "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (status) {
        status.textContent = "Your email app should open with the enquiry ready to send. If it does not, write to " + to + ".";
      }
    });
  }
})();
