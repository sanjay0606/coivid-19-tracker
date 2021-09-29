import react from "react";
import {useState, useEffect} from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";



const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

const builderChartData=(data,casestype="cases")=>{
    let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casestype][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casestype][date];
  }
  return chartData;
}
function Linegraph({casestype,...props}){
    const[data,setData]=useState({});

    useEffect(()=>{
        const fetchData= async()=>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
            .then((response)=>response.json())
            .then((data)=>{
                let chartData=builderChartData(data,casestype)

                setData(chartData)
                //console.log(chartData);
            })
        }
        fetchData()

    },[casestype])
    return(

        <div className={props.className}> 
             {data?.length > 0 && (
        <Line
          
          data={{
            datasets: [
              {
                label:"No of Cases",
                fill:true,
                pointRadius:0,
               
                
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          //options={options}
        />
      )}


        </div>
    )
}

export default Linegraph;