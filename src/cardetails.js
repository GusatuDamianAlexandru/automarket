import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lfuuugjqorontaiuckrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXV1Z2pxb3JvbnRhaXVja3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODI3NTcsImV4cCI6MjA2NjE1ODc1N30.Vl--OFaKxcmJsYpWCXFNaJvcZPgbzoR1_r0ZqG8q6p4'
);

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
      if (error) {
        console.error('Eroare:', error);
      } else {
        setCar(data);
      }
    };

    fetchCar();
  }, [id]);

  if (!car) return <div className="p-6 text-center">Se încarcă detaliile anunțului...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{car.brand} {car.model}</h1>
      {car.images?.[0] && <img src={car.images[0]} alt={car.model} className="w-full max-w-md mb-4 rounded-xl" />}
      <p><strong>Preț:</strong> {car.price} €</p>
      <p><strong>An:</strong> {car.year}</p>
      <p><strong>Kilometri:</strong> {car.mileage} km</p>
      <p><strong>Combustibil:</strong> {car.fuel}</p>
      <p><strong>Transmisie:</strong> {car.transmission}</p>
      <p><strong>Locație:</strong> {car.location}</p>
      <p><strong>Descriere:</strong> {car.description}</p>
      <p><strong>Vânzător:</strong> {car.seller}</p>
      <p><strong>Telefon:</strong> {car.phone}</p>
      <p><strong>Email:</strong> {car.email}</p>
    </div>
  );
};

export default CarDetail;
