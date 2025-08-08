import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Shield,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Heart,
  Stethoscope,
  Video,
  UserCheck,
  Bell,
  Activity
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Flash Animation Component
const FlashAnimation = ({ text, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start flash animation after initial delay
    const startTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? {
        opacity: [0, 1, 1],
        scale: [0.8, 1.1, 1],
      } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.6,
        times: [0, 0.3, 1],
        ease: "easeOut"
      }}
      className={`${className} inline-block`}
    >
      {text}
    </motion.span>
  );
};

// Orbiting Title Animation Component
const OrbitingTitleDisplay = () => {
  const titles = [
    "Online Consultation",
    "Patient Care",
    "Appointment Reminders",
    "Medical Dashboard"
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  useEffect(() => {
    // Each title shows for 5 seconds (matching the 20-second orbit cycle / 4 titles)
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 h-8 flex items-center justify-center">
      {titles.map((title, index) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: currentTitleIndex === index ? 1 : 0,
            y: currentTitleIndex === index ? 0 : 10
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="absolute text-sm sm:text-base font-semibold text-gray-700 whitespace-nowrap"
        >
          {title}
        </motion.div>
      ))}
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ onOpenAppointment }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/stethoscope.jpg"
          alt="Medical Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback gradient background if image doesn't exist
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%)';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-white/90 to-teal-400/30"></div>
      </div>

      {/* Animated Background Icons */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Floating Medical Icons */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 opacity-10"
        >
          <Stethoscope className="w-16 h-16 text-blue-600" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 opacity-10"
        >
          <Heart className="w-12 h-12 text-red-500" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-20 opacity-10"
        >
          <Shield className="w-14 h-14 text-green-500" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 12, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 right-10 opacity-10"
        >
          <Calendar className="w-10 h-10 text-purple-500" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            x: [0, -3, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-60 left-1/3 opacity-10"
        >
          <Clock className="w-8 h-8 text-orange-500" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
              >
                <FlashAnimation
                  text="Your Health, "
                  className="inline-block"
                  delay={300}
                />
                <FlashAnimation
                  text="Our Priority"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 inline-block"
                  delay={600}
                />
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl text-black mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                <FlashAnimation
                  text="Book medical appointments instantly with trusted healthcare professionals. Fast, secure, and convenient healthcare scheduling at your fingertips."
                  className="inline-block"
                  delay={900}
                />
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12"
              >
                <button
                  onClick={onOpenAppointment}
                  className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* <button className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Us
                </button> */}
              </motion.div>

              {/* <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm sm:text-base"
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Expert Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600">Support</div>
                </div>
              </motion.div> */}
            </motion.div>

            {/* Right Content - Enhanced Visual Elements */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Main Visual Container */}
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Central Medical Icon with Pulse Animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto shadow-2xl"
                >
                  <Stethoscope className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 text-blue-600" />
                </motion.div>

                {/* Orbital Trail Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 opacity-20"
                >
                  <div className="absolute inset-4 border border-dashed border-blue-300 rounded-full"></div>
                </motion.div>

                {/* Orbiting Elements - Enhanced Fluid Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 orbit-container"
                >
                  <div className="relative w-full h-full">
                    {/* Online Consultation (orange) - Top position */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, -360, -720]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute -top-4 sm:-top-2 left-1/2 transform -translate-x-1/2 orbit-element"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <Video className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                      </motion.div>
                    </motion.div>

                    {/* Patient Care (red) - Right position */}
                    <motion.div
                      animate={{
                        x: [0, 8, 0],
                        rotate: [0, -360, -720]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute top-1/2 -right-4 sm:-right-2 transform -translate-y-1/2 orbit-element"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                      </motion.div>
                    </motion.div>

                    {/* Appointment Reminders (green) - Bottom position */}
                    <motion.div
                      animate={{
                        y: [0, 8, 0],
                        rotate: [0, -360, -720]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute -bottom-4 sm:-bottom-2 left-1/2 transform -translate-x-1/2 orbit-element"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      </motion.div>
                    </motion.div>

                    {/* Medical Dashboard (purple) - Left position */}
                    <motion.div
                      animate={{
                        x: [0, -8, 0],
                        rotate: [0, -360, -720]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute top-1/2 -left-4 sm:-left-2 transform -translate-y-1/2 orbit-element"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5
                        }}
                        className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Synchronized Title Display */}
                <OrbitingTitleDisplay />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments in just a few clicks with our intuitive calendar system."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere with round-the-clock support."
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Connect with certified healthcare professionals across various specialties."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security measures."
    }
  ];

  // return (
  //   // <section className="py-20 bg-white">
  //   //   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  //   //     <motion.div
  //   //       initial="hidden"
  //   //       whileInView="visible"
  //   //       viewport={{ once: true, margin: "-100px" }}
  //   //       variants={staggerContainer}
  //   //       className="text-center mb-16"
  //   //     >
  //   //       <motion.h2 
  //   //         variants={fadeInUp}
  //   //         className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
  //   //       >
  //   //         Why Choose Open Appointment?
  //   //       </motion.h2>
  //   //       <motion.p 
  //   //         variants={fadeInUp}
  //   //         className="text-lg text-gray-600 max-w-3xl mx-auto"
  //   //       >
  //   //         Experience healthcare like never before with our comprehensive platform designed 
  //   //         to make medical care accessible, convenient, and reliable.
  //   //       </motion.p>
  //   //     </motion.div>
        
  //   //     <motion.div
  //   //       initial="hidden"
  //   //       whileInView="visible"
  //   //       viewport={{ once: true, margin: "-100px" }}
  //   //       variants={staggerContainer}
  //   //       className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
  //   //     >
  //   //       {features.map((feature, index) => (
  //   //         <motion.div
  //   //           key={index}
  //   //           variants={fadeInUp}
  //   //           className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
  //   //         >
  //   //           <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
  //   //             <feature.icon className="w-8 h-8 text-white" />
  //   //           </div>
  //   //           <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
  //   //           <p className="text-gray-600">{feature.description}</p>
  //   //         </motion.div>
  //   //       ))}
  //   //     </motion.div>
  //   //   </div>
  //   // </section>
  // );
};

// How It Works Section Component
const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Choose Your Doctor",
      description: "Browse through our network of certified healthcare professionals and select the right specialist for your needs."
    },
    {
      step: "2",
      title: "Book Appointment",
      description: "Select your preferred date and time slot. Our real-time calendar shows available appointments instantly."
    },
    {
      step: "3",
      title: "Get Treatment",
      description: "Attend your appointment either in-person or via video consultation. Receive quality healthcare on your terms."
    }
  ];

  // return (
  //   <section className="py-20 bg-gray-50">
  //     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  //       <motion.div
  //         initial="hidden"
  //         whileInView="visible"
  //         viewport={{ once: true, margin: "-100px" }}
  //         variants={staggerContainer}
  //         className="text-center mb-16"
  //       >
  //         <motion.h2
  //           variants={fadeInUp}
  //           className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
  //         >
  //           How It Works
  //         </motion.h2>
  //         <motion.p
  //           variants={fadeInUp}
  //           className="text-lg text-gray-600 max-w-3xl mx-auto"
  //         >
  //           Getting healthcare has never been easier. Follow these simple steps to book your appointment.
  //         </motion.p>
  //       </motion.div>

  //       <motion.div
  //         initial="hidden"
  //         whileInView="visible"
  //         viewport={{ once: true, margin: "-100px" }}
  //         variants={staggerContainer}
  //         className="grid md:grid-cols-3 gap-8"
  //       >
  //         {steps.map((step, index) => (
  //           <motion.div
  //             key={index}
  //             variants={fadeInUp}
  //             className="text-center relative"
  //           >
  //             <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
  //               {step.step}
  //             </div>
  //             <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
  //             <p className="text-gray-600">{step.description}</p>

  //             {/* Connecting line */}
  //             {index < steps.length - 1 && (
  //               <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 transform translate-x-8"></div>
  //             )}
  //           </motion.div>
  //         ))}
  //       </motion.div>
  //     </div>
  //   </section>
  // );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "Open Appointment made booking my consultation so easy. The interface is intuitive and the doctors are professional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "I love the convenience of video consultations. No more waiting rooms or travel time. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Patient",
      content: "The 24/7 support and easy rescheduling options make this platform stand out. Great experience overall.",
      rating: 5
    }
  ];

  // return (
  //   <section className="py-20 bg-white">
  //     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  //       <motion.div
  //         initial="hidden"
  //         whileInView="visible"
  //         viewport={{ once: true, margin: "-100px" }}
  //         variants={staggerContainer}
  //         className="text-center mb-16"
  //       >
  //         <motion.h2
  //           variants={fadeInUp}
  //           className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
  //         >
  //           What Our Patients Say
  //         </motion.h2>
  //         <motion.p
  //           variants={fadeInUp}
  //           className="text-lg text-gray-600 max-w-3xl mx-auto"
  //         >
  //           Don't just take our word for it. Here's what our patients have to say about their experience.
  //         </motion.p>
  //       </motion.div>

  //       <motion.div
  //         initial="hidden"
  //         whileInView="visible"
  //         viewport={{ once: true, margin: "-100px" }}
  //         variants={staggerContainer}
  //         className="grid md:grid-cols-3 gap-8"
  //       >
  //         {testimonials.map((testimonial, index) => (
  //           <motion.div
  //             key={index}
  //             variants={fadeInUp}
  //             className="bg-gray-50 p-6 rounded-xl"
  //           >
  //             <div className="flex mb-4">
  //               {[...Array(testimonial.rating)].map((_, i) => (
  //                 <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
  //               ))}
  //             </div>
  //             <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
  //             <div>
  //               <div className="font-semibold text-gray-900">{testimonial.name}</div>
  //               <div className="text-sm text-gray-500">{testimonial.role}</div>
  //             </div>
  //           </motion.div>
  //         ))}
  //       </motion.div>
  //     </div>
  //   </section>
  // );
};

// CTA Section Component
const CTASection = ({ onOpenAppointment }) => {
  // return (
  //   <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
  //     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  //       <motion.div
  //         initial="hidden"
  //         whileInView="visible"
  //         viewport={{ once: true, margin: "-100px" }}
  //         variants={staggerContainer}
  //         className="text-center"
  //       >
  //         <motion.h2
  //           variants={fadeInUp}
  //           className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
  //         >
  //           Ready to Get Started?
  //         </motion.h2>
  //         <motion.p
  //           variants={fadeInUp}
  //           className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto"
  //         >
  //           Join thousands of patients who trust Open Appointment for their healthcare needs.
  //           Book your first appointment today and experience the difference.
  //         </motion.p>
  //         <motion.button
  //           variants={fadeInUp}
  //           onClick={onOpenAppointment}
  //           className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto"
  //         >
  //           Open Appointment Now
  //           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  //         </motion.button>
  //       </motion.div>
  //     </div>
  //   </section>
  // );
};

export default function LandingPage({ onOpenAppointment }) {
  // Mobile layout fix - ensure proper rendering on initial mobile load
  useEffect(() => {
    const handleMobileLayoutFix = () => {
      // Force proper mobile viewport behavior
      if (window.innerWidth <= 768) {
        // Set CSS custom properties for mobile viewport
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

        // Force reflow to ensure proper layout calculation
        document.body.style.width = '100%';
        document.body.style.maxWidth = '100%';
        document.body.style.overflowX = 'hidden';

        // Trigger resize event to force layout recalculation
        window.dispatchEvent(new Event('resize'));
      }
    };

    // Run immediately
    handleMobileLayoutFix();

    // Run after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(handleMobileLayoutFix, 100);

    // Handle orientation changes
    const handleOrientationChange = () => {
      setTimeout(handleMobileLayoutFix, 150);
    };

    // Add event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleMobileLayoutFix);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleMobileLayoutFix);
    };
  }, []);

  return (
    <div className="landing-page-container min-h-screen w-full max-w-full overflow-x-hidden">
      <HeroSection onOpenAppointment={onOpenAppointment} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection onOpenAppointment={onOpenAppointment} />
    </div>
  );
}
