// Publications Loader - PRiME Lab Website
// Automatically loads and displays publications from JSON data

document.addEventListener('DOMContentLoaded', function() {
    loadPublications();
});

async function loadPublications() {
    try {
        const response = await fetch('publications-data.json');
        const publications = await response.json();
        
        displayPublications(publications);
        console.log(`Loaded ${publications.length} publications successfully!`);
    } catch (error) {
        console.error('Error loading publications:', error);
        displayErrorMessage();
    }
}

function displayPublications(publications) {
    const publicationsList = document.getElementById('publications-list');
    
    if (!publicationsList) {
        console.error('Publications list element not found');
        return;
    }
    
    // Clear loading spinner
    publicationsList.innerHTML = '';
    
    if (publications.length === 0) {
        publicationsList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No publications found.</p>';
        return;
    }
    
    // Sort publications by year (newest first)
    publications.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    
    // Group publications by year
    const publicationsByYear = {};
    publications.forEach(pub => {
        if (!publicationsByYear[pub.year]) {
            publicationsByYear[pub.year] = [];
        }
        publicationsByYear[pub.year].push(pub);
    });
    
    // Display publications grouped by year
    Object.keys(publicationsByYear).sort((a, b) => b - a).forEach(year => {
        const yearPubs = publicationsByYear[year];
        
        // Create year header
        const yearHeader = document.createElement('h3');
        yearHeader.className = 'publications-year-header';
        yearHeader.textContent = year;
        yearHeader.style.cssText = `
            font-size: 2rem;
            color: var(--primary-color);
            margin: 3rem 0 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid var(--secondary-color);
        `;
        publicationsList.appendChild(yearHeader);
        
        // Display publications for this year
        yearPubs.forEach((pub, index) => {
            const pubElement = createPublicationElement(pub, index);
            publicationsList.appendChild(pubElement);
        });
    });
}

function createPublicationElement(pub, index) {
    const pubDiv = document.createElement('div');
    pubDiv.className = 'publication-item';
    pubDiv.setAttribute('data-category', pub.category);
    pubDiv.setAttribute('data-aos', 'fade-up');
    pubDiv.setAttribute('data-aos-delay', Math.min(index * 50, 300));
    
    // Create category badge
    const categoryClass = getCategoryClass(pub.category);
    
    // Format citation
    const citation = formatCitation(pub);
    
    // Create DOI link if available
    const doiLink = pub.doi ? 
        `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer" style="color: var(--secondary-color); text-decoration: none;">
            <i class="fas fa-external-link-alt"></i> DOI
        </a>` : '';
    
    pubDiv.innerHTML = `
        <div class="publication-year">${pub.year}</div>
        <h3 class="publication-title">${pub.title}</h3>
        <p class="publication-journal">${citation}</p>
        <div class="publication-meta">
            <span class="publication-category ${categoryClass}">${pub.category}</span>
            ${pub.citations && pub.citations !== '0' ? `<span class="publication-citations"><i class="fas fa-quote-right"></i> ${pub.citations} citations</span>` : ''}
            ${doiLink}
        </div>
    `;
    
    return pubDiv;
}

function getCategoryClass(category) {
    const categoryMap = {
        'Ion Channels': 'category-ion-channels',
        'Peptides': 'category-peptides',
        'Pain Research': 'category-pain-research',
        'Drug Discovery': 'category-drug-discovery'
    };
    
    return categoryMap[category] || 'category-ion-channels';
}

function formatCitation(pub) {
    // Format: Journal. Volume:Pages
    let citation = `<em>${pub.journal}</em>`;
    
    if (pub.volume) {
        citation += `. ${pub.volume}`;
    }
    
    if (pub.pages) {
        citation += `:${pub.pages}`;
    }
    
    return citation;
}

function displayErrorMessage() {
    const publicationsList = document.getElementById('publications-list');
    if (publicationsList) {
        publicationsList.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-light); font-size: 1.2rem;">Failed to load publications.</p>
                <p style="color: var(--text-light);">Please check the publications-data.json file.</p>
            </div>
        `;
    }
}

// Publication Search Functionality (optional enhancement)
function setupPublicationSearch() {
    const searchInput = document.getElementById('publication-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const publications = document.querySelectorAll('.publication-item');
        
        publications.forEach(pub => {
            const title = pub.querySelector('.publication-title').textContent.toLowerCase();
            const authors = pub.querySelector('.publication-authors').textContent.toLowerCase();
            const journal = pub.querySelector('.publication-journal').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || authors.includes(searchTerm) || journal.includes(searchTerm)) {
                pub.style.display = 'block';
            } else {
                pub.style.display = 'none';
            }
        });
    });
}

// Initialize search if search input exists
setupPublicationSearch();