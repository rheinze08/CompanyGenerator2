const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'brain_deliverables.json'), 'utf8'));
const outputDir = path.join(root, 'output');
fs.mkdirSync(outputDir, { recursive: true });

const file = name => source.files.find(item => item.path === name)?.content || {};
const context = file('web_crawl/website_context.json');
const profiles = file('social_discovery/social_profiles.json').profiles || [];
const originalName = /fitlife brands,?\s*(inc\.)?/gi;
const brand = "Roland's Power Health Max Food Company";
const sanitizeBranding = value => String(value ?? '')
  .replace(originalName, brand)
  .replace(/fitlifebrands\.com/gi, 'rolandspowerhealthmaxfood.com');
const safe = value => JSON.stringify(value).replace(/</g, '\\u003c');
const brandPages = (context.page_documents || [])
  .filter(page => /nutrition|laboratories|siren/i.test(page.title || ''))
  .map(page => ({ title: sanitizeBranding(page.title), description: sanitizeBranding(page.meta_description || page.text_excerpt || '') }));
const documents = source.files.filter(item => item.path.startsWith('generated_documents/')).map(item => ({
  name: item.path.split('/').pop(),
  type: item.content_type,
  content: sanitizeBranding(typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)),
}));
const data = { brand, brandPages, documents, profiles, articles: [
  { title: 'Macronutrients 101', text: 'Build a confident routine by understanding the role of protein, carbohydrates, and fats.' },
  { title: '7 Core Principles for Weight Management', text: 'Simple, sustainable habits for an energized approach to your goals.' },
  { title: '5 Cardio Exercises for Beginners', text: 'A friendly place to start moving more and feeling stronger.' },
] };

const html = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Premium nutrition and wellness products from Roland's Power Health Max Food Company.">
  <title>Roland's Power Health Max Food Company | Better Nutrition, Every Day</title>
  <style>
    :root{--ink:#19231b;--muted:#627066;--cream:#fffdf7;--sage:#e2ebd8;--lime:#b9d73f;--forest:#173f2d;--orange:#f26b38;--line:#dce4d5}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font:16px/1.55 Arial,sans-serif}a{color:inherit}.announcement{background:var(--forest);color:#fff;text-align:center;padding:9px 16px;font-size:13px}.header{display:flex;justify-content:space-between;align-items:center;gap:25px;max-width:1200px;margin:auto;padding:22px 28px}.logo{font-weight:900;font-size:18px;line-height:1.05;text-decoration:none;max-width:230px}.logo b{display:block;color:#54872d;font-size:12px;letter-spacing:.12em;margin-bottom:5px}.nav{display:flex;gap:22px;flex-wrap:wrap}.nav a{text-decoration:none;font-weight:700;font-size:14px}.nav a:hover{color:#4d7f27}.hero{background:linear-gradient(115deg,#eff6df 0%,#d6e9bd 62%,#b9d73f 100%)}.hero-inner{max-width:1200px;margin:auto;min-height:510px;padding:88px 28px;display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:55px}.kicker{font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#54872d}.hero h1{font-size:clamp(42px,7vw,78px);line-height:.94;letter-spacing:-.055em;margin:16px 0 22px;max-width:750px}.hero p{max-width:590px;font-size:19px;color:#3e5043}.cta{display:inline-block;background:var(--forest);color:#fff;text-decoration:none;border-radius:5px;padding:14px 21px;font-weight:800;margin-top:14px}.hero-orb{height:310px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 7%,#f6ae5c 8% 20%,#f26b38 21% 35%,#173f2d 36% 58%,#91bd36 59%);box-shadow:0 25px 45px #59733244}.section{max-width:1200px;margin:auto;padding:80px 28px}.section-heading{max-width:650px;margin-bottom:35px}.section-heading h2{font-size:clamp(30px,4.2vw,48px);line-height:1.02;letter-spacing:-.035em;margin:8px 0}.section-heading p{color:var(--muted);font-size:17px}.brands{background:#fff}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid var(--line);padding:25px;border-radius:12px;background:#fff}.card:nth-child(3n+1){border-top:6px solid var(--lime)}.card:nth-child(3n+2){border-top:6px solid var(--orange)}.card:nth-child(3n){border-top:6px solid var(--forest)}.card h3{font-size:22px;margin:0 0 11px}.card p{color:var(--muted);margin:0}.learn{background:var(--forest);color:white}.learn .section-heading p{color:#c7d6cb}.article-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.article{padding:25px;background:#24523b;border-radius:12px}.article h3{margin:0 0 10px;font-size:21px}.article p{color:#d5e5d8}.article a{font-weight:800;color:#d4eb61;text-decoration:none}.documents{background:#f0f4e8}.doc-toolbar{display:flex;gap:12px;align-items:center;margin-bottom:15px}.doc-toolbar input{width:min(500px,100%);padding:12px 14px;border:1px solid #b9c8b5;border-radius:6px;font:inherit}.document-list{display:grid;gap:10px}.document{display:flex;justify-content:space-between;align-items:center;gap:15px;background:#fff;padding:16px 18px;border:1px solid var(--line);border-radius:8px}.document small{display:block;color:var(--muted)}.document button{border:1px solid var(--forest);color:var(--forest);background:#fff;border-radius:5px;padding:8px 12px;font-weight:800;cursor:pointer}.preview{margin-top:14px;background:#fff;padding:18px;border:1px solid var(--line);border-radius:8px;white-space:pre-wrap;max-height:410px;overflow:auto;color:#334039}.social{background:#fff}.social-links{display:flex;gap:12px;flex-wrap:wrap}.social-links a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;background:var(--sage);padding:12px 16px;border-radius:999px;font-weight:800}.social-links a:hover{background:var(--lime)}.contact{background:var(--orange);color:#fff}.contact .section-heading p{color:#fff4ed}.contact-box{display:flex;justify-content:space-between;align-items:center;gap:25px;background:#fff6ef;color:var(--ink);padding:28px;border-radius:12px}.contact-box p{color:var(--muted);margin:7px 0 0}.footer{background:#102d21;color:#d4e3d8;padding:36px 28px;text-align:center;font-size:14px}@media(max-width:750px){.header{align-items:flex-start;flex-direction:column}.hero-inner{grid-template-columns:1fr;padding-top:60px}.hero-orb{height:220px;width:220px}.cards,.article-grid{grid-template-columns:1fr}.section{padding:58px 22px}.contact-box,.document{align-items:flex-start;flex-direction:column}}
  </style>
</head>
<body>
  <div class="announcement">Free continental U.S. shipping on orders over $49.99</div>
  <header class="header"><a class="logo" href="#home"><b>ROLAND'S</b>Power Health Max Food Company</a><nav class="nav" aria-label="Primary navigation"><a href="#home">Home</a><a href="#brands">Our Brands</a><a href="#learn">Learn &amp; Explore</a><a href="#documents">Documents</a><a href="#social">Social Discovery</a><a href="#contact">Contact</a></nav></header>
  <main>
    <section id="home" class="hero"><div class="hero-inner"><div><div class="kicker">Premium wellness, made practical</div><h1>Power your best everyday.</h1><p>Roland's Power Health Max Food Company creates thoughtfully formulated nutrition products for energy, strength, performance, and balanced daily wellness.</p><a class="cta" href="#brands">Explore our brands</a></div><div class="hero-orb" aria-hidden="true"></div></div></section>
    <section id="brands" class="section brands"><div class="section-heading"><div class="kicker">Our brands</div><h2>Support that meets you where you are.</h2><p>Explore the wellness and sports-nutrition lines that shape our product family.</p></div><div id="brand-cards" class="cards"></div></section>
    <section id="learn" class="section learn"><div class="section-heading"><div class="kicker">Learn &amp; explore</div><h2>Small insights. Stronger habits.</h2><p>Practical nutrition and movement resources for the road ahead.</p></div><div id="article-cards" class="article-grid"></div></section>
    <section id="documents" class="section documents"><div class="section-heading"><div class="kicker">Document library</div><h2>Product and company resources.</h2><p>Browse the available reference documents for this Roland's mock-up.</p></div><div id="document-library"><div class="doc-toolbar"><input id="doc-search" type="search" placeholder="Search documents" aria-label="Search documents"></div><div id="document-list" class="document-list"></div><div id="document-preview" class="preview" hidden></div></div></section>
    <section id="social" class="section social"><div class="section-heading"><div class="kicker">Social discovery</div><h2>Find us where you already scroll.</h2><p>Connect through the social profiles discovered in the supplied website data.</p></div><div id="social-links" class="social-links"></div></section>
    <section id="contact" class="section contact"><div class="section-heading"><div class="kicker">Contact</div><h2>Let's start a healthy conversation.</h2><p>Have a product question or general inquiry? We would love to hear from you.</p></div><div class="contact-box"><div><strong>Roland's Power Health Max Food Company</strong><p>Questions, feedback, and partnership inquiries are welcome.</p></div><a class="cta" href="mailto:hello@rolandspowerhealthmaxfood.com">Get in touch</a></div></section>
  </main><footer class="footer">© 2026 Roland's Power Health Max Food Company · Better nutrition, every day.</footer>
  <script id="site-data" type="application/json">__SITE_DATA__</script>
  <script>
    const site = JSON.parse(document.getElementById('site-data').textContent);
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const sanitizeBranding = value => String(value ?? '').replace(/fitlife\s+brands,?\s*(inc\.)?/gi, site.brand).replace(/fitlifebrands\.com/gi, 'rolandspowerhealthmaxfood.com');
    document.getElementById('brand-cards').innerHTML = site.brandPages.map(item => '<article class="card"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.description)+'</p></article>').join('');
    document.getElementById('article-cards').innerHTML = site.articles.map(item => '<article class="article"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.text)+'</p><a href="#documents">Read more →</a></article>').join('');
    const list = document.getElementById('document-list'), preview = document.getElementById('document-preview');
    function renderDocuments(query=''){const found=site.documents.filter(item => (item.name+' '+item.content).toLowerCase().includes(query.toLowerCase()));list.innerHTML=found.length?found.map((item,index)=>'<article class="document"><div><strong>'+escapeHtml(item.name)+'</strong><small>'+escapeHtml(item.type)+'</small></div><button data-document="'+index+'">View document</button></article>').join(''):'<p>No documents match your search.</p>';list.querySelectorAll('[data-document]').forEach(button=>button.addEventListener('click',()=>{const item=found[Number(button.dataset.document)];preview.hidden=false;preview.textContent=sanitizeBranding(item.content)}));}
    document.getElementById('doc-search').addEventListener('input', event => renderDocuments(event.target.value));renderDocuments();
    document.getElementById('social-links').innerHTML = site.profiles.map(profile => '<a href="'+escapeHtml(profile.url)+'" target="_blank" rel="noreferrer">'+escapeHtml(profile.platform)+' <span>↗</span></a>').join('');
  </script>
</body></html>`;

const builtHtml = html.replace('__SITE_DATA__', safe(data));
fs.writeFileSync(path.join(outputDir, 'index.html'), builtHtml);
fs.writeFileSync(path.join(root, 'index.html'), builtHtml);
fs.writeFileSync(path.join(outputDir, 'dependencies.json'), JSON.stringify(['brain_deliverables.json'], null, 2) + '\n');
console.log('Built Roland\'s Power Health Max Food Company website.');
