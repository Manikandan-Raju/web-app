import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

function App() {
  const [investment, setInvestment] = useState(1000);
  const [rate, setRate] = useState(13);
  const [inflation, setinflation] = useState(7);
  const [years, setYears] = useState(20);
  const [ActualInvestment, setActualInvestment] = useState(0);
  const [FutureReturn, setFutureReturn] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [ActualInvestmentInflation, setActualInvestmentInflation] = useState(null);
  const [FutureReturnInflation, setFutureReturnInflation] = useState(null);


  const calculateSIP = useCallback(() => {
    var future_returns = [];
    var actual_investments = [];
    var actual_investments_inflation = [];
    var future_returns_inflation = [];
    var labels = [];

    setActualInvestment(investment * years * 12)
    for (let i = 1; i <= years; i++) {
      const ratePerMonth = rate / 12 / 100;
      const inflationPerMonth = -(inflation / 12 / 100);
      const inflationReturnsPerMonth = ratePerMonth + inflationPerMonth;
      const months = i * 12;

      const future_value = investment * ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) * (1 + ratePerMonth);
      setFutureReturn(future_value.toFixed(0))
      future_returns.push(future_value.toFixed(2));

      const actual_investment_inflation = investment * ((Math.pow(1 + inflationPerMonth, months) - 1) / inflationPerMonth) * (1 + inflationPerMonth);
      actual_investments_inflation.push(actual_investment_inflation.toFixed(2));
      setActualInvestmentInflation(actual_investment_inflation.toFixed(0))

      const inf_sip = investment * ((Math.pow(1 + inflationReturnsPerMonth, months) - 1) / inflationReturnsPerMonth) * (1 + inflationReturnsPerMonth);
      future_returns_inflation.push(inf_sip.toFixed(2));
      setFutureReturnInflation(inf_sip.toFixed(0))

      const value = investment * months;
      actual_investments.push(value.toFixed(2));

      labels.push(i);
    }


    setChartData({
      labels,
      datasets: [
        {
          label: 'Actual Investment',
          data: actual_investments,
          borderColor: 'rgba(0, 0, 0, 1)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: 2,
          borderDash: [10, 5], // Dotted line
        },
        {
          label: 'Inflation Adjusted Investment',
          data: actual_investments_inflation,
          borderColor: 'rgba(255, 0, 0, 1)',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',

          borderWidth: 2,
          borderDash: [10, 5], // Dotted line
        },
        {
          label: 'Future Return',
          data: future_returns,
          borderColor: 'rgba(0, 255, 0, 1)',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',

          borderWidth: 1,
        },


        {
          label: 'Inflation Adjusted Return',
          data: future_returns_inflation,
          borderColor: 'rgba(0, 127, 255, 1)',
          backgroundColor: 'rgba(0, 127, 255, 0.2)',
          borderWidth: 2,
          borderDash: [10, 5], // Dotted line
        },
      ],
    });

  }, [investment, rate, years, inflation]);

  useEffect(() => {
    calculateSIP();
  }, [investment, rate, years, inflation, calculateSIP]);

  return (
    <Container fluid >
      <Col sm={4}>
        <Row >
          <Col sm={4}>
            <Form.Label>Monthly SIP</Form.Label>
          </Col>
          <Col sm={8} style={{ alignContent: "center" }}>
            <Form.Control
              type="number"
              value={investment}
              step={500}
              onChange={(e) => {
                setInvestment(parseFloat(e.target.value))
              }}
            />
            <Form.Range
              min="0"
              max="50000"
              step="500"
              value={investment}
              onChange={(e) => {
                setInvestment(parseFloat(e.target.value))
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Label>Years</Form.Label>
          </Col>
          <Col sm={8} style={{ alignContent: "center" }}>
            <Form.Control
              type="number"
              value={years}
              onChange={(e) => {
                setYears(parseFloat(e.target.value));
              }}
            />
            <Form.Range
              min="0"
              max="50"
              step="1"
              value={years}
              onChange={(e) => {
                setYears(parseFloat(e.target.value));
              }}
            />
          </Col>
        </Row>
        <Row >
          <Col sm={4}>
            <Form.Label>Rate (%)</Form.Label>
          </Col>
          <Col sm={8} style={{ alignContent: "center" }} >
            <Form.Control
              type="number"
              value={rate}
              onChange={(e) => {
                setRate(parseFloat(e.target.value));
              }}
            />
            <Form.Range
              min="0"
              max="20"
              step="1"
              value={rate}
              onChange={(e) => {
                setRate(parseFloat(e.target.value));
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Label>Inflation (%)</Form.Label>
          </Col>
          <Col sm={8} style={{ alignContent: "center" }} >
            <Form.Control
              type="number"
              value={inflation}
              onChange={(e) => {
                setinflation(parseFloat(e.target.value));
              }}
            />
            <Form.Range
              min="0"
              max="15"
              step="1"
              value={inflation}
              onChange={(e) => {
                setinflation(parseFloat(e.target.value));
              }}
            />

          </Col>
        </Row>
        <Row>
          {chartData && (
            <Line data={chartData} options={{ responsive: true }} />
          )}
        </Row>
        <Row style={{ padding: "0%" }}>
          <Col sm={4}>

          </Col>
          <Col sm={4}>
            <Form.Label>Investment</Form.Label>
          </Col>
          <Col sm={4}>
            <Form.Label>Returns</Form.Label>
          </Col>
        </Row>
        <Row style={{ padding: "0%" }}>
          <Col sm={4}>
            <Form.Label>Actual</Form.Label>
          </Col>
          <Col sm={4} >
            <Form.Label >{Intl.NumberFormat().format(ActualInvestment)} </Form.Label>
          </Col>
          <Col sm={4} >
            <Form.Label >{Intl.NumberFormat().format(FutureReturn)} </Form.Label>
          </Col>
        </Row>
        <Row style={{ padding: "0%" }}>
          <Col sm={4}>
            <Form.Label>Inflation</Form.Label>
          </Col>
          <Col sm={4} >
            <Form.Label >{Intl.NumberFormat().format(ActualInvestmentInflation)}</Form.Label>
          </Col>
          <Col sm={4} >
            <Form.Label >{Intl.NumberFormat().format(FutureReturnInflation)}</Form.Label>
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

export default App;
