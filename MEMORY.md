# Bloomspace Memory

## Project Summary
Bloomspace is a revival/rebuild of my first hackathon project from nwHacks 2025 in Vancouver. The app is a community wellness garden where users draw digital flowers, attach kind messages, and plant them in a shared garden.

## Stack
- React + Vite frontend
- Tailwind CSS
- React Router
- Node.js + Express backend scaffold
- MongoDB planned later
- localStorage used for current MVP persistence

## Current Features
- Home page with soft anime garden theme
- Navbar and Footer
- React Router pages:
  - `/`
  - `/create`
  - `/garden`
  - `/about`
- CreateFlower page with drawing canvas
- Color and stroke controls
- Message textarea
- Garden page with flower cards
- Flower detail view/modal
- localStorage saving under `bloomspaceFlowers`
- Flower lifespan system
- Watering mechanic

## Flower Lifespan Rule
- A planted flower blooms for 3 days.
- Watering does not stack extra days.
- Watering refreshes the flower back to 3 days from the current time.
- Expired flowers are hidden from the public garden.
- Water count is tracked as community support/refreshed count.

## Current Flower Object Shape
```js
{
  id,
  image,
  message,
  author: "Anonymous Gardener",
  plantedAt,
  expiresAt,
  wateredCount
}


## Original Hackathon Concept

Bloomspace began as a nwHacks 2025 project focused on mental wellness. The original idea was an interactive garden where users could draw flowers, publish them to a shared garden, save their drawings, and click flowers to reveal inspiring messages.

The team also imagined future features such as a wellness to-do list, flower lifespans, and user-specific saved flowers.

## Rebuild Direction

This rebuild keeps the original drawing + message + garden concept, but expands the flower lifespan idea into a care mechanic:

- Each flower blooms for 3 days.
- Watering a flower refreshes its bloom time.
- Flower cards stay image-focused.
- Full messages and watering actions live in the flower detail view.