import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CONDITIONS = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm", "Hazy", "Clear"];
const ICONS = ["☀️", "⛅", "☁️", "🌧️", "🌧️", "⛈️", "🌫️", "🌙"];

function getDayName(offset: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return days[d.getDay()];
}

function getDateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

function generateWeatherData(lat: number, lon: number) {
  const baseTemp = 25 + Math.sin(lat * 0.1) * 10;
  const forecast = [];

  for (let i = 0; i < 7; i++) {
    const maxTemp = baseTemp + Math.random() * 8 - 2;
    const minTemp = maxTemp - 8 - Math.random() * 4;
    const precipitation = Math.random() * 30;
    const condIdx = precipitation > 20 ? 3 : precipitation > 10 ? 2 : Math.floor(Math.random() * 2);

    forecast.push({
      date: getDateStr(i),
      day: getDayName(i),
      maxTemp: Math.round(maxTemp * 10) / 10,
      minTemp: Math.round(minTemp * 10) / 10,
      precipitation: Math.round(precipitation * 10) / 10,
      humidity: Math.round(50 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      condition: CONDITIONS[condIdx],
      icon: ICONS[condIdx],
    });
  }

  const alerts = [];
  const current = forecast[0];

  if (current.precipitation > 20) {
    alerts.push({
      type: "rain_alert",
      severity: "high",
      message: `Heavy rainfall expected today (${current.precipitation}mm). Avoid field operations and protect crops.`,
      icon: "🌧️",
    });
  }
  if (current.maxTemp > 38) {
    alerts.push({
      type: "heat_stress",
      severity: "high",
      message: `High temperature alert: ${Math.round(current.maxTemp)}°C. Increase irrigation and avoid afternoon work.`,
      icon: "🌡️",
    });
  }
  const dryDays = forecast.filter((d) => d.precipitation < 2).length;
  if (dryDays >= 5 && current.maxTemp > 35) {
    alerts.push({
      type: "drought_risk",
      severity: "medium",
      message: `Drought risk: ${dryDays} consecutive dry days forecast with high temperatures. Conserve water.`,
      icon: "🏜️",
    });
  }
  const totalRain = forecast.slice(0, 3).reduce((s, d) => s + d.precipitation, 0);
  if (totalRain > 60) {
    alerts.push({
      type: "flood_risk",
      severity: "high",
      message: `Flood risk: ${Math.round(totalRain)}mm rain expected in next 3 days. Check drainage systems.`,
      icon: "🌊",
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      type: "rain_alert",
      severity: "low",
      message: "Weather conditions are favorable for farming. Good time for field operations.",
      icon: "✅",
    });
  }

  return { current, forecast, alerts };
}

router.get("/weather", (req, res) => {
  const lat = parseFloat(req.query["lat"] as string) || 18.5204;
  const lon = parseFloat(req.query["lon"] as string) || 73.8567;
  const location = (req.query["location"] as string) || "Pune, Maharashtra";

  const { current, forecast, alerts } = generateWeatherData(lat, lon);

  res.json({
    location,
    current,
    forecast,
    alerts,
  });
});

export default router;
