import "./styles/ServiceCard.css";

export default function ServiceCard({ title, description, img }) {
  return (
    <div className="service-card">
      <img src={img} alt={title} className="service-img" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
