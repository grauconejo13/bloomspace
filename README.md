# Bloomspace 🌸

Bloomspace is a community wellness garden where users create digital flowers, attach encouraging messages, and plant them in a shared garden for others to discover.

It began as a nwHacks 2025 hackathon idea and has since been rebuilt as a full-stack public beta project.

## Origins

Bloomspace began as a team project during nwHacks 2025 in Vancouver, Canada.

The original prototype explored the idea of a shared digital garden for mental wellness, where users could draw flowers and leave kind messages for others. This version is an independent continuation and rebuild of that original concept.

## Features

* Draw flowers using a digital canvas
* Customize brush color and stroke size
* Undo, redo, and clear drawings
* Attach a positive message to each bloom
* Plant flowers in a shared garden
* Browse community-created blooms
* Water flowers to refresh their bloom time
* Generate a shareable Bloomspace card
* Share blooms through native device sharing
* Download bloom cards as PNG when sharing is unavailable
* Limit planting to 3 blooms per browser session
* Prevent duplicate bloom submissions
* Show friendly loading messages during backend/database wake-up delays
* Track privacy-friendly product analytics
* Mobile responsive design

## Flower Lifespan

Each planted flower blooms for 3 days.

Watering a flower refreshes its bloom time back to 3 days from the current time. Watering does not stack extra days. Expired flowers are hidden from the public garden.

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express
* Render

### Database & Storage

* Supabase
* localStorage fallback for resilience
* sessionStorage for browser-session limits

### Testing

* Playwright regression scripts

## Current Status

🌱 Public Beta / Launch Prep

Bloomspace is currently being prepared for public sharing as a portfolio-ready full-stack project.

## Latest Progress

* Rebuilt the flower creation flow
* Added drawing canvas with brush controls
* Added undo and redo support
* Added garden view and flower detail modal
* Added flower lifespan and watering mechanic
* Connected frontend to Express API
* Connected backend to Supabase
* Added localStorage fallback when backend data is unavailable
* Added shareable PNG Bloomspace card
* Added native Web Share support
* Added PNG download fallback
* Added 3-bloom browser-session limit
* Added duplicate submission protection
* Added Supabase wake-up handling
* Added privacy-friendly analytics events
* Added Playwright regression testing for major flows

## Analytics

Bloomspace tracks lightweight product events to understand usage without storing personal bloom content.

Tracked events include:

* Page views
* Garden views
* Successful flower creation
* Successful native sharing
* PNG share-card downloads

Bloomspace does not track flower messages, image contents, names, emails, or author/location text in analytics metadata.

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase

Recommended deployment order:

1. Run required Supabase SQL.
2. Deploy the Render backend.
3. Deploy the Vercel frontend.
4. Smoke test the production flow.

## Original Hackathon Team

* Vanessa Victorino — Frontend Development
* Erika Feng — Concept & Backend Development
* Zara Shaikh — Presentation
* Cherie Huang — Project Setup & Support

## Revival

This version is an independent continuation of the original hackathon project.

The rebuild keeps the heart of the original idea — drawing flowers, sharing kind messages, and creating a community garden — while expanding it into a more polished full-stack experience.
