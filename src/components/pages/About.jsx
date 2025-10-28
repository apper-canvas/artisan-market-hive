import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      title: "Authentic Craftsmanship",
      description: "Every product is handmade by skilled artisans using traditional techniques passed down through generations.",
      icon: "Palette"
    },
    {
      title: "Fair Trade",
      description: "We ensure fair compensation for all our artisan partners, supporting sustainable livelihoods and communities.",
      icon: "Heart"
    },
    {
      title: "Sustainable Materials",
      description: "We prioritize eco-friendly materials and processes, caring for both artisans and the environment.",
      icon: "Leaf"
    },
    {
      title: "Global Community",
      description: "Our marketplace connects talented artisans from over 50 countries with conscious consumers worldwide.",
      icon: "Globe"
    }
  ];

  const stats = [
    { number: "500+", label: "Artisan Partners" },
    { number: "50+", label: "Countries" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "25,000+", label: "Products Sold" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-surface via-white to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-800 mb-6">
                Our Story of{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Artisanal
                </span>{" "}
                Excellence
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Artisan Market was born from a simple belief: that handmade products carry the soul of their creators. 
                We connect passionate artisans with people who value authenticity, quality, and the stories behind beautiful objects.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=600&fit=crop"
                  alt="Artisan at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To preserve traditional craftsmanship while empowering artisans to thrive in the global marketplace. 
              We believe that every handmade product tells a story of dedication, skill, and cultural heritage that deserves to be celebrated.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={value.icon} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Growing Global Impact
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Together, we're building a community that values handmade quality and supports artisan livelihoods worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6">
              The Story Behind the Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Founded in 2019 by a team of travelers and craft enthusiasts, Artisan Market emerged from countless hours 
              spent in local workshops around the world. We witnessed the incredible skill of traditional artisans and 
              recognized the need for a platform that could fairly showcase and sell their work to a global audience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-gray-800">
                What Drives Us
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every purchase on our platform directly supports independent artisans and their families. 
                We've eliminated middlemen to ensure fair prices for creators while offering competitive 
                prices for customers who value authentic, handmade quality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment extends beyond commerce – we provide marketing support, photography assistance, 
                and business development resources to help artisans grow their craft into sustainable businesses.
              </p>
              <Button variant="primary" size="lg" asChild>
                <Link to="/shop">
                  Support Our Artisans
                  <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=600&fit=crop"
                  alt="Artisan crafting"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're looking for unique handmade products or want to support traditional craftsmanship, 
              you're part of a movement that values authenticity and human creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="xl" asChild>
                <Link to="/shop">
                  <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                  Explore Products
                </Link>
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <Link to="/contact">
                  <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;