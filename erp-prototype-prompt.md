# COMPREHENSIVE REACT PROTOTYPE SPEC
## ERP Dashboard + Work Order (Mission) Revamp
### Stack: React + Tailwind CSS | Two-Screen Prototype

---

## 0. PROJECT OVERVIEW

Build a **two-screen React prototype** for an enterprise ERP system:

1. **Screen 1 — ERP Dashboard** (`/dashboard`): The main control center showing active missions in data panels. Clicking a row navigates to Screen 2.
2. **Screen 2 — Work Order Form** (`/mission/:id`): A detailed, smart form to create or view a work order (mission).

Navigation: The Dashboard is the entry point. Clicking any mission row (or the "Nouveau Document" button) pushes the user to the Work Order screen. A back button on Screen 2 returns to the Dashboard.

---

## 1. FILE & FOLDER STRUCTURE

```
src/
├── App.jsx                  # Router setup (React Router v6)
├── main.jsx
├── index.css                # Tailwind base + CSS variables
├── data/
│   └── mockData.js          # All dummy data (missions, clients, users, articles)
├── components/
│   ├── ui/
│   │   ├── Badge.jsx        # Status badge (pill shape)
│   │   ├── Button.jsx       # Solid, outline, ghost variants
│   │   ├── Card.jsx         # White card with shadow
│   │   ├── Modal.jsx        # Reusable modal shell
│   │   ├── DataTable.jsx    # Table with per-column filter row
│   │   └── Toggle.jsx       # Modern switch toggle
│   ├── dashboard/
│   │   ├── Navbar.jsx
│   │   ├── ActionBar.jsx
│   │   ├── MissionCard.jsx  # One of the 4 data panel cards
│   │   └── Pagination.jsx
│   └── workorder/
│       ├── HeaderActionBar.jsx
│       ├── ClientInfoCard.jsx
│       ├── GlobalInfoCard.jsx
│       ├── IntervenantsCard.jsx
│       ├── ArticlesSection.jsx
│       ├── AttachmentsSection.jsx
│       └── LookupModal.jsx  # Reusable modal for all lookup fields
├── pages/
│   ├── Dashboard.jsx
│   └── WorkOrder.jsx
└── hooks/
    └── useWorkOrderState.js # Stage 1/2/3 state machine logic
```

---

## 2. DESIGN SYSTEM (Tailwind + CSS Variables)

Define these in `index.css` under `:root`. Use them everywhere via Tailwind's arbitrary value syntax or a `theme.extend` config:

```css
:root {
  --bg-primary: #F8FAFC;
  --bg-card: #FFFFFF;
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-success: #10B981;
  --color-border: #E2E8F0;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --shadow-soft: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
  --radius: 12px;
}
```

**Typography:** Use `DM Sans` (Google Fonts). Clean, professional, slightly warmer than Inter.
- Labels: 12px, font-semibold, `text-secondary`
- Body/Inputs: 14px, font-normal, `text-primary`
- Card titles: 16–18px, font-semibold, `text-primary`
- Nav links: 14px, font-medium

---

## 3. MOCK DATA (`src/data/mockData.js`)

```js
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

export const projets = [
  { id: 'PRJ-01', nom: 'Réseau National T1', clientId: 'CLT-01', statut: 'Actif' },
  { id: 'PRJ-02', nom: 'Expansion Sud 2025', clientId: 'CLT-02', statut: 'Actif' },
  { id: 'PRJ-03', nom: 'Cloud Migration Phase 2', clientId: 'CLT-03', statut: 'En Pause' },
];

export const intervenants = [
  { id: 'INT-01', nom: 'Mehdi Belhaj', role: 'Responsable', avatar: 'MB' },
  { id: 'INT-02', nom: 'Sarra Kamoun', role: 'Membre', avatar: 'SK' },
  { id: 'INT-03', nom: 'Amine Tounsi', role: 'Coordinateur', avatar: 'AT' },
  { id: 'INT-04', nom: 'Lina Mansour', role: 'Valideur', avatar: 'LM' },
];

export const articles = [
  { id: 'ART-01', code: 'CBL-001', designation: 'Câble RJ45 Cat6 (100m)', unite: 'Rouleau', prix: 45.00 },
  { id: 'ART-02', code: 'SWT-002', designation: 'Switch 24 ports Gigabit', unite: 'Unité', prix: 320.00 },
  { id: 'ART-03', code: 'RCK-003', designation: 'Rack Serveur 12U', unite: 'Unité', prix: 750.00 },
  { id: 'ART-04', code: 'FBR-004', designation: 'Fibre Optique (500m)', unite: 'Rouleau', prix: 210.00 },
];

export const statusConfig = {
  'En Cours':   { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  'En Attente': { bg: 'bg-amber-100',  text: 'text-amber-700' },
  'Terminé':    { bg: 'bg-green-100',  text: 'text-green-700' },
  'Annulé':     { bg: 'bg-red-100',    text: 'text-red-700'   },
};
```

---

## 4. SCREEN 1 — ERP DASHBOARD (`Dashboard.jsx`)

### 4.1 Layout

```
[Navbar — sticky top]
[ActionBar — below navbar]
[Main grid: 2x2 → 4 MissionCards]
```

- Page background: `bg-[#F8FAFC]`
- Main container: `max-w-[1440px] mx-auto px-8 py-6`
- Card grid: `grid grid-cols-2 gap-6`

### 4.2 Navbar

- White background (`bg-white`), bottom border (`border-b border-[#E2E8F0]`), `shadow-sm`, sticky top.
- **Left:** Logo text "ERP Pro" in `text-[#2563EB] font-bold text-xl`.
- **Center:** Horizontal nav links: `Accueil | Missions | Clients | Rapports | Statistiques`
  - Inactive: `text-[#64748B] font-medium hover:text-[#2563EB] transition-colors`
  - Active: `text-[#2563EB] font-semibold border-b-2 border-[#2563EB]`
- **Right:** Avatar circle with initials "AD" + "Bienvenue, Admin" text + "Déconnexion" ghost button.

### 4.3 Action Bar

- White card below navbar, `px-6 py-3`, `border-b border-[#E2E8F0]`.
- **Left buttons:**
  - "Nouveau Document" → solid blue button → navigates to `/mission/new`
  - "Rapport" → outline button
  - "Statistique" → ghost button
- **Right:** Pill search input (`rounded-full border border-[#E2E8F0] bg-white px-4 py-2`) with a search icon on the left inside the input.

### 4.4 Mission Cards (×4)

Each card shows a different slice of data:
1. **Missions en Cours** — filter `missions` where `status === 'En Cours'`
2. **Missions par Chef** — group by `chef` field, show count per chef
3. **Missions Récentes** — last 3 by `dateDebut`
4. **Missions par Statut** — show all 4 statuses with count badges

**Card structure:**

```jsx
<Card>
  <CardHeader title="Missions en Cours" count={n} />
  <Table>
    <Thead> {/* Uppercase, 12px, text-secondary, font-bold */} </Thead>
    <Tbody>
      {/* Each row: height 3.5rem, border-bottom, hover:bg-gray-50 */}
      {/* Status column: <Badge /> component */}
      {/* Row is clickable → navigate to /mission/:id */}
    </Tbody>
  </Table>
  <Pagination /> {/* Bottom right: "1–5 of 10" + chevron buttons */}
</Card>
```

**Badge component:** Pill shape, uses `statusConfig` for colors. Example: `<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">En Cours</span>`

**Table rules:**
- No vertical borders, no outer borders.
- `thead th`: uppercase, `text-[10px] tracking-wider text-[#64748B] font-bold pb-2`
- `tbody tr`: `h-14 border-b border-[#E2E8F0] hover:bg-gray-50 cursor-pointer transition-colors`
- Last row has no border-bottom.

**Pagination:** `"Affichage 1–5 sur 10"` text + `<ChevronLeft />` `<ChevronRight />` icon buttons (from `lucide-react`).

---

## 5. SCREEN 2 — WORK ORDER FORM (`WorkOrder.jsx`)

### 5.1 State Machine (`useWorkOrderState.js`)

```js
// Stage 1: Draft — all sections editable except Articles (locked)
// Stage 2: Post-Submit — top sections become read-only; Articles unlocked
// Stage 3: Not a separate stage; Articles are just editable once Stage 2 is reached

const [stage, setStage] = useState(1); // 1 | 2
const [formData, setFormData] = useState({ client: null, projet: null, ... });
const submit = () => setStage(2);
```

### 5.2 Sticky Header Action Bar

- White bar, sticky top, `border-b border-[#E2E8F0] shadow-sm`.
- **Left:** Back arrow icon + "Mission / Nouveau" breadcrumb.
- **Right (Stage 1):** `[Annuler]` ghost · `[Enregistrer Brouillon]` outline · `[Soumettre]` solid blue.
- **Right (Stage 2):** Replace "Soumettre" with `[Modifier]` outline button.

### 5.3 Page Layout

```
[Sticky HeaderActionBar]
[max-w-[1440px] mx-auto px-8 py-6 bg-[#F8FAFC]]
  [Row 1: ClientInfoCard (col-span-7) | GlobalInfoCard (col-span-5)]
  [Row 2: IntervenantsCard (full width)]
  [Row 3: ArticlesSection (full width)]
  [Row 4: AttachmentsSection (col-span-6) | DecisionsSection (col-span-6)]
```

Use `grid grid-cols-12 gap-6`.

### 5.4 ClientInfoCard

- White card, `rounded-[12px] shadow-[var(--shadow-soft)] p-6`.
- Title: "Information Client" — `text-base font-semibold text-[#1E293B] mb-4`.
- A "Sélectionner Client" lookup button at the top of the card triggers a LookupModal.
- **Stage 1:** Fields are shown as labeled inputs in a 3-column grid:
  - `Raison Sociale`, `Direction`, `Demandeur`, `Responsable Site`, `Matricule Fiscal`, `Email`, `Téléphone`, `Adresse`
- **Auto-fill cue:** When a project is selected (from GlobalInfoCard), fields populated automatically show a `border-l-[3px] border-l-[#10B981]` green left border on the input.
- **Stage 2:** Inputs flatten to read-only text (`<p>` tags with label above, no border/background).

### 5.5 GlobalInfoCard

- Title: "Information Globale".
- **Master field:** `Projet` (lookup button → LookupModal). Selecting a project auto-fills ClientInfoCard.
- **2-column grid:** `Ville` (lookup), `Zone` (lookup), `Voiture` (text input), `Motif` (lookup).
- **Date pickers:** `Date Début` and `Date Fin` — use `<input type="datetime-local" />` styled to match the design system.
- **Toggles:** Two rows with label + `<Toggle />` switch:
  - "Mission de Nuit"
  - "Avec Hébergement"
- **Stage 2:** All fields become read-only.

### 5.6 IntervenantsCard

- Title: "Intervenants".
- 4 fields in a 2-column grid:
  - `Responsable Mission` (lookup → single select)
  - `Coordinateur` (lookup → single select)
  - `Membres` (lookup → multi-select, displayed as avatar+name tags)
  - `Valideur` (lookup → single select)
- Once selected, show: colored circle with initials + full name next to the field label.
- **Stage 2:** Read-only.

### 5.7 ArticlesSection

- **Stage 1:** Full card is rendered but overlaid with a semi-transparent mask + centered message: "Soumettez le formulaire pour ajouter des articles." (lock icon + text).
- **Stage 2:** Overlay removed. `+ Ajouter Article` button (outline blue) appears top-right of the card.
- **Table columns:** `Code` | `Désignation` | `Unité` | `Quantité` | `(delete icon)`
- Each row added via LookupModal. Quantity is inline-editable (`<input type="number" />`).
- Delete: `<Trash2 />` icon from lucide-react, `text-red-400 hover:text-red-600`.

### 5.8 AttachmentsSection

- Drag & Drop zone: dashed border `border-2 border-dashed border-[#E2E8F0] rounded-[12px] p-8 text-center`.
- Icon + "Glissez vos fichiers ici ou cliquez pour parcourir" text.
- On file select: show file name pill below the drop zone.

### 5.9 DecisionsSection

- Title: "Décision".
- Two large segmented radio cards side by side:
  - "✅ Exécution des Travaux" → on select: green border + light green background
  - "❌ Annuler les Travaux" → on select: red border + light red background
- Style: `border-2 rounded-[12px] p-4 cursor-pointer transition-all font-semibold text-center`

---

## 6. LOOKUP MODAL (`LookupModal.jsx`)

Used by every lookup field (Client, Projet, Ville, Zone, Motif, Matériel, Intervenant).

**Props:** `{ isOpen, onClose, title, columns, data, onSelect, multiSelect? }`

**Structure:**

```
[Modal Overlay: fixed inset-0 bg-black/40 backdrop-blur-sm]
  [Modal Box: bg-white rounded-[16px] shadow-xl max-w-2xl w-full mx-auto mt-20 p-6]
    [Header: title (left) + X close button (right)]
    [DataTable]
      [Thead Row 1: column titles]
      [Thead Row 2: one <input> per column for filtering — filter is additive]
      [Tbody: filtered rows, click to select and close]
    [Footer (multiSelect only): "X sélectionnés" + [Confirmer] button]
```

**Filter logic:** Each column has its own state string. Filter function:

```js
const filtered = data.filter(row =>
  columns.every(col =>
    row[col.key].toString().toLowerCase().includes(filters[col.key].toLowerCase())
  )
);
```

**Column filter inputs:** `border border-[#E2E8F0] rounded-md px-2 py-1 text-xs w-full focus:outline-none focus:border-[#2563EB]`

---

## 7. IMPROVEMENTS OVER ORIGINAL SPECS

These are enhancements beyond what both original prompts described — include them all:

1. **Breadcrumb navigation** on the Work Order screen: `Dashboard > Missions > MSN-001` for orientation.
2. **Empty state** for cards: When a panel has 0 results, show a centered icon + "Aucune mission trouvée" instead of an empty table.
3. **Skeleton loaders**: On initial page load, show animated skeleton rows (`animate-pulse bg-gray-100 rounded`) inside the cards for 800ms before rendering data.
4. **Toast notifications**: After clicking "Soumettre" or "Enregistrer Brouillon", show a bottom-right toast: green checkmark + "Enregistré avec succès" that auto-dismisses after 3 seconds.
5. **Stage indicator** on WorkOrder page: A small 3-step progress indicator in the HeaderActionBar showing `Brouillon → Soumis → Validé` with the current stage highlighted.
6. **Sticky card headers**: On scroll within a long card, the card title + column headers remain sticky so the user always knows what they're looking at.
7. **Auto-fill animation**: When project selection triggers auto-fill, briefly flash the populated fields with a `transition-colors` from `bg-green-50` to `bg-white` to draw the user's attention.
8. **Responsive modals**: Modals should close on `Escape` key press and clicking the overlay.
9. **Required field indicators**: Label fields that are required with a red asterisk `*` using `after:content-['*'] after:text-red-500 after:ml-0.5`.
10. **Consistent focus ring**: All interactive elements use `focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2` for keyboard accessibility.

---

## 8. ROUTING (`App.jsx`)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkOrder from './pages/WorkOrder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mission/new" element={<WorkOrder />} />
        <Route path="/mission/:id" element={<WorkOrder />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 9. COMPONENT QUICK REFERENCE

```jsx
// Button.jsx
// variant: 'solid' | 'outline' | 'ghost'
// size: 'sm' | 'md' | 'lg'

// Badge.jsx
// status: 'En Cours' | 'En Attente' | 'Terminé' | 'Annulé'
// Uses statusConfig from mockData.js

// Card.jsx
// Wrapper: white bg, rounded-[12px], shadow-soft, p-6

// Toggle.jsx
// checked: boolean, onChange: fn
// Blue when on, gray when off, smooth transition

// Modal.jsx
// isOpen: boolean, onClose: fn, title: string
// Children rendered in modal body
```

---

## 10. DEPENDENCIES TO INSTALL

```bash
npm install react-router-dom lucide-react
```

Google Fonts (add to `index.html`):
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Tailwind config — add to `tailwind.config.js`:
```js
fontFamily: {
  sans: ['DM Sans', 'sans-serif'],
}
```

---

> **Note for Copilot:** Build components one file at a time, starting with `mockData.js` → UI primitives (`Badge`, `Button`, `Card`, `Toggle`, `Modal`) → `Dashboard.jsx` → `WorkOrder.jsx`. Do not use any external UI libraries beyond `lucide-react` and `react-router-dom`. All styling must use Tailwind utility classes only.
