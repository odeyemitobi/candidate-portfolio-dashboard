import { useState, useEffect } from "react";

const CandidateForm = ({
  addCandidate,
  candidate,
  updateCandidate,
  setSelectedCandidate,
}) => {
  const initialFormState = {
    fullName: "",
    role: "",
    linkedinUrl: "",
    githubUrl: "",
    experienceLevel: "Junior",
    techStack: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const [techInput, setTechInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(candidate || initialFormState);
    setIsEditing(!!candidate);
  }, [candidate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTechInput = (e) => setTechInput(e.target.value);
  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };
  const removeTech = (tech) =>
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateCandidate(formData) : addCandidate(formData);
    setFormData(initialFormState);
    setTechInput("");
  };
  const cancelEdit = () => {
    setSelectedCandidate(null);
    setFormData(initialFormState);
    setIsEditing(false);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">
        {isEditing ? "Edit" : "Add New"} Candidate
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "fullName|Full Name",
          "role|Job Role",
          "linkedinUrl|LinkedIn URL",
          "githubUrl|GitHub URL",
        ].map((field) => {
          const [name, label] = field.split("|");
          return (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {label}
              </label>
              <input
                type={name.includes("Url") ? "url" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
                required
              />
            </div>
          );
        })}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
            required
          >
            {["Junior", "Mid", "Senior"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tech Stack
          </label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={handleTechInput}
              className="flex-1 px-3 py-2 border rounded-l-md bg-gray-800 text-white border-gray-700"
              placeholder="e.g. React, Node.js"
            />
            <button
              type="button"
              onClick={addTech}
              className="bg-gray-600 text-white px-3 py-2 rounded-r-md"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap">
            {formData.techStack.map((tech) => (
              <span key={tech} className="tag flex items-center">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="ml-1 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            {isEditing ? "Update" : "Add"} Candidate
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default CandidateForm;
