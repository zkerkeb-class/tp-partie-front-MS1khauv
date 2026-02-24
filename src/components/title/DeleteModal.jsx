import React from 'react';
import { capitalizeFirstLetter } from '../../utils/helpers';

export default function DeleteModal({ pokemon, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ⚠️ Confirmer la suppression
        </h2>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer{' '}
          <span className="font-bold text-red-600">
            {capitalizeFirstLetter(pokemon.name)}
          </span>{' '}
          ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}