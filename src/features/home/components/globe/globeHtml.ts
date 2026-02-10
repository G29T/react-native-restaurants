import { Country } from '../../../../shared/constants/continents-countries';

// Function to generate HTML string for WebView
export const generateGlobeHtml = (theme: 'light' | 'dark', backgroundColor: string, countries: Country[]) => `
<!DOCTYPE html>
    <html>
        <head>
            <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
            />
            <style>
                html, body, #globe-root {
                    margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
                    background: ${backgroundColor};
                }
            </style>
            <script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
            <script src="https://unpkg.com/globe.gl"></script>
        </head>
        <body>
            <div id="globe-root"></div> 
            <script>
                const theme = "${theme}"; 
                const countries = Object.freeze(${JSON.stringify(countries)});
                const texture = theme === 'light'
                    ? 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
                    : 'https://unpkg.com/three-globe/example/img/earth-night.jpg';

                const MIDDLE_EAST = new Set(['Bahrain','Qatar','UAE','Oman','Saudi']);
                const UK_IRELAND = new Set(['UK','Ireland']);
                const SE_ASIA = new Set(['Malaysia','Singapore']);
                
                const globe = Globe()(document.getElementById('globe-root'))
                    .globeImageUrl(texture) 
                    .backgroundColor('${backgroundColor}') 
                    .enablePointerInteraction(true)

                    .labelsData(countries)
                    .labelLat(d => d.lat)
                    .labelLng(d => d.lng) 
                    .labelText(d => d.label) 
                    .labelSize(2.5) 
                    .labelDotRadius(1) 
                    .labelAltitude(0.05) 
                    .labelColor(() => theme === 'light' ? '#f1bbfa' : '#FFD166')

                    .pointsData(countries)
                    .pointLat(d => d.lat)
                    .pointLng(d => d.lng)
                    .pointRadius(d => {            
                        if (MIDDLE_EAST.has(d.id)) return 2.2;
                        if (UK_IRELAND.has(d.id)) return 3;
                        if (SE_ASIA.has(d.id)) return 2.5;

                        return 3.5;
                    })
                    .pointAltitude(0.06)
                    .pointColor(() => 'rgba(0,0,0,0)') 
                    .onPointClick(d => {
                        const hasData = d.id === 'UK'; // Only UK has data for now
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: d.id, hasData }));
                    });

                function resizeGlobe() {
                    globe
                    .width(window.innerWidth)
                    .height(window.innerHeight);
                }

                resizeGlobe();

                window.addEventListener('resize', resizeGlobe);

                const controls = globe.controls();
                controls.enableZoom = true;
                controls.minDistance = 120;
                controls.maxDistance = 600; 
                controls.enablePan = false; 
                controls.autoRotate = true; 
                controls.autoRotateSpeed = 0.6;

                let lastDistance = globe.camera().position.length();
                controls.addEventListener('end', () => {
                    const distance = globe.camera().position.length();
                    if(Math.abs(distance - lastDistance) < 5) return; // skip tiny changes
                    lastDistance = distance;

                    const MIN_SIZE = 0.5;
                    const MAX_SIZE = 2.5;
                    const MIN_DOT_RADIUS = 0.5;
                    const MAX_DOT_RADIUS = 1.5;
                    const MIN_TOUCH_RADIUS = 0.5; 
                    const MAX_TOUCH_RADIUS = 3.0;

                    const distanceFactor = Math.max(0, Math.min(1, (distance - controls.minDistance) / (controls.maxDistance - controls.minDistance)));
                    const scaledSize = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * distanceFactor;
                    globe.labelSize(() => scaledSize);

                    const scaledDotRadius = MIN_DOT_RADIUS + (MAX_DOT_RADIUS - MIN_DOT_RADIUS) * distanceFactor;
                    globe.labelDotRadius(() => scaledDotRadius); 

                    const touchRadius = MAX_TOUCH_RADIUS - (MAX_TOUCH_RADIUS - MIN_TOUCH_RADIUS) * distanceFactor;
                    globe.pointRadius(() => touchRadius);

                    globe.labelColor(d => {
                        if(distance > 300) return theme === 'light' ? '#f1bbfa' : '#FFD166';
                        const cameraDir = new THREE.Vector3();
                        globe.camera().getWorldDirection(cameraDir);
                        const labelVec = new THREE.Vector3().setFromSphericalCoords(
                            1,
                            (90 - d.lat) * Math.PI / 180,
                            (d.lng + 180) * Math.PI / 180
                        );
                        const alpha = Math.max(0, cameraDir.dot(labelVec));

                        const dotColor = theme === 'light' ? '#f1bbfa' : '#FFD166';

                        return alpha > 0.5 ? (theme === 'light' ? '#f1bbfa' : '#FFD166') : dotColor;
                    });
                });
            </script>
        </body>
    </html>
`;