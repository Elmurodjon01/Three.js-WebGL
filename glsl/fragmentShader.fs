        varying vec4 WorldPosition;
        uniform float Height;
        
        
    
        void main() {
            float ratio = WorldPosition.z / Height;
            
            vec3 colorArray[7];
       		colorArray[0] = vec3(0.58,0,0.82);
       		colorArray[1] = vec3(0.29,0,0.51);
       		colorArray[2] = vec3(0,0,1.0);
       		colorArray[3] = vec3(0,1.0,0);
       		colorArray[4] = vec3(1.0,1.0,0);
       		colorArray[5] = vec3(1.0,0.5,0);
       		colorArray[6] = vec3(1.0,0,0);
       		
       		int index = int(ratio * 6.0);
       		float remainder = (ratio * 6.0) - float(index);
       		vec3 color = vec3(0,0,0);
       		
       		if (index == 0)
       			color = colorArray[0] * (1.0-remainder) + colorArray[1] * remainder;
       		else if (index == 1)
       			color = colorArray[1] * (1.0-remainder) + colorArray[2] * remainder;
       		else if (index == 2)
       			color = colorArray[2] * (1.0-remainder) + colorArray[3] * remainder;
       		else if (index == 3)
       			color = colorArray[3] * (1.0-remainder) + colorArray[4] * remainder;
       		else if (index == 4)
       			color = colorArray[4] * (1.0-remainder) + colorArray[5] * remainder;
       		else if (index == 5)
       			color = colorArray[5] * (1.0-remainder) + colorArray[6] * remainder;

            gl_FragColor = vec4(color,1.0);
        }