class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <ul>
                        <li><a href="/index.html">Home</a></li>
                        <li><a href="/blog/index.html">Blog</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropbtn">Projects</a>
                            <div class="dropdown-content">
                                <a href="/projects/promptblocks/index.html">PromptBlocks</a>
                                <a href="/projects/jobscraper/index.html">Job Scraper</a>
                                <a href="/experiments/index.html">Other Experiments</a>
                            </div>
                        </li>
                        <li><a href="/about.html">About Me</a></li>
                    </ul>
                </nav>
            </header>
        `;
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2024 David Hague</p>
            </footer>
        `;
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
