    var basicScene;
var BasicScene = Class.extend({
    init: function() {
        'use strict';

        this.scene = new THREE.Scene();

        var VIEW_WIDTH = $('#basic-scene').outerWidth();
        var VIEW_HEIGHT = $('#basic-scene').outerHeight();
        var VIEW_ANGLE = 45;
        var ASPECT = VIEW_WIDTH / VIEW_HEIGHT;
        var NEAR = 0.1;
        var FAR = 20000;

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        this.light = new THREE.PointLight();
        this.light.position.set(-256, 256, -256);
        this.scene.add(this.light);
        this.renderer = new THREE.WebGLRenderer();

        this.container = jQuery('#basic-scene');

        this.user = new Character({
            color: 0x7A43B6
        });

        this.scene.add(this.user.mesh);

        this.user.mesh.add(this.camera);

        this.world = new World({
            color: 0xF5F5F5
        });
        this.scene.add(this.world.mesh);

        this.setAspect();

        this.container.prepend(this.renderer.domElement);

        this.setFocus(this.user.mesh);

        this.setControls();
    },

    setControls: function() {
        'use strict';

        var user = this.user;

        var controls = {
            left: false,
            up: false,
            right: false,
            down: false
        };
        
        user.controls = controls;

        jQuery(document).keydown(function(e) {
            var prevent = true;

            switch (e.keyCode) {
                case 37:
                case 65:
                    controls.left = true;
                    break;
                case 38:
                case 87:
                    controls.up = true;
                    break;
                case 39:
                case 68:
                    controls.right = true;
                    break;
                case 40:
                case 83:
                    controls.down = true;
                    break;
                default:
                    prevent = false;
            }

            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }

            user.setDirection(controls);
        });

        jQuery(document).keyup(function(e) {
            var prevent = true;

            switch (e.keyCode) {
                case 37:
                case 65:
                    controls.left = false;
                    break;
                case 38:
                case 87:
                    controls.up = false;
                    break;
                case 39:
                case 68:
                    controls.right = false;
                    break;
                case 40:
                case 83:
                    controls.down = false;
                    break;
                default:
                    prevent = false;
            }

            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }

            user.setDirection(controls);
        });

        jQuery(window).resize(function() {
            basicScene.setAspect();
        });
    },

    setAspect: function() {
        'use strict';

        var w = this.container.width(),
                h = jQuery(window).height();

        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    },
    setFocus: function(object) {
        'use strict';
        this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
        this.camera.lookAt(object.position);
    },
    frame: function() {
        'use strict';

        this.user.motion();

        this.renderer.render(this.scene, this.camera);
    }
});
