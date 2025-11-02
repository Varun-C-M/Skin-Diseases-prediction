import React, { useState, useEffect } from 'react';
import { Upload, User, Stethoscope, AlertCircle, CheckCircle, Loader, X, Mail } from 'lucide-react';

// Environment configuration
const API_BASE_URL = 'http://localhost:8000';
const MOCK_MODE = new URLSearchParams(window.location.search).get('mock') === 'true' || true;

// Mock data for development
const MOCK_PREDICTIONS = [
  {
    id: '1',
    disease: 'Melanoma',
    confidence: 92.5,
    causes: ['Excessive UV exposure', 'Genetic factors', 'Multiple moles'],
    treatment: 'Immediate consultation with dermatologist required. Surgical excision may be necessary. Regular monitoring essential.',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+',
    date: new Date().toISOString(),
    patientName: 'John Doe'
  },
  {
    id: '2',
    disease: 'Eczema',
    confidence: 87.3,
    causes: ['Allergic reaction', 'Dry skin', 'Environmental irritants'],
    treatment: 'Apply moisturizing cream regularly. Use prescribed topical corticosteroids. Avoid known allergens and irritants.',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+',
    date: new Date(Date.now() - 86400000).toISOString(),
    patientName: 'Jane Smith'
  }
];

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [doctorAuth, setDoctorAuth] = useState({ email: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  const handleRoleSelection = (role) => {
    setUserRole(role);
    if (role === 'doctor') {
      setCurrentView('doctor-login');
    } else {
      setCurrentView('patient-form');
    }
  };

  const handleDoctorLogin = (isDemoMode = false) => {
    if (isDemoMode || (doctorAuth.email && doctorAuth.password)) {
      setIsAuthenticated(true);
      setDoctorId(isDemoMode ? 'demo-doctor-123' : doctorAuth.email);
      setCurrentView('doctor-dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDoctorId(null);
    setUserRole(null);
    setCurrentView('landing');
    setDoctorAuth({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {currentView === 'landing' && <LandingView onRoleSelect={handleRoleSelection} />}
      {currentView === 'doctor-login' && (
        <DoctorLogin
          auth={doctorAuth}
          setAuth={setDoctorAuth}
          onLogin={handleDoctorLogin}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'doctor-dashboard' && (
        <DoctorDashboard doctorId={doctorId} onLogout={handleLogout} />
      )}
      {currentView === 'patient-form' && (
        <PatientForm onBack={() => setCurrentView('landing')} />
      )}
    </div>
  );
};

const LandingView = ({ onRoleSelect }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skin Disease Detection
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered diagnostic assistance for skin conditions
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Who are you?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onRoleSelect('doctor')}
            className="group flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Stethoscope className="w-16 h-16 mb-4" />
            <span className="text-2xl font-bold">Doctor</span>
            <span className="text-sm mt-2 opacity-90">Professional diagnosis tools</span>
          </button>

          <button
            onClick={() => onRoleSelect('patient')}
            className="group flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <User className="w-16 h-16 mb-4" />
            <span className="text-2xl font-bold">Patient / Normal User</span>
            <span className="text-sm mt-2 opacity-90">Get instant results</span>
          </button>
        </div>

        {MOCK_MODE && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Mock Mode Active</strong> - Using simulated predictions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DoctorLogin = ({ auth, setAuth, onLogin, onBack }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Doctor Login
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(false); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="doctor@hospital.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={() => onLogin(true)}
            className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
          >
            Continue as Demo Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = ({ doctorId, onLogout }) => {
  const [predictions, setPredictions] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (MOCK_MODE) {
      setPredictions(MOCK_PREDICTIONS);
    } else {
      fetchPredictions();
    }
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions?doctor_id=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
      }
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    }
  };

  const handlePredict = async (imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentPrediction(MOCK_PREDICTIONS[0]);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('doctor_id', doctorId);

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setCurrentPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrediction = async () => {
    if (!currentPrediction) return;

    try {
      if (MOCK_MODE) {
        setPredictions([currentPrediction, ...predictions]);
        alert('Prediction saved successfully!');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/save_prediction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          prediction: currentPrediction
        })
      });

      if (response.ok) {
        fetchPredictions();
        alert('Prediction saved successfully!');
      }
    } catch (err) {
      alert('Failed to save prediction');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>

          <ImageUploadZone onPredict={handlePredict} isLoading={isLoading} />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {currentPrediction && (
            <PredictionCard
              prediction={currentPrediction}
              onSave={handleSavePrediction}
              showSaveButton={true}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Predictions</h2>
          <PredictionTable predictions={predictions} />
        </div>
      </div>
    </div>
  );
};

const PatientForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    contact: '',
    symptoms: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) errors.age = 'Valid age is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!imageFile) errors.image = 'Please upload an image';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPrediction({
          ...MOCK_PREDICTIONS[0],
          patientName: formData.fullName
        });
        setIsLoading(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append('image', imageFile);
      formPayload.append('patient_data', JSON.stringify(formData));

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formPayload
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSpecialist = () => {
    window.location.href = 'mailto:specialist@hospital.com?subject=Skin Disease Consultation';
  };

  if (prediction) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setPrediction(null)}
            className="text-gray-600 hover:text-gray-900 mb-6 flex items-center"
          >
            ← New Consultation
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Results</h2>
            <PredictionCard prediction={prediction} showSaveButton={false} />

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <button
                onClick={() => alert('Result saved to your records')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Save This Result
              </button>
              <button
                onClick={handleContactSpecialist}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Specialist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Patient Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {validationErrors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    validationErrors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="30"
                  min="1"
                  max="120"
                />
                {validationErrors.age && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.age}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact (Optional)
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="phone or email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms Description
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="4"
                placeholder="Describe your symptoms, when they started, and any relevant details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Skin Image *
              </label>
              <FileUpload onFileSelect={setImageFile} />
              {validationErrors.image && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.image}</p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get My Result'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ImageUploadZone = ({ onPredict, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handlePredict = () => {
    if (selectedFile) {
      onPredict(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg" />
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
        )}
        
        <input
          type="file"
          onChange={handleChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {selectedFile && (
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            'Predict Disease'
          )}
        </button>
      )}
    </div>
  );
};

const FileUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
        ) : (
          <div className="py-8">
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Click to upload image</p>
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={handleChange}
        accept="image/*"
        className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </div>
  );
};

const PredictionCard = ({ prediction, onSave, showSaveButton }) => {
  return (
    <div className="mt-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {prediction.disease}
          </h3>
          <div className="flex items-center">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              Confidence: {prediction.confidence.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Possible Causes:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {prediction.causes.map((cause, idx) => (
              <li key={idx}>{cause}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Recommended Treatment:</h4>
          <p className="text-gray-700 leading-relaxed">{prediction.treatment}</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">
            Note: This is an AI-assisted diagnosis. Please consult with a healthcare professional for proper medical advice.
          </p>
        </div>

        {showSaveButton && onSave && (
          <button
            onClick={onSave}
            className="w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Save to Records
          </button>
        )}
      </div>
    </div>
  );
};

const PredictionTable = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No predictions yet. Upload an image to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Patient</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Disease</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Confidence</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {predictions.map((pred) => (
            <tr key={pred.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <img
                  src={pred.image}
                  alt="Prediction"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {pred.patientName || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {pred.disease}
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {pred.confidence.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(pred.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;