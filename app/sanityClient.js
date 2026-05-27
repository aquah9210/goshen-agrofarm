import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'lclay9ft', // Ton identifiant exact, sans espace ni majuscule
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-11',
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// Export par défaut de sécurité au cas où ton application l'importe ainsi
export default client;
