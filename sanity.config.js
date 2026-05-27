import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'; // 🟢 Remplacement de desk par structure

export default defineConfig({
  name: 'default',
  title: 'Goshen AgroFarm',

  projectId: 'lclay9ft', // Ton ID de projet validé sur ta capture Sanity
  dataset: 'production',

  basePath: '/studio', // L'adresse URL sur ton site

  plugins: [structureTool()], // 🟢 Utilisation du nouveau plugin

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
