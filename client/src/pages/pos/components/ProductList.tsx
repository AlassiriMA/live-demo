import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface ProductListProps {
  books: Book[];
  isLoading: boolean;
  addToCart: (bookId: number) => void;
}

export default function ProductList({ books, isLoading, addToCart }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = ['All', ...new Set(books.map(book => book.category))];
  
  const filteredBooks = activeCategory && activeCategory !== 'All' 
    ? books.filter(book => book.category === activeCategory)
    : books;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden neu-bg shadow-neu">
            <div className="h-48 bg-gray-200">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant="outline"
            className={`neu-button ${activeCategory === category ? 'bg-[#6366F1] text-white hover:text-white' : 'text-gray-700'}`}
            onClick={() => setActiveCategory(category === 'All' ? null : category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-gray-500">Try changing your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden neu-bg shadow-neu h-full flex flex-col">
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4 relative">
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-medium text-gray-600">
                    {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="font-medium text-lg text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2 text-sm">{book.author}</p>
                  <div className="text-xs text-gray-500 mb-4">ISBN: {book.isbn}</div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-lg font-bold text-[#6366F1]">${book.price.toFixed(2)}</div>
                    <Button 
                      className="neu-button text-[#6366F1]"
                      onClick={() => addToCart(book.id)}
                      disabled={book.stock <= 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
