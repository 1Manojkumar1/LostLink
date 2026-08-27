import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PackageX, PackageCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createItem } from '../services/itemService';
import { CATEGORIES } from '../utils/constants';
import Navbar from '../components/Navbar';

export default function ReportItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [type, setType] = useState(searchParams.get('type') || 'LOST');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdItemId, setCreatedItemId] = useState(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['LOST', 'FOUND'].includes(typeParam)) {
      setType(typeParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !category || !location || !date) {
      setError('Please fill in all required fields');
      return;
    }

    if (type === 'FOUND' && (!verificationQuestion || !verificationAnswer)) {
      setError('Verification question and answer are required for FOUND items');
      return;
    }

    setLoading(true);
    try {
      const itemData = { title, description, category, type, location, date };
      if (type === 'FOUND') {
        itemData.verificationQuestion = verificationQuestion;
        itemData.verificationAnswer = verificationAnswer;
      }
      const res = await createItem(itemData);
      setCreatedItemId(res.data.id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="card max-w-md w-full text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Report Submitted</h2>
            <p className="text-text-secondary mb-6">
              Your {type.toLowerCase()} item has been added to LostLink.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate(`/items/${createdItemId}`)} className="btn-primary">View Item</button>
              <button onClick={() => navigate('/items')} className="btn-ghost">Browse Items</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="page-title mb-2">Report an Item</h1>
        <p className="page-subtitle mb-8">Help reunite lost items with their owners</p>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">What happened?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('LOST')}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border-2 transition-all ${
                  type === 'LOST'
                    ? 'bg-error/10 border-error text-error'
                    : 'bg-surface border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                <PackageX className="w-5 h-5" />
                <span className="font-medium">I Lost Something</span>
              </button>
              <button
                type="button"
                onClick={() => setType('FOUND')}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border-2 transition-all ${
                  type === 'FOUND'
                    ? 'bg-success/10 border-success text-success'
                    : 'bg-surface border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                <PackageCheck className="w-5 h-5" />
                <span className="font-medium">I Found Something</span>
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">
              Item Name <span className="text-error">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="e.g., Black HP Laptop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
            <p className="text-xs text-text-muted mt-1">{title.length}/100</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1.5">
              Category <span className="text-error">*</span>
            </label>
            <select
              id="category"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="description"
              className="input min-h-[120px] resize-y"
              placeholder="Describe the item in detail — color, brand, identifying marks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={500}
              required
            />
            <p className="text-xs text-text-muted mt-1">{description.length}/500</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1.5">
              Location <span className="text-error">*</span>
            </label>
            <input
              id="location"
              type="text"
              className="input"
              placeholder="e.g., Central Library, Room 204"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1.5">
              Date <span className="text-error">*</span>
            </label>
            <input
              id="date"
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Verification Fields for FOUND */}
          {type === 'FOUND' && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-primary/15 rounded-md flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">?</span>
                </div>
                <p className="text-sm font-medium text-text">Ownership Verification</p>
              </div>
              <p className="text-sm text-text-secondary">
                Set a question only the true owner can answer. This helps verify claims before you approve them.
              </p>
              <div>
                <label htmlFor="verificationQuestion" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Verification Question <span className="text-error">*</span>
                </label>
                <input
                  id="verificationQuestion"
                  type="text"
                  className="input"
                  placeholder="e.g., What sticker is on the laptop?"
                  value={verificationQuestion}
                  onChange={(e) => setVerificationQuestion(e.target.value)}
                  disabled={loading}
                  maxLength={200}
                  required
                />
              </div>
              <div>
                <label htmlFor="verificationAnswer" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Verification Answer <span className="text-error">*</span>
                </label>
                <input
                  id="verificationAnswer"
                  type="text"
                  className="input"
                  placeholder="e.g., Blue sticker"
                  value={verificationAnswer}
                  onChange={(e) => setVerificationAnswer(e.target.value)}
                  disabled={loading}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-text-muted mt-1">This answer is kept private and never shown publicly.</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {type === 'LOST' ? <PackageX className="w-4 h-4" /> : <PackageCheck className="w-4 h-4" />}
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
