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

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition text-sm font-medium";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-[#111114] border border-white/5 rounded-[2rem] p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
        {mode === 'create' ? '✦ Créer un Pokémon' : '✦ Modifier le Pokémon'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <label className={labelClass}>Nom du Pokémon *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={inputClass}
            placeholder="Pikachu"
          />
        </div>

        {/* URL image */}
        <div>
          <label className={labelClass}>URL de l'image *</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            required
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Taille */}
        <div>
          <label className={labelClass}>Taille (décimètres) *</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            required
            min="1"
            className={inputClass}
          />
          <p className="text-xs text-gray-600 mt-1.5 font-bold">{(formData.height / 10).toFixed(1)} m</p>
        </div>

        {/* Poids */}
        <div>
          <label className={labelClass}>Poids (hectogrammes) *</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            required
            min="1"
            className={inputClass}
          />
          <p className="text-xs text-gray-600 mt-1.5 font-bold">{(formData.weight / 10).toFixed(1)} kg</p>
        </div>

        {/* Type 1 */}
        <div>
          <label className={labelClass}>Type principal *</label>
          <select
            value={formData.type1}
            onChange={(e) => handleChange('type1', e.target.value)}
            required
            className={inputClass + ' cursor-pointer'}
          >
            {pokemonTypes.map((type) => (
              <option key={type} value={type} className="bg-[#111114]">
                {capitalizeFirstLetter(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Type 2 */}
        <div>
          <label className={labelClass}>Type secondaire (optionnel)</label>
          <select
            value={formData.type2}
            onChange={(e) => handleChange('type2', e.target.value)}
            className={inputClass + ' cursor-pointer'}
          >
            <option value="" className="bg-[#111114]">Aucun</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type} disabled={type === formData.type1} className="bg-[#111114]">
                {capitalizeFirstLetter(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-8">
        <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-5">Statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { key: 'hp', label: 'PV' },
            { key: 'attack', label: 'Attaque' },
            { key: 'defense', label: 'Défense' },
            { key: 'specialAttack', label: 'Att. Spé' },
            { key: 'specialDefense', label: 'Déf. Spé' },
            { key: 'speed', label: 'Vitesse' },
          ].map((stat) => (
            <div key={stat.key}>
              <div className="flex justify-between mb-2">
                <label className={labelClass + ' mb-0'}>{stat.label}</label>
                <span className="text-sm font-black text-red-500">{formData[stat.key]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="255"
                value={formData[stat.key]}
                onChange={(e) => handleChange(stat.key, e.target.value)}
                className="w-full accent-red-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prévisualisation */}
      {formData.imageUrl && (
        <div className="mt-8 p-6 bg-white/3 border border-white/5 rounded-[1.5rem] flex flex-col items-center">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Prévisualisation</h3>
          <img
            src={formData.imageUrl}
            alt="Prévisualisation"
            className="w-40 h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            onError={(e) => {
              e.target.src = 'https://placehold.co/200x200/111114/666?text=?';
            }}
          />
        </div>
      )}

      {/* Boutons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition font-black uppercase tracking-widest text-xs"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-black uppercase tracking-widest text-xs"
        >
          {mode === 'create' ? '✦ Créer' : '💾 Sauvegarder'}
        </button>
      </div>
    </form>
  );
}