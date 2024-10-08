import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Index() {

    return (
        <Container fluid>
            <br/>
            <Row >
                <Col xs={4}>
                    <Link to="/gold">
                        <Button >
                            Gold
                        </Button>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to="/sip">
                        <Button >
                            SIP
                        </Button>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to="/savings">
                        <Button >
                            Savings
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}