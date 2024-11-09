import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { Container, Row, Col, Table, Button, Form, Alert, Spinner } from 'react-bootstrap';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f6375b00089a0a3ac1"); // Replace with your project ID

const database = new Databases(client);

const App = () => {
  const [inviteeName, setInviteeName] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromURL = params.get('invitee_name');
    if (nameFromURL) {
      setInviteeName(nameFromURL);
      fetchInviteeData(nameFromURL);
    } else {
      setError('No invitee name provided in URL.');
    }
  }, []);

  const fetchInviteeData = async (name) => {
    setLoading(true);
    setError('');

    try {
      const response = await database.listDocuments(
        "672eedea003a91170a14",  // Replace with your Appwrite database ID
        "672efb740029903b3a8f",  // Replace with your Appwrite collection ID
        [Query.equal('invitee_name', name)]
      );

      if (response.documents.length === 0) {
        setError('No data found for this invitee.');
        setData([]);
        setTotal(0)
      } else {
        setData(response.documents);
        const totalGuests = response.documents.reduce((acc, doc) => acc + (doc.nop || 0), 0);
        setTotal(totalGuests);
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (inviteeName) fetchInviteeData(inviteeName);
  };

  return (
    <Container>
      <h1 className="mt-20">Invitee Dashboard</h1>

      <Form className="mb-20" onSubmit={(e) => { e.preventDefault(); handleRefresh(); }}>
        <Form.Group as={Row} controlId="inviteeName">
          <Form.Label column sm="auto">Invitee Name</Form.Label>
          <Col sm="auto">
            <Form.Control
              type="text"
              placeholder="Enter invitee name"
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
            />
          </Col>
          <Col sm="auto">
            <Button variant="primary" onClick={handleRefresh}>
              Fetch Data
            </Button>
          </Col>
        </Form.Group>
      </Form>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">
            </span>
          </Spinner>
          <p>Loading data for {inviteeName}...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {data.length > 0 && !loading && (
        <Table striped bordered hover responsive className='my-4'>
          <thead>
            <tr>
              <th>Invitee Name</th>
              <th>Person Name</th>
              <th>Number of Persons</th>
            </tr>
          </thead>
          <tbody>
            {data.map((doc) => (
              <tr key={doc.$id}>
                <td>{doc.invitee_name}</td>
                <td>{doc.person_name}</td>
                <td>{doc.nop}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h4 className="mt-20">Total number of guests for {inviteeName}: {total}</h4>

      {!loading && !data.length && !error && (
        <Alert variant="info" className="text-center">
          No data available. Please enter an invitee name and try again.
        </Alert>
      )}
    </Container>
  );
};

export default App;
