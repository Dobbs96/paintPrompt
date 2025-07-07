import { useState } from 'react';

interface Material {
  name: string;
  category: string;
  icon: string;
}

export default function Materials() {
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState<Material[]>([
    {
      name: 'Acrylic Paint',
      category: 'Paint',
      icon: '🎨',
    },
    {
      name: 'Synthetic Brush',
      category: 'Brushes',
      icon: '🖌️',
    },
    {
      name: 'Canvas Pad',
      category: 'Surfaces',
      icon: '🪵',
    },
  ]);

  const [newMaterial, setNewMaterial] = useState('');

  const handleAddMaterial = () => {
    if (!newMaterial.trim()) return;

    setMaterials([
      ...materials,
      {
        name: newMaterial.trim(),
        category: 'Uncategorized',
        icon: '➕',
      },
    ]);
    setNewMaterial('');
  };

  const handleCancel = () => {
    setNewMaterial('');
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-center">My Materials Inventory</h1>
      <p className="text-center text-gray-600 mb-6">Manage your materials and stay inspired!</p>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter Materials by Keyword"
          className="border border-gray-300 px-4 py-2 rounded-md w-80 shadow-sm"
        />
      </div>

      {/* Material Grid */}
      <h2 className="text-2xl font-semibold mb-4 text-center">My Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {filtered.map((material, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 border rounded-lg shadow-sm"
          >
            <div className="text-4xl mb-2">{material.icon}</div>
            <h3 className="font-bold">{material.name}</h3>
            <p className="text-sm text-gray-500">Category: {material.category}</p>
          </div>
        ))}
      </div>

      {/* Add New Material */}
      <h2 className="text-xl font-bold mb-2">Add New Material</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={newMaterial}
          onChange={(e) => setNewMaterial(e.target.value)}
          placeholder="Enter name of the material"
          className="border px-4 py-2 rounded-md w-full sm:w-80"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-black rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMaterial}
            className="px-4 py-2 bg-purple-400 hover:bg-purple-500 text-white rounded-md"
          >
            Add Material
          </button>
        </div>
      </div>
    </div>
  );
}
