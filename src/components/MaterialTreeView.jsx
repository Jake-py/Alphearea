import React, { useState } from "react";

function MaterialTreeView({ data }) {
  return (
    <ul className="ml-4">
      {Object.entries(data).map(([key, value]) => (
        <TreeNode key={key} name={key} value={value} />
      ))}
    </ul>
  );
}

function TreeNode({ name, value }) {
  const [open, setOpen] = useState(false);
  const isFolder = typeof value === "object" && !Array.isArray(value) && !value.files;

  return (
    <li>
      <div
        onClick={() => isFolder && setOpen(!open)}
        style={{
          cursor: isFolder ? "pointer" : "default",
          fontWeight: isFolder ? "bold" : "normal"
        }}
      >
        {isFolder ? (open ? "📂" : "📁") : "📄"} {name}
      </div>
      {isFolder && open && (
        <MaterialTreeView data={value} />
      )}
      {!isFolder && value.files && (
        <ul className="ml-6">
          {value.files.map((file, i) => (
            <li key={i} className="text-blue-600">
              📄 {file.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default MaterialTreeView;
