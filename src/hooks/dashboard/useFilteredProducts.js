import { useMemo } from 'react';

/**
 * Hook to filter products by category and search query
 * @param {Object} options - Filter options
 * @param {Array} options.products - Products array to filter
 * @param {string} options.categoryFilter - Category filter value
 * @param {string} options.searchQuery - Search query string
 */
export const useFilteredProducts = ({ products, categoryFilter, searchQuery }) => {
    const filteredProducts = useMemo(() => {
        const categoryFiltered =
            categoryFilter === 'all'
                ? products
                : products.filter((p) => p.category === categoryFilter);

        if (!searchQuery.trim()) {
            return categoryFiltered;
        }

        const q = searchQuery.toLowerCase();
        return categoryFiltered.filter((p) => {
            const name = (p.name || '').toLowerCase();
            const brand = (p.brand || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return name.includes(q) || brand.includes(q) || desc.includes(q);
        });
    }, [products, categoryFilter, searchQuery]);

    return {
        filteredProducts,
        count: filteredProducts.length,
        hasResults: filteredProducts.length > 0,
    };
};
