// src/pages/WorkOrder.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderActionBar from '../components/workorder/HeaderActionBar';
import ClientInfoCard from '../components/workorder/ClientInfoCard';
import GlobalInfoCard from '../components/workorder/GlobalInfoCard';
import IntervenantsCard from '../components/workorder/IntervenantsCard';
import ArticlesSection from '../components/workorder/ArticlesSection';
import AttachmentsSection from '../components/workorder/AttachmentsSection';
import DecisionsSection from '../components/workorder/DecisionsSection';
import useWorkOrderState from '../hooks/useWorkOrderState';

export default function WorkOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const {
    stage,
    setStage,
    formData,
    updateField,
    updateFields,
    submitForm,
    isLoading,
    addArticle,
    removeArticle,
    updateArticleQuantity,
    setDecision
  } = useWorkOrderState(id || 'new'); // Pass 'new' if no id

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBack = () => navigate('/dashboard');

  const handleSaveDraft = () => {
    showToast('Brouillon enregistré avec succès');
    // In real app, save to backend
  };

  const handleSubmit = () => {
    // Basic validation
    // if (!formData.projetId) {
    //   showToast('Veuillez sélectionner un projet', 'error');
    //   return;
    // }

    submitForm();
    showToast('Mission soumise avec succès');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // WorkOrder Layout logic
  // Stage 1 (Draft): Top sections editable, Articles locked
  // Stage 2 (Submitted): Top sections read-only, Articles editable
  // For prototype, we toggle isReadOnly for top sections based on stage >= 2
  const topSectionsReadOnly = stage >= 2;

  // Decision section usually comes later, so maybe we keep it editable or readonly?
  // Let's keep it editable for demo purposes in all stages or follow logic.
  // Actually if "Soumise", maybe decisions are made then?
  const decisionReadOnly = false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative font-sans">
      <HeaderActionBar
        id={formData.id || 'Nouveau'}
        isNew={isNew}
        stage={stage}
        onBack={handleBack}
        onSave={handleSaveDraft}
        onSubmit={handleSubmit}
        onEdit={() => setStage(1)} // Allow going back to edit for prototype
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientInfoCard
            formData={formData}
            readOnly={topSectionsReadOnly}
            onUpdate={updateField}
          />
          <GlobalInfoCard
            formData={formData}
            readOnly={topSectionsReadOnly}
            onUpdate={updateField}
            onUpdateFields={updateFields}
          />
        </div>

        {/* Row 2: Intervenants */}
        <div className="grid grid-cols-1">
          <IntervenantsCard
            formData={formData}
            readOnly={topSectionsReadOnly}
            onUpdate={updateField}
          />
        </div>

        {/* Row 3: Articles (Locked in Stage 1, Unlocked in Stage 2+) */}
        <div className="grid grid-cols-1">
          <ArticlesSection
            stage={stage}
            articles={formData.articles}
            onAdd={addArticle}
            onRemove={removeArticle}
            onUpdateQuantity={updateArticleQuantity}
          />
        </div>

        {/* Row 4: Attachments & Decision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <AttachmentsSection />
           <DecisionsSection
             decision={formData.decision}
             onChange={setDecision}
             readOnly={decisionReadOnly}
           />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up transition-all duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className={`h-2 w-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
