import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

function Gold() {
    const [date, setdate] = useState("")
    const [GoldRate, setGoldRate] = useState("")
    const [GoldRate_1g, setGoldRate_1g] = useState("")


    useEffect(() => {
        async function fetchGoldRate() {
            const requestOptions = {
                method: 'GET',
                headers: {
                    "x-access-token": "goldapi-3mouislupup64u-io",
                    "Content-Type": "application/json"
                },
            };
            try {
                const response = await fetch("https://www.goldapi.io/api/XAU/INR", requestOptions);
                const res = await response.json();
                console.log(res);
                const goldrate = res["price"] / 3.8879346 
                const goldrate_1g = res["price"]  / 31.1034768
                
                console.log(res["timestamp"])
                var date = new Date(parseInt(res["timestamp"])*1000);
                console.log()
                setdate(date.toDateString())
                console.log(goldrate);
                setGoldRate(goldrate)
                setGoldRate_1g(goldrate_1g)
            } catch (error) {
                console.error('Error fetching gold rate:', error);
                setGoldRate("error")
            }
        }
        fetchGoldRate()
    }, [])


    return (
        <Container>
            
            <h1>Today's Gold Rate {date}</h1>
            <br/>
            <br/>
            <h1>1g - {GoldRate_1g}</h1>
            <h1>8g - {GoldRate}</h1>
            
        </Container>
    )


}

export default Gold;