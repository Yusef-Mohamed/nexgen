export const DropTargetIndicator: React.FC<{
  position: "above" | "below" | "inside";
}> = ({ position }) => {
  if (position === "inside") {
    return (
      <div className="absolute inset-0 border-2 border-blue-400 rounded pointer-events-none" />
    );
  }
  return (
    <div
      className="absolute left-0 right-0 h-0.5 bg-blue-400 pointer-events-none"
      style={{
        top: position === "above" ? 0 : "auto",
        bottom: position === "below" ? 0 : "auto",
      }}
    />
  );
};
