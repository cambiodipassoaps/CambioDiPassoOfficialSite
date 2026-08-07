# CambioDiPasso APS - Official Site

The official site of the association Cambio di Passo. Web site made using just HTML, CSS, JavaScript and JSON files.

## Start-up

The loading of `data/content.json` requires an HTTP server. For example from project's folderD run:

```powershell
py -m http.server 8080
```

then go to `http://localhost:8080`.

## Data

- `data/content.json`: projects, documents and news.
- `data/contacts.json`: initial empty structure meant for contacts list.
- `data/donations.json`: initial empty structure meant for donation list.

a purely static site cannot directly write JSON files.
Modules will then write to the browser's `localStorage` and will allow the download trough buttons.
A backend service or a serverless function is required for a proper persistence layer.