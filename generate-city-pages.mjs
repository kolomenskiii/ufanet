import fs from 'node:fs';
import vm from 'node:vm';

const domain = 'https://ufanethome.ru';
const image = domain + '/assets/images/prev-1200x630.png';
const script = fs.readFileSync('assets/js/script.js', 'utf8');
const definitions = script.slice(script.indexOf('const cityGroups'), script.indexOf('const cityPicker'));
const { cityGroups, cityPrepositional } = vm.runInNewContext(definitions + '\n({cityGroups, cityPrepositional})');
const cities = cityGroups.flatMap(group => group.cities.map(name => ({ name, region: group.region })));
const translit = { а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya' };
const slug = name => [...name.toLowerCase()].map(char => translit[char] ?? (/[a-z0-9-]/.test(char) ? char : '-')).join('').replace(/-+/g, '-').replace(/^-|-$/g, '');
const cityFile = name => name === 'Уфа' ? '' : 'gorod-' + slug(name) + '.html';
const escapeHtml = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const replaceTag = (html, regex, value, label) => {
  if (!regex.test(html)) throw new Error('Missing ' + label);
  return html.replace(regex, value);
};
const meta = (name, value, property = false) => '<meta ' + (property ? 'property' : 'name') + '="' + name + '" content="' + escapeHtml(value) + '">';
const directory = '<section class="city-directory" aria-labelledby="city-directory-title">\n' +
  '<div class="city-directory__inner"><h2 id="city-directory-title">Города подключения</h2><p>Выберите город, чтобы посмотреть страницу подключения и оставить заявку по своему адресу.</p>\n' +
  cityGroups.map(group => '<div class="city-directory__group"><h3>' + escapeHtml(group.region) + '</h3><ul>' +
    group.cities.map(name => '<li><a href="./' + cityFile(name) + '">' + escapeHtml(name) + '</a></li>').join('') +
    '</ul></div>').join('\n') +
  '\n</div></section>\n';

const noindexOnGithub = '<script>if(location.hostname.endsWith(".github.io")){const meta=document.createElement("meta");meta.name="robots";meta.content="noindex,nofollow";document.head.append(meta)}</script>';
const rootRedirect = '<script>if(location.pathname.endsWith("/index.html"))location.replace(document.querySelector("link[rel=canonical]").href+location.search+location.hash)</script>';
const addHeadScripts = (html, isHome) => html.includes('meta.name="robots"') ? html : html.replace('</head>', noindexOnGithub + (isHome ? rootRedirect : '') + '\n</head>');

let root = fs.readFileSync('index.html', 'utf8');
root = addHeadScripts(root, true);
root = root.replace(/<section class="city-directory"[\s\S]*?<\/section>\s*/g, '');
root = root.replace('<footer class="site-footer">', directory + '<footer class="site-footer">');
root = root.replace('<html lang="ru">', '<html lang="ru" data-city="Уфа">');
const pageFiles = [];
for (const city of cities) {
  const file = cityFile(city.name);
  const locative = cityPrepositional[city.name];
  if (!locative) throw new Error('Missing locative: ' + city.name);
  const title = 'Домашний интернет и ТВ Уфанет в ' + locative + ' — тарифы и подключение';
  const description = 'Интернет и телевидение Уфанет в ' + locative + ': сравните тарифы, проверьте возможность подключения по адресу и оставьте заявку онлайн.';
  const url = domain + '/' + file;
  let html = file ? root.replace(rootRedirect, '') : root;
  html = replaceTag(html, /<title>[^<]*<\/title>/, '<title>' + escapeHtml(title) + '</title>', 'title');
  html = replaceTag(html, /<meta name="description" content="[^"]*">/, meta('description', description), 'description');
  html = replaceTag(html, /<meta property="og:title" content="[^"]*">/, meta('og:title', title, true), 'og:title');
  html = replaceTag(html, /<meta property="og:description" content="[^"]*">/, meta('og:description', description, true), 'og:description');
  html = replaceTag(html, /<meta property="og:url" content="[^"]*">/, meta('og:url', url, true), 'og:url');
  html = replaceTag(html, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">', 'canonical');
  html = replaceTag(html, /<html lang="ru" data-city="[^"]*">/, '<html lang="ru" data-city="' + escapeHtml(city.name) + '">', 'data-city');
  html = replaceTag(html, /<h1 id="hero-title">[\s\S]*?<\/h1>/, '<h1 id="hero-title">Интернет и ТВ Уфанет<br><span id="hero-city">в ' + escapeHtml(locative) + '</span></h1>', 'h1');
  html = replaceTag(html, /(<section class="hero__content"[^>]*>\s*<h1[\s\S]*?<\/h1>\s*)<p>[^<]*<\/p>/, '$1<p>Подберите домашний интернет и телевидение в ' + escapeHtml(locative) + '. Уточните доступность подключения по вашему адресу.</p>', 'hero lead');
  html = html.replaceAll('сейчас Уфа', 'сейчас ' + city.name);
  html = html.replaceAll('id="current-city">Уфа', 'id="current-city">' + escapeHtml(city.name));
  html = html.replaceAll('id="application-city" name="city" type="hidden" value="Уфа"', 'id="application-city" name="city" type="hidden" value="' + escapeHtml(city.name) + '"');
  if (city.name === 'Уфа') fs.writeFileSync('index.html', html);
  else { fs.writeFileSync(file, html); pageFiles.push(file); }
}
const contentFiles = ['dlya-biznesa.html','videonablyudenie.html','umnyj-shlagbaum.html','internet-v-kvartiru.html','internet-v-chastnyj-dom.html','internet-dlya-biznesa.html','televidenie.html','privacy-policy.html','personal-data-consent.html'];
for (const file of contentFiles) {
  let html = addHeadScripts(fs.readFileSync(file, 'utf8'), false);
  html = html.replaceAll('./index.html', './');
  html = html.replaceAll(domain + '/index.html', domain + '/');
  const url = domain + '/' + file;
  html = html.replace(/<meta property="og:url" content="[^"]*">/, meta('og:url', url, true));
  if (!html.includes('rel="canonical"')) html = html.replace(/<title>[^<]*<\/title>/, '$&\n<link rel="canonical" href="' + url + '">');
  html = html.replace(/<meta property="og:image" content="[^"]*">/, meta('og:image', image, true));
  html = html.replace(/<meta property="og:image:secure_url" content="[^"]*">/, meta('og:image:secure_url', image, true));
  html = html.replace(/<meta property="og:image:width" content="[^"]*">/, meta('og:image:width', '1200', true));
  html = html.replace(/<meta property="og:image:height" content="[^"]*">/, meta('og:image:height', '630', true));
  html = html.replace(/<meta name="twitter:image" content="[^"]*">/, meta('twitter:image', image));
  if (html.includes('application/ld+json')) {
    html = html.replace(/<script type="application\/ld\+json">([^<]*)<\/script>/, (_, raw) => {
      const article = JSON.parse(raw);
      article.url = url;
      article.mainEntityOfPage = { '@type':'WebPage', '@id':url };
      article.image = { '@type':'ImageObject', url:image, width:1200, height:630 };
      return '<script type="application/ld+json">' + JSON.stringify(article) + '</script>';
    });
  }
  fs.writeFileSync(file, html);
}
const sitemapUrls = ['/', ...pageFiles.map(file => '/' + file), ...contentFiles.filter(file => !file.includes('policy') && !file.includes('consent')).map(file => '/' + file)];
fs.writeFileSync('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapUrls.map(path => '  <url><loc>' + domain + path + '</loc></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync('robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + domain + '/sitemap.xml\n');
fs.writeFileSync('CNAME', 'ufanethome.ru\n');
console.log('Generated ' + pageFiles.length + ' city pages; sitemap has ' + sitemapUrls.length + ' URLs.');

