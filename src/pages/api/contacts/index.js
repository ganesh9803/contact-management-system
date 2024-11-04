import { authMiddleware } from "@/middleware/auth";
import prisma from "@/utils/db";

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST': {
      const contacts = req.body; // Expect an array of contacts

      // Validate that the request body is an array
      if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'Invalid input: must be a non-empty array of contacts' });
      }

      // Check for required fields in each contact
      const missingFields = contacts.map(contact => {
        const fields = [];
        if (!contact.name) fields.push('name');
        if (!contact.email) fields.push('email');
        if (!contact.phone) fields.push('phone');
        if (!contact.address) fields.push('address');
        if (!contact.timezone) fields.push('timezone');
        return { contact, missingFields: fields };
      }).filter(item => item.missingFields.length > 0);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: 'Missing fields in contacts', details: missingFields });
      }

      try {
        const newContacts = await prisma.contact.createMany({
          data: contacts.map(contact => ({
            ...contact,
            userId: req.user.id // Set userId for each contact
          })),
        });
        res.status(201).json({ message: 'Contacts created successfully', newContacts });
      } catch (error) {
        console.error('Error creating contacts:', error);
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Unique constraint failed on the fields: (`email`)' });
        }
        res.status(500).json({ error: 'Failed to create contacts' });
      }
      break;
    }

    case 'PUT': {
      const contacts = req.body; // Expect an array of contacts with ID for updates

      // Validate that the request body is an array
      if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'Invalid input: must be a non-empty array of contacts' });
      }

      try {
        const updatedContacts = await Promise.all(
          contacts.map(contact => {
            // Ensure each contact has an ID for update
            if (!contact.id) {
              throw new Error(`Contact ID is required for contact: ${JSON.stringify(contact)}`);
            }

            // Update only the fields provided
            return prisma.contact.update({
              where: { id: contact.id },
              data: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                timezone: contact.timezone,
              },
            });
          })
        );
        res.status(200).json({ message: 'Contacts updated successfully', updatedContacts });
      } catch (error) {
        console.error('Error updating contacts:', error);
        res.status(500).json({ error: 'Failed to update contacts' });
      }
      break;
    }

    case 'GET': {
      // Fetch contacts for the authenticated user
      const contacts = await prisma.contact.findMany({
        where: { userId: req.user.id, isDeleted: false },
      });
      res.status(200).json(contacts);
      break;
    }

    case 'DELETE': {
      const { id } = req.body;

      // Ensure that the contact ID is provided
      if (!id) {
        return res.status(400).json({ error: 'Contact ID is required' });
      }

      try {
        // Mark the contact as deleted
        const deletedContact = await prisma.contact.update({
          where: { id },
          data: { isDeleted: true },
        });
        res.status(200).json({ message: 'Contact deleted successfully', deletedContact });
      } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
      }
      break;
    }

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};

// Export the handler wrapped in authMiddleware
export default authMiddleware(handler);
