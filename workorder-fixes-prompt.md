# WORK ORDER INTERFACE — TARGETED FIXES
## Apply these changes to the existing WorkOrder React implementation

---

## FIX 1 — INPUT FIELD PADDING (All Forms)

Every `<input>`, `<select>`, and lookup trigger button that acts as a field across
`ClientInfoCard`, `GlobalInfoCard`, and `IntervenantsCard` must have consistent
internal padding applied.

**Rule:** Apply `px-3 py-2.5` to every input and lookup trigger.  
**For lookup trigger buttons** (the ones that open a modal), style them like inputs:

```jsx
// Lookup trigger button — looks like an input, opens a modal on click
<button
  onClick={() => setModalOpen(true)}
  className="
    w-full px-3 py-2.5 text-left text-sm
    border border-[#E2E8F0] rounded-lg bg-white
    text-[#1E293B] hover:border-[#2563EB]
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
    transition-colors flex items-center justify-between
  "
>
  <span className={selectedValue ? 'text-[#1E293B]' : 'text-[#94A3B8]'}>
    {selectedValue || 'Sélectionner...'}
  </span>
  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
</button>
```

Apply this same button pattern to ALL lookup fields:
`Projet`, `Ville`, `Zone`, `Voiture` (plain text input, not a modal), `Motif`,
`Responsable Mission`, `Coordinateur`, `Membres`, `Valideur`.

Also add `px-3 py-2.5` to all plain text/date inputs in the form:
```jsx
className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg
           focus:outline-none focus:border-[#2563EB] focus:ring-1
           focus:ring-[#2563EB] transition-colors"
```

---

## FIX 2 — LOOKUP MODALS FOR: Projet, Ville, Zone, Voiture, Motif

Each of these fields must open a `LookupModal` pre-populated with predefined values
from `mockData.js`. Add the following datasets to `mockData.js`:

```js
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
```

**Modal columns for each:**

| Field   | Modal Title        | Columns shown in modal                          |
|---------|--------------------|-------------------------------------------------|
| Projet  | Sélectionner Projet | Code · Nom · Statut                            |
| Ville   | Sélectionner Ville  | Nom                                            |
| Zone    | Sélectionner Zone   | Nom · (Ville liée)                             |
| Voiture | Sélectionner Voiture| Immatriculation · Modèle · Statut              |
| Motif   | Sélectionner Motif  | Libellé                                        |

Each modal uses the existing `LookupModal` component with per-column filter inputs
(additive). Single-click a row to select and close. The selected value label
updates in the trigger button.

---

## FIX 3 — PROJECT → CLIENT AUTO-FILL CASCADE

When the user selects a project from the Projet modal, look up its `clientId`
in the `clients` array and automatically populate all fields in `ClientInfoCard`.

**Implementation in `WorkOrder.jsx` (or `GlobalInfoCard.jsx`):**

```js
// In the onSelect handler of the Projet LookupModal:
const handleProjetSelect = (projet) => {
  setFormData(prev => ({ ...prev, projet }));

  // Find the linked client
  const linkedClient = clients.find(c => c.id === projet.clientId);
  if (linkedClient) {
    setFormData(prev => ({
      ...prev,
      projet,
      client:          linkedClient,
      raisonSociale:   linkedClient.raisonSociale,
      direction:       linkedClient.direction,
      demandeur:       linkedClient.demandeur,
      responsableSite: linkedClient.responsableSite,
      matriculeFiscal: linkedClient.matriculeFiscal,
      email:           linkedClient.email,
      telephone:       linkedClient.telephone,
      adresse:         linkedClient.adresse,
    }));
    setAutoFilled(true); // triggers green left-border visual cue
  }
};
```

**Visual cue for auto-filled fields:**

Fields that were populated via auto-fill (not typed by the user) must show a
`3px green left border` and a brief flash animation:

```jsx
// On the input wrapper div:
<div className={`relative ${isAutoFilled ? 'border-l-[3px] border-l-[#10B981]' : ''}`}>
  <input ... />
</div>
```

Also flash the background on fill using a CSS keyframe:
```css
@keyframes autofill-flash {
  0%   { background-color: #F0FDF4; }
  100% { background-color: #FFFFFF; }
}
.autofill-flash {
  animation: autofill-flash 0.8s ease-out forwards;
}
```
Add `autofill-flash` class to each auto-filled input when `autoFilled` becomes `true`.

---

## FIX 4 — INTERVENANTS: ALL 4 FIELDS VIA MODAL

`Responsable Mission`, `Coordinateur`, `Membres`, and `Valideur` must each
open a modal populated from the `intervenants` array in `mockData.js`.

```js
export const intervenants = [
  { id: 'INT-01', nom: 'Mehdi Belhaj',   role: 'Responsable',  avatar: 'MB', departement: 'Terrain'    },
  { id: 'INT-02', nom: 'Sarra Kamoun',   role: 'Membre',       avatar: 'SK', departement: 'Technique'  },
  { id: 'INT-03', nom: 'Amine Tounsi',   role: 'Coordinateur', avatar: 'AT', departement: 'Logistique' },
  { id: 'INT-04', nom: 'Lina Mansour',   role: 'Valideur',     avatar: 'LM', departement: 'Management' },
  { id: 'INT-05', nom: 'Karim Saidi',    role: 'Membre',       avatar: 'KS', departement: 'Technique'  },
  { id: 'INT-06', nom: 'Nour Ben Salem', role: 'Membre',       avatar: 'NB', departement: 'Terrain'    },
  { id: 'INT-07', nom: 'Rania Zouari',   role: 'Responsable',  avatar: 'RZ', departement: 'Management' },
];
```

**Modal columns:** `Nom · Rôle · Département` — with per-column filter inputs.

**Per-field behavior:**

| Field               | Selection Mode | Display after selection                  |
|---------------------|----------------|------------------------------------------|
| Responsable Mission | Single         | Avatar circle + full name                |
| Coordinateur        | Single         | Avatar circle + full name                |
| Membres             | Multi-select   | Row of avatar+name tags (see Fix 4b)     |
| Valideur            | Single         | Avatar circle + full name                |

**Single select display:**
```jsx
{selectedPerson ? (
  <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs
                    font-semibold flex items-center justify-center flex-shrink-0">
      {selectedPerson.avatar}
    </div>
    <span className="text-sm text-[#1E293B] font-medium">{selectedPerson.nom}</span>
    <button onClick={clearSelection} className="ml-auto text-[#94A3B8] hover:text-[#EF4444]">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
) : (
  <LookupTriggerButton onClick={() => setModalOpen(true)} placeholder="Sélectionner..." />
)}
```

---

## FIX 4b — MEMBRES: MULTI-SELECT WITH TAGS

`Membres` uses the `LookupModal` in multi-select mode. The modal has checkboxes
on each row instead of single-click-to-close. A footer shows `"N sélectionnés"`
and a `[Confirmer]` solid blue button.

**Display after confirmation — tag row:**
```jsx
<div className="flex flex-wrap gap-2 min-h-[42px] px-2 py-1.5
                border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
  {membres.map(m => (
    <span key={m.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1
                     bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-medium">
      {/* Avatar circle */}
      <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px]
                       font-bold flex items-center justify-center">{m.avatar}</span>
      {m.nom}
      {/* Remove tag */}
      <button onClick={() => removeMembre(m.id)}
              className="text-[#93C5FD] hover:text-[#2563EB] ml-0.5">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  ))}
  {/* Add more button if at least 1 is selected */}
  {membres.length > 0 && (
    <button onClick={() => setMembresModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs
                       text-[#2563EB] hover:bg-[#EFF6FF] rounded-full transition-colors">
      <Plus className="w-3 h-3" /> Ajouter
    </button>
  )}
  {membres.length === 0 && (
    <button onClick={() => setMembresModalOpen(true)}
            className="text-sm text-[#94A3B8] px-1">
      Sélectionner des membres...
    </button>
  )}
</div>
```

---

## FIX 5 — ARTICLES: CLEAR SELECTION STATE, ONE PER ROW

### 5a — Modal selection behavior

When the article selection modal is open, each row must show a clear selected /
unselected state. Do NOT use checkboxes — use a full-row highlight instead:

```jsx
// In the articles LookupModal tbody rows:
<tr
  key={article.id}
  onClick={() => toggleArticle(article)}
  className={`
    h-12 cursor-pointer transition-all border-b border-[#E2E8F0]
    ${isSelected(article.id)
      ? 'bg-[#EFF6FF] border-l-4 border-l-[#2563EB]'
      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
    }
  `}
>
  {/* Leftmost cell: checkmark icon when selected, empty when not */}
  <td className="pl-4 pr-2 w-8">
    {isSelected(article.id)
      ? <Check className="w-4 h-4 text-[#2563EB]" />
      : <span className="w-4 h-4 block" />
    }
  </td>
  <td className="px-3 text-sm text-[#64748B] font-mono">{article.code}</td>
  <td className="px-3 text-sm text-[#1E293B]">{article.designation}</td>
  <td className="px-3 text-sm text-[#64748B]">{article.unite}</td>
</tr>
```

A footer bar at the bottom of the modal shows:
```jsx
<div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
  <span className="text-sm text-[#64748B]">
    {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''} sélectionné{selectedArticles.length !== 1 ? 's' : ''}
  </span>
  <button onClick={confirmSelection}
          disabled={selectedArticles.length === 0}
          className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold
                     rounded-lg disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-[#1D4ED8] transition-colors">
    Confirmer
  </button>
</div>
```

### 5b — Articles table: one row per article, clear layout

Each confirmed article appears as its own row in the `ArticlesSection` table.
No grouping, no collapsing. Each row is fully distinct:

```jsx
<tbody>
  {articleRows.map((row, index) => (
    <tr key={row.id}
        className="h-14 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors group">
      {/* Index number */}
      <td className="pl-6 pr-3 w-10 text-sm text-[#94A3B8] font-medium">
        {index + 1}
      </td>
      {/* Code */}
      <td className="px-3 text-sm text-[#64748B] font-mono w-28">
        {row.code}
      </td>
      {/* Désignation */}
      <td className="px-3 text-sm text-[#1E293B] font-medium">
        {row.designation}
      </td>
      {/* Unité */}
      <td className="px-3 text-sm text-[#64748B] w-24">
        {row.unite}
      </td>
      {/* Quantité — inline editable */}
      <td className="px-3 w-28">
        <input
          type="number"
          min={1}
          value={row.quantite}
          onChange={e => updateQuantite(row.id, e.target.value)}
          className="w-20 px-3 py-1.5 text-sm border border-[#E2E8F0] rounded-lg
                     text-center focus:outline-none focus:border-[#2563EB]
                     focus:ring-1 focus:ring-[#2563EB]"
        />
      </td>
      {/* Delete */}
      <td className="pr-6 w-12 text-right">
        <button
          onClick={() => removeArticle(row.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity
                     text-[#CBD5E1] hover:text-[#EF4444]">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  ))}
</tbody>
```

**Visual separation:** Add a subtle alternating row background to help distinguish rows:
- Even rows: `bg-white`
- Odd rows: `bg-[#FAFAFA]`
Apply via: `${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`

---

## SUMMARY OF ALL CHANGES

| # | What              | Where                          | What to do                                              |
|---|-------------------|--------------------------------|---------------------------------------------------------|
| 1 | Input padding     | All form fields + triggers     | Add `px-3 py-2.5` everywhere, ChevronDown on triggers  |
| 2 | Lookup modals     | Projet, Ville, Zone, Voiture, Motif | Wire to predefined mockData arrays + LookupModal  |
| 3 | Project cascade   | GlobalInfoCard → ClientInfoCard| Auto-fill client fields + green border + flash anim    |
| 4 | Intervenants      | IntervenantsCard (all 4 fields)| Each field opens its own modal, single-select display  |
| 4b| Membres tags      | IntervenantsCard               | Multi-select modal + blue tag row with remove button   |
| 5 | Articles modal    | ArticlesSection LookupModal    | Row highlight + checkmark icon + selection counter     |
| 5b| Articles table    | ArticlesSection table          | One row per article, alternating bg, inline qty input  |
