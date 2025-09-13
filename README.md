# 🚛 Vehicle Management System v3.1

Nowoczesny system zarządzania flotą pojazdów z interfejsem webowym. Aplikacja umożliwia import, przeglądanie, sortowanie i eksport danych o pojazdach z zaawansowanymi funkcjami raportowania.

![Vehicle Management System](https://img.shields.io/badge/Version-3.1-blue) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Główne funkcjonalności

### 📊 Zarządzanie danymi

- **Import CSV** - Wczytywanie danych pojazdów z plików CSV
- **Automatyczne sortowanie** - Sortowanie według lokalizacji, typu, czasu w placu, ID pojazdu i notatek
- **Lokalne przechowywanie** - Automatyczny zapis danych w localStorage przeglądarki
- **Reset danych** - Możliwość wyczyszczenia wszystkich danych z potwierdzeniem

### 🚚 Typy pojazdów

- **Ciągniki siodłowe** (Tractors)
- **Samochody dostawcze** (Box Trucks)
- **Automatyczne zliczanie** - Podsumowanie ilości każdego typu pojazdu

### 🖨️ Funkcje eksportu

- **Drukowanie** - Bezpośrednie drukowanie listy pojazdów
- **Export PDF** - Generowanie dokumentów PDF z danymi
- **Kod QR** - Generowanie kodów QR dla mobilnego dostępu do danych
- **Responsywne formaty** - Optymalizacja dla różnych rozmiarów papieru

### 🌐 Wielojęzyczność

- **Polski** - Pełne wsparcie języka polskiego
- **Angielski** - Kompletne tłumaczenie interfejsu
- **Dynamiczne przełączanie** - Zmiana języka bez przeładowania strony

### 🎨 Interfejs użytkownika

- **Ciemny/Jasny motyw** - Przełączanie między trybami
- **Bootstrap Icons** - Nowoczesne ikony w całym interfejsie
- **Responsywny design** - Dostosowanie do różnych rozmiarów ekranów
- **Animacje** - Płynne przejścia i efekty wizualne

## 🚀 Rozpoczęcie pracy

### Wymagania

- Nowoczesna przeglądarka internetowa (Chrome, Firefox, Safari, Edge)
- Połączenie internetowe (dla bibliotek CDN)

### Instalacja

1. Pobierz wszystkie pliki projektu
2. Otwórz plik `index.html` w przeglądarce
3. Aplikacja jest gotowa do użycia!

### Struktura plików

```
exd/
├── index.html      # Główny plik HTML
├── app.js          # Logika aplikacji JavaScript
├── index.css       # Style CSS
└── README.md       # Dokumentacja
```

## 📋 Instrukcja użytkowania

### 1. Import danych CSV

- Kliknij w obszar "Click to upload CSV"
- Wybierz plik CSV z danymi pojazdów
- Dane zostaną automatycznie wczytane i wyświetlone

### 2. Format pliku CSV

Plik CSV powinien zawierać następujące kolumny:

- `Location` - Lokalizacja pojazdu
- `Type` - Typ pojazdu (Tractor/Box Truck)
- `TimeInYardHours` - Czas w placu (w godzinach)
- `Vehicle ID` - Identyfikator pojazdu
- `Notes` - Dodatkowe notatki

### 3. Sortowanie danych

- Kliknij na nagłówek kolumny aby posortować
- Ponowne kliknięcie zmienia kierunek sortowania
- Ikony pokazują aktualny stan sortowania

### 4. Eksport i drukowanie

- **Print List** - Drukowanie bezpośrednie
- **Save as PDF** - Generowanie pliku PDF
- **Generate QR** - Kod QR dla urządzeń mobilnych

### 5. Ustawienia

- **Theme** - Przełączanie między jasnym a ciemnym motywem
- **Language** - Zmiana języka (PL/EN)
- **Reset** - Wyczyszczenie wszystkich danych

## 🛠️ Technologie

### Frontend

- **HTML5** - Struktura aplikacji
- **CSS3** - Style i animacje
- **Vanilla JavaScript** - Logika aplikacji

### Biblioteki zewnętrzne

- **PapaParse 5.3.0** - Parser plików CSV
- **Bootstrap Icons 1.11.3** - Ikony interfejsu
- **QRious 4.0.2** - Generowanie kodów QR
- **SweetAlert2** - Modalne okna dialogowe
- **JetBrains Mono** - Czcionka monospace

### Funkcjonalności CSS

- **CSS Custom Properties** - Zmienne dla motywów
- **CSS Grid & Flexbox** - Responsywny layout
- **CSS Animations** - Animacje i przejścia
- **Media Queries** - Adaptacja mobilna

## 🎯 Funkcje zaawansowane

### Automatyczne zapisywanie

- Dane są automatycznie zapisywane w localStorage
- Przywracanie danych po odświeżeniu strony
- Timestamp ostatniej modyfikacji

### Animacje interfejsu

- Migotanie elementu "No file selected" na czerwono
- Płynne przejścia między motywami
- Animowane wskaźniki sortowania
- Efekty hover na przyciskach

### Responsywność

- Adaptacja do ekranów mobilnych
- Optymalizacja dla tabletów
- Skalowanie elementów interfejsu
- Dostosowanie modalnych okien

### Obsługa błędów

- Walidacja formatu plików CSV
- Komunikaty o błędach w czytelnej formie
- Graceful degradation przy błędach bibliotek
- Fallback dla nieobsługiwanych funkcji

## 📱 Kompatybilność

### Przeglądarki

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Urządzenia

- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

## 🔧 Konfiguracja

### Zmienne CSS

Główne zmienne motywu znajdują się w `:root` w pliku `index.css`:

```css
:root {
  --bg: #1a1a1a;
  --panel-bg: #2d2d2d;
  --text-color: #ffffff;
  --highlight-color: #4a9eff;
  /* ... więcej zmiennych */
}
```

### Tłumaczenia

Teksty interfejsu są zdefiniowane w obiekcie `translations` w pliku `app.js`:

```javascript
const translations = {
  pl: {
    /* polskie tłumaczenia */
  },
  en: {
    /* angielskie tłumaczenia */
  },
};
```

## 🐛 Rozwiązywanie problemów

### Plik CSV nie wczytuje się

- Sprawdź format pliku (musi być .csv)
- Upewnij się, że plik zawiera wymagane kolumny
- Sprawdź kodowanie pliku (UTF-8)

### Dane nie zapisują się

- Sprawdź czy localStorage jest włączony w przeglądarce
- Wyczyść cache przeglądarki
- Sprawdź dostępną przestrzeń localStorage

### Drukowanie nie działa

- Sprawdź ustawienia drukarki
- Upewnij się, że JavaScript jest włączony
- Spróbuj użyć funkcji "Save as PDF"

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik LICENSE dla szczegółów.

## 👨‍💻 Autor

Projekt stworzony jako system zarządzania flotą pojazdów z nowoczesnym interfejsem webowym.

---

**Vehicle Management System v3.1** - Profesjonalne zarządzanie flotą pojazdów w przeglądarce! 🚛✨
