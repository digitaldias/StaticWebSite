/**
 * Client-side search functionality
 * Uses fuzzy matching on search index JSON
 */

class SearchEngine {
    constructor() {
        this.index = null;
        this.resultsContainer = null;
        this.searchInput = null;
        this.debounceTimer = null;
    }

    async init() {
        this.searchInput = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        
        if (!this.searchInput || !this.resultsContainer) {
            return; // Not on search page
        }

        try {
            const response = await fetch('/search-index.json');
            this.index = await response.json();
            this.setupSearch();
        } catch (error) {
            console.error('Failed to load search index:', error);
            this.showError('Failed to load search index. Please refresh the page.');
        }
    }

    setupSearch() {
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.search(e.target.value);
            }, 300);
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.searchInput.value.trim()) {
                e.preventDefault();
                const firstResult = this.resultsContainer.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.querySelector('a').click();
                }
            }
        });
    }

    search(query) {
        const queryLower = query.trim().toLowerCase();
        
        if (!queryLower) {
            this.showPlaceholder();
            return;
        }

        if (!this.index || this.index.length === 0) {
            this.showError('No search index available.');
            return;
        }

        const results = this.index
            .map(item => ({
                ...item,
                score: this.calculateScore(item, queryLower)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);

        this.displayResults(results, queryLower);
    }

    calculateScore(item, query) {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const excerptLower = item.excerpt.toLowerCase();
        const tagsLower = item.tags.map(t => t.toLowerCase()).join(' ');
        const categoriesLower = item.categories.map(c => c.toLowerCase()).join(' ');

        // Title match (highest weight)
        if (titleLower.includes(query)) {
            score += 10;
            if (titleLower.startsWith(query)) {
                score += 5; // Bonus for starting with query
            }
        }

        // Tag match (high weight)
        if (tagsLower.includes(query)) {
            score += 8;
        }

        // Category match
        if (categoriesLower.includes(query)) {
            score += 6;
        }

        // Excerpt match (lower weight)
        if (excerptLower.includes(query)) {
            score += 3;
        }

        // Word-by-word matching
        const queryWords = query.split(/\s+/);
        queryWords.forEach(word => {
            if (word.length < 2) return;
            if (titleLower.includes(word)) score += 2;
            if (tagsLower.includes(word)) score += 1.5;
            if (excerptLower.includes(word)) score += 1;
        });

        return score;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
                    <p class="search-hint">Try different keywords or check spelling.</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(item => this.renderResult(item, query)).join('');
        this.resultsContainer.innerHTML = `
            <div class="search-results-header">
                <p>Found <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''}</p>
            </div>
            <div class="search-results-list">
                ${resultsHTML}
            </div>
        `;
    }

    renderResult(item, query) {
        const highlightedTitle = this.highlightText(item.title, query);
        const highlightedExcerpt = this.highlightText(item.excerpt, query);
        const tagsHTML = item.tags.map(tag => 
            `<span class="search-tag">#${this.escapeHtml(tag)}</span>`
        ).join(' ');

        return `
            <article class="search-result-item">
                <h3 class="search-result-title">
                    <a href="${item.url}">${highlightedTitle}</a>
                </h3>
                <p class="search-result-excerpt">${highlightedExcerpt}</p>
                <div class="search-result-meta">
                    <span class="search-result-date">${item.date}</span>
                    ${tagsHTML ? `<div class="search-result-tags">${tagsHTML}</div>` : ''}
                </div>
            </article>
        `;
    }

    highlightText(text, query) {
        const queryWords = query.split(/\s+/).filter(w => w.length > 0);
        let highlighted = this.escapeHtml(text);
        
        queryWords.forEach(word => {
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });

        return highlighted;
    }

    showPlaceholder() {
        this.resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <p>Type to search blog posts...</p>
            </div>
        `;
    }

    showError(message) {
        this.resultsContainer.innerHTML = `
            <div class="search-error">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const searchEngine = new SearchEngine();
        searchEngine.init();
    });
} else {
    const searchEngine = new SearchEngine();
    searchEngine.init();
}

