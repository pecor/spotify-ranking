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

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/98e54e7a-c02d-44cb-8033-2973500af673" />
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/fac5abae-edfc-43ac-a55f-0292e1cb912c" />
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/3ec7a8df-d97c-4bb6-9cf9-cff97a569c34" />
<img width="3790" height="3355" alt="Image" src="https://github.com/user-attachments/assets/239e919e-367a-4057-87ba-61a2838d3869" />
