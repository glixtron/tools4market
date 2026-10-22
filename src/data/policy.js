// Tools4Market — policy pages (AdSense-required) content
export const POLICY = [
  {
    slug: 'about',
    title: 'About',
    metaTitle: 'About Tools4Market — Free Browser-Based Tools',
    metaDesc: 'Tools4Market offers free, browser-based marketing, SEO and AI-search tools. Learn who we are, our mission and how our tools work.',
    html: `
<h1>About Tools4Market</h1>
<p>Tools4Market is a collection of free browser-based tools for marketers, bloggers, developers and webmasters. Most tools process pasted input or selected image files on your device. When you choose page analysis, the public URL is sent to our first-party fetch service so it can retrieve the page for your browser to inspect. There is no signup or software to install.</p>
<h2>Why we exist</h2>
<p>Most “free tool” websites bury the tool under ads and demand an email address before showing a result. We are building the opposite: a fast, honest toolbox where the tool is the first thing on the page and works the moment it loads. Our specialty is the toolkit of the AI-search era — meta tags, robots.txt, llms.txt, structured data and the utilities that keep a website healthy in front of both classic search engines and AI assistants.</p>
<p>The problem we keep running into is not a lack of tools. It is a lack of tools that tell you the truth. A snippet preview that pretends to be a Google result, a keyword-density tool that quotes an “ideal” percentage, a canonical-tag generator that implies a link is a command — each of those small lies costs somebody a afternoon of work. So the rule here is simple: <strong>every tool states what it actually measured, and what it cannot know.</strong> If a number is an estimate, the page says so; if a check cannot see inside Google, the page says that too.</p>
<h2>What is on the site</h2>
<p>Thirty-one tools across four groups. The <strong>SEO &amp; Meta</strong> group generates and explains meta tags, Open Graph and Twitter cards, canonical and hreflang links, JSON-LD schema, and previews your title and description. The <strong>AI Search</strong> group covers the newer wave: robots.txt presets for eighteen-plus AI crawlers, one-click blocking of training bots, and llms.txt files for answer engines. The <strong>Content &amp; Social</strong> group covers slugs, UTM campaigns, keyword frequency and hashtags. The <strong>Web</strong> group covers image compression for websites, XML sitemaps, .htaccess redirects, passwords, Base64 and URL encoding, UUIDs, JWT inspection, user-agent parsing and calendar files.</p>
<h2>How the tools work</h2>
<p>Tools are built with plain HTML, CSS and JavaScript. Pasted text, selected image files and generated output are processed locally in your browser; the image compressor does not upload the selected image bytes. Public URL analysis sends the URL to our first-party fetch service, which retrieves the public response and returns it to your browser for analysis. The app does not save the resulting report. Some tools need an internet connection to fetch a page or download a file.</p>
<p>That architecture is not only a privacy choice, it is a performance one. There is no application server to queue behind, no rate limit to hit, and nothing to go down at 9am when everyone realises they need a robots.txt. The pages are static files on a global content delivery network, and the only dynamic part of the site is a single, tightly scoped fetch endpoint.</p>
<h2>How we test what we ship</h2>
<p>Every tool is exercised automatically against a real DOM: each input is driven with sample and hostile data (empty values, 100,000-character pastes, malformed URLs and markup, non-numeric numbers), every button is clicked, and the run fails on any console error or missing output. On top of that, a live check runs against the published site after every deploy — DNS, the sitemap, published sitemap URLs, their canonical tags, the backend endpoint and the ad slots. When a change ships, the same suites run again. It is unglamorous, and it is the reason the tools still work.</p>
<h2>How we keep it free</h2>
<p>The site is supported by advertising (Google AdSense) and, on some pages, clearly disclosed affiliate links for tools we consider worth paying for. Ads never sit inside the tools themselves. If a page carries an affiliate link, the disclosure is on that page. We do not sell data, and we do not ask for an account — there is nothing to sell you, because the tools already work.</p>
<h2>Editorial standards</h2>
<p>Every explanation is written for a practitioner rather than a search engine. We do not quote character limits that search engines do not enforce, we do not promise rankings, and we do not publish “guaranteed” results. Where guidance is genuinely contested, we say so. Corrections are welcome and made quickly — see the contact page.</p>
<h2>Contact</h2>
<p>Questions, bug reports, or tool suggestions are welcome at <a href="/contact/">our contact page</a>. We read everything, and we answer most things within two business days.</p>`,
  },
  {
    slug: 'contact',
    title: 'Contact',
    metaTitle: 'Contact Tools4Market — Get in Touch',
    metaDesc: 'Contact the Tools4Market team: tool suggestions, bug reports, feedback or business inquiries. We aim to reply within two business days.',
    html: `
<h1>Contact</h1>
<p>Everything reaches the same small inbox: <a href="mailto:support@tools4market.online"><strong><a href="mailto:support@tools4market.online">support@tools4market.online</a></strong></a>. We usually reply within two business days, and we answer complaints, privacy requests and takedown notices first.</p>
<h2>Write to us</h2>
<p>Use the form below — it opens your own email app with the message pre-filled, so nothing is stored on our servers and nothing is sent anywhere until you press send. You can also write directly, whichever is easier.</p>
<form class="ct-form" action="mailto:support@tools4market.online" method="post" enctype="text/plain">
  <div class="field"><label for="ct-name">Your name</label><input id="ct-name" name="name" type="text" placeholder="Jane Doe" autocomplete="name" required></div>
  <div class="field"><label for="ct-email">Your email</label><input id="ct-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
  <div class="field"><label for="ct-topic">What is this about?</label><select id="ct-topic" name="topic">
    <option>A bug in a tool</option>
    <option>A complaint about this website</option>
    <option>A correction to the content</option>
    <option>A tool suggestion</option>
    <option>A privacy or data request</option>
    <option>Advertising, sponsorship or partnership</option>
    <option>Something else</option>
  </select></div>
  <div class="field"><label for="ct-message">Message</label><textarea id="ct-message" name="message" rows="6" placeholder="Which tool, what you expected, and what happened instead." required></textarea></div>
  <div class="ck-actions"><button type="submit" class="btn">Open in my email app</button></div>
  <p class="tool-note">The button opens your mail client with the fields above filled in. If nothing happens, email <a href="mailto:support@tools4market.online">support@tools4market.online</a> directly.</p>
</form>
<h2>What to contact us about</h2>
<ul>
<li><strong>Bug reports:</strong> tell us the tool name, your browser, and what you expected vs. what happened. A screenshot of the output helps enormously.</li>
<li><strong>Complaints:</strong> about the site, an advertisement you saw, or the way a page behaved — these go to the same address and are handled as priority. Describe the page URL and what went wrong.</li>
<li><strong>Tool suggestions:</strong> the roadmap is driven by user requests — the most requested tools get built first.</li>
<li><strong>Content corrections:</strong> if a guide or FAQ is outdated or wrong, we want to know.</li>
<li><strong>Privacy or data requests:</strong> access, correction or deletion requests are answered by the same address — see our <a href="/privacy-policy/">Privacy Policy</a> for what we hold and why.</li>
<li><strong>Business &amp; advertising:</strong> sponsorships, partnerships and advertising enquiries.</li>
</ul>
<h2>Before you write</h2>
<p>Many questions are already answered in the FAQ section of each tool page. If a tool misbehaves, try a hard refresh (Ctrl/Cmd+Shift+R) first — a stale cached script is the most common culprit.</p>
<p>One thing we cannot do: look up your browsing history or a report a tool produced. Tools run in your browser and we do not keep a copy of the output, so please paste the text you want us to look at into your message.</p>`,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy — Tools4Market',
    metaDesc: 'How Tools4Market handles data: tools run locally in your browser, cookie consent for analytics and advertising, and your rights.',
    html: `
<h1>Privacy Policy</h1>
<p>Last updated: 23 October 2026</p>
<p>This Privacy Policy explains what information Tools4Market (“we”, “us”) collects when you use our website, and the choices you have.</p>
<h2>1. Tool input and public URL analysis</h2>
<p>Most tools process pasted text and generated output locally in your browser. If you choose “Analyze my page” or run a URL-based audit, the URL you enter is sent to our first-party <code>/api/fetch</code> service. It requests the public page, robots.txt or sitemap needed for that check and returns the response to your browser for analysis. The app does not save an analysis report or build profiles from tool usage. Our hosting provider may process standard request logs as described below, and the destination website receives a request for its public page.</p>
<p>The Image Compressor also processes selected image files locally in your browser using the browser’s image and canvas APIs. The image bytes are not sent to our fetch service or uploaded by this tool. The converted download exists in the current page until you save it or close the page. Re-encoding can remove embedded image metadata such as EXIF; keep the original if that metadata matters.</p>
<p><strong>AI-assisted suggestions.</strong> When a tool flags a fixable issue (for example a missing or weak meta description) and you press “Suggest a fix with AI”, your browser sends our first-party <code>/api/suggest</code> service a small summary of the analyzed page: its URL, title, main heading, meta description and up to about 700 characters of opening text — never the full page. The service asks Cloudflare Workers AI (our hosting provider’s model service, running in the same Worker as the fetch proxy) to draft replacement copy and returns the draft to your browser. We log nothing and store nothing from this exchange; the model call is stateless. The feature is offered only after you allow analytics processing on the consent banner, because it involves sending that summary for processing; you can change your choice at any time via “Cookie settings”. Every draft is labelled for review — it is machine-generated copy, not search-engine output, and carries no ranking promise.</p>
<p>Do not enter private URLs or URLs containing access tokens or other secrets. Pasted text and HTML are analyzed in your browser; the public URL fetch is a separate network request.</p>
<h2>2. Information we collect</h2>
<ul>
<li><strong>Usage analytics:</strong> we may use privacy-respecting analytics to count page views and understand which tools are popular. This data is aggregated and does not identify you.</li>
<li><strong>Contact email:</strong> if you email us, we process your address and message solely to respond.</li>
</ul>
<h2>3. Cookies, analytics and advertising</h2>
<p>We use <strong>Google Tag Manager</strong> (container <code>GTM-P6P4FLGB</code>) to measure how the site is used, and <strong>Google AdSense</strong> to display advertising. Google and its partners may use cookies to serve ads based on your prior visits to this and other websites.</p>
<p>Nothing is stored on your device until you agree. When you first visit, a consent banner appears. Before you choose, your browser is configured to <strong>deny</strong> analytics and advertising storage in the EEA, the UK and Switzerland (Google Consent Mode v2) — so no non-essential cookies or measurement events are written there before consent. Visitors elsewhere start with measurement enabled, because those regions do not require a prior opt-in; your choice on the banner always overrides this, immediately.</p>
<p>Advertising is served by <strong>Google AdSense</strong> (publisher ID <code>ca-pub-1509697031230558</code>). If you decline advertising consent, we ask Google to serve <strong>limited, non-personalised ads</strong> instead of personalised ones. If you accept, ads may be personalised using your activity on this and other websites, and Google may place advertising cookies on your device.</p>
<p>You can accept all, reject non-essential cookies, or choose per category — analytics and ads are separate. Your choice is saved in your browser’s local storage and can be changed at any time via the <strong>“Cookie settings”</strong> link in the footer. Google Consent Mode v2 is used, which also passes ad-click identifiers through URLs without using cookies and redacts advertising data when ad storage is denied.</p>
<p>You may also opt out of personalised advertising at any time via <a href="https://www.google.com/settings/ads" rel="noopener nofollow" target="_blank">Google Ads Settings</a> or <a href="https://www.aboutads.info" rel="noopener nofollow" target="_blank">www.aboutads.info</a>. Where required by law (e.g. EU/UK), we do not set non-essential cookies before you consent.</p>
<h2>4. Log data</h2>
<p>Like most websites, our hosting provider records standard log data (IP address, browser type, pages requested) for security and performance purposes. Requests to the public-page fetch endpoint can include the target URL in the request query. This information is retained by the hosting provider under its own policy.</p>
<h2>5. Children</h2>
<p>This site is not directed at children under 13 and we do not knowingly collect personal information from them.</p>
<h2>6. Your rights</h2>
<p>Depending on your jurisdiction (GDPR, CCPA and similar), you may have rights to access, correct or delete personal data we hold. Since our tools collect none, such requests mostly concern contact emails — write to <strong><a href="mailto:support@tools4market.online">support@tools4market.online</a></strong>.</p>
<h2>7. Changes</h2>
<p>We will update this policy as the site evolves and revise the “last updated” date above when we do.</p>`,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    metaTitle: 'Terms of Service — Tools4Market',
    metaDesc: 'The terms governing use of Tools4Market: free license, acceptable use, disclaimers of warranty and limitation of liability.',
    html: `
<h1>Terms of Service</h1>
<p>Last updated: 20 October 2026</p>
<p>By using Tools4Market you agree to these terms. If you do not agree, please do not use the site.</p>
<h2>1. Use of the tools</h2>
<p>The tools are provided free of charge for personal and commercial use. You may use their output (tags, files, passwords, slugs) in your own projects without restriction or attribution.</p>
<h2>2. Acceptable use</h2>
<p>You agree not to: attempt to disrupt or overload the site; scrape it in a manner that degrades service for others; use the tools for any unlawful purpose; or embed the tools in another product without permission.</p>
<h2>3. No warranty</h2>
<p>The tools and content are provided “as is” without warranties of any kind, express or implied. While we test carefully, we do not warrant that output is error-free or fit for your particular purpose. <strong>You are responsible for reviewing and testing generated code (tags, sitemaps, redirects) before deploying it.</strong></p>
<h2>4. Limitation of liability</h2>
<p>To the maximum extent permitted by law, Tools4Market shall not be liable for any indirect, incidental or consequential damages arising from use of the site, including lost profits or data, even if advised of the possibility.</p>
<h2>5. Intellectual property</h2>
<p>The site design, text and code are owned by Tools4Market. Trademarks and names of third-party platforms referenced (Google, X, Facebook, etc.) belong to their respective owners; reference does not imply endorsement.</p>
<h2>6. Third-party links</h2>
<p>Pages may link to third-party websites. We are not responsible for their content or policies.</p>
<h2>7. Changes</h2>
<p>We may update these terms; continued use after changes constitutes acceptance.</p>`,
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    metaTitle: 'Disclaimer — Tools4Market',
    metaDesc: 'Disclaimer for Tools4Market: information accuracy, generated code, professional advice, affiliate and advertising disclosure.',
    html: `
<h1>Disclaimer</h1>
<p>Last updated: 20 October 2026</p>
<h2>1. General information only</h2>
<p>All content on Tools4Market is published in good faith and for general information purposes only. SEO and marketing guidance reflects industry practice, not guarantees: search engines control their own results and no technique, tool or markup assures a ranking.</p>
<h2>2. Generated code</h2>
<p>Tools on this site generate code (HTML tags, robots.txt, .htaccess rules, sitemaps, JSON-LD) based on your input. Output should be reviewed and tested in a staging environment before production use. We are not liable for outages, ranking changes or data loss resulting from deployed output.</p>
<h2>3. Not professional advice</h2>
<p>Nothing on this site constitutes legal, financial or professional advice. For decisions with significant consequences (privacy compliance, contracts, taxes), consult a qualified professional.</p>
<h2>4. Affiliate and advertising disclosure</h2>
<p>This site is supported by advertising and, on some pages, affiliate links. If you click certain links and make a purchase, we may earn a commission at no additional cost to you. This never affects our recommendations, and affiliate relationships are disclosed on the page where they appear.</p>
<h2>5. External links</h2>
<p>Links to third-party sites are provided for convenience. We do not control and are not responsible for their content, availability or policies.</p>
<h2>6. Contact</h2>
<p>Questions about this disclaimer: <strong><a href="mailto:support@tools4market.online">support@tools4market.online</a></strong>.</p>`,
  },
];
