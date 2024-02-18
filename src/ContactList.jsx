// ContactList.js
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import ContactForm from './ContactForm';
import { Typography } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://65c088d3dc74300bce8c2832.mockapi.io/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const updateContact = (updatedContact) => {
    setContacts(contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)));
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://65c088d3dc74300bce8c2832.mockapi.io/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const clearSelectedContact = () => {
    setSelectedContact(null);
  };

  const handleEditContact = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    setSelectedContact(contactToEdit);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedContacts = contacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>

    <br/>
    <ContactsIcon sx={{ml:63}}/>
    <Typography align='center' variant='h3'>PhoneBook</Typography>

    <Grid container spacing={1} >
      <Grid item xs={12} >
        <ContactForm
          addContact={addContact}
          updateContact={updateContact}
          selectedContact={selectedContact}
          clearSelectedContact={clearSelectedContact}
        />
      </Grid>
      <Typography align='center' variant='h4'> Contacts List</Typography>
      <Grid item xs={12}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell >Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.dob}</TableCell>
                    <TableCell>{contact.mobile}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => deleteContact(contact.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        sx={{ml:5}}
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditContact(contact.id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid></>
  );
};

export default ContactList;
