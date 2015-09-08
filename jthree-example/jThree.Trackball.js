/*!
 * jThree.Trackball.js JavaScript Library v1.5
 * http://www.jthree.com/
 *
 * Requires jThree v2.0.0
 * Includes TrackballControls.js | Copyright (c) 2010-2013 three.js authors
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2015-02-25
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this,
		STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = 
	this.noZoom = 
	this.noPan = 
	this.noRoll = false;

	this.damping = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// internals

	this.target = object._lookAt;

	this.lastPosition = new THREE.Vector3;
	this._eye = new THREE.Vector3;

	var _state = STATE.NONE,
		_prevState = STATE.NONE,

		_rotateStart = new THREE.Vector3,
		_rotateEnd = new THREE.Vector3,

		_zoomStart = new THREE.Vector2,
		_zoomEnd = new THREE.Vector2,

		_touchZoomDistanceStart = 0,
		_touchZoomDistanceEnd = 0,

		_panStart = new THREE.Vector2,
		_panEnd = new THREE.Vector2;

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// add by jThree
	this._fixed = false;

	// for #getMouseProjectionOnBall

	this.objectUp = new THREE.Vector3;

	// methods

	this.rotateCamera = (function(){

		var axis = new THREE.Vector3,
			quaternion = new THREE.Quaternion;


		return function () {

			var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

			if ( angle ) {

				axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

				angle *= _this.rotateSpeed;

				quaternion.setFromAxisAngle( axis, -angle );

				this._eye.applyQuaternion( quaternion );
				!_this._fixed && _this.object.up.applyQuaternion( quaternion );

				_rotateEnd.applyQuaternion( quaternion );

				quaternion.setFromAxisAngle( axis, angle * ( _this.damping - 1.0 ) );
				_rotateStart.applyQuaternion( quaternion );

			}
		};

	}());

	this.zoomCamera = function () {

		if ( _state === STATE.TOUCH_ZOOM ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			this._eye.multiplyScalar( factor );

		} else {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				this._eye.multiplyScalar( factor );

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.damping;

			}

		}

	};

	this.panCamera = (function(){

		var mouseChange = new THREE.Vector2,
			objectUp = new THREE.Vector3,
			pan = new THREE.Vector3;

		return function () {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( this._eye.length() * _this.panSpeed );

				pan.copy( this._eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.damping ) );

			}
		};

	}());

	this.reset = function () {

		_state = _prevState = STATE.NONE;

		this.object.position.copy( this.position0 );
		this.object.up.copy( this.up0 );
		this.object.lookAt( this.target0 );

		this._eye.subVectors( this.object.position, this.target );

		this.lastPosition.copy( this.object.position );

		return this;

	};

	// listeners

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateStart = _this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateStart );
			_rotateEnd.copy(_rotateStart);

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomStart = _this.getMouseOnScreen( event.pageX, event.pageY, _zoomStart );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panStart = _this.getMouseOnScreen( event.pageX, event.pageY, _panStart);
			_panEnd.copy(_panStart);

		}

		document.addEventListener( "mousemove", mousemove, false );
		document.addEventListener( "mouseup", mouseup, false );

	}

	function mousemove( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateEnd );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.pageX, event.pageY, _zoomEnd );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.pageX, event.pageY, _panEnd );

		}

	}

	function mouseup( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( "mousemove", mousemove );
		document.removeEventListener( "mouseup", mouseup );

	}

	function mousewheel( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_rotateEnd.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateStart ));
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
				break;

			case 3:
				_state = STATE.TOUCH_PAN;
				_panEnd.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panStart ));
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd );
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )
				break;

			case 3:
				_panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_rotateStart.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd ));
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
				break;

			case 3:
				_panStart.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd ));
				break;

		}

		_state = STATE.NONE;

	}


	this.domElement.addEventListener( "contextmenu", function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( "mousedown", mousedown, false );

	this.domElement.addEventListener( "mousewheel", mousewheel, false );
	this.domElement.addEventListener( "DOMMouseScroll", mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	this.resize();

};

THREE.TrackballControls.prototype = {

	constructor: THREE.TrackballControls,

	stop: function() {
		this.enabled = false;
		return this;
	},

	start: function() {
		this.enabled = true;
		return this;
	},

	setup: function( param ) {
		jThree.extend( this, param );
		return this;
	},

	fixUp: function( bool ) {
		this._fixed = bool === undefined ? !this._fixed : bool;
	},

	resize: function () {

		if ( this.domElement === document ) {

			this.screen.left = 
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			jThree.extend( this.screen, this.domElement.getBoundingClientRect() );
			//getBoundingClientRect() is readOnly
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left += window.pageXOffset - d.clientLeft;
			this.screen.top += window.pageYOffset - d.clientTop;

		}

	},

	getMouseOnScreen: function ( pageX, pageY, optionalTarget ) {

		return ( optionalTarget || new THREE.Vector2 ).set(
			( pageX - this.screen.left ) / this.screen.width,
			( pageY - this.screen.top ) / this.screen.height
		);

	},

	getMouseProjectionOnBall: function ( pageX, pageY, projection ) {

		var mouseOnBall = new THREE.Vector3(
			( pageX - this.screen.width * 0.5 - this.screen.left ) / (this.screen.width*.5),
			( this.screen.height * 0.5 + this.screen.top - pageY ) / (this.screen.height*.5),
			0.0
		),
		length = mouseOnBall.length();

		if ( this.noRoll ) {

			if ( length < Math.SQRT1_2 ) {

				mouseOnBall.z = Math.sqrt( 1.0 - length*length );

			} else {

				mouseOnBall.z = .5 / length;

			}

		} else if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		this._eye.copy( this.object.position ).sub( this.target );

		projection.copy( this.object.up ).setLength( mouseOnBall.y );
		projection.add( this.objectUp.copy( this.object.up ).cross( this._eye ).setLength( mouseOnBall.x ) );
		projection.add( this._eye.setLength( mouseOnBall.z ) );

		return projection;

	},

	checkDistances: function () {

		if ( !this.noZoom || !this.noPan ) {

			if ( this._eye.lengthSq() > this.maxDistance * this.maxDistance ) {

				this.object.position.addVectors( this.target, this._eye.setLength( this.maxDistance ) );

			}

			if ( this._eye.lengthSq() < this.minDistance * this.minDistance ) {

				this.object.position.addVectors( this.target, this._eye.setLength( this.minDistance ) );

			}

		}

	},

	update: function () {

		if ( ! this.enabled ) return;

		this._eye.subVectors( this.object.position, this.target );

		if ( !this.noRotate ) {

			this.rotateCamera();

		}

		if ( !this.noZoom ) {

			this.zoomCamera();

		}

		if ( !this.noPan ) {

			this.panCamera();

		}

		this.object.position.addVectors( this.target, this._eye );

		this.checkDistances();

		this.object.lookAt( this.target );

		if ( this.lastPosition.distanceToSquared( this.object.position ) > 0 ) {

			this.lastPosition.copy( this.object.position );

		}

	}

};

jThree.Trackball = function( selector ) {

	var balls = [];

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		var ball = new THREE.TrackballControls( jThree.three( jThree.getCamera( this ) ), jThree.getCanvas( this ) );

		jThree.update( this, function() {
			ball.callback && ball.callback();
			ball.update();
		} );

		jThree( this ).resize( function() {
			ball.resize();
		} ).on( "attrChange", function( e ) {

			if ( e.attrName !== "camera" ) return;
			ball.object = jThree.three( jThree.getCamera( this ) );
			ball.target = ball.object._lookAt;

		} );

		balls.push( ball );

	} );

	return balls.length > 1 ? balls : balls[ 0 ];

};