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



