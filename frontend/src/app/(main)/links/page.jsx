'use client'
import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
 const Links = () => {
  return (
    <section className="bg-neutral-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          heading="About"
          subheading="Learn what we do here"
          imgSrc="https://imgs.search.brave.com/p9F0BVBz9DtaXUA8y4zrShQsgMbDSfRJDW7S5ItE73M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3VzYW5ncmVlbmVj/b3B5d3JpdGVyLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/My8wMS9wZXhlbHMt/cGhvdG8tMzgxMTA4/Mi5qcGVn"
          href="/"
        />
        <Link
          heading="Competition"
          subheading="We work with great people"
          imgSrc="https://imgs.search.brave.com/WB8_MgGQFUTV1984mb12KZN99QmD3SaenSDU-fUBWBU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yZW5k/ZXIuZmluZWFydGFt/ZXJpY2EuY29tL2lt/YWdlcy9yZW5kZXJl/ZC9tZWRpdW0vcG9z/dGVyLzgvNS41L2Jy/ZWFrL2ltYWdlcy9h/cnR3b3JraW1hZ2Vz/L21lZGl1bS8zL3By/ZW1pdW0tY2hhbXBp/b24tZ29sZGVuLXRy/b3BoeS1wbGFjZWQt/b24td29vZGVuLXRh/YmxlLW4tYWtrYXNo/LmpwZw"
          href="/competition"
        />
        <Link
          heading="Blogs"
          subheading="Our work speaks for itself"
          imgSrc="https://imgs.search.brave.com/7uMja7fpEGmIHs7OzavFCzJtrojSOPUo2pxLGy326-A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHVic3BvdC5jb20v/aHViZnMvaG93LXRo/ZS1ibG9nLXRlYW0t/Y29tZXMtdXAtd2l0/aC1pZGVhc19mZWF0/dXJlZC53ZWJw"
          href="/listblog"
        />

      </div>
    </section>
  );
};

const Link = ({ heading, imgSrc, subheading, href }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-10 block text-4xl font-bold text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 md:text-6xl"
        >
          {heading.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: "12.5deg" },
        }}
        transition={{ type: "spring" }}
        src={imgSrc}
        className="absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
        alt={`Image representing a link for ${heading}`}
      />

      <motion.div
        variants={{
          initial: {
            x: "25%",
            opacity: 0,
          },
          whileHover: {
            x: "0%",
            opacity: 1,
          },
        }}
        transition={{ type: "spring" }}
        className="relative z-10 p-4"
      >
        <FiArrowRight className="text-5xl text-neutral-50" />
      </motion.div>
    </motion.a>
  );
};
export default Links;