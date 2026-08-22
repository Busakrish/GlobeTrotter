import { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Shield,
  Lock,
  Eye,
  Download,
  Trash2,
  File,
  FileCheck,
  Plane,
  Building2,
  ShieldAlert,
  Car,
  FolderOpen,
  X,
  Copy,
  Check,
  Upload,
} from 'lucide-react';
import Button from '../components/common/Button';

const CATEGORIES = [
  { id: 'All', label: 'All Documents', icon: FolderOpen },
  { id: 'Passport & ID', label: 'Passport & ID', icon: Shield },
  { id: 'Flight & Train', label: 'Flight & Tickets', icon: Plane },
  { id: 'Hotel Voucher', label: 'Hotel Vouchers', icon: Building2 },
  { id: 'Visa & Permits', label: 'Visas & Permits', icon: FileCheck },
  { id: 'Travel Insurance', label: 'Insurance', icon: ShieldAlert },
  { id: 'Car Rental', label: 'Car Rentals', icon: Car },
  { id: 'Other', label: 'Other Docs', icon: FileText },
];

export function DocumentVault() {
  const { documents, addDocument, deleteDocument, trips } = useTrips();
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTripFilter, setSelectedTripFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form State for Adding Document
  const [formData, setFormData] = useState({
    title: '',
    category: 'Passport & ID',
    tripId: '',
    documentNumber: '',
    issueDate: '',
    notes: '',
    isPrivate: false,
    fileUrl: '',
    fileName: '',
    fileSize: '',
    fileType: 'image/jpeg',
  });

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return (documents || []).filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tripTitle?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;

      const matchesTrip =
        selectedTripFilter === 'All' ||
        (selectedTripFilter === 'personal' && !doc.tripId) ||
        doc.tripId === selectedTripFilter;

      return matchesSearch && matchesCategory && matchesTrip;
    });
  }, [documents, searchQuery, selectedCategory, selectedTripFilter]);

  // Handle File Input Upload (Base64 / URL fallback)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        fileUrl: reader.result,
        fileName: file.name,
        fileSize: sizeMB,
        fileType: file.type,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      notifyWarning('Please provide a document title');
      return;
    }

    const selectedTrip = trips.find((t) => t.id === formData.tripId || t._id === formData.tripId);
    
    addDocument({
      ...formData,
      tripTitle: selectedTrip ? selectedTrip.title : 'Global / Personal',
      fileUrl: formData.fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      fileName: formData.fileName || `${formData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: formData.fileSize || '1.2 MB',
    });

    notifySuccess('Document saved securely in your vault!');
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Passport & ID',
      tripId: '',
      documentNumber: '',
      issueDate: '',
      notes: '',
      isPrivate: false,
      fileUrl: '',
      fileName: '',
      fileSize: '',
      fileType: 'image/jpeg',
    });
  };

  const handleDelete = (docId) => {
    deleteDocument(docId);
    notifyInfo('Document deleted from vault.');
    if (previewDoc?.id === docId) setPreviewDoc(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notifySuccess('Reference code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stats Summary
  const stats = useMemo(() => {
    const total = (documents || []).length;
    const privateCount = (documents || []).filter((d) => d.isPrivate).length;
    const linkedTripsCount = (documents || []).filter((d) => d.tripId).length;

    return { total, privateCount, linkedTripsCount };
  }, [documents]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Travel Document Vault
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Store, categorize, and quickly access your passports, tickets, vouchers & visas in one secure place.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{stats.total}</div>
            <div className="text-xs font-semibold text-slate-500">Total Saved Docs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{stats.linkedTripsCount}</div>
            <div className="text-xs font-semibold text-slate-500">Linked to Trips</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{stats.privateCount}</div>
            <div className="text-xs font-semibold text-slate-500">Encrypted / Private</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, PNR, trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Trip Selector Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter by Trip:</span>
            <select
              value={selectedTripFilter}
              onChange={(e) => setSelectedTripFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Trips & Personal</option>
              <option value="personal">Personal Vault Only</option>
              {trips.map((t) => (
                <option key={t.id || t._id} value={t.id || t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'All'
                ? (documents || []).length
                : (documents || []).filter((d) => d.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No documents found</h3>
          <p className="text-xs text-slate-500">
            No travel documents matched your current search query or category filter. Try clearing filters or upload a new document.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedTripFilter('All');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline pt-2"
          >
            Clear Search & Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                      <FileCheck className="w-3 h-3" />
                      {doc.category}
                    </span>

                    {doc.isPrivate && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>

                  {/* Document Title & File Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-slate-500">
                      {doc.fileUrl && doc.fileUrl.startsWith('http') ? (
                        <img
                          src={doc.fileUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doc.fileName || 'document_file.pdf'} • {doc.fileSize || '1 MB'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    {doc.documentNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400">Doc / PNR:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono text-xs font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {doc.documentNumber}
                          </code>
                          <button
                            onClick={() => copyToClipboard(doc.documentNumber, doc.id)}
                            className="text-slate-400 hover:text-indigo-600"
                            title="Copy Code"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">Associated Trip:</span>
                      <span className="font-bold text-indigo-700 truncate max-w-[160px]">
                        {doc.tripTitle || 'Personal Vault'}
                      </span>
                    </div>

                    {doc.issueDate && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold">Added / Issue Date:</span>
                        <span className="font-bold text-slate-700">{doc.issueDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName || 'document'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Upload Travel Document</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Passport Copy, Air India Ticket, Taj Hotel Voucher"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Associated Trip
                  </label>
                  <select
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="">Personal Vault (No Trip)</option>
                    {trips.map((t) => (
                      <option key={t.id || t._id} value={t.id || t._id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doc Number / PNR / Confirmation Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. PNR-89412 or Passport No. P98124"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue / Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload File / Scan
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-300 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-file-input"
                  />
                  <label htmlFor="document-file-input" className="cursor-pointer block space-y-1">
                    <Upload className="w-6 h-6 text-indigo-500 mx-auto" />
                    <div className="text-xs font-bold text-indigo-600">
                      {formData.fileName ? formData.fileName : 'Click to select file (PDF, Image)'}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Max file size 10MB • Auto-encrypted in browser
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes & Special Remarks
                </label>
                <textarea
                  rows="2"
                  placeholder="Additional travel details, seat numbers, emergency contact notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="isPrivate" className="text-xs font-semibold text-slate-700">
                  Mark as Private (Encrypted Vault Document)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Inspector & Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {previewDoc.category}
                    </span>
                    {previewDoc.isPrivate && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {previewDoc.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document File Preview */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden min-h-[220px] max-h-[360px] flex items-center justify-center border border-slate-800 relative group">
              {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:image') ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-[350px] w-auto object-contain mx-auto"
                />
              ) : previewDoc.fileUrl && previewDoc.fileUrl.startsWith('http') ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="text-center p-8 space-y-2 text-white">
                  <File className="w-12 h-12 text-indigo-400 mx-auto" />
                  <div className="text-sm font-bold">{previewDoc.fileName}</div>
                  <p className="text-xs text-slate-400">PDF Document ready for inspection</p>
                </div>
              )}
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Confirmation / PNR:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {previewDoc.documentNumber || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Linked Trip:</span>
                <span className="font-bold text-indigo-700 text-sm">
                  {previewDoc.tripTitle || 'Personal Vault'}
                </span>
              </div>

              {previewDoc.issueDate && (
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-semibold block mb-0.5">Issue / Date:</span>
                  <span className="font-bold text-slate-700">
                    {previewDoc.issueDate}
                  </span>
                </div>
              )}

              {previewDoc.notes && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-semibold block mb-1">Notes:</span>
                  <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {previewDoc.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDelete(previewDoc.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Document</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName || 'document'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentVault;
