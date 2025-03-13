import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'motion/react';
import { AppContext } from '../context/AppContext';

const Result = () => {
  const [loading, setLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState(assets.sample_img_2);
  const [error, setError] = useState(''); // State for error message

  const {generateImage} = useContext(AppContext)

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true); // Clear previous error messages

    if (!inputValue) {
      const image = await generateImage(inputValue)
      if(image){
        setIsImageLoaded(true)
        setImage(image)
      }
    }

    setLoading(false);
    setIsImageLoaded(false);

    // Simulate async operation
    setTimeout(() => {
      setLoading(false);
      setIsImageLoaded(true);
      setImage(assets.sample_img_1); // Simulate generating a new image
      console.log(`Input Value: ${inputValue}`);
    }, 6000);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileHover={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col min-h-[90vh] justify-center items-center"
      onSubmit={handleSubmit}
    >
      <div>
        <div className="relative">
          <img
            className="max-w-sm rounded"
            src={image}
            alt="Sample"
            onLoad={() => setLoading(false)} // Stop loading when the image is loaded
          />
          <span
            className={`absolute h-1 bottom-0 left-0 bg-blue-500 ${
              loading ? 'w-full transition-all duration-[10s] rounded-full' : 'w-0'
            }`}
          />
        </div>
        {loading && <p>Loading...</p>}
      </div>

      {!isImageLoaded && (
        <div className="bg-neutral-500 w-full max-w-xl text-white rounded-full p-0.5 mt-10 text-sm flex flex-col items-center">
          <div className="w-full flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe what you want to generate"
              className="flex-1 ml-8 bg-transparent outline-none max-sm:w-20"
            />
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className={`bg-zinc-900 rounded-full px-10 sm:px-16 py-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Generate
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-2 text-white rounded-full p-0.5 mt-10 text-sm flex-wrap justify-center">
          <p
            onClick={() => setIsImageLoaded(false)}
            className="bg-transparent border-zinc-900 border px-8 py-3 rounded-full cursor-pointer text-black"
          >
            Generate Another
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer text-white"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
