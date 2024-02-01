"use client";
import React, { useState, useEffect } from "react";
import "@/styles/style.css";

const WebEditor = () => {
  const [elements, setElements] = useState([
    { id: 1, type: "text", left: 10, top: 10, content: "Text Element" },
    {
      id: 2,
      type: "image",
      left: 100,
      top: 50,
      imageUrl: "https://via.placeholder.com/50",
    },
  ]);

  const [editingElement, setEditingElement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Load saved elements from local storage on component mount
    const savedElements = JSON.parse(localStorage.getItem("savedElements"));
    if (savedElements) {
      setElements(savedElements);
    }
  }, []);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const elementIndex = elements.findIndex((element) => element.id === id);

    if (elementIndex !== -1) {
      const newElements = [...elements];
      newElements[elementIndex] = {
        ...newElements[elementIndex],
        left: e.clientX,
        top: e.clientY,
      };
      setElements(newElements);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddElement = (elementType) => {
    const newElements = [...elements];
    if (elementType === "text") {
      newElements.push({
        id: Date.now(),
        type: "text",
        left: 20,
        top: 20,
        content: "New Text",
      });
    } else if (elementType === "image") {
      newElements.push({
        id: Date.now(),
        type: "image",
        left: 20,
        top: 20,
        imageUrl: "https://via.placeholder.com/50",
      });
    }
    setElements(newElements);
  };

  const handleDeleteElement = (id) => {
    const updatedElements = elements.filter((element) => element.id !== id);
    setElements(updatedElements);
  };

  const handleEditElement = (id, content) => {
    const updatedElements = elements.map((element) =>
      element.id === id ? { ...element, content } : element
    );
    setElements(updatedElements);
    setEditingElement(null);
  };

  const handleAddImage = (id, imageUrl) => {
    const updatedElements = elements.map((element) =>
      element.id === id ? { ...element, imageUrl } : element
    );
    setElements(updatedElements);
    setEditingElement(null);
    setSelectedImage(null); // Reset selected image after updating the element
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSaveWebsite = () => {
    // Save current elements to local storage
    localStorage.setItem("savedElements", JSON.stringify(elements));
    alert("Website saved to local storage!");
  };

  const handleDownloadWebsite = () => {
    const websiteData = JSON.stringify(elements);
    const blob = new Blob([websiteData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "website.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      {/* Element Selector */}
      {/* <h3 className="heading">Website Bulder By Inderjeet Singh</h3> */}
      <h3>Toolbar</h3>
      <div className="buttonContainer">
        <div>
          <button className="btn" onClick={() => handleAddElement("text")}>
            Add Text
          </button>
          <button className="btn" onClick={() => handleAddElement("image")}>
            Add Image
          </button>
        </div>
        <div>
          <button className="btn save" onClick={handleSaveWebsite}>
            Save Website
          </button>
          <button className="btn download" onClick={handleDownloadWebsite}>
            Download Website
          </button>
        </div>
      </div>

      {/* Web Builder */}
      <h3>Website Edit Panel</h3>
      <div
        className="webBuilder"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            draggable
            onDragStart={(e) => handleDragStart(e, element.id)}
            className="element"
            style={{ left: element.left, top: element.top }}
            onClick={() => setEditingElement(element)}
          >
            {element.type === "text" ? (
              element.content
            ) : (
              <img
                src={element.imageUrl}
                alt="Image Element"
                className="img-element"
              />
            )}
            <span
              className="deleteIcon"
              onClick={() => handleDeleteElement(element.id)}
            >
              &#10006;
            </span>
          </div>
        ))}

        {/* Editing Overlay for Text Element */}
        {editingElement && editingElement.type === "text" && (
          <div
            className="textOverlay"
            style={{ left: editingElement.left, top: editingElement.top }}
          >
            <input
              type="text"
              value={editingElement.content}
              onChange={(e) =>
                handleEditElement(editingElement.id, e.target.value)
              }
              onBlur={() => setEditingElement(null)}
            />
          </div>
        )}

        {/* Editing Overlay for Image Element */}
        {editingElement && editingElement.type === "image" && (
          <div
            className="imageOverlay"
            style={{ left: editingElement.left, top: editingElement.top }}
          >
            <label htmlFor={`image-upload-${editingElement.id}`}>
              Upload Image:
            </label>
            <input
              type="file"
              id={`image-upload-${editingElement.id}`}
              accept="image/*"
              onChange={handleImageChange}
            />
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected Element"
                className="img-selected"
              />
            )}
            <button
              onClick={() => handleAddImage(editingElement.id, selectedImage)}
              className="btn-small"
            >
              Save
            </button>
            <button
              className="btn-small cancel"
              onClick={() => setEditingElement(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebEditor;
