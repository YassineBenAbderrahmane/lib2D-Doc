# lib2ddoc-api

## 🚀 Introduction
Une API pour **[lib2ddoc](https://gitlab.insa-rouen.fr/acamusat/lib2ddoc)**: Un décodeur du standard 2d-doc français

Une simple application express qui recoit une image PNG sur  `POST /decode`, et retourne le JSON correspondant.

Une page web statique est disponible pour tester l'API `/`

## 🛠 Utilisation
L'API nécessite `lib/lib2ddoc.so`
```
node src/index.js
---
npm run serve
```

![test](/public/readme.png)