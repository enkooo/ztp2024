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

#### **WIZ** - moduł wizualizacji biznesowej
Uzyskanie dowolną metodą wizualizacji procesów biznesowych zachodzących w firmie.

#### **RAP** - moduł raportowy
Agregacja danych i przygotowanie gotowych do użycia (np. w MS Excel) plików raportów.

#### **LOG** - dzienniki pracy systemu
Endpoint dla pozostałych części systemu, pozwalający wysyłać i gromadzić w jednym miejscu wszystkie aktywności (również nieudane). Aplikacja webowa do przeglądania historii.