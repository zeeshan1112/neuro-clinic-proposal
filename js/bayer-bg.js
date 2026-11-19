/**
 * 8x8 Bayer-Dithered WebGL Horizon Ridges & Starry Sky Backdrop
 * Palette: Warm Editorial Forest-Slate (#081313 -> #133030 -> #215454) + Glacier Sage (#5FC4BC) & Champagne Gold (#FFCC78)
 * Features 4 parallax ridge layers, twinkling night stars, pointer lantern glow, and click/tap ripple wave.
 */
(function initBayerHorizonBackground() {
  const canvas = document.getElementById("bayer-bg");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return;

  const vs = `
    attribute vec2 p;
    void main() {
      gl_Position = vec4(p, 0.0, 1.0);
    }
  `;

  const fs = `
    precision mediump float;
    uniform vec2 uRes;
    uniform float uTime, uPan, uWarm, uClick, uBright;
    uniform vec2 uMouse;

    float h21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),
        mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.03;
        a *= 0.5;
      }
      return v;
    }

    float B2(vec2 a) {
      a = floor(a);
      return fract(a.x / 2.0 + a.y * a.y * 0.75);
    }
    float B4(vec2 a) { return B2(0.5 * a) * 0.25 + B2(a); }
    float B8(vec2 a) { return B4(0.5 * a) * 0.25 + B2(a); }

    void main() {
      vec2 cell = floor(gl_FragCoord.xy);
      vec2 uv = cell / uRes;
      float asp = uRes.x / max(uRes.y, 1.0);

      // Night sky brighter toward horizon glow
      float v = mix(0.36, 0.04, smoothstep(0.15, 1.0, uv.y));
      v += 0.12 * fbm(vec2(uv.x * 3.0 + uTime * 0.015 + uPan * 0.05, uv.y * 6.0)) * smoothstep(0.35, 0.75, uv.y);

      float sky = 1.0;
      // 4 parallax horizon ridge layers (far -> near)
      for (int k = 0; k < 4; k++) {
        float fk = float(k);
        float base = 0.64 - fk * 0.13;
        float h = base + (fbm(vec2(uv.x * (1.3 + fk * 0.9) + uPan * (0.10 + 0.14 * fk) + fk * 7.3, fk * 3.1)) - 0.5) * (0.32 - fk * 0.04);
        if (uv.y < h) {
          sky = 0.0;
          v = 0.34 - fk * 0.075;
          float crest = smoothstep(0.035, 0.0, h - uv.y) * (fk < 2.0 ? 1.0 : 0.38);
          v += crest * 0.55;
          v += (noise(uv * vec2(60.0, 90.0) + fk * 13.0) - 0.5) * 0.10;
          v -= (h - uv.y) * 0.52;
        }
      }

      // Twinkling night stars
      float st = h21(cell * 0.731 + 0.5);
      if (sky > 0.5 && st > 0.9965) {
        v = 0.62 + 0.38 * sin(uTime * 2.0 + st * 90.0);
      }

      // Pointer lantern + click ripple ring
      vec2 m = vec2(uMouse.x * asp, uMouse.y);
      vec2 q = vec2(uv.x * asp, uv.y);
      float d = distance(q, m);
      v += 0.22 * exp(-d * d * 28.0);
      float ring = uClick * 0.9;
      v += 0.35 * exp(-pow((d - ring) * 22.0, 2.0)) * exp(-uClick * 1.4);

      v *= uBright;
      float t = B8(gl_FragCoord.xy);
      float l = floor(clamp(v, 0.0, 1.0) * 3.4 + t);

      vec3 c0 = vec3(0.031, 0.075, 0.075); // #081313
      vec3 c1 = vec3(0.075, 0.190, 0.190); // #133030
      vec3 c2 = vec3(0.130, 0.330, 0.330); // #215454
      vec3 c3 = mix(vec3(0.373, 0.769, 0.737), vec3(1.0, 0.80, 0.47), clamp(uWarm, 0.0, 1.0));
      vec3 col = l < 0.5 ? c0 : l < 1.5 ? c1 : l < 2.5 ? c2 : c3;
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vShader = compile(gl.VERTEX_SHADER, vs);
  const fShader = compile(gl.FRAGMENT_SHADER, fs);
  if (!vShader || !fShader) return;

  const pr = gl.createProgram();
  gl.attachShader(pr, vShader);
  gl.attachShader(pr, fShader);
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);

  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const L = (n) => gl.getUniformLocation(pr, n);
  const uRes = L("uRes");
  const uTime = L("uTime");
  const uPan = L("uPan");
  const uWarm = L("uWarm");
  const uMouse = L("uMouse");
  const uClick = L("uClick");
  const uBright = L("uBright");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const U = {
    pan: 0,
    tpan: 0,
    warm: 0.25,
    twarm: 0.25,
    mx: 0.7,
    my: 0.5,
    smx: 0.7,
    smy: 0.5,
    click: 99,
    bright: 1,
    paused: prefersReduced,
    elapsed: 0,
    lastNow: null,
    rafId: null,
  };

  function drawFrame(timeSec) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, timeSec);
    gl.uniform1f(uPan, U.pan);
    gl.uniform1f(uWarm, U.warm);
    gl.uniform1f(uBright, U.bright);
    gl.uniform2f(uMouse, U.smx, U.smy);
    gl.uniform1f(uClick, U.click);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize() {
    canvas.width = Math.max(240, Math.ceil(window.innerWidth / 3));
    canvas.height = Math.max(135, Math.ceil(window.innerHeight / 3));
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawFrame(U.elapsed);
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("pointermove", (e) => {
    U.mx = e.clientX / Math.max(window.innerWidth, 1);
    U.my = 1 - e.clientY / Math.max(window.innerHeight, 1);
  });

  window.addEventListener("pointerdown", (e) => {
    U.mx = e.clientX / Math.max(window.innerWidth, 1);
    U.my = 1 - e.clientY / Math.max(window.innerHeight, 1);
    U.smx = U.mx;
    U.smy = U.my;
    U.click = 0;
  });

  function frame(now) {
    if (U.paused) {
      U.rafId = null;
      return;
    }
    if (U.lastNow !== null) {
      const dt = Math.min((now - U.lastNow) * 0.001, 0.1);
      U.elapsed += dt;
      U.click += dt;
    }
    U.lastNow = now;
    U.smx += (U.mx - U.smx) * 0.06;
    U.smy += (U.my - U.smy) * 0.06;
    U.pan += (U.tpan - U.pan) * 0.06;
    U.warm += (U.twarm - U.warm) * 0.06;

    drawFrame(U.elapsed);
    U.rafId = requestAnimationFrame(frame);
  }

  function setSlide(idx, warmVal = 0.25) {
    U.tpan = idx * 1.65;
    U.twarm = warmVal;
    U.click = 0.05;
    if (U.paused) {
      U.pan = U.tpan;
      U.warm = U.twarm;
      drawFrame(U.elapsed);
    }
  }

  function pause() {
    U.paused = true;
    U.lastNow = null;
    if (U.rafId !== null) {
      cancelAnimationFrame(U.rafId);
      U.rafId = null;
    }
    drawFrame(U.elapsed);
  }

  function resume() {
    if (!U.paused) return;
    U.paused = false;
    U.lastNow = performance.now();
    U.rafId = requestAnimationFrame(frame);
  }

  window.setBayerSlide = setSlide;
  window.bayerBg = {
    setSlide,
    pause,
    resume,
    isPaused: () => U.paused,
  };

  if (prefersReduced) {
    drawFrame(0);
  } else {
    U.rafId = requestAnimationFrame(frame);
  }
})();
