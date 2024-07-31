// THREE JS Infinite Grid Helper; MIT License;

function InfiniteGridHelper(uDistance,uSize,uColor,p4)
{
	const geometry = new THREE.PlaneGeometry(2,2);console.log(geometry);

	//geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([-1,1,0,1,1,0,-1,-1,0,-1,-1,0,1,1,0,1,-1,0],3));
	//geometry.computeVertexNormals();

    //geometry.setAttribute('normal',new THREE.Float32BufferAttribute([],3));

	const material=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent: true,
		vertexShader: `
	
	varying vec3 worldPosition;
	
	void main() {
	
		vec3 pos = position.xzy*`+uDistance+`;
		worldPosition = pos;
		
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	
	}
	`,fragmentShader:`
	varying vec3 worldPosition;
	
	float getGrid(float size) 
	{
		vec2 r = worldPosition.xz / size;
		
		vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
		float line = min(grid.x, grid.y);
	
		return `+p4+` - min(line, `+p4+`);
	}
	
	void main()
	{	
		float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / `+uDistance+`, 1.0);
	
		float g1 = getGrid(`+uSize+`);
		
		gl_FragColor = vec4(vec3(`+uColor+`), g1 * pow(d, 2.0));
	}`});

	g0=new THREE.Mesh(geometry,material);g0.frustumCulled=0;

	return g0;
}

function LineHelper(uDistance,p4)
{
	const geometry=new THREE.PlaneGeometry(2,2);

	const material=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,vertexShader:`
	varying vec3 worldPosition;

	void main()
	{
		vec3 pos=position.xzy*`+uDistance+`;
		worldPosition = pos;
		
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	}
	`,fragmentShader:`
	varying vec3 worldPosition;

	void main()
	{	
		float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / `+uDistance+`, 1.0);
	
		vec2 r = worldPosition.xz;
		vec2 grid = abs(r) / fwidth(r);
		
		float g1=(`+p4+`-min(grid.y,`+p4+`));float g2=(`+p4+`-min(grid.x,`+p4+`));

		gl_FragColor=vec4(mix(vec3(0.0,1.0,0.0),vec3(1.0,0.0,0.0),g1),(g2+g1)*pow(d,2.0));
	}`});

	g0=new THREE.Mesh(geometry,material);g0.frustumCulled=0;

	return g0;
}