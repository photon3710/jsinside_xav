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


