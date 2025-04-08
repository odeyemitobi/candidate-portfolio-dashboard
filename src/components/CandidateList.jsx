import { FaLinkedin, FaGithub } from "react-icons/fa";

const CandidateList = ({ candidates, openCandidateModal }) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No candidates found. Add your first candidate using the form.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="border border-gray-700 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow bg-gray-900"
          onClick={() => openCandidateModal(candidate)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-lg text-white">
                {candidate.fullName}
              </h3>
              <p className="text-gray-400">{candidate.role}</p>
            </div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                ${
                  candidate.experienceLevel === "Junior"
                    ? "bg-green-800 text-green-100"
                    : candidate.experienceLevel === "Mid"
                    ? "bg-yellow-800 text-yellow-100"
                    : "bg-purple-800 text-purple-100"
                }`}
            >
              {candidate.experienceLevel}
            </span>
          </div>

          <div className="flex space-x-3 mb-3">
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-orange-400 hover:text-orange-300"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-white"
            >
              <FaGithub size={18} />
            </a>
          </div>

          <div className="flex flex-wrap">
            {candidate.techStack.map((tech, index) => (
              <span key={index} className="tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
