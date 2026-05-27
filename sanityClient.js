import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'lclay9ft', // 👈 Colle ton vrai Project ID ici entre les guillemets
  dataset: 'production',           // Laisse 'production'
  useCdn: true,                    // Permet un chargement ultra-rapide
  apiVersion: '2024-03-01',        
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
