import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

function Gold() {

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
                const response = await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions);
                const res = await response.json();
                console.log(res);
                const goldrate = res["price_gram_22k"] * 800
                const goldrate_1g = res["price_gram_22k"] * 100
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
            <h1>Today's Gold Rate 22 carat 8g {GoldRate}</h1>
            <h1>Today's Gold Rate 22 carat 1g {GoldRate_1g}</h1>
        </Container>
    )


}

export default Gold;