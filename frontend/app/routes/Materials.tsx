import { useState } from "react";
import { useEffect} from "react";
import { useNavigate } from "react-router";

//for future thought: remove category? introduce emoji that users can change?
interface Material {
    name: string;
    category: string;
    icon: string;
}

export default function Materials() {

    const navigate = useNavigate();

    const [username, setUsername] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [materials, setMaterials] = useState<Material[]>([

    ]);
    const [newMaterial, setNewMaterial] = useState("");

    // new - fetch materials
    const getMaterials = async () => {
        if(!username) return;
        try{
            const response = await fetch(`http://localhost:8080/api/user/get/materials?username=${encodeURIComponent(
                username
            )}`);
            
            const result = await response.text();
            if(response.ok) {
                const parsedMaterials = result
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean)
                    .map((name) => ({
                        name,
                        category: "Uncategorized",
                        icon: "📦",
                    }));
                setMaterials(parsedMaterials);
            }
        }
        catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    useEffect(() => {
        if(typeof window !== "undefined") {
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
            category: "Uncategorized",
            icon: "➕",
        };

        try {
            const response = await fetch("http://localhost:8080/api/user/add/material", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    material: newEntry.name, 
                }),
            });

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
        const response = await fetch("http://localhost:8080/api/user/delete/material", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                material: materialName,
            }),
        });

        if (response.ok) {
            // remove from local state
            const updated = materials.filter(m => m.name !== materialName);
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

        

        <div className="p-8 max-w-5xl mx-auto">

            <div className="flex justify-center mb-6">
            <button
                className="bg-[#AC83CA] hover:bg-[#946888] text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-lg"
                onClick={() => navigate("/Home")}
            >
                Back
            </button>
            </div>

            {/* Header */}
            <h1 className="text-3xl font-bold mb-2 text-center">
                My Materials Inventory
            </h1>
            <p className="text-center text-gray-600 mb-6">
                Manage your materials and stay inspired!
            </p>


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
            <h2 className="text-2xl font-semibold mb-4 text-center">
                My Materials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {filtered.map((material, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center p-4 border rounded-lg shadow-sm relative"
                    >
                        <button
                            onClick={() =>  {
                                if(confirm(`Delete "${material.name}"?`)) {
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
                        <p className="text-sm text-gray-500">
                            Category: {material.category}
                        </p>
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