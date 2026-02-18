export const missions = [
  { id: 'MSN-001', title: 'Audit Réseau Tunis', client: 'TeleCom SA', chef: 'Mehdi B.', status: 'En Cours', ville: 'Tunis', zone: 'Nord', dateDebut: '2025-06-01', dateFin: '2025-06-15', motif: 'Maintenance', voiture: 'TN-2241-A' },
  { id: 'MSN-002', title: 'Installation Fibre Sfax', client: 'BatiGroup', chef: 'Sarra K.', status: 'En Attente', ville: 'Sfax', zone: 'Sud', dateDebut: '2025-06-10', dateFin: '2025-06-20', motif: 'Installation', voiture: 'TN-0091-B' },
  { id: 'MSN-003', title: 'Migration Serveurs Sousse', client: 'DataCore', chef: 'Amine T.', status: 'Terminé', ville: 'Sousse', zone: 'Centre', dateDebut: '2025-05-20', dateFin: '2025-05-30', motif: 'Migration', voiture: 'TN-5512-C' },
  { id: 'MSN-004', title: 'Support VPN Nabeul', client: 'SecureNet', chef: 'Lina M.', status: 'Annulé', ville: 'Nabeul', zone: 'Nord-Est', dateDebut: '2025-06-05', dateFin: '2025-06-08', motif: 'Support', voiture: 'TN-3302-D' },
  { id: 'MSN-005', title: 'Déploiement ERP Ariana', client: 'FinGroup', chef: 'Karim S.', status: 'En Cours', ville: 'Ariana', zone: 'Grand Tunis', dateDebut: '2025-06-12', dateFin: '2025-07-01', motif: 'Déploiement', voiture: 'TN-7761-E' },
];

export const clients = [
  { id: 'CLT-01', raisonSociale: 'TeleCom SA', matriculeFiscal: '1234567A', email: 'contact@telecom.tn', telephone: '+216 71 000 001', adresse: '12 Rue de la Liberté, Tunis', direction: 'DSI', demandeur: 'Ali Hamdi', responsableSite: 'Nour Ben Ali' },
  { id: 'CLT-02', raisonSociale: 'BatiGroup', matriculeFiscal: '7654321B', email: 'info@batigroup.tn', telephone: '+216 74 000 002', adresse: '55 Av. Habib Bourguiba, Sfax', direction: 'DG', demandeur: 'Hajer Trabelsi', responsableSite: 'Fares Miled' },
  { id: 'CLT-03', raisonSociale: 'DataCore', matriculeFiscal: '1122334C', email: 'hello@datacore.tn', telephone: '+216 73 000 003', adresse: '8 Rue Ibn Khaldoun, Sousse', direction: 'IT', demandeur: 'Ramzi Chaker', responsableSite: 'Dorra Slim' },
];

export const articles = [
  { id: 'ART-01', code: 'CBL-001', designation: 'Câble RJ45 Cat6 (100m)', unite: 'Rouleau', prix: 45.00 },
  { id: 'ART-02', code: 'SWT-002', designation: 'Switch 24 ports Gigabit', unite: 'Unité', prix: 320.00 },
  { id: 'ART-03', code: 'RCK-003', designation: 'Rack Serveur 12U', unite: 'Unité', prix: 750.00 },
  { id: 'ART-04', code: 'FBR-004', designation: 'Fibre Optique (500m)', unite: 'Rouleau', prix: 210.00 },
  { id: 'ART-005', code: 'C-005', designation: 'Prise électrique double', unite: 'Pce', stock: 150, prix: 12.00 },
];

export const projets = [
  { id: 'PRJ-01', code: 'PRJ-01', nom: 'Réseau National T1',      clientId: 'CLT-01', statut: 'Actif'     },
  { id: 'PRJ-02', code: 'PRJ-02', nom: 'Expansion Sud 2025',       clientId: 'CLT-02', statut: 'Actif'     },
  { id: 'PRJ-03', code: 'PRJ-03', nom: 'Cloud Migration Phase 2',  clientId: 'CLT-03', statut: 'En Pause'  },
  { id: 'PRJ-04', code: 'PRJ-04', nom: 'Déploiement ERP Ariana',   clientId: 'CLT-01', statut: 'Actif'     },
];

export const villes = [
  { id: 'VIL-01', nom: 'Tunis'   },
  { id: 'VIL-02', nom: 'Sfax'    },
  { id: 'VIL-03', nom: 'Sousse'  },
  { id: 'VIL-04', nom: 'Nabeul'  },
  { id: 'VIL-05', nom: 'Ariana'  },
  { id: 'VIL-06', nom: 'Bizerte' },
  { id: 'VIL-07', nom: 'Gabès'   },
];

export const zones = [
  { id: 'ZON-01', nom: 'Nord',        villeId: 'VIL-01' },
  { id: 'ZON-02', nom: 'Sud',         villeId: 'VIL-02' },
  { id: 'ZON-03', nom: 'Centre',      villeId: 'VIL-03' },
  { id: 'ZON-04', nom: 'Nord-Est',    villeId: 'VIL-04' },
  { id: 'ZON-05', nom: 'Grand Tunis', villeId: 'VIL-05' },
  { id: 'ZON-06', nom: 'Côtier',      villeId: 'VIL-06' },
];

export const motifs = [
  { id: 'MOT-01', libelle: 'Maintenance préventive' },
  { id: 'MOT-02', libelle: 'Installation'           },
  { id: 'MOT-03', libelle: 'Migration'              },
  { id: 'MOT-04', libelle: 'Support technique'      },
  { id: 'MOT-05', libelle: 'Déploiement'            },
  { id: 'MOT-06', libelle: 'Audit'                  },
  { id: 'MOT-07', libelle: 'Formation'              },
];

export const voitures = [
  { id: 'VOI-01', immatriculation: 'TN-2241-A', modele: 'Peugeot 308',  statut: 'Disponible'  },
  { id: 'VOI-02', immatriculation: 'TN-0091-B', modele: 'Renault Clio', statut: 'Disponible'  },
  { id: 'VOI-03', immatriculation: 'TN-5512-C', modele: 'Dacia Duster', statut: 'En Mission'  },
  { id: 'VOI-04', immatriculation: 'TN-3302-D', modele: 'Toyota Hilux', statut: 'Disponible'  },
];

export const intervenants = [
  { id: 'INT-01', nom: 'Mehdi Belhaj',   role: 'Responsable',  avatar: 'MB', departement: 'Terrain'    },
  { id: 'INT-02', nom: 'Sarra Kamoun',   role: 'Membre',       avatar: 'SK', departement: 'Technique'  },
  { id: 'INT-03', nom: 'Amine Tounsi',   role: 'Coordinateur', avatar: 'AT', departement: 'Logistique' },
  { id: 'INT-04', nom: 'Lina Mansour',   role: 'Valideur',     avatar: 'LM', departement: 'Management' },
  { id: 'INT-05', nom: 'Karim Saidi',    role: 'Membre',       avatar: 'KS', departement: 'Technique'  },
  { id: 'INT-06', nom: 'Nour Ben Salem', role: 'Membre',       avatar: 'NB', departement: 'Terrain'    },
  { id: 'INT-07', nom: 'Rania Zouari',   role: 'Responsable',  avatar: 'RZ', departement: 'Management' },
];

export const statusConfig = {
  'En Cours':   { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  'En Attente': { bg: 'bg-amber-100',  text: 'text-amber-700' },
  'Terminé':    { bg: 'bg-green-100',  text: 'text-green-700' },
  'Annulé':     { bg: 'bg-red-100',    text: 'text-red-700'   },
};
