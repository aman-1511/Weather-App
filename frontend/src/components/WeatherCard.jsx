import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiCloudy,
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
  WiNightClear,
  WiNightCloudy,
  WiNightRain,
  WiNightSnow,
  WiNightThunderstorm,
  WiNightFog,
} from "react-icons/wi";
import { FiDroplet, FiChevronLeft } from "react-icons/fi";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

// Helper function to format time from timestamp
const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

// Helper function to format hour from timestamp (e.g., 09 am, 12 pm)
const formatHourAmPm = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', hour12: true }).toLowerCase().replace(":00", "");
};

// Helper function to get Day name
const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'long' });
};

// Helper to get current Date and Time string
const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.toLocaleDateString(undefined, { weekday: 'long' });
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day}, ${time}`;
};

// Helper to get weather icon based on weather ID and time
const getWeatherIcon = (id, dt, sunrise, sunset) => {
    const isDay = dt > sunrise && dt < sunset;

    if (id >= 200 && id < 300) return isDay ? WiThunderstorm : WiNightThunderstorm;
    if (id >= 300 && id < 400) return isDay ? WiRain : WiNightRain;
    if (id >= 500 && id < 600) return isDay ? WiRain : WiNightRain;
    if (id >= 600 && id < 700) return isDay ? WiSnow : WiNightSnow;
    if (id >= 700 && id < 800) return isDay ? WiFog : WiNightFog;
    if (id === 800) return isDay ? WiDaySunny : WiNightClear;
    if (id === 801) return isDay ? WiDayCloudy : WiNightCloudy;
    if (id === 802) return isDay ? WiCloudy : WiNightCloudy;
    if (id >= 803) return isDay ? WiCloudy : WiNightCloudy;

    return isDay ? WiDayCloudy : WiNightCloudy;
};

function WeatherCard({ data, onClearSearch }) {
  // Extract city name and the forecast list
  const cityName = data.city.name;
  const forecastList = data.list;
  const { sunrise, sunset } = data.city;

  // Get the current weather conditions from the first forecast entry
  const currentForecast = forecastList[0];
  const currentTemp = Math.round(currentForecast.main.temp);
  const currentDescription = currentForecast.weather[0].description;
  const currentHumidity = currentForecast.main.humidity;
  const currentWindSpeed = currentForecast.wind.speed;
  const currentPrecipitation = Math.round((currentForecast.pop || 0) * 100); // Probability of Precipitation

  // Find a suitable weather icon (This needs more logic based on weather.id or description)
  // Placeholder:
  const CurrentWeatherIcon = getWeatherIcon(currentForecast.weather[0].id, currentForecast.dt, sunrise, sunset);

  // Prepare data for the chart: time and temperature
  const chartData = forecastList.slice(0, 8).map(item => ({
    time: item.dt, // Use Unix timestamp for XAxis
    temp: Math.round(item.main.temp),
    hourLabel: formatHourAmPm(item.dt) // Add formatted hour label
  }));

  // Data for Chance of Rain (next 8 points)
  const rainChanceData = forecastList.slice(0, 8).map(item => ({
      timeLabel: formatHourAmPm(item.dt),
      pop: Math.round((item.pop || 0) * 100)
  }));

  // Process data for 3-Day Forecast
  const dailyForecasts = {};
  forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
              temps: [],
              pops: [],
              weathers: [],
              dts: []
          };
      }
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].pops.push(item.pop || 0);
      dailyForecasts[date].weathers.push(item.weather[0]);
      dailyForecasts[date].dts.push(item.dt);
  });

  const threeDayForecast = Object.entries(dailyForecasts)
      .slice(0, 3) // Take the next 3 days (including today if it appears first)
      .map(([dateStr, dailyData]) => {
          const maxTemp = Math.round(Math.max(...dailyData.temps));
          const minTemp = Math.round(Math.min(...dailyData.temps));
          // Find the most frequent weather condition or use midday weather
          // Simple approach: use the weather from the first entry of the day
          const representativeWeather = dailyData.weathers[0]; 
          const representativeDt = dailyData.dts[0]; // Use dt for icon determination
          const WeatherIcon = getWeatherIcon(representativeWeather.id, representativeDt, sunrise, sunset);
          return {
              day: getDayName(representativeDt),
              icon: WeatherIcon,
              description: representativeWeather.main, // e.g., Clouds, Rain
              maxTemp,
              minTemp
          };
      });

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg text-gray-700 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

      {/* Back Button */} 
      <button 
          onClick={onClearSearch} 
          className="absolute top-4 left-4 text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-200 transition-colors z-10"
          aria-label="Back to search"
      >
          <FiChevronLeft size={24} />
      </button>

      {/* Main Content Area (Left/Center) - Spanning 2 columns on large screens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Current Location & Basic Info */}
        <div className="flex justify-between items-center pt-4 lg:pt-0 pl-12 relative"> 
          <div>
            <p className="text-sm text-gray-500">Current Location</p>
            <h2 className="text-2xl font-bold text-gray-800">{cityName}</h2>
          </div>
          {/* Add icons/buttons for top right if needed */}
        </div>

        {/* Large Weather Display (Placeholder structure) */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between min-h-[150px]">
            <div className="flex items-center mb-4 sm:mb-0">
                <CurrentWeatherIcon size={80} className="mr-4 drop-shadow-md" />
                <div>
                    <p className="text-5xl font-bold drop-shadow-sm">{currentTemp}°C</p>
                    <p className="text-lg capitalize">{currentDescription}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg">{getCurrentDateTime()}</p>
                {/* Could add feels like temp here */}
            </div>
        </div>


        {/* Today's Highlights Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Today's Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Precipitation Card */}
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-4 rounded-lg shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Precipitation</p>
              <FiDroplet className="mx-auto text-blue-500 mb-1" size={24}/>
              <p className="text-xl font-bold">{currentPrecipitation}%</p>
            </div>
            {/* Humidity Card */}
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-4 rounded-lg shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Humidity</p>
              <WiHumidity className="mx-auto text-green-500 mb-1" size={24}/>
              <p className="text-xl font-bold">{currentHumidity}%</p>
            </div>
            {/* Wind Speed Card */}
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-4 rounded-lg shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Wind</p>
              <WiStrongWind className="mx-auto text-indigo-500 mb-1" size={24}/>
              {/* Convert m/s to km/h if desired: (speed * 3.6).toFixed(1) */}
              <p className="text-xl font-bold">{currentWindSpeed.toFixed(1)} m/s</p>
            </div>
             {/* Sunrise & Sunset Card */}
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-1">Sunrise & Sunset</p>
                <div className="flex justify-center items-center space-x-2 mb-1">
                   <WiSunrise className="text-orange-500" size={24}/>
                   <p className="text-md font-semibold">{formatTime(sunrise)}</p>
                </div>
                <div className="flex justify-center items-center space-x-2">
                   <WiSunset className="text-orange-500" size={24}/>
                   <p className="text-md font-semibold">{formatTime(sunset)}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Temperature Forecast Chart (Keep existing structure for now, will style later) */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Temperature Today</h4>
          <ResponsiveContainer width="100%" height={200}> {/* Adjusted height */}
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -15, bottom: 5 }} // Adjusted margins
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                dataKey="hourLabel"
                stroke="#9E9E9E"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="#9E9E9E"
                tick={{ fontSize: 10 }}
                label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#9E9E9E', dx: -5 }}
                domain={['dataMin - 2', 'dataMax + 2']} // Add some padding
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: "4px" }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value) => [`${value}°C`, "Temp"]}
              />
              {/* <Legend /> */}
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8" // Purple color like image
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ stroke: '#8884d8', strokeWidth: 1, r: 3, fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Sidebar Area (Chance of Rain, 3 Day Forecast) - Placeholder */}
      <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Chance of Rain</h3>
              <div className="space-y-3">
                  {rainChanceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 w-1/4">{item.timeLabel}</span>
                          <div className="w-3/4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${item.pop}%` }}
                              ></div>
                          </div>
                           <span className="text-gray-600 w-10 text-right">{item.pop}%</span> {/* Fixed width for alignment */} 
                      </div>
                  ))}
                  {/* Legend (Optional) */}
                   <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                       <span>Sunny</span>
                       <span>Rainy</span>
                       <span>Heavy Rain</span>
                   </div>
              </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">3 Days Forecast</h3>
              <div className="space-y-3">
                  {threeDayForecast.map((dayFc, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg flex items-center justify-between shadow">
                          <div className="flex items-center space-x-2">
                              <dayFc.icon size={30} />
                              <div>
                                  <p className="font-semibold">{dayFc.day}</p>
                                  <p className="text-xs capitalize">{dayFc.description}</p>
                              </div>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                               <FaTemperatureHigh size={14} /><span>{dayFc.maxTemp}°</span>
                               <span className="opacity-70">/</span>
                               <FaTemperatureLow size={14} /><span>{dayFc.minTemp}°</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          {/* Search Again Button - Placed at the bottom of sidebar for visibility */} 
          <button 
                onClick={onClearSearch} 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow"
            >
                Search New Location
           </button>
      </div>

    </div>
  );
}

export default WeatherCard;
