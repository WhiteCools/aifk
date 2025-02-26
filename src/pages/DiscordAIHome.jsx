import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiRobot2Line, RiQuestionAnswerLine, RiSettings4Line, RiDiscordFill } from 'react-icons/ri';

export default function DiscordAIHome() {
  const features = [
    {
      title: "Discord AI Assistant",
      description: "AI-powered customer service bot with predefined answers and OpenAI integration",
      icon: <RiRobot2Line className="text-4xl text-[#5865F2]" />,
      link: "/discord-ai"
    },
    {
      title: "Q&A Management",
      description: "Manage your server's FAQ database with custom questions and answers",
      icon: <RiQuestionAnswerLine className="text-4xl text-purple-600" />,
      link: "/qa-management"
    },
    {
      title: "Server Setup",
      description: "Configure channels and categories for your Discord bot",
      icon: <RiSettings4Line className="text-4xl text-blue-600" />,
      link: "/server-setup"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Discord AI Solutions
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Enhance your Discord server with AI-powered customer service and automated Q&A management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={feature.link}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-[#5865F2] rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bot Status</h2>
            <p className="text-blue-100">Currently serving multiple Discord servers</p>
          </div>
          <RiDiscordFill className="text-6xl opacity-50" />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Server Count</h3>
            <p className="text-2xl">Loading...</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-1">CPU Usage</h3>
            <p className="text-2xl">Loading...</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Memory Usage</h3>
            <p className="text-2xl">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
