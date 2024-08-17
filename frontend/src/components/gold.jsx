import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

function Gold() {

    const [GoldRate, setGoldRate] = useState("")


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
                console.log(goldrate);
                setGoldRate(goldrate)
            } catch (error) {
                console.error('Error fetching gold rate:', error);
                setGoldRate("error")
            }
        }
        fetchGoldRate()
    }, [])


    return (
        <Container>
            <h1>Today's Gold Rate {GoldRate}</h1>
        </Container>
    )


}

export default Gold;