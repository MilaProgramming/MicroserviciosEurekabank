import React, { useEffect } from 'react';

const AboutUs = () => {
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAJyrVrw49V0AlQROSkOW72OfakTCLyKoI&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        };

        window.initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -0.16956920264371367, lng: -78.47021286544712 },
                zoom: 15,
            });

            const marker = new window.google.maps.Marker({
                position: { lat: -0.16956920264371367, lng: -78.47021286544712 }, // Cambia estas coordenadas a la ubicación deseada
                map: map,
                title: 'Ubicación específica',
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