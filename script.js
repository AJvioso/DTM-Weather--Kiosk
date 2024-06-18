document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=7.45&current_weather=true';

    function fetchWeatherData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const weatherElement = document.getElementById('weather');
                const temperature = data.current_weather.temperature;
                const windspeed = data.current_weather.windspeed;
                const winddirection = data.current_weather.winddirection;
                const weathercode = data.current_weather.weathercode;

                weatherElement.innerHTML = `
                    <p>Temperature: ${temperature} °C</p>
                    <p>Windspeed: ${windspeed} km/h</p>
                    <p>Wind Direction: ${winddirection}°</p>
                    <p>Weather Code: ${weathercode}</p>
                `;

                drawWindDirection(winddirection);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }

    function drawWindDirection(direction) {
        const canvas = document.getElementById('windDirectionCanvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw compass circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw compass directions
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        directions.forEach((dir, index) => {
            const angle = (index * 45 - 90) * (Math.PI / 180);
            const x = centerX + (radius + 20) * Math.cos(angle);
            const y = centerY + (radius + 20) * Math.sin(angle);
            ctx.fillText(dir, x - 10, y + 5);
        });

        // Draw compass graduations
        for (let i = 0; i < 360; i += 10) {
            const angle = (i - 90) * (Math.PI / 180);
            const x1 = centerX + radius * Math.cos(angle);
            const y1 = centerY + radius * Math.sin(angle);
            const x2 = centerX + (radius + (i % 90 === 0 ? 20 : 10)) * Math.cos(angle);
            const y2 = centerY + (radius + (i % 90 === 0 ? 20 : 10)) * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Draw wind direction line
        const angle = direction * (Math.PI / 180);
        const endX = centerX + radius * Math.cos(angle - Math.PI / 2);
        const endY = centerY + radius * Math.sin(angle - Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Fetch data immediately when the page loads
    fetchWeatherData();

    // Set interval to fetch data every 5 minutes (300,000 milliseconds)
    setInterval(fetchWeatherData, 300000);
});
