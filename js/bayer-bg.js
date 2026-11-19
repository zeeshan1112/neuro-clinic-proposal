/**
 * Crisp Topographical Bayer-Dithered WebGL Background
 * Pixelated 4x4 ordered dithering over layered topographical ridges
 * quantized into the DocScale + Neurology palette (#F4F7FA -> #1363B8 -> #0D2239).
 * Respects prefers-reduced-motion (renders 1 static frame) and exposes pause/resume controls.
 */
(function initBayerBackground() {
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

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.04;
        a *= 0.5;
      }
      return v;
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

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float t = u_time * 0.065;
      float pan = u_slide * 0.34 + (u_mouse.x - 0.5) * 0.10;

      // Three layered topographical neural contour ridges
      float ridge1 = 0.28 + 0.14 * fbm(vec2(uv.x * 2.2 + pan + t, 1.3));
      float ridge2 = 0.44 + 0.15 * fbm(vec2(uv.x * 3.1 - pan * 0.6 - t * 0.7, 4.7));
      float ridge3 = 0.60 + 0.13 * fbm(vec2(uv.x * 4.4 + pan * 0.4 + t * 0.4, 8.2));

      float val = 0.05;
      val += (1.0 - uv.y) * 0.16;

      float d1 = uv.y - ridge1;
      float d2 = uv.y - ridge2;
      float d3 = uv.y - ridge3;

      if (d3 < 0.0) val = max(val, 0.28 + exp(d3 * 10.0) * 0.34);
      if (d2 < 0.0) val = max(val, 0.35 + exp(d2 * 14.0) * 0.48);
      if (d1 < 0.0) val = max(val, 0.22 + exp(d1 * 18.0) * 0.64);

      float mDist = length(uv - vec2(u_mouse.x, 1.0 - u_mouse.y));
      val += exp(-mDist * 6.0) * 0.13;
      val = clamp(val, 0.0, 1.0);

      float threshold = bayer4(floor(gl_FragCoord.xy)) - 0.5;
      float q = clamp(val + threshold * 0.24, 0.0, 1.0);

      vec3 c0 = vec3(0.957, 0.969, 0.980); // #F4F7FA alabaster paper
      vec3 c1 = vec3(0.898, 0.929, 0.961); // #E5EDF5 soft clinical wash
      vec3 c2 = vec3(0.773, 0.827, 0.878); // #C5D3E0 rule blue-gray
      vec3 c3 = vec3(0.075, 0.388, 0.722); // #1363B8 DocScale cobalt crests
      vec3 c4 = vec3(0.051, 0.133, 0.224); // #0D2239 deep navy peaks

      vec3 col = c0;
      if (q > 0.27) col = c1;
      if (q > 0.47) col = c2;
      if (q > 0.68) col = c3;
      if (q > 0.86) col = c4;

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

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    mx: 0.5,
    my: 0.5,
    tmx: 0.5,
    tmy: 0.5,
    slide: 0,
    tslide: 0,
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

    drawFrame(state.elapsed);
    state.rafId = requestAnimationFrame(frame);
  }

  function setSlide(idx) {
    state.tslide = idx;
    if (state.paused) {
      state.slide = idx;
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
