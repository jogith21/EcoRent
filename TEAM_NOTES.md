# Team B9 — EcoRent demo notes

## Positioning

**EcoRent — Smart Rental Agreement Management**

The official assigned problem is rental agreement management. The eco-friendly property discovery angle is a differentiator, not the entire problem statement.

## Core pitch

“EcoRent is a centralized digital rental management platform that lets property owners and tenants discover homes, create and manage rental agreements, track rent, store signed documents, and get proactive lease-expiry alerts.”

## Must-show flow

Home
→ Properties
→ Property Details
→ Rent This Property
→ Tenant details
→ Create agreement
→ Agreement preview
→ Print / Save PDF
→ Dashboard
→ Payments
→ Documents

## Judge-friendly features

1. Real Supabase persistence after sign-in.
2. RLS policies protect owner data.
3. Private Storage bucket for signed agreements.
4. Demo mode means the UI can still be demonstrated if auth/database setup is temporarily unavailable.
5. Lease status changes based on dates.
6. Rent payment can be marked as paid.
7. Agreement document can be uploaded.

## Avoid claiming

Do not claim that the app generates legally valid contracts or provides legal advice. Call it a digital agreement-management / document-generation demo.

## Team split

Member 1: Problem + product
Member 2: Property discovery + agreement flow
Member 3: Supabase + data architecture
Member 4: Dashboard + payments + deployment
