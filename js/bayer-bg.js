/**
 * Original 8x8 Bayer Ordered Dithering WebGL Shader — Synaptic Contour & Calm EEG Field
 * Quantized into the Midnight Clinical DocScale palette:
 *   #060A14 (void) -> #0B1427 -> #132544 -> #1D4E7A -> #38E1C6 (synaptic cyan) / #F5C45E (warm gold via u_warm)
 * Respects prefers-reduced-motion: reduce (renders 1 static frame) and exposes pause/resume controls.
 */
(function initBayerNeuralBackground() {
  const canvas = document.getElementById("bayer-bg");
  if (!canvas || window.location.search.includes("print-pdf")) return;

  const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return;

  const vertexSrc = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_slide;
    uniform float u_warm;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float bayer4(vec2 pos) {
      int x = int(mod(pos.x, 4.0));
      int y = int(mod(pos.y, 4.0));
      int idx = y * 4 + x;
      if (idx == 0)  return  0.0 / 16.0;
      if (idx == 1)  return  8.0 / 16.0;
      if (idx == 2)  return  2.0 / 16.0;
      if (idx == 3)  return 10.0 / 16.0;
      if (idx == 4)  return 12.0 / 16.0;
      if (idx == 5)  return  4.0 / 16.0;
      if (idx == 6)  return 14.0 / 16.0;
      if (idx == 7)  return  6.0 / 16.0;
      if (idx == 8)  return  3.0 / 16.0;
      if (idx == 9)  return 11.0 / 16.0;
      if (idx == 10) return  1.0 / 16.0;
      if (idx == 11) return  9.0 / 16.0;
      if (idx == 12) return 15.0 / 16.0;
      if (idx == 13) return  7.0 / 16.0;
      if (idx == 14) return 13.0 / 16.0;
      return  5.0 / 16.0;
    }

    float bayer8(vec2 pos) {
      float coarse = bayer4(floor(pos * 0.5));
      float fine = bayer4(pos);
      return (coarse + fine * 0.25) / 1.25;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

      float t = u_time * 0.22;
      float shift = u_slide * 0.28;

      // Two synaptic interference nuclei + calm horizontal EEG harmonic ribbons
      vec2 hubA = vec2(-0.42 + sin(shift + t * 0.25) * 0.14, 0.10 + cos(t * 0.19) * 0.08);
      vec2 hubB = vec2(0.42 + cos(shift * 0.7 - t * 0.21) * 0.14, -0.14 + sin(t * 0.23) * 0.08);

      float rA = length(p - hubA);
      float rB = length(p - hubB);

      float ringA = 0.5 + 0.5 * sin(rA * 18.0 - t * 1.4 + noise(p * 3.0 + shift) * 1.6);
      float ringB = 0.5 + 0.5 * sin(rB * 15.0 + t * 1.1 - noise(p * 2.5 - t * 0.2) * 1.4);

      // Calm horizontal EEG waveform contour bands
      float eegY = p.y * 5.2 + sin(p.x * 4.5 + shift + t * 0.6) * 0.42 + noise(p * 2.8 + vec2(t * 0.2, 0.0)) * 0.65;
      float contour = smoothstep(0.45, 0.98, abs(sin(eegY * 3.14159)));

      // Pointer synaptic glow
      vec2 mPos = vec2((u_mouse.x - 0.5) * aspect, (1.0 - u_mouse.y) - 0.5);
      float mGlow = exp(-length(p - mPos) * 4.2) * 0.34;

      // Combine field with radial edge fade so center stays deep and calm
      float radial = exp(-dot(p, p) * 1.05);
      float field = (ringA * 0.32 + ringB * 0.28 + contour * 0.24) * (0.45 + 0.55 * radial) + mGlow;
      field = clamp(field * 0.92, 0.0, 1.0);

      // 8x8 Bayer ordered dithering
      float threshold = bayer8(floor(gl_FragCoord.xy)) - 0.5;
      float q = clamp(field + threshold * 0.26, 0.0, 1.0);

      vec3 c0 = vec3(0.024, 0.039, 0.078); // #060A14 bg-void
      vec3 c1 = vec3(0.043, 0.078, 0.153); // #0B1427
      vec3 c2 = vec3(0.075, 0.145, 0.267); // #132544
      vec3 c3 = vec3(0.114, 0.306, 0.478); // #1D4E7A
      vec3 cMint = vec3(0.220, 0.882, 0.776); // #38E1C6 synaptic cyan
      vec3 cGold = vec3(0.961, 0.769, 0.369); // #F5C45E warm champagne gold
      vec3 c4 = mix(cMint, cGold, clamp(u_warm, 0.0, 1.0));

      vec3 col = c0;
      if (q > 0.25) col = c1;
      if (q > 0.46) col = c2;
      if (q > 0.68) col = c3;
      if (q > 0.87) col = mix(c3, c4, 0.65);

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

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const pos = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_resolution");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");
  const uSlide = gl.getUniformLocation(prog, "u_slide");
  const uWarm = gl.getUniformLocation(prog, "u_warm");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    mx: 0.5,
    my: 0.5,
    tmx: 0.5,
    tmy: 0.5,
    slide: 0,
    tslide: 0,
    warm: 0.1,
    twarm: 0.1,
    paused: prefersReduced,
    elapsed: 0,
    lastNow: null,
    rafId: null,
  };

  function drawFrame(timeSec) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, timeSec);
    gl.uniform2f(uMouse, state.mx, state.my);
    gl.uniform1f(uSlide, state.slide);
    gl.uniform1f(uWarm, state.warm);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function resize() {
    const scale = 0.25;
    canvas.width = Math.max(240, Math.floor(window.innerWidth * scale));
    canvas.height = Math.max(135, Math.floor(window.innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawFrame(state.elapsed);
  }

  window.addEventListener("pointermove", (e) => {
    state.tmx = e.clientX / Math.max(window.innerWidth, 1);
    state.tmy = e.clientY / Math.max(window.innerHeight, 1);
  });

  window.addEventListener("resize", resize);
  resize();

  function frame(now) {
    if (state.paused) {
      state.rafId = null;
      return;
    }
    if (state.lastNow !== null) {
      state.elapsed += Math.min((now - state.lastNow) * 0.001, 0.1);
    }
    state.lastNow = now;
    state.mx += (state.tmx - state.mx) * 0.05;
    state.my += (state.tmy - state.my) * 0.05;
    state.slide += (state.tslide - state.slide) * 0.08;
    state.warm += (state.twarm - state.warm) * 0.06;

    drawFrame(state.elapsed);
    state.rafId = requestAnimationFrame(frame);
  }

  function setSlide(idx, warmVal = 0.1) {
    state.tslide = idx;
    state.twarm = warmVal;
    if (state.paused) {
      state.slide = idx;
      state.warm = warmVal;
      drawFrame(state.elapsed);
    }
  }

  function pause() {
    state.paused = true;
    state.lastNow = null;
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    drawFrame(state.elapsed);
  }

  function resume() {
    if (!state.paused) return;
    state.paused = false;
    state.lastNow = performance.now();
    state.rafId = requestAnimationFrame(frame);
  }

  window.setBayerSlide = setSlide;
  window.bayerBg = {
    setSlide,
    pause,
    resume,
    isPaused: () => state.paused,
  };

  if (prefersReduced) {
    drawFrame(0);
  } else {
    state.rafId = requestAnimationFrame(frame);
  }
})();
