export const newArticleTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div>
            <h3 class="username">Hi There,</h3>
            <p>
                ${userName} just published a new article.
            </p>
        </div>
        <div class="button_cont">
            <a href=${url} target="_blank">Read Article</a>
        </div>
</body>

</html>`;

export const newCommentOnFavoritedArticlesTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div>
            <h3 class="username">Hi There,</h3>
            <p class="message">
                ${userName} just commented on an article you favorited
            </p>
        </div>
        <div class="button_cont">
            <a href=${url} target="_blank">View comment</a>
        </div>
</body>
</html>`;
