import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateEventDescription, generateEventImage } from '../../services/geminiService';
import { EventStatus } from '../../types';
import { Loader2, Wand2, Image as ImageIcon, Upload, FileText, CheckCircle } from 'lucide-react';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent, halls } = useData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: 100,
    imageUrl: '',
    hodLetterUrl: '',
    principalLetterUrl: ''
  });

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");

  // Helper to handle file uploads and convert to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'hodLetterUrl' | 'principalLetterUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation for digital docs
    if (!formData.hodLetterUrl || !formData.principalLetterUrl) {
        alert("Digital approval requires both HOD and Principal permission letters to be uploaded.");
        return;
    }

    addEvent({
      id: Date.now().toString(),
      ...formData,
      clubName: user.name,
      clubId: user.id,
      registeredCount: 0,
      status: EventStatus.PENDING
    });
    
    navigate('/club');
  };

  const handleAISuggestDescription = async () => {
    if (!formData.title || !formData.category) {
        alert("Please enter a Title and Category first.");
        return;
    }
    setIsGeneratingDesc(true);
    const desc = await generateEventDescription(formData.title, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingDesc(false);
  };

  const handleAIGenerateImage = async () => {
      if (!formData.title) {
          alert("Please enter a title to guide the image generation.");
          return;
      }
      setIsGeneratingImg(true);
      try {
          const prompt = `A professional event poster for a college event titled "${formData.title}". Category: ${formData.category}. High quality, vibrant.`;
          const base64Img = await generateEventImage(prompt, aspectRatio);
          setFormData(prev => ({ ...prev, imageUrl: base64Img }));
      } catch (e) {
          alert("Failed to generate image.");
      }
      setIsGeneratingImg(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="border-b border-gray-100 pb-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
            <p className="text-gray-500 mt-1">Submit event details and digital approval documents for Admin review.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Event Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Annual Tech Symposium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Cultural">Cultural & Arts</option>
                        <option value="Sports">Sports</option>
                        <option value="Social Service">Social Service / NSS</option>
                        <option value="Entrepreneurship">Entrepreneurship / Business</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendance</label>
                    <input
                    required
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                    required
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue (Hall Booking Request)</label>
                    <select
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select Venue</option>
                        {halls.map(hall => (
                            <option key={hall.id} value={hall.name}>{hall.name} (Capacity: {hall.capacity})</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button 
                            type="button"
                            onClick={handleAISuggestDescription}
                            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                            disabled={isGeneratingDesc}
                        >
                            {isGeneratingDesc ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                            Auto-Write with AI
                        </button>
                    </div>
                    <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Describe your event..."
                    />
                </div>
            </div>
          </div>

          {/* Section 2: Visuals */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Event Poster
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    {formData.imageUrl && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-4">
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                            <button 
                                type="button" 
                                onClick={() => setFormData(p => ({...p, imageUrl: ''}))}
                                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                         {/* Option A: Upload */}
                        <div className="flex-1">
                             <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto text-gray-400" size={20} />
                                    <p className="text-xs text-gray-500 font-medium">Upload Poster</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                            </label>
                        </div>

                        {/* Option B: Generate */}
                        <div className="flex-1 flex gap-2">
                             <select 
                                value={aspectRatio} 
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-24 px-2 border border-gray-200 rounded-lg text-xs"
                            >
                                <option value="16:9">16:9</option>
                                <option value="1:1">1:1</option>
                                <option value="9:16">9:16</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleAIGenerateImage}
                                disabled={isGeneratingImg}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium text-xs hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                                {isGeneratingImg ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                                Generate AI Poster
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Section 3: Digital Approvals */}
          <div className="pt-6 border-t border-gray-100">
             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Digital Approval Documents
            </h3>
            <p className="text-sm text-gray-500 mb-6">Please upload the digitally signed permission letters. Admin will verify these before approval.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HOD Letter */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="text-indigo-600" size={24} />
                        <div>
                            <h4 className="font-semibold text-gray-900">HOD Permission</h4>
                            <p className="text-xs text-gray-500">Department Head Letter</p>
                        </div>
                        {formData.hodLetterUrl && <CheckCircle className="text-green-500 ml-auto" size={20} />}
                    </div>
                    
                    {formData.hodLetterUrl ? (
                         <div className="flex gap-2">
                             <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">File Attached</span>
                             <button type="button" onClick={() => setFormData(p => ({...p, hodLetterUrl: ''}))} className="text-xs text-red-500 hover:underline">Remove</button>
                         </div>
                    ) : (
                        <label className="block w-full text-center py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-all">
                            Click to Upload
                            <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload(e, 'hodLetterUrl')} />
                        </label>
                    )}
                </div>

                {/* Principal Letter */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="text-purple-600" size={24} />
                        <div>
                            <h4 className="font-semibold text-gray-900">Principal Permission</h4>
                            <p className="text-xs text-gray-500">Principal / Director Letter</p>
                        </div>
                         {formData.principalLetterUrl && <CheckCircle className="text-green-500 ml-auto" size={20} />}
                    </div>
                     {formData.principalLetterUrl ? (
                         <div className="flex gap-2">
                             <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">File Attached</span>
                             <button type="button" onClick={() => setFormData(p => ({...p, principalLetterUrl: ''}))} className="text-xs text-red-500 hover:underline">Remove</button>
                         </div>
                    ) : (
                        <label className="block w-full text-center py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-all">
                            Click to Upload
                            <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload(e, 'principalLetterUrl')} />
                        </label>
                    )}
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/club')}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Submit for Admin Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;