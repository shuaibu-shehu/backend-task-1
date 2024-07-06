import express, {Request, Response} from "express";
import axios from "axios";
import  cors from "cors";
import dotenv from "dotenv";


dotenv.config();
const app = express();

app.use(cors());
app.get("/api/hello", async (req:Request , res:Response) => {
 const visitorName =  req.query.visitor_name;
 const apiKey =  process.env.IPSTACK_API_KEY;
 const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;

 const visitorIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
 
 const url = `http://api.ipstack.com/${visitorIP}?access_key=${apiKey}`;

 
 try {
   const response = await axios.get(url);
   const location = response.data;

   console.log("Location data:", location);
   
    const waether= await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${openWeatherApiKey}`) 
   console.log("Weather data:", waether.data);
   let temp =waether.data.main.temp
   temp = temp - 273.15;    
   console.log("Temperature data:", temp);
    res.json({
        client_ip:visitorIP,
        location: location.region_name,
        greeting: `Hello, ${visitorName}, the temperature is ${temp.toFixed(2)} degress celcius in ${location.city}`,
   });
 } catch (error) {
   console.error("Error fetching location data:", error);
   res.send(`Hello, ${visitorName}`);
 }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});