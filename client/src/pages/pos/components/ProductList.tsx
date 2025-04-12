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
  
  // Create unique categories array without using Set to avoid TypeScript issues
  const allCategories = books.map(book => book.category);
  const uniqueCategories = ['All', ...allCategories.filter((category: string, index: number) => 
    allCategories.indexOf(category) === index
  )];
  
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
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categories
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueCategories.map(category => (
            <Button
              key={category}
              variant="outline"
              className={`rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveCategory(category === 'All' ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">No books found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any books that match your search criteria. Try adjusting your filters or search term.
          </p>
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
              <Card className="overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                <div className="h-48 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center p-4 relative">
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 dark:text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium ${
                    book.stock > 5 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : book.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {book.stock > 5 
                      ? `${book.stock} in stock` 
                      : book.stock > 0 
                        ? `Only ${book.stock} left` 
                        : 'Out of stock'
                    }
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">{book.category}</span>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-white mb-1 line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">by {book.author}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    ISBN: {book.isbn}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${book.price.toFixed(2)}</div>
                    <Button 
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        book.stock > 0 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => addToCart(book.id)}
                      disabled={book.stock <= 0}
                    >
                      {book.stock > 0 ? (
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Add to Cart</span>
                        </div>
                      ) : 'Out of Stock'}
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
