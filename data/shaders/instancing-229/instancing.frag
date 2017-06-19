#version 450

#extension GL_ARB_separate_shader_objects : enable
#extension GL_ARB_shading_language_420pack : enable

#define SOFTEN_AO     25.0f
#define AMBIENT_COEFF  0.001f

layout (binding = 1) uniform sampler2DArray samplerArray;

layout (location = 0) in vec3  inNormal;
layout (location = 1) in vec3  inColor;
layout (location = 2) in vec3  inUV;
layout (location = 3) in vec3  inViewVec;
layout (location = 4) in vec3  inLightVec;
layout (location = 5) in float inLightInt;

layout (location = 0) out vec4 outFragColor;

void main() 
{
	vec4 color = texture(samplerArray, inUV) * vec4(inColor, 1.0);	
	vec3 N = normalize(inNormal);
	vec3 L = normalize(inLightVec);
	vec3 V = normalize(inViewVec);
	vec3 R = reflect(-L, N);
	
	vec3 ambient = inLightInt * AMBIENT_COEFF * vec3(1.0f) / (length(inLightVec) * length(inLightVec) + SOFTEN_AO);
	vec3 diffuse = max(dot(N, L), 0.0) * inColor;
	vec3 specular = (dot(N,L) > 0.0) ? pow(max(dot(R, V), 0.0), 16.0) * vec3(1.0) * color.r : vec3(0.0);
	
	outFragColor = vec4((diffuse + ambient) * color.rgb + specular, 1.0);
	outFragColor *= inLightInt;
	outFragColor /= length(inLightVec) * length(inLightVec);
}
