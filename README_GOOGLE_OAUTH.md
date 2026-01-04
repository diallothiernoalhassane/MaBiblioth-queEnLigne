# Configuration Google OAuth pour la Production

## 1. Console Google Cloud

### URLs configurées :
- **Origine JavaScript autorisée** : `https://ma-biblioth-que-en-ligne.vercel.app`
- **URL de redirection autorisée** : `https://ma-biblioth-que-en-ligne.vercel.app/auth/callback`

## 2. Variables d'environnement

### Backend (Render) :
```env
GOOGLE_CLIENT_ID=532933002424-v36a8fe010srfmfpseno5m109ni5b9g7.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[VOTRE_SECRET_ICI]
JWT_SECRET=[VOTRE_JWT_SECRET_ICI]
```

### Frontend (Vercel) :
```env
VITE_API_URL=https://mabiblioth-queenligne.onrender.com/api
VITE_GOOGLE_CLIENT_ID=532933002424-v36a8fe010srfmfpseno5m109ni5b9g7.apps.googleusercontent.com
```

## 3. Configuration CORS

Le backend est configuré pour accepter les requêtes de :
- `https://ma-biblioth-que-en-ligne.vercel.app`
- `http://localhost:5173` (développement local)

## 4. Flow d'authentification

1. Utilisateur clique sur "Se connecter avec Google"
2. Redirection vers Google OAuth
3. Google redirige vers `/auth/callback` avec un code
4. Le frontend envoie le code au backend
5. Le backend échange le code contre un token d'accès
6. Le backend récupère les infos utilisateur et génère un JWT
7. Le frontend reçoit le JWT et connecte l'utilisateur

## 5. Déploiement

1. **Backend** : Ajouter les variables d'environnement sur Render
2. **Frontend** : Ajouter les variables d'environnement sur Vercel
3. **Redéployer** les deux services
