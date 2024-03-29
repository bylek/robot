var Character = Class.extend({
    init: function(args) {
        'use strict';

        this.WALK_SPEED = 4;
        this.ROTATION_SPEED = 0.03;

        var head = new THREE.SphereGeometry(32, 16, 16),
                hand = new THREE.SphereGeometry(8, 8, 8),
                foot = new THREE.SphereGeometry(16, 4, 8, 0, Math.PI * 2, 0, Math.PI / 2),
                nose = new THREE.SphereGeometry(4, 8, 8),
                material = new THREE.MeshLambertMaterial(args);

        this.mesh = new THREE.Object3D();
        this.mesh.position.y = 48;

        this.head = new THREE.Mesh(head, material);
        this.head.position.y = 0;
        this.mesh.add(this.head);

        this.hands = {
            left: new THREE.Mesh(hand, material),
            right: new THREE.Mesh(hand, material)
        };

        this.hands.left.position.x = -40;
        this.hands.left.position.y = -8;
        this.hands.right.position.x = 40;
        this.hands.right.position.y = -8;
        this.mesh.add(this.hands.left);
        this.mesh.add(this.hands.right);

        this.feet = {
            left: new THREE.Mesh(foot, material),
            right: new THREE.Mesh(foot, material)
        };

        this.feet.left.position.x = -20;
        this.feet.left.position.y = -48;
        this.feet.left.rotation.y = Math.PI / 4;
        this.feet.right.position.x = 20;
        this.feet.right.position.y = -48;
        this.feet.right.rotation.y = Math.PI / 4;
        this.mesh.add(this.feet.left);
        this.mesh.add(this.feet.right);

        this.nose = new THREE.Mesh(nose, material);
        this.nose.position.y = 0;
        this.nose.position.z = 32;
        this.mesh.add(this.nose);

        // dummy user for collision detection
        // is always at the users location and
        // the dummy performs all movement before the user
        // to check that a collision isn't eminent. if it is
        // the user isn't allowed to take the next step
        this.dummyMesh = new THREE.Object3D();

        this.direction = new THREE.Vector3(0, 0, 0);

        this.step = 0;

        this.caster = new THREE.Raycaster();
    },
    setDirection: function(controls) {
        'use strict';

        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
                y = 0,
                z = controls.up ? 1 : controls.down ? -1 : 0;

        this.direction.set(x, y, z);
    },
    motion: function() {
        'use strict';

        var freeToMove = this.collision();

        if (this.controls.up || this.controls.down || this.controls.left || this.controls.right) {

            this.rotate();

            if (freeToMove) {
                this.move();
            }
        }
    },
    collision: function() {
        'use strict';

        this.dummyMesh.position.x = this.mesh.position.x;
        this.dummyMesh.position.y = this.mesh.position.y;
        this.dummyMesh.position.z = this.mesh.position.z;

        this.dummyMesh.rotation.x = this.mesh.rotation.x;
        this.dummyMesh.rotation.y = this.mesh.rotation.y;
        this.dummyMesh.rotation.z = this.mesh.rotation.z;

        if (this.controls.up) {
            this.dummyMesh.translateZ(this.WALK_SPEED);
        } else if (this.controls.down) {
            this.dummyMesh.translateZ(-this.WALK_SPEED);
        }

        // Maximum distance from the origin before we consider collision
        var distance = 64;

        // Get the obstacles array from our world
        var obstacles = basicScene.world.getObstacles();

        // We only need to check the direction we're moving
        this.caster.set(this.dummyMesh.position, new THREE.Vector3(this.dummyMesh.position.x, this.dummyMesh.position.y, this.dummyMesh.position.z));

        // Test if we intersect with any obstacle mesh
        var collisions = this.caster.intersectObjects(obstacles);

        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance) {
            return false;
        } else {
            return true;
        }
    },
    rotate: function() {
        'use strict';

        if (this.controls.left) {
            this.mesh.rotation.y += this.ROTATION_SPEED;
        } else if (this.controls.right) {
            this.mesh.rotation.y -= this.ROTATION_SPEED;
        }
    },
    move: function() {
        'use strict';

        if (this.controls.up) {
            this.mesh.translateZ(this.WALK_SPEED);
        } else if (this.controls.down) {
            this.mesh.translateZ(-this.WALK_SPEED);
        }

        this.step += 0.25;

        this.feet.left.position.setZ(Math.sin(this.step) * 16);
        this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
        this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
        this.hands.right.position.setZ(Math.sin(this.step) * 8);
    }
});