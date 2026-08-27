import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PackageX, PackageCheck, Loader2, CheckCircle2, AlertCircle,
  ChevronRight, ChevronLeft, Upload, X, Camera, MapPin, Clock,
  Shield, User, Bell, Eye, EyeOff, FileText
} from 'lucide-react';
import { createItem } from '../services/itemService';
import { CATEGORIES, LOCATION_TYPES, CONTACT_METHODS, SECURITY_CATEGORIES, REPORT_STEPS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const INITIAL_FORM = {
  type: 'LOST',
  title: '',
  description: '',
  category: '',
  brand: '',
  model: '',
  color: '',
  size: '',
  distinctiveFeatures: '',
  approximateValue: '',
  date: new Date().toISOString().split('T')[0],
  lostTime: '',
  timeApproximate: false,
  lastSeenDate: '',
  lastSeenTime: '',
  location: '',
  locationDetails: '',
  locationType: '',
  latitude: '',
  longitude: '',
  serialNumber: '',
  imei: '',
  deviceModel: '',
  engraving: '',
  uniqueMarkings: '',
  stickers: '',
  otherIdentifiers: '',
  photos: [],
  proofDocuments: [],
  circumstances: '',
  ownershipProof: '',
  securityInfo: { deviceLocked: false, cardBlocked: false, idReported: false, otherMeasures: '' },
  preferredContact: 'in_app',
  privacySettings: { showPhone: false, showEmail: false, showExactLocation: true, showSerialNumber: false, showOwnershipProof: false },
  notifications: { inApp: true, email: true, sms: false },
  verificationQuestion: '',
  verificationAnswer: '',
};

function FileUpload({ files, onFilesChange, accept = 'image/*', label, icon: Icon = Camera }) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        onFilesChange([...files, { name: file.name, size: file.size, type: file.type, dataUrl: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-text-muted transition-colors"
      >
        <Icon className="w-8 h-8 text-text-muted mx-auto mb-2" />
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-xs text-text-muted mt-1">Max 5MB per file</p>
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple onChange={handleFileSelect} className="hidden" />
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-surface rounded-lg">
              {file.type?.startsWith('image/') ? (
                <img src={file.dataUrl} alt="" className="w-10 h-10 rounded object-cover" />
              ) : (
                <FileText className="w-5 h-5 text-text-muted" />
              )}
              <span className="text-sm text-text-secondary truncate flex-1">{file.name}</span>
              <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-surface-elevated rounded">
                <X className="w-3.5 h-3.5 text-text-muted" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-text-muted">Step {currentStep} of {steps.length}</span>
        <span className="text-xs font-mono text-text-muted">{steps[currentStep - 1]?.label}</span>
      </div>
      <div className="w-full bg-surface-elevated h-1 rounded-full overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((step) => (
          <div key={step.id} className={`text-center flex-1 ${step.id === currentStep ? 'text-primary' : step.id < currentStep ? 'text-success' : 'text-text-muted'}`}>
            <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold border ${
              step.id === currentStep ? 'border-primary bg-primary/15 text-primary' :
              step.id < currentStep ? 'border-success bg-success/15 text-success' :
              'border-border bg-surface text-text-muted'
            }`}>
              {step.id < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
            </div>
            <span className="text-[10px] hidden md:block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

export default function ReportItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdItemId, setCreatedItemId] = useState(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['LOST', 'FOUND'].includes(typeParam)) {
      setForm((f) => ({ ...f, type: typeParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        contactName: user.name || '',
        contactEmail: user.email || '',
      }));
    }
  }, [user]);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validateStep = (stepNum) => {
    const errs = {};
    switch (stepNum) {
      case 1:
        if (!form.title.trim()) errs.title = 'Item name is required';
        if (!form.category) errs.category = 'Category is required';
        if (!form.description.trim()) errs.description = 'Description is required';
        break;
      case 2:
        if (!form.date) errs.date = 'Date is required';
        break;
      case 3:
        if (!form.location.trim()) errs.location = 'Location is required';
        break;
      case 7:
        if (form.type === 'FOUND') {
          if (!form.verificationQuestion.trim()) errs.verificationQuestion = 'Verification question is required for FOUND items';
          if (!form.verificationAnswer.trim()) errs.verificationAnswer = 'Verification answer is required for FOUND items';
        }
        break;
      case 8:
        if (!form.contactEmail.trim() && !form.contactPhone.trim()) {
          errs.contactEmail = 'At least one contact method is required';
        }
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, REPORT_STEPS.length));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const itemData = {
        title: form.title,
        description: form.description,
        category: form.category,
        type: form.type,
        location: form.location,
        date: form.date,
      };

      const optionalFields = [
        'brand', 'model', 'color', 'size', 'distinctiveFeatures', 'approximateValue',
        'lostTime', 'timeApproximate', 'lastSeenDate', 'lastSeenTime',
        'locationDetails', 'locationType', 'latitude', 'longitude',
        'serialNumber', 'imei', 'deviceModel', 'engraving', 'uniqueMarkings', 'stickers', 'otherIdentifiers',
        'circumstances', 'ownershipProof', 'securityInfo',
        'preferredContact', 'privacySettings', 'notifications',
      ];

      optionalFields.forEach((field) => {
        if (form[field] !== undefined && form[field] !== null && form[field] !== '') {
          itemData[field] = form[field];
        }
      });

      if (form.type === 'FOUND') {
        itemData.verificationQuestion = form.verificationQuestion;
        itemData.verificationAnswer = form.verificationAnswer;
      }

      if (form.photos.length > 0) {
        itemData.photos = form.photos.map((p) => p.dataUrl);
        itemData.image = form.photos[0].dataUrl;
      }
      if (form.proofDocuments.length > 0) {
        itemData.proofDocuments = form.proofDocuments.map((p) => p.dataUrl);
      }

      const res = await createItem(itemData);
      setCreatedItemId(res.data.id);
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create report' });
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
            <p className="text-text-secondary mb-2">
              Your {form.type.toLowerCase()} item report has been created.
            </p>
            <p className="text-xs text-text-muted mb-6 font-mono">Reference: {createdItemId}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate(`/items/${createdItemId}`)} className="btn-primary">View Report</button>
              <button onClick={() => navigate('/dashboard')} className="btn-ghost">Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <div className="max-w-2xl mx-auto">
          <h1 className="page-title mb-2">Report an Item</h1>
          <p className="page-subtitle mb-6">Help reunite lost items with their owners</p>

          <StepIndicator currentStep={step} steps={REPORT_STEPS} />

          {errors.submit && (
            <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          {/* Type Selection - always visible */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">What happened?</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setField('type', 'LOST')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.type === 'LOST' ? 'bg-error/10 border-error text-error' : 'bg-surface border-border text-text-secondary hover:border-text-muted'
                }`}>
                <PackageX className="w-5 h-5" />
                <span className="font-medium">I Lost Something</span>
              </button>
              <button type="button" onClick={() => setField('type', 'FOUND')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.type === 'FOUND' ? 'bg-success/10 border-success text-success' : 'bg-surface border-border text-text-secondary hover:border-text-muted'
                }`}>
                <PackageCheck className="w-5 h-5" />
                <span className="font-medium">I Found Something</span>
              </button>
            </div>
          </div>

          {/* Step 1: Item Details */}
          {step === 1 && (
            <div className="space-y-5">
              <FormField label="Item Name" required>
                <input type="text" className={`input ${errors.title ? 'input-error' : ''}`} placeholder="e.g., Black HP Laptop" value={form.title} onChange={(e) => setField('title', e.target.value)} maxLength={100} />
                {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
                <p className="text-xs text-text-muted mt-1">{form.title.length}/100</p>
              </FormField>

              <FormField label="Category" required>
                <select className={`input ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={(e) => setField('category', e.target.value)}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-xs text-error mt-1">{errors.category}</p>}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Brand">
                  <input type="text" className="input" placeholder="e.g., HP, Apple" value={form.brand} onChange={(e) => setField('brand', e.target.value)} />
                </FormField>
                <FormField label="Model">
                  <input type="text" className="input" placeholder="e.g., MacBook Pro" value={form.model} onChange={(e) => setField('model', e.target.value)} />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Color">
                  <input type="text" className="input" placeholder="e.g., Black, Red" value={form.color} onChange={(e) => setField('color', e.target.value)} />
                </FormField>
                <FormField label="Size">
                  <input type="text" className="input" placeholder="e.g., Medium, 15-inch" value={form.size} onChange={(e) => setField('size', e.target.value)} />
                </FormField>
              </div>

              <FormField label="Distinctive Features / Marks">
                <input type="text" className="input" placeholder="e.g., Blue sticker, scratch on lid" value={form.distinctiveFeatures} onChange={(e) => setField('distinctiveFeatures', e.target.value)} />
              </FormField>

              <FormField label="Description" required hint="Be as detailed as possible">
                <textarea className={`input min-h-[120px] resize-y ${errors.description ? 'input-error' : ''}`} placeholder="Describe the item in detail..." value={form.description} onChange={(e) => setField('description', e.target.value)} maxLength={2000} />
                {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
                <p className="text-xs text-text-muted mt-1">{form.description.length}/2000</p>
              </FormField>

              <FormField label="Approximate Value">
                <input type="number" className="input" placeholder="e.g., 500" value={form.approximateValue || ''} onChange={(e) => setField('approximateValue', e.target.value)} min="0" />
              </FormField>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              <FormField label="Date Lost/Found" required>
                <input type="date" className={`input ${errors.date ? 'input-error' : ''}`} value={form.date} onChange={(e) => setField('date', e.target.value)} />
                {errors.date && <p className="text-xs text-error mt-1">{errors.date}</p>}
              </FormField>

              <FormField label="Time (approximate is OK)">
                <input type="time" className="input" value={form.lostTime} onChange={(e) => setField('lostTime', e.target.value)} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={form.timeApproximate} onChange={(e) => setField('timeApproximate', e.target.checked)} className="w-4 h-4 rounded border-border" />
                  <span className="text-sm text-text-secondary">I'm not sure of the exact time</span>
                </label>
              </FormField>

              <div className="border-t border-border pt-5">
                <p className="text-sm font-medium text-text mb-3">Last Seen (optional)</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Last Seen Date">
                    <input type="date" className="input" value={form.lastSeenDate} onChange={(e) => setField('lastSeenDate', e.target.value)} />
                  </FormField>
                  <FormField label="Last Seen Time">
                    <input type="time" className="input" value={form.lastSeenTime} onChange={(e) => setField('lastSeenTime', e.target.value)} />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-5">
              <FormField label="Location" required>
                <input type="text" className={`input ${errors.location ? 'input-error' : ''}`} placeholder="e.g., Central Library, Room 204" value={form.location} onChange={(e) => setField('location', e.target.value)} />
                {errors.location && <p className="text-xs text-error mt-1">{errors.location}</p>}
              </FormField>

              <FormField label="Specific Details">
                <input type="text" className="input" placeholder="e.g., Near the entrance, 2nd floor" value={form.locationDetails} onChange={(e) => setField('locationDetails', e.target.value)} />
              </FormField>

              <FormField label="Location Type">
                <select className="input" value={form.locationType} onChange={(e) => setField('locationType', e.target.value)}>
                  <option value="">Select location type</option>
                  {LOCATION_TYPES.map((lt) => <option key={lt.value} value={lt.value}>{lt.label}</option>)}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Latitude">
                  <input type="number" className="input" placeholder="e.g., 28.6139" value={form.latitude || ''} onChange={(e) => setField('latitude', e.target.value)} step="any" />
                </FormField>
                <FormField label="Longitude">
                  <input type="number" className="input" placeholder="e.g., 77.2090" value={form.longitude || ''} onChange={(e) => setField('longitude', e.target.value)} step="any" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 4: Identification */}
          {step === 4 && (
            <div className="space-y-5">
              <p className="text-sm text-text-secondary mb-4">All identification fields are private and never shown publicly.</p>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Serial Number">
                  <input type="text" className="input" placeholder="e.g., SN12345678" value={form.serialNumber} onChange={(e) => setField('serialNumber', e.target.value)} />
                </FormField>
                <FormField label="IMEI (for phones)">
                  <input type="text" className="input" placeholder="e.g., 123456789012345" value={form.imei} onChange={(e) => setField('imei', e.target.value)} />
                </FormField>
              </div>

              <FormField label="Device/Model Number">
                <input type="text" className="input" placeholder="e.g., A1278" value={form.deviceModel} onChange={(e) => setField('deviceModel', e.target.value)} />
              </FormField>

              <FormField label="Engraving">
                <input type="text" className="input" placeholder="e.g., Name engraved on back" value={form.engraving} onChange={(e) => setField('engraving', e.target.value)} />
              </FormField>

              <FormField label="Unique Markings">
                <input type="text" className="input" placeholder="e.g., Dent on corner, specific wear pattern" value={form.uniqueMarkings} onChange={(e) => setField('uniqueMarkings', e.target.value)} />
              </FormField>

              <FormField label="Stickers / Decals">
                <input type="text" className="input" placeholder="e.g., University sticker on lid" value={form.stickers} onChange={(e) => setField('stickers', e.target.value)} />
              </FormField>

              <FormField label="Other Identifying Information">
                <textarea className="input min-h-[80px] resize-y" placeholder="Any other way to identify this item..." value={form.otherIdentifiers} onChange={(e) => setField('otherIdentifiers', e.target.value)} />
              </FormField>
            </div>
          )}

          {/* Step 5: Photos & Proof */}
          {step === 5 && (
            <div className="space-y-5">
              <FormField label="Photos of the Item" hint="Upload one or more photos">
                <FileUpload files={form.photos} onFilesChange={(files) => setField('photos', files)} accept="image/*" label="Upload Photos" icon={Camera} />
              </FormField>

              <FormField label="Supporting Documents" hint="Receipts, purchase records, etc.">
                <FileUpload files={form.proofDocuments} onFilesChange={(files) => setField('proofDocuments', files)} accept="image/*,.pdf" label="Upload Documents" icon={FileText} />
              </FormField>
            </div>
          )}

          {/* Step 6: Circumstances */}
          {step === 6 && (
            <div className="space-y-5">
              <FormField label="How did you lose/find this item?" hint="Describe what happened and where you last remember having it">
                <textarea className="input min-h-[160px] resize-y" placeholder="I was sitting in the library studying and left my bag under the desk. When I came back 30 minutes later, it was gone..." value={form.circumstances} onChange={(e) => setField('circumstances', e.target.value)} maxLength={2000} />
                <p className="text-xs text-text-muted mt-1">{form.circumstances.length}/2000</p>
              </FormField>
            </div>
          )}

          {/* Step 7: Ownership Verification */}
          {step === 7 && (
            <div className="space-y-5">
              {form.type === 'FOUND' ? (
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
                  <FormField label="Verification Question" required>
                    <input type="text" className={`input ${errors.verificationQuestion ? 'input-error' : ''}`} placeholder="e.g., What sticker is on the laptop?" value={form.verificationQuestion || ''} onChange={(e) => setField('verificationQuestion', e.target.value)} />
                    {errors.verificationQuestion && <p className="text-xs text-error mt-1">{errors.verificationQuestion}</p>}
                  </FormField>
                  <FormField label="Verification Answer" required>
                    <input type="text" className={`input ${errors.verificationAnswer ? 'input-error' : ''}`} placeholder="e.g., Blue sticker" value={form.verificationAnswer || ''} onChange={(e) => setField('verificationAnswer', e.target.value)} />
                    {errors.verificationAnswer && <p className="text-xs text-error mt-1">{errors.verificationAnswer}</p>}
                    <p className="text-xs text-text-muted mt-1">This answer is kept private and never shown publicly.</p>
                  </FormField>
                </div>
              ) : (
                <FormField label="How can you prove this item belongs to you?" hint="This information is private and used only for verification">
                  <textarea className="input min-h-[120px] resize-y" placeholder="e.g., I can describe the contents of the wallet, provide the receipt, show the IMEI..." value={form.ownershipProof || ''} onChange={(e) => setField('ownershipProof', e.target.value)} maxLength={500} />
                  <p className="text-xs text-text-muted mt-1">Do not include unnecessary sensitive information. This is only shared privately during verification.</p>
                </FormField>
              )}
            </div>
          )}

          {/* Step 8: Contact & Notifications */}
          {step === 8 && (
            <div className="space-y-5">
              <FormField label="Contact Information" hint="Pre-filled from your account">
                <div className="space-y-3">
                  <input type="text" className="input" placeholder="Full Name" value={form.contactName || ''} onChange={(e) => setField('contactName', e.target.value)} />
                  <input type="email" className={`input ${errors.contactEmail ? 'input-error' : ''}`} placeholder="Email Address" value={form.contactEmail || ''} onChange={(e) => setField('contactEmail', e.target.value)} />
                  {errors.contactEmail && <p className="text-xs text-error">{errors.contactEmail}</p>}
                  <input type="tel" className="input" placeholder="Phone Number (optional)" value={form.contactPhone || ''} onChange={(e) => setField('contactPhone', e.target.value)} />
                </div>
              </FormField>

              <FormField label="Preferred Contact Method">
                <div className="space-y-2">
                  {CONTACT_METHODS.map((cm) => (
                    <label key={cm.value} className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                      <input type="radio" name="preferredContact" value={cm.value} checked={form.preferredContact === cm.value} onChange={(e) => setField('preferredContact', e.target.value)} className="w-4 h-4" />
                      <span className="text-sm text-text">{cm.label}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Notifications" icon={Bell}>
                <div className="space-y-2">
                  {[
                    { key: 'inApp', label: 'In-app notifications' },
                    { key: 'email', label: 'Email notifications' },
                    { key: 'sms', label: 'SMS notifications' },
                  ].map((n) => (
                    <label key={n.key} className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                      <input type="checkbox" checked={form.notifications[n.key]} onChange={(e) => setField('notifications', { ...form.notifications, [n.key]: e.target.checked })} className="w-4 h-4 rounded border-border" />
                      <span className="text-sm text-text">{n.label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
          )}

          {/* Step 9: Privacy */}
          {step === 9 && (
            <div className="space-y-5">
              <p className="text-sm text-text-secondary mb-4">Control what information is visible to others. Sensitive data is hidden by default.</p>

              <FormField label="Contact Information Visibility">
                <div className="space-y-2">
                  {[
                    { key: 'showPhone', label: 'Show phone number publicly', icon: form.privacySettings.showPhone ? Eye : EyeOff },
                    { key: 'showEmail', label: 'Show email address publicly', icon: form.privacySettings.showEmail ? Eye : EyeOff },
                  ].map((p) => (
                    <label key={p.key} className="flex items-center justify-between p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                      <span className="text-sm text-text">{p.label}</span>
                      <button type="button" onClick={() => setField('privacySettings', { ...form.privacySettings, [p.key]: !form.privacySettings[p.key] })}
                        className={`w-10 h-6 rounded-full transition-colors relative ${form.privacySettings[p.key] ? 'bg-primary' : 'bg-surface-elevated'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.privacySettings[p.key] ? 'left-5' : 'left-1'}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Location Visibility">
                <label className="flex items-center justify-between p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                  <span className="text-sm text-text">Show exact coordinates publicly</span>
                  <button type="button" onClick={() => setField('privacySettings', { ...form.privacySettings, showExactLocation: !form.privacySettings.showExactLocation })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.privacySettings.showExactLocation ? 'bg-primary' : 'bg-surface-elevated'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.privacySettings.showExactLocation ? 'left-5' : 'left-1'}`} />
                  </button>
                </label>
              </FormField>

              <FormField label="Identification Visibility">
                <label className="flex items-center justify-between p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                  <span className="text-sm text-text">Show serial number publicly</span>
                  <button type="button" onClick={() => setField('privacySettings', { ...form.privacySettings, showSerialNumber: !form.privacySettings.showSerialNumber })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.privacySettings.showSerialNumber ? 'bg-primary' : 'bg-surface-elevated'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.privacySettings.showSerialNumber ? 'left-5' : 'left-1'}`} />
                  </button>
                </label>
              </FormField>
            </div>
          )}

          {/* Step 10: Review & Submit */}
          {step === 10 && (
            <div className="space-y-6">
              <p className="text-sm text-text-secondary mb-4">Review your report before submitting. Click any section header to edit.</p>

              <div className="space-y-4">
                <ReviewSection title="Item Details" onEdit={() => setStep(1)}>
                  <ReviewRow label="Name" value={form.title} />
                  <ReviewRow label="Category" value={form.category} />
                  {form.brand && <ReviewRow label="Brand" value={form.brand} />}
                  {form.model && <ReviewRow label="Model" value={form.model} />}
                  {form.color && <ReviewRow label="Color" value={form.color} />}
                  {form.size && <ReviewRow label="Size" value={form.size} />}
                  {form.distinctiveFeatures && <ReviewRow label="Features" value={form.distinctiveFeatures} />}
                  <ReviewRow label="Description" value={form.description} />
                  {form.approximateValue && <ReviewRow label="Value" value={`$${form.approximateValue}`} />}
                </ReviewSection>

                <ReviewSection title="Date & Time" onEdit={() => setStep(2)}>
                  <ReviewRow label="Date" value={form.date} />
                  {form.lostTime && <ReviewRow label="Time" value={`${form.lostTime}${form.timeApproximate ? ' (approximate)' : ''}`} />}
                  {form.lastSeenDate && <ReviewRow label="Last Seen" value={`${form.lastSeenDate}${form.lastSeenTime ? ` at ${form.lastSeenTime}` : ''}`} />}
                </ReviewSection>

                <ReviewSection title="Location" onEdit={() => setStep(3)}>
                  <ReviewRow label="Location" value={form.location} />
                  {form.locationDetails && <ReviewRow label="Details" value={form.locationDetails} />}
                  {form.locationType && <ReviewRow label="Type" value={LOCATION_TYPES.find((l) => l.value === form.locationType)?.label} />}
                </ReviewSection>

                {(form.serialNumber || form.imei || form.deviceModel || form.engraving || form.uniqueMarkings || form.stickers) && (
                  <ReviewSection title="Identification" onEdit={() => setStep(4)}>
                    {form.serialNumber && <ReviewRow label="Serial" value={form.serialNumber} />}
                    {form.imei && <ReviewRow label="IMEI" value={form.imei} />}
                    {form.deviceModel && <ReviewRow label="Device" value={form.deviceModel} />}
                    {form.engraving && <ReviewRow label="Engraving" value={form.engraving} />}
                    {form.uniqueMarkings && <ReviewRow label="Markings" value={form.uniqueMarkings} />}
                    {form.stickers && <ReviewRow label="Stickers" value={form.stickers} />}
                  </ReviewSection>
                )}

                <ReviewSection title="Photos & Proof" onEdit={() => setStep(5)}>
                  <ReviewRow label="Photos" value={`${form.photos.length} file(s)`} />
                  <ReviewRow label="Documents" value={`${form.proofDocuments.length} file(s)`} />
                </ReviewSection>

                {form.circumstances && (
                  <ReviewSection title="Circumstances" onEdit={() => setStep(6)}>
                    <p className="text-sm text-text-secondary">{form.circumstances}</p>
                  </ReviewSection>
                )}

                {form.type === 'FOUND' && (
                  <ReviewSection title="Verification" onEdit={() => setStep(7)}>
                    <ReviewRow label="Question" value={form.verificationQuestion} />
                  </ReviewSection>
                )}

                <ReviewSection title="Contact" onEdit={() => setStep(8)}>
                  <ReviewRow label="Name" value={form.contactName} />
                  <ReviewRow label="Email" value={form.contactEmail} />
                  {form.contactPhone && <ReviewRow label="Phone" value={form.contactPhone} />}
                  <ReviewRow label="Preferred" value={CONTACT_METHODS.find((c) => c.value === form.preferredContact)?.label} />
                </ReviewSection>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="btn-ghost flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < REPORT_STEPS.length ? (
              <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-1.5">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="card">
      <button type="button" onClick={onEdit} className="flex items-center justify-between w-full mb-3">
        <h3 className="font-semibold text-text text-sm">{title}</h3>
        <span className="text-xs text-primary hover:text-primary-hover">Edit</span>
      </button>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <span className="text-xs text-text-muted w-24 flex-shrink-0">{label}</span>
      <span className="text-sm text-text-secondary">{value}</span>
    </div>
  );
}
