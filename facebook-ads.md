# Facebook Ad Campaigns — Creative Construction Management LLC
**ROC 355392 · KB-1 Dual Building Contractor · Tucson, AZ**

Three campaigns designed to run in sequence. Start Campaign 1 for the first week to build the retargeting audience, add Campaign 2 once you're getting 20+ website visitors/day, launch Campaign 3 seasonally or when you have an open calendar slot.

Copy each campaign's text directly into Facebook Ads Manager. All fields respect Meta's current character limits.

---

## Shared targeting (use for all three campaigns)

| Field | Value |
|---|---|
| Location | Tucson, Marana, Oro Valley, Vail — **+25-mile radius** |
| Age | 30–65+ (homeowners skew older) |
| Gender | All |
| Languages | English, Spanish |
| Detailed targeting — Interests | Home improvement, Home renovation, Remodeling, Interior design, HGTV, DIY (Do it yourself), Real estate investing |
| Detailed targeting — Behaviors | Homeowners, Likely to move, Engaged shoppers |
| Detailed targeting — Demographics | Homeowners; Household income: top 50% (tilts to people who can afford additions/remodels) |
| Placements | Facebook Feed, Instagram Feed, Facebook Stories, Instagram Stories |
| Devices | All |
| Exclusions | People who work in construction (to avoid tire-kickers and competitors) |

**Pixel setup first:** install the Meta Pixel on the website before spending a dollar on ads. Events to track: PageView (auto), Lead (fires on form submit — add `fbq('track', 'Lead');` to the form success handler in index.html).

---

## Campaign 1 — Awareness & Credibility

**Objective:** Awareness (was "Brand awareness" / now "Reach")
**Budget:** $7/day for the first 14 days, then adjust based on frequency (target: <3.0)
**Running duration:** Ongoing — this is your always-on foundation ad

### Ad creative

**Primary text (110 words):**

> Looking for a licensed contractor in Tucson who shows up, communicates, and finishes what they start?
>
> Creative Construction Management is a KB-1 Dual Building Contractor (that's one of Arizona's broadest general-contracting licenses) serving Tucson, Marana, Oro Valley, and Vail. Additions, remodels, commercial build-outs — residential and commercial under one license.
>
> Owner Jesus Lopez is on every job site, writes real line-item estimates, and stands behind the work.
>
> AZ ROC 355392 · Verify it anytime at roc.az.gov
>
> If you've been putting off a project because the last contractor ghosted you, let's have a different conversation.

**Headline (38 chars):**
`Licensed Tucson Builder · ROC 355392`

**Description (28 chars):**
`Additions · Remodels · More`

**Call-to-action button:** `Learn More`
**Destination URL:** your website homepage (e.g., `https://creativeconstructionmanagementaz.com/#services`)

### Image / video direction

- **Best:** a 15-second selfie video of Jesus standing on a completed job site saying "Hi, I'm Jesus. I own Creative Construction Management. We're licensed — ROC 355392 — and we build homes and additions across Tucson. If you need a contractor who actually picks up the phone, let's talk."
- **Next best:** a landscape photo of a clean finished project (kitchen, addition exterior, or a commercial build-out) with a subtle text overlay: "Licensed Tucson Contractor · ROC 355392"
- Avoid generic stock images. People scroll past them.

---

## Campaign 2 — Lead Generation (Native Facebook Lead Form)

**Objective:** Leads
**Budget:** $12/day for 21 days, then evaluate cost per lead
**Running duration:** 3 weeks minimum, pause when calendar fills

This ad uses Facebook's **Instant Form** — the customer never leaves Facebook. Higher conversion than sending to the website, slightly lower lead quality, good for filling your pipeline.

### Ad creative

**Primary text (118 words):**

> Free estimate on your Tucson home project — get a real written number, not a ballpark.
>
> Kitchen remodel? Bathroom? Room addition? Turning the garage into a casita? We do the walk-through, write you a line-item estimate, and give you an honest timeline — no pressure.
>
> Creative Construction Management
> AZ ROC 355392 · KB-1 Dual Building Contractor (residential AND commercial)
> Tucson · Marana · Oro Valley · Vail
>
> Tap "Get Quote" below. Takes 30 seconds. We'll call you within one business day.

**Headline (34 chars):**
`Free Estimate — One Business Day`

**Description (29 chars):**
`Licensed · Bonded · ROC 355392`

**Call-to-action button:** `Get Quote`

### Instant Form configuration

**Intro screen:**
- Headline: `Tell us about your project`
- Image: crop of a finished kitchen or bathroom
- Description: `We'll reach out within one business day to schedule a free walkthrough. Your info is only used to contact you about this project.`

**Questions (use in this order):**

1. **Full name** (prefilled, required)
2. **Email** (prefilled, required)
3. **Phone number** (prefilled, required)
4. **Custom dropdown — "What service do you need?"** (required):
   - Home Addition
   - Kitchen Remodel
   - Bathroom Remodel
   - Whole-Home Renovation
   - Commercial Construction / Tenant Improvement
   - General Contracting / Project Management
   - Something else
5. **Custom dropdown — "When do you want to start?"** (required):
   - ASAP
   - Within 1–3 months
   - 3–6 months out
   - Just researching
6. **Short answer — "Anything specific we should know?"** (optional, 300 char cap)

**Privacy policy URL:** `https://creativeconstructionmanagementaz.com/privacy` *(placeholder — create this page or link to a short plain-text privacy notice)*

**Thank-you screen:**
- Headline: `Got it — thanks.`
- Description: `We'll reach out within one business day. For urgent projects, call Jesus directly at (520) 273-9295.`
- Button 1: `Call Now` → `tel:+15202739295`
- Button 2: `View Our Work` → website `#gallery`

### Following up on Instant Form leads

Facebook **does not** auto-email these to you. Options:

1. **Free/manual:** Meta Business Suite → Leads Center → export to CSV daily.
2. **Better ($):** Zapier or Make.com connector from "Facebook Lead Ads" to your Google Sheet (same sheet the website uses). Instant notification email triggers automatically.
3. **Best (no monthly cost):** use the free Leadsbridge tier to forward Facebook leads into the same Google Apps Script endpoint the website uses. Same Sheet, same email alerts.

---

## Campaign 3 — Retargeting / Seasonal Urgency

**Objective:** Conversions (optimizing for "Lead" pixel event)
**Budget:** $8/day during active retargeting period
**Running duration:** Bursts of 2–3 weeks; pause between

Only run this once Campaign 1 has built up 500+ people in your website-visitor custom audience.

### Audience (this is the whole point of this campaign)

- **Custom audience:** website visitors, last 90 days
- **Custom audience:** Instant Form openers who did NOT submit, last 60 days
- **Exclude:** anyone who already submitted a lead in the last 90 days

### Ad creative — rotate two versions seasonally

#### Version A — Pre-summer (run Feb–May)

**Primary text (95 words):**

> Quick heads-up: summer job calendars in Tucson book up by late April. If that addition, remodel, or outdoor project has been on the list for a while, now's when to start the conversation.
>
> Free on-site walkthrough · written estimate in 3–5 days · ROC 355392.
>
> No pressure, no hard sell. Just an honest number so you can plan.

**Headline (37 chars):**
`Tucson Calendars Fill by Late April`

**Description (28 chars):**
`Free Estimate · ROC 355392`

**CTA:** `Book Now` → website `#contact`

#### Version B — Pre-holiday (run Sept–Nov)

**Primary text (88 words):**

> Thinking about finally doing the kitchen before the holidays? October is the cutoff for a Thanksgiving-ready reveal — we need 6–10 weeks for most full kitchens.
>
> Creative Construction · Licensed Tucson contractor · ROC 355392
>
> Tell us what you're thinking. We'll come out, measure, and write you a real estimate.

**Headline (34 chars):**
`Kitchen Before the Holidays?`

**Description (28 chars):**
`Book Your Walkthrough Now`

**CTA:** `Book Now` → website `#contact`

---

## Budget plan — first 90 days

| Week | Campaign 1 (Awareness) | Campaign 2 (Lead Gen) | Campaign 3 (Retarget) | Weekly total |
|---|---|---|---|---|
| 1–2 | $7/day × 14 = $98 | — | — | $98 |
| 3–4 | $7/day × 14 = $98 | $12/day × 14 = $168 | — | $266 |
| 5–12 | $7/day × 56 = $392 | $12/day × 56 = $672 | $8/day × 56 = $448 | $1,512 |
| **90-day total** | **$588** | **$840** | **$448** | **$1,876** |

**Expected cost per lead** (Tucson, residential construction): **$35–$75** per lead through the Instant Form. Phone calls and website form submissions typically run 1.5–2× that but convert at 3–4× the rate — closer to real jobs.

**Kill criteria:** if cost per lead exceeds $100 after 14 days of ad #2 running, pause and rework the creative before spending more.

---

## Quick-launch checklist

- [ ] Meta Business Suite account + Ads Manager access
- [ ] Facebook Business Page for Creative Construction (if not already live)
- [ ] Meta Pixel installed on website
- [ ] Pixel "Lead" event firing on form submit (test with Meta Pixel Helper Chrome extension)
- [ ] Privacy policy page live (even a simple one)
- [ ] 3–5 real project photos or a 15-second owner video for Campaign 1 creative
- [ ] Payment method added to Ads Manager
- [ ] First campaign launched at $7/day
- [ ] Set a weekly calendar reminder to check Ads Manager every Monday morning
