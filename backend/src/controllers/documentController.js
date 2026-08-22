import DataStore from '../config/dataStore.js';

// Ensure sample documents collection exists in DataStore
const existingDocs = DataStore.getCollection('documents');
if (!existingDocs || existingDocs.length === 0) {
  DataStore.setCollection('documents', [
    {
      id: 'doc-1',
      title: 'Republic of India Passport (Copy)',
      category: 'Passport & ID',
      tripId: null,
      tripTitle: 'Global / Personal',
      fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      fileType: 'image/jpeg',
      fileName: 'passport_scan_2026.jpg',
      fileSize: '1.4 MB',
      issueDate: '2020-04-12',
      documentNumber: 'P7492019',
      notes: 'Primary biometric passport copy for international travel.',
      isPrivate: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      title: 'Indigo Flight E-Ticket (DEL → GOI)',
      category: 'Flight & Train',
      tripId: 'trip-1',
      tripTitle: 'Goa Beach Escape',
      fileUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      fileType: 'application/pdf',
      fileName: 'goa_flight_eticket.pdf',
      fileSize: '840 KB',
      issueDate: '2026-08-01',
      documentNumber: 'PNR: 6E-4819',
      notes: 'Terminal 3 departure at 07:45 AM. 20kg checked baggage included.',
      isPrivate: false,
      createdAt: new Date().toISOString(),
    },
  ]);
}

export const getAllDocuments = async (req, res) => {
  try {
    const documents = DataStore.getCollection('documents') || [];
    res.json({ success: true, count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const doc = DataStore.findById('documents', req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const newDoc = DataStore.insert('documents', req.body);
    res.status(201).json({ success: true, document: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const updated = DataStore.findByIdAndUpdate('documents', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, document: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const deleted = DataStore.findByIdAndDelete('documents', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
