document.addEventListener('DOMContentLoaded', function() {
    // Check if marked is available
    if (typeof marked !== 'undefined') {
        // Blog posts configuration
        const blogPosts = [
            { title: 'Second Blog Post', file: 'posts/2-second-post.md' },
            { title: 'First Blog Post', file: 'posts/1-intro.md' },
        ];

        const blogContainer = document.getElementById('blog-posts');
        if (blogContainer) {
            blogPosts.forEach(post => {
                fetch(post.file)
                    .then(response => response.text())
                    .then(markdown => {
                        const postElement = document.createElement('div');
                        postElement.classList.add('blog-post');
                        postElement.innerHTML = `<h2>${post.title}</h2><div class="content">${marked.parse(markdown)}</div>`;
                        blogContainer.appendChild(postElement);
                    })
                    .catch(error => console.error('Error loading blog post:', error));
            });
        }
    } else {
        console.error('Marked library is not loaded.');
    }
});
