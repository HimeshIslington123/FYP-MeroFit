import gym from "../assets/gymImage.jpg";
import cardio from "../assets/cardio.webp";
import swimming from "../assets/swimming.jpg";
import sauna from "../assets/sauna.jpg";
const offerDetails = [
  {
    id: 1,
    title: "GYM",
    desc: "Our gym is equipped with modern equipment and certified trainers to help you achieve your goals.",
    paragraph: `Whether you're a beginner or advanced, our gym provides all the tools you need to stay fit and healthy. 
    We focus on functional training, strength development, and flexibility. With personalized workout plans, you’ll get guidance tailored to your body type and fitness goals. 
    Our certified trainers are always available to motivate and correct your form, ensuring safety and effectiveness every session. 
    Enjoy a friendly, encouraging environment where every member can push their limits and achieve sustainable results.`,
    image: gym,
    pricing: {
      daily: "Rs. 300",
      weekly: "Rs. 1,200",
      monthly: "Rs. 3,000",
      yearly: "Rs. 25,000",
    },
    features: [
      "Certified personal trainers",
      "Free protein shake for new members",
      "Fitness assessment & body analysis",
      "Locker & shower facility",
      "Free first training session",
    ],
  },
  {
    id: 2,
    title: "CARDIO",
    desc: "Improve your heart health with our cardio section featuring treadmills, bikes, and rowing machines.",
    paragraph: `Our cardio program is designed to boost your endurance, burn calories, and improve overall cardiovascular health. 
    We offer a variety of cardio equipment including treadmills, stationary bikes, elliptical trainers, and rowing machines. 
    Group classes are available to keep you motivated and make workouts fun. 
    Monitoring your heart rate and tracking progress is easy, helping you stay on top of your fitness goals. 
    Cardio training with us is not just about losing weight, but also about building stamina and improving your overall well-being.`,
    image: cardio,
    pricing: {
      daily: "Rs. 250",
      weekly: "Rs. 1,000",
      monthly: "Rs. 2,800",
      yearly: "Rs. 22,000",
    },
    features: [
      "State-of-the-art cardio equipment",
      "Personalized training plans",
      "Heart rate monitoring",
      "Group cardio classes",
      "Motivational programs",
    ],
  },
  {
    id: 3,
    title: "SAUNA",
    desc: "Relax and detoxify your body in our clean and comfortable sauna rooms.",
    paragraph: `Sauna sessions help reduce stress, improve circulation, and rejuvenate your body after intense workouts. 
    Our sauna rooms are designed for comfort, with controlled temperatures and hygiene standards that ensure a safe experience. 
    Regular sauna use can help flush toxins, relax muscles, and improve skin health. 
    It’s the perfect way to unwind, recharge, and support recovery after exercise. 
    Enjoy a calm, peaceful atmosphere that promotes mental relaxation as well as physical detoxification.`,
    image: sauna,
    pricing: {
      daily: "Rs. 400",
      weekly: "Rs. 1,500",
      monthly: "Rs. 3,500",
      yearly: "Rs. 28,000",
    },
    features: [
      "Detoxifying sauna rooms",
      "Clean & hygienic environment",
      "Relaxation and stress relief",
      "Temperature-controlled sessions",
      "Complimentary towels",
    ],
  },
  {
    id: 4,
    title: "SWIMMING",
    desc: "Enjoy a refreshing swim in our temperature-controlled indoor pool.",
    paragraph: `Swimming is a full-body workout that improves cardiovascular fitness, strength, and flexibility. 
    Our indoor pools are temperature-controlled and maintained to the highest hygiene standards. 
    Whether you are learning to swim, improving techniques, or just swimming for leisure, our instructors provide guidance for all skill levels. 
    Swimming is gentle on joints and perfect for people of all ages. 
    Group sessions and classes are available to make it social and fun, while also providing structured training for performance improvement.`,
    image: swimming,
    pricing: {
      daily: "Rs. 350",
      weekly: "Rs. 1,300",
      monthly: "Rs. 3,200",
      yearly: "Rs. 26,000",
    },
    features: [
      "Indoor temperature-controlled pool",
      "Swimming lessons available",
      "Life jackets and safety equipment",
      "Clean water maintained daily",
      "Fun group swim sessions",
    ],
  },
];
export default offerDetails;