define([
    'jquery',
    'underscore',
    'backbone',
    'three',
    'text!templates/cubeTemplate.html'
], function($, _, Backbone, Three, cubeTemplate){


    //    var container, stats;
//
//    var camera, scene, renderer;
//
//    var cube, plane;
//
//    var targetRotation = 0;
//    var targetRotationOnMouseDown = 0;
//
//    var mouseX = 0;
//    var mouseXOnMouseDown = 0;
//
//    var windowHalfX = window.innerWidth / 2;
//    var windowHalfY = window.innerHeight / 2;
//
//    init();
//    animate();


    var CubeView = Backbone.View.extend({
        el: $("#cube"),

        render: function(){

//            $('.menu li').removeClass('active');
//            $('.menu li a[href="#"]').parent().addClass('active');
//            this.$el.html(cubeTemplate);
//
//            var sidebarView = new SidebarView();
//            sidebarView.render();

            this.plane.rotation.y = this.cube.rotation.y += ( this.targetRotation - this.cube.rotation.y ) * 0.05;
            this.renderer.render( this.scene, this.camera );
        },
        init: function() {

            var document = this.el;

            var container = document.createElement( 'div' );
            document.body.appendChild( container );

            var info = document.createElement( 'div' );
            info.style.position = 'absolute';
            info.style.top = '10px';
            info.style.width = '100%';
            info.style.textAlign = 'center';
            info.innerHTML = 'Drag to spin the cube';
            container.appendChild( info );


            var camera = this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
            camera.position.y = 150;
            camera.position.z = 500;

            var scene = this.scene = new THREE.Scene();

            // Cube

            var geometry = new THREE.CubeGeometry( 200, 200, 200 );

            for ( var i = 0; i < geometry.faces.length; i ++ ) {

                geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );

            }

            var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

            var cube = this.cube = new THREE.Mesh( geometry, material );
            cube.position.y = 150;
            scene.add( cube );

            // Plane

            var geometry = new THREE.PlaneGeometry( 200, 200 );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } );

            var plane = this.plane = new THREE.Mesh( geometry, material );
            scene.add( plane );

            var renderer = this.renderer = new THREE.CanvasRenderer();

            var window = this.el;
            var windowHalfX = this.windowHalfX = window.innerWidth / 2;
            var windowHalfY = this.windowHalfY = window.innerHeight / 2;

            console.log('cube port size x=',windowHalfX, ' y=',windowHalfY);

            renderer.setSize( window.innerWidth, window.innerHeight );

            container.appendChild( renderer.domElement );

            var stats = this.stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            container.appendChild( stats.domElement );

            document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
            document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
            document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );

            //

            window.addEventListener( 'resize', this.onWindowResize, false );

        },
        onWindowResize: function() {

            var window = this.el;
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( window.innerWidth, window.innerHeight );
        },
        onDocumentMouseDown: function( event ) {

            event.preventDefault();

            var document = this.el;

            document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
            document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
            document.addEventListener( 'mouseout', this.onDocumentMouseOut, false );

            this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
            this.targetRotationOnMouseDown = this.targetRotation;

        },
        onDocumentMouseMove: function( event ) {

            this.mouseX = event.clientX - this.windowHalfX;

            this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.02;

        },

        onDocumentMouseUp: function( event ) {

            var document = this.el;

            document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
            document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
            document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );

        },

        onDocumentMouseOut: function( event ) {

            var document = this.el;

            document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
            document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
            document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );

        },

        onDocumentTouchStart: function( event ) {
            if ( event.touches.length === 1 ) {

                event.preventDefault();

                this.mouseXOnMouseDown = event.touches[ 0 ].pageX - this.windowHalfX;
                this.targetRotationOnMouseDown = this.targetRotation;

            }
        },

        onDocumentTouchMove: function( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
                this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.05;

            }

        },

        //

        animate: function() {


            requestAnimationFrame( animate );

            this.render();
            this.stats.update();

        }

    });

    return CubeView;

});