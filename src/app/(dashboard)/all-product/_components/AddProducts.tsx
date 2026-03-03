"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, Box } from "lucide-react";
import Image from "next/image";

const categories = [
  "NAD+",
  "MIC-B12",
  "Glutathione",
  "Vitamin C",
  "B-Complex",
  "Zinc",
];

type SizeOption = "Size Large" | "Size Medium" | "Size Small";

function AddProducts() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [whatYouGet, setWhatYouGet] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState<SizeOption>("Size Large");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes: SizeOption[] = ["Size Large", "Size Medium", "Size Small"];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setUploadedImages((prev) => [...prev, url]);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setUploadedImages((prev) => [...prev, url]);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <div className="px-6 py-3 flex items-center justify-between">
        <button className="text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[36px] leading-[120px] font-bold text-[#000000]">
          Add Product
        </h1>
        <button className="flex items-center justify-center gap-2 bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-5 h-12 transition-all duration-200 rounded-lg shadow-sm">
          Publish Product
          <Box size={16} />
        </button>
      </div>

      {/* Form Body */}
      <div className="bg-white min-h-screen px-6 py-6 max-w-full">
        {/* Product Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Type Product name here. . ."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Product Category */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Product Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-blue-400 transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="" disabled>
                Select
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Product Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type Product description here. . ."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
          />
        </div>

        {/* What will you get */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            What will you get
          </label>
          <textarea
            value={whatYouGet}
            onChange={(e) => setWhatYouGet(e.target.value)}
            placeholder="Type Product description here. . ."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
          />
        </div>

        {/* Product Price */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Product Price
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Type Product price here. . ."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Product Size */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Size
          </label>
          <div className="flex items-center gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  selectedSize === size
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Product Images */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload product images
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-colors ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-blue-300 bg-white hover:bg-blue-50"
            }`}
            style={{ minHeight: "180px" }}
          >
            {uploadedImages.length > 0 ? (
              <div className="flex flex-wrap gap-3 px-4 justify-center">
                {uploadedImages.map((src, i) => (
                  <Image
                    width={400}
                    height={400}
                    key={i}
                    src={src}
                    alt={`upload-${i}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                ))}
                <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg text-blue-400 text-2xl hover:bg-blue-50 transition-colors">
                  +
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Upload size={22} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-500">
                  Drag and drop image here, or click add image
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
