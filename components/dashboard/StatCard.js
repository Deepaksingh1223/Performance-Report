import Card from "./Card";

export default function StatCard({
  title,
  subtitle,
  value,
  size = "lg",
  className = "",
}) {
  const sizes = {
    lg: "text-5xl sm:text-6xl",
    md: "text-3xl sm:text-4xl",
  };

  return (
    <Card title={title} subtitle={subtitle} className={className} bodyClassName="flex items-center justify-center">
      <p
        className={`py-2 text-center font-semibold leading-none tracking-tight tabular-nums text-white ${sizes[size]}`}
      >
        {value}
      </p>
    </Card>
  );
}
