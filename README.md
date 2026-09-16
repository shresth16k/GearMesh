# ReWrap / GearMesh 🌿

> **Things move. People connect. A greener tomorrow.**  
> *Same things. New stories. Borrow. Share. Belong.*

ReWrap (GearMesh) is a premium mobile-first resource-sharing platform where community members borrow, lend, and share underused physical items instead of purchasing things they only need occasionally.

Built with an editorial aesthetic: **Warm Cream background (`#F5F0E7`) + Deep Forest Green signature (`#10291F` / `#183A2B`) + authentic photography + restrained cards + subtle sage accents**.

---

## 🚀 Tech Stack

- **Frontend**: Ionic React (`@ionic/react`), React 18, TypeScript, Lucide Icons, Vite
- **Backend**: Java 17 (OpenJDK), Native REST API (`com.sun.net.httpserver`) with zero external dependency requirement, plus Maven (`pom.xml`) for Spring Boot compatibility
- **Design System**: Strict editorial guidelines, Inter typography, warm organic palette, contactless Smart Locker verification

---

## 📱 Prototype Screens

1. **Splash / Welcome Screen**:
   - High-resolution editorial photography of outdoor gear
   - Brand manifesto: *"THINGS MOVE. PEOPLE CONNECT. A GREENER TOMORROW."*
   - Elegant cursive script: *"Same Things New Stories."*
   - Capsule action button: **Get Started →**
   - Subtitle: *"Join a community that values access over ownership"*
2. **Onboarding**: 3-step value story (Local discovery, Smart lockers, Sustainability impact).
3. **Authentication**: Clean sign in and sign up flow.
4. **Home Screen**:
   - Location tag: *Rajpur Road, Dehradun* & verified user badge
   - Search with filter toggle
   - Horizontal category scroll (Camping, Tools, Electronics, Sports, Kitchen, Events, Books)
   - Editorial Hero Card: *"Borrow Experiences, Not Clutter."*
   - Horizontal "Trending Near You" item cards
   - "Smart Life Kit" AI concierge teaser
5. **Explore Screen**:
   - "Find Around You" with **Map / List** view toggle
   - Minimalist interactive local map with custom price pins and item cards
   - Filter chips by category and availability
6. **Item Details Screen**:
   - Edge-to-edge photography
   - Transparent daily pricing (₹/day), rating stars in warm sand (`#D5B98C`)
   - Verified owner identity card and equipment condition
   - Carbon savings impact metrics
   - Sticky bottom bar with "Chat" and capsule "Request to Borrow"
7. **Borrow Request Screen**:
   - Interactive date range selector with automatic duration calculation
   - Pickup selector: **Smart Locker** vs **Meet in Person**
   - Cost estimation with ReWrap Community Replacement Guarantee
8. **Smart Locker / Request Approved Screen**:
   - Realistic physical smart locker unit visual
   - Assigned compartment: **Locker A-12**
   - 4-digit access code: **4 8 2 7** with 1-tap clipboard copy
   - Validity timer and neighborhood hub directions
9. **Activity Screen**:
   - Segmented **Borrowing | Lending** tabs
   - Clear status badges (Pending, Approved, Active, Completed, Returned)
   - 1-tap "View Locker PIN" action on active reservations
10. **List an Item Screen**:
    - Prominent photo dropzone with instant preview
    - Lightweight, intuitive publishing form for community items
11. **Profile & Environmental Impact**:
    - Personal community identity (Alex Rivera, Dehradun)
    - Detailed sustainability dashboard (*18.5 kg material impact avoided*, *₹12,400 saved*)
    - Menu sections: My Listings, My Activity, Saved Items, Payments, Help & Trust
12. **AI Life Kit Screen**:
    - Smart concierge prompt interface
    - Dynamic gear bundling (*Tent + Stove + Cooler + Lantern + Chairs*) with instant "Add All to Kit"

---

## 🛠️ Getting Started

### 1. Frontend Setup (Ionic + React + TypeScript)

```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:
```bash
npm run build
```

### 2. Java Backend Setup (Java 17)

To compile and run the native Java REST server:
```bash
# Compile Java classes
javac -d backend/target/classes backend/src/main/java/com/rewrap/model/*.java backend/src/main/java/com/rewrap/ReWrapServer.java

# Run the server on port 8080
java -cp backend/target/classes com.rewrap.ReWrapServer
```
Endpoints:
- `GET http://localhost:8080/api/health`
- `GET http://localhost:8080/api/items`
- `GET http://localhost:8080/api/transactions`
- `GET http://localhost:8080/api/user/profile`
- `POST http://localhost:8080/api/borrow`

---

## 🎨 Primary Color Palette

| Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Forest Green** | `#183A2B` | Primary buttons, active states, high-priority actions |
| **Deep Forest** | `#10291F` | Dark sections, headings, capsule buttons |
| **Warm Cream** | `#F5F0E7` | Primary application background |
| **Soft Ivory** | `#FCFAF5` | Cards, input fields, elevated surfaces |
| **Muted Sage** | `#A8B8A3` | Tags, sustainability indicators, supporting accents |
| **Pale Sage** | `#DCE5D8` | Success badges, impact backgrounds, soft highlights |
| **Charcoal** | `#20251F` | Primary text and headings |
| **Muted Gray** | `#73776F` | Secondary text, helper labels, locations |
| **Muted Sand** | `#D5B98C` | Rating stars, subtle accents |
