import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { Container, Row, Col, Table, Button, Form, Alert } from 'react-bootstrap';

// Initialize Appwrite client
const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1")
.setProject("66f6375b00089a0a3ac1"); // Replace with your project ID

const database = new Databases(client);

// Dashboard component
const App = () => {
  const [inviteeName, setInviteeName] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    console.log("params: ", params)
    const nameFromURL = params.get('invitee_name');
    if (nameFromURL) {
      setInviteeName(nameFromURL);
      fetchInviteeData(nameFromURL);
    } else {
      setError('No invitee name provided in URL.');
    }
  }, []);

  const fetchInviteeData = async () => {

    setLoading(true);
    setError('');

    try {
      console.log("invitee name:", inviteeName)
      const response = await database.listDocuments(
        "672eedea003a91170a14",  // Replace with your Appwrite database ID
        "672efb740029903b3a8f",  // Replace with your Appwrite collection ID
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

  // fetchInviteeData().then(() => {
  //   console.log("Data fetched for invitee: ", inviteeName)
  // })

  return (
    <Container>
      <h1 className="mt-4">Invitee Dashboard</h1>
      
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
                <td>{doc.nop}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default App;
