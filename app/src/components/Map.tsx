import React, { useEffect, useRef, useState } from 'react';

interface City {
    id: number;
    x: number;
    y: number;
    name: string;
}

interface Connection {
    from: number;
    to: number;
    cost: number;
}

export const CITIES: City[] = [
    // 0. Reykjavik (Iceland)
    { id: 0, x: 38, y: 124, name: "Reykjavik" },
    // 1. Lisbon (Portugal)
    { id: 1, x: 195, y: 526, name: "Lisbon" },
    // 2. Madrid (Spain)
    { id: 2, x: 262, y: 499, name: "Madrid" },
    // 3. Paris (France)
    { id: 3, x: 336, y: 366, name: "Paris" },
    // 4. Berlin (Germany)
    { id: 4, x: 473, y: 308, name: "Berlin" },
    // 5. Rome (Italy)
    { id: 5, x: 461, y: 476, name: "Rome" },
    // 6. London (United Kingdom)
    { id: 6, x: 306, y: 324, name: "London" },
    // 7. Dublin (Ireland)
    { id: 7, x: 230, y: 295, name: "Dublin" },
    // 8. Oslo (Norway)
    { id: 8, x: 440, y: 192, name: "Oslo" },
    // 9. Stockholm (Sweden)
    { id: 9, x: 530, y: 200, name: "Stockholm" },
    // 10. Helsinki (Finland)
    { id: 10, x: 613, y: 186, name: "Helsinki" },
    // 11. Copenhagen (Denmark)
    { id: 11, x: 461, y: 258, name: "Copenhagen" },
    // 12. Brussels (Belgium)
    { id: 12, x: 361, y: 334, name: "Brussels" },
    // 13. Amsterdam (Netherlands)
    { id: 13, x: 368, y: 310, name: "Amsterdam" },
    // 14. Luxembourg (Luxembourg)
    { id: 14, x: 383, y: 351, name: "Luxembourg" },
    // 15. Bern (Switzerland)
    { id: 15, x: 399, y: 396, name: "Bern" },
    // 16. Vienna (Austria)
    { id: 16, x: 509, y: 376, name: "Vienna" },
    // 17. Prague (Czech Republic)
    { id: 17, x: 485, y: 346, name: "Prague" },
    // 18. Warsaw (Poland)
    { id: 18, x: 565, y: 312, name: "Warsaw" },
    // 19. Budapest (Hungary)
    { id: 19, x: 542, y: 387, name: "Budapest" },
    // 20. Bratislava (Slovakia)
    { id: 20, x: 518, y: 378, name: "Bratislava" },
    // 21. Ljubljana (Slovenia)
    { id: 21, x: 486, y: 410, name: "Ljubljana" },
    // 22. Zagreb (Croatia)
    { id: 22, x: 504, y: 415, name: "Zagreb" },
    // 23. Sarajevo (Bosnia & Herzegovina)
    { id: 23, x: 535, y: 445, name: "Sarajevo" },
    // 24. Belgrade (Serbia)
    { id: 24, x: 558, y: 431, name: "Belgrade" },
    // 25. Podgorica (Montenegro)
    { id: 25, x: 544, y: 467, name: "Podgorica" },
    // 26. Tirana (Albania)
    { id: 26, x: 551, y: 485, name: "Tirana" },
    // 27. Skopje (North Macedonia)
    { id: 27, x: 572, y: 474, name: "Skopje" },
    // 28. Athens (Greece)
    { id: 28, x: 599, y: 537, name: "Athens" },
    // 29. Sofia (Bulgaria)
    { id: 29, x: 594, y: 464, name: "Sofia" },
    // 30. Bucharest (Romania)
    { id: 30, x: 629, y: 436, name: "Bucharest" },
    // 31. Kyiv (Ukraine)
    { id: 31, x: 683, y: 340, name: "Kyiv" },
    // 32. Chisinau (Moldova)
    { id: 32, x: 663, y: 394, name: "Chisinau" },
    // 33. Minsk (Belarus)
    { id: 33, x: 648, y: 286, name: "Minsk" },
    // 34. Riga (Latvia)
    { id: 34, x: 604, y: 239, name: "Riga" },
    // 35. Tallinn (Estonia)
    { id: 35, x: 612, y: 199, name: "Tallinn" },
    // 36. Vilnius (Lithuania)
    { id: 36, x: 618, y: 274, name: "Vilnius" },
    // 37. Moscow (Russia, European part)
    { id: 37, x: 770, y: 257, name: "Moscow" },
    // 38. Ankara (Turkey)
    { id: 38, x: 713, y: 508, name: "Ankara" },
];


const CONNECTIONS: Connection[] = [
    { from: 0, to: 1, cost: 10 },
    { from: 1, to: 2, cost: 10 },
    { from: 2, to: 3, cost: 10 },
    { from: 3, to: 4, cost: 10 },
    { from: 4, to: 5, cost: 10 },
    { from: 5, to: 6, cost: 10 },
    { from: 6, to: 7, cost: 10 },
    { from: 8, to: 9, cost: 10 },
    { from: 9, to: 0, cost: 10 },
];

interface MapProps {
    currentLocation: number;
    onCityClick?: (cityId: number) => void;
}

const Map: React.FC<MapProps> = ({ currentLocation, onCityClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Scale city coordinates based on canvas size
    const scaleCoordinates = (cities: City[]) => {
        const baseWidth = 800;
        const baseHeight = 600;
        const scaleX = dimensions.width / baseWidth;
        const scaleY = dimensions.height / baseHeight;

        return cities.map(city => ({
            ...city,
            x: city.x * scaleX,
            y: city.y * scaleY
        }));
    };

    const updateDimensions = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        // Limit maximum width to 1200px
        const maxWidth = 1200;
        const containerWidth = container.clientWidth;
        const width = Math.min(containerWidth, maxWidth);
        const height = width * 0.75; // maintain 4:3 aspect ratio

        setDimensions({ width, height });
        canvas.width = width;
        canvas.height = height;
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const drawMap = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        const scaledCities = scaleCoordinates(CITIES);
        // Adjust node radius based on longest city name
        const longestNameLength = Math.max(...CITIES.map(city => city.name.length));
        const nodeRadius = Math.min(
            dimensions.width / 15,  // Maximum radius
            Math.max(
                dimensions.width / 30,  // Minimum radius
                (longestNameLength * dimensions.width) / 400  // Scale with text
            )
        );

        // Draw connections
        CONNECTIONS.forEach(({ from, to }) => {
            const fromCity = scaledCities[from];
            const toCity = scaledCities[to];

            ctx.beginPath();
            ctx.moveTo(fromCity.x, fromCity.y);
            ctx.lineTo(toCity.x, toCity.y);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = Math.max(1, nodeRadius / 10);
            ctx.stroke();
        });

        // Draw cities
        scaledCities.forEach((city) => {
            // Draw circle
            ctx.beginPath();
            ctx.arc(city.x, city.y, nodeRadius, 0, Math.PI * 2);

            if (city.id === currentLocation) {
                ctx.fillStyle = '#4CAF50';
            } else {
                ctx.fillStyle = '#fff';
            }
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();

            // Draw city name
            ctx.fillStyle = '#000';
            const fontSize = Math.max(12, nodeRadius * 0.7);
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(city.name, city.x, city.y);
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawMap(ctx);
    }, [currentLocation, dimensions]);

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onCityClick) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const scaledCities = scaleCoordinates(CITIES);
        const nodeRadius = Math.min(dimensions.width, dimensions.height) / 30;

        scaledCities.forEach((city) => {
            const distance = Math.sqrt(
                Math.pow(city.x - x, 2) + Math.pow(city.y - y, 2)
            );
            if (distance < nodeRadius) {
                onCityClick(city.id);
            }
        });
    };

    return (
        <div style={{ width: '100%', padding: '10px', maxWidth: '1200px', margin: '0 auto' }}>
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                style={{
                    border: '1px solid #ccc',
                    maxWidth: '100%',
                    display: 'block'
                }}
            />
        </div>
    );
};

export default Map; 