import React, { useEffect, useState } from 'react';

const AboutUs = () => {
    const [map, setMap] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (!window.google || !window.google.maps) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAJyrVrw49V0AlQROSkOW72OfakTCLyKoI&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);

                script.onload = () => {
                    if (window.google) {
                        window.initMap();
                    }
                };
            } else {
                window.initMap();
            }
        };

        window.initMap = () => {
            const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -0.16956920264371367, lng: -78.47021286544712 },
                zoom: 15,
            });

            new window.google.maps.Marker({
                position: { lat: -0.16956920264371367, lng: -78.47021286544712 },
                map: mapInstance,
                title: 'Sucursal 1',
            });

            const directionsServiceInstance = new window.google.maps.DirectionsService();
            const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: '#FF0000', // Línea roja
                    strokeOpacity: 0.8,
                    strokeWeight: 6,
                },
            });

            directionsRendererInstance.setMap(mapInstance);

            setMap(mapInstance);
            setDirectionsService(directionsServiceInstance);
            setDirectionsRenderer(directionsRendererInstance);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("Ubicación actual:", position.coords.latitude, position.coords.longitude);
                        calculateRoute(
                            position.coords.latitude,
                            position.coords.longitude,
                            directionsServiceInstance,
                            directionsRendererInstance
                        );
                    },
                    (error) => {
                        console.error('Error obteniendo la ubicación actual:', error);
                    }
                );
            } else {
                console.error('Geolocalización no es soportada por este navegador.');
            }
        };

        const calculateRoute = (lat, lng, directionsServiceInstance, directionsRendererInstance) => {
            if (!directionsServiceInstance || !directionsRendererInstance) {
                console.error("DirectionsService o DirectionsRenderer no están inicializados.");
                return;
            }

            const request = {
                origin: new window.google.maps.LatLng(lat, lng),
                destination: new window.google.maps.LatLng(-0.16956920264371367, -78.47021286544712),
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsServiceInstance.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log("Ruta obtenida correctamente.");
                    directionsRendererInstance.setDirections(result);
                } else {
                    console.error('Error obteniendo la ruta:', status);
                }
            });
        };

        loadGoogleMapsScript();
    }, []);

    return (
        <div>
            <h3>Estamos ubicados en:</h3>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
        </div>
    );
};

export default AboutUs;
