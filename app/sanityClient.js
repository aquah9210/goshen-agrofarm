import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'lclay9ft', // 👈 Ton ID unique visible sur ta capture
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
