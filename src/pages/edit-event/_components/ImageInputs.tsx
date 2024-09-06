import { ChangeEvent } from "react";
import useEditEventStore from "../_hook/useEditEventStore";

const LABELS = [
  "ภาพปก*",
  "ภาพประกอบ 1 (ไม่บังคับ)",
  "ภาพประกอบ 2 (ไม่บังคับ)",
  "ภาพประกอบ 3 (ไม่บังคับ)",
];

const ImageInputs = () => {
  const { images, setImages, removeImage } = useEditEventStore();

  const handleImageUpload =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          setImages(index, base64Image); // Use Zustand to update the image
        };
        reader.readAsDataURL(file);
      }
    };

  const handleImageRemove = (index: number) => () => {
    removeImage(index); // Use Zustand to remove the image
  };

  return (
    <div className="form-section">
      <label>ภาพประกอบ</label>
      <div className="image-grid">
        {LABELS.map((title, index) => (
          <div key={index} className="image-upload-container">
            <span className="image-upload-title">{title}</span>
            <div className="image-upload-box">
              {images[index] && (
                <img src={images[index] as string} alt={`Upload ${index}`} />
              )}
            </div>
            <div className="upload-link-container">
              {images[index] ? (
                <>
                  <label className="image-upload-label">
                    <span className="image-upload-link">เปลี่ยนภาพ</span>
                    <input
                      type="file"
                      onChange={handleImageUpload(index)}
                      className="image-upload-input"
                    />
                  </label>
                  <span
                    className="image-remove-button"
                    onClick={handleImageRemove(index)}
                  >
                    ลบ
                  </span>
                </>
              ) : (
                <label className="image-upload-label">
                  <span className="image-upload-link">+ อัปโหลด</span>
                  <input
                    type="file"
                    onChange={handleImageUpload(index)}
                    className="image-upload-input"
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageInputs;
