export let API_URL = () => {
  if (window.location.hostname === "tom-chanson.github.io") {
    return "https://msprjavab3-production.up.railway.app/";
  } else {
    return "http://localhost:8080";
  }
};

export const templateArticle = `# [Nom de la plante]
...
`;

export const route_api = {
  login: "/login",
  register: "/register",
  list_articles: "/article/all",
  article: "/article_by_id/",
  create_article: "/article/one",
  library_image: "/bibliotheque/me",
  post_image: "/image",
  post_image_biblioteque: "/bibliotheque/one",
  annonce_attente: "/annonce_attente",
  get_plante: "/mes_plantes",
  post_annonce: "/annonce/one",
  put_mail: "/utilisateur/mail",
  put_password: "/utilisateur/password",
  user: "/utilisateur/me",
};

export const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
