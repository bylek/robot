var World = Class.extend({
    init: function(args) {
        'use strict';
        var ground = new THREE.PlaneGeometry(2000, 2000);
        var height = 128;
        var walls = [
            new THREE.PlaneGeometry(ground.height, height),
            new THREE.PlaneGeometry(ground.width, height),
            new THREE.PlaneGeometry(ground.height, height),
            new THREE.PlaneGeometry(ground.width, height)
        ];

        var obstacles = this.generateObstacles();
        var material = new THREE.MeshLambertMaterial(args);
        var i;

        this.mesh = new THREE.Object3D();
        // Set and add the ground
        this.ground = new THREE.Mesh(ground, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.mesh.add(this.ground);
        // Set and add the walls
        this.walls = [];
        for (i = 0; i < walls.length; i += 1) {
            this.walls.push(new THREE.Mesh(walls[i], material));
            this.walls[i].position.y = height / 2;
            this.mesh.add(this.walls[i]);
        }
        this.walls[0].rotation.y = -Math.PI / 2;
        this.walls[0].position.x = ground.width / 2;
        this.walls[1].rotation.y = Math.PI;
        this.walls[1].position.z = ground.height / 2;
        this.walls[2].rotation.y = Math.PI / 2;
        this.walls[2].position.x = -ground.width / 2;
        this.walls[3].position.z = -ground.height / 2;

        // Set and add the obstacles
        this.obstacles = [];
        for (i = 0; i < obstacles.length; i += 1) {
            var obstacle = new THREE.Mesh(obstacles[i].el, material);
            obstacle.position.set.apply(obstacle.position, obstacles[i].position);
            this.obstacles.push(obstacle);
            this.mesh.add(obstacle);
        }
    },
    getObstacles: function() {
        return this.obstacles.concat(this.walls);
    },
    getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateObstacles: function(){
        var obstacles = [];
        for (var i = 0; i < 100; i++) {
            var len = this.getRandomInt(50, 400);
            var thick = 32;
            obstacles.push({
                el: new THREE.CubeGeometry(i % 2 == 0 ? len : thick, 128, i % 2 == 0 ? thick : len),
                position: [this.getRandomInt(-1000, 1000), 64, this.getRandomInt(-1000, 1000)]
            });
        }

        return obstacles;
    }

});