import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Number of items to display per page

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await fetch('/api/contacts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setEditMode(true);
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await fetch(`/api/contacts`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([selectedContact]),
            });

            if (!response.ok) {
                throw new Error('Failed to update contact');
            }

            await fetchContacts();
            setEditMode(false);
            setSelectedContact(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await fetch(`/api/contacts`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            await fetchContacts();
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastContact = currentPage * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const closeEditMode = () => {
        setEditMode(false);
        setSelectedContact(null);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
                <h1 className="text-2xl font-bold my-4">Contact List</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 my-2 w-full"
                />
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border-b p-2 text-center">Name</th>
                            <th className="border-b p-2 text-center">Email</th>
                            <th className="border-b p-2 text-center">Phone</th>
                            <th className="border-b p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContacts.map(contact => (
                            <tr key={contact.id}>
                                <td className="border-b p-2 text-center">{contact.name}</td>
                                <td className="border-b p-2 text-center">{contact.email}</td>
                                <td className="border-b p-2 text-center">{contact.phone}</td>
                                <td className="border-b p-2 text-center">
                                    <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:underline ml-4">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMode && (
                    <div>
                        <h2 className="text-xl font-semibold mt-4">Edit Contact</h2>
                        <input
                            type="text"
                            value={selectedContact.name}
                            onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                            placeholder="Name"
                            className="border p-2 my-2 w-full"
                        />
                        <input
                            type="email"
                            value={selectedContact.email}
                            onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                            placeholder="Email"
                            className="border p-2 my-2 w-full"
                        />
                        <input
                            type="text"
                            value={selectedContact.phone}
                            onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                            placeholder="Phone"
                            className="border p-2 my-2 w-full"
                        />
                        <div className="flex space-x-4 mt-2">
                            <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 my-2">
                                Update
                            </button>
                            <button onClick={closeEditMode} className="bg-gray-500 text-white p-2 my-2">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`mx-1 px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
