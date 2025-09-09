import React from 'react';
import BookCard from './BookCard';
import { useNotification } from '../hooks/useNotification';
import NotificationToast from './NotificationToast';

interface Book {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  imageCouverture?: string;
  categorie?: {
    _id: string;
    nom: string;
  };
  categorieId?: {
    _id: string;
    nom: string;
  };
  dateAjout?: string;
}

interface BookCardWithNotificationProps {
  book: Book;
  onDownload?: (bookId: string) => void;
  isAuthenticated?: boolean;
}

const BookCardWithNotification: React.FC<BookCardWithNotificationProps> = ({ 
  book, 
  onDownload, 
  isAuthenticated = false 
}) => {
  const { notifications, removeNotification, showSuccess } = useNotification();

  return (
    <>
      <BookCard
        book={book}
        onDownload={onDownload}
        isAuthenticated={isAuthenticated}
        onShowNotification={showSuccess}
      />
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
};

export default BookCardWithNotification;
