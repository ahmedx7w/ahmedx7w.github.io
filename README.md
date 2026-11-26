# ahmed-omer.com · v18 "Noir Atelier · Swiss Engineering"

Bilingual portfolio of **Ahmed Omer (أحمد عمر)**, UI/UX & brand identity designer based in Abu Dhabi, UAE.

## What changed in v18
- **Switchor** (switchor.com) added first in Selected work on the homepage, on the Work page and on Case studies, with a new case study in both languages (`cs-switchor.html`, `en/cs-switchor.html`). The case-study chain now runs Switchor, Chaudary Anwar Group, Shoughl, SpotSwift, learning platform.

## What changed in v17
- Chaudary Anwar Group and Shoughl now credit front-end development (homepage, Work, Case studies and the case-study role), and the experience entry says "design and build".
- The hero availability line mentions development and automation.
- Arabic Hire me headline no longer overlaps; WhatsApp card note reads «لنتواصل» / "Let’s connect".

## What changed in v16
- **Hire me** is now a services and contact page: "Design. Build. Automate.", WhatsApp (+971 55 882 3276) and email cards, five services (UI/UX design, web development, automation, brand identity, graphic design), a bilingual band, three next steps and a closing call to action. The brief form is gone.
- **WhatsApp:** a "Let’s chat" button under "Start a project" on the homepage, a chat button in every closing call to action, a WhatsApp link in the footer and a search action. Messages open with a short pre-filled greeting.

## What changed in v15
- Process is in the main menu (Work, About, Process, Writing, Hire me) and no longer a tab under About.
- No em dashes anywhere on the site; empty fields in the brief summary say "Not set" / «غير محدد».
- Removed the footer tagline, the Work page intro line and two of the four hero stats; the remaining two sit either side of the hero spine.

## What changed in v14
- Removed the bilingual Craft Lab section from the homepage and removed Recruiter Mode (`recruiter.html`, its menu and footer links and its search entry).

## What changed in v13
- **Light by default:** the site follows the visitor's device setting and falls back to light. It switches to dark only when the device is set to dark or the visitor picks dark; only an explicit choice is saved (key `theme-choice`). The header button always flips what you see between light and dark; the footer keeps System / Light / Dark.
- **Mobile pass:** no page scrolls sideways at 360px or 390px; every control on touch screens has a 44px target; form fields are 16px so iOS does not zoom; labels under 12px were enlarged (except the portrait caption); the language suggestion is a full-width bar on phones; Recruiter Mode's header fits small phones; the Shoughl mirror schematic wraps on phones; website previews that fail no longer spill outside their frame.
- **Portrait caption:** stays on one line when the card is wide enough and stacks its two parts on narrow cards.

## What changed in v12
- **Hero:** "Good design doesn’t ask for applause." / «التصميم الجيد لا يحتاج للإشادة.» set as a manifesto on a vermilion spine that runs through the whole hero. Both scripts start at the spine and share baselines; the intro sits on the page language's side and the portrait on the other. "Applause" and «للإشادة» are the quiet words: on a first visit they settle from bold to light once.
- **Portrait caption:** no box; the photo shows through, with a soft fade at the bottom for legibility.

## What changed in v11
- **Hero headline:** "Interfaces that speak Arabic and English fluently." / «واجهات تتحدث العربية والإنجليزية بطلاقة.» in the same mirrored layout. No engineering mention in the hero.
- **Portrait caption:** "UI designer & developer | BEng (Hons)" / «مصمم ومطور واجهات | بكالوريوس الشرف في الهندسة», with the name and year on their own row.
- **Projects:** Tokol (recipe app) added to the homepage list (first) and to the Work page (before FitzBlog). Homepage order: Tokol, Sudani, FitzBlog, SpotSwift, SkyChase. The travel booking project is now named SkyChase.
- **Portrait:** loads the new high-resolution photo.

## What changed in v10
- **Hero:** the headline is mirrored around a vermilion axis. Arabic starts at the axis and reads left, English starts at the axis and reads right, and each row is a translation pair sitting on one shared baseline. Arabic is set 6% larger so both scripts look the same size. On a first visit the lines draw out from the axis once; it never repeats in the same visit and never runs with reduced motion.
- **Arabic copy:** both case studies, the case-study cards and the homepage stats were rewritten in plainer, natural Arabic.

## What changed in v9
- **Hero:** one headline written in both directions. English and Arabic sit at the same size and weight, each starting from its own edge; switching language swaps their order. The pointer effect that made the headline flicker is gone.
- **Fewer effects:** removed the custom cursor, magnetic buttons, hover glows, the capabilities marquee, the grid overlay, the live clock, the scroll progress line and the scroll-in animations. The Craft Lab is now the one interactive showpiece.
- **Layout rhythm:** tighter section spacing; the dark services band and the closing call-to-action line up with the content column; the testimonial reads quote first, name second; the Hire me page previews the four brief steps; flat cards no longer carry shadows or lift on hover.
- **Labels:** no more uppercase tracked labels, monospace micro-labels or dot-separated meta lines outside the Craft Lab's spec view.

## What changed in v8
- **Two new case studies, in Arabic and English:** Chaudary Anwar Group (`cs-cag.html`, `en/cs-cag.html`) and Shoughl (`cs-shoughl.html`, `en/cs-shoughl.html`). They are linked from the homepage, Work, Case studies, search (Ctrl/⌘K) and Recruiter Mode.
- **Credibility:** the hero stats show facts a visitor can check (7+ years in design roles, 2 live UAE platforms, 4 case studies, AR ⇄ EN). The learning-platform percentages stay inside their own case study. Experience lists the current role (Operation Director, Chaudary Anwar Group, 2024 – present) and the Itqan role as a position.
- **Navigation:** Work, About, Writing, Hire me and Recruiter mode. Case studies sit under Work, and Experience and Process sit under About, as tabs.
- **Accessibility:** WCAG AA contrast for filled buttons, muted text and light-mode accents; numbers stay left-to-right inside Arabic text; the light-mode portrait caption and the light-mode services band are readable; keyboard-only hints (grid toggle, Ctrl K, Shift G) and the 1440/768 preview switch are hidden on touch screens.
- **Self-hosting:** images load from `assets/` first and fall back to the old hosted copies; website previews show a clear message with a link when no screenshot can load; share images live in `assets/og/`; Recruiter Mode uses the self-hosted fonts.

## Still to add
See `assets/work/README.txt` for the screenshots and images to save into the project.

## Stack
Pure HTML, logical CSS properties for automatic RTL/LTR mirroring, vanilla JS, self-hosted variable fonts (Alexandria and Readex Pro) and Formspree forms.
