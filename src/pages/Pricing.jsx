import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { RiCheckLine, RiStarFill } from 'react-icons/ri';

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    features: [
      'Up to 3 Discord servers',
      'Basic Q&A management',
      'Standard response time',
      'Email support',
    ],
    recommended: false,
  },
  {
    name: 'Pro',
    price: '$24.99',
    period: '/month',
    features: [
      'Up to 10 Discord servers',
      'Advanced Q&A management',
      'Priority response time',
      'Priority support',
      'Custom bot commands',
      'Analytics dashboard',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    period: '/month',
    features: [
      'Unlimited Discord servers',
      'Advanced Q&A management',
      'Instant response time',
      '24/7 dedicated support',
      'Custom bot commands',
      'Advanced analytics',
      'Custom integrations',
      'API access',
    ],
    recommended: false,
  },
];

export default function Pricing() {
  const { darkMode } = useTheme();

  return (
    <div className={`p-4 ${darkMode ? 'bg-cyber-dark' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold text-neon-blue mb-8">Pricing Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative rounded-lg overflow-hidden
              ${darkMode ? 'bg-cyber-black' : 'bg-white'}
              ${plan.recommended ? 'border-2 border-neon-blue' : 'border border-neon-blue/20'}
              shadow-lg hover:shadow-neon-blue transition-shadow duration-300
            `}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-neon-blue text-white px-4 py-1 rounded-bl-lg">
                Recommended
              </div>
            )}

            <div className="p-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-neon-blue">{plan.price}</span>
                <span className={`ml-1 text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <RiCheckLine className="h-5 w-5 text-neon-blue flex-shrink-0" />
                    <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`
                  mt-8 w-full py-3 px-4 rounded-md
                  ${plan.recommended
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                    : `${darkMode ? 'bg-cyber-dark' : 'bg-gray-100'} text-neon-blue border border-neon-blue`
                  }
                  hover:opacity-90 transition-opacity
                  focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2
                  ${darkMode ? 'focus:ring-offset-cyber-black' : 'focus:ring-offset-white'}
                `}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`mt-12 p-6 rounded-lg ${darkMode ? 'bg-cyber-black' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold text-neon-blue mb-4">
          Enterprise Solutions
        </h3>
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Need a custom solution? Contact us for a tailored package that meets your specific requirements.
        </p>
        <button className="px-6 py-2 bg-neon-blue text-white rounded-md hover:bg-neon-blue/90 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
