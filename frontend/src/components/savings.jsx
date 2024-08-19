import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FaTrash } from 'react-icons/fa';

export default function Savings() {
    const [Savings, setSavings] = useState([{
        "Particular": "",
        "Amount": 0
    }]);


    function OnEdit(value, key, index) {
        const saving = [...Savings];
        saving.forEach((s, i) => {
            if (i === index) {
                saving[i][key] = value;
            }
        })
        setSavings(saving)
    }

    function OnAdd(e) {
        const saving = [...Savings, {
            "Particular": "",
            "Amount": 0
        }];
        setSavings(saving)
    }

    function OnSub(e, index) {
        const saving = [...Savings];
        saving.splice(index, 1);
        setSavings(saving)
    }

    useEffect(() => {
    }, [Savings]);

    return (
        <>
            <Container fluid >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Particulars</th>
                            <th>Amount</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            Savings.map((saving, index) => (
                                <tr key={index}>
                                    <td>{index + 1}
                                        <span> </span>
                                        <Button
                                            onClick={(e) => { OnSub(e, index) }}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                    <td>
                                        <Form.Control
                                            value={saving.Particular}
                                            onChange={(e) => { OnEdit(e.target.value, "Particular", index); }}
                                        >
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={saving.Amount}
                                            onChange={(e) => { OnEdit(e.target.value, "Amount", index); }}
                                        >
                                        </Form.Control></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Button
                    onClick={(e) => { OnAdd(e) }}>
                    +
                </Button>

            </Container>
        </>
    );
}