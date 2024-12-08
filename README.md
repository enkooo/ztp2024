# Zaawansowane Techniki Programowania 2024

## Projekt zaliczeniowy

### Założenia
Celem projektu jest opracowanie systemu przetwarzania danych, przychodzących w czasie rzeczywistym od współpracowników/sprzedawców dużej firmy handlowej. Sposób wymiany danych powinien zapewniać łatwą integrację z systemem współpracownika, nieinteraktywną/zautomatyzowaną wymianę danych, opartą na łatwo wdrażalnych protokołach (http). Elementem odpowiadającym za komunikację wszystkich jego części jest centralna baza danych.
Scalenie backendów w jednolity serwis jest poza zakresem projektu.

### Ograniczenia technologiczne
Ze względu na konieczność kooperacji różnych części projektu, wybór środowiska bazodanowego zostaje narzucony (PostgreSQL). Technologie realizacji poszczególnych części są dowolne, ograniczeniem jest tu uniwersalność wdrożeniowa (Java, Python, Javascript oraz inne środowiska niezależne od platformy uruchomieniowej). Nie zakłada się użycia metod komunikacji wymagających specjalnej konfiguracji/infrastruktury (np. mail).

### Części projektu

#### **SZU** - serwis zgłoszenia udziału współpracownika w programie
Ze względu interaktywny charakter procesu (zarówno od strony współpracownika, jak i centrali firmy), rozwiązanie powinno być klasyczną aplikacją webową z frontendem, pozwalającą na założenie kont w systemie.

Od strony współpracownika serwis ma stwarzać możliwości:
- złożenie wniosku o założenia konta, z określeniem NIPu (który jest kluczem głównym współpracowników), oraz danych tj. nazwa/nazwisko, kontakt itp.
- sprawdzenie stanu wniosku
- po pozytywnym rozpatrzeniu przez centralę firmy, wyświetlenie klucza dostępowego (klucza API) dla celów integracyjnych (początkowo może to być np. UUIDv4)

Od strony centrali firmy, serwis oferuje przeglądanie założonych kont oraz akceptację wniosku, połączoną z wytworzeniem klucza API dla współpracownika.

#### **AZT** - aplikacja zarządzania towarami
Aplikacja webowa z frontendem dostępna z centrali firmy, pozwalająca na zarządzanie towarami. Dla uproszczenia towary są jednostkowe i rozróżnialne. Towary będą później rezerwowane/sprzedawane przez współpracujących sprzedawców. Aplikacja daje wgląd w stan towaru (wolny, zarezerwowany, sprzedany, w drodze do klienta), ale nie pozwala go zmienić. Po utworzeniu rekordu towaru, dla rekordu w stanie nie-wolnym można edytować jedynie pole swobodnych notatek.

#### **EOK** - endpoint obsługi komisowej dla sprzedawcy
Wyłącznie backend, działający wyłącznie z zarejestrowanym kodem API, z endpointami:
- do pozyskania listy dostępnych towarów
- rezerwacji i odwołania rezerwacji towaru
- żądania zmiany rezerwacji towaru na sprzedaż, wraz z podaniem ostatecznej ceny
- sprawdzenia stanu towaru, o ile został on nam wcześniej przydzielony

#### **AOS** - aplikacja obsługi sprzedaży
Aplikacja webowa używana w centrali firmy, pozwalająca na zmianę żądań zmiany rezerwacji na sprzedaż, oraz sprzedaży na wysyłkę.

#### **RAP** - moduł raportów i wizualizacji biznesowej
Agregacja danych i przygotowanie gotowych do użycia (np. w MS Excel) plików raportów.
Uzyskanie dowolną metodą wizualizacji procesów biznesowych zachodzących w firmie.

#### **LOG** - dzienniki pracy systemu
Endpoint dla pozostałych części systemu, pozwalający wysyłać i gromadzić w jednym miejscu wszystkie aktywności (również nieudane). Aplikacja webowa do przeglądania historii.

## Pobranie/aktualizacja projektu

Pobranie ostatniej wersji do nowego katalogu ``ztp2024``
```
git clone https://gitlab.com/mariusz.jarocki/ztp2024.git
```
Aktualizacja posiadanego kodu do ostatniej wersji
```
cd ztp2024
git reset
git pull
```

## Instalacja zależności
```
npm install
cd frontend
npm install
```

## Dostosowanie do własnego środowiska bazodanowego

Skopiować plik ``config-example.json`` do ``config.json`` i dostosować jego treść do własnej konfiguracji.

## Uruchomienie backendu

```
npm start
```
Backend będzie dostępny pod adresem http://localhost:5000 , gdzie ``5000`` jest portem ustawiony w ``config.json``.

## Kompilacja frontendu do wersji produkcyjnej
```
cd frontend
npm run build
```

## Uruchomienie serwera frontendu developerskiego
```
cd frontend
npm run dev
```
Serwer będzie dostępny pod adresem http://localhost:5173 , port ten może być wyższy, jeżeli coś na ``5173`` już pracuje.