import react from "react";
import InfoBox from "./InfoBox";
import Table from "./Table";
import Map from "./Map";
import Linegraph from "./Linegraph";
import { sortData,format } from "./util";
import { Card, CardContent, FormControl, MenuItem,Select} from "@material-ui/core";
import { useState,useEffect } from "react";
import "leaflet/dist/leaflet.css";

import './App.css';

function App() {
  const[countries,setCountries]=useState([])
  const[country,setCountry]=useState("worldwide")
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapcenter,setMapcenter]=useState({lat:34.80746 ,lng:-40.4796});
  const[mapzoom,setMapzoom]=useState(2);
  const[mapcountries,setMapcountries]=useState([]);
  const[casestype,setcaseType]=useState("cases");
  useEffect(()=>{
    const getCountriesData=async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso3
        }))
        setMapcountries(data);
        setCountries(countries);
        const sortedData=sortData(data);
        setTableData(sortedData);
      })
    }
    getCountriesData();
  },[])
  useEffect(async()=>{
    await fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })

  },[])

  const onCountryChange= async(event)=>{
    const countryCode=event.target.value;

    const url= countryCode==="worldwide" ? "https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode==="worldwide"){
        setMapcenter({lat:34.80746 ,lng:-40.4796})
        setMapzoom(2);
      }
      else{
        setMapcenter({lat:data.countryInfo.lat,lng:data.countryInfo.long})
        setMapzoom(3);
      }
      
      
    })
    
   
  }
  console.log(countryInfo);
  
  
  return (
    <div className="App">
      <div className="app_left">
      <div className="app_header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map(country=>(<MenuItem value={country.value}>{country.name}</MenuItem>))}
        </Select>
      </FormControl>
        
      </div>
      <div class="app_status">
        <InfoBox onClick={(e)=> setcaseType("cases")} title="Coronavirus Cases" cases={format(countryInfo.todayCases)} total={format(countryInfo.cases)}/>
        <InfoBox  onClick={(e)=> setcaseType("recovered")}title="Recovered" cases={format(countryInfo.todayRecovered)} total={format(countryInfo.recovered)}/>
        <InfoBox onClick={(e)=> setcaseType("deaths")} title="Deaths" cases={format(countryInfo.todayDeaths)} total={format(countryInfo.deaths)}/>
        
      </div>
      <Map casestype={casestype} countries={mapcountries} center={mapcenter} zoom={mapzoom}/>

      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by Country</h2>
          <Table countries={tableData}/>
          <h2>Worldwide new {casestype}</h2>
          <Linegraph className="app_graph" casestype={casestype} />
        </CardContent>

      </Card>
      

     

      
   
    </div>
  );
}

export default App;
