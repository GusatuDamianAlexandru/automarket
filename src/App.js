import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Star, Filter, Heart, Car, Menu, X, ChevronDown, Zap, Shield, Users, TrendingUp, Plus, Camera } from 'lucide-react';
import './App.css';

const AutoMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [favorites, setFavorites] = useState(new Set());
  const [filteredCars, setFilteredCars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [cars, setCars] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Configurația Cloudinary din variabilele de mediu
  const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'duyauqek6';
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'automarket_preset';

  // Starea formularului pentru adăugare anunț
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel: 'Benzină',
    transmission: 'Manuală',
    location: '',
    description: '',
    seller: '',
    phone: '',
    email: '',
    images: []
  });

  const brands = ['BMW', 'Audi', 'Mercedes', 'Volkswagen', 'Toyota', 'Ford', 'Skoda', 'Renault', 'Peugeot', 'Opel'];

  // Inițializare cars cu datele demonstrative
  useEffect(() => {
    // Date demonstrative pentru mașini
    const initialCars = [
      {
        id: 1,
        brand: 'BMW',
        model: 'Seria 3',
        year: 2020,
        price: 35000,
        mileage: 45000,
        fuel: 'Diesel',
        transmission: 'Automată',
        location: 'București',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop'],
        rating: 4.8,
        seller: 'AutoDealer Pro',
        phone: '+40 721 123 456',
        email: 'contact@autodealer.ro',
        description: 'BMW Seria 3 în stare excelentă, service complet, proprietar unic.',
        verified: true,
        featured: true
      },
      {
        id: 2,
        brand: 'Audi',
        model: 'A4',
        year: 2019,
        price: 28000,
        mileage: 62000,
        fuel: 'Benzină',
        transmission: 'Manuală',
        location: 'Cluj-Napoca',
        images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop'],
        rating: 4.6,
        seller: 'Marius Popescu',
        phone: '+40 722 987 654',
        email: 'marius@email.com',
        description: 'Audi A4 îngrijită, toate reviziiile la zi, dotări premium.',
        verified: true,
        featured: false
      },
      {
        id: 3,
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2021,
        price: 42000,
        mileage: 28000,
        fuel: 'Diesel',
        transmission: 'Automată',
        location: 'Timișoara',
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'],
        rating: 4.9,
        seller: 'Premium Cars',
        phone: '+40 723 456 789',
        email: 'info@premiumcars.ro',
        description: 'Mercedes C-Class aproape nou, garanție extinsă, full options.',
        verified: true,
        featured: true
      },
      {
        id: 4,
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2018,
        price: 18500,
        mileage: 78000,
        fuel: 'Benzină',
        transmission: 'Manuală',
        location: 'Iași',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop'],
        rating: 4.3,
        seller: 'Ana Gheorghiu',
        phone: '+40 724 111 222',
        email: 'ana.gh@email.com',
        description: 'Volkswagen Golf fiabil, consumuri mici, perfectă pentru oraș.',
        verified: false,
        featured: false
      },
      {
        id: 5,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        price: 24000,
        mileage: 15000,
        fuel: 'Hybrid',
        transmission: 'Automată',
        location: 'Constanța',
        images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop'],
        rating: 4.7,
        seller: 'Toyota Center',
        phone: '+40 725 333 444',
        email: 'sales@toyota-center.ro',
        description: 'Toyota Corolla Hybrid, economie de combustibil excepțională.',
        verified: true,
        featured: false
      },
      {
        id: 6,
        brand: 'Ford',
        model: 'Focus',
        year: 2017,
        price: 14500,
        mileage: 95000,
        fuel: 'Diesel',
        transmission: 'Manuală',
        location: 'Brașov',
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop'],
        rating: 4.1,
        seller: 'Auto Focus SRL',
        phone: '+40 726 555 666',
        email: 'contact@autofocus.ro',
        description: 'Ford Focus în stare bună, ideal pentru deplasări lungi.',
        verified: true,
        featured: false
      }
    ];
    
    setCars(initialCars);
  }, []);

  useEffect(() => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === '' || car.brand === selectedBrand;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesYear = car.year >= yearRange[0] && car.year <= yearRange[1];
      
      return matchesSearch && matchesBrand && matchesPrice && matchesYear;
    });
    
    setFilteredCars(filtered);
  }, [searchTerm, selectedBrand, priceRange, yearRange, cars]);

  const toggleFavorite = (carId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ro-RO').format(price) + ' €';
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('ro-RO').format(mileage) + ' km';
  };

  // Funcție pentru upload imagini pe Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Handler pentru selectarea imaginilor
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (error) {
      alert('Eroare la încărcarea imaginilor. Te rog încearcă din nou.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handler pentru schimbarea valorilor din form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler pentru submiterea formularului
  const handleSubmitAd = (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('Te rog adaugă cel puțin o imagine!');
      return;
    }

    const newCar = {
      id: Date.now(),
      ...formData,
      price: parseInt(formData.price),
      mileage: parseInt(formData.mileage),
      year: parseInt(formData.year),
      rating: 4.0 + Math.random(), // Rating aleatoriu pentru demo
      verified: false,
      featured: false
    };

    setCars(prev => [newCar, ...prev]);
    
    // Reset form
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      fuel: 'Benzină',
      transmission: 'Manuală',
      location: '',
      description: '',
      seller: '',
      phone: '',
      email: '',
      images: []
    });
    
    setShowAddForm(false);
    alert('Anunțul a fost adăugat cu succes!');
  };

  // Funcție pentru ștergerea unei imagini
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const AddAdForm = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">🚗 Adaugă anunț nou</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmitAd} className="p-6 space-y-6">
          {/* Informații despre mașină */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              📋 Informații despre vehicul
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selectează marca</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: A4, Golf, Seria 3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anul fabricației *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preț (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="25000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraj *</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="50000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustibil</label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Benzină">Benzină</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="GPL">GPL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmisie</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Manuală">Manuală</option>
                  <option value="Automată">Automată</option>
                </select>
              </div>
            </div>
          </div>

          {/* Imagini */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              📸 Imagini vehicul
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
                disabled={uploadingImages}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploadingImages ? (
                  <div className="space-y-2">
                    <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="text-blue-600 font-medium">Se încarcă imaginile...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600">
                      <span className="font-medium text-blue-600">Selectează imagini</span> sau trage aici
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG până la 10MB fiecare</p>
                  </div>
                )}
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descriere și locație */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Locația *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="ex: București, Cluj-Napoca"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descriere *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Descrie vehiculul: starea tehnică, dotări, istoricul..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Informații contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              📞 Informații de contact
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nume/Companie *</label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleInputChange}
                required
                placeholder="Numele tău sau al companiei"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+40 721 123 456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="email@exemplu.ro"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Butoane */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={uploadingImages}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImages ? 'Se încarcă...' : '🚀 Publică anunțul'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const MobileCarCard = ({ car }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mx-4 mb-6 transform hover:scale-[1.02] transition-all duration-300">
      {car.featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 text-center">
          ⚡ FEATURED
        </div>
      )}
      
      <div className="relative">
        <img 
          src={car.images[0]} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <button
          onClick={() => toggleFavorite(car.id)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md ${
            favorites.has(car.id) 
              ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/25' 
              : 'bg-white/90 text-gray-700 shadow-lg'
          } hover:scale-110 transition-all duration-200`}
        >
          <Heart size={18} fill={favorites.has(car.id) ? 'white' : 'none'} />
        </button>
        
        {car.verified && (
          <div className="absolute top-3 left-3 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center">
            <Shield size={12} className="mr-1" />
            Verificat
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {car.brand} {car.model}
                </h3>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
                  <span className="text-sm font-medium text-gray-700">{car.rating?.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">{formatPrice(car.price)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Anul</div>
            <div className="text-sm font-semibold text-gray-900">{car.year}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Kilometri</div>
            <div className="text-sm font-semibold text-gray-900">{formatMileage(car.mileage)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Combustibil</div>
            <div className="text-sm font-semibold text-gray-900">{car.fuel}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Transmisie</div>
            <div className="text-sm font-semibold text-gray-900">{car.transmission}</div>
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{car.location}</span>
          <div className="ml-auto text-xs text-gray-500">{car.seller}</div>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{car.description}</p>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-600/25">
            <Phone size={16} className="mr-2" />
            Sună acum
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
            <Mail size={16} className="mr-2" />
            Mesaj
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoMarket
              </h1>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg">
            <nav className="px-4 py-3 space-y-2">
              <button className="block py-2 text-gray-700 hover:text-blue-600 font-medium w-full text-left">🏠 Acasă</button>
              <button className="block py-2 text-gray-700 hover:text-blue-600 font-medium w-full text-left">🔍 Căutare</button>
              <button className="block py-2 text-gray-700 hover:text-blue-600 font-medium w-full text-left">💰 Vinde</button>
              <button className="block py-2 text-gray-700 hover:text-blue-600 font-medium w-full text-left">📞 Contact</button>
              <button 
                onClick={() => {
                  setShowAddForm(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold"
              >
                ✨ Postează anunț GRATUIT
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            Găsește mașina<br />
            <span className="text-yellow-300">perfectă</span> pentru tine
          </h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed">
            Peste 10,000 de anunțuri verificate<br />
            de la dealeri și particulari din toată țara
          </p>
          
          {/* Stats - Mobile Layout */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
              <div className="text-lg font-bold">10K+</div>
              <div className="text-xs text-blue-100">Anunțuri</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
              <div className="text-lg font-bold">500+</div>
              <div className="text-xs text-blue-100">Dealeri</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
              <div className="text-lg font-bold">50K+</div>
              <div className="text-xs text-blue-100">Utilizatori</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-4 text-xs">
            <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
              <Shield size={12} className="mr-1" />
              Verificat
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
              <Zap size={12} className="mr-1" />
              Rapid
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
              <Users size={12} className="mr-1" />
              Securizat
            </div>
          </div>
        </div>
      </div>

      {/* BUTON ADAUGĂ ANUNȚ - POZIȚIONAT LA MIJLOCUL PAGINII */}
      <div className="px-4 -mt-6 relative z-10 mb-6">
        <div className="text-center mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
          >
            <Plus size={24} className="mr-2" />
            🚗 Adaugă anunț GRATUIT
          </button>
          <p className="text-gray-600 text-sm mt-2">Publică gratuit și găsește cumpărătorul în câteva zile!</p>
        </div>

        {/* Mobile Search */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută BMW, Audi, Mercedes..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl text-gray-700 font-medium"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              Filtre avansate
            </div>
            <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">🚗 Toate mărcile</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Preț: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 An fabricație: {yearRange[0]} - {yearRange[1]}
                </label>
                <input
                  type="range"
                  min="2000"
                  max="2024"
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            🎯 {filteredCars.length} rezultate
          </h3>
          {filteredCars.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp size={16} className="mr-1" />
              Actualizat acum
            </div>
          )}
        </div>
      </div>

      {/* Car Listings - Mobile Optimized */}
      <div className="pb-6">
        {filteredCars.map(car => (
          <MobileCarCard key={car.id} car={car} />
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Car className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Niciun rezultat găsit</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Nu am găsit mașini care să corespundă<br />
            criteriilor tale de căutare.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedBrand('');
              setPriceRange([0, 100000]);
              setYearRange([2000, 2024]);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Resetează filtrele
          </button>
        </div>
      )}

      {/* Modal pentru adăugare anunț */}
      {showAddForm && <AddAdForm />}

      {/* Mobile CTA Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 mx-4 rounded-2xl mb-6">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">Vrei să-ți vinzi mașina?</h3>
          <p className="text-blue-100 text-sm mb-4">
            Postează gratuit anunțul și găsește cumpărătorul perfect în câteva zile!
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            🚀 Postează GRATUIT acum
          </button>
        </div>
      </div>

      {/* Mobile Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="px-4 py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AutoMarket
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platforma de încredere pentru cumpărarea<br />
              și vânzarea de automobile în România
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-blue-400">Servicii</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🔍 Căutare auto</li>
                <li>💰 Evaluare auto</li>
                <li>🛡️ Asigurare</li>
                <li>💳 Finanțare</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-blue-400">Suport</h4>
              <ul className="space-y-2 text-gray-400">
                <li>❓ Centru ajutor</li>
                <li>📋 Termeni</li>
                <li>🔒 Confidențialitate</li>
                <li>📞 Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <div className="flex justify-center space-x-4 mb-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Phone size={14} className="mr-1" />
                <span>+40 21 123 4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail size={14} className="mr-1" />
                <span>info@automarket.ro</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              &copy; 2024 AutoMarket. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AutoMarketplace;