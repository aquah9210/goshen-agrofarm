import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

export default defineConfig({
  name: 'default',
  title: 'Goshen AgroFarm',

  projectId: 'lclay9ft', // Ton ID de projet
  dataset: 'production',

  basePath: '/studio', // L'adresse URL où le studio va s'afficher

  plugins: [deskTool()],

  schema: {
    types: [
      {
        name: 'product',
        title: 'Produits',
        type: 'document',
        fields: [
          { name: 'name', title: 'Nom du produit', type: 'string' },
          { name: 'price', title: 'Prix', type: 'number' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'category', title: 'Catégorie', type: 'string' },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'inStock', title: 'En Stock', type: 'boolean', initialValue: true },
        ],
      },
    ],
  },
});
