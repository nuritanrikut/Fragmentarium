#info Mandelbulb Distance Estimator
#define providesInit
#include "DE-Raytracer.frag"
#include "MathUtils.frag"
#group Mandelbulb


// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Mandelbulb exponent (8 is standard)
uniform float Power; slider[0,8,16]

// Bailout radius
uniform float Bailout; slider[0,5,30]

// Alternate is slightly different, but looks more like a Mandelbrot for Power=2
uniform bool AlternateVersion; checkbox[false]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]

// Scale parameter. A perfect Menger is 3.0
uniform float RotAngle; slider[0.00,0,180]

mat3 rot;

void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}

// This is my power function, based on the standard spherical coordinates as defined here:
// http://en.wikipedia.org/wiki/Spherical_coordinate_system
//
// It seems to be similar to the one Quilez uses:
// http://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
//
// Notice the north and south poles are different here.
void powN1(inout vec3 z, float r, inout float dr) {
	// extract polar coordinates
	float theta = acos(z.z/r);
	float phi = atan(z.y,z.x);
	dr =  pow( r, Power-1.0)*Power*dr + 1.0;
	
	// scale and rotate the point
	float zr = pow( r,Power);
	theta = theta*Power;
	phi = phi*Power;
	
	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
}

// This is a power function taken from the implementation by Enforcer:
// http://www.fractalforums.com/mandelbulb-implementation/realtime-renderingoptimisations/
//
// I cannot follow its derivation from spherical coordinates,
// but it does give a nice mandelbrot like object for Power=2
void powN2(inout vec3 z, float zr0, inout float dr) {
	float zo0 = asin( z.z/zr0 );
	float zi0 = atan( z.y,z.x );
	float zr = pow( zr0, Power-1.0 );
	float zo = zo0 * Power;
	float zi = zi0 * Power;
	dr = zr*dr*Power + 1.0;
	zr *= zr0;
	z  = zr*vec3( cos(zo)*cos(zi), cos(zo)*sin(zi), sin(zo) );
}



// Compute the distance from `pos` to the Mandelbox.
float DE(vec3 pos) {
	vec3 z=pos;
	float r;
	float dr=1.0;
	int i=0;
	r=length(z);
	while(r<Bailout && (i<Iterations)) {
		if (AlternateVersion) {
			powN2(z,r,dr);
		} else {
			powN1(z,r,dr);
		}
		z+=pos;
		r=length(z);
		z*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
	
	return 0.5*log(r)*r/dr;
	/*
	Use this code for some nice intersections (Power=2)
	float a =  max(0.5*log(r)*r/dr, abs(pos.y));
	float b = 1000;
	if (pos.y>0)  b = 0.5*log(r)*r/dr;
	return min(min(a, b),
		max(0.5*log(r)*r/dr, abs(pos.z)));
	*/
}

#preset Default
FOV = 0.62536
Eye = -2.02889,-0.0740503,-0.808901
Target = 6.2469,0.270218,2.34088
Up = -0.283489,0.278232,0.714435
AntiAlias = 1
AntiAliasBlur = 1
Detail = -2.81064
DetailNormal = -2.54548
FudgeFactor = 0.80392
MaxRaySteps = 164
MaxRayStepsDiv = 1.8
BoundingSphere = 2
Dither = 0.5
AO = 0,0,0,0.7
Specular = 2.4348
SpecularExp = 16
SpotLight = 1,1,1,0.73563
SpotLightDir = -0.52,0.1
CamLight = 1,1,1,0.77273
Glow = 1,1,1,0
Fog = 0.10738
BaseColor = 1,1,1
OrbitStrength = 0.5625
X = 0.411765,0.6,0.560784,-0.21312
Y = 0.666667,0.666667,0.498039,0.86886
Z = 0.666667,0.333333,1,-0.18032
R = 0.4,0.7,1,0.0909
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 18.1816
Iterations = 12
ColorIterations = 2
Power = 8
Bailout = 6.279
AlternateVersion = true
RotVector = 1,1,1
RotAngle = 0
#endpreset

#preset Gray stuf
FOV = 0.622406
Eye = -0.174779,-0.538416,1.31843
Target = 2.53257,4.72842,-5.27392
Up = 0.636938,0.106389,0.346575
AntiAlias = 1
AntiAliasBlur = 1
Detail = -4.08758
DetailNormal = -2.82702
FudgeFactor = 0.95327
MaxRaySteps = 164
MaxRayStepsDiv = 1.8
BoundingSphere = 2
Dither = 0.5
AO = 0,0,0,0.7
Specular = 2.4348
SpecularExp = 16
SpotLight = 1,1,1,0.73563
SpotLightDir = -0.52,0.1
CamLight = 1,1,1,0.77273
Glow = 1,1,1,0
Fog = 0.83222
BaseColor = 1,1,1
OrbitStrength = 0.5625
X = 0.411765,0.6,0.560784,0.76378
Y = 0.666667,0.666667,0.498039,0.38582
Z = 0.666667,0.666667,0.498039,1
R = 0.4,0.7,1,-0.15874
BackgroundColor = 0.6,0.6,0.572549
GradientBackground = 0.3
Iterations = 12
ColorIterations = 2
Power = 8
Bailout = 6.279
AlternateVersion = true
RotVector = 1,1,1
RotAngle = 0
#endpreset

#preset Octobulb
FOV = 0.62536
Eye = -0.184126,0.843469,1.32991
Target = 1.48674,-5.55709,-4.56665
Up = -0.222647,-0.659381,0.652651
AntiAlias = 1
AntiAliasBlur = 1
Detail = -2.24819
DetailNormal = -2.15383
FudgeFactor = 1
MaxRaySteps = 164
MaxRayStepsDiv = 1.8
BoundingSphere = 2
Dither = 0.5
AO = 0,0,0,0.7
Specular = 1
SpecularExp = 27.082
SpotLight = 1,1,1,0.94565
SpotLightDir = 0.5619,0.18096
CamLight = 1,1,1,0.23656
Glow = 0.415686,1,0.101961,0.18421
Fog = 0.60402
HardShadow = 1
BaseColor = 1,1,1
OrbitStrength = 0.62376
X = 0.411765,0.6,0.560784,-0.37008
Y = 0.666667,0.666667,0.498039,0.86886
Z = 0.666667,0.333333,1,-0.25984
R = 0.4,0.7,1,0.36508
BackgroundColor = 0.666667,0.666667,0.498039
GradientBackground = 0.5
CycleColors = true
Cycles = 7.03524
Iterations = 14
ColorIterations = 6
Power = 8.18304
Bailout = 6.279
AlternateVersion = true
RotVector = 1,0,0
RotAngle = 77.8374
#endpreset

#preset Neo
FOV = 0.62536
Eye = 2.08194,0.182792,-0.638984
Target = -6.3711,-0.343365,1.96822
Up = -0.273145,0.370756,-0.810766
AntiAlias = 1
AntiAliasBlur = 1
Detail = -1.94159
DetailNormal = -2.89422
DetailAO = -0.21074
AOSpread = 2.3214
FudgeFactor = 0.80392
MaxRaySteps = 164
MaxRayStepsDiv = 1.8
BoundingSphere = 2
Dither = 0.5
AO = 0,0,0,0.5082
Specular = 2.4348
SpecularExp = 16
SpotLight = 1,1,1,0.73563
SpotLightDir = 0.33334,-0.25714
CamLight = 1,1,1,0.4301
Glow = 1,1,1,0
Fog = 0.10738
HardShadow = 1
BaseColor = 1,1,1
OrbitStrength = 0
X = 0.411765,0.6,0.560784,-0.21312
Y = 0.666667,0.666667,0.498039,0.86886
Z = 0.666667,0.333333,1,-0.18032
R = 0.4,0.7,1,0.0909
BackgroundColor = 0.666667,0.333333,0.498039
GradientBackground = 0.3
CycleColors = true
Cycles = 18.1816
Iterations = 12
ColorIterations = 2
Power = 8
Bailout = 6.279
AlternateVersion = true
RotVector = 1,1,1
RotAngle = 0
#endpreset