// --- Custom Modal System (replaces SweetAlert2) ---
class CustomModal {
    constructor() {
        this.currentModal = null;
        this.currentTimer = null;
    }

    show(options = {}) {
        const {
            title = '',
            text = '',
            html = '',
            icon = null,
            showConfirmButton = true,
            showCancelButton = false,
            confirmButtonText = 'OK',
            cancelButtonText = 'Cancel',
            confirmButtonColor = null,
            cancelButtonColor = null,
            timer = null,
            timerProgressBar = false,
            allowOutsideClick = true,
            allowEscapeKey = true,
            showCloseButton = false,
            width = null,
            position = 'center',
            backdrop = true,
            customClass = {},
            didOpen = null,
            replaceModal = false
        } = options;

        // Close existing modal unless we're replacing it
        if (this.currentModal && !replaceModal) {
            this.close();
        } else if (this.currentModal && replaceModal) {
            // Remove existing modal immediately without animation
            this.currentModal.parentNode.removeChild(this.currentModal);
            this.currentModal = null;
            if (this.currentTimer) {
                clearTimeout(this.currentTimer);
                this.currentTimer = null;
            }
        }

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        if (customClass.popup) {
            overlay.classList.add(customClass.popup);
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        if (width === '600px' || customClass.popup === 'qr-modal-popup') {
            modal.classList.add('large');
        }
        if (width) {
            modal.style.maxWidth = width;
        }

        // Modal header
        const header = document.createElement('div');
        header.className = 'modal-header';

        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.className = `bi modal-icon ${icon}`;
            if (icon === 'success') iconEl.className = 'bi bi-check-circle modal-icon success';
            if (icon === 'error') iconEl.className = 'bi bi-x-circle modal-icon error';
            if (icon === 'warning') iconEl.className = 'bi bi-exclamation-triangle modal-icon warning';
            if (icon === 'info') iconEl.className = 'bi bi-info-circle modal-icon info';
            header.appendChild(iconEl);
        }

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.innerHTML = title;
        header.appendChild(titleEl);

        if (showCloseButton) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => this.close();
            header.appendChild(closeBtn);
        }

        modal.appendChild(header);

        // Modal body
        const body = document.createElement('div');
        body.className = 'modal-body';
        if (html) {
            body.innerHTML = html;
        } else {
            body.textContent = text;
        }
        modal.appendChild(body);

        // Modal actions
        if (showConfirmButton || showCancelButton) {
            const actions = document.createElement('div');
            actions.className = 'modal-actions';

            if (showCancelButton) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'modal-btn secondary';
                cancelBtn.textContent = cancelButtonText;
                if (cancelButtonColor) {
                    cancelBtn.style.backgroundColor = cancelButtonColor;
                    cancelBtn.style.color = 'white';
                }
                cancelBtn.onclick = () => {
                    this.close();
                    if (options.onCancel) options.onCancel();
                };
                actions.appendChild(cancelBtn);
            }

            if (showConfirmButton) {
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'modal-btn primary';
                confirmBtn.innerHTML = confirmButtonText;
                if (confirmButtonColor) {
                    confirmBtn.style.backgroundColor = confirmButtonColor;
                }
                if (confirmButtonColor === '') {
                    confirmBtn.className = 'modal-btn danger';
                }
                confirmBtn.onclick = () => {
                    this.close();
                    if (options.onConfirm) options.onConfirm();
                };
                actions.appendChild(confirmBtn);
            }

            modal.appendChild(actions);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Show modal with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Set up event listeners
        if (allowOutsideClick) {
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            };
        }

        if (allowEscapeKey) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.close();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        }

        // Timer functionality
        if (timer) {
            if (timerProgressBar) {
                const progressBar = document.createElement('div');
                progressBar.className = 'modal-progress';
                const progressBarInner = document.createElement('div');
                progressBarInner.className = 'modal-progress-bar';
                progressBarInner.style.animation = `progress-countdown ${timer}ms linear`;
                progressBar.appendChild(progressBarInner);
                body.appendChild(progressBar);
            }

            this.currentTimer = setTimeout(() => {
                this.close();
            }, timer);
        }

        this.currentModal = overlay;

        // Call didOpen callback
        if (didOpen) {
            didOpen();
        }

        return {
            isConfirmed: false,
            then: (callback) => {
                if (options.onConfirm) {
                    const originalConfirm = options.onConfirm;
                    options.onConfirm = () => {
                        originalConfirm();
                        callback({ isConfirmed: true });
                    };
                }
                return this;
            }
        };
    }

    showLoading() {
        if (this.currentModal) {
            const body = this.currentModal.querySelector('.modal-body');
            body.innerHTML = `
                <div class="modal-loading">
                    <div class="modal-spinner"></div>
                </div>
            `;
        }
    }

    close() {
        if (this.currentModal) {
            this.currentModal.classList.remove('show');
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
            }, 300);
        }
        if (this.currentTimer) {
            clearTimeout(this.currentTimer);
            this.currentTimer = null;
        }
    }

    fire(options) {
        return new Promise((resolve) => {
            const result = this.show({
                ...options,
                onConfirm: () => {
                    resolve({ isConfirmed: true });
                },
                onCancel: () => {
                    resolve({ isConfirmed: false });
                }
            });
            return result;
        });
    }
}

// Create global modal instance to replace Swal
const Swal = new CustomModal();

// Add CSS for progress countdown animation
const style = document.createElement('style');
style.textContent = `
@keyframes progress-countdown {
    from { width: 100%; }
    to { width: 0%; }
}
`;
document.head.appendChild(style);

// --- Application State ---
let allTractors = [];
let allBoxTrucks = [];
let currentSort = { table: null, key: null, direction: 'asc' };

// --- Helper Functions ---
const parseHours = (timeStr) => {
    if (typeof timeStr !== 'string') return 0;
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

// --- Local Storage Management ---
function saveDataLocally() {
    const data = {
        tractorRows: allTractors,
        boxTruckRows: allBoxTrucks,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('vehicleData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('vehicleData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            allTractors = data.tractorRows || [];
            allBoxTrucks = data.boxTruckRows || [];
            renderTables();
            // Usuń migotanie jeśli są dane
            if (allTractors.length > 0 || allBoxTrucks.length > 0) {
                document.getElementById('file-name').classList.remove('no-file-blink');
            }
        } catch (e) {
            console.error("Failed to parse saved data:", e);
            localStorage.removeItem('vehicleData');
        }
    }
}

// --- Data & UI Rendering ---
function renderTable(tableId, data) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(rowData => {
        tbody.appendChild(createTableRow(rowData));
    });
}

function renderTables(filteredTractors, filteredBoxTrucks) {
    const tractorsToRender = filteredTractors !== undefined ? filteredTractors : allTractors;
    const boxTrucksToRender = filteredBoxTrucks !== undefined ? filteredBoxTrucks : allBoxTrucks;

    // Combine both arrays for unified view
    const allVehicles = [...tractorsToRender, ...boxTrucksToRender];

    renderTable('dataTable', allVehicles);

    updateCounts(tractorsToRender.length, boxTrucksToRender.length);
}

function createTableRow(row) {
    const tr = document.createElement('tr');
    ['Location', 'Type', 'Time in Yard', 'Vehicle ID', 'Notes'].forEach((key, index) => {
        const td = document.createElement('td');
        const value = row[key] || '';
        td.textContent = value;
        td.title = value;

        // Add color coding for vehicle type column
        if (key === 'Type') {
            if (value.toLowerCase() === 'box truck') {
                td.classList.add('vehicle-type-boxtruck');
            } else if (value.toLowerCase() === 'tractor') {
                td.classList.add('vehicle-type-tractor');
            }
        }

        tr.appendChild(td);
    });

    // Add row class based on vehicle type
    const vehicleType = row['Type'] || '';
    if (vehicleType.toLowerCase() === 'box truck') {
        tr.classList.add('row-boxtruck');
    } else if (vehicleType.toLowerCase() === 'tractor') {
        tr.classList.add('row-tractor');
    }

    return tr;
}

function updateCounts(tractorCount, boxTruckCount) {
    const totalCount = allTractors.length + allBoxTrucks.length;
    const visibleCount = tractorCount + boxTruckCount;

    // Update summary cards
    document.getElementById('tractorCount').textContent = allTractors.length;
    document.getElementById('boxTruckCount').textContent = allBoxTrucks.length;
    document.getElementById('totalCount').textContent = totalCount;

    // Update visible count in header (unified view)
    document.getElementById('visibleRowsDisplay').textContent = visibleCount;

    // Enable/disable and style print, PDF and QR buttons
    const printBtn = document.getElementById('printBtn');
    const pdfBtn = document.getElementById('savePdfBtn');
    const qrBtn = document.getElementById('generateQrBtn');

    printBtn.disabled = visibleCount === 0;
    pdfBtn.disabled = visibleCount === 0;
    qrBtn.disabled = visibleCount === 0;

    // Set button colors based on data availability
    if (totalCount === 0) {
        // No data loaded - gray buttons
        printBtn.classList.remove('success', 'primary');
        pdfBtn.classList.remove('success', 'primary');
        qrBtn.classList.remove('highlight');
    } else {
        // Data loaded - default colors
        printBtn.classList.remove('success');
        printBtn.classList.add('primary');
        pdfBtn.classList.remove('primary');
        pdfBtn.classList.add('success');
    }

    // Show/hide placeholder text for unified view
    const placeholderText = document.querySelector('#unified-vehicles-view .placeholder-text');
    if (placeholderText) {
        placeholderText.classList.toggle('hidden', visibleCount > 0 || totalCount > 0);
    }
}

// --- Application Core Logic ---
function resetApplication(t) {
    allTractors = [];
    allBoxTrucks = [];
    currentSort = { table: null, key: null, direction: 'asc' };
    localStorage.removeItem('vehicleData');
    document.getElementById('csvFile').value = '';
    const fileNameEl = document.getElementById('file-name');
    fileNameEl.textContent = t('noFileSelected');
    fileNameEl.dataset.langDefault = t('noFileSelected');
    fileNameEl.classList.add('no-file-blink');

    // Reset buttons to disabled gray style
    const printBtn = document.getElementById('printBtn');
    const pdfBtn = document.getElementById('savePdfBtn');
    const qrBtn = document.getElementById('generateQrBtn');
    // Remove all color classes and set to default gray
    printBtn.classList.remove('success', 'primary');
    pdfBtn.classList.remove('success', 'primary');
    qrBtn.classList.remove('highlight');

    clearFilters();
    renderTables();
    Swal.show({
        title: t('dataReset'),
        text: t('resetSuccess'),
        icon: 'success',
        confirmButtonText: t('ok')
    });
}

function handleCSV(file, t) {
    const fileNameEl = document.getElementById('file-name');
    fileNameEl.textContent = file.name;
    fileNameEl.removeAttribute('data-lang-key');
    fileNameEl.classList.remove('no-file-blink');


    Swal.show({
        title: t('csvLoading'),
        text: t('csvLoadingText'),
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        complete: function (results) {
            allTractors = [];
            allBoxTrucks = [];
            let processedCount = 0;
            const fileHasData = results.data.length > 0;

            if (results.errors.length) {
                console.warn("CSV parsing had non-critical errors:", results.errors);
            }

            results.data.forEach(row => {
                if (!row || typeof row !== 'object' || !row.Type || !row.Location) {
                    return;
                }

                const vehicle = {};
                for (const key in row) {
                    if (Object.prototype.hasOwnProperty.call(row, key)) {
                        vehicle[key] = typeof row[key] === 'string' ? row[key].trim() : row[key];
                    }
                }

                const vehicleType = vehicle.Type || "";
                const location = vehicle.Location || "";

                vehicle.TimeInYardHours = parseHours(vehicle['Time in Yard']);

                if (vehicleType.toLowerCase() === "tractor" && !location.startsWith("OS-")) {
                    allTractors.push(vehicle);
                    processedCount++;
                } else if (vehicleType.toLowerCase() === "box truck" && !location.startsWith("OS-")) {
                    allBoxTrucks.push(vehicle);
                    processedCount++;
                }
            });

            renderTables();
            saveDataLocally();

            // Always close loading modal first
            Swal.close();

            if (fileHasData && processedCount === 0) {
                setTimeout(() => {
                    Swal.show({
                        title: t('csvWarningTitle'),
                        text: t('csvWarningText'),
                        icon: 'warning',
                        confirmButtonText: t('ok')
                    });
                }, 100);
            } else if (processedCount > 0) {
                // Restore buttons to their default colors when CSV is loaded
                const printBtn = document.getElementById('printBtn');
                const pdfBtn = document.getElementById('savePdfBtn');
                const qrBtn = document.getElementById('generateQrBtn');
                // Restore to default HTML classes
                printBtn.classList.remove('success');
                printBtn.classList.add('primary');
                pdfBtn.classList.remove('primary');
                pdfBtn.classList.add('success');
                qrBtn.classList.remove('highlight');

                setTimeout(() => {
                    Swal.show({
                        title: t('csvLoaded'),
                        text: t('csvSuccess', { count: processedCount }),
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true
                    });
                }, 100);
            } else if (!fileHasData) {
                setTimeout(() => {
                    Swal.show({
                        title: t('csvEmptyTitle'),
                        text: t('csvEmptyText'),
                        icon: 'error',
                        confirmButtonText: t('ok')
                    });
                }, 100);
            }
        },
        error: function (error) {
            Swal.close(); // Close loading modal first
            Swal.show({
                icon: 'error',
                title: 'CSV Parsing Error',
                text: error.message
            });
        }
    });
}


// --- Sorting Logic ---
function handleSort(e) {
    const th = e.target.closest('th');
    if (!th || !th.dataset.sortKey) return;

    const tableId = th.closest('table').id;
    const key = th.dataset.sortKey;
    const direction = currentSort.key === key && currentSort.table === tableId && currentSort.direction === 'asc' ? 'desc' : 'asc';

    currentSort = { table: tableId, key, direction };

    // Sort both arrays since we display them together
    const allVehicles = [...allTractors, ...allBoxTrucks];

    allVehicles.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        let comparison = 0;

        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else if (valA != null && valB != null) {
            comparison = valA.toString().localeCompare(valB.toString(), undefined, { numeric: true });
        } else if (valA != null) {
            comparison = 1;
        } else if (valB != null) {
            comparison = -1;
        }

        return direction === 'asc' ? comparison : -comparison;
    });

    // Update the original arrays with sorted data
    allTractors.length = 0;
    allBoxTrucks.length = 0;

    allVehicles.forEach(vehicle => {
        if (vehicle.Type === 'Tractor') {
            allTractors.push(vehicle);
        } else if (vehicle.Type === 'Box Truck') {
            allBoxTrucks.push(vehicle);
        }
    });

    renderTables();
    updateSortIndicators();
}

function updateSortIndicators() {
    document.querySelectorAll('th[data-sort-key]').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        const indicator = th.querySelector('.sort-indicator');
        if (!indicator) return;

        indicator.className = 'bi bi-arrow-down-up sort-indicator';

        if (th.closest('table').id === currentSort.table && th.dataset.sortKey === currentSort.key) {
            th.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
            indicator.className = `bi ${currentSort.direction === 'asc' ? 'bi-sort-up' : 'bi-sort-down'} sort-indicator`;
        }
    });
}

function clearFilters() {
    renderTables();
}


// --- Main Execution ---
document.addEventListener('DOMContentLoaded', function () {

    // --- Translation Setup ---
    const translations = {
        pl: {
            commandCenterTitle: 'Centrum Dowodzenia Pojazdami', noFileSelected: 'Nie wybrano pliku',
            tractorVehicles: 'Ciągniki', boxTruckVehicles: 'Dostawcze',
            location: 'Lokalizacja', type: 'Typ', timeInYard: 'Czas na Placu', vehicleId: 'ID Pojazdu', notes: 'Notatki',
            uploadData: 'Wczytaj CSV', printReport: 'Drukuj', resetData: 'Reset', toggleTheme: 'Motyw', showInfo: 'Info',
            noDataToPrint: 'Brak danych do druku', noDataMessage: 'Wczytaj plik CSV, aby wydrukować listę.',
            confirmReset: 'Wyczyścić wszystkie dane?', resetWarning: 'Tej operacji nie można cofnąć.',
            dataReset: 'Dane zresetowane', resetSuccess: 'Wszystkie dane pojazdów zostały usunięte.',
            csvLoading: 'Przetwarzanie pliku...', csvLoadingText: 'Proszę czekać, wczytywanie danych z pliku CSV.',
            csvLoaded: 'Plik wczytany', csvSuccess: ({ count }) => `Zaimportowano ${count} pojazdów.`,
            csvWarningTitle: 'Ostrzeżenie', csvWarningText: 'Nie znaleziono pasujących pojazdów (Tractor, Box Truck). Sprawdź kolumnę "Type" w pliku CSV.',
            csvEmptyTitle: 'Pusty Plik', csvEmptyText: 'Wybrany plik CSV jest pusty.',
            printStarted: 'Drukowanie rozpoczęte', printInProgress: 'Generowanie podglądu wydruku...',
            printerDetection: 'Wykrywanie drukarek...', printerDetectionText: 'Sprawdzanie dostępnych drukarek w systemie',
            selectPrinter: 'Wybierz drukarkę', availablePrinters: 'Dostępne drukarki:',
            printerHint: 'Wybrana drukarka zostanie zapamiętana dla przyszłych wydruków.',
            printError: 'Błąd drukowania', printErrorText: 'Wystąpił problem podczas przygotowywania wydruku. Spróbuj ponownie.',
            pdfInProgress: 'Przygotowywanie pliku PDF...',
            infoTitle: 'Informacje o Systemie', howToUse: 'Jak używać',
            howToUseItems: ['Kliknij, aby <strong>wczytać plik CSV</strong>.', 'Użyj <strong>sortowania kolumn</strong> do organizacji danych.', 'Przełączaj motyw <strong>jasny/ciemny</strong>.', 'Dane są <strong>zapisywane automatycznie</strong>.', '<strong>Ctrl + Klik</strong> na drukuj = szybkie drukowanie.'],
            features: 'Funkcje Systemu', featuresItems: ['Szybkie wczytywanie CSV.', 'Drukowanie do PDF.', 'Bezpieczeństwo: dane przetwarzane lokalnie.'],
            qrInfo: 'Kody QR', qrInfoItems: ['Generuj <strong>kody QR</strong> z przejrzyście sformatowaną listą pojazdów.', 'Kody QR zawierają <strong>czytelnie ułożone dane</strong>: lokalizację, typ, czas na placu i ID.', 'Idealny do <strong>łatwego odczytu</strong> na urządzeniach mobilnych.', 'Tekst jest <strong>strukturyzowany</strong> z separatorami dla lepszej czytelności.'],
            systemVersion: 'System Zarządzania Pojazdami v3.1', gotIt: 'Rozumiem!', ok: 'OK', cancel: 'Anuluj', yes: 'Tak, wyczyść!',
            actionsHeader: 'Akcje', summaryHeader: 'Podsumowanie Floty', tractorsSummary: 'Ciągniki', boxtrucksSummary: 'Dostawcze', totalSummary: 'Suma',
            placeholderTractors: 'Wczytaj plik CSV, aby zobaczyć dane o ciągnikach.', placeholderBoxTrucks: 'Wczytaj plik CSV, aby zobaczyć dane o samochodach dostawczych.',
            allVehicles: 'Wszystkie Pojazdy', placeholderAllVehicles: 'Wczytaj plik CSV, aby zobaczyć dane o pojazdach.',
            printDate: 'Data wydruku', savePdf: 'Zapisz PDF',
            qrCodeHeader: 'Kod QR', qrCodeDesc: 'Zeskanuj aby zobaczyć listę pojazdów', generateQr: 'Generuj QR',
            qrMobileTitle: '📱 Generator Kodów QR', qrMobileSubtitle: 'Wybierz typ kodu QR zoptymalizowany dla urządzeń mobilnych',
            qrCompactTitle: 'Lista Kompletna', qrCompactDesc: 'Wszystkie {count} pojazdów z tabeli<br><small>Czytelny format mobilny</small>',
            qrMobileOptimized: '📱 <strong>Zoptymalizowane dla Mobile:</strong> Wszystkie kody QR używają wysokiego kontrastu i optymalnego rozmiaru dla kamer smartfonów<br>🔍 <strong>Inteligentne Skanowanie:</strong> Korekcja błędów zapewnia niezawodne odczytywanie nawet przy słabym oświetleniu',
        },
        en: {
            commandCenterTitle: 'Vehicle Command Center', noFileSelected: 'No file selected',
            tractorVehicles: 'Tractors', boxTruckVehicles: 'Box Trucks',
            location: 'Location', type: 'Type', timeInYard: 'Time in Yard', vehicleId: 'Vehicle ID', notes: 'Notes',
            uploadData: 'Upload CSV', printReport: 'Print', resetData: 'Reset', toggleTheme: 'Theme', showInfo: 'Info',
            noDataToPrint: 'No data to print', noDataMessage: 'Load a CSV file to print the list.',
            confirmReset: 'Clear all data?', resetWarning: "This action cannot be undone.",
            dataReset: 'Data Reset', resetSuccess: 'All vehicle data has been cleared.',
            csvLoading: 'Processing File...', csvLoadingText: 'Please wait while the CSV data is being loaded.',
            csvLoaded: 'File Loaded', csvSuccess: ({ count }) => `Successfully imported ${count} vehicles.`,
            csvWarningTitle: 'Warning', csvWarningText: "No matching vehicles (Tractor, Box Truck) found. Check the 'Type' column in your CSV file.",
            csvEmptyTitle: 'Empty File', csvEmptyText: 'The selected CSV file is empty.',
            printStarted: 'Printing Started', printInProgress: 'Generating print preview...',
            printerDetection: 'Detecting Printers...', printerDetectionText: 'Checking available printers in the system',
            selectPrinter: 'Select Printer', availablePrinters: 'Available Printers:',
            printerHint: 'Selected printer will be remembered for future prints.',
            printError: 'Print Error', printErrorText: 'An error occurred while preparing the print. Please try again.',
            pdfInProgress: 'Preparing PDF file...',
            infoTitle: 'System Information', howToUse: 'How to Use',
            howToUseItems: ['Click to <strong>upload a CSV file</strong>.', 'Use <strong>column sorting</strong> to organize data.', 'Toggle <strong>light/dark themes</strong>.', 'Your data is <strong>saved automatically</strong>.', '<strong>Ctrl + Click</strong> on print = quick printing.'],
            features: 'System Features', featuresItems: ['Fast CSV loading.', 'PDF printing.', 'Secure: data is processed locally.'],
            qrInfo: 'QR Codes', qrInfoItems: ['Generate <strong>QR codes</strong> with clearly formatted vehicle list.', 'QR codes contain <strong>well-structured data</strong>: location, type, time in yard, and ID.', 'Perfect for <strong>easy reading</strong> on mobile devices.', 'Text is <strong>organized</strong> with separators for better readability.'],
            systemVersion: 'Vehicle Management System v3.1', gotIt: 'Got it!', ok: 'OK', cancel: 'Cancel', yes: 'Yes, reset it!',
            actionsHeader: 'Actions', summaryHeader: 'Fleet Summary', tractorsSummary: 'Tractors', boxtrucksSummary: 'Box Trucks', totalSummary: 'Total Fleet',
            placeholderTractors: 'Upload a CSV file to see tractor data.', placeholderBoxTrucks: 'Upload a CSV file to see box truck data.',
            allVehicles: 'All Vehicles', placeholderAllVehicles: 'Upload a CSV file to see vehicle data.',
            printDate: 'Print date', savePdf: 'Save as PDF',
            qrCodeHeader: 'QR Code', qrCodeDesc: 'Scan to view vehicle list', generateQr: 'Generate QR',
            qrMobileTitle: '📱 QR Code Generator', qrMobileSubtitle: 'Choose QR code type optimized for mobile devices',
            qrCompactTitle: 'Complete List', qrCompactDesc: 'All {count} vehicles from table<br><small>Mobile-friendly format</small>',
            qrMobileOptimized: '📱 <strong>Mobile Optimized:</strong> All QR codes use high contrast and optimal size for smartphone cameras<br>🔍 <strong>Smart Scanning:</strong> Error correction ensures reliable reading even in poor lighting',
        }
    };

    let currentLanguage = localStorage.getItem('language') || 'en';
    const t = (key, args) => {
        const template = translations[currentLanguage][key] || key;
        return typeof template === 'function' ? template(args) : template;
    };

    function translateUI() {
        document.title = t('commandCenterTitle');
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            const type = el.dataset.langType || 'textContent';
            const defaultText = el.dataset.langDefault || '';
            const translated = t(key, {});

            if (el.id === 'file-name' && el.textContent !== defaultText) {
                return; // Don't translate the filename itself
            }

            if (type === 'placeholder') {
                el.placeholder = translated;
            } else {
                el.textContent = translated;
            }
        });
        document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();
    }

    // --- Event Listeners ---
    document.getElementById('languageToggle').addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        localStorage.setItem('language', currentLanguage);
        translateUI();
    });

    const uploadSection = document.getElementById('upload-section');
    uploadSection.addEventListener('dragover', (e) => { e.preventDefault(); uploadSection.classList.add('drop-zone-active'); });
    uploadSection.addEventListener('dragleave', () => uploadSection.classList.remove('drop-zone-active'));
    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.classList.remove('drop-zone-active');
        if (e.dataTransfer.files.length) handleCSV(e.dataTransfer.files[0], t);
    });
    document.getElementById('csvFile').addEventListener('change', (e) => {
        if (e.target.files.length) handleCSV(e.target.files[0], t);
    });

    // Tab functionality removed - using unified view

    document.getElementById('toggleInfoBtn').addEventListener('click', () => {
        const createList = (items) => `<ul class="info-modal-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        Swal.show({
            title: `<i class="bi bi-info-circle"></i> ${t('infoTitle')}`,
            html: `
                <div class="info-modal-content">
                    <h3 class="info-modal-heading">${t('howToUse')}</h3>
                    ${createList(t('howToUseItems'))}
                    <h3 class="info-modal-heading">${t('features')}</h3>
                    ${createList(t('featuresItems'))}
                    <h3 class="info-modal-heading">${t('qrInfo')}</h3>
                    ${createList(t('qrInfoItems'))}
                    <p class="info-modal-version">${t('systemVersion')}</p>
                </div>`,
            width: '600px', showCloseButton: true, confirmButtonText: `<i class="bi bi-check-lg"></i> ${t('gotIt')}`
        });
    });

    document.getElementById('printBtn').addEventListener('click', (e) => {
        // Check if Ctrl key is held - if so, use quick print (bypass printer selection)
        if (e.ctrlKey) {
            quickPrintTable(t);
        } else {
            printTable(t);
        }
    });
    document.getElementById('savePdfBtn').addEventListener('click', () => savePdfTable(t));
    document.getElementById('generateQrBtn').addEventListener('click', () => generateQRCode(t));
    document.getElementById('resetBtn').addEventListener('click', () => {
        Swal.fire({
            title: t('confirmReset'), text: t('resetWarning'), icon: 'warning',
            showCancelButton: true, confirmButtonColor: '', cancelButtonColor: '',
            confirmButtonText: t('yes'), cancelButtonText: t('cancel')
        }).then(result => result.isConfirmed && resetApplication(t));
    });

    const themeToggleBtn = document.getElementById('themeToggle');
    function updateTheme(theme) {
        document.documentElement.setAttribute('theme', theme);
        themeToggleBtn.querySelector('i').className = `bi bi-${theme === 'dark' ? 'sun' : 'moon'}`;
    }
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateTheme(savedTheme);
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        updateTheme(newTheme);
    });

    document.querySelectorAll('.data-table thead').forEach(th => th.addEventListener('click', handleSort));

    // --- Initial Load ---
    loadSavedData();
    translateUI();
    if (!allTractors.length && !allBoxTrucks.length) {
        renderTables([], []);
        // Dodaj migotanie jeśli nie ma danych
        document.getElementById('file-name').classList.add('no-file-blink');
    }
});

// Native JavaScript Dialog Functions
function createLoadingDialog(title, message, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'printer-dialog-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'printer-dialog loading';

    dialog.innerHTML = `
        <div class="loading-title">${title}</div>
        <div class="loading-text">${message}</div>
        <div class="loading-spinner"></div>
        <button id="cancel-detection" class="modal-btn cancel">Anuluj</button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Handle cancel button
    const cancelBtn = dialog.querySelector('#cancel-detection');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    });

    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
            if (onCancel) onCancel();
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Handle click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
            if (onCancel) onCancel();
        }
    });

    return {
        close: () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleEscape);
            }
        }
    };
}

function createPrinterSelectionDialog(title, printers, onConfirm, onCancel, t) {
    const overlay = document.createElement('div');
    overlay.className = 'printer-dialog-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'printer-dialog selection';

    const savedPrinter = localStorage.getItem('preferred_printer') || 'default';

    const printerOptions = printers.map(printer => {
        const defaultLabel = printer.isDefault ?
            (t('systemVersion').includes('Vehicle') ? ' (Default)' : ' (Domyślna)') : '';
        return `<option value="${printer.id}" ${printer.id === savedPrinter ? 'selected' : ''}>
            ${printer.name}${defaultLabel}
        </option>`;
    }).join('');

    dialog.innerHTML = `
        <div>
            <h3><i class="bi bi-printer" style="color: var(--highlight-color);"></i> ${title}</h3>
            <label>${t('availablePrinters')}</label>
            <select id="printer-select">
                ${printerOptions}
            </select>
            <div class="hint-box">
                <i class="bi bi-lightbulb" style="color: var(--highlight-color);"></i> <strong>Wskazówka:</strong> ${t('printerHint')}
            </div>
        </div>
        <div class="button-group">
            <button id="cancel-printer" class="modal-btn cancel"><i class="bi bi-x-lg" style="font-size: 1rem;"></i> ${t('cancel')}</button>
            <button id="confirm-printer" class="modal-btn primary"><i class="bi bi-printer" style="font-size: 1rem;"></i> ${t('printReport')}</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Handle buttons
    const cancelBtn = dialog.querySelector('#cancel-printer');
    const confirmBtn = dialog.querySelector('#confirm-printer');
    const selectElement = dialog.querySelector('#printer-select');

    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    });

    confirmBtn.addEventListener('click', () => {
        const selectedPrinter = selectElement.value;
        localStorage.setItem('preferred_printer', selectedPrinter);
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm(selectedPrinter);
    });

    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
            if (onCancel) onCancel();
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Handle click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
            if (onCancel) onCancel();
        }
    });

    // Focus on select element
    setTimeout(() => selectElement.focus(), 100);
}

// Function to detect available printers
async function detectAvailablePrinters() {
    try {
        // Try to get printer list using available methods
        return await getPrinterList();
    } catch (error) {
        console.log('Printer detection not supported:', error);
        // Return basic printer options as fallback
        return [
            { name: 'System Default', id: 'default', isDefault: true },
            { name: 'Microsoft Print to PDF', id: 'pdf', isDefault: false }
        ];
    }
}

// Get printer list using available methods
async function getPrinterList() {
    try {
        // Try to get more detailed printer info for Windows systems
        if (navigator.userAgent.includes('Windows')) {
            return await getWindowsPrinters();
        }

        // Fallback to common system printers for other systems
        return [
            { name: 'System Default', id: 'default', isDefault: true },
            { name: 'Print to PDF', id: 'pdf', isDefault: false },
            { name: 'Save as Document', id: 'document', isDefault: false }
        ];
    } catch (error) {
        return [{ name: 'System Default', id: 'default', isDefault: true }];
    }
}

// Enhanced Windows printer detection
async function getWindowsPrinters() {
    try {
        // Common Windows printers based on typical installations
        const commonPrinters = [
            { name: 'System Default Printer', id: 'default', isDefault: true },
            { name: 'Microsoft Print to PDF', id: 'pdf', isDefault: false },
            { name: 'Microsoft XPS Document Writer', id: 'xps', isDefault: false },
            { name: 'OneNote (Desktop)', id: 'onenote', isDefault: false },
            { name: 'Fax', id: 'fax', isDefault: false }
        ];

        // Note: In a browser environment, we cannot actually detect installed printers
        // This provides a reasonable set of options that are commonly available on Windows
        return commonPrinters;
    } catch (error) {
        return [
            { name: 'System Default Printer', id: 'default', isDefault: true },
            { name: 'Microsoft Print to PDF', id: 'pdf', isDefault: false }
        ];
    }
}


// Show printer selection dialog using native JavaScript
function showPrinterSelectionDialog(t, printers) {
    return new Promise((resolve) => {
        createPrinterSelectionDialog(
            t('selectPrinter'),
            printers,
            (selectedPrinter) => resolve(selectedPrinter), // onConfirm
            () => resolve(null), // onCancel
            t
        );
    });
}

// Enhanced print function with simplified approach and improved styling
function printTable(t) {
    const tractorCount = document.querySelectorAll('#dataTable tbody tr').length;
    const totalCount = tractorCount; // Using unified table view

    // Don't print if no data
    if (totalCount === 0) {
        Swal.show({
            title: t('noDataToPrint'),
            text: t('noDataMessage'),
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: t('ok')
        });
        return;
    }

    const printBtn = document.getElementById('printBtn');

    // Set loading state
    if (printBtn) {
        printBtn.disabled = true;
        printBtn.classList.add('loading');
    }

    // Show loading notification
    Swal.show({
        title: `⚡ ${t('printStarted')}`,
        text: t('printInProgress'),
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: 'success'
    });

    const printWindow = window.open('', '_blank');

    // A4-optimized print styles
    const style = `
        <style>
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0.2cm;
                font-size: 9pt;
                line-height: 1.2;
                background: #ffffff !important;
                color: #000000 !important;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .print-header {
                text-align: center;
                margin-bottom: 0.15rem;
                border-bottom: 1px solid #3498db;
                padding-bottom: 0.1rem;
                flex-shrink: 0;
            }
            
            .print-title {
                font-size: 1rem;
                font-weight: 700;
                color: #2c3e50 !important;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                margin: 0;
            }
            
            .print-subtitle {
                font-size: 1rem;
                color: #7f8c8d !important;
                font-weight: 500;
                margin: 0.1rem 0 0 0;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0.1rem 0;
                font-size: 1rem;
                table-layout: fixed;
                flex-grow: 1;
            }
            
            /* Optymalne szerokości kolumn dla A4 landscape */
            th:nth-child(1), td:nth-child(1) { width: 18%; } /* Location */
            th:nth-child(2), td:nth-child(2) { width: 12%; } /* Type */
            th:nth-child(3), td:nth-child(3) { width: 15%; } /* Time in Yard */
            th:nth-child(4), td:nth-child(4) { width: 20%; } /* Vehicle ID */
            th:nth-child(5), td:nth-child(5) { width: 35%; } /* Notes */
            
            th {
                background-color: #34495e !important;
                color: #ffffff !important;
                font-weight: 700;
                font-size: 1rem;
                padding: 3px 4px;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 0.2px;
                border: 0.5px solid #2c3e50 !important;
            }
            
            td {
                padding: 3px 4px;
                text-align: left;
                font-size: 0.7rem;
                line-height: 1.2;
                word-wrap: break-word;
                vertical-align: middle;
                color: #000000 !important;
                border: 0.5px solid #dee2e6 !important;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            tr:nth-child(even) {
                background-color: #f8f9fa !important;
            }
            
            /* Kolorowe obramowania kolumn - cieńsze dla A4 */
            td:nth-child(1) { /* Location */
                font-weight: 600;
                border-left: 1px solid #e74c3c !important;
                text-align: left;
                padding-left: 6px;
            }
            
            td:nth-child(2) { /* Type */
                font-weight: 600;
                border-left: 1px solid #27ae60 !important;
                text-align: left;
                padding-left: 6px;
            }
            
            td:nth-child(3) { /* Time in Yard */
                font-weight: 600;
                border-left: 1px solid #f39c12 !important;
                text-align: left;
                padding-left: 6px;
            }
            
            td:nth-child(4) { /* Vehicle ID */
                font-weight: 700;
                font-family: 'Courier New', monospace;
                border-left: 1px solid #3498db !important;
                text-align: left;
                padding-left: 6px;
            }
            
            td:nth-child(5) { /* Notes */
                color: #333333 !important;
                border-left: 1px solid #95a5a6 !important;
                background-color: rgba(149, 165, 166, 0.02) !important;
                font-size: 0.65rem;
                text-align: left;
                padding-left: 6px;
            }
            
            .print-summary {
                margin-top: 0.1rem;
                padding: 0.2rem;
                border: 0.5px solid #dee2e6 !important;
                background-color: #f8f9fa !important;
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-shrink: 0;
            }
            
            .summary-item {
                text-align: center;
                padding: 0.15rem;
                background-color: #ffffff !important;
                border: 0.5px solid #ecf0f1 !important;
                flex: 1;
                margin: 0 0.1rem;
            }
            
            .summary-label {
                font-size: 0.55rem;
                color: #7f8c8d !important;
                text-transform: uppercase;
                font-weight: 600;
                margin-bottom: 0.05rem;
                display: block;
            }
            
            .summary-number {
                font-size: 0.85rem;
                font-weight: 700;
                color: #2c3e50 !important;
            }
            
            .summary-total {
                color: #e74c3c !important;
                font-size: 0.95rem;
            }
            
            .print-footer {
                text-align: center;
                margin-top: 0.1rem;
                font-size: 0.4rem;
                color: #95a5a6 !important;
                border-top: 0.5px solid #dee2e6 !important;
                padding-top: 0.1rem;
                flex-shrink: 0;
            }
            
            @page {
                size: A4 landscape;
                margin: 0.1cm;
            }
            
            /* Zapobieganie łamaniu strony */
            table, .print-summary, .print-header {
                page-break-inside: avoid;
            }
            
            /* Maksymalne wykorzystanie przestrzeni A4 */
            html, body {
                width: 100%;
                height: 100vh;
                margin: 0;
                padding: 0;
            }
            
            /* Zwiększenie gęstości danych */
            tbody tr {
                height: auto;
                min-height: 1.1rem;
            }
            
            /* Lepsze wyrównanie tekstu */
            td {
                white-space: nowrap;
            }
            
            /* Specjalne wyrównanie dla kolumny Notes */
            td:nth-child(5) {
                white-space: normal;
                word-break: break-word;
                hyphens: auto;
            }
            
            /* Kompaktowe wyświetlanie dla maksymalnej ilości wierszy */
            .table-container {
                height: calc(100vh - 3rem);
                overflow: visible;
            }
            
            /* Optymalizacja dla dużej ilości danych */
            @media print {
                tbody tr {
                    break-inside: avoid;
                }
                
                /* Zmniejszenie odstępów między wierszami */
                tr {
                    margin: 0;
                    padding: 0;
                }
            }
        }
        </style>
    `;

    const content = `
        <html>
        <head>
            <title>Vehicle List - ${new Date().toLocaleString()}</title>
            <meta charset="UTF-8">
            ${style}
        </head>
        <body>
            <div class="print-header">
                <h1 class="print-title">Vehicle Report</h1>
                <h2 class="print-subtitle">${t('allVehicles')} - Total: ${totalCount}</h2>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>${t('location')}</th>
                        <th>${t('type')}</th>
                        <th>${t('timeInYard')}</th>
                        <th>${t('vehicleId')}</th>
                        <th>${t('notes')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(document.querySelectorAll('#dataTable tbody tr'))
            .map(row => `<tr>${Array.from(row.cells).map(cell => `<td>${cell.textContent}</td>`).join('')}</tr>`)
            .join('')}
                </tbody>
            </table>
            
            <div class="print-summary">
                <div class="summary-item">
                    <span class="summary-label">${t('tractorsSummary')}</span>
                    <span class="summary-number">${allTractors.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">${t('boxtrucksSummary')}</span>
                    <span class="summary-number">${allBoxTrucks.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">${t('totalSummary')}</span>
                    <span class="summary-number summary-total">${allTractors.length + allBoxTrucks.length}</span>
                </div>
            </div>
            
            <div class="print-footer">
                ${t('printDate')}: ${new Date().toLocaleString()} | ${t('systemVersion')}
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();

    // Auto-print after content loads
    setTimeout(() => {
        printWindow.print();
        printWindow.close();

        // Reset button state
        if (printBtn) {
            printBtn.disabled = false;
            printBtn.classList.remove('loading');
        }
    }, 500);
}

// Quick print function (bypasses printer selection dialog)
function quickPrintTable(t) {
    const vehiclesVisible = document.querySelectorAll('#dataTable tbody tr').length;

    if (vehiclesVisible === 0) {
        Swal.show({ title: t('noDataToPrint'), text: t('noDataMessage'), icon: 'info', confirmButtonText: t('ok') });
        return;
    }

    // Show quick print notification
    Swal.fire({
        title: `<i class="bi bi-lightning-charge"></i> ${t('printStarted')}`,
        text: `${t('printInProgress')} (${t('features').split(' ')[0]} druk)`,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: 'success'
    });

    // Use existing print logic without printer selection
    const printWindow = window.open('', '_blank');
    const tableHeaders = `
        <thead>
            <tr>
                <th>${t('location')}</th><th>${t('type')}</th><th>${t('timeInYard')}</th>
                <th>${t('vehicleId')}</th><th>${t('notes')}</th>
            </tr>
        </thead>`;

    const getTableRows = (tableId) => Array.from(document.querySelectorAll(`#${tableId} tbody tr`))
        .map(row => `<tr>${Array.from(row.cells).map(cell => `<td>${cell.textContent}</td>`).join('')}</tr>`).join('');

    const content = `
        <html>
            <head>
                <title>Vehicle List - ${new Date().toLocaleString()}</title>
                <link rel="stylesheet" href="index.css">
            </head>
            <body class="print-document">
                <h1 class="print-title"><i class="bi bi-truck"></i> ${t('commandCenterTitle')}</h1>
                <h2 class="print-subtitle"><i class="bi bi-clipboard-check"></i> ${t('allVehicles')}</h2>
                
                <table class="print-table">${tableHeaders}<tbody>${getTableRows('dataTable')}</tbody></table>
                
                <div class="print-summary-box">
                    <h3><i class="bi bi-bar-chart"></i> ${t('summaryHeader')}</h3>
                    <div class="print-summary-grid">
                        <div class="print-summary-item">
                            <div class="print-summary-label">${t('tractorsSummary')}</div>
                            <div class="print-summary-number">${allTractors.length}</div>
                        </div>
                        <div class="print-summary-item">
                            <div class="print-summary-label">${t('boxtrucksSummary')}</div>
                            <div class="print-summary-number">${allBoxTrucks.length}</div>
                        </div>
                        <div class="print-summary-item">
                            <div class="print-summary-label">${t('totalSummary')}</div>
                            <div class="print-summary-number print-summary-total">${allTractors.length + allBoxTrucks.length}</div>
                        </div>
                    </div>
                    <p class="print-date">
                        <i class="bi bi-calendar-date"></i> ${t('printDate')}: ${new Date().toLocaleString()}
                    </p>
                </div>
            </body>
        </html>`;

    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

function savePdfTable(t) {
    const vehiclesVisible = document.querySelectorAll('#dataTable tbody tr').length;

    if (vehiclesVisible === 0) {
        Swal.show({ title: t('noDataToPrint'), text: t('noDataMessage'), icon: 'info', confirmButtonText: t('ok') });
        return;
    }

    Swal.show({
        title: t('printStarted'),
        text: t('pdfInProgress'),
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    const printWindow = window.open('', '_blank');
    const tableHeaders = `
        <thead>
            <tr>
                <th>${t('location')}</th><th>${t('type')}</th><th>${t('timeInYard')}</th><th>${t('vehicleId')}</th><th>${t('notes')}</th>
            </tr>
        </thead>`;

    const getTableRows = (tableId) => Array.from(document.querySelectorAll(`#${tableId} tbody tr`))
        .map(row => `<tr>${Array.from(row.cells).map(cell => `<td>${cell.textContent}</td>`).join('')}</tr>`).join('');

    const content = `
        <html>
            <head>
                <title>Vehicle List PDF - ${new Date().toLocaleString()}</title>
                <link rel="stylesheet" href="index.css">
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 100);
                    }
                </script>
            </head>
            <body class="print-document">
                <h1 class="print-title">Vehicle Report (PDF)</h1>
                <h2 class="print-subtitle">${t('allVehicles')}</h2>
                <table class="print-table">${tableHeaders}<tbody>${getTableRows('dataTable')}</tbody></table>
                
                <div class="print-summary-box">
                    <h3><i class="bi bi-bar-chart"></i> ${t('summaryHeader')}</h3>
                    <div class="print-summary-grid">
                        <div class="print-summary-item">
                            <strong><i class="bi bi-truck"></i> ${t('tractorVehicles')}</strong><br>
                            <span class="print-summary-number">${allTractors.length}</span>
                        </div>
                        <div class="print-summary-item">
                            <strong><i class="bi bi-truck-front"></i> ${t('boxTruckVehicles')}</strong><br>
                            <span class="print-summary-number">${allBoxTrucks.length}</span>
                        </div>
                        <div class="print-summary-item">
                            <strong><i class="bi bi-graph-up"></i> ${t('totalSummary')}</strong><br>
                            <span class="print-summary-number print-summary-total">${allTractors.length + allBoxTrucks.length}</span>
                        </div>
                    </div>
                    <p class="print-date">
                        ${t('printDate')}: ${new Date().toLocaleString()}
                    </p>
                </div>
            </body>
        </html>`;

    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
        Swal.close();
    }, 1000);
}

function generateQRCode(t) {
    const allVehicles = [...allTractors, ...allBoxTrucks];

    if (allVehicles.length === 0) {
        Swal.show({
            title: t('noDataToPrint'),
            text: t('noDataMessage'),
            icon: 'info',
            confirmButtonText: t('ok')
        });
        return;
    }

    // Directly generate compact list QR (removed selection modal)
    generateMobileQR(t, 'compact', allVehicles);
}

function generateMobileQR(t, type, allVehicles) {
    const date = new Date();
    const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    let qrText = '';
    let qrTitle = '';
    let qrSize = 600;  // Zwiększony rozmiar dla lepszej czytelności
    let errorLevel = 'H';  // Wysoki poziom korekcji błędów

    if (type === 'compact') {
        // Complete vehicle list from table - mobile optimized
        const vehiclesToShow = allVehicles; // Cała lista z tabeli

        qrTitle = 'Vehicle List (Mobile)';
        qrTitle = '<i class="bi bi-clipboard-check"></i> Vehicle List (Mobile)';
        // Bardzo prosty, czytelny format dla mobile
        qrText = `POJAZDY ${dateStr.slice(-5)}\n`; // Tylko dzień.miesiąc
        qrText += `Razem: ${allVehicles.length}\n`;
        qrText += `Ciagniki: ${allTractors.length}, Dostawcze: ${allBoxTrucks.length}\n`;
        qrText += `\n`; // Pusta linia dla czytelności

        vehiclesToShow.forEach((vehicle, index) => {
            const type = vehicle.Type === 'Tractor' ? 'CIAGNIK' : 'DOSTAWCZY';
            const loc = (vehicle.Location || 'Brak').substring(0, 12);
            const id = (vehicle['Vehicle ID'] || '').substring(0, 10);
            const notes = (vehicle.Notes || '').substring(0, 20);

            // Format czytelny na mobile
            qrText += `${index + 1}. ${type}\n`;
            qrText += `   Lokalizacja: ${loc}\n`;

            if (id.trim()) {
                qrText += `   ID: ${id}\n`;
            }

            if (notes && notes.trim() !== '' && notes !== 'N/A') {
                qrText += `   Uwagi: ${notes}\n`;
            }

            qrText += `\n`; // Pusta linia między pojazdami
        });

        qrText += `\nWygenerowano: ${timeStr}`;
        qrText += `\nSystem Zarzadzania Pojazdami v3.1`;
    }

    // Show loading modal
    Swal.show({
        title: '⚡ Generating Mobile QR...',
        text: 'Creating optimized QR code for mobile devices',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Generate QR code
    setTimeout(() => {
        try {
            if (typeof QRious === 'undefined') {
                throw new Error('QRious library not loaded');
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = qrSize;
            tempCanvas.height = qrSize;

            const qr = new QRious({
                element: tempCanvas,
                value: qrText,
                size: qrSize,
                background: '#ffffff',
                backgroundAlpha: 1.0,
                foreground: '#000000',
                foregroundAlpha: 1.0,
                level: errorLevel,
                padding: 40,  // Dodane białe marginesy
                mime: 'image/png'
            });

            const qrDataUrl = tempCanvas.toDataURL('image/png');

            if (!qrDataUrl || qrDataUrl.length < 100) {
                throw new Error('QR code data URL is invalid');
            }

            // Mobile-optimized QR display
            const isMobile = window.innerWidth <= 768;
            const qrDisplaySize = isMobile ? '550px' : '650px';

            Swal.show({
                title: qrTitle,
                html: `
                    <div class="qr-modal-container">
                        <!-- QR Code Container -->
                        <img src="${qrDataUrl}" alt="QR Code" class="qr-code-image" style="width: ${qrDisplaySize}; height: ${qrDisplaySize};">
                       
                        <!-- Scanning Tips -->
                        <div class="qr-scanning-tips">
                            <div class="qr-tips-title">
                                <i class="bi bi-clipboard-check"></i> Scanning Tips:
                            </div>
                            <div class="qr-tips-content">
                                • Hold phone 6-12 inches from QR code<br>
                                • Ensure good lighting for best results<br>
                                • Use any QR scanner app or camera<br>
                                • ${errorLevel === 'H' ? 'High error correction for damaged codes' : 'Optimized for fast scanning'}
                            </div>
                        </div>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: '<i class="bi bi-check-lg qr-close-button"></i> Close',
                width: isMobile ? '95%' : '800px',
                position: 'center',
                backdrop: true,
                customClass: {
                    popup: 'qr-mobile-popup'
                },
                replaceModal: true,
                didOpen: () => {
                    // Store current translation function for button access
                    window.currentT = t;
                }
            });

        } catch (error) {
            console.error('QR Code generation error:', error);

            Swal.show({
                title: '❌ QR Generation Failed',
                html: `
                    <div class="qr-error-container">
                        <div class="qr-error-icon"><i class="bi bi-exclamation-triangle"></i></div>
                        <p class="qr-error-message">
                            QR code generation failed, but here's your vehicle data:
                        </p>
                        <div class="qr-error-data">${qrText}</div>
                        <p class="qr-error-details">
                            Error: ${error.message}
                        </p>
                    </div>
                `,
                width: isMobile ? '95%' : '550px',
                confirmButtonText: 'Close',
                replaceModal: true
            });
        }
    }, 300);
}

// Download QR function
function downloadQR(dataUrl, type) {
    const link = document.createElement('a');
    link.download = `vehicle-qr-${type}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

