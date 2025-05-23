import React from 'react';
import { FaEnvelope, FaLinkedin, FaTwitter } from 'react-icons/fa';

const team = [
  {
    name: 'A.A.Jebarson',
    role: 'Co founder & CEO',
    image: '/images/A.A.Jebarson.jpg',
    bio: 'A.A.Jebarson leads Faiteplus with a passion for innovation and customer success.',
  },
  {
    name: 'Saksin Thiyagarasa',
    role: 'Co founder & CTO',
    image: '/images/Saksin.jpg',
    bio: 'Saksin Thiyagarasa architects our AI infrastructure with a focus on performance and scalability.',
  },
];

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Banner */}
      <div className="relative h-72">
        
        <div className="ml-64 mt-4 p-6 md:p-12 bg-slate-800 bg-opacity-90 rounded-b-2xl shadow-lg flex flex-col md:flex-row items-center justify-between">
  {/* Heading */}
  <div className="md:w-1/2 text-center md:text-left md:pl-75">
    <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
      About Faiteplus
    </h1>
  </div>

  {/* Image */}
  <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center md:justify-start md:-ml-4">
    <img
      src="/images/about-banner.jpg"
      alt="About Faiteplus"
      className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-xl object-cover"
    />
  </div>
</div>



      </div>

      {/* Mission & Vision */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">Our Mission & Vision</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          At Faiteplus, our mission is to empower marketers with intelligent tools that automate, analyze, and amplify their campaigns. 
          Our vision is to become the leading AI platform transforming how businesses grow and connect with their audiences.
        </p>
      </section>

      {/* Product Journey */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">Our Journey</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Born from a weekend hackathon in 2022, Faiteplus has evolved into a globally recognized AI-powered marketing suite. 
            Today, we help businesses streamline their marketing efforts with smarter tools and deeper insights.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
  <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">Meet the Team</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
    {team.map((member) => (
      <div key={member.name} className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300 text-center">
        <img
          src={member.image}
          alt={member.name}
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
        />
        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-2">{member.role}</p>
        <p className="text-gray-600 text-sm">{member.bio}</p>
      </div>
    ))}
  </div>
</section>


      {/* Contact Section */}
      <section className="bg-white py-16 px-4 text-center border-t border-gray-200">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">Get in Touch</h2>
        <p className="mb-6 text-gray-600">
          Want to collaborate or learn more about Faiteplus? We'd love to connect!
        </p>
        <div className="flex justify-center gap-8 text-2xl text-gray-700">
          <a href="mailto:contact@faiteplus.com" className="hover:text-blue-600 transition">
            <FaEnvelope />
          </a>
          <a href="https://www.linkedin.com/company/faiteplus" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/faiteplus" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">
            <FaTwitter />
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
