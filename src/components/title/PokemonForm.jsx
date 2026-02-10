import React, { useState } from 'react';
import { pokemonTypes, capitalizeFirstLetter } from '../../utils/helpers';

export default function PokemonForm({ initialData, onSubmit, onCancel, mode }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    height: initialData?.height || 10,
    weight: initialData?.weight || 100,
    imageUrl: initialData?.sprites.other?.['official-artwork']?.front_default || '',
    type1: initialData?.types[0]?.type.name || 'normal',
    type2: initialData?.types[1]?.type.name || '',
    hp: initialData?.stats.find((s) => s.stat.name === 'hp')?.base_stat || 50,
    attack: initialData?.stats.find((s) => s.stat.name === 'attack')?.base_stat || 50,
    defense: initialData?.stats.find((s) => s.stat.name === 'defense')?.base_stat || 50,
    specialAttack: initialData?.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 50,
    specialDefense: initialData?.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 50,
    speed: initialData?.stats.find((s) => s.stat.name === 'speed')?.base_stat || 50,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const types = [
      {
        slot: 1,
        type: { name: formData.type1, url: '' },
      },
    ];

    if (formData.type2) {
      types.push({
        slot: 2,
        type: { name: formData.type2, url: '' },
      });
    }

    const stats = [
      { base_stat: formData.hp, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: formData.attack, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: formData.defense, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: formData.specialAttack, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: formData.specialDefense, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: formData.speed, effort: 0, stat: { name: 'speed', url: '' } },
    ];

    const pokemonData = {
      name: formData.name,
      height: Number(formData.height),
      weight: Number(formData.weight),
      types,
      stats,
      sprites: {
        front_default: formData.imageUrl,
        front_shiny: formData.imageUrl,
        back_default: formData.imageUrl,
        back_shiny: formData.imageUrl,
        other: {
          'official-artwork': {
            front_default: formData.imageUrl,
          },
        },
      },
      abilities: [],
      species: { name: formData.name, url: '' },
      base_experience: 100,
    };

    onSubmit(pokemonData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {mode === 'create' ? '➕ Créer un nouveau Pokémon' : '✏️ Modifier le Pokémon'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nom du Pokémon *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Pikachu"
          />
        </div>

        {/* URL de l'image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL de l'image *
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Taille */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Taille (décimètres) *
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {(formData.height / 10).toFixed(1)} mètre(s)
          </p>
        </div>

        {/* Poids */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Poids (hectogrammes) *
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {(formData.weight / 10).toFixed(1)} kilogramme(s)
          </p>
        </div>

        {/* Type 1 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type principal *
          </label>
          <select
            value={formData.type1}
            onChange={(e) => handleChange('type1', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {capitalizeFirstLetter(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Type 2 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type secondaire (optionnel)
          </label>
          <select
            value={formData.type2}
            onChange={(e) => handleChange('type2', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Aucun</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type} disabled={type === formData.type1}>
                {capitalizeFirstLetter(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'hp', label: 'PV' },
            { key: 'attack', label: 'Attaque' },
            { key: 'defense', label: 'Défense' },
            { key: 'specialAttack', label: 'Att. Spé' },
            { key: 'specialDefense', label: 'Déf. Spé' },
            { key: 'speed', label: 'Vitesse' },
          ].map((stat) => (
            <div key={stat.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {stat.label}
              </label>
              <input
                type="range"
                min="1"
                max="255"
                value={formData[stat.key]}
                onChange={(e) => handleChange(stat.key, e.target.value)}
                className="w-full"
              />
              <p className="text-center font-bold text-red-600 mt-1">
                {formData[stat.key]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prévisualisation */}
      {formData.imageUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-gray-800">👁️ Prévisualisation</h3>
          <img
            src={formData.imageUrl}
            alt="Prévisualisation"
            className="w-48 h-48 object-contain mx-auto"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200?text=Image+invalide';
            }}
          />
        </div>
      )}

      {/* Boutons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          {mode === 'create' ? '✨ Créer' : '💾 Sauvegarder'}
        </button>
      </div>
    </form>
  );
}