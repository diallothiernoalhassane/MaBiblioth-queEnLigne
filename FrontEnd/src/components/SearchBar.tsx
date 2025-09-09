import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Category {
  _id: string;
  nom: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: string | null) => void;
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
}

const SearchBar = ({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory,
  searchQuery
}: SearchBarProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.form
        onSubmit={handleSearch}
        className="relative mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un livre..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Rechercher</span>
            <Search className="w-4 h-4 sm:hidden" />
          </Button>
        </div>
      </motion.form>

      <Button
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base"
      >
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
      </Button>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3">Catégorie</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === null}
                      onChange={() => onCategoryFilter(null)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm sm:text-base">Toutes les catégories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={selectedCategory === category._id}
                        onChange={(e) => {
                          onCategoryFilter(e.target.value);
                          setIsFiltersOpen(false);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm sm:text-base">{category.nom}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
