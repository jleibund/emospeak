define([
    'jquery',
    'underscore',
    'backbone',
    'three',
    'stats'
], function($, _, Backbone, THREE, Stats){


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
        tagName:'div',
        className:'cube',
        loaded:false,
        render: function(){

//            $('.menu li').removeClass('active');
//            $('.menu li a[href="#"]').parent().addClass('active');
//            this.$el.html(cubeTemplate);
//
//            var sidebarView = new SidebarView();
//            sidebarView.render();

            requestAnimationFrame( this.render.bind(this) );

            if (!this.loaded){
                this.onWindowResize();
                this.loaded = this.$el.width() + this.$el.height();
            }

            this.plane.rotation.y = this.cube.rotation.y += ( this.targetRotation - this.cube.rotation.y ) * 0.05;
            this.renderer.render( this.scene, this.camera );
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
            this.camera.position.y = 150;
            this.camera.position.z = 500;

            this.scene = new THREE.Scene();

            // Cube

            var geometry = new THREE.CubeGeometry( 200, 200, 200 );

            for ( var i = 0; i < geometry.faces.length; i ++ ) {
                geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
            }

            var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

            this.cube = new THREE.Mesh( geometry, material );
            this.cube.position.y = 150;
            this.scene.add( this.cube );

            // Plane

            geometry = new THREE.PlaneGeometry( 200, 200 );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } );

            this.plane = new THREE.Mesh( geometry, material );
            this.scene.add( this.plane );

            this.renderer = new THREE.CanvasRenderer();

//            var window = this.$el;
            this.windowHalfX = document.width() / 2;
            this.windowHalfY = document.height() / 2;

//            this.renderer.setSize( document.width(), document.height() );

//            console.log('domEl', renderer.domElement);

//            document.append( renderer.domElement);
//            document.append( $(renderer.domElement) );

            document.append( this.renderer.domElement);

//            var stats = this.stats = new Stats();
//            stats.domElement.style.position = 'absolute';
//            stats.domElement.style.top = '0px';
//            container.append( stats.domElement );

            window.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
            window.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );
            window.addEventListener( 'touchmove', this.onDocumentTouchMove.bind(this), false );
            window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

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

            console.log('mouseMove',this.mouseX,' ', this.targetRotation);

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

        //

//        animate: function() {
//
//            requestAnimationFrame( this.animate.bind(this) );
//            this.render();
////            this.stats.update();
//
//        }

    });

    return CubeView;

});