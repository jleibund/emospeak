define([
    'jquery',
    'underscore',
    'backbone',
    'three',
    'stats'
], function($, _, Backbone, THREE, Stats){

    function up(e) {return e.keyCode === 38}
    function down(e) {return e.keyCode === 40}
    function left(e) {return e.keyCode ===37}
    function right(e) {return e.keyCode ===39}
    function push(e) {return e.metaKey}
    function pull(e) {return e.altKey}
    function q(e) {return e.keyCode ===81}
    function w(e) {return e.keyCode ===87}
    function a(e) {return e.keyCode ===65}
    function s(e) {return e.keyCode ===83}
    function z(e) {return e.keyCode ===90}
    function x(e) {return e.keyCode ===88}
    function de2ra(degree)   { return degree*(Math.PI/180); }

    var SIZE=150, UPDOWN_AMT=205, LEFTRIGHT_AMT= 300, PUSHPULL_AMT = 300,
        CAMERA_Z = 600, NEUTRAL_X= 0, NEUTRAL_Y = 325, NEUTRAL_Z=0;

    var CubeView = Backbone.View.extend({
        tagName:'div',
        className:'cube',
        loaded:false,
        SIZE:SIZE,
        CAMERA_Y:NEUTRAL_Y,
        CAMERA_Z:CAMERA_Z,
        NEUTRAL_X:NEUTRAL_X,
        NEUTRAL_Y:NEUTRAL_Y,
        NEUTRAL_Z:NEUTRAL_Z,
        UP_Y:NEUTRAL_Y+UPDOWN_AMT,
        DOWN_Y:NEUTRAL_Y-UPDOWN_AMT,
        LEFT_X:NEUTRAL_X-LEFTRIGHT_AMT,
        RIGHT_X:NEUTRAL_X+LEFTRIGHT_AMT,
        PUSH_Z:CAMERA_Z+PUSHPULL_AMT,
        PULL_Z:CAMERA_Z-PUSHPULL_AMT,
        render: function(){
            requestAnimationFrame( this.render.bind(this) );

            if (!this.loaded){
                this.onWindowResize();
                this.loaded = this.$el.width() + this.$el.height();
            }

//            this.plane.rotation.y = this.cube.rotation.y += ( this.targetRotation - this.cube.rotation.y ) * 0.05;
            this.renderer.render( this.scene, this.camera );

            this.stats.update();
            return this;
        },
        init: function() {

            var document = this.$el;

            this.targetRotation = 0;
            this.targetRotationOnMouseDown = 0;
            this.mouseX = 0;
            this.mouseXOnMouseDown = 0;

//            var container = $( 'div' );
//            document.append( container );

//            var info = $( 'div' );
//            info.style.position = 'absolute';
//            info.style.top = '10px';
//            info.style.width = '100%';
//            info.style.textAlign = 'center';
//            info.innerHTML = 'Drag to spin the cube';
//            container.append( info );

            this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 1, 1000 );
            this.camera.position.y = this.CAMERA_Y;
            this.camera.position.z = this.CAMERA_Z;

            this.scene = new THREE.Scene();

            // Cube

            var geometry = new THREE.CubeGeometry( this.SIZE, this.SIZE, this.SIZE );

            for ( var i = 0; i < geometry.faces.length; i ++ ) {
                geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
            }

            var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

            this.cube = new THREE.Mesh( geometry, material );
            this.cube.position.y = this.NEUTRAL_Y;
            this.cube.position.x = this.NEUTRAL_X;
            this.scene.add( this.cube );

            // Plane

            geometry = new THREE.PlaneGeometry( this.SIZE, this.SIZE );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } );

            this.plane = new THREE.Mesh( geometry, material );
            this.scene.add( this.plane );

            this.renderer = new THREE.CanvasRenderer();

            this.windowHalfX = document.width() / 2;
            this.windowHalfY = document.height() / 2;

            document.append( this.renderer.domElement);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            document.append( this.stats.domElement );

            window.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
            window.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );
            window.addEventListener( 'touchmove', this.onDocumentTouchMove.bind(this), false );
            window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

            var self = this;

            window.addEventListener('keydown', function(e){
                console.log('pressed: ', e.keyCode);
                if (up(e)) {
                    self.move('y',self.UP_Y);
                } else if (down(e)){
                    self.move('y',self.DOWN_Y);
                } else if (left(e)){
                    self.move('x',self.LEFT_X);
                } else if (right(e)){
                    self.move('x',self.RIGHT_X);
                } else if (push(e)){
                    self.move('z',self.PUSH_Z);
                } else if (pull(e)){
                    self.move('z',self.PULL_Z);
                } else if (q(e)){
                    self.rotate('x',25);
                } else if (w(e)){
                    self.rotate('x',-25);
                } else if (a(e)){
                    self.rotate('y',25);
                } else if (s(e)){
                    self.rotate('y',-25);
                } else if (z(e)){
                    self.rotate('z',25);
                } else if (x(e)){
                    self.rotate('z',-25);
                }
            });
            window.addEventListener('keyup', function(e){
                self.center();
            });

            this.center();
        },
        move:function(dim, amt){
            if ('x'==dim){
                this.cube.position.x = amt;
                this.plane.position.x = amt;
            } else if ('y'==dim){
                this.cube.position.y = amt;
            } else if ('z'==dim){
                this.camera.position.z = amt;
            }
        },
        rotate:function(dim, deg){
            this.cube.rotation[dim] += de2ra(deg);
            if ('y' == dim) this.plane.rotation[dim] = this.cube.rotation[dim]
        },
        center:function(){
            var cubePos = this.cube.position, planePos = this.plane.position, cubeRot = this.cube.rotation,
                planeRot = this.plane.rotation;
            cubePos.x = this.NEUTRAL_X;
            cubePos.y = this.NEUTRAL_Y;
            this.camera.position.z = this.CAMERA_Z;
            planePos.x = this.NEUTRAL_X;
            planePos.y = this.NEUTRAL_Z;

            planeRot.x = planeRot.y = planeRot.z = 0;
            cubeRot.x = cubeRot.y = cubeRot.z = 0;

        },
        onWindowResize: function() {

            var document = this.$el;
            var width = document.width(), height = document.height();


            this.windowHalfX = width / 2;
            this.windowHalfY = height / 2;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            console.log('resize',width,' ', height);

            this.renderer.setSize( width, height );
        },
        onDocumentMouseDown: function( event ) {

            event.preventDefault();

            window.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
            window.addEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
            window.addEventListener( 'mouseout', this.onDocumentMouseOut.bind(this), false );

            this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
            this.targetRotationOnMouseDown = this.targetRotation;

            console.log('mouseDown',this.mouseXOnMouseDown, ' ', this.targetRotationOnMouseDown);

        },
        onDocumentMouseMove: function( event ) {

            this.mouseX = event.clientX - this.windowHalfX;
            this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.02;
        },

        onDocumentMouseUp: function( event ) {

            window.removeEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
            window.removeEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
            window.removeEventListener( 'mouseout', this.onDocumentMouseOut.bind(this), false );

        },

        onDocumentMouseOut: function( event ) {

            window.removeEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
            window.removeEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
            window.removeEventListener( 'mouseout', this.onDocumentMouseOut.bind(this), false );

            console.log('mouseOut',event.clientX);

        },

        onDocumentTouchStart: function( event ) {
            if ( event.touches.length === 1 ) {

                event.preventDefault();

                this.mouseXOnMouseDown = event.touches[ 0 ].pageX - this.windowHalfX;
                this.targetRotationOnMouseDown = this.targetRotation;

                console.log('touchStart',event.clientX);

            }
        },

        onDocumentTouchMove: function( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
                this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.05;

                console.log('touchMove',event.clientX);

            }

        }

    });

    return CubeView;

});