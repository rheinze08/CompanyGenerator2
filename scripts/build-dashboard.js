const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'brain_deliverables.json'), 'utf8'));
const outputDir = path.join(root, 'output');
fs.mkdirSync(outputDir, { recursive: true });

const file = name => source.files.find(item => item.path === name)?.content || {};
const context = file('web_crawl/website_context.json');
const profiles = (file('social_discovery/social_profiles.json').profiles || []).map(({ platform, url }) => ({ platform, url }));
const originalName = /fitlife brands,?\s*(inc\.)?/gi;
const brand = "Roland's Power Health Max Food Company";
const sanitizeBranding = value => String(value ?? '')
  .replace(originalName, brand)
  .replace(/fitlifebrands\.com/gi, 'rolandspowerhealthmaxfood.com')
  .replace(/Companyprovides/g, 'Company provides');
const safe = value => JSON.stringify(value).replace(/</g, '\\u003c');

// Complete, customer-facing copy for each product line. Descriptions are written
// out in full from the real brand positioning so nothing reads as truncated or
// placeholder text on the live site.
const brandCopy = [
  {
    match: /core active/i,
    tagline: 'Essential health & fitness solutions',
    description: 'Core Active delivers high-quality diet, health, and sports-nutrition formulations designed to accelerate your progress and give you the results you are working toward. Every product is built to provide essential support for your fitness and nutrition goals, and the full line is available on Amazon and rolandspowerhealthmaxfood.com.',
  },
  {
    match: /biogenetic/i,
    tagline: 'Science-backed weight management',
    description: 'At BioGenetic Laboratories, we believe your health and happiness matter most. We engineer industry-leading, science-based weight-management products to help you reach your goals and feel lighter, healthier, and more confident. Reaching your goals is a shared effort—and supporting you along the way is our promise.',
  },
  {
    match: /pmd/i,
    tagline: 'Innovative sports nutrition since 2002',
    description: 'For more than two decades, PMD has built a proud reputation for high-quality, innovative formulations that make it a pioneer in the nutrition industry. PMD is committed to bringing you the best in supplementation with premium products engineered for next-level, muscle-building results.',
  },
  {
    match: /metis/i,
    tagline: 'Proven science, powerful results',
    description: 'Metis Nutrition is our most advanced supplement line, precision-engineered to deliver specific, significant, and powerful results. Grounded in proven science, Metis products are raising expectations for what focused nutritional supplementation can do for your training and recovery.',
  },
  {
    match: /siren/i,
    tagline: 'Performance-enhancing supplements',
    description: 'SirenLabs provides high-quality, performance-enhancing supplements for everyone striving for an edge in health, fitness, and training. By making innovation your training partner, SirenLabs helps you reach your potential—and is available at select GNC stores, on Amazon, and at rolandspowerhealthmaxfood.com.',
  },
];

const findCopy = title => brandCopy.find(entry => entry.match.test(title || ''));

const brandPages = (context.page_documents || [])
  .filter(page => findCopy(page.title))
  .map(page => {
    const copy = findCopy(page.title);
    return {
      title: sanitizeBranding(page.title),
      tagline: copy.tagline,
      description: sanitizeBranding(copy.description),
    };
  });

// A real best-seller pulled from the catalog, written up in full.
const featured = {
  name: 'Energize',
  tagline: 'The all-day energy pill',
  description: 'Clinically researched, all-day energy with no bitter taste and no sugar crash. Developed by a doctor, Energize uses a proprietary time-release technology that all but guarantees smooth, steady energy with no jitters—just two capsules to carry you through a busy day.',
};

const data = {
  brand,
  brandPages,
  profiles,
  featured,
  articles: [
    { title: 'Macronutrients 101', text: 'Build a confident routine by understanding the role of protein, carbohydrates, and fats in your day.' },
    { title: '7 Core Principles to Help with Weight Loss', text: 'Simple, sustainable habits that add up to real, lasting progress toward your goals.' },
    { title: '5 Great Cardio Exercises for Beginners', text: 'An approachable place to start moving more, building endurance, and feeling stronger.' },
  ],
  resources: [
    { title: 'Wellness Essentials', type: 'Nutrition guide', content: 'A straightforward introduction to building a balanced daily wellness routine. Explore how nutrition, movement, rest, and consistency work together to support your goals over the long term.' },
    { title: 'Our Quality Promise', type: 'Company standard', content: 'Every Roland’s product begins with a clear purpose: help people feel ready for their day. We pursue thoughtful formulations, clear labeling, and premium ingredients so you always know exactly what you are putting into your body.' },
    { title: 'Shipping & Returns', type: 'Customer care', content: 'Orders are typically shipped within two business days (8:30am–5:00pm CST, Monday–Friday) and arrive in 3–7 business days depending on your location. Free shipping is available on regular-size products within the continental United States for orders over $49.99. If you need help with an order, our customer care team is ready to assist.' },
  ],
};

const html = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Premium nutrition and wellness products from Roland's Power Health Max Food Company.">
  <title>Roland's Power Health Max Food Company | Better Nutrition, Every Day</title>
  <style>
    :root{--ink:#19231b;--muted:#627066;--cream:#fffdf7;--sage:#e2ebd8;--lime:#b9d73f;--forest:#173f2d;--orange:#f26b38;--line:#dce4d5}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font:16px/1.55 Arial,sans-serif}a{color:inherit}.announcement{background:var(--forest);color:#fff;text-align:center;padding:9px 16px;font-size:13px}.header{display:flex;justify-content:space-between;align-items:center;gap:25px;max-width:1200px;margin:auto;padding:22px 28px}.logo{font-weight:900;font-size:18px;line-height:1.05;text-decoration:none;max-width:230px}.logo b{display:block;color:#54872d;font-size:12px;letter-spacing:.12em;margin-bottom:5px}.nav{display:flex;gap:22px;flex-wrap:wrap}.nav a{text-decoration:none;font-weight:700;font-size:14px}.nav a:hover{color:#4d7f27}.hero{background:linear-gradient(115deg,#eff6df 0%,#d6e9bd 62%,#b9d73f 100%)}.hero-inner{max-width:1200px;margin:auto;min-height:510px;padding:88px 28px;display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:55px}.kicker{font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#54872d}.hero h1{font-size:clamp(42px,7vw,78px);line-height:.94;letter-spacing:-.055em;margin:16px 0 22px;max-width:750px}.hero p{max-width:590px;font-size:19px;color:#3e5043}.cta{display:inline-block;background:var(--forest);color:#fff;text-decoration:none;border-radius:5px;padding:14px 21px;font-weight:800;margin-top:14px}.hero-orb{height:310px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 7%,#f6ae5c 8% 20%,#f26b38 21% 35%,#173f2d 36% 58%,#91bd36 59%);box-shadow:0 25px 45px #59733244}.section{max-width:1200px;margin:auto;padding:80px 28px}.section-heading{max-width:650px;margin-bottom:35px}.section-heading h2{font-size:clamp(30px,4.2vw,48px);line-height:1.02;letter-spacing:-.035em;margin:8px 0}.section-heading p{color:var(--muted);font-size:17px}.featured{background:var(--sage)}.featured-box{display:grid;grid-template-columns:1fr 1.3fr;gap:40px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden}.featured-visual{background:radial-gradient(circle at 34% 30%,#fff 0 6%,#f6ae5c 7% 19%,#f26b38 20% 34%,#173f2d 35% 60%,#91bd36 61%);min-height:280px}.featured-copy{padding:38px 40px 38px 0}.featured-copy .kicker{color:var(--orange)}.featured-copy h3{font-size:clamp(28px,4vw,40px);margin:8px 0 6px;letter-spacing:-.03em}.featured-copy .lede{font-weight:800;color:var(--forest);margin:0 0 12px}.featured-copy p{color:var(--muted);margin:0}.brands{background:#fff}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid var(--line);padding:25px;border-radius:12px;background:#fff}.card:nth-child(3n+1){border-top:6px solid var(--lime)}.card:nth-child(3n+2){border-top:6px solid var(--orange)}.card:nth-child(3n){border-top:6px solid var(--forest)}.card h3{font-size:22px;margin:0 0 4px}.card .card-tag{display:block;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#54872d;margin:0 0 12px}.card p{color:var(--muted);margin:0}.learn{background:var(--forest);color:white}.learn .section-heading p{color:#c7d6cb}.article-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.article{padding:25px;background:#24523b;border-radius:12px}.article h3{margin:0 0 10px;font-size:21px}.article p{color:#d5e5d8}.article a{font-weight:800;color:#d4eb61;text-decoration:none}.documents{background:#f0f4e8}.doc-toolbar{display:flex;gap:12px;align-items:center;margin-bottom:15px}.doc-toolbar input{width:min(500px,100%);padding:12px 14px;border:1px solid #b9c8b5;border-radius:6px;font:inherit}.document-list{display:grid;gap:10px}.document{display:flex;justify-content:space-between;align-items:center;gap:15px;background:#fff;padding:16px 18px;border:1px solid var(--line);border-radius:8px}.document small{display:block;color:var(--muted)}.document button{border:1px solid var(--forest);color:var(--forest);background:#fff;border-radius:5px;padding:8px 12px;font-weight:800;cursor:pointer}.preview{margin-top:14px;background:#fff;padding:18px;border:1px solid var(--line);border-radius:8px;white-space:pre-wrap;max-height:410px;overflow:auto;color:#334039}.social{background:#fff}.social-links{display:flex;gap:12px;flex-wrap:wrap}.social-links a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;background:var(--sage);padding:12px 16px;border-radius:999px;font-weight:800;text-transform:capitalize}.social-links a:hover{background:var(--lime)}.contact{background:var(--orange);color:#fff}.contact .section-heading p{color:#fff4ed}.contact-box{display:flex;justify-content:space-between;align-items:center;gap:25px;background:#fff6ef;color:var(--ink);padding:28px;border-radius:12px}.contact-box p{color:var(--muted);margin:7px 0 0}.footer{background:#102d21;color:#d4e3d8;padding:36px 28px;text-align:center;font-size:14px}@media(max-width:750px){.header{align-items:flex-start;flex-direction:column}.hero-inner{grid-template-columns:1fr;padding-top:60px}.hero-orb{height:220px;width:220px}.cards,.article-grid{grid-template-columns:1fr}.featured-box{grid-template-columns:1fr}.featured-visual{min-height:180px}.featured-copy{padding:28px}.section{padding:58px 22px}.contact-box,.document{align-items:flex-start;flex-direction:column}}
  </style>
</head>
<body>
  <div class="announcement">Free continental U.S. shipping on orders over $49.99</div>
  <header class="header"><a class="logo" href="#home"><b>ROLAND'S</b>Power Health Max Food Company</a><nav class="nav" aria-label="Primary navigation"><a href="#home">Home</a><a href="#brands">Our Brands</a><a href="#learn">Learn &amp; Explore</a><a href="#documents">Resources</a><a href="#social">Community</a><a href="#contact">Contact</a></nav></header>
  <main>
    <section id="home" class="hero"><div class="hero-inner"><div><div class="kicker">Premium wellness, made practical</div><h1>Power your best everyday.</h1><p>Roland's Power Health Max Food Company creates thoughtfully formulated nutrition products for energy, strength, performance, and balanced daily wellness—so you can be the best version of yourself.</p><a class="cta" href="#brands">Explore our brands</a></div><div class="hero-orb" aria-hidden="true"></div></div></section>
    <section id="featured" class="section featured"><div class="section-heading"><div class="kicker">Best seller</div><h2>Meet the everyday favorite.</h2><p>A customer-favorite formula from our catalog, made for real, busy days.</p></div><div id="featured-product" class="featured-box"></div></section>
    <section id="brands" class="section brands"><div class="section-heading"><div class="kicker">Our brands</div><h2>Support that meets you where you are.</h2><p>Explore the wellness and sports-nutrition lines that shape our product family.</p></div><div id="brand-cards" class="cards"></div></section>
    <section id="learn" class="section learn"><div class="section-heading"><div class="kicker">Learn &amp; explore</div><h2>Small insights. Stronger habits.</h2><p>Practical nutrition and movement resources for the road ahead.</p></div><div id="article-cards" class="article-grid"></div></section>
    <section id="documents" class="section documents"><div class="section-heading"><div class="kicker">Resources</div><h2>Guidance for your everyday routine.</h2><p>Helpful product, wellness, and customer-care information—all in one place.</p></div><div id="resource-library"><div class="document-list" id="document-list"></div><div id="document-preview" class="preview" hidden></div></div></section>
    <section id="social" class="section social"><div class="section-heading"><div class="kicker">Community</div><h2>Keep up with Roland’s.</h2><p>Follow along for product news, practical tips, and everyday motivation.</p></div><div id="social-links" class="social-links"></div></section>
    <section id="contact" class="section contact"><div class="section-heading"><div class="kicker">Contact</div><h2>Let's start a healthy conversation.</h2><p>Have a product question or general inquiry? We would love to hear from you.</p></div><div class="contact-box"><div><strong>Roland's Power Health Max Food Company</strong><p>Questions, feedback, and partnership inquiries are welcome.</p></div><a class="cta" href="mailto:hello@rolandspowerhealthmaxfood.com">Get in touch</a></div></section>
  </main><footer class="footer">© 2026 Roland's Power Health Max Food Company · Better nutrition, every day.</footer>
  <script id="site-data" type="application/json">__SITE_DATA__</script>
  <script>
    const site = JSON.parse(document.getElementById('site-data').textContent);
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const featured = site.featured;
    if (featured) {
      document.getElementById('featured-product').innerHTML =
        '<div class="featured-visual" aria-hidden="true"></div>' +
        '<div class="featured-copy"><div class="kicker">Top-selling energy pill</div><h3>'+escapeHtml(featured.name)+'</h3><p class="lede">'+escapeHtml(featured.tagline)+'</p><p>'+escapeHtml(featured.description)+'</p></div>';
    }
    document.getElementById('brand-cards').innerHTML = site.brandPages.map(item => '<article class="card"><h3>'+escapeHtml(item.title)+'</h3><span class="card-tag">'+escapeHtml(item.tagline)+'</span><p>'+escapeHtml(item.description)+'</p></article>').join('');
    document.getElementById('article-cards').innerHTML = site.articles.map(item => '<article class="article"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.text)+'</p><a href="#documents">Read more →</a></article>').join('');
    const list = document.getElementById('document-list'), preview = document.getElementById('document-preview');
    function renderResources(){list.innerHTML=site.resources.map((item,index)=>'<article class="document"><div><strong>'+escapeHtml(item.title)+'</strong><small>'+escapeHtml(item.type)+'</small></div><button data-resource="'+index+'">Read more</button></article>').join('');list.querySelectorAll('[data-resource]').forEach(button=>button.addEventListener('click',()=>{const item=site.resources[Number(button.dataset.resource)];preview.hidden=false;preview.textContent=item.content}));}
    renderResources();
    document.getElementById('social-links').innerHTML = site.profiles.map(profile => '<a href="'+escapeHtml(profile.url)+'" target="_blank" rel="noreferrer">'+escapeHtml(profile.platform)+' <span>↗</span></a>').join('');
  </script>
</body></html>`;

const builtHtml = html.replace('__SITE_DATA__', safe(data));
fs.writeFileSync(path.join(outputDir, 'index.html'), builtHtml);
fs.writeFileSync(path.join(root, 'index.html'), builtHtml);
fs.writeFileSync(path.join(outputDir, 'dependencies.json'), JSON.stringify(['brain_deliverables.json'], null, 2) + '\n');
console.log('Built Roland\'s Power Health Max Food Company website.');
