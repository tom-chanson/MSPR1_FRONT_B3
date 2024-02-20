export const API_URL = 'http://localhost:8080';

export const templateArticle = `# [Nom de la plante]

![Image de la plante](lien_vers_image.png)
*Description de l'image : [Type de Plante]*

## Introduction
[Introduction générale sur la plante, son importance, sa popularité, etc.]

## 1. Connaître votre [Type de Plante]
[Description générale de la plante, ses origines, ses caractéristiques distinctives, etc.]

| Caractéristique        | Description           |
|------------------------|-----------------------|
| Origine                |                       |
| Taille adulte          |                       |
| Lumière                |                       |
| Température            |                       |
| Humidité               |                       |

## 2. Conditions de croissance optimales
[Conseils sur les conditions de lumière, température, humidité, etc., nécessaires pour le bien-être de la plante.]

## 3. Arrosage et fertilisation
[Instructions détaillées sur la fréquence et la méthode d'arrosage, le type de sol et de fertilisant recommandé, etc.]

## 4. Taille et entretien
[Conseils sur la taille régulière, l'élagage, l'élimination des feuilles mortes, etc., pour favoriser la croissance saine de la plante.]

## 5. Prévention des maladies et des ravageurs
[Informations sur les maladies courantes, les ravageurs potentiels et les mesures préventives à prendre pour protéger la plante.]

| Maladie ou Ravageur   | Symptômes             | Traitement             |
|------------------------|-----------------------|------------------------|
|                        |                       |                        |
|                        |                       |                        |
|                        |                       |                        |

## 6. Rempotage et transplantation
[Directives sur le moment opportun pour rempoter la plante, le type de pot et de substrat recommandé, etc.]

## 7. Astuces supplémentaires
[Conseils avancés ou astuces spéciales pour prendre soin de la plante de manière optimale.]

## Conclusion
[Revue des points principaux abordés dans l'article, encouragement à appliquer les conseils donnés, etc.]

---

*N'oubliez pas que chaque plante est unique et peut nécessiter des soins spécifiques. Consultez toujours des sources fiables et expérimentées pour obtenir des conseils personnalisés sur le soin de votre [Type de Plante].*
`

export const route_api = {
    login : "/login",
    register : "/register",
    list_articles : "/article/all",
    article : "/article/",
    create_article : "/article/one",
    library_image : "/bibliotheque/me",
    post_image : "/image",
    post_image_biblioteque : "/bibliotheque/one",
    get_plante : "/mes_plantes",
}