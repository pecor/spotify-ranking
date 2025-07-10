# Spotify Music Tournament

Aplikacja do organizowania turniejów muzycznych ze Spotify. Ładujesz piosenki i wybierasz która lepsza w parach eliminacyjnych.

## Co robi

- Logowanie przez Spotify
- Wyszukiwanie albumów/playlist
- Ładowanie piosenek
- Turniej eliminacyjny (1vs1)

## Jak uruchomić

1. Sklonuj repo
2. `npm install`
3. Utwórz aplikację na [Spotify Developer](https://developer.spotify.com/dashboard)
4. Dodaj redirect URI: `http://127.0.0.1:5173/callback` (Spotify blokuje localhost)
5. Utwórz `.env`:
   ```
   VITE_SPOTIFY_CLIENT_ID=twoj_client_id
   ```
6. `npm run dev`

## Jak używać

1. Zaloguj się do Spotify
2. Wyszukaj album/playlistę
3. Załaduj piosenki
4. Kliknij "Start Tournament"
5. Wybieraj lepszą piosenkę w każdej rundzie

## Technologie

- React + TypeScript
- Vite
- Spotify Web API
- CSS

## Struktura

```
src/
├── components/     # Komponenty React
├── services/       # API Spotify
├── types/         # TypeScript types
└── App.tsx        # Main app
```

## TODO

- [ ] Historia turniejów
- [ ] Eksport wyników
- [ ] Dark mode
- [ ] Podgląd audio