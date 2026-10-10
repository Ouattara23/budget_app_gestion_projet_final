# Configuration d’Amia

Amia est affichée sur la landing page. Les réponses du chatbot sont générées par une route serveur, qui charge à chaque demande les deux documents de référence : `Amia_Prompt_Systeme.md` et `BudgetApp_Presentation_Commerciale.md`.

## Fournisseurs IA

Copiez les valeurs de `.env.example` dans votre fichier `.env.local` (ou ajoutez-les aux variables d’environnement de l’hébergeur). Les clés ne doivent jamais porter le préfixe `NEXT_PUBLIC_`.

Configurez `GEMINI_API_KEY` pour activer le fournisseur principal. En cas d’échec réseau, d’erreur HTTP ou de réponse vide, la route essaie ensuite Mistral, puis OpenRouter. Les fournisseurs sans clé sont ignorés. Configurez les trois clés pour disposer de toute la chaîne de secours.

Si tous les modèles sont indisponibles, Amia peut encore répondre aux questions qui correspondent aux FAQ documentées du prompt, avec les réponses de référence. Les autres demandes reçoivent un message temporaire d’indisponibilité, sans réponse improvisée.

Les noms de modèles peuvent être remplacés par `GEMINI_MODEL`, `MISTRAL_MODEL` et `OPENROUTER_MODEL` si nécessaire.

## Formulaire email

Le formulaire de contact utilise l’API Resend. Pour qu’il puisse envoyer des messages, configurez les trois valeurs suivantes côté serveur :

- `RESEND_API_KEY` : la clé API Resend.
- `CONTACT_EMAIL_TO` : l’adresse de réception des messages.
- `CONTACT_EMAIL_FROM` : l’adresse d’expédition vérifiée dans Resend.

Si ces valeurs ne sont pas renseignées, le formulaire indique clairement que l’envoi n’est pas encore configuré.

## Voix

Le bouton microphone utilise la reconnaissance vocale intégrée au navigateur. La disponibilité dépend du navigateur et de ses permissions micro. La dictée est ajoutée au champ texte afin que le client puisse la relire avant l’envoi ; aucun fichier audio n’est transmis à l’API du chatbot.
