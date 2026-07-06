import Image from "next/image";

const tools = [
  { src: "/images/style/tools/tool-scissors.png", alt: "Professional hair scissors" },
  { src: "/images/style/tools/tool-comb.png", alt: "Salon cutting comb" },
  { src: "/images/style/tools/tool-clipper.png", alt: "Professional hair clipper" },
  { src: "/images/style/tools/tool-spray.png", alt: "Styling spray bottle" },
  { src: "/images/style/tools/tool-dryer.png", alt: "Professional hair dryer" },
  { src: "/images/style/tools/tool-brush.png", alt: "Colour brush and mixing bowl" },
];

export function StyleToolsSection() {
  return (
    <section className="st-tools-section" aria-label="Salon tools">
      <div className="st-container">
        <div className="st-tools-grid">
          {tools.map((tool) => (
            <div key={tool.alt} className="st-tools-item">
              <Image
                src={tool.src}
                alt={tool.alt}
                width={800}
                height={533}
                className="st-tools-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
