import react from "react";
import {Circle,Popup} from "react-leaflet";
import numeral from"numeral";

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 800,
    },
    recovered: {
      hex: "#1B9814",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000,
    },
  };

export const format=(stat)=>((stat)? `+${numeral(stat).format("0.0a")}`: "+0" )

export const sortData=(data)=>{
    const sortedData=[...data];
    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1;
        }
        else{
            return 1;
        }
    })
    return sortedData;
}

export const showDataOnMap=(data,casestype="cases")=>
    data.map((country)=>(
        <Circle 
        center={[country.countryInfo.lat,country.countryInfo.long]}
        color={casesTypeColors[casestype].hex}
        fillColor={casesTypeColors[casestype].hex}
        opacity={0.9}
        radius={
            (Math.sqrt(country[casestype]) * casesTypeColors[casestype].multiplier)/2
          }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-cases"> Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths"> Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>

        </Circle>
    ));

