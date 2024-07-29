import o1 from '../images/courses/online/o1.png';
import o1_1 from '../images/courses/online/o1.1.png';
import o2 from '../images/courses/online/o2.png';
import o1_2 from '../images/courses/online/o2.1.png';
import o3 from '../images/courses/online/o3.png';
import o1_3 from '../images/courses/online/o3.1.png';
import o4 from '../images/courses/online/o4.png';
import o1_4 from '../images/courses/online/o4.1.png';
import o5 from '../images/courses/online/o5.png';
import o1_5 from '../images/courses/online/o5.1.png';
import o6 from '../images/courses/online/o6.png';
import o1_6 from '../images/courses/online/o6.1.png';
import o7 from '../images/courses/online/o7.png';
import o1_7 from '../images/courses/online/o7.1.png';
import o8 from '../images/courses/online/o8.png';
import o1_8 from '../images/courses/online/o8.1.png';
import o9 from '../images/courses/online/o9.png';
import o1_9 from '../images/courses/online/o9.1.png';
import o10 from '../images/courses/online/o10.png';
import o1_10 from '../images/courses/online/o10.1.png';
import o11 from '../images/courses/online/o11.png';
import o1_11 from '../images/courses/online/o11.1.png';
import o12 from '../images/courses/online/o12.png';
import o1_12 from '../images/courses/online/o12.1.png';

import successStory from '../images/stats/successStories.png';
import tutors from '../images/stats/tutors.png';
import schedules from '../images/stats/schedule.png';
import courses from '../images/stats/courses.png';

import company from '../images/company.png';
import schedule from '../images/schedule.png';
import analysis from '../images/analysis.png';
import resume from '../images/resume.png';
import coverLetter from '../images/cover-letter.png';
import counselling from '../images/counselling.png';
import chat from '../images/chat.png';
import academics from '../images/academics.png';
import profile from '../images/profile.png';
import feedback from '../images/feedback.png';
import bestjob from '../images/bestjob.png'

import learning from '../images/banner/storytelling.png';
import certificate from '../images/banner/diploma.png';
import career from '../images/banner/athlete.png';

import c1 from '../images/courses/c1.png';
import c2 from '../images/courses/c2.png';
import c3 from '../images/courses/c3.png';
import c4 from '../images/courses/c4.png';
import c5 from '../images/courses/c5.png';
import c6 from '../images/courses/c6.png';
import c7 from '../images/courses/c7.png';
import c8 from '../images/courses/c8.png';
import c9 from '../images/courses/c9.png';

// import { CiHome } from "react-icons/ci";
// import { MdOutlineAccountCircle } from "react-icons/md";
// import { AiOutlineContacts } from "react-icons/ai";
// import { ReactElement } from 'react';
import avatar from '../images/courses/profile.gif';

const randomStatus = () => Math.random() > 0.5 ? "Pending" : "Approved"

export interface jobRoleTypes {
  id: string;
  title: string;
  description: string;
  requirements: string;
  experience: string;
  status: string;
}

export const demoJobRoles: jobRoleTypes[] = [
    {
      id: "role1",
      title: "Software Engineer",
      description: "Develops and maintains software applications. Collaborates with cross-functional teams to design and implement new features.",
      requirements: "BCA, MCA, B.Tech, M.Tech, JavaScript, Python, Java",
      experience: "3+ years experience",
      status: randomStatus()
    },
    {
      id: "role2",
      title: "Product Manager",
      description: "Leads the development of products from concept to launch. Defines product vision, strategy, and roadmap. Works closely with engineering, marketing, and sales teams.",
      requirements: "Strong analysis, Problem-solving, Product launch",
      experience: "5+ years of experience in product management",
      status: randomStatus()
    },
    {
      id: "role3",
      title: "Graphic Designer",
      description: "Creates visual designs for various media, including websites, social media, and print materials. Develops creative concepts and ensures design consistency.",
      requirements: "Bachelor's degree, Graphic Design, Adobe Creative Suite, Design tools, Strong design skills",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role4",
      title: "Digital Marketing Specialist",
      description: "Develops and executes digital marketing campaigns. Manages SEO, PPC, email marketing, and social media strategies. Analyzes performance and optimizes campaigns.",
      requirements: "SEO, SEM, Social media platforms, Data analysis, Data-driven decisions.",
      experience: "2+ years of experience in digital marketing",
      status: randomStatus()
    },
    {
      id: "role5",
      title: "Sales Executive",
      description: "Generates and follows up on sales leads. Develops and maintains relationships with clients. Achieves sales targets and contributes to revenue growth.",
      requirements: "Communication skills, Negotiation skills, Manage deals, Meet sales targets",
      experience: "3+ years of experience in sales",
      status: randomStatus()
    },
    {
      id: "role6",
      title: "Human Resources Manager",
      description: "Manages HR functions including recruitment, employee relations, and performance management. Ensures compliance with labor laws and company policies.",
      requirements: "Strong knowledge of labor laws, HR practices, Interpersonal skill, Communication skills.",
      experience: "5+ years of experience in HR management",
      status: randomStatus()
    },
    {
      id: "role7",
      title: "Data Analyst",
      description: "Analyzes complex data sets to identify trends and insights. Creates reports and visualizations to support business decisions. Develops predictive models and performs data mining.",
      requirements: "Statistics, Mathematics, SQL, Excel, Python, Analytical skill, Problem-solving",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role8",
      title: "Customer Support Representative",
      description: "Provides assistance to customers by resolving inquiries and issues. Ensures a positive customer experience through effective communication and problem-solving.",
      requirements: "Communication skill, Customer service, Support roles, Professionalism.",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role9",
      title: "Project Manager",
      description: "Coordinates and manages projects from initiation to completion. Oversees project timelines, budgets, and resources. Communicates with stakeholders and ensures project goals are met.",
      requirements: "Organizational skills, Leadership skills, Project management tools, Project management methodologies",
      experience: "3+ years of experience in project management",
      status: randomStatus()
    },
    {
      id: "role10",
      title: "Content Writer",
      description: "Writes and edits content for websites, blogs, and marketing materials. Ensures content is engaging, accurate, and aligned with brand voice. Conducts research and adheres to SEO best practices.",
      requirements: "Writing skill, Editing skill, Research skill, SEO, Content management systems",
      experience: "2+ years of experience in content writing",
      status: randomStatus()
    },
    {
      id: "role11",
      title: "UX/UI Designer",
      description: "Designs user interfaces and experiences for web and mobile applications. Conducts user research, creates wireframes and prototypes, and collaborates with developers to ensure a seamless user experience.",
      requirements: "Degree in Design, Design tools, Sketch, Figma, Adobe XD, UX/UI, Design projects",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role12",
      title: "Database Administrator",
      description: "Manages and maintains database systems. Ensures database performance, security, and availability. Performs data backups, restores, and optimizations.",
      requirements: "BCA, MCA, B.Tech, M.Tech, DBMS, MySQL, PostgreSQL, Oracle, Database security, Database optimization",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role13",
      title: "Network Engineer",
      description: "Designs, implements, and manages network infrastructure. Troubleshoots network issues and ensures network security. Works with hardware and software to maintain network performance.",
      requirements: "Networking, Network protocols, Hardware, Security, CCNA, CompTIA Network+",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role14",
      title: "Business Analyst",
      description: "Analyzes business processes and identifies areas for improvement. Gathers requirements, creates documentation, and collaborates with stakeholders to implement solutions.",
      requirements: "Degree in Business, IT, Business analysis, Consulting, Analytical skills, Communication skills",
      experience: "",
      status: randomStatus()
    },
    {
      id: "role15",
      title: "Cybersecurity Specialist",
      description: "Protects an organization's IT infrastructure from cyber threats. Monitors networks for security breaches, performs vulnerability assessments, and responds to incidents.",
      requirements: "Cybersecurity, Computer Science, Cybersecurity tools, Cybersecurity practices, CISSP, CEH",
      experience: "",
      status: randomStatus()
    }
];
  
  


export interface Candidate {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    filename: string | undefined;
    status: 'approved' | 'pending';
    jobRole: string;
}

export const demoCandidates: Candidate[] = [
  {id: 1, name: 'John Doe', email: 'john.doe@example.com', address: '123 Elm St', phone: '555-1234', filename: 'john_doe_cv.pdf', status: 'pending', jobRole: 'Software Developer' },
  {id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', address: '456 Oak St', phone: '555-5678', filename: 'jane_smith_cv.pdf', status: 'approved', jobRole: 'Product Manager' },
  {id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', address: '789 Pine St', phone: '555-8765', filename: 'alice_johnson_cv.pdf', status: 'pending', jobRole: 'UI/UX Designer' },
  {id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', address: '101 Maple St', phone: '555-4321', filename: 'bob_brown_cv.pdf', status: 'approved', jobRole: 'Data Analyst' },
  {id: 5, name: 'Emily Davis', email: 'emily.davis@example.com', address: '202 Birch St', phone: '555-1122', filename: 'emily_davis_cv.pdf', status: 'pending', jobRole: 'Marketing Specialist' },
  {id: 6, name: 'Michael Wilson', email: 'michael.wilson@example.com', address: '303 Cedar St', phone: '555-3344', filename: 'michael_wilson_cv.pdf', status: 'approved', jobRole: 'Business Analyst' },
  {id: 7, name: 'Sarah Lee', email: 'sarah.lee@example.com', address: '404 Fir St', phone: '555-5566', filename: 'sarah_lee_cv.pdf', status: 'pending', jobRole: 'Software Engineer' },
  {id: 8, name: 'David Martin', email: 'david.martin@example.com', address: '505 Spruce St', phone: '555-7788', filename: 'david_martin_cv.pdf', status: 'approved', jobRole: 'Project Manager' },
  {id: 9, name: 'Laura Taylor', email: 'laura.taylor@example.com', address: '606 Aspen St', phone: '555-9900', filename: 'laura_taylor_cv.pdf', status: 'pending', jobRole: 'Content Writer' },
  {id: 10, name: 'James Anderson', email: 'james.anderson@example.com', address: '707 Redwood St', phone: '555-2233', filename: 'james_anderson_cv.pdf', status: 'approved', jobRole: 'HR Specialist' },
  {id: 11, name: 'Linda Thomas', email: 'linda.thomas@example.com', address: '808 Willow St', phone: '555-4455', filename: 'linda_thomas_cv.pdf', status: 'pending', jobRole: 'Sales Executive' },
  {id: 12, name: 'Chris White', email: 'chris.white@example.com', address: '909 Sycamore St', phone: '555-6677', filename: 'chris_white_cv.pdf', status: 'approved', jobRole: 'Customer Support' },
  {id: 13, name: 'Patricia Harris', email: 'patricia.harris@example.com', address: '1010 Chestnut St', phone: '555-8899', filename: 'patricia_harris_cv.pdf', status: 'pending', jobRole: 'Operations Manager' },
  {id: 14, name: 'Kevin Clark', email: 'kevin.clark@example.com', address: '1111 Poplar St', phone: '555-1001', filename: 'kevin_clark_cv.pdf', status: 'approved', jobRole: 'Graphic Designer' },
  {id: 15, name: 'Barbara Lewis', email: 'barbara.lewis@example.com', address: '1212 Willow St', phone: '555-2002', filename: 'barbara_lewis_cv.pdf', status: 'pending', jobRole: 'Web Developer' },
  {id: 16, name: 'Thomas Young', email: 'thomas.young@example.com', address: '1313 Pine St', phone: '555-3003', filename: 'thomas_young_cv.pdf', status: 'approved', jobRole: 'DevOps Engineer' },
  {id: 17, name: 'Jessica Hall', email: 'jessica.hall@example.com', address: '1414 Oak St', phone: '555-4004', filename: 'jessica_hall_cv.pdf', status: 'pending', jobRole: 'Database Administrator' },
  {id: 18, name: 'Daniel Wright', email: 'daniel.wright@example.com', address: '1515 Maple St', phone: '555-5005', filename: 'daniel_wright_cv.pdf', status: 'approved', jobRole: 'Systems Analyst' },
  {id: 19, name: 'Megan Scott', email: 'megan.scott@example.com', address: '1616 Birch St', phone: '555-6006', filename: 'megan_scott_cv.pdf', status: 'pending', jobRole: 'Network Engineer' },
  {id: 20, name: 'Paul Adams', email: 'paul.adams@example.com', address: '1717 Cedar St', phone: '555-7007', filename: 'paul_adams_cv.pdf', status: 'approved', jobRole: 'Technical Writer' },
  {id: 21, name: 'Nancy Baker', email: 'nancy.baker@example.com', address: '1818 Fir St', phone: '555-8008', filename: 'nancy_baker_cv.pdf', status: 'pending', jobRole: 'IT Support Specialist' },
  {id: 22, name: 'Steven Martinez', email: 'steven.martinez@example.com', address: '1919 Spruce St', phone: '555-9009', filename: 'steven_martinez_cv.pdf', status: 'approved', jobRole: 'QA Engineer' },
];

localStorage.setItem('demoCandidateData', JSON.stringify(demoCandidates))

export default demoCandidates;


export const onlineCourses = [
  {
      cover: o1,
      hoverCover: o1_1,
      courseName: "UI/UX Design",
      course: "25 Courses",
  },
  {
      cover: o2,
      hoverCover: o1_2,
      courseName: "Designing",
      course: "25 Courses",
  },
  {
      cover: o3,
      hoverCover: o1_3,
      courseName: "Computer Science",
      course: "25 Courses",
  },
  {
      cover: o4,
      hoverCover: o1_4,
      courseName: "Marketing",
      course: "25 Courses",
  },
  {
      cover: o5,
      hoverCover: o1_5,
      courseName: "Robotics",
      course: "30 Courses",
  },
  {
      cover: o6,
      hoverCover: o1_6,
      courseName: "IT Management",
      course: "25 Courses",
  },
  {
      cover: o7,
      hoverCover: o1_7,
      courseName: "Medical",
      course: "25 Courses",
  },
  {
      cover: o8,
      hoverCover: o1_8,
      courseName: "Accounting",
      course: "25 Courses",
  },
  {
      cover: o9,
      hoverCover: o1_9,
      courseName: "Graphic Design",
      course: "25 Courses",
  },
  {
      cover: o10,
      hoverCover: o1_10,
      courseName: "Music",
      course: "25 Courses",
  },
  {
      cover: o11,
      hoverCover: o1_11,
      courseName: "Business",
      course: "25 Courses",
  },
  {
      cover: o12,
      hoverCover: o1_12,
      courseName: "Web Development",
      course: "25 Courses",
  },
];

export const statCard = [
  {
      imgLink: successStory,
      num: '100',
      title: 'success stories',
  },
  {
      imgLink: tutors,
      num: '300',
      title: 'trusted tutors',
  },
  {
      imgLink: schedules,
      num: '400',
      title: 'schedules',
  },
  {
      imgLink: courses,
      num: '1000',
      title: 'courses',
  },
];

export const buttonsData = [
  {
      imgSrc: company,
      alt: 'Hiring Companies',
      text: 'Discover job openings. Explore descriptions, company profiles, and reviews. Apply to exciting roles.',
      bgColor: 'bg-[#FFB293] bg-opacity-40 border-2 border-orange-300 hover:shadow-[#FFB293]',
      textColor: 'text-[#FF4800]',
      titleColor: 'text-[#AC3100]',
      link: '/ALLJobRole'
  },
  {
      imgSrc: schedule,
      alt: 'Schedule',
      text: 'Effortlessly manage appointments and deadlines. Organize tasks and set reminders for productivity.',
      bgColor: 'bg-[#BFEFFF] bg-opacity-50  border-2 border-blue-300 hover:shadow-[#BFEFFF]',
      textColor: 'text-[#00A8E0]',
      titleColor: 'text-[#256E86]',
      link: '/StudentSchedule'
  },
  {
      imgSrc: analysis,
      alt: 'Analytics and Reporting',
      text: 'Gain insights into performance. Track metrics and visualize data for informed decisions.',
      bgColor: 'bg-[#AFFFAF] bg-opacity-30 border-2 border-green-400 hover:shadow-[#AFFFAF]',
      textColor: 'text-[#00C42C]',
      titleColor: 'text-[#00731A]',
      link: '/analytics-reporting'
  },
  {
      imgSrc: resume,
      alt: 'Resume',
      text: 'Our resume-building tool guides you to create professional documents that stand out to employers.',
      bgColor: 'bg-[#FFF09D] bg-opacity-50 border-2 border-yellow-400 hover:shadow-[#FFF09D]',
      textColor: 'text-[#E09200]',
      titleColor: 'text-[#776F1C]',
      link: '/createResume'
  },
  {
      imgSrc: coverLetter,
      alt: 'Cover Letter',
      text: 'Write persuasive cover letters. Showcase passion, qualifications, and alignment with company values.',
      bgColor: 'bg-[#FFACD5] bg-opacity-30 border-2 border-pink-300 hover:shadow-[#FFACD5]',
      textColor: 'text-[#FA3B9B]',
      titleColor: 'text-[#A30050]',
      link: '/StudentCoverLetter'
  },
  {
      imgSrc: counselling,
      alt: 'Career Counselling',
      text: 'Receive personalized guidance. Explore career paths, seek job search advice, and plan next steps.',
      bgColor: 'bg-[#EC9DFF] bg-opacity-30 border-2 border-violet-300 hover:shadow-[#EC9DFF]', 
      textColor: 'text-[#BA55D3]',
      titleColor: 'text-[#9500BA]',
      link: '/CareerCounselling'
  },
  {
      imgSrc: chat,
      alt: 'Chat',
      text: 'Connect with peers, mentors, and experts. Exchange ideas, ask questions, and build relationships.',
      bgColor: 'bg-[#A3FFF6] bg-opacity-30 border-2 border-cyan-400 hover:shadow-[#A3FFF6]', 
      textColor: 'text-[#10C0AE]',
      titleColor: 'text-[#007569]',
      link: '/chat'
  },
  {
      imgSrc: academics,
      alt: 'Academics',
      text: 'Access study materials and support. Excel in studies with educational resources and tuto services.',
      bgColor: 'bg-[#FFAFA0] bg-opacity-30 border-2 border-pink-300 hover:shadow-[#FFAFA0]', 
      textColor: 'text-[#FF6347]',
      titleColor: 'text-[#B6341B]',
      link: '/student-academics'
  },
  {
      imgSrc: profile,
      alt: 'Profile',
      text: 'Create a comprehensive profile. Highlight skills, experiences, and accomplishments for opportunities.',
      bgColor: 'bg-[#9F90FF] bg-opacity-30 border-2 border-indigo-300 hover:shadow-[#9F90FF]',
      textColor: 'text-[#6A5ACD]',
      titleColor: 'text-[#241396]',
      link: '/StudentProfile'
  },
  {
      imgSrc: feedback,
      alt: 'Feedback',
      text: 'Share thoughts and suggestions. Help improve our platform and enhance user experience.',
      bgColor: 'bg-[#D9FFB1] bg-opacity-30 border-2 border-green-300 hover:shadow-[#D9FFB1]',
      textColor: 'text-[#55BE16]',
      titleColor: 'text-[#00731A]',
      link: '/Feedback'
  },
  {
      imgSrc: bestjob,
      alt: 'Best Job',
      text: 'Discover your perfect career match. Find jobs tailored to your skills and aspirations.',
      bgColor: 'bg-[#FFACD5] bg-opacity-30 border-2 border-pink-300 hover:shadow-[#FFACD5]',
      textColor: 'text-[#55BE16]',
      titleColor: 'text-[#00731A]',
      link: '/bestjob'
  }
];

export const aboutUsCardContent = [
  {
      link: learning,
      title: 'interactive learning',
      details: `We understand that each student learns differently. That's why our courses are crafted to be interactive, engaging, and adaptable to various learning styles`,
  },
  {
      link: certificate,
      title: 'earn a certificates',
      details: `At StuMate, our certifications symbolize skill mastery. Beyond marking course completion, they celebrate your expertise and success.`,
  },
  {
      link: career,
      title: 'career advancement',
      details: `Education as Your Career Catalyst. StuMate guides students in bridging the gap between education and professional success.`,
  }
];

export const coursesCard = [
  {
      cover: c1,
      coursesName: "Introducing to Cloud IOT Edge ML",
      joinNowLink :"https://youtu.be/7s-ZHB-l0dk?si=HC11SotVfFWr_VeV",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Dr. Rajiv Mishra",
              totalTime: "24 lectures (150 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c2,
      coursesName: "Introduction to Artificial Intelligence",
      joinNowLink: "https://youtu.be/uB3i-qV6VdM?si=L2LuCJ9NZQ1yOPy3",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Gate Smashers",
              totalTime: "50 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c3,
      coursesName: "Graphics Designing With Photoshop",
      joinNowLink: "https://youtu.be/ZByhs9mDtDg?si=wQIkXk8hVaLXk15I",
      courTeacher: [
          {
              dcover: avatar,
              name: "by GFXMentor",
              totalTime: "50 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c4,
      coursesName: "Web Development & Designing with WordPress",
      joinNowLink: "https://youtu.be/-6q3Rt1MTtk?si=gBg98q1nX6Ws7Qpi",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Soumya",
              totalTime: "50 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c5,
      coursesName: "Frontend Framework with ReactJS",
      joinNowLink: "https://youtu.be/tiLWCNFzThE?si=c0MSEujtDmuwERlB",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Thapa Technical",
              totalTime: "50 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c6,
      coursesName: "Learn Network Security & Socket Programming",
      joinNowLink: "https://youtu.be/JFF2vJaN0Cw?si=jG4IErAqXrL2UXsX",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Varun Singla",
              totalTime: "50 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c7,
      coursesName: "Frontend Development with HTML, CSS and JS",
      joinNowLink: "https://youtu.be/6mbwJ2xhgzM?si=U5D0XnwcEzL1tMQU",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Code With Harry",
              totalTime: "103 lectures (200 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c8,
      coursesName: "Introduction to SpringBoot (Full Stack)",
      joinNowLink: "https://youtu.be/5PdEmeopJVQ?si=2TmJ5wnRmxp5zfSt",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Free Code Camp Org",
              totalTime: "1 lectures (240 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
  {
      cover: c9,
      coursesName: "Full Stack Development With MERN",
      joinNowLink: "https://www.youtube.com/watch?v=fSmp7Cv-c_0&list=PLwGdqUZWnOp3t3qT7pvAznwUDzKbhEcCc&index=1&t=1s",
      courTeacher: [
          {
              dcover: avatar,
              name: "by Thapa Technical",
              totalTime: "43 lectures (190 hrs)",
          },
      ],
      priceAll: "FREE",
      pricePer: "FREE",
  },
];

export const footerLists = [
  {
      title: 'Services',
      items: [
          { name: '1on1 Coaching', href: '#' },
          { name: 'Company Review', href: '#' },
          { name: 'Accounts Review', href: '#' },
          { name: 'HR Consulting', href: '#' },
          { name: 'SEO Optimisation', href: '#' }
      ]
  },
  {
      title: 'Company',
      items: [
          { name: 'About', href: '#' },
          { name: 'Meet the Team', href: '#' },
          { name: 'Accounts Review', href: '#' }
      ]
  },
  {
      title: 'Helpful Links',
      items: [
          { name: 'Contact', href: '#' },
          { name: 'FAQs', href: '#' },
          { name: 'Live Chat', href: '#' }
      ]
  },
  {
      title: 'Legal',
      items: [
          { name: 'Accessibility', href: '#' },
          { name: 'Returns Policy', href: '#' },
          { name: 'Refund Policy', href: '#' },
          { name: 'Hiring Statistics', href: '#' }
      ]
  },
  {
      title: 'Downloads',
      items: [
          { name: 'Marketing Calendar', href: '#' },
          { name: 'SEO Infographics', href: '#' }
      ]
  }
];

export interface tabsType {
  text: string;
  // icon: ReactElement;
  path: string;
}

export const tabs: tabsType[] = [
  {
    text: "Home",
    // icon: <CiHome />,
    path: "home"
  },
  {
    text: "About Us",
    // icon: <MdOutlineAccountCircle />,
    path: "aboutus"
  },
  {
    text: "Contact Us",
    // icon: <AiOutlineContacts />,
    path: "contactus"
  }
];