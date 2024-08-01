import { useState, useEffect, ChangeEvent } from 'react';
import './create-event-form.css';

const CreateEventForm = () => {
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [description, setDescription] = useState(localStorage.getItem('description') || '');
  const [date, setDate] = useState(localStorage.getItem('date') || '');
  const [time, setTime] = useState(localStorage.getItem('time') || '');
  const [status, setStatus] = useState(localStorage.getItem('status') || 'รอจัดงาน');
  const [publish, setPublish] = useState(false);
  const [images, setImages] = useState<Array<string | null>>([null, null, null, null]);
  const [activeTab, setActiveTab] = useState('รายละเอียด');
  const [zones, setZones] = useState([
    { id: 1, name: 'โซนใบไม้เขียว', description: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR. SIT NEC VEL VULPUTATE AC LOREM CRAS.' },
    { id: 2, name: 'โซนใบไม้ส้ม', description: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR. SIT NEC VEL VULPUTATE AC LOREM CRAS.' },
  ]);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('images') || '[]');
    setImages(savedImages);
  }, []);

  const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleImageUpload = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
      localStorage.setItem('images', JSON.stringify(newImages));
    }
  };

  const handleSave = () => {
    localStorage.setItem('title', title);
    localStorage.setItem('description', description);
    localStorage.setItem('date', date);
    localStorage.setItem('time', time);
    localStorage.setItem('status', status);
    alert('Data saved locally');
  };

  return (
    <div className="create-new-event">
      <div className="header">
        <h1>งานทั้งหมด</h1>
      </div>
      <div className="sub-header">
        <h2 className="title">สร้างงานใหม่</h2>
        <div className="toggle-container">
          <label>
            <input
              className="slider"
              type="checkbox"
              checked={publish}
              readOnly
            />
            <span className="slider" />
          </label>
          <span className="toggle-text">ไม่เผยแพร่</span>
        </div>
        <button className="btn-cancel">ยกเลิก</button>
        <button className="btn-save" onClick={handleSave}>บันทึก</button>
      </div>
      <div className="nav-menu">
        <button 
          className={activeTab === 'รายละเอียด' ? 'active' : ''} 
          onClick={() => setActiveTab('รายละเอียด')}
        >
          รายละเอียด
        </button>
        <button 
          className={activeTab === 'โซน & ราคา' ? 'active' : ''} 
          onClick={() => setActiveTab('โซน & ราคา')}
        >
          โซน & ราคา
        </button>
      </div>
      {activeTab === 'รายละเอียด' && (
        <form>
          <div className="form-section">
            <label>ชื่องาน*</label>
            <input type="text" value={title} onChange={handleInputChange(setTitle)} />
          </div>
          <div className="form-section">
            <label>คำอธิบาย</label>
            <input type="text" value={description} onChange={handleInputChange(setDescription)} />
          </div>
          <div className="form-section">
            <label>วันจัดงาน*</label>
            <input type="date" value={date} onChange={handleInputChange(setDate)} />
            <label>เวลาจัดงาน</label>
            <input type="time" value={time} onChange={handleInputChange(setTime)} />
          </div>
          <div className="form-section">
            <label>สถานะ*</label>
            <select value={status} onChange={handleInputChange(setStatus)}>
              <option value="รอจัดงาน">รอจัดงาน</option>
              <option value="จัดงานสำเร็จ">จัดงานสำเร็จ</option>
            </select>
          </div>
          <div className="form-section">
            <label>ภาพประกอบ</label>
            {images.map((image, index) => (
              <div key={index} className="image-upload">
                <input type="file" onChange={handleImageUpload(index)} />
                {image && <img src={image} alt={`Upload ${index}`} />}
              </div>
            ))}
          </div>
          <div className="form-section">
            <button type="button" onClick={handleSave}>บันทึก</button>
          </div>
        </form>
      )}
      {activeTab === 'โซน & ราคา' && (
        <div>
          <div className="form-section">
            <label>เลือก ZONE GROUP</label>
            <input type="text" placeholder="ค้นหาบนคุณเอก" />
          </div>
          {zones.map(zone => (
            <div key={zone.id} className="zone-section">
              <div className="zone-header">
                <span>{zone.id}. {zone.name}</span>
                <span>{zone.description}</span>
              </div>
            </div>
          ))}
          <div className="form-section">
            <button type="button" onClick={handleSave}>บันทึก</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventForm;
