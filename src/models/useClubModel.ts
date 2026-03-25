import { useState } from 'react';
import { ClubItem } from '@/interfaces/club';

export default () => {
  const [clubs, setClubs] = useState<ClubItem[]>([
    {
      id: '1',
      name: 'CLB Lập trình PTIT',
      avatar: 'https://via.placeholder.com/50',
      foundingDate: '2023-01-01',
      description: '<p>Nơi chia sẻ kiến thức CNTT</p>',
      leader: 'Nguyễn Văn A',
      isActive: true,
    },
  ]);

  const addClub = (item: ClubItem) => setClubs([...clubs, { ...item, id: Date.now().toString() }]);
  
  const editClub = (id: string, updatedItem: ClubItem) => {
    setClubs(clubs.map((c) => (c.id === id ? { ...updatedItem, id } : c)));
  };

  const deleteClub = (id: string) => setClubs(clubs.filter((c) => c.id !== id));

  return { clubs, addClub, editClub, deleteClub };
};