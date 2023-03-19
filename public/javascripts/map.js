mapboxgl.accessToken = mapToken;
const clusterMap = new mapboxgl.Map({
    container: 'clusterMap', // container ID
    style: 'mapbox://styles/mapbox/light-v8', // style URL
    center: coordinates,
    zoom: 8 // starting zoom
});
clusterMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 10 })
            .setHTML("<h3>Hello World!</h3>")
    )
    .addTo(clusterMap);
    