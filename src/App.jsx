import React, { useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { Container, Row, Col, Table, Button, Form, Alert } from 'react-bootstrap';

// Initialize Appwrite client
const client = new Client()
.setEndpoint(import.meta.env.ENDPOINT)
.setProject(import.meta.env.PROJECT_ID); // Replace with your project ID

const database = new Databases(client);

// Dashboard component
const App = () => {
  const [inviteeName, setInviteeName] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(window.location.search)
  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const nameFromURL = params.get('invitee_name');
    console.log(nameFromURL)
    if (nameFromURL) {
      setInviteeName(nameFromURL);
      fetchInviteeData(nameFromURL);
    } else {
      setError('No invitee name provided in URL.');
    }
  }, []);

  const fetchInviteeData = async () => {
    if (!inviteeName.trim()) {
      setError('Please enter an invitee name.');
      return;
    }

    setLoading(true);
    setError('');
    setData([]);

    try {
      const response = await database.listDocuments(
        import.meta.env.DB_ID,  // Replace with your Appwrite database ID
        import.meta.env.COL_ID,  // Replace with your Appwrite collection ID
        [Query.equal('invitee_name', inviteeName)]
      );

      if (response.documents.length === 0) {
        setError('No data found for this invitee.');
      } else {
        setData(response.documents);
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Invitee Dashboard</h1>
      
      <Row className="my-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Enter Invitee Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter invitee name"
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={fetchInviteeData} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {data.length > 0 && (
        <Table striped bordered hover responsive>
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
                <td>{doc.num_persons}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default App;
