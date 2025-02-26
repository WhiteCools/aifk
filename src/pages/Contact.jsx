import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { RiMailLine, RiMessage2Line, RiSendPlane2Line } from 'react-icons/ri';

export default function Contact() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-cyber-dark' : 'bg-white'}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-neon-blue mb-8">Contact Support</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            rounded-lg shadow-lg p-6
            ${darkMode ? 'bg-cyber-black' : 'bg-white'}
            border border-neon-blue/20
          `}
        >
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                mb-6 p-4 rounded-md
                ${status.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
                }
              `}
            >
              {status.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Name
              </label>
              <div className="relative">
                <RiMessage2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`
                    w-full pl-10 pr-4 py-2 rounded-md
                    ${darkMode 
                      ? 'bg-cyber-dark text-white' 
                      : 'bg-gray-100 text-gray-900'
                    }
                    border border-neon-blue/20
                    focus:outline-none focus:ring-2 focus:ring-neon-blue
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`
                    w-full pl-10 pr-4 py-2 rounded-md
                    ${darkMode 
                      ? 'bg-cyber-dark text-white' 
                      : 'bg-gray-100 text-gray-900'
                    }
                    border border-neon-blue/20
                    focus:outline-none focus:ring-2 focus:ring-neon-blue
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className={`
                  w-full p-4 rounded-md
                  ${darkMode 
                    ? 'bg-cyber-dark text-white' 
                    : 'bg-gray-100 text-gray-900'
                  }
                  border border-neon-blue/20
                  focus:outline-none focus:ring-2 focus:ring-neon-blue
                `}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 rounded-md
                bg-gradient-to-r from-neon-blue to-neon-purple
                text-white font-medium
                hover:from-neon-blue/90 hover:to-neon-purple/90
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2
                ${darkMode ? 'focus:ring-offset-cyber-black' : 'focus:ring-offset-white'}
                flex items-center justify-center
                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <RiSendPlane2Line className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className={`
          mt-8 p-6 rounded-lg
          ${darkMode ? 'bg-cyber-black' : 'bg-gray-50'}
          border border-neon-blue/20
        `}>
          <h3 className="text-lg font-semibold text-neon-blue mb-4">
            Other Ways to Reach Us
          </h3>
          <div className="space-y-4">
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <strong>Email:</strong> support@yuigariko.com
            </p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <strong>Discord:</strong> Join our support server
            </p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <strong>Hours:</strong> 24/7 Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
