import React from "react";
import "./Glitch.css";

function GlitchText({ text }) {
  return (
    <div className="glitch">
      {text.split("").map((char, index) => (
        <span key={index} data-char={char}>{char}</span>
      ))}
    </div>
  );
}

export default GlitchText;