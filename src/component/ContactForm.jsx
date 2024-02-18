// ContactForm.js
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const ContactForm = ({ addContact, updateContact, selectedContact, clearSelectedContact }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    mobile: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    dob: '',
    mobile: '',
    email: '',
  });

  useEffect(() => {
    if (selectedContact) {
      setFormData(selectedContact);
    }
  }, [selectedContact]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (selectedContact) {
        // If there is a selected contact, update it
        try {
          const response = await axios.put(
            `https://65c088d3dc74300bce8c2832.mockapi.io/api/contacts/${selectedContact.id}`,
            formData
          );
          updateContact(response.data);
          clearSelectedContact();
        } catch (error) {
          console.error('Error updating contact:', error);
        }
        console.log(selectedContact.id);
      } else {
        try {
          const response = await axios.post('https://65c088d3dc74300bce8c2832.mockapi.io/api/contacts', formData);
          addContact(response.data);
          setFormData({ name: '', dob: '', mobile: '', email: '' });
        } catch (error) {
          console.error('Error adding contact:', error);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
      margin='normal'
        label="Name"
        sx={{mr:6}}

        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
      />
      <TextField
      margin='normal'
      sx={{mr:6}}

        label=""
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        required
        error={Boolean(formErrors.dob)}
        helperText={formErrors.dob}
      />
      <TextField
      margin='normal'
        sx={{mr:6}}
        label="Mobile Number"
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        required
        error={Boolean(formErrors.mobile)}
        helperText={formErrors.mobile}
      />
      <TextField
      margin='normal'

        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
      /><br/><br/>
      <Button sx={{ml:53}} type="submit" variant="contained" color="success">
        {selectedContact ? 'Update Contact' : 'Add Contact'}
      </Button>
    </form>
  );
};

export default ContactForm;
