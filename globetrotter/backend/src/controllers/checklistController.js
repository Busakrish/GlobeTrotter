import DataStore from '../config/dataStore.js';

export const getTripChecklists = async (req, res) => {
  try {
    const { tripId } = req.params;
    let items = DataStore.find('checklists', { tripId });

    if (!items.length) {
      // Default checklist categories and items
      const defaults = [
        { id: `chk-${tripId}-1`, tripId, category: 'Documents & Passes', title: 'Passports / National Identity IDs', completed: true, required: true },
        { id: `chk-${tripId}-2`, tripId, category: 'Documents & Passes', title: 'Confirmed Flight & Train Tickets', completed: true, required: true },
        { id: `chk-${tripId}-3`, tripId, category: 'Documents & Passes', title: 'Hotel Reservation Vouchers', completed: false, required: false },
        { id: `chk-${tripId}-4`, tripId, category: 'Health & Essentials', title: 'Personal First Aid & Prescriptions', completed: false, required: true },
        { id: `chk-${tripId}-5`, tripId, category: 'Health & Essentials', title: 'Sunscreen & Insect Repellent', completed: true, required: false },
        { id: `chk-${tripId}-6`, tripId, category: 'Electronics', title: 'Power Bank & Universal Travel Adapter', completed: false, required: true },
        { id: `chk-${tripId}-7`, tripId, category: 'Electronics', title: 'Camera & Memory Cards', completed: false, required: false },
      ];
      items = defaults;
      defaults.forEach((d) => DataStore.insert('checklists', d));
    }

    return res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addChecklistItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, category, required } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide item title' });
    }

    const newItem = {
      id: `chk-${tripId}-${Date.now()}`,
      tripId,
      title,
      category: category || 'General Essentials',
      completed: false,
      required: !!required,
    };

    DataStore.insert('checklists', newItem);

    return res.status(201).json({
      success: true,
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = DataStore.findById('checklists', id) || DataStore.findOne('checklists', { id });

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const updated = DataStore.findByIdAndUpdate('checklists', id, { completed: !item.completed });

    return res.json({
      success: true,
      item: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    DataStore.findByIdAndDelete('checklists', id);

    return res.json({
      success: true,
      message: 'Item removed',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getTripChecklists, addChecklistItem, toggleChecklistItem, deleteChecklistItem };
