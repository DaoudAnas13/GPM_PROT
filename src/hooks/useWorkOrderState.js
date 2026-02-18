import { useState, useEffect } from 'react';
import { missions } from '../data/mockData';

export default function useWorkOrderState(id) {
  const [stage, setStage] = useState(1); // 1 = Brouillon, 2 = Soumis, 3 = Validé
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    // Client Info (ClientInfoCard)
    client: null,
    clientId: '',
    raisonSociale: '',
    direction: '',
    demandeur: '',
    responsableSite: '',
    matriculeFiscal: '',
    email: '',
    telephone: '',
    adresse: '',

    // Global Info (GlobalInfoCard)
    projet: null,
    projetId: '',
    ville: '',
    zone: '',
    voiture: '',
    motif: '',
    dateDebut: '',
    dateFin: '',
    isNuit: false,
    isHebergement: false,

    // Intervenants (IntervenantsCard)
    responsable: null,
    coordinateur: null,
    membres: [],
    valideur: null,

    // Articles (ArticlesSection)
    articles: [],

    // Attachments
    attachments: [],

    // Decision (DecisionsSection)
    decision: null // 'EXECUTION' | 'ANNULATION'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      // Load existing mission
      const mission = missions.find(m => m.id === id);
      if (mission) {
        // Map mock data to form structure (simplified for demo)
        setFormData(prev => ({
          ...prev,
          id: mission.id,
          clientId: mission.client, // This should ideally be an ID lookup
          raisonSociale: mission.client,
          projetId: 'PRJ-01', // Mock default
          ville: mission.ville,
          zone: mission.zone,
          voiture: mission.voiture,
          motif: mission.motif,
          dateDebut: mission.dateDebut,
          dateFin: mission.dateFin,
          // Set stage based on status
          stage: mission.status === 'Terminé' ? 3 : (mission.status === 'En Cours' ? 2 : 1)
        }));
        if (mission.status !== 'En Attente') {
            setStage(2);
        }
      }
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, [id]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const submitForm = () => {
    setStage(2);
    // Here you would typically save to API
  };

  const setDecision = (decision) => {
    updateField('decision', decision);
  };

  const addArticle = (article) => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { ...article, quantity: 1, _id: Date.now() }]
    }));
  };

  const removeArticle = (articleId) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a._id !== articleId)
    }));
  };

  const updateArticleQuantity = (articleId, qty) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.map(a => a._id === articleId ? { ...a, quantity: parseInt(qty) || 0 } : a)
    }));
  };

  return {
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
  };
}
