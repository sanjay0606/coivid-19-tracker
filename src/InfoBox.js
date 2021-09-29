import {Card ,CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import react from "react";
import { useState,useEffect } from "react";


function InfoBox({title,cases,total,...props}){
    return(
        <Card className="infoBox" onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox_title" color="textSecondary">{title}</Typography>
                <h2 class="infoBox_cases">{cases}</h2>
                <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}


export default InfoBox;