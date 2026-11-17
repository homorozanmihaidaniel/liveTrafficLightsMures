# 🚦 Aplicație Semafoare Târgu Mureș (React Native / Expo)

Aplicație mobilă modernă realizată în **React Native** (cu suport cross-platform pentru Android, iOS și Web via Expo), dedicată simulării, vizualizării și coordonării semafoarelor pentru cele două intersecții adiacente din Târgu Mureș.

---

## 📍 Cele Două Intersecții Modelate

1. **Intersecția 1 (4 faze)**:
   - **Coordonate**: `46°32'47.3"N 24°34'07.4"E`
   - **Localizare**: Str. Bernády György (Nord) - Str. Alexandru Papiu Ilarian (Sud) - Str. Nicolae Iorga (Est) - Str. Revoluției / Centru (Vest).
   - **Ciclu conform schiței**: `2 min 20 sec` (140 secunde).
   - **Fazele de circulație**:
     - 🟢 **Faza 1 (30s)**: Acces Est (N. Iorga) -> Înainte spre Vest, la stânga spre Sud și dreapta spre Nord.
     - 🟠 **Faza 2 (30s)**: Acces Sud (Papiu Ilarian) -> Înainte spre Nord și dreapta spre Est (inclusiv canalizare bypass triunghiular).
     - 🌸 **Faza 3 (30s)**: Acces Vest (Centru) -> Înainte spre Est, la stânga spre Nord și dreapta spre Sud.
     - 🔵 **Faza 4 (30s)**: Acces Nord (Bernády) -> Înainte/stânga spre Sud și dreapta spre Vest.
     - 🟡 **Galben (5s)**: Tranziție între faze (4 x 5s = 20s; 120s + 20s = 140s).

2. **Intersecția 2 (3 faze)**:
   - **Coordonate**: `46°32'47.1"N 24°33'48.9"E`
   - **Localizare**: Piața Trandafirilor (Vest) - Str. Revoluției (Sud) - Parcare centrală (Nord) - Legătură spre N. Iorga (Est).
   - **Ciclu conform schiței**: `1 min 30 sec` (90 secunde).
   - **Fazele de circulație**:
     - 🟢 **Faza 1 (15s)**: Acces Est & viraj spre Parcare Nord; din Sud înainte spre Parcare.
     - 🟠 **Faza 2 (15s)**: Acces Sud -> Viraj la stânga spre Piața Trandafirilor (Vest) și spre Parcare.
     - 🌸 **Faza 3 (45s)**: Axul principal Piața Trandafirilor (Vest -> Est) înainte spre Intersecția 1 și viraj la dreapta spre Sud.
     - 🟡 **Galben (5s)**: Tranziție între faze (3 x 5s = 15s; 75s + 15s = 90s).

---

## ✨ Modificări Recente

### ⏱️ Sincronizare în Timp Real cu Ceasul Telefonului (LIVE)
- **Mod Timp Real (Ceas Telefon)**:
  - Semafoarele rulează sincronizat direct cu ceasul intern și fusul orar al telefonului (`Date.now()`).
  - **Reluare fără decalaj**: Dacă închizi aplicația, o bagi în fundal sau repornești telefonul, la redeschidere semaforul își reia **instantaneu momentul exact din teren**, calculat matematic la secundă.
  - **Comutator mod**: Se poate trece oricând între `🔴 Timp Real (Ceas Telefon)` și `🧪 Mod Simulare` (unde poți opri/porni și accelera la 2x, 5x).
- **Calibrare 1-Tap la Fața Locului**:
  - Când te afli la semafor și vezi că se aprinde verdele la o anumită stradă (Faza 1, 2, 3 sau 4), apeși butonul `⚡ SEMAFORUL A TRECUT PE VERDE ACUM!`.
  - Ancorarea este salvată persistent în memoria telefonului (`AsyncStorage`), menținând sincronizarea permanentă.
  - Butoane de reglaj fin `[ -1s ]` / `[ +1s ]` în caz că butonul a fost apăsat cu o secundă întârziere.

---

## 📍 Cele Două Intersecții Modelate

- **EXCLUSIV Verde, Galben și Roșu**:
  - 🟢 **VERDE**: Drumul/banda deschisă se aprinde în verde intens, cu chevrons albi de circulație animată.
  - 🟡 **GALBEN**: Drumul activ trece pe galben la finalul fazei verzi pentru degajare.
  - 🔴 **ROȘU**: Drumurile oprite au linii roșii clare de stop și carosabil oprit.
  - S-au eliminat complet culorile din schiță (roz, portocaliu, albastru).
- **Aspect Realist Google Maps**:
  - Hărțile au fost reproiectate cu clădiri adiacente reale din Târgu Mureș (Prefectura Mureș, Cetatea Medievală, Colegiul Național Papiu, Palatul Culturii, Primăria, Parcul Central), borduri, zebre albe și racordări exacte conform Google Maps.
- **Selector Rapid la Început**:
  - Sus de tot există butoanele mari: `[ 🚦 Intersecția 1 ]`, `[ 🚦 Intersecția 2 ]` și `[ 🌊 Undă Verde (φ) ]`.
- **Modificare Timpi Direct pe Hartă**:
  - Direct sub fiecare intersecție sunt carduri pentru fiecare direcție cu butoane `[ − ]` și `[ + ]` de unde poți crește sau scădea durata fazei (cu 5 secunde) instantaneu, fără meniuri separate.
- **Control Decalaj φ (Fi)**:
  - Situat direct pe ecran, în intervalul $[-T/2, +T/2]$ (recalculat automat dinamic în funcție de suma timpilor).

### 1. Colorarea Carosabilului și a Benzilor ("Cum circulă efectiv")
- **Nu semafoarele mici sunt colorate, ci drumurile în sine!**
- Când o fază este **VERDE**:
  - Benzile de intrare și traseele de viraj din intersecție se aprind în culori vii (Verde/Galben/Roșu sau culorile tematice din desen: Verde, Portocaliu, Roz, Albastru).
  - Animații dinamice de flux (**impulsuri luminoase de trafic**) rulează în timp real de-a lungul curbelor și săgeților direcționale, indicând traiectoria exactă a mașinilor.
- La terminarea fazei:
  - Benzile trec automat pe culoarea **GALBEN** (avertizare și degajare a intersecției).
- Pe **ROȘU**:
  - Drumurile inactive rămân închise la culoare (asfalt închis cu marcaje rutiere discrete), iar la trecerile de pietoni se aprind linii roșii de oprire.

### 2. Modificarea Timpilor de Semaforizare
- Utilizatorul poate crește/scădea durata secundelor de verde pentru fiecare fază în parte (butoane `+5s` / `-5s`).
- Timpul de galben este configurabil separat (`+1s` / `-1s`).
- Perioada totală $T$ se recalculează automat ($T = \sum (t_{\text{verde}} + t_{\text{galben}})$).
- Buton dedicat de **Resetare la Valorile din Schițe** (2m20s / 1m30s).

### 3. Parametrul de Decalaj $\phi$ (Fi) în intervalul $[-T/2, T/2]$
- Slider și comenzi pas cu pas pentru decalajul de fază $\phi \in [-T/2, +T/2]$.
- La $T = 140\text{s}$, $\phi \in [-70\text{s}, +70\text{s}]$.
- **Rolul lui $\phi$**: Coordonarea undei verzi între Intersecția 1 și Intersecția 2 pe distanța de ~400 metri (tranzit ~29 secunde la 50 km/h).
- Pagina **🌊 Undă Verde (φ)** simulează ambele intersecții simultan și arată în timp real dacă plutonul de vehicule prinde verde la ambele noduri rutiere!

### 4. Consultarea Schițelor Desenate de Mână
- În antet există butonul **📷 Schiță**, care deschide desenul original fotografiat de utilizator pentru comparație directă 1:1.

---

## 📱 Cum se Rulează Aplicația

### Pe Telefon (Android / iOS):
1. Instalează aplicația gratuită **Expo Go** din Google Play Store sau Apple App Store.
2. În terminal, rulează:
   ```bash
   npx expo start
   ```
3. Scanează codul QR apărut în consolă folosind camera telefonului (pe iOS) sau aplicația Expo Go (pe Android).

### În Browser Web:
Rulează comanda:
```bash
npx expo start --web
```
sau vizualizează build-ul static generat:
```bash
npx serve dist
```
