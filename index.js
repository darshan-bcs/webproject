const http = require('http');

const fs=require('fs');
var requests=require("requests");
const homeFile=fs.readFileSync("home.html","utf-8");
const port=process.env.PORT ||8000;

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}" ,orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}" ,orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}" ,orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}" ,orgVal.name);
    temperature = temperature.replace("{%country%}" ,orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}" ,orgVal.weather[0].main);
    return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=anand&appid=3329707052a3872a9380c3c1cf1d7bf3")
        .on('data',(chunk)=>{
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on('end',(err)=>{
            if(err)return console.log('connection close due to error',err);
            res.end();
        });
    }
});

server.listen(port,()=>{
    console.log(`listening port ${port}`);
});