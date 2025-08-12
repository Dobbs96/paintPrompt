import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface Material {
  name: string;
  icon: string;
}

export default function Materials() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState("");

  const getMaterials = async () => {
    if (!username) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/user/get/materials?username=${encodeURIComponent(
          username
        )}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const result = await response.text();
      if (response.ok) {
        const parsedMaterials = result
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean)
          .map((name) => ({
            name,
            icon: "📦",
          }));
        setMaterials(parsedMaterials);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    getMaterials();
  }, [username]);

  const handleAddMaterial = async () => {
    if (!newMaterial.trim() || !username) return;

    const newEntry = {
      name: newMaterial.trim(),
      icon: "➕",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/user/add/material",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            username,
            material: newEntry.name,
          }),
        }
      );

      if (response.ok) {
        setMaterials([...materials, newEntry]);
        setNewMaterial("");
      } else {
        console.error("Failed to add material");
      }
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  const handleDeleteMaterial = async (materialName: string) => {
    if (!username) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/user/delete/material",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            username,
            material: materialName,
          }),
        }
      );

      if (response.ok) {
        const updated = materials.filter((m) => m.name !== materialName);
        setMaterials(updated);
      } else {
        console.error("Failed to delete material");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleCancel = () => {
    setNewMaterial("");
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 font-sans bg-[#F5F3FF] min-h-screen">
      <header
        className="mb-10 p-8 text-white rounded-lg"
        style={{
          background: "#AC83CA",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 rounded-full font-semibold transition"
            style={{
              background: "#AC83CA",
              border: "2px solid white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B5FBF";
              e.currentTarget.style.fontWeight = "bold";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#AC83CA";
              e.currentTarget.style.fontWeight = "600";
            }}
          >
            ← Back to Home
          </button>

          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold">My Materials Inventory</h1>
            <p className="text-lg opacity-90">
              Manage your materials and stay inspired!
            </p>
          </div>

          <div style={{ width: "135px" }} />
        </div>
      </header>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter Materials by Keyword"
          className="border border-gray-300 px-4 py-2 rounded-md w-80 shadow-sm"
        />
      </div>

      {/* Add New Material - centered */}
      <div className="flex justify-center mb-10">
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
              className="px-4 py-2 hover:bg-[#946BB8] text-white rounded-md bg-[#AC83CA]"
            >
              Add Material
            </button>
          </div>
        </div>
      </div>

      {/* Material Grid */}
      <h2 className="text-2xl font-semibold mb-4 text-center">My Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {filtered.map((material, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-lg relative transition-all duration-200"
            style={{
              border: "2px solid #AC83CA",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "2px solid #8B5FBF";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "2px solid #AC83CA";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            <button
              onClick={() => {
                if (confirm(`Delete "${material.name}"?`)) {
                  handleDeleteMaterial(material.name);
                }
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete"
            >
              ❌
            </button>
            <div className="text-4xl mb-2">{material.icon}</div>
            <h3 className="font-bold">{material.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
