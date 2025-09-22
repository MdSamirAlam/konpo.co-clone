// "RayMarching starting point" 
// by Martijn Steinrucken aka The Art of Code/BigWings - 2020
// The MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/
//
// You can use this shader as a template for ray marching shaders

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define TAU 6.283185
#define PI 3.141592
#define S smoothstep
#define T iTime

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float sdBox(vec3 p, vec3 s) {
  p = abs(p) - s;
  return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.);
}

float GetDist(vec3 p) {
  p.xz *= Rot(iTime * 0.2);

  float d = sdBox(p, vec3(1));

  float c = cos(3.1416 / 5.), s = sqrt(0.75 - c * c);
  vec3 n = vec3(-0.5, -c, s);

  p = abs(p);
  p -= 2. * min(0., dot(p, n)) * n;

  p.xy = abs(p.xy);
  p -= 2. * min(0., dot(p, n)) * n;

  p.xy = abs(p.xy);
  p -= 2. * min(0., dot(p, n)) * n;

  d = p.z - 0.8;

  return d;
}

float RayMarch(vec3 ro, vec3 rd, float side) {
  float dO = 0.;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = GetDist(p) * side;
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < SURF_DIST)
      break;
  }

  return dO;
}

vec3 GetNormal(vec3 p) {
  vec2 e = vec2(.015, 0);
  vec3 n = GetDist(p) -
    vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));

  return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l - p), r = normalize(cross(vec3(0, 1, 0), f)), u = cross(f, r), c = f * z, i = c + uv.x * r + uv.y * u;
  return normalize(i);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.y;
  vec2 m = iMouse.xy / iResolution.xy;

  vec3 ro = vec3(0, 3, -3) * 0.7;
  ro.yz *= Rot(-m.y * PI + 1.);
  ro.xz *= Rot(-m.x * TAU);

  vec3 rd = GetRayDir(uv, ro, vec3(0, 0., 0), 1.);

  vec3 col = texture(iChannel0, rd).rgb;

  float d = RayMarch(ro, rd, 1.); // outside of the object

  float IOR = 1.46; // Index of refraction (Diamond: 2.4 or something)

  if(d < MAX_DIST) {
    vec3 p = ro + rd * d; // 3d hit position
    vec3 n = GetNormal(p); // normal of surface.. (oriantation)
    vec3 r = reflect(rd, n);
    vec3 refOutside = texture(iChannel0, r).rgb;

    vec3 rdIn = refract(rd, n, 1. / IOR); // ray dir when entering

    vec3 pEnter = p - n * SURF_DIST * 3.;
    float dIn = RayMarch(pEnter, rdIn, -1.); // inside the object

    vec3 pExit = pEnter + rdIn * dIn; // 3d position of exit
    vec3 nExit = -GetNormal(pExit);

    vec3 reflTex = vec3(0);
    vec3 rdOut = vec3(0);

    float abb = 0.012; // Rainbow effect on refraction

        // Red
    rdOut = refract(rdIn, nExit, IOR - abb);
    if(dot(rdOut, rdOut) == 0.)
      rdOut = reflect(rdIn, nExit);
    reflTex.r = texture(iChannel0, rdOut).r;

        // Green
    rdOut = refract(rdIn, nExit, IOR);
    if(dot(rdOut, rdOut) == 0.)
      rdOut = reflect(rdIn, nExit);
    reflTex.g = texture(iChannel0, rdOut).g;

        // Blue
    rdOut = refract(rdIn, nExit, IOR + abb);
    if(dot(rdOut, rdOut) == 0.)
      rdOut = reflect(rdIn, nExit);
    reflTex.b = texture(iChannel0, rdOut).b;

    float dens = 0.1;
    float optDist = exp(-dIn * dens);

    reflTex = reflTex * optDist * vec3(0.94, 0.75, 0.78); // color

    float fresnel = pow(1. + dot(rd, n), 5.);

    col = mix(reflTex, refOutside, fresnel);

        // col = n * .5 + .5; // to give every corner a color
  }

  col = pow(col, vec3(.4545)); // gamma correction

  fragColor = vec4(col, 1.0);
}