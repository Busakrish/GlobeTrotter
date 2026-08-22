import DataStore from '../config/dataStore.js';

export const getAllDocuments = async (req, res) => {
  try {
    const documents = DataStore.getCollection('documents');
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
    const success = DataStore.findByIdAndDelete('documents', req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
