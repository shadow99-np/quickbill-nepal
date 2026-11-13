# ⚡ QuickBill Nepal (बिलसाथी)
> Professional IRD-Compliant Invoices & Receipts with Embedded Fonepay / eSewa QR for Nepali Freelancers, Tutors & Small Businesses.

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Lucide Icons**, and designed via **Google Stitch MCP**.

---

## 🌟 Key Features

1. **Embedded Nepali Payment QR**:
   - Supports **Fonepay**, **eSewa**, **Khalti**, and **Bank Transfer**.
   - Embeds the exact invoice amount into the QR payload for zero-error mobile scan-to-pay.
   - Option to upload a photo of your physical counter QR stand.

2. **Nepali Fiscal Rules & Compliance**:
   - Tax Invoice (कर बीजक) vs Non-VAT Commercial Invoice toggle.
   - 13% Nepal Government VAT calculation.
   - 9-digit PAN checksum validation.
   - Dual Date Support (Bikram Sambat BS & Gregorian AD).
   - Automated **Number to Words** converter in Nepali Rupees (Lakhs & Crores notation).

3. **1-Click WhatsApp Sharing**:
   - Pre-formatted professional billing message with client name, invoice number, due date, and payment instructions.
   - Direct `wa.me` redirect link.

4. **100% Print-to-PDF Ready**:
   - Dedicated `@media print` CSS rules tailored for standard A4 paper.
   - Clean margins, hiding all non-printable application controls.

5. **Integrated Monetization & Ad Engine**:
   - Built-in `<AdBanner />` component displaying contextual Nepali B2B sponsors (Nabil Freelance Banking, Nest Nepal Cloud Hosting, Khalti Merchant Gateway).
   - Easy slot to plug in your Google AdSense Publisher ID (`ca-pub-XXXXXXXX`).
   - "Remove Ads with QuickBill Pro" upsell path.

6. **Local-First & Offline Ready**:
   - Full LocalStorage auto-save mechanism: draft updates persist even across page reloads.

---

## 🚀 Running the Project

```bash
cd /data/user/0/com.termux/files/home/projects/quickbill_nepal

# Start development server
pnpm dev --port 3000

# Build optimized production bundle
pnpm build
```

Open in your browser:
* Local: [http://localhost:3000](http://localhost:3000)
* Mobile / Local Wi-Fi: [http://192.168.1.67:3000](http://192.168.1.67:3000)

---

## 📁 Project Structure

```
quickbill_nepal/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS + @media print A4 styling
│   │   ├── layout.tsx           # SEO metadata & page wrapper
│   │   └── page.tsx             # Split-screen invoice editor & live preview
│   ├── components/
│   │   ├── Navbar.tsx           # Brand header, auto-save status, action buttons
│   │   ├── InvoiceForm.tsx      # Reactive form engine (PAN, Line items, VAT, QR)
│   │   ├── InvoicePreview.tsx   # A4 paper canvas with dynamic Fonepay/eSewa QR
│   │   ├── AdBanner.tsx         # Monetization slot (B2B Sponsors & AdSense)
│   │   └── WhatsAppModal.tsx    # 1-click WhatsApp message dispatch
│   ├── types/
│   │   └── invoice.ts           # TypeScript data models
│   └── utils/
│       ├── numberToWords.ts     # NPR words converter (Lakhs, Crores, Paisa)
│       └── nepalQr.ts           # Fonepay & eSewa QR payload generator
├── package.json
└── README.md
```
