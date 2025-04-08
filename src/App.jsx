import { useState, useEffect } from "react";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    experience: "",
    techStack: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("candidates");
    stored && setCandidates(JSON.parse(stored));
  }, []);

  const updateLocalStorage = (updatedCandidates) => {
    setCandidates(updatedCandidates);
    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
  };

  const addCandidate = (candidate) =>
    updateLocalStorage([...candidates, { ...candidate, id: uuidv4() }]);
  const updateCandidate = (candidate) => {
    updateLocalStorage(
      candidates.map((c) => (c.id === candidate.id ? candidate : c))
    );
    setSelectedCandidate(null);
    setShowModal(false);
  };
  const deleteCandidate = (id) => {
    updateLocalStorage(candidates.filter((c) => c.id !== id));
    setSelectedCandidate(null);
    setShowModal(false);
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      (!filters.role ||
        c.role.toLowerCase().includes(filters.role.toLowerCase())) &&
      (!filters.experience || c.experienceLevel === filters.experience) &&
      (!filters.techStack ||
        c.techStack.some((t) =>
          t.toLowerCase().includes(filters.techStack.toLowerCase())
        ))
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) =>
    sortBy === "name"
      ? a.fullName.localeCompare(b.fullName)
      : sortBy === "experience"
      ? { Junior: 1, Mid: 2, Senior: 3 }[a.experienceLevel] -
        { Junior: 1, Mid: 2, Senior: 3 }[b.experienceLevel]
      : 0
  );

  const exportToJSON = () => {
    const jsonData = candidates.map((c) => ({
      name: c.fullName,
      role: c.role,
      linkedinUrl: c.linkedinUrl,
      githubUrl: c.githubUrl,
      experienceLevel: c.experienceLevel,
      techStack: c.techStack,
    }));
    const jsonString = JSON.stringify(jsonData, null, 2);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([jsonString], { type: "application/json" })
    );
    link.download = "candidates.json";
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen overflow-hidden flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Candidate Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-4 bg-black p-6 rounded-lg shadow-md border border-gray-800 self-start">
          <CandidateForm
            {...{
              addCandidate,
              candidate: selectedCandidate,
              updateCandidate,
              setSelectedCandidate,
            }}
          />
        </div>

        <div className="lg:col-span-8 bg-black p-6 rounded-lg shadow-md border border-gray-800 flex flex-col">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Candidates</h2>
            <div className="flex space-x-2">
              <select
                className="px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="experience">Experience</option>
              </select>
              <button
                onClick={exportToJSON}
                className="bg-gray-600 text-white px-3 py-2 rounded-md"
              >
                Export File
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              "role|Filter by Role|e.g. Frontend Developer",
              "experience|Filter by Experience|",
              "techStack|Filter by Tech|e.g. React",
            ].map((f) => {
              const [key, label, placeholder] = f.split("|");
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                  </label>
                  {key === "experience" ? (
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
                      value={filters[key]}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.value })
                      }
                    >
                      <option value="">All Levels</option>
                      {["Junior", "Mid", "Senior"].map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
                      value={filters[key]}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800 p-4 rounded-md mb-4 flex justify-around text-center">
            {["Junior", "Mid", "Senior", "Total"].map((level, i) => (
              <div key={level}>
                <span className="block text-lg font-semibold text-white">
                  {i === 3
                    ? candidates.length
                    : candidates.filter((c) => c.experienceLevel === level)
                        .length}
                </span>
                <span className="text-sm text-gray-300">
                  {level === "Total"
                    ? level
                    : `${level}${i === 1 ? "-Level" : ""}`}
                </span>
              </div>
            ))}
          </div>

          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 450px)" }}
          >
            <CandidateList
              candidates={sortedCandidates}
              openCandidateModal={(c) => {
                setSelectedCandidate(c);
                setShowModal(true);
              }}
            />
          </div>

          {candidates.length > 10 && (
            <nav className="flex justify-center mt-4 inline-flex rounded-md shadow">
              <button className="px-3 py-1 rounded-l-md border bg-gray-800 text-white border-gray-700">
                Previous
              </button>
              <button className="px-3 py-1 border bg-gray-900 text-orange-500 border-gray-700">
                1
              </button>
              <button className="px-3 py-1 border bg-gray-800 text-white border-gray-700">
                2
              </button>
              <button className="px-3 py-1 rounded-r-md border bg-gray-800 text-white border-gray-700">
                Next
              </button>
            </nav>
          )}
        </div>
      </div>

      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Candidate Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                "fullName|Full Name",
                "role|Role",
                "experienceLevel|Experience Level",
                "techStack|Tech Stack",
                "linkedinUrl|LinkedIn",
                "githubUrl|GitHub",
              ].map((f) => {
                const [key, label] = f.split("|");
                const value =
                  key === "techStack" ? (
                    selectedCandidate[key].map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))
                  ) : key === "experienceLevel" ? (
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCandidate[key] === "Junior"
                          ? "bg-green-800 text-green-100"
                          : selectedCandidate[key] === "Mid"
                          ? "bg-yellow-800 text-yellow-100"
                          : "bg-purple-800 text-purple-100"
                      }`}
                    >
                      {selectedCandidate[key]}
                    </span>
                  ) : ["linkedinUrl", "githubUrl"].includes(key) ? (
                    <a
                      href={selectedCandidate[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline"
                    >
                      {selectedCandidate[key]}
                    </a>
                  ) : (
                    selectedCandidate[key]
                  );
                return (
                  <div key={key}>
                    <h3 className="font-medium text-gray-300">{label}</h3>
                    <p className="text-white">{value}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCandidate(selectedCandidate.id)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;