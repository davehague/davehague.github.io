class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Blog</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropbtn">Projects</a>
                            <div class="dropdown-content">
                                <a href="#">PromptBlocks</a>
                                <a href="#">Job Scraper</a>
                                <a href="#">Other Experiments</a>
                            </div>
                        </li>
                        <li><a href="#">About Me</a></li>
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
