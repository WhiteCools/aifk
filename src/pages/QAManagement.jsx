import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useDiscord } from '../context/DiscordContext';
import { RiDiscordFill, RiSearchLine, RiDeleteBin7Line, RiUploadLine, RiDownloadLine, RiAddLine } from 'react-icons/ri';
import { getQAData, addQA, removeQA, removeQABulk } from '../services/mongoService';

export default function QAManagement() {
  const { darkMode } = useTheme();
  const { isAuthenticated, loginWithDiscord, discordServers, discordUser } = useDiscord();
  const [qaList, setQAList] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newQA, setNewQA] = useState({ question: '', answer: '' });
  const [bulkQA, setBulkQA] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const hasServerAccess = (serverId) => {
    const server = discordServers.find(s => s.id === serverId);
    if (!server) return false;
    
    // Check if user is owner
    if (server.owner === true) {
      console.log(`User is owner of server ${server.name}`);
      return true;
    }

    // Check if user has admin permissions
    const permissions = BigInt(server.permissions);
    const ADMIN_PERMISSION = BigInt(0x8);
    const hasAdmin = (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
    
    console.log(`Server ${server.name} permission check:`, {
      isOwner: server.owner,
      permissions: server.permissions,
      hasAdmin
    });

    return hasAdmin;
  };

  // Fetch Q&A data when server is selected
  useEffect(() => {
    const fetchQAData = async () => {
      if (selectedServer && hasServerAccess(selectedServer)) {
        setLoading(true);
        try {
          const data = await getQAData(selectedServer);
          setQAList(data);
        } catch (error) {
          console.error('Failed to fetch Q&A data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setQAList({});
      }
    };

    if (isAuthenticated && selectedServer) {
      fetchQAData();
    }
  }, [isAuthenticated, selectedServer, discordServers]);

  const handleAddQA = async () => {
    if (!hasServerAccess(selectedServer)) return;

    if (newQA.question && newQA.answer && selectedServer) {
      try {
        await addQA(selectedServer, newQA.question, newQA.answer);
        setQAList({
          ...qaList,
          [newQA.question]: newQA.answer
        });
        setNewQA({ question: '', answer: '' });
        setShowAddModal(false);
      } catch (error) {
        console.error('Failed to add Q&A:', error);
      }
    }
  };

  const handleBulkAdd = async () => {
    if (!hasServerAccess(selectedServer)) return;

    if (!bulkQA.trim() || !selectedServer) return;

    try {
      const qaLines = bulkQA.split('\n');
      const qaPromises = [];
      const newQAs = {};

      for (let i = 0; i < qaLines.length; i += 2) {
        const question = qaLines[i]?.trim();
        const answer = qaLines[i + 1]?.trim();

        if (question && answer) {
          qaPromises.push(addQA(selectedServer, question, answer));
          newQAs[question] = answer;
        }
      }

      await Promise.all(qaPromises);
      setQAList({ ...qaList, ...newQAs });
      setBulkQA('');
      setShowBulkModal(false);
    } catch (error) {
      console.error('Failed to add bulk Q&A:', error);
    }
  };

  const handleRemoveQA = async (question) => {
    if (!hasServerAccess(selectedServer)) return;

    if (selectedServer) {
      try {
        await removeQA(selectedServer, question);
        const newQAList = { ...qaList };
        delete newQAList[question];
        setQAList(newQAList);
      } catch (error) {
        console.error('Failed to remove Q&A:', error);
      }
    }
  };

  const handleBulkRemove = async () => {
    if (!hasServerAccess(selectedServer)) return;

    if (selectedQuestions.size === 0 || !selectedServer) return;

    try {
      await removeQABulk(selectedServer, Array.from(selectedQuestions));
      const newQAList = { ...qaList };
      selectedQuestions.forEach(question => {
        delete newQAList[question];
      });
      setQAList(newQAList);
      setSelectedQuestions(new Set());
    } catch (error) {
      console.error('Failed to remove selected Q&As:', error);
    }
  };

  const toggleQuestionSelection = (question) => {
    if (!hasServerAccess(selectedServer)) return;

    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(question)) {
      newSelected.delete(question);
    } else {
      newSelected.add(question);
    }
    setSelectedQuestions(newSelected);
  };

  const exportQA = () => {
    if (!hasServerAccess(selectedServer)) return;

    const qaText = Object.entries(qaList)
      .map(([q, a]) => `${q}\n${a}`)
      .join('\n\n');
    
    const blob = new Blob([qaText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa_export_${selectedServer}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RiDiscordFill className="mx-auto text-6xl text-[#5865F2] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect with Discord
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your Discord account to manage Q&A
          </p>
          <button
            onClick={loginWithDiscord}
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
          >
            <RiDiscordFill className="mr-2 text-xl" />
            Connect Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Q&A Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedServer || ''}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a server</option>
            {discordServers.map(server => (
              <option key={server.id} value={server.id}>
                {server.name} {server.owner ? '(Owner)' : ''}
              </option>
            ))}
          </select>
          {selectedServer && hasServerAccess(selectedServer) && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
              >
                <RiAddLine className="mr-2" />
                Add Q&A
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
              >
                <RiUploadLine className="mr-2" />
                Bulk Add
              </button>
              <button
                onClick={exportQA}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                disabled={Object.keys(qaList).length === 0}
              >
                <RiDownloadLine className="mr-2" />
                Export
              </button>
              {selectedQuestions.size > 0 && (
                <button
                  onClick={handleBulkRemove}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <RiDeleteBin7Line className="mr-2" />
                  Remove Selected ({selectedQuestions.size})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedServer && !hasServerAccess(selectedServer) && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
          You need administrator permissions or be the owner of this server to manage Q&A.
        </div>
      )}

      {/* Search Bar */}
      {selectedServer && hasServerAccess(selectedServer) && (
        <div className="relative mb-6">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Q&A List */}
      {!loading && selectedServer && hasServerAccess(selectedServer) && (
        <div className="space-y-4">
          {Object.entries(qaList)
            .filter(([question, answer]) => 
              question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              answer.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(([question, answer]) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border ${
                  selectedQuestions.has(question)
                    ? 'border-[#5865F2] dark:border-[#5865F2]'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(question)}
                        onChange={() => toggleQuestionSelection(question)}
                        className="w-4 h-4 text-[#5865F2] border-gray-300 rounded focus:ring-[#5865F2]"
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {question}
                      </h3>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {answer}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveQA(question)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <RiDeleteBin7Line />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* Add Q&A Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add New Q&A
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-200">
                  Question
                </label>
                <input
                  type="text"
                  value={newQA.question}
                  onChange={(e) => setNewQA({ ...newQA, question: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-200">
                  Answer
                </label>
                <textarea
                  value={newQA.answer}
                  onChange={(e) => setNewQA({ ...newQA, answer: e.target.value })}
                  rows="4"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQA}
                  className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
                >
                  Add Q&A
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Bulk Add Q&A
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter questions and answers, one per line. Format:<br />
                Question 1<br />
                Answer 1<br />
                Question 2<br />
                Answer 2<br />
                ...
              </p>
              <textarea
                value={bulkQA}
                onChange={(e) => setBulkQA(e.target.value)}
                rows="10"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Question 1&#10;Answer 1&#10;Question 2&#10;Answer 2"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAdd}
                  className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
                >
                  Add All
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
