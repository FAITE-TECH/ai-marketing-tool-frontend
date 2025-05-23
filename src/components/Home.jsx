import React from 'react';
import { FaStar, FaChartLine, FaComments, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20 text-center px-4 pt-8 md:pt-32">
  <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to AI Marketing Tools</h1>
  <p className="text-xl md:text-2xl mb-6">Empower your campaigns with smart, automated tools</p>
  <div className="space-x-4">
    <Link to="/login">
      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
        Login
      </button>
    </Link>
    <Link to="/Register">
      <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
        Register
      </button>
    </Link>
  </div>
</section>


      {/* Introduction */}
      <section className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">Why AI Marketing Tools?</h2>
        <p className="text-gray-600 text-lg">
          Our platform helps you automate marketing tasks, improve lead conversion rates, and
          schedule campaigns with ease – all powered by artificial intelligence.
        </p>
      </section>

      {/* Core Features */}
      <section className="bg-gray-100 py-12 px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">Core Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div>
            <FaChartLine className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Lead Scoring</h3>
            <p className="text-gray-600">Identify your highest-potential leads using AI scoring models.</p>
          </div>
          <div>
            <FaClipboardList className="text-4xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Content Editor</h3>
            <p className="text-gray-600">Create and optimize marketing content quickly and effectively.</p>
          </div>
          <div>
            <FaComments className="text-4xl text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Chatbot</h3>
            <p className="text-gray-600">Automated, AI-driven chat support to convert visitors into leads.</p>
          </div>
          <div>
            <FaStar className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Campaign Scheduler</h3>
            <p className="text-gray-600">Plan and schedule marketing campaigns with precision.</p>
          </div>
        </div>
      </section>

      {/* Testimonials / Metrics */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">Trusted by Marketers</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 text-center">
          <div>
            <p className="text-gray-700 italic mb-2">
              “Since using AI Marketing Tools, our campaign efficiency has increased by 40%.”
            </p>
            <span className="font-bold text-gray-900">– Jane, Marketing Manager</span>
          </div>
          <div>
            <p className="text-gray-700 italic mb-2">
              “We’ve automated over 75% of our manual marketing work. Game changer!”
            </p>
            <span className="font-bold text-gray-900">– Rahul, Growth Hacker</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
