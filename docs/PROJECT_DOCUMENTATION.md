# Pashu Rakshak — Complete Technical Project Documentation

> **AI-Powered Farm Biosecurity, Livestock Disease Detection & Epidemiological GIS Platform**  
> *Detailed Architectural Specification & Functional Documentation*

---

## 1. Executive Summary & Problem Statement

### 1.1 Context
In India and developing agrarian economies, livestock farming (cattle, buffaloes, swine, poultry) represents the primary financial safety net for over 20 million smallholder farmers. Animal husbandry accounts for nearly 4.11% of national GDP and 25.6% of total agricultural output. However, systemic vulnerabilities in livestock biosecurity expose rural communities to severe economic shocks caused by rapid disease outbreaks such as **Lumpy Skin Disease (LSD)**, **Foot & Mouth Disease (FMD)**, and **Haemorrhagic Septicaemia (HS)**.

### 1.2 Core Challenges
1. **Delayed Outbreak Detection:** Rural farmers lack diagnostic tools to identify early clinical symptoms, resulting in uncontained disease transmission across village borders.
2. **Veterinary Service Deficit:** Veterinary Officer ratio in remote districts falls far below ICAR guidelines, causing delays of 24–72 hours in critical emergency response.
3. **Data Silos & Paper Records:** Animal health histories are recorded on paper cards susceptible to loss or falsification, impeding epidemiological tracking.
4. **Lack of Real-Time GIS Intelligence:** Government biosecurity departments rely on retrospective manual reports rather than real-time geospatial outbreak mapping.

### 1.3 The Solution: Pashu Rakshak
**Pashu Rakshak** is a digital biosecurity platform that bridges the gap between rural farmers, field veterinary officers, and state animal husbandry command centers. It combines offline-first AI symptom scanning, automated proximity-based Vet dispatching, immutable digital health passports, and real-time GIS outbreak containment tracking.

---

## 2. Target User Personas & Workflows

### 2.1 Farmer Persona ("Kisan")
- **Profile:** Smallholder dairy or poultry farmer operating in rural or semi-urban districts with low internet bandwidth and varying literacy levels.
- **Key Workflows:**
  - Authenticate via camera face verification.
  - Scan animal symptoms (select species, select observed physical nodules/lesions/fever).
  - Obtain instant risk index assessment and recommended biosecurity quarantine measures.
  - Dispatch emergency request with live browser GPS coordinates.
  - Track assigned Veterinary Officer ETA and view animal's Digital Health Passport.

### 2.2 Veterinary Officer Persona ("Clinical Vet")
- **Profile:** Certified Government Veterinary Extension Officer or District Officer managing emergency response across block sectors.
- **Key Workflows:**
  - Login via DVO License ID and security passcode.
  - Receive real-time emergency dispatch alerts with GPS location and AI pre-diagnosis.
  - Contact farmer via quick-call routing and accept field dispatch (updating ETA).
  - Submit **Log Field Inspection & Diagnosis** (prescriptions, vaccines administered, batch numbers).
  - Automatically resolve the case, updating the animal's Digital Health Passport and clearing the Red Spot from the state GIS map.

### 2.3 Government Administrator Persona ("State Biosecurity Command")
- **Profile:** State Director of Animal Husbandry, Epidemiologist, or District Biosecurity Chief.
- **Key Workflows:**
  - Authenticate via dual biometric verification (Live Camera Face Scanner + Biometric Fingerprint).
  - Monitor real-time GIS Outbreak Heatmap displaying active outbreak zones and un-inspected farmer case **Red Spots**.
  - Broadcast Emergency Geo-Alert containment radius warnings to farmers in affected sectors.
  - Audit Veterinary Officer performance (average response time, completed visits, conduct ratings).
  - Resolve farmer grievances and review compliance logs.

---

## 3. System Architecture & Component Breakdown

### 3.1 Technology Stack Architecture
```
+-----------------------------------------------------------------------+
|                           CLIENT LAYER                                |
|  - React 18 SPA (Vite Engine)                                         |
|  - TailwindCSS + Lucide Icons + Glassmorphism UX                      |
|  - Leaflet / React-Leaflet GIS Mapping Engine                         |
|  - HTML5 WebRTC Media Capture API (Live Webcam Face Verification)     |
+-----------------------------------------------------------------------+
                                   |
                                   v  (REST API / HTTP JSON)
+-----------------------------------------------------------------------+
|                         APPLICATION SERVER                            |
|  - Node.js & Express.js Engine                                        |
|  - Middleware: CORS, Body Parser, Static Asset Serve                  |
|  - Routes: /api/ai, /api/vets, /api/records, /api/outbreaks           |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                       SHARED BIOSECURITY STORE                        |
|  - In-Memory Epidemiological State Store                              |
|  - Cryptographic Health Passport Hash Generator (SHA-256)            |
|  - Spatial Proximity Calculation Engine (Haversine Formula)           |
+-----------------------------------------------------------------------+
```

### 3.2 Key Data Models

#### 3.2.1 Emergency Vet Request Object
```json
{
  "id": "req-1787386593470",
  "farmId": "farm-101",
  "farmerName": "Harpreet Singh",
  "farmerPhone": "+91 98711 22334",
  "farmLocation": { "lat": 30.8920, "lng": 75.8450 },
  "village": "Jagraon, Ludhiana",
  "animalTag": "IN-PB-2024-8842",
  "species": "Cattle",
  "symptoms": ["Skin nodules", "High fever", "Loss of appetite"],
  "aiRiskLevel": "HIGH",
  "suspectedDisease": "Lumpy Skin Disease (LSD)",
  "requestedVetId": "vet-101",
  "status": "PENDING",
  "createdAt": "2026-08-22T13:46:33.000Z"
}
```

#### 3.2.2 GIS Outbreak Heatmap Spot Object
```json
{
  "id": "farmer-spot-req-1787386593470",
  "requestId": "req-1787386593470",
  "disease": "Lumpy Skin Disease (LSD)",
  "lat": 30.8920,
  "lng": 75.8450,
  "intensity": 1.0,
  "radiusKm": 12,
  "district": "Jagraon, Ludhiana",
  "farmerName": "Harpreet Singh",
  "animalTag": "IN-PB-2024-8842",
  "quarantineStatus": "🔴 ACTIVE UN-INSPECTED CASE (AWAITING VET FIELD DIAGNOSIS)"
}
```

---

## 4. Disease-Symptom Knowledge Base & Epidemiological Engine

The platform incorporates a multi-tier clinical knowledge base derived from ICAR (Indian Council of Agricultural Research) and WOAH (World Organisation for Animal Health) clinical guidelines:

| Target Species | Clinical Symptoms | Matched Disease Diagnosis | Risk Index | Quarantine Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Cattle / Buffalo** | Firm raised skin nodules, High fever (40°C+), Enlarged lymph nodes | **Lumpy Skin Disease (LSD)** | `HIGH` | Isolate animal in dry shed; apply vector repellents; restrict movement within 15km. |
| **Cattle / Buffalo** | Profuse salivation, Foot/mouth vesicles, Lameness, Reduced milk yield | **Foot & Mouth Disease (FMD)** | `CRITICAL` | Enforce ring vaccination; disinfect farm entry gates; halt milk transport vehicles. |
| **Swine (Pigs)** | High fever, Skin cyanosis/reddening, Hemorrhages, High mortality | **African Swine Fever (ASF)** | `CRITICAL` | Immediate biosecurity lock of farm perimeter; notify district veterinary authority. |
| **Poultry** | Sudden high mortality, Facial edema, Greenish diarrhea, Respiratory distress | **Highly Pathogenic Avian Influenza (HPAI)** | `CRITICAL` | Enforce strict hatchery quarantine; wear PPE; halt bird movement. |

---

## 5. Security & Authentication Mandates

1. **Farmer Live Camera Mandate:**
   - Farmer login requires active WebRTC camera stream initialization.
   - If camera permission is denied or blocked, authentication is **strictly denied** (`cameraStream === null`), preventing unverified account access.

2. **Govt Admin Dual Biometrics:**
   - Government clearance requires both **Live AI Camera Scan** and **Laser Biometric Fingerprint Simulation**.
   - Dual verification ensures administrative accountability and prevents unauthorized access to state-wide emergency alert tools.

---

## 6. Known Limitations

- **Prototype Diagnostic Model:** The diagnostic engine currently uses a structured clinical expert inference system rather than a deep learning neural net trained on proprietary image datasets.
- **In-Memory Volatility:** Data is managed via an in-memory store (`sharedStore.js`); production deployment should integrate PostgreSQL / MongoDB with PostGIS extension for spatial queries.
- **Browser Geolocation Precision:** GPS positioning depends on browser web APIs; dedicated mobile builds (React Native/Android) can utilize hardware GNSS for sub-meter accuracy.

---

## 7. Future Scope & Roadmap

- **Computer Vision Integration:** Train custom YOLOv8 / ResNet models on localized Indian livestock disease image datasets for automated visual lesion classification.
- **Blockchain Health Passports:** Migrate animal health history hash tracking to Hyperledger Fabric for tampered-proof supply chain verification.
- **IoT Smart Collar Integration:** Connect wearable LoRaWAN collars for continuous temperature, heart rate, and rumination monitoring.
- **Satellite Vegetation & Humidity Integration:** Combine GIS maps with ISRO Sentinel satellite data to predict vector breeding grounds and forecast seasonal outbreak risks.
