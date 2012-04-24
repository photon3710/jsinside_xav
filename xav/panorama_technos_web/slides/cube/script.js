var lib_matrix4= {
    get_I4: function() { return [1,0,0,0,
                                 0,1,0,0,
                                 0,0,1,0,
                                 0,0,0,1]},
    set_I4: function(m) {
        m[0]=1; m[1]=0; m[2]=0; m[3]=0;
        m[4]=0; m[5]=1; m[6]=0; m[7]=0;
        m[8]=0; m[9]=0; m[10]=1; m[11]=0;
        m[12]=0; m[13]=0; m[14]=0; m[15]=1;
    },

    copyNew: function(m) {
        return [m[0], m[1], m[2], m[3],
                m[4], m[5], m[6], m[7],
                m[8], m[9], m[10], m[11],
                m[12], m[13], m[14], m[15]];
    },
};


var lib_matrix_projection={
    get: function(angle, a, zMin, zMax) {
        var tan=Math.tan(lib_maths.degToRad(0.5*angle)),
            A=-(zMax+zMin)/(zMax-zMin),
            B=(-2*zMax*zMin)/(zMax-zMin);

        return [
            .5/tan, 0 , 0, 0,
            0, .5*a/tan,  0, 0,
            0, 0,      A, B,
            0, 0,     -1, 0
        ];
    }


}


var lib_matrix_rot4={
     rotateX: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv1=m[1], mv5=m[5], mv9=m[9];
          m[1]=m[1]*c-m[2]*s;
          m[5]=m[5]*c-m[6]*s;
          m[9]=m[9]*c-m[10]*s;

          m[2]=m[2]*c+mv1*s;
          m[6]=m[6]*c+mv5*s;
          m[10]=m[10]*c+mv9*s;
    },

    rotateY: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv0=m[0], mv4=m[4], mv8=m[8];
          m[0]=c*m[0]+s*m[2];
          m[4]=c*m[4]+s*m[6];
          m[8]=c*m[8]+s*m[10];

          m[2]=c*m[2]-s*mv0;
          m[6]=c*m[6]-s*mv4;
          m[10]=c*m[10]-s*mv8;
    },

    rotateZ: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv0=m[0], mv4=m[4], mv8=m[8];
          m[0]=c*m[0]-s*m[1];
          m[4]=c*m[4]-s*m[5];
          m[8]=c*m[8]-s*m[9];

          m[1]=c*m[1]+s*mv0;
          m[5]=c*m[5]+s*mv4;
          m[9]=c*m[9]+s*mv8;
    }
};var lib_matrix_mv={
    translateRot: function(m,v) {
       m[12]+=v[0]*m[0]+v[1]*m[4]+v[2]*m[8];
       m[13]+=v[0]*m[1]+v[1]*m[5]+v[2]*m[9];
       m[14]+=v[0]*m[2]+v[1]*m[6]+v[2]*m[10];
    }
};/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var lib_maths={
    degToRad: function(angle) {
        return angle*Math.PI/180;
    }

};if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	} )();

};

if ( !window.cancelRequestAnimationFrame ) {

	window.cancelRequestAnimationFrame = ( function() {

		return window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame;

	} )();

};


/*
 * spec.canvas_id : id of the canvas
 */
var GL, CV;
var Contexte=(function() {
    return {
        instance: function(spec) {
            var canvas=document.getElementById(spec.canvas_id);
            CV=canvas;
            try {
		GL = canvas.getContext("experimental-webgl", {antialias: true});
            } catch (e) {
		alert("Vous n'êtes pas compatibles webgl !") ;
                return false;
            } ;
            var scene=Scene.instance({});
            var shaders=Shaders.instance({});
            var vue=Vue.instance({camera: [0,0,-10], theta: 0, phi: 0, angle: 45, zMin: 1, zMax: 50});            
            var cube=Cube.instance({l: 6, centre: [0,0,1]})            
            cube.set_physics(
                function(self) {
                    self.rotateX(0.01);
                    self.rotateY(0.0114);
                    self.rotateZ(0.0084);
                }
            );
            scene.add_objet(cube);
            scene.draw();
            var timer_physics=setInterval("SCENE.drawPhysics()", 16);
            return true;
        }
    }
})();



/*
 * spec.vertices : tableau js des vertex
 * spec.indices : tableau js des indices
 */
var Maillage=(function () {
    return {
        instance: function(spec) {
            var vbo=VBO.instance({tableau_js: spec.vertices});
            var vbo_indices=VBO_indices.instance({tableau_js: spec.indices});

            return {
                draw: function() {
                    vbo.draw();
                    vbo_indices.draw();
                }
            }
        }
    }
}());


/*
 * spec.maillage : maillage de l'objet (type Maillage)
 * spec.matrix: matrice de mouvement (defaut : I4)
 */
var Objet=(function() {
    return {
        instance: function(spec) {
            spec.matrix=spec.matrix || lib_matrix4.get_I4();
            var matrix=lib_matrix4.copyNew(spec.matrix);
            var that={
                draw: function() {                    
                    SHADERS.set_matriceObjet(matrix);
                    spec.maillage.draw();
                },
                rotateX: function(dTheta) {
                    lib_matrix_rot4.rotateX(matrix, dTheta);
                },
                rotateY: function(dTheta) {
                    lib_matrix_rot4.rotateY(matrix, dTheta);
                },
                rotateZ: function(dTheta) {
                    lib_matrix_rot4.rotateZ(matrix, dTheta);
                },

                drawPhysics: false,

                set_physics: function(phyFunc) {
                    that.drawPhysics=phyFunc;
                }
            };
            return that;
        }
    }
})();

/*
 * spec.camera : position de la caméra. defaut : [0,0,0]
 * spec.theta : angle horizontal en radians. defaut : 0
 * spec.phi : angle vertical en radians. defaut : 0
 * spec.angle : angle de vue en degrés. Utilisé pour la matrice de projection. defaut : 45
 * spec.zMin : zMin de la matrice de projection. defaut : 1
 * spec. zMax : zMax de la matrice de projection. defaut : 10
 * spec.a : rapport L/H du canvas. defaut : CV.width/CV.height
 */
var VUE;
var Vue=(function() {
    return {
        instance: function(spec) {
            spec.camera=spec.camera || [0,0,0];
            spec.theta=spec.theta || 0;
            spec.phi=spec.phi ||0;
            spec.angle=spec.angle || 45;
            spec.zMin=spec.zMin || 1;
            spec.zMax=spec.zMax || 10;
            spec.a=CV.width/CV.height;

            var matrice_vue=lib_matrix4.get_I4();
            var matrice_projection=lib_matrix_projection.get(spec.angle, spec.a, spec.zMin, spec.zMax);
           
            var calcule_matrice=function() {
                lib_matrix4.set_I4(matrice_vue);                
                lib_matrix_rot4.rotateZ(matrice_vue, spec.theta);
                lib_matrix_rot4.rotateX(matrice_vue, spec.phi);
                lib_matrix_mv.translateRot(matrice_vue, spec.camera);
            }

            var that={
                draw: function() {
                    SHADERS.set_matriceVue(matrice_vue);
                },
                drawPhysics: function() {

                }
            }
            calcule_matrice();
            SHADERS.set_matriceProjection(matrice_projection);
            VUE=that;
            return that;
        }
    };
})();

/*
 * spec: empty
 */
var SCENE;
var Scene=(function () {
    return {
        instance: function(spec) {
            var objets=[];

            var drawObjet=function(objet) {
                objet.draw();
            }

            var drawObjetPhysics=function(objet) {                
                if (objet.drawPhysics) objet.drawPhysics(objet);
            }

            GL.enable(GL.DEPTH_TEST);
            GL.depthFunc(GL.LEQUAL);
            GL.clearColor(1.0, 1.0, 1.0, 1.0);
            GL.clearDepth(1.0);

            var that={
                   draw: function(timestamp) {
                       GL.viewport(0.0, 0.0, CV.width, CV.height);
                       GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
                       VUE.draw();
                       objets.map(drawObjet);
                        window.requestAnimationFrame(SCENE.draw);
                   },

                   drawPhysics: function() {
                       VUE.drawPhysics();
                       objets.map(drawObjetPhysics);
                   },

                   add_objet: function(objet) {
                       objets.push(objet);
                   }
            };
            SCENE=that;
            return that;
        }
    };
})();


/*
 * spec: empty
 */
var SHADERS;
var Shaders=(function (){

    var get_shader=function(source, type) {
            var shader = GL.createShader(type);
            GL.shaderSource(shader, source);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert(GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
    };

    var shader_vertex_source="attribute vec3 position, couleur;\n\
uniform mat4 matrice_vue, matrice_projection, matrice_objet;\n\
varying vec3 vcouleur;\n\
void main(void) {\n\
    gl_Position = matrice_projection * matrice_vue * matrice_objet * vec4(position, 1.0);    \n\
    vcouleur = couleur;\n\
}",
        shader_fragment_source="#ifdef GL_ES\n\
precision mediump float;\n\
precision mediump vec3;\n\
#endif\n\
varying vec3 vcouleur;\n\
\n\
void main(void) {\n\
    gl_FragColor = vec4(vcouleur, 1.);\n\
}";

    var shader_vertex,
        shader_fragment,
        shader_program;

    var matrice_vue,
        matrice_projection,
        matrice_objet,
        position,
        couleur;

    var that={
        instance: function(spec) {
            shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER);
            shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER);
            shader_program=GL.createProgram();
            GL.attachShader(shader_program, shader_vertex);
            GL.attachShader(shader_program, shader_fragment);
            GL.linkProgram(shader_program);
            matrice_projection = GL.getUniformLocation(shader_program, "matrice_projection");
            matrice_vue = GL.getUniformLocation(shader_program, "matrice_vue");
            matrice_objet = GL.getUniformLocation(shader_program, "matrice_objet");
            position = GL.getAttribLocation(shader_program, "position");
            couleur = GL.getAttribLocation(shader_program, "couleur");
            GL.enableVertexAttribArray(position);
            GL.enableVertexAttribArray(couleur);
            GL.useProgram(shader_program);
        },

        set_matriceProjection: function(matrice) {
            GL.uniformMatrix4fv(matrice_projection, false, matrice);
        },

        set_matriceVue: function(matrice) {
            GL.uniformMatrix4fv(matrice_vue, false, matrice);
        },

        set_matriceObjet: function(matrice) {
            GL.uniformMatrix4fv(matrice_objet, false, matrice);
        },

        set_vertexPointers: function() {
            GL.vertexAttribPointer(position, 3, GL.FLOAT, false,24,0) ;
            GL.vertexAttribPointer(couleur, 3, GL.FLOAT, false,24,12) ;
        }

    };
    SHADERS=that;
    return that;

})();


/*
 * spec: tableau_js : tableau js des vertex
 */
var VBO=(function() {
    return {
       instance: function(spec) {
            var vbo= GL.createBuffer ();
            GL.bindBuffer(GL.ARRAY_BUFFER, vbo);
            GL.bufferData(GL.ARRAY_BUFFER,
	  		  new Float32Array(spec.tableau_js),
			  GL.STATIC_DRAW);
            return {
                draw: function() {                   
                   GL.bindBuffer(GL.ARRAY_BUFFER, vbo) ;
                   SHADERS.set_vertexPointers();
                }
            }
       }
    }
})();

/*
 * spec: tableau_js : tableau js des indices
 */
var VBO_indices=(function() {
    return {
       instance: function(spec) {
            var vbo= GL.createBuffer ();
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vbo);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
	  		  new Uint16Array(spec.tableau_js),
			  GL.STATIC_DRAW);
            var taille=spec.tableau_js.length;
            return {
                draw: function() {
                   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vbo);
                   GL.drawElements(GL.TRIANGLES, taille, GL.UNSIGNED_SHORT, 0);
                }
            }
       }
    }
})();


/*
 * spec.centre : position du centre du cube. defaut : [0,0,0]
 * spec.l : taille d'une arrete du cube. defaut : 1
 */
var Cube=(function() {
    return {        
        instance: function(spec) {
            spec.l=spec.l || 1;
            spec.centre=spec.centre || [0,0,0];
            var a=spec.l/2,
                c=spec.centre;
            return Objet.instance({maillage: Maillage.instance({
                    vertices: [-a+c[0], -a+c[1], -a+c[2], //position du 1° sommer
                             0,0,0,                      //couleur du 1° sommet (noir)
                             -a+c[0], a+c[1], -a+c[2],
                             1,0,0,
                             a+c[0], a+c[1], -a+c[2],
                             1,1,0,
                             a+c[0], -a+c[1], -a+c[2],
                             0,1,0,
                             -a+c[0], -a+c[1], a+c[2],
                             0,0,1,
                             -a+c[0], a+c[1], a+c[2],
                             1,0,1,
                             a+c[0], a+c[1], a+c[2],
                             1,1,1,
                             a+c[0], -a+c[1], a+c[2],
                             0,1,1
                    ],
                    indices: [0,1,2, 0,2,3, //les 2 triangles de la face 1
                              1,5,6, 1,6,2,
                              3,2,6, 3,6,7,
                              0,4,7, 0,7,3,
                              0,1,5, 0,5,4,
                              4,5,6, 4,6,7
                    ]
            })});
        }
    }
})();


var main=function() {
    var isContexte=Contexte.instance({canvas_id: "mon_canvas"});
};