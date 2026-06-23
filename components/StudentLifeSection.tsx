import { motion } from 'framer-motion';

export default function StudentLifeSection() {
  const activities = [
    {
      title: 'Sports',
      description: 'Cricket, football, athletics and more — our grounds buzz with energy and competition.',
    },
    {
      title: 'Arts & Music',
      description: 'From choirs to theatre and visual arts, creativity thrives at La&nbsp;Martiniere.',
    },
    {
      title: 'Clubs & Societies',
      description: 'Debating, robotics, community service and student leadership programs for every passion.',
    },
  ];
  return (
    <section id="student-life" className="py-20 px-6 bg-navy relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-playfair text-4xl sm:text-5xl text-gold mb-8 text-center"
        >
          Student Life &amp; Activities
        </motion.h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-3">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.2 }}
              className="bg-navy/50 backdrop-blur-md border border-gold/20 rounded-xl p-6 flex flex-col"
            >
              <h3 className="font-playfair text-2xl text-gold mb-2">
                {activity.title}
              </h3>
              <p className="text-ivory/80 flex-1">
                {activity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}