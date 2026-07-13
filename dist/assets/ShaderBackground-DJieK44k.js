import{r as h,j as S}from"./index-CO4JiyRa.js";function b(){const n=h.useRef(null);return h.useEffect(()=>{const e=n.current;if(!e)return;const t=e.getContext("webgl",{alpha:!1,antialias:!1});if(!t)return;let s;const c=Math.min(window.devicePixelRatio,1.5);function r(){!e||!t||(e.width=window.innerWidth*c,e.height=window.innerHeight*c,t.viewport(0,0,e.width,e.height))}const u=`
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `,v=`
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 center = vec2(0.5, 0.45);
        float dist = length(uv - center);

        // Radial gradient - dark blue center glow
        float glow = exp(-dist * dist * 4.0) * 0.12;
        float glow2 = exp(-dist * dist * 1.5) * 0.04;

        // Nebula noise
        float n = noise(uv * 3.0 + u_time * 0.02) * 0.5 + 0.5;
        float n2 = noise(uv * 5.0 - u_time * 0.015) * 0.5 + 0.5;
        float nebula = n * n2 * 0.06 * exp(-dist * 2.0);

        // Stars
        float stars = 0.0;
        for (float i = 1.0; i < 4.0; i++) {
          vec2 grid = floor(uv * (200.0 * i)) / (200.0 * i);
          float h = hash(grid + i * 100.0);
          if (h > 0.995) {
            float twinkle = sin(u_time * (1.0 + h * 3.0) + h * 10.0) * 0.3 + 0.7;
            float size = 1.0 / (200.0 * i * u_res.x);
            float starDist = length(uv - (grid + 0.5 / (200.0 * i)));
            stars += exp(-starDist * starDist * 200000.0 * i) * twinkle * (1.0 - dist * 0.5);
          }
        }

        // Shooting stars
        float shoot = 0.0;
        for (float i = 0.0; i < 3.0; i++) {
          float t = fract(u_time * 0.08 + i * 0.33);
          vec2 sp = vec2(
            fract(hash(vec2(i, 1.0)) + t * 0.4) * 1.4 - 0.2,
            fract(hash(vec2(i, 2.0)) - t * 0.3) * 1.2 + 0.1
          );
          vec2 dir = vec2(0.4, -0.3);
          vec2 toStar = uv - sp;
          float along = dot(toStar, dir);
          float across = abs(dot(toStar, vec2(-dir.y, dir.x)));
          float trail = exp(-across * across * 8000.0) * exp(-along * along * 200.0) * smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.7, t);
          shoot += trail * 0.8;
        }

        vec3 color = vec3(0.047, 0.086, 0.078);
        // Gold-brass glow
        color += vec3(0.78, 0.58, 0.28) * glow;
        color += vec3(0.10, 0.36, 0.30) * glow2;
        // Subtle nebula
        color += vec3(0.10, 0.32, 0.26) * nebula;
        // Stars
        color += vec3(1.0, 0.95, 0.84) * stars * 0.7;
        // Shooting stars with champagne tint
        color += vec3(1.0, 0.85, 0.55) * shoot;

        gl_FragColor = vec4(color, 1.0);
      }
    `;function l(a,x){const i=t.createShader(x);return t.shaderSource(i,a),t.compileShader(i),i}const o=t.createProgram();t.attachShader(o,l(u,t.VERTEX_SHADER)),t.attachShader(o,l(v,t.FRAGMENT_SHADER)),t.linkProgram(o),t.useProgram(o);const m=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,m),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);const f=t.getAttribLocation(o,"a_pos");t.enableVertexAttribArray(f),t.vertexAttribPointer(f,2,t.FLOAT,!1,0,0);const g=t.getUniformLocation(o,"u_time"),p=t.getUniformLocation(o,"u_res");r(),window.addEventListener("resize",r);const w=performance.now();function d(){const a=(performance.now()-w)/1e3;t.uniform1f(g,a),t.uniform2f(p,e.width,e.height),t.drawArrays(t.TRIANGLE_STRIP,0,4),s=requestAnimationFrame(d)}return d(),()=>{window.removeEventListener("resize",r),cancelAnimationFrame(s)}},[]),S.jsx("canvas",{"code-path":"src/components/ShaderBackground.tsx:150:5",ref:n,style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0}})}export{b as default};
