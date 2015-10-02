(function(){

	'use strict';

	var getLocation = function( addressObj, fallback, callback ){

		// # Get location coords
		try{
			var lat = addressObj.geometry.location.A;
			var lng = addressObj.geometry.location.F;
			return new google.maps.LatLng( lat, lng );
		}
		catch(e){
			return new google.maps.LatLng( fallback.lat, fallback.lng );
		}
	};

angular.module('ngPlacesMap', [])
	.filter('gps', function() {
		return function(input, field) {
			var json;
			try{
				json = JSON.parse(input);
			}
			catch(e){
				json = false;
			}
			return json && json[field] ? json[field] : '';
		}
	})
	.directive( 'placesMap', function(){
		return {
			restrict:'E',
			replace: true,
			scope:{
				picked: '=?',
				address: '=?',
				fallback: '=?',
				mapType: '@?',
				readonly: '@?',
				responsive: '@?',
				draggable: '@?',
				selected: '=',
				schoolsArr: '=',
				selectedSchool: '='
			},
			controller: ['$scope', function ($scope) {}],
			template: '<div class="dp-places-map-wrapper"><input type="text" class="dp-places-map-input"><div class="dp-places-map-canvas"></div></div>',
			
		link: function( $scope, element, attrs, controller ){
			
			var mapOptions = {
				zoom : 15,
			};

			var providedAddress = {};
			if( $scope.address ){
				providedAddress = $scope.address;
				mapOptions.zoom = $scope.address.zoom || 15;
			}

			var fallbackAddress = {};
			// # If fallback is not provided use this coords
			fallbackAddress.lat = 41.87194;
			fallbackAddress.lng = 12.567379999999957;

			if( $scope.fallback ){
				fallbackAddress = $scope.fallback;
				mapOptions.zoom = $scope.fallback.zoom || 15;
			}

			// var school = '';

			if( $scope.draggable && $scope.draggable == 'false'){
				mapOptions.draggable = false;
				mapOptions.scrollwheel = false;
			}

			// # Set map type if provided
			if( $scope.mapType && google.maps.MapTypeId[$scope.mapType] ){
				mapOptions.mapTypeId = google.maps.MapTypeId[$scope.mapType];
			}

			// # Get place from coords and Set map center
			mapOptions.center = getLocation( providedAddress, fallbackAddress );

			mapOptions.styles = [
		    {
		        "featureType": "road",
		        "stylers": [
		            {
		                "hue": "#5e00ff"
		            },
		            {
		                "saturation": -79
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "stylers": [
		            {
		                "saturation": -78
		            },
		            {
		                "hue": "#6600ff"
		            },
		            {
		                "lightness": -47
		            },
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "stylers": [
		            {
		                "lightness": 22
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "stylers": [
		            {
		                "hue": "#6600ff"
		            },
		            {
		                "saturation": -11
		            }
		        ]
		    },
		    {},
		    {},
		    {
		        "featureType": "water",
		        "stylers": [
		            {
		                "color": "#6bb1e1"
		            },
		            {
		                "lightness": 50
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "stylers": [
		            {
		                "weight": 1.3
		            },
		            {
		                "lightness": 30
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            },
		            {
		                "hue": "#5e00ff"
		            },
		            {
		                "saturation": -16
		            }
		        ]
		    },
		    {
		        "featureType": "transit.line",
		        "stylers": [
		            {
		                "saturation": -72
		            }
		        ]
		    },
		    {}
			]			
			var canvas = element.find('div')[0];
			var input = element.find('input')[0];

			if( $scope.responsive && $scope.responsive == 'true' ){
				canvas.className += ' responsive';
			}

			// # Create map
			var map = new google.maps.Map( canvas, mapOptions );

			// # Prepare Marker
			var marker = new google.maps.Marker({
					map: map,
					anchorPoint: new google.maps.Point(0, -29)
			});
			// # Prepare InfoWindow
			var infowindow = new google.maps.InfoWindow();

			// # Place input field
			if( !$scope.readonly ){
				map.controls[ google.maps.ControlPosition.TOP_LEFT ].push( input );
			}else{
				input.style.display = 'none';
			}

			// # Add autocomplete
			var autocomplete = new google.maps.places.Autocomplete( input ,{
				componentRestrictions: {'country' : 'us'}
			});
				autocomplete.bindTo('bounds', map);

			var placeMarker = function( place ){
				// # Get geometry
				if( !place.geometry ){
					alert('Pick a valid location');
					return;
				}
				
				// # If the place has a geometry, then present it on a map.
				if( place.geometry.viewport ){
					map.fitBounds( place.geometry.viewport );
					map.setCenter( place.geometry.location  );
					map.setZoom(15);
				}
				else{
					map.setCenter( place.geometry.location  );
					map.setZoom(15); 
				}
				
				// # Update marker
				marker.setIcon({
					url: place.icon,
					size: new google.maps.Size( 71, 71 ),
					origin: new google.maps.Point( 0, 0 ),
					anchor: new google.maps.Point( 17, 34 ),
					scaledSize: new google.maps.Size( 35, 35 )
				});
				
				// # Place marker
				marker.setPosition( place.geometry.location );
				
				// # Show marker
				marker.setVisible( true );

				var address = '';
				if( place.address_components ) {
					address = [
						(place.address_components[0] && place.address_components[0].short_name || ''),
						(place.address_components[1] && place.address_components[1].short_name || ''),
						(place.address_components[2] && place.address_components[2].short_name || '')
					].join(' ');
				}

				if( address !== '' ){
				    google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent('<strong>' + place.name + '</strong>');
					infowindow.open( map, marker );
					})
				}

				var service = new google.maps.places.PlacesService( map );

				var infowindow2 = new google.maps.InfoWindow();

				service.nearbySearch({
					location: place.geometry.location,
					radius: '1609.3', 
					types: ['school']
				},
				function( schoolsArr, status ){
					if( status === google.maps.places.PlacesServiceStatus.OK ){
						$scope.selected = schoolsArr;
						console.log("HEY", $scope.selected);
						$scope.$apply();
						for (var i = 0; i < schoolsArr.length; i++){
							var schoolMarker = new google.maps.Marker({
								map: map,
								position: schoolsArr[i].geometry.location,
								icon: {
		      						path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
		      						fillColor: '#68228B',
		      						fillOpacity: 1,
		      						scale: 2/5,
		      						strokeColor: '#bd8d2c',
		      						strokeWeight: 1
		    					}
							});
		    					// console.log("What up", schoolMarker);
							// $scope.selectedSchool = function(thisPlace){
							// 	google.maps.event.addListener(schoolMarker, (function(schoolMarker, i){
							// 		return function (){
							// 			var request = {
							// 			placeId : thisPlace
							// 			}
							// 			service.getDetails(request, function(place, status){
							// 				if( status === google.maps.places.PlacesServiceStatus.OK ){
							// 					if (place.website === undefined){
							// 						place.website = "https://www.google.com";
							// 					}					
							// 	        			infowindow2.setContent('<style scoped> a{color: #e28600;} </style><strong><a href=' +  '"' + place.website + '"' + 'target="_blank"' + '>' + place.name + '</strong></a><br></style>'+ place.vicinity + '<br>' + place.formatted_phone_number);
							// 	        			infowindow2.open( map, schoolMarker );
							// 	        			$scope.$apply();
							// 	        	}
							// 			});
							// 		}
							// 	})(schoolMarker, i));
							// }				
							google.maps.event.addListener(schoolMarker, 'mouseover', (function(schoolMarker, i){
								return function (){
									var request = {
										placeId : schoolsArr[i].place_id
									}
									service.getDetails(request, function(place, status){
										if( status === google.maps.places.PlacesServiceStatus.OK ){
											if (place.website === undefined){
												place.website = "https://www.google.com";
											}					
							        			infowindow2.setContent('<style scoped> a{color: #e28600;} </style><strong><a href=' +  '"' + place.website + '"' + 'target="_blank"' + '>' + place.name + '</strong></a><br></style>'+ place.vicinity + '<br>' + place.formatted_phone_number);
							        			infowindow2.open( map, schoolMarker );
							        			$scope.$apply();
										}
									})
								}								
							})
							(schoolMarker, i));	
						}				
					}

				});

				// # Apply
				$scope.$apply();
			};

			var locationChange = function(){
				$scope.selected=[];
				// # Reset window
				infowindow.close();
				marker.setVisible( false );
			

				// # Get place from autocomplete
				var place = autocomplete.getPlace();
				console.log(place);
				placeMarker( place );
			};

			// # Create marker for saved position

			// # Init place service
			var service = new google.maps.places.PlacesService( map );

			google.maps.event.addListener( autocomplete, 'place_changed', locationChange );
		
			// # Responsive utils listener
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center); 
			})
		}
		}
	})
}());