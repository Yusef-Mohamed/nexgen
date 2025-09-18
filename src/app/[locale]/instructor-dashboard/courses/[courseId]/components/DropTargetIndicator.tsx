export const DropTargetIndicator: React.FC<{
  position: "above" | "below" | "inside";
}> = ({ position }) => {
  if (position === "inside") {
    return (
      <div className="absolute inset-0 border-2 border-primary bg-primary/10 rounded-lg pointer-events-none z-10" />
    );
  }
  return (
    <div
      className="absolute left-0 right-0 h-1 bg-primary shadow-lg pointer-events-none z-10"
      style={{
        top: position === "above" ? "-2px" : "auto",
        bottom: position === "below" ? "-2px" : "auto",
      }}
    />
  );
};
