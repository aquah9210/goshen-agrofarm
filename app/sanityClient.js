import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Ton identifiant unique Sanity
  dataset: 'production',
  apiVersion: '2026-05-27', // Code mis à jour avec la date d'aujourd'hui
  useCdn: true, // Chargement ultra-rapide
});

const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source);
}
